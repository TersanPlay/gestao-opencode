# Gestão Corporativa

Sistema de gestão empresarial (usuários, departamentos, visitantes) com autenticação JWT, SQLite, React + TypeScript + Tailwind.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Componentes | react-aria-components, Radix UI |
| Roteamento | React Router v7 |
| Animação | motion |
| Formulários | react-hook-form + zod |
| Backend | Node.js, Express 5 |
| Banco | SQLite (better-sqlite3) |
| Auth | JWT + bcryptjs |
| Detecção email descartável | Invertexto API + CDN fallback (121k domínios) |

## Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis ambiente (opcional)
#    Copie e edite conforme necessário:
#    MINELEAD_API_KEY=   (não usado atualmente, mantido para compatibilidade)
INVERTEXTO_TOKEN=sua_chave_aqui

# 3. Iniciar servidores (frontend + backend)
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001
- Design System: http://localhost:5173/design-system
- Proxy Vite: `/api/*` → `localhost:3001`

## Credenciais Admin

```
Email: admin.admin@admin.com
Senha: admin@123
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia frontend + backend simultaneamente |
| `npm run dev:vite` | Apenas frontend (Vite) |
| `npm run dev:server` | Apenas backend (Express) |
| `npm run build` | TypeScript check + Vite build |
| `npm run preview` | Preview do build |

## Estrutura

```
src/
├── components/
│   ├── auth/          # ProtectedRoute, AuthContext
│   ├── landing/       # Navbar, Hero, Features, etc.
│   ├── layout/        # Sidebar, TopBar, AppLayout
│   ├── shared/        # PageHeader, SearchInput, EmptyState, StatusBadge
│   └── ui/            # shadcn/ui (18 componentes)
│       ├── button.tsx      # 7 variants, 4 sizes
│       ├── card.tsx        # Card + Header + Content + Footer
│       ├── dialog.tsx      # Modal acessível
│       ├── select.tsx      # Radix UI select
│       ├── table.tsx       # Tabela com header/body
│       ├── badge.tsx       # 8 variants
│       ├── avatar.tsx      # Iniciais com cor hash
│       ├── input.tsx       # Input com foco visível
│       ├── label.tsx       # Label acessível
│       ├── checkbox.tsx    # Checkbox react-aria
│       ├── textarea.tsx    # Textarea com resize
│       ├── calendar.tsx    # Calendário react-aria
│       ├── datefield.tsx   # DateField + TimeField segmentados
│       ├── date-range-picker.tsx # DatePicker com popover
│       ├── popover.tsx     # Popover react-aria
│       └── field.tsx       # FieldError, Label base
├── pages/
│   ├── LandingPage.tsx           # Página inicial pública
│   ├── LoginPage.tsx             # Login
│   ├── DashboardPage.tsx         # Dashboard
│   ├── DesignSystemPage.tsx      # Catalogo visual de componentes
│   ├── UsersPage.tsx             # CRUD usuários
│   ├── DepartmentsPage.tsx       # CRUD departamentos (árvore)
│   ├── VisitorsPage.tsx          # Lista visitantes
│   ├── VisitorFormPage.tsx       # Registro de visitante
│   ├── VisitorSchedulePage.tsx   # Agendamento + gerenciamento de visitas
│   ├── VisitorDetailPage.tsx     # Detalhe + timeline do visitante
│   ├── ReportsIndexPage.tsx      # Central de relatórios
│   ├── ReportVisitorsPage.tsx    # Relatório de visitantes
│   ├── ReportDepartmentsPage.tsx # Relatório por departamento
│   └── ReportUsersPage.tsx       # Relatório de usuários
├── services/
│   └── api.ts         # Cliente HTTP para API
├── types/
│   └── index.ts       # Tipos compartilhados
├── contexts/
│   └── AuthContext.tsx # Contexto de autenticação
└── app/
    └── router.tsx     # Rotas protegidas + públicas

server/
├── index.cjs          # Express server (porta 3001)
├── db.cjs             # SQLite schema + seed admin
├── middleware/
│   ├── auth.cjs       # Verificação JWT
│   └── rbac.cjs       # Controle de acesso por papel
└── routes/
    ├── auth.cjs          # POST /login, GET /me
    ├── users.cjs         # CRUD usuários
    ├── departments.cjs   # CRUD departamentos
    ├── visitors.cjs      # CRUD visitantes + verificação email descartável
    ├── timeline.cjs      # Timeline de visitantes
    ├── dashboard.cjs     # Métricas agregadas
    └── reports.cjs       # Relatórios consolidados
```

## Rotas do Frontend

| Rota | Página | Acesso |
|------|--------|--------|
| `/` | Landing Page | Público |
| `/login` | Login | Público |
| `/design-system` | Catálogo de componentes | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/visitors` | Lista de visitantes | Autenticado |
| `/visitors/new` | Registrar visitante | Autenticado |
| `/visitors/schedule` | Agendar/gerenciar visitas | Autenticado |
| `/visitors/:id` | Detalhe do visitante | Autenticado |
| `/visitors/:id/edit` | Editar visitante | Autenticado |
| `/users` | Gerenciar usuários | admin, gestor |
| `/departments` | Gerenciar departamentos | admin |
| `/reports` | Central de relatórios | admin, gestor, assessor |

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login (email + senha → JWT) |
| GET | `/api/auth/me` | Dados do usuário logado |
| GET | `/api/users` | Listar usuários |
| POST | `/api/users` | Criar usuário |
| PUT | `/api/users/:id` | Atualizar usuário (com hash de senha) |
| DELETE | `/api/users/:id` | Remover usuário |
| GET | `/api/departments` | Listar departamentos (árvore) |
| POST | `/api/departments` | Criar departamento |
| PUT | `/api/departments/:id` | Atualizar departamento |
| DELETE | `/api/departments/:id` | Remover departamento |
| GET | `/api/visitors?status=` | Listar visitantes (filtro opcional) |
| GET | `/api/visitors/check-email?email=` | Verificar email descartável |
| GET | `/api/visitors/:id` | Detalhe do visitante |
| POST | `/api/visitors` | Criar visitante |
| PUT | `/api/visitors/:id` | Atualizar visitante |
| DELETE | `/api/visitors/:id` | Remover visitante |
| GET | `/api/timeline/:visitorId` | Timeline do visitante |
| POST | `/api/timeline` | Adicionar evento na timeline |
| GET | `/api/dashboard` | Métricas do dashboard |
| GET | `/api/reports/visitors?period=` | Relatório de visitantes |
| GET | `/api/reports/departments?period=` | Relatório por departamento |
| GET | `/api/reports/users` | Relatório de usuários |
| GET | `/api/health` | Health check |

## Fluxo de Visitante

```
Registrar → Agendar → Check-in → Em Visita → Finalizado
                              ↘ Cancelado
```

- **Registrar**: `/visitors/new` — dados básicos (nome, email, telefone, documento)
- **Agendar**: `/visitors/schedule` — busca visitante + departamento + motivo + data
- **Check-in**: Modal de gerenciamento → registra `checkinAt`
- **Finalizar**: Modal de gerenciamento → registra `checkoutAt`
- **Cancelar**: Modal de gerenciamento → registra `checkoutAt`

### Detecção de Email Descartável

Na criação/edição de visitante, o email é verificado:

1. **Invertexto API** (prioridade) — `POST /v1/email-validator/`
2. **CDN fallback** — lista de ~121k domínios descartáveis via jsDelivr
3. **Fallback offline** — ~8 domínios hardcoded

Se detectado como descartável, um ícone de alerta é exibido no formulário.

## Banco de Dados

Arquivo SQLite gerado automaticamente em `server/corporate.db`.

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários do sistema |
| `departments` | Departamentos (auto-referência para hierarquia) |
| `visitors` | Visitantes registrados |
| `timeline_events` | Eventos da timeline de cada visitante |

Admin seed criado automaticamente na primeira execução.

## Componentes UI

Todos os componentes estão documentados visualmente em `/design-system`:

| Componente | Variantes |
|-----------|-----------|
| Button | default, secondary, outline, ghost, destructive, link, indigo |
| Badge | default, secondary, outline, success, warning, destructive, info, slate |
| Avatar | sm (8), md (10), lg (14) |
| Card | Header, Title, Description, Content, Footer |
| Dialog | open, onOpenChange, title, description |
| Select | Trigger, Content, Item (Radix UI) |
| DatePicker | JollyDatePicker + JollyTimeField |
| Checkbox | isSelected, defaultSelected, isDisabled |
| Input | text, email, disabled, placeholder |
| Textarea | rows, disabled, placeholder |
| SearchInput | value, onChange, placeholder |
| EmptyState | title, description, action |
| PageHeader | title, description, action, secondaryActions |
| VisitorStatusBadge | registered, scheduled, checking_in, in_progress, completed, cancelled |
| UserRoleBadge | admin, gestor, assessor, operator |

## Configuração

- Vite proxy: `vite.config.ts` (`/api` → `localhost:3001`)
- Portas: frontend 5173, backend 3001
- Path alias: `@/` → `src/`
- RBAC: admin > gestor > assessor > operator (por departamento)

## MCPs e Plugins

Ver [`SETUP-MCP-PLUGINS.md`](./SETUP-MCP-PLUGINS.md) para instalação de MCPs (magic, context7) e plugin caveman.
