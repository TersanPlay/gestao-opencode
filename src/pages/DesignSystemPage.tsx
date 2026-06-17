import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { VisitorStatusBadge, UserRoleBadge } from "@/components/shared/StatusBadge";
import { ArrowUpRight, Bell, Check, Info, Mail, Moon, Sun, User, Plus, Calendar } from "lucide-react";

// ── Color Tokens ──
const colorTokens = [
  { name: "Primary", var: "--primary", hex: "#4f46e5", textClass: "text-white" },
  { name: "Secondary", var: "--secondary", hex: "#eef2ff", textClass: "text-indigo-900" },
  { name: "Background", var: "--background", hex: "#f8fafc", textClass: "text-slate-900" },
  { name: "Foreground", var: "--foreground", hex: "#0f172a", textClass: "text-white" },
  { name: "Muted", var: "--muted", hex: "#f1f5f9", textClass: "text-slate-700" },
  { name: "Accent", var: "--accent", hex: "#eef2ff", textClass: "text-indigo-900" },
  { name: "Destructive", var: "--destructive", hex: "#ef4444", textClass: "text-white" },
  { name: "Card", var: "--card", hex: "#ffffff", textClass: "text-slate-900" },
  { name: "Border", var: "--border", hex: "#e2e8f0", textClass: "text-slate-700" },
  { name: "Ring", var: "--ring", hex: "#4f46e5", textClass: "text-white" },
];

// ── Button Variants ──
const buttonVariants = [
  { variant: "default" as const, label: "Default" },
  { variant: "secondary" as const, label: "Secondary" },
  { variant: "outline" as const, label: "Outline" },
  { variant: "ghost" as const, label: "Ghost" },
  { variant: "destructive" as const, label: "Destructive" },
  { variant: "link" as const, label: "Link" },
  { variant: "indigo" as const, label: "Indigo" },
];

// ── Badge Variants ──
const badgeVariants = [
  { variant: "default" as const, label: "Default" },
  { variant: "secondary" as const, label: "Sec." },
  { variant: "outline" as const, label: "Outline" },
  { variant: "success" as const, label: "Success" },
  { variant: "warning" as const, label: "Warning" },
  { variant: "destructive" as const, label: "Danger" },
  { variant: "info" as const, label: "Info" },
  { variant: "slate" as const, label: "Slate" },
];

// ── Visitor Statuses ──
const visitorStatuses: Array<"registered" | "scheduled" | "checking_in" | "in_progress" | "completed" | "cancelled"> = [
  "registered", "scheduled", "checking_in", "in_progress", "completed", "cancelled",
];

// ── User Roles ──
const userRoles: Array<"admin" | "gestor" | "assessor" | "operator"> = [
  "admin", "gestor", "assessor", "operator",
];

// ── Avatar Names ──
const avatarNames = ["Admin Principal", "Maria Silva", "João Santos", "Ana Costa"];

// ── Table Demo Data ──
const tableData = [
  { name: "Carlos Oliveira", email: "carlos@org.com", role: "admin" as const, status: "Ativo" as const },
  { name: "Fernanda Lima", email: "fernanda@org.com", role: "gestor" as const, status: "Ativo" as const },
  { name: "Rafael Souza", email: "rafael@org.com", role: "operator" as const, status: "Inativo" as const },
];

export function DesignSystemPage() {
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-background ${dark ? "dark" : ""}`}>
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-sm">
              G
            </div>
            <span className="text-sm font-semibold tracking-tight">Design System</span>
          </div>
          <nav className="hidden items-center gap-5 sm:flex" aria-label="Navegação do design system">
            <a href="#colors" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Cores</a>
            <a href="#typography" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Tipografia</a>
            <a href="#buttons" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Botões</a>
            <a href="#badges" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Badges</a>
            <a href="#form" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Formulário</a>
            <a href="#data" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dados</a>
            <a href="#feedback" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Feedback</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleDark} aria-label={dark ? "Modo claro" : "Modo escuro"}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/" aria-label="Voltar para página inicial">
              <Button variant="outline" size="sm">Voltar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        {/* ── Hero ── */}
        <section className="mb-16 text-center">
          <Badge variant="info" className="mb-4">v1.0 — Gestão Corporate</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Design System</h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            Todos os componentes, tokens e padrões de acessibilidade do sistema.
            React 19 + Tailwind CSS v4 + shadcn/ui.
          </p>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 1 – COLORS */}
        {/* ════════════════════════════════════════════ */}
        <section id="colors" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Cores</h2>
          <p className="mt-1 text-sm text-muted-foreground">Variáveis CSS e valores hex da paleta principal</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {colorTokens.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-xl border border-border">
                <div className="flex h-20 items-end p-3" style={{ backgroundColor: c.hex }}>
                  <span className={`text-[11px] font-semibold ${c.textClass}`}>{c.hex}</span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{c.var}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 2 – TYPOGRAPHY */}
        {/* ════════════════════════════════════════════ */}
        <section id="typography" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Tipografia</h2>
          <p className="mt-1 text-sm text-muted-foreground">Plus Jakarta Sans — pesos 300–800</p>
          <div className="mt-6 space-y-4 rounded-xl border border-border p-6">
            {[
              { tag: "h1", cls: "text-4xl font-bold", text: "Heading 1 — Título Principal" },
              { tag: "h2", cls: "text-2xl font-bold", text: "Heading 2 — Título de Seção" },
              { tag: "h3", cls: "text-xl font-semibold", text: "Heading 3 — Subtítulo" },
              { tag: "h4", cls: "text-lg font-semibold", text: "Heading 4 — Card Title" },
              { tag: "body", cls: "text-base", text: "Body — Texto padrão para parágrafos e conteúdo corrente." },
              { tag: "sm", cls: "text-sm", text: "Small — Texto auxiliar, labels e metadados." },
              { tag: "xs", cls: "text-xs font-medium", text: "Extra Small — Badges e timestamps." },
              { tag: "mono", cls: "font-mono text-sm", text: "Mono — Código e valores técnicos." },
            ].map((t) => (
              <div key={t.tag} className="flex items-baseline gap-4">
                <span className="w-16 font-mono text-xs text-muted-foreground">{t.tag}</span>
                <p className={t.cls}>{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 3 – BUTTONS */}
        {/* ════════════════════════════════════════════ */}
        <section id="buttons" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Botões</h2>
          <p className="mt-1 text-sm text-muted-foreground">7 variantes · 4 tamanhos · foco visível · transição suave</p>

          <h3 className="mt-6 text-lg font-semibold">Variantes</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {buttonVariants.map((b) => (
              <Button key={b.variant} variant={b.variant}>{b.label}</Button>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold">Tamanhos</h3>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button variant="default" size="sm">Small</Button>
            <Button variant="default" size="default">Default</Button>
            <Button variant="default" size="lg">Large</Button>
            <Button variant="default" size="icon" aria-label="Notificações">
              <Bell className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="mt-8 text-lg font-semibold">Estados</h3>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button variant="default">Normal</Button>
            <Button variant="default" disabled>Desabilitado</Button>
            <Button variant="default" className="gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
              Carregando
            </Button>
            <Button variant="default" className="gap-2">
              <Check className="h-4 w-4" />
              Com Ícone
            </Button>
            <Button variant="outline" className="gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Ação Externa
            </Button>
          </div>

          <h3 className="mt-8 text-lg font-semibold">Acessível</h3>
          <Card className="mt-3">
            <CardContent className="p-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                Botão com <code className="rounded bg-muted px-1 font-mono text-xs">aria-label</code>,&nbsp;
                <code className="rounded bg-muted px-1 font-mono text-xs">focus-visible:ring-4</code> e alto contraste.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="indigo"
                  aria-label="Enviar formulário de contato (atalho: Ctrl+Enter)"
                  className="gap-2 focus-visible:ring-4 focus-visible:ring-indigo-300"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Contato Acessível
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Configurações do sistema"
                  className="focus-visible:ring-4 focus-visible:ring-indigo-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" aria-label="Notificações (3 não lidas)" className="focus-visible:ring-4 focus-visible:ring-indigo-300">
                  <span className="relative">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">3</span>
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 4 – BADGES */}
        {/* ════════════════════════════════════════════ */}
        <section id="badges" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Badges</h2>
          <p className="mt-1 text-sm text-muted-foreground">8 variantes + badges de status e papel</p>

          <h3 className="mt-6 text-lg font-semibold">Variantes de Badge</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {badgeVariants.map((b) => (
              <Badge key={b.variant} variant={b.variant}>{b.label}</Badge>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold">Status de Visitante</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Usado em: <code className="rounded bg-muted px-1 font-mono">VisitorStatusBadge</code>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {visitorStatuses.map((s) => (
              <VisitorStatusBadge key={s} status={s} />
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold">Papel de Usuário</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Usado em: <code className="rounded bg-muted px-1 font-mono">UserRoleBadge</code>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {userRoles.map((r) => (
              <UserRoleBadge key={r} role={r} />
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 5 – FORM */}
        {/* ════════════════════════════════════════════ */}
        <section id="form" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Formulário</h2>
          <p className="mt-1 text-sm text-muted-foreground">Input, Label, Select, SearchInput</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Input + Label */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Input + Label</CardTitle>
                <CardDescription>Campos com label acessível, focus ring e placeholder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ds-name">Nome</Label>
                  <Input id="ds-name" placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ds-email">Email</Label>
                  <Input id="ds-email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ds-disabled">Desabilitado</Label>
                  <Input id="ds-disabled" value="Campo bloqueado" disabled />
                </div>
              </CardContent>
            </Card>

            {/* Select */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select (Radix UI)</CardTitle>
                <CardDescription>Select nativo substituído por componente acessível com portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ds-select">Departamento</Label>
                  <Select value={selectValue} onValueChange={setSelectValue}>
                    <SelectTrigger id="ds-select">
                      <SelectValue placeholder="Selecione um departamento..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gabinete">Gabinete</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="juridico">Jurídico</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ds-status">Status</Label>
                  <Select>
                    <SelectTrigger id="ds-status">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* SearchInput */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SearchInput</CardTitle>
                <CardDescription>Campo de busca com ícone e botão limpar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Buscar visitante..." />
                {search && (
                  <p className="text-xs text-muted-foreground">Buscando por: <strong>{search}</strong></p>
                )}
              </CardContent>
            </Card>

            {/* PageHeader */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">PageHeader</CardTitle>
                <CardDescription>Cabeçalho de página com título + ações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PageHeader
                  title="Visitantes"
                  description="Gerencie os visitantes do sistema"
                  action={{ label: "Novo Visitante", to: "#" }}
                  secondaryActions={[{ label: "Agendar", to: "#", icon: Calendar }]}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 6 – DATA DISPLAY */}
        {/* ════════════════════════════════════════════ */}
        <section id="data" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Dados</h2>
          <p className="mt-1 text-sm text-muted-foreground">Table, Avatar, Card</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Table</CardTitle>
                <CardDescription>Tabela com header, body, hover nas linhas</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow key={row.email}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-muted-foreground">{row.email}</TableCell>
                        <TableCell><UserRoleBadge role={row.role} /></TableCell>
                        <TableCell>
                          <Badge variant={row.status === "Ativo" ? "success" : "destructive"}>{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avatar</CardTitle>
                <CardDescription>Iniciais com cor hash, suporte a imagem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  {(["sm", "md", "lg"] as const).map((size, i) => (
                    <Avatar key={size} name={avatarNames[i]} size={size} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Tamanhos: sm (8), md (10), lg (14)</p>
              </CardContent>
            </Card>

            {/* Card variants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Card</CardTitle>
                <CardDescription>Header + Content + Footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Card com padding, borda sutil e sombra. Usa composição de sub-componentes.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ação
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 7 – FEEDBACK */}
        {/* ════════════════════════════════════════════ */}
        <section id="feedback" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
          <p className="mt-1 text-sm text-muted-foreground">Dialog, EmptyState, estados vazios</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Dialog */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dialog (Modal)</CardTitle>
                <CardDescription>Overlay com backdrop blur, botão fechar, animação</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setDialogOpen(true)} className="gap-2">
                  Abrir Dialog
                </Button>
                <Dialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  title="Exemplo de Dialog"
                  description="Modal acessível com backdrop e animação."
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Conteúdo do dialog. Pressione <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Esc</kbd> ou clique fora para fechar.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => setDialogOpen(false)}>Confirmar</Button>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  </div>
                </Dialog>
              </CardContent>
            </Card>

            {/* EmptyState */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">EmptyState</CardTitle>
                <CardDescription>Estado vazio com ícone, texto e ação opcional</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <EmptyState
                  title="Nenhum registro encontrado"
                  description="Nenhum item atende aos critérios de busca."
                />
              </CardContent>
            </Card>

            {/* EmptyState with action */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">EmptyState com Ação</CardTitle>
                <CardDescription>Quando não há dados e o usuário pode criar o primeiro registro</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <EmptyState
                  title="Nenhum visitante cadastrado"
                  description="Registre o primeiro visitante para começar a usar o sistema."
                  action={{ label: "Registrar Visitante", to: "#" }}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SECTION 8 – ACCESSIBILITY */}
        {/* ════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight">Padrões de Acessibilidade</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Foco Visível", desc: "focus-visible:ring-2 ring-ring ring-offset-2 em todos elementos interativos" },
              { title: "ARIA Labels", desc: "Botões ícone têm aria-label descritivo. Ícones decorativos têm aria-hidden" },
              { title: "Teclado", desc: "Ordem tab lógica. Select e Dialog operam por teclado nativamente" },
              { title: "Contraste AAA", desc: "Text #0F172A / Background #F8FAFC — ratio 14:1" },
              { title: "Touch 44px", desc: "Alvos mínimos de 44×44px em mobile" },
              { title: "Reduced Motion", desc: "Transições respeitam prefers-reduced-motion via Tailwind" },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">Gestão Corporate — Design System v1.0</p>
        <p className="mt-1 text-xs text-muted-foreground">React 19 · Tailwind CSS v4 · shadcn/ui · Radix UI · WCAG AAA</p>
      </footer>
    </div>
  );
}
