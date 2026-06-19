# Plano: Módulo de Avaliação de Desempenho

## 1. Database — Novas Tabelas

Arquivo: `server/db.cjs` — adicionar no startup com `CREATE TABLE IF NOT EXISTS`

### colaboradores
Separado de `users`. Colaborador = pessoa avaliada (pode ou n ter acesso ao sistema).
| Coluna | Tipo | Notas |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| nome | TEXT NOT NULL | |
| email | TEXT | |
| cpf | TEXT UNIQUE | |
| matricula | TEXT UNIQUE | |
| cargo | TEXT | |
| departamentoId | INTEGER | FK → departments.id |
| funcao | TEXT | |
| cargaHoraria | INTEGER | |
| vinculo | TEXT | |
| dataAdmissao | TEXT | ISO date |
| dataDesligamento | TEXT | nullable |
| gestorId | INTEGER | FK → users.id (nullable) |
| userId | INTEGER | FK → users.id (nullable, qdo tem acesso) |
| status | TEXT DEFAULT 'ativo' | ativo, afastado, desligado |
| foto | TEXT | base64 |
| createdAt / updatedAt | TEXT | |

### ciclos_avaliacao
| Coluna | Tipo |
|---|---|
| id, nome, dataInicio, dataFim, status (aberto/fechado), createdAt | |

### competencias
6 padrão: Comunicação, Trabalho em equipe, Produtividade, Qualidade, Comprometimento, Liderança

### avaliacoes
colaboradorId FK, cicloId FK, avaliadorId FK (users), tipo (autoavaliacao/gestor/colega/liderado), notaFinal REAL, conceitoFinal, status (pending/completed)

### avaliacao_competencias
avaliacaoId FK CASCADE, competenciaId FK, nota INTEGER (1-5)

### metas
colaboradorId FK CASCADE, cicloId FK, nome, descricao, metaEsperada, resultadoObtido, percentualConclusao, prazo, status, responsavelId FK (users)

### pdi
colaboradorId FK CASCADE, cicloId FK, objetivo, acoesPrevistas, prazo, responsavelId FK, status, evidencias, observacoes

### feedbacks
colaboradorId FK CASCADE, autorId FK (users), tipo, comentario, status

### historico_colaborador
colaboradorId FK CASCADE, tipo (admissao/cargo/lotacao/avaliacao/feedback/meta/pdi/promocao/desligamento), descricao, dataReferencia

---

## 2. Servidor — Novas Rotas

Arquivos em `server/routes/`: `colaboradores.cjs`, `ciclos.cjs`, `avaliacoes.cjs`, `competencias.cjs`, `metas.cjs`, `pdi.cjs`, `feedbacks.cjs`, `historico.cjs`, `dashboard-performance.cjs`

Registrar em `server/index.cjs` como `/api/colaboradores`, `/api/ciclos`, etc.

**Permissões por rota (checkRole):**
- `GET/POST/PUT` colaboradores: admin, gestor (com scope)
- `DELETE` colaboradores: admin
- `GET/POST/PUT` ciclos: admin (gestor pode listar)
- `GET/POST/PUT` avaliacoes/metas/pdi: admin, gestor (scope)
- `GET` feedbacks: admin, gestor, *autor/dono*
- `POST` feedbacks: todos (autoavaliação)
- `GET` historico: admin, gestor
- `GET` dashboard-performance: admin (RH) ou gestor (team)

---

## 3. Frontend — Permissões

`src/lib/permissions.ts`: adicionar resource `"performance"`
- admin: todas as actions
- gestor: create, read, update
- assessor: read (dashboard básico)
- operator: sem acesso

---

## 4. Sidebar

`src/components/layout/Sidebar.tsx`: novo grupo "Desempenho" (ícone `BarChart3`) com sub-itens:
- Perfil-CMP → `/performance/profiles` (admin, gestor, assessor)
- Ciclos → `/performance/cycles` (admin, gestor)
- Dashboard RH → `/performance/dashboard` (admin)
- Dashboard Equipe → `/performance/team-dashboard` (gestor)

---

## 5. Rotas Frontend

`src/app/router.tsx`:

| Path | Page | Roles |
|---|---|---|
| /performance/profiles | PerfilCMPListPage | admin, gestor, assessor |
| /performance/profiles/new | PerfilCMPFormPage | admin, gestor |
| /performance/profiles/:id | PerfilCMPDetailPage | admin, gestor, assessor, operator |
| /performance/profiles/:id/edit | PerfilCMPFormPage | admin, gestor |
| /performance/cycles | CyclesListPage | admin, gestor |
| /performance/cycles/new | CycleFormPage | admin |
| /performance/cycles/:id/edit | CycleFormPage | admin |
| /performance/evaluations/new/:colaboradorId | EvaluationFormPage | admin, gestor |
| /performance/evaluations/:id | EvaluationDetailPage | admin, gestor |
| /performance/feedbacks/new/:colaboradorId | FeedbackFormPage | todos |
| /performance/metas/new/:colaboradorId | MetaFormPage | admin, gestor |
| /performance/pdi/new/:colaboradorId | PDIFormPage | admin, gestor |
| /performance/dashboard | PerformanceRHPage | admin |
| /performance/team-dashboard | PerformanceGestorPage | gestor |

---

## 6. Páginas — Principais

### PerfilCMPListPage
Grid de cards (Avatar + nome + matrícula + cargo + departamento + nota média + status + metas/PDI ativos)
Filtros: SearchInput (nome/matrícula/email), Select departamento, Select cargo, Select gestor, Select status
Fetch: GET /api/colaboradores?search=&departamentoId=&cargo=&gestorId=&status=

### PerfilCMPDetailPage
Header: Avatar, nome, matrícula, cargo, departamento, status badge
Indicadores (condicional): média geral, metas concluídas, PDIs ativos
Abas:
- **Resumo**: dados principais + última avaliação + metas ativas + PDIs ativos
- **Avaliações**: tabela ciclo/avaliador/tipo/nota/conceito
- **Feedbacks**: tabela data/autor/tipo/comentário
- **Metas**: tabela + botão "Nova Meta"
- **PDI**: tabela + botão "Novo PDI"
- **Histórico**: timeline vertical

### CyclesListPage
Tabela ciclos + botão "Novo Ciclo" + ações abrir/fechar

### CycleFormPage
react-hook-form + zod: nome (Input), dataInicio/dataFim (JollyDatePicker)

### EvaluationFormPage
Select ciclo, Select tipo, grid de competências com input numérico (1-5), textarea comentários
Submit → POST /api/avaliacoes

### MetaFormPage / PDIFormPage / FeedbackFormPage
Forms individuais com react-hook-form + zod

### Dashboards
Grid de cards com KPIs numéricos (sem gráficos no MVP)

---

## 7. API Service

`src/services/api.ts`: adicionar funções:
- getColaboradores, getColaboradorById, createColaborador, updateColaborador, deleteColaborador
- getCiclos, createCiclo, updateCiclo
- getAvaliacoes, createAvaliacao, getAvaliacaoById
- getCompetencias
- getMetas, createMeta, updateMeta
- getPDIs, createPDI, updatePDI
- getFeedbacks, createFeedback
- getHistorico
- getDashboardPerformance (RH), getDashboardTeamPerformance (gestor)

---

## 8. Arquivos a Modificar

- `server/db.cjs` — +9 tabelas + seed competencias
- `server/index.cjs` — +9 rotas
- `src/app/router.tsx` — +14 rotas
- `src/components/layout/Sidebar.tsx` — +nav group Desempenho
- `src/lib/permissions.ts` — +resource performance
- `src/services/api.ts` — +20+ funções

---

## 9. Arquivos a Criar

**Server (9):**
- `server/routes/colaboradores.cjs`
- `server/routes/ciclos.cjs`
- `server/routes/avaliacoes.cjs`
- `server/routes/competencias.cjs`
- `server/routes/metas.cjs`
- `server/routes/pdi.cjs`
- `server/routes/feedbacks.cjs`
- `server/routes/historico.cjs`
- `server/routes/dashboard-performance.cjs`

**Frontend (12+ pages):**
- `src/pages/performance/PerfilCMPListPage.tsx`
- `src/pages/performance/PerfilCMPDetailPage.tsx`
- `src/pages/performance/PerfilCMPFormPage.tsx`
- `src/pages/performance/CyclesListPage.tsx`
- `src/pages/performance/CycleFormPage.tsx`
- `src/pages/performance/EvaluationFormPage.tsx`
- `src/pages/performance/EvaluationDetailPage.tsx`
- `src/pages/performance/FeedbackFormPage.tsx`
- `src/pages/performance/MetaFormPage.tsx`
- `src/pages/performance/PDIFormPage.tsx`
- `src/pages/performance/PerformanceRHPage.tsx`
- `src/pages/performance/PerformanceGestorPage.tsx`

**Opcional — componentes compartilhados:**
- `src/components/performance/CollaboratorCard.tsx` — card do grid
- `src/components/performance/PerfilTabs.tsx` — sistema de abas
- `src/components/performance/CompetenciaInput.tsx` — input 1-5
- `src/components/performance/HistoryTimeline.tsx` — timeline vertical
- `src/components/performance/PerformanceIndicators.tsx` — indicadores

---

## 10. Ordem de Implementação

1. DB Schema (tabelas + seed)
2. Server: colaboradores + competencias (CRUD básico)
3. Frontend: PerfilCMPListPage + PerfilCMPFormPage
4. Server: ciclos + avaliacoes + avaliacao_competencias
5. Frontend: PerfilCMPDetailPage (com abas)
6. Frontend: CyclesListPage + CycleFormPage
7. Frontend: EvaluationFormPage + EvaluationDetailPage
8. Server: metas + pdi + feedbacks + historico
9. Frontend: MetaFormPage + PDIFormPage + FeedbackFormPage
10. Server: dashboard-performance
11. Frontend: PerformanceRHPage + PerformanceGestorPage
12. Permissões + Sidebar + Rotas (finalizar integração)
13. Build + testes manuais

---

## 11. Verificação

- `npm run build` — sem erros TS
- Logar como admin → sidebar mostra "Desempenho"
- Criar colaborador → ver no grid
- Criar ciclo → associar avaliação
- Avaliar colaborador com notas → ver média + conceito
- Criar meta e PDI → ver nas abas do perfil
- Ver dashboard RH (admin) e dashboard equipe (gestor)
- Logar como gestor → ver apenas seus colaboradores
- Logar como operator → sem acesso a /performance/*
