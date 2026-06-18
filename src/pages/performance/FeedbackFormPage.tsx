import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { createFeedback } from "@/services/api";
import { toast } from "sonner";

export function FeedbackFormPage() {
  const navigate = useNavigate();
  const { colaboradorId } = useParams();
  const [tipo, setTipo] = useState("gestor");
  const [comentario, setComentario] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) { toast.error("Comentário é obrigatório"); return; }
    if (!colaboradorId) return;
    setSaving(true);
    try {
      await createFeedback({ colaboradorId, tipo, comentario });
      toast.success("Feedback registrado");
      navigate(`/performance/profiles/${colaboradorId}`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar feedback");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Novo Feedback" description="Registre um feedback para o colaborador" />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de feedback</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="tipo"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="autoavaliacao">Autoavaliação</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="colega">Colega</SelectItem>
                  <SelectItem value="liderado">Liderado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comentario">Comentário *</Label>
              <Textarea id="comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} rows={5} required />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" variant="indigo" disabled={saving}>{saving ? "Salvando..." : "Registrar Feedback"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
