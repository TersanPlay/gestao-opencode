import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/PageHeader";
import { createVisitor, updateVisitor, getVisitorById, checkDisposableEmail } from "@/services/api";
import { ArrowLeft, Save, AlertTriangle, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function VisitorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(!!id);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    company: "",
    photo: "",
  });
  const [disposable, setDisposable] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const emailTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getVisitorById(id).then((v) => {
        if (v) {
          setForm({
            name: v.name,
            email: v.email,
            phone: v.phone,
            document: v.document,
            company: v.company || "",
            photo: v.photo || "",
          });
          setDisposable(v.isDisposable === 1);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_IMG_SIZE = 800;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande. Maximo 5MB.");
      return;
    }
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_IMG_SIZE || height > MAX_IMG_SIZE) {
        const ratio = Math.min(MAX_IMG_SIZE / width, MAX_IMG_SIZE / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      setForm({ ...form, photo: canvas.toDataURL("image/jpeg", 0.8) });
    };
    img.onerror = () => toast.error("Erro ao processar imagem");
    img.src = URL.createObjectURL(file);
  };

  const handleRemovePhoto = () => {
    setForm({ ...form, photo: "" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setForm({ ...form, email });
    setDisposable(false);
    if (emailTimer.current) clearTimeout(emailTimer.current);
    if (!email || !email.includes("@")) return;
    setCheckingEmail(true);
    emailTimer.current = setTimeout(async () => {
      try {
        const res = await checkDisposableEmail(email);
        setDisposable(res.disposable);
      } catch { /* ignore */ }
      setCheckingEmail(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      document: form.document,
      company: form.company || undefined,
      photo: form.photo || undefined,
    };
    if (isEditing) {
      await updateVisitor(id!, data);
      toast.success("Visitante atualizado");
    } else {
      await createVisitor(data);
      toast.success("Visitante registrado");
    }
    navigate("/visitors");
  };

  if (loading) return null;

  return (
    <div>
      <PageHeader title={isEditing ? "Editar Visitante" : "Registrar Visitante"} />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4 pb-2">
              <div className="relative">
                <Avatar name={form.name || "?"} src={form.photo || undefined} size="lg" />
              </div>
              <div className="flex flex-col gap-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
                  <Camera className="h-4 w-4" />
                  {form.photo ? "Alterar Foto" : "Adicionar Foto"}
                </Button>
                {form.photo && (
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemovePhoto} className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Remover Foto
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP. Max 5MB. Redimensionado para 800px.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do visitante" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleEmailChange}
                    placeholder="email@exemplo.com"
                    className={disposable ? "border-red-500 pr-10" : ""}
                  />
                  {disposable && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 group">
                      <AlertTriangle className="h-4 w-4 text-red-500 cursor-help" />
                      <div className="absolute right-0 top-6 z-10 hidden w-64 rounded-md border bg-popover p-3 text-xs text-popover-foreground shadow-md group-hover:block">
                        Email descartável detectado. Este tipo de email é temporário e pode indicar baixa confiabilidade.
                      </div>
                    </div>
                  )}
                </div>
                {disposable && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3" />
                    Email descartável — recomenda-se usar um email permanente
                  </p>
                )}
                {checkingEmail && form.email.includes("@") && (
                  <p className="text-xs text-muted-foreground mt-1">Verificando email...</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-0000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">Documento</Label>
                <Input id="document" value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} placeholder="CPF ou RG" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Empresa do visitante" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {isEditing ? "Atualizar" : "Registrar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(isEditing ? `/visitors/${id}` : "/visitors")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
