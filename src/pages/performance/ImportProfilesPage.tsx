import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { importColaboradores } from "@/services/api";
import { Upload, FileSpreadsheet, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ImportColaborador, ImportResult } from "@/types";

function parseCSV(text: string): ImportColaborador[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) =>
    h.toLowerCase().replace(/\s+/g, "").replace(/[áàâãä]/g, "a").replace(/[éèêë]/g, "e").replace(/[íìîï]/g, "i").replace(/[óòôõö]/g, "o").replace(/[úùûü]/g, "u").replace(/[ç]/g, "c")
  );

  const colMap: Record<string, number> = {};
  const mapKeys = ["ano", "mes", "matricula", "cpf", "nome", "cargo", "lotacao", "funcao", "cargahorariasemanal", "vinculo", "datadeadmissao", "datadedemissao"];
  for (const key of mapKeys) {
    const idx = headers.indexOf(key);
    if (idx >= 0) colMap[key] = idx;
  }

  return lines.slice(1).map((line) => {
    const cols = parseLine(line);
    return {
      ano: colMap.ano !== undefined ? cols[colMap.ano] || "" : "",
      mes: colMap.mes !== undefined ? cols[colMap.mes] || "" : "",
      matricula: colMap.matricula !== undefined ? cols[colMap.matricula] || "" : "",
      cpf: colMap.cpf !== undefined ? cols[colMap.cpf] || "" : "",
      nome: colMap.nome !== undefined ? cols[colMap.nome] || "" : "",
      cargo: colMap.cargo !== undefined ? cols[colMap.cargo] || "" : "",
      lotacao: colMap.lotacao !== undefined ? cols[colMap.lotacao] || "" : "",
      funcao: colMap.funcao !== undefined ? cols[colMap.funcao] || "" : "",
      cargaHoraria: colMap.cargahorariasemanal !== undefined ? cols[colMap.cargahorariasemanal] || "" : "",
      vinculo: colMap.vinculo !== undefined ? cols[colMap.vinculo] || "" : "",
      dataAdmissao: colMap.datadeadmissao !== undefined ? cols[colMap.datadeadmissao] || "" : "",
      dataDesligamento: colMap.datadedemissao !== undefined ? cols[colMap.datadedemissao] || "" : "",
    };
  });
}

export function ImportProfilesPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dados, setDados] = useState<ImportColaborador[]>([]);
  const [arquivo, setArquivo] = useState<string>("");
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<ImportResult | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArquivo(file.name);
    setResultado(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setDados(parsed);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setImportando(true);
    setResultado(null);
    try {
      const res = await importColaboradores(dados);
      setResultado(res);
      toast.success(`${res.imported} colaboradores importados`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao importar");
    } finally {
      setImportando(false);
    }
  };

  const semNome = dados.filter((d) => !d.nome.trim()).length;
  const semMatricula = dados.filter((d) => !d.matricula.trim()).length;
  const validos = dados.length - semNome - semMatricula;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Importar Colaboradores"
        description="Carregue um arquivo CSV com os dados dos colaboradores"
        action={{
          label: "Voltar",
          icon: ArrowLeft,
          to: "/performance/profiles",
        }}
      />

      {!resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" />
              Upload do CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-10 text-center transition-colors hover:border-muted-foreground/40"
              onClick={() => fileRef.current?.click()}
            >
              <FileSpreadsheet className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {arquivo || "Clique para selecionar o arquivo CSV"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Colunas esperadas: Ano, Mês, Matrícula, CPF, Nome, Cargo, Lotação, Função, Carga Horária semanal, Vínculo, Data de Admissão, Data de Demissão
              </p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </CardContent>
        </Card>
      )}

      {dados.length > 0 && !resultado && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Badge variant="info">{dados.length} registros</Badge>
                <Badge variant={semNome > 0 ? "warning" : "success"}>{semNome > 0 ? `${semNome} sem nome` : "Nomes ok"}</Badge>
                <Badge variant={semMatricula > 0 ? "warning" : "success"}>{semMatricula > 0 ? `${semMatricula} sem matrícula` : "Matrículas ok"}</Badge>
                <Badge variant={validos === dados.length ? "success" : "warning"}>{validos} válidos</Badge>
              </div>

              <div className="max-h-80 overflow-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Lotação</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Vínculo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dados.slice(0, 50).map((d, i) => (
                      <TableRow key={i} className={!d.nome.trim() || !d.matricula.trim() ? "bg-destructive/10" : ""}>
                        <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-mono text-xs">{d.matricula}</TableCell>
                        <TableCell className="font-medium">{d.nome}</TableCell>
                        <TableCell>{d.cargo}</TableCell>
                        <TableCell>{d.lotacao}</TableCell>
                        <TableCell>{d.funcao}</TableCell>
                        <TableCell>{d.vinculo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {dados.length > 50 && (
                <p className="text-xs text-muted-foreground">Mostrando 50 de {dados.length} registros</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={handleImport} disabled={importando || validos === 0}>
                  {importando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {importando ? "Importando..." : `Importar ${validos} registros`}
                </Button>
                <Button variant="outline" onClick={() => { setDados([]); setArquivo(""); }}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Resultado da Importação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">{resultado.imported} importados</Badge>
              <Badge variant="warning">{resultado.skipped} pulados</Badge>
              <Badge variant="info">{resultado.departamentosCriados} departamentos criados</Badge>
              {resultado.errors.length > 0 && (
                <Badge variant="destructive">{resultado.errors.length} erros</Badge>
              )}
            </div>

            {resultado.errors.length > 0 && (
              <div className="max-h-48 overflow-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Linha</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultado.errors.map((err, i) => (
                      <TableRow key={i}>
                        <TableCell>{err.row}</TableCell>
                        <TableCell className="font-mono text-xs">{err.matricula}</TableCell>
                        <TableCell>{err.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button onClick={() => { setResultado(null); setDados([]); setArquivo(""); }}>
                Importar outro arquivo
              </Button>
              <Button variant="outline" onClick={() => navigate("/performance/profiles")}>
                Ver perfis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
