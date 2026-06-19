# Módulo: Dashboard de Performance

## Propósito

Dashboards específicos por papel com métricas de desempenho.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/dashboard-performance/rh` | admin | Dashboard RH |
| GET | `/api/dashboard-performance/gestor` | gestor | Dashboard gestor |
| GET | `/api/dashboard-performance/colaborador?userId=` | todos | Dashboard colaborador |

## Métricas

### RH (`admin`)
- Total de colaboradores
- Total de avaliações
- Média geral
- Melhores/piores competências
- Ciclos abertos

### Gestor
- Total da equipe
- Avaliações realizadas/pendentes
- PDIs pendentes
- Metas atrasadas
- Destaques e baixo desempenho

### Colaborador
- Última avaliação
- Metas em andamento
- PDIs em andamento
- Feedbacks recebidos
- Competências

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/dashboard` | `PerformanceRHPage` | admin | RH |
| `/performance/team-dashboard` | `PerformanceGestorPage` | gestor | Equipe |
| `/performance/my-dashboard` | `PerformanceColaboradorPage` | todos | Auto |

## Dependências

- Auth
- Colaboradores, Avaliações, Metas, PDI, Feedbacks, Competências, Ciclos
