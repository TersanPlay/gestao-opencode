# Gestão Corporativa

Sistema de gestão empresarial (usuários, departamentos, visitantes) com autenticação JWT, SQLite, React + TypeScript + Tailwind.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Roteamento | React Router v7 |
| Animação | motion |
| Backend | Node.js, Express 5 |
| Banco | SQLite (better-sqlite3) |
| Auth | JWT + bcryptjs |

## Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidores (frontend + backend)
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001
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
│   ├── landing/       # Landing page (Navbar, Hero, Features, etc.)
│   ├── layout/        # Sidebar, TopBar, AppLayout
│   ├── shared/        # PageHeader, SearchInput, EmptyState, StatusBadge
│   └── ui/            # shadcn/ui (button, card, dialog, select, datefield, etc.)
├── pages/
│   ├── LandingPage.tsx       # Página inicial pública
│   ├── LoginPage.tsx         # Login
│   ├── DashboardPage.tsx     # Dashboard
│   ├── UsersPage.tsx         # CRUD usuários
│   ├── DepartmentsPage.tsx   # CRUD departamentos (árvore)
│   ├── VisitorsPage.tsx      # Lista visitantes
│   ├── VisitorFormPage.tsx   # Registro básico de visitante
│   ├── VisitorSchedulePage.tsx # Agendamento de visita
│   └── VisitorDetailPage.tsx # Detalhe + timeline do visitante
├── services/
│   └── api.ts         # Cliente HTTP para API
├── types/
│   └── index.ts       # Tipos compartilhados
└── contexts/
    └── AuthContext.tsx # Contexto de autenticação

server/
├── index.cjs          # Express server (porta 3001)
├── db.cjs             # SQLite schema + seed admin
└── routes/
    ├── auth.cjs       # POST /login, GET /me
    ├── users.cjs      # CRUD usuários
    ├── departments.cjs # CRUD departamentos
    ├── visitors.cjs    # CRUD visitantes (com filtro status)
    ├── timeline.cjs    # Timeline de visitantes
    └── dashboard.cjs   # Métricas agregadas
```

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login (email + senha → JWT) |
| GET | `/api/auth/me` | Dados do usuário logado |
| GET | `/api/users` | Listar usuários |
| POST | `/api/users` | Criar usuário |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Remover usuário |
| GET | `/api/departments` | Listar departamentos |
| POST | `/api/departments` | Criar departamento |
| PUT | `/api/departments/:id` | Atualizar departamento |
| DELETE | `/api/departments/:id` | Remover departamento |
| GET | `/api/visitors?status=` | Listar visitantes (filtro opcional) |
| POST | `/api/visitors` | Criar visitante |
| PUT | `/api/visitors/:id` | Atualizar visitante |
| DELETE | `/api/visitors/:id` | Remover visitante |
| GET | `/api/timeline/:visitorId` | Timeline do visitante |
| POST | `/api/timeline` | Adicionar evento na timeline |
| GET | `/api/dashboard` | Métricas do dashboard |
| GET | `/api/health` | Health check |

## Banco de Dados

Arquivo SQLite gerado automaticamente em `server/corporate.db`.

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários do sistema |
| `departments` | Departamentos (auto-referência para hierarquia) |
| `visitors` | Visitantes registrados |
| `timeline_events` | Eventos da timeline de cada visitante |

Admin seed criado automaticamente na primeira execução.

## Configuração

- Vite proxy: `vite.config.ts` (`/api` → `localhost:3001`)
- Portas: frontend 5173, backend 3001
- Path alias: `@/` → `src/`
