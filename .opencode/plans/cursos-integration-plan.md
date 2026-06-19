# Plano: Integração do Módulo Cursos

## Problema

O módulo cursos existe isolado:
- `CursosPage` — CRUD do catálogo, sem referência a colaboradores
- `PerfilCMPDetailPage` — aba "Cursos" é **read-only**, sem botões de vincular/editar/excluir
- API functions `vincularCurso`, `updateVinculoCurso`, `deleteVinculoCurso` nunca são chamadas
- Nenhuma navegação cruzada entre as páginas

## O que fazer

### 1. PerfilCMPDetailPage — Aba Cursos com CRUD de vínculos

Transformar a aba cursos de read-only para full CRUD:

**Adicionar imports:**
```tsx
import { vincularCurso, updateVinculoCurso, deleteVinculoCurso, getCursos } from "@/services/api";
import type { Curso } from "@/types";
```

**Adicionar state:**
```tsx
const [cursosCatalogo, setCursosCatalogo] = useState<Curso[]>([]);
const [vinculoDialog, setVinculoDialog] = useState(false);
const [editandoVinculo, setEditandoVinculo] = useState<CursoColaborador | null>(null);
const [vinculoCursoId, setVinculoCursoId] = useState("");
const [vinculoDataInicio, setVinculoDataInicio] = useState("");
const [vinculoDataFim, setVinculoDataFim] = useState("");
const [vinculoStatus, setVinculoStatus] = useState("pendente");
const [confirmDeleteVinculo, setConfirmDeleteVinculo] = useState<CursoColaborador | null>(null);
```

**Carregar catálogo junto com os dados atuais:**
```tsx
getCursos().then(setCursosCatalogo).catch(() => {});
```

**Ações na aba cursos:**
- **Botão "Vincular Curso"** → abre Dialog com Select do catálogo, inputs de data, status
- **Editar** (ícone lápis) → abre mesmo Dialog preenchido
- **Excluir** (ícone lixeira) → Dialog de confirmação
- Tabela ganha coluna "Ações"

### 2. CursosPage — Adicionar coluna de colaboradores vinculados

**Na tabela do catálogo, adicionar coluna "Colaboradores"** mostrando quantos estão vinculados a cada curso.

Isso requer:
- Buscar contagem por curso via API (ou carregar todos os vínculos e agrupar)
- Opção mais simples: criar endpoint `GET /api/cursos/:id/colaboradores-count` no backend
- Opção mais simples ainda: adicionar JOIN count na query `GET /api/cursos`

**Simpler approach**: Modificar `GET /api/cursos` no backend para incluir `colaboradorCount`:
```sql
SELECT c.*, COUNT(cc.id) as colaboradorCount
FROM cursos c
LEFT JOIN colaborador_cursos cc ON cc.cursoId = c.id
GROUP BY c.id
ORDER BY c.nome ASC
```

E adicionar link na coluna para navegar até os colaboradores (ou apenas exibir a contagem).

### 3. Cross-references entre páginas

**Em CursosPage:** Cada linha da tabela terá:
- Um botão "Ver Vinculados" que navega para uma lista de colaboradores vinculados OU
- Uma ação para ver detalhes (que mostra os colaboradores vinculados)

**Em PerfilCMPDetailPage:** Na aba cursos, adicionar link "Ver catálogo de cursos" que navega para `/performance/cursos`.

### 4. Atualizar tipo CursoColaborador

Adicionar campo `certificado` que existe no schema DB mas não no type:
```tsx
export interface CursoColaborador {
  // ...existing fields...
  certificado?: string;
}
```

### 5. Vincular curso a colaborador via CursosPage

Na CursosPage, ao clicar em um curso, abrir um Dialog ou modal que mostra os colaboradores vinculados àquele curso, com opção de adicionar/remover.

**Simpler approach**: Cada linha da CursosPage pode ter um botão "Vincular Colaboradores" que abre um dialog com:
- Lista de colaboradores já vinculados (com opção de remover)
- Select para adicionar novo colaborador
- Campos de data e status

## Arquivos a modificar

| # | Arquivo | O que fazer |
|---|---------|-------------|
| 1 | `src/pages/performance/PerfilCMPDetailPage.tsx` | Adicionar CRUD de vínculos na aba cursos |
| 2 | `src/pages/performance/CursosPage.tsx` | Adicionar coluna de contagem/vinculados + Dialog de vínculo |
| 3 | `server/routes/cursos.cjs` | Adicionar `colaboradorCount` na query GET /cursos |
| 4 | `src/types/index.ts` | Adicionar `certificado` em CursoColaborador |

## Ordem de implementação

1. Backend: adicionar `colaboradorCount` na query de listagem de cursos
2. Types: adicionar campo `certificado` em CursoColaborador
3. PerfilCMPDetailPage: CRUD completo na aba cursos
4. CursosPage: coluna de contagem + actions

## Verificação

- `npx tsc --noEmit` — sem erros de tipo
- `npm run build` — build OK
- Navegar em PerfilCMPDetailPage aba cursos → deve permitir vincular/editar/excluir
- Navegar em CursosPage → deve mostrar contagem de colaboradores por curso
