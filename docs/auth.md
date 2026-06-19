# Módulo: Autenticação

## Propósito

Login, logout, perfil do usuário e sessão JWT.

## Rotas Backend

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/login` | — | Login (email + senha → JWT) |
| GET | `/api/auth/me` | JWT | Dados do usuário |
| PUT | `/api/auth/profile` | JWT | Atualizar nome, email, senha |

## Páginas Frontend

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/login` | `LoginPage` | Formulário de login |
| `/profile` | `ProfilePage` | Perfil do usuário logado |

## Tabelas DB

`users` — id, name, email, password (hash), role, departmentId, active

## Fluxo

1. Login → JWT armazenado em `localStorage`
2. `AuthContext` restaura sessão no load
3. `api.ts` injeta `Authorization: Bearer <token>` em toda requisição
4. Logout → limpa token e redireciona para `/login`

## Dependências

- Nenhuma
