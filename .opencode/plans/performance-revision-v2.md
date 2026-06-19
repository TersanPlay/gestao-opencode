# Plano de Revisão — Módulo de Avaliação de Desempenho

## 1. DB Schema — Alterações

### `avaliacoes` — adicionar coluna comentarios
```sql
ALTER TABLE avaliacoes ADD COLUMN comentarios TEXT DEFAULT '';
```
(migration no startup em `server/db.cjs`)

---

## 2. Server — Endpoints a Modificar/Criar

### 2.1 `colaboradores.cjs` — GET /
- Adicionar suporte a filtro `cargo` (query param)
- Adicionar `ultimaAvaliacao` no response (data, nota, ciclo, conceito)
- Adicionar campo `statusAvaliacao` no response: "Em dia" / "Pendente" / "Nunca avaliado"

### 2.2 `avaliacoes.cjs`
- POST /: aceitar `comentarios` no body
- PUT /:id/finalizar: persistir `comentarios`
- GET /: incluir `comentarios` no SELECT
- DELETE /:id: adicionar rota delete (admin-only)

### 2.3 `dashboard-performance.cjs` — nova rota `/colaborador`
- `GET /colaborador?userId=N` — KPIs do colaborador logado:
  - Última avaliação
  - Próximas metas
  - PDI em andamento
  - Feedbacks recebidos
  - Competências com melhor/pior desempenho

### 2.4 `ciclos.cjs` — nova rota `/:id/progress`
- `GET /:id/progress` — retorna:
  - total colaboradores no ciclo
  - avaliações realizadas
  - avaliações pendentes
  - média geral do ciclo

---

## 3. Frontend — Páginas a Modificar/Criar

### 3.1 PerfilCMPListPage
- Adicionar filtro Select para `cargo` (buscar cargos distintos do GET /colaboradores)
- Adicionar filtro Select para `gestor` (buscar users com role gestor/admin)
- Card: adicionar badge "Status da avaliação" (pendente/em dia/nunca avaliado)
- Card: adicionar linha com data da última avaliação + nota

### 3.2 PerfilCMPDetailPage

#### Aba Resumo
- Adicionar seção "Principais Competências" — buscar últimas avaliacao_competencias

#### Aba Avaliações
- Expandir cada linha da tabela para mostrar competências (accordion ou modal)
- Ou adicionar coluna "Ver" que abre dialog com breakdown por competência
- Adicionar coluna "Comentários" (texto truncado)

#### Aba Metas
- Adicionar coluna "Resultado obtido"
- Adicionar botão "Editar" por linha (navega para `/performance/metas/:id/edit`)
- Adicionar botão "Excluir" com confirmação (Dialog)
- Criar `MetaFormPage` edit mode (carregar dados da meta via `getMetaById`)

#### Aba PDI
- Adicionar coluna "Evidências"
- Adicionar botão "Editar" por linha (navega para `/performance/pdi/:id/edit`)
- Adicionar botão "Excluir" com confirmação
- Criar `PDIFormPage` edit mode

### 3.3 CycleFormPage
Ao editar: adicionar seção "Progresso" com:
- Total colaboradores no ciclo
- Avaliações realizadas / pendentes
- Média geral do ciclo

### 3.4 EvaluationFormPage
- Adicionar textarea "Comentários do avaliador"
- Buscar e exibir avaliações anteriores do mesmo colaborador (histórico)
- Mostrar notas anteriores por competência para referência

### 3.5 Nova página: PerformanceColaboradorPage
- Rota: `/performance/my-dashboard`
- Acesso: qualquer usuário com `colaborador.userId` vinculado
- Seções:
  - Última avaliação (nota, conceito, ciclo)
  - Próximas metas (tabela com metas em andamento)
  - PDI ativo
  - Feedbacks recebidos
  - Competências: melhores e a desenvolver
- Botão "Ver perfil completo" → `/performance/profiles/:id`

### 3.6 CyclesListPage
- Adicionar coluna "Progresso" com barra de % de avaliações concluídas
- Adicionar coluna "Pendentes" com link para ver lista
- Ao clicar em pendentes: mostrar modal com lista de colaboradores não avaliados

### 3.7 PerformanceGestorPage
- Indicador `avaliacoesPendentes` clicável → navega para `/performance/profiles?status=pending`
- Cada destaque/baixo desempenho clicável → navega para perfil

---

## 4. Permissões e Rotas

### 4.1 `permissions.ts`
- **operator**: remover qualquer acesso a `performance` (já não tem, mas reforçar)
- **assessor**: manter `read:performance` (já está)
- **gestor**: manter `create:performance`, `read:performance`, `update:performance`
- **admin**: manter todas

### 4.2 `router.tsx`
- Remover `operator` de `/performance/profiles/:id`
- Remover `operator` de `/performance/feedbacks/new/:colaboradorId`
- Adicionar rota `/performance/my-dashboard` para `["admin", "gestor", "assessor", "operator"]` (qualquer um com vínculo)
- Adicionar rota `/performance/metas/:id/edit` para `["admin", "gestor"]`
- Adicionar rota `/performance/pdi/:id/edit` para `["admin", "gestor"]`

### 4.3 Sidebar
- Adicionar "Meu Desempenho" → `/performance/my-dashboard` para todos roles (mostrar apenas se usuário tiver colaborador vinculado)

---

## 5. API Service

Adicionar em `src/services/api.ts`:
- `getCicloProgress(id)` → GET /ciclos/:id/progress
- `getDashboardPerformanceColaborador(userId)` → GET /dashboard-performance/colaborador
- `getMetaById(id)` → GET /metas/:id
- `getPDIById(id)` → GET /pdi/:id
- `deleteMeta(id)` → DELETE /metas/:id
- `deletePDI(id)` → DELETE /pdi/:id
- `deleteAvaliacao(id)` → DELETE /avaliacoes/:id

---

## 6. Tipos

Adicionar em `src/types/index.ts`:
- `CicloProgress` interface
- `DashboardPerformanceColaborador` interface
- `StatusAvaliacao` type: "em_dia" | "pendente" | "nunca_avaliado"
- Atualizar `Avaliacao` para incluir `comentarios?: string`

---

## 7. Ordem de Implementação

1. DB migration (comentarios)
2. Server: colaboradores GET / — cargo filter + ultimaAvaliacao no list
3. Server: avaliacoes — comentarios field, DELETE route
4. Server: dashboard-performance/colaborador
5. Server: ciclos/:id/progress
6. Frontend: PerfilCMPListPage (cargo/gestor filters, status/ultima no card)
7. Frontend: PerfilCMPDetailPage (competencias breakdown, comentarios col, edit/delete meta/pdi)
8. Frontend: EvaluationFormPage (comentarios textarea, historico)
9. Frontend: MetaFormPage + PDIFormPage edit mode
10. Frontend: CyclesListPage (progress bar, pendentes count)
11. Frontend: PerformanceColaboradorPage (my-dashboard)
12. Frontend: Permissions + Router + Sidebar
13. Build + verificar

---

## 8. Verificação

- `npm run build` sem erros
- Resetar DB e testar fluxo completo:
  1. Admin cria colaborador
  2. Admin cria ciclo
  3. Gestor avalia colaborador com comentários
  4. Gestor cria meta e PDI
  5. Colaborador linked vê "Meu Desempenho"
  6. Filtros por cargo/gestor funcionam na listagem
  7. Progresso do ciclo visível
  8. Editar/excluir meta e PDI funciona
  9. Aninhamento de rotas sem 404
