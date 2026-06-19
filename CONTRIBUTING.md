# Contribuindo

## Setup

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173` | API: `http://localhost:3001`

Admin: `admin.admin@admin.com` / `admin@123`

## Code Style

- TypeScript strict mode
- Tailwind CSS v4 — classes inline, sem `@apply`
- Componentes React funcionais
- shadcn/ui + react-aria-components para UI
- lucide-react para ícones (nunca emoji)
- Express 5 para rotas backend

## Commits

Formato: `[módulo] descrição` (ex: `[visitors] fix email validation`)

Present tense, imperative mood.

## PR Workflow

1. Branch da `main`
2. Implemente + teste
3. Atualize `docs/` se adicionar/modificar rotas
4. Atualize `README.md` tabela de módulos se necessário
5. Abra PR com descrição clara

## Documentação

- Módulos em `docs/<module>.md`
- Endpoints novos em `docs/api-complete.md`
- Schema novo em `docs/database.md`
- Rotas frontend novas em `docs/frontend-pages.md`
