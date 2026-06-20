import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSettings, testEmail, updateSettings } from "@/services/api";
import type { SettingsMap } from "@/types";
import { FileText, Loader2, Mail, Save, Send, Settings } from "lucide-react";
import { toast } from "sonner";

const FIELDS = [
  { key: "instituicao_nome", label: "Nome da Instituição", type: "text", placeholder: "Câmara Municipal" },
  { key: "logo_url", label: "URL da Logomarca", type: "text", placeholder: "https://..." },
  { key: "sessao_expiracao", label: "Expiração da Sessão (horas)", type: "number", placeholder: "8" },
  { key: "horario_abertura", label: "Horário de Abertura", type: "time", placeholder: "08:00" },
  { key: "horario_fechamento", label: "Horário de Fechamento", type: "time", placeholder: "18:00" },
];

const ALL_KEYS = [...FIELDS, { key: "notificacoes_ativas" }, { key: "email_notificacoes" },
  { key: "email_template_welcome" }, { key: "email_template_scheduled" }, { key: "email_template_checkin" },
  { key: "email_template_started" }, { key: "email_template_finished" }, { key: "email_template_cancelled" },
].map(f => f.key);

const TEMPLATES = [
  { key: "email_template_welcome", label: "Boas-vindas" },
  { key: "email_template_scheduled", label: "Visita Agendada" },
  { key: "email_template_checkin", label: "Check-in" },
  { key: "email_template_started", label: "Visita Iniciada" },
  { key: "email_template_finished", label: "Visita Finalizada" },
  { key: "email_template_cancelled", label: "Visita Cancelada" },
] as const;

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
      for (const key of ALL_KEYS) payload[key] = settings[key]?.value || "";
      const result = await updateSettings(payload);
      setSettings(result);
      setDirty(false);
      toast.success("Configurações salvas");
    } catch (err) { console.error(err); toast.error("Erro ao salvar"); }
    finally { setSaving(false); }
  };

  const notifActive = settings.notificacoes_ativas?.value === "true";
  const [testEmailAddr, setTestEmailAddr] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("email_template_welcome");

  function getTemplateParts(key: string) {
    const raw = settings[key]?.value;
    if (!raw) return { subject: "", body: "" };
    try {
      const parsed = JSON.parse(raw);
      return { subject: parsed.subject || "", body: parsed.body || "" };
    } catch { /* raw nao e JSON (ex: string plain) */ }
    return { subject: "", body: raw };
  }

  function setTemplateParts(key: string, subject: string, body: string) {
    set(key, JSON.stringify({ subject, body }));
  }

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
              <Select value={notifActive ? "true" : "false"} onValueChange={(v) => set("notificacoes_ativas", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativadas</SelectItem>
                  <SelectItem value="false">Desativadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notificações por Email</Label>
              <Select value={settings.email_notificacoes?.value || "false"} onValueChange={(v) => set("email_notificacoes", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativadas</SelectItem>
                  <SelectItem value="false">Desativadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" /> Teste de Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="testEmail">Enviar email de teste</Label>
              <div className="flex gap-2">
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmailAddr}
                  onChange={(e) => setTestEmailAddr(e.target.value)}
                  placeholder="email@exemplo.com"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!testEmailAddr || testingEmail}
                  onClick={async () => {
                    setTestingEmail(true);
                    try {
                      const res = await testEmail(testEmailAddr);
                      toast.success(res.message);
                    } catch (err) { console.error(err); toast.error("Falha ao enviar email"); }
                    finally { setTestingEmail(false); }
                  }}
                  className="gap-1 shrink-0"
                >
                  {testingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Testar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" /> Modelos de Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tmpl_subject">Assunto</Label>
              <Input id="tmpl_subject" value={getTemplateParts(selectedTemplate).subject} onChange={(e) => {
                const parts = getTemplateParts(selectedTemplate);
                setTemplateParts(selectedTemplate, e.target.value, parts.body);
              }} placeholder="Assunto do email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tmpl_body">Corpo (HTML)</Label>
              <Textarea id="tmpl_body" value={getTemplateParts(selectedTemplate).body} onChange={(e) => {
                const parts = getTemplateParts(selectedTemplate);
                setTemplateParts(selectedTemplate, parts.subject, e.target.value);
              }} rows={10} className="font-mono text-xs" placeholder="<p>Corpo do email em HTML</p>" />
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Variáveis disponíveis:</p>
              <code className="block bg-accent p-2 rounded text-xs mt-1 leading-relaxed">
                {'{{visitante_nome}} — Nome do visitante<br/>'}
                {'{{visitante_email}} — Email do visitante<br/>'}
                {'{{departamento_nome}} — Nome do departamento<br/>'}
                {'{{data}} — Data/hora do evento<br/>'}
                {'{{instituicao_nome}} — Nome da instituição<br/>'}
                {'{{responsavel_nome}} — Nome do responsável'}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
