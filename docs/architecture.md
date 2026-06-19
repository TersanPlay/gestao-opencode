# Arquitetura do Sistema

## Diagrama

```
[Browser]                    [Node.js]
   |                             |
[React 19 SPA]              [Express 5 API]
[Vite Dev :5173]  proxy/api [Server :3001]
   |                             |
   └── react-router-dom ──── JWT auth ──┐
                                       |
                                  [better-sqlite3]
                                  [corporate.db]
```

## Camadas

### Frontend (React 19 + Vite 8)
- SPA com React Router v7
- Tailwind CSS v4 + shadcn/ui + react-aria-components
- State: React Context (AuthContext)
- HTTP: `src/services/api.ts` (fetch wrapper, injeta JWT)

### Backend (Express 5)
- REST API em `server/`
- Middleware chain: `authenticate` → `auditLog` → route handler
- Auth: JWT (`jsonwebtoken`) + bcryptjs
- File upload: multer (documentos)

### Database (SQLite)
- `better-sqlite3` — síncrono, embarcado
- Arquivo: `server/corporate.db`
- WAL mode + foreign keys ON
- 19 tabelas, schema em `server/db.cjs`

## Fluxo de Requisição

1. Usuário faz login → `POST /api/auth/login` → retorna JWT
2. JWT salvo em `localStorage`
3. Toda requisição: header `Authorization: Bearer <token>`
4. Middleware `authenticate` decodifica JWT em `req.user`
5. Middleware `checkRole`/`checkScope` valida permissão
6. Route handler processa e retorna JSON
7. `auditLog` registra mutações automaticamente

## Estrutura de Diretórios

```
src/                         server/
├── app/router.tsx           ├── index.cjs
├── components/              ├── db.cjs
│   ├── auth/                ├── middleware/
│   ├── landing/             │   ├── auth.cjs
│   ├── layout/              │   ├── rbac.cjs
│   ├── notifications/       │   └── audit.cjs
│   ├── shared/              ├── routes/       (22 arquivos)
│   └── ui/                  ├── services/
├── contexts/                │   └── email.cjs
├── lib/                     └── uploads/
├── pages/
│   └── performance/
├── services/
└── types/
```
