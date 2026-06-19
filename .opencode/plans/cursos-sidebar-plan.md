# Plano: Adicionar Cursos na Sidebar

## Problema

O módulo de cursos só é acessível via tab dentro de `PerfilCMPDetailPage`. Não há entrada na sidebar nem página standalone para gerenciar o catálogo de cursos.

## O que fazer

### 1. Criar `src/pages/performance/CursosPage.tsx`

Página standalone de CRUD do catálogo de cursos:

- Tabela listando todos os cursos (nome, descrição, carga horária, ações)
- Botão "Novo Curso" → Dialog com formulário (nome, descrição, cargaHorária)
- Ações: editar (dialog), excluir (dialog confirmação)
- Usa `getCursos`, `createCurso`, `updateCurso`, `deleteCurso` da `api.ts`
- Roles: admin, gestor (CRUD), assessor (read)

### 2. Adicionar rota em `src/app/router.tsx`

```tsx
import { CursosPage } from "@/pages/performance/CursosPage";
// ...
<Route path="/performance/cursos" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><CursosPage /></ProtectedRoute>} />
```

### 3. Adicionar entrada na sidebar em `src/components/layout/Sidebar.tsx`

```tsx
import { BookOpen } from "lucide-react";
// ...
const allNavItems: NavItem[] = [
  // ... existing items ...
  { to: "/performance/cursos", label: "Cursos", icon: BookOpen, roles: ["admin", "gestor", "assessor"] },
];
```

## Arquivos a modificar/criar

| Ação | Arquivo |
|------|---------|
| CRIAR | `src/pages/performance/CursosPage.tsx` |
| EDITAR | `src/app/router.tsx` (linha ~79, adicionar import + route) |
| EDITAR | `src/components/layout/Sidebar.tsx` (linha ~20 import BookOpen, linha ~44 adicionar item) |

## Verificação

- `npm run build` — TypeScript check + build
- Navegar para `/performance/cursos` — deve listar cursos
- Sidebar deve mostrar "Cursos" para admin, gestor, assessor
