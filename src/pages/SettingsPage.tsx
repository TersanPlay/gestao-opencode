import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSettings, updateSettings } from "@/services/api";
import type { SettingsMap } from "@/types";
import { Save, Settings } from "lucide-react";
import { toast } from "sonner";

const FIELDS = [
  { key: "instituicao_nome", label: "Nome da Instituição", type: "text", placeholder: "Câmara Municipal" },
  { key: "logo_url", label: "URL da Logomarca", type: "text", placeholder: "https://..." },
  { key: "sessao_expiracao", label: "Expiração da Sessão (horas)", type: "number", placeholder: "8" },
  { key: "horario_abertura", label: "Horário de Abertura", type: "time", placeholder: "08:00" },
  { key: "horario_fechamento", label: "Horário de Fechamento", type: "time", placeholder: "18:00" },
];

export function SettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getSettings().then(setSettings); }, []);

  const set = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: { ...prev[key], value: val } }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      for (const f of FIELDS) payload[f.key] = settings[f.key]?.value || "";
      const result = await updateSettings(payload);
      setSettings(result);
      setDirty(false);
      toast.success("Configurações salvas");
    } catch { toast.error("Erro ao salvar"); }
    finally { setSaving(false); }
  };

  const notifActive = settings.notificacoes_ativas?.value === "true";

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h2>
          <p className="mt-1 text-sm text-muted-foreground">Parâmetros gerais do sistema</p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || saving} className="gap-2">
          <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" /> Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  type={f.type}
                  value={settings[f.key]?.value || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" /> Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Notificações do Sistema</Label>
              <Select
                value={notifActive ? "true" : "false"}
                onValueChange={(v) => set("notificacoes_ativas", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativadas</SelectItem>
                  <SelectItem value="false">Desativadas</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Última atualização: {settings.notificacoes_ativas?.updatedAt
                  ? new Date(settings.notificacoes_ativas.updatedAt).toLocaleString("pt-BR")
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
