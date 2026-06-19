# Documentação do Sistema

## Visão Geral

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](architecture.md) | Diagrama, camadas, fluxo de requisição |
| [Tech Stack](stack.md) | Tecnologias e versões |
| [Banco de Dados](database.md) | Schema completo (19 tabelas) |
| [API Completa](api-complete.md) | Todos os endpoints (~80) |
| [Rotas Frontend](frontend-pages.md) | Todas as páginas (~37) |
| [RBAC](rbac.md) | Matriz de permissões |

## Módulos

### Portaria

| # | Módulo | Descrição |
|---|--------|-----------|
| 01 | [Autenticação](auth.md) | Login, JWT, perfil |
| 02 | [Usuários](users.md) | CRUD com hierarquia de roles |
| 03 | [Departamentos](departments.md) | Estrutura em árvore |
| 04 | [Visitantes](visitors.md) | Ciclo de vida completo |
| 05 | [Timeline](timeline.md) | Eventos cronológicos |
| 06 | [Dashboard](dashboard.md) | Métricas agregadas |
| 07 | [Relatórios](reports.md) | Relatórios consolidados |
| 08 | [Notificações](notifications.md) | Notificações + email |
| 09 | [Auditoria](audit-logs.md) | Log de mutações |
| 10 | [Configurações](settings.md) | Chave-valor do sistema |

### Performance

| # | Módulo | Descrição |
|---|--------|-----------|
| 11 | [Colaboradores](colaboradores.md) | Perfis + importação CSV |
| 12 | [Ciclos](ciclos.md) | Períodos de avaliação |
| 13 | [Competências](competencias.md) | Catálogo de competências |
| 14 | [Avaliações](avaliacoes.md) | Notas por competência |
| 15 | [Metas](metas.md) | Metas com percentual |
| 16 | [PDI](pdi.md) | Planos de desenvolvimento |
| 17 | [Feedbacks](feedbacks.md) | Feedback 360° |
| 18 | [Histórico](historico.md) | Linha do tempo funcional |
| 19 | [Dashboard Performance](dashboard-performance.md) | RH, gestor, colaborador |
| 20 | [Exportação](export.md) | CSV |
| 21 | [Documentos](documentos.md) | Upload/download |
| 22 | [Cursos](cursos.md) | Catálogo + vínculo N:N |
