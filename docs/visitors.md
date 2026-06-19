# Módulo: Visitantes

## Propósito

Registro, agendamento, check-in/check-out e ciclo de vida completo de visitantes.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/visitors?status=` | todos | Listar com filtro |
| GET | `/api/visitors/check-email?email=` | todos | Verificar email descartável |
| GET | `/api/visitors/:id` | todos | Detalhe |
| POST | `/api/visitors` | todos | Criar |
| PUT | `/api/visitors/:id` | admin, gestor | Atualizar |
| DELETE | `/api/visitors/:id` | admin | Remover |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/visitors` | `VisitorsPage` | todos | Lista |
| `/visitors/new` | `VisitorFormPage` | todos | Registrar |
| `/visitors/schedule` | `VisitorSchedulePage` | todos | Agendar/gerenciar |
| `/visitors/:id` | `VisitorDetailPage` | todos | Detalhe + timeline |
| `/visitors/:id/edit` | `VisitorFormPage` | admin, gestor | Editar |

## Fluxo de Status

```
registered → scheduled → checking_in → in_progress → completed
                                                ↘ cancelled
```

## Detecção de Email Descartável

1. Invertexto API (prioridade)
2. CDN fallback (~121k domínios via jsDelivr)
3. Fallback offline (~8 domínios hardcoded)

## Tabelas DB

`visitors` — id, name, email, phone, document, company, status, departmentId, responsibleId, scheduledAt, checkinAt, checkoutAt, isDisposable

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| gestor | CRUD |
| assessor | Read, Create |
| operator | Read, Create |

## Dependências

- Auth
- Departamentos (departmentId FK)
- Timeline (eventos gerados nas transições de status)
- Notificações (disparadas em check-in/agendamento)
