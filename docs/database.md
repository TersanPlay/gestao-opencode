# Banco de Dados

SQLite via `better-sqlite3`. Arquivo: `server/corporate.db`. Schema em `server/db.cjs`.

## Tabelas

### `users`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| name | TEXT | Nome do usuário |
| email | TEXT UNIQUE | Email de login |
| password | TEXT | Hash bcrypt |
| phone | TEXT | Telefone |
| role | TEXT | admin, gestor, assessor, operator |
| active | INTEGER | 0/1 |
| departmentId | INTEGER FK → departments | Departamento |
| createdAt | TEXT | ISO datetime |

### `departments`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| name | TEXT | Nome do departamento |
| description | TEXT | Descrição |
| parentId | INTEGER FK → departments | Hierarquia auto-referencial |
| responsibleId | INTEGER FK → users | Responsável |
| createdAt | TEXT | ISO datetime |

### `visitors`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| name | TEXT | Nome do visitante |
| email | TEXT | Email |
| phone | TEXT | Telefone |
| document | TEXT | Documento |
| company | TEXT | Empresa |
| photo | TEXT | URL da foto |
| isDisposable | INTEGER | Flag email descartável |
| departmentId | INTEGER FK → departments | Departamento visitado |
| responsibleId | INTEGER FK → users | Responsável |
| status | TEXT | registered, scheduled, checking_in, in_progress, completed, cancelled |
| purpose | TEXT | Motivo da visita |
| scheduledAt | TEXT | Data agendada |
| checkinAt | TEXT | Check-in timestamp |
| checkoutAt | TEXT | Check-out timestamp |
| createdAt | TEXT | ISO datetime |

### `timeline_events`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| visitorId | INTEGER FK → visitors | Visitante |
| type | TEXT | Event type |
| description | TEXT | Descrição |
| author | TEXT | Autor |
| timestamp | TEXT | ISO datetime |

### `notifications`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| userId | INTEGER FK → users | Destinatário |
| type | TEXT | Tipo |
| title | TEXT | Título |
| message | TEXT | Mensagem |
| link | TEXT | Link opcional |
| read | INTEGER | 0/1 |
| createdAt | TEXT | ISO datetime |

### `audit_logs`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| userId | INTEGER | Autor |
| userName | TEXT | Nome do autor |
| userRole | TEXT | Role do autor |
| action | TEXT | POST, PUT, DELETE |
| resource | TEXT | Recurso afetado |
| resourceId | TEXT | ID do recurso |
| details | TEXT | Detalhes |
| ip | TEXT | IP da requisição |
| createdAt | TEXT | ISO datetime |

### `settings`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| key | TEXT PK | Chave de configuração |
| value | TEXT | Valor |
| description | TEXT | Descrição |
| updatedAt | TEXT | ISO datetime |

### `colaboradores`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| nome | TEXT | Nome |
| email | TEXT | Email |
| cpf | TEXT | CPF |
| matricula | TEXT | Matrícula única |
| cargo | TEXT | Cargo |
| departamentoId | INTEGER FK → departments | Departamento |
| funcao | TEXT | Função |
| cargaHoraria | INTEGER | Carga horária semanal |
| ano | INTEGER | Ano referência (importação) |
| mes | INTEGER | Mês referência (importação) |
| vinculo | TEXT | Tipo de vínculo |
| dataAdmissao | TEXT | Data de admissão |
| dataDesligamento | TEXT | Data de desligamento |
| gestorId | INTEGER FK → users | Gestor responsável |
| userId | INTEGER FK → users | Usuário vinculado |
| status | TEXT | ativo, inativo |
| foto | TEXT | URL da foto |
| createdAt | TEXT | ISO datetime |
| updatedAt | TEXT | ISO datetime |

### `ciclos_avaliacao`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| nome | TEXT | Nome do ciclo |
| dataInicio | TEXT | Data início |
| dataFim | TEXT | Data fim |
| status | TEXT | aberto, fechado |
| createdAt | TEXT | ISO datetime |

### `competencias`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| nome | TEXT UNIQUE | Nome (seeded: 6 competências) |
| descricao | TEXT | Descrição |
| createdAt | TEXT | ISO datetime |

### `avaliacoes`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador avaliado |
| cicloId | INTEGER FK → ciclos_avaliacao | Ciclo |
| avaliadorId | INTEGER FK → users | Avaliador |
| tipo | TEXT | autoavaliacao, gestor, colega, liderado |
| notaFinal | REAL | Média calculada |
| conceitoFinal | TEXT | Excelente, Bom, Regular, Ruim, Insatisfatório |
| status | TEXT | pending, completed |
| comentarios | TEXT | Comentários |
| createdAt | TEXT | ISO datetime |

### `avaliacao_competencias`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| avaliacaoId | INTEGER FK → avaliacoes | Avaliação |
| competenciaId | INTEGER FK → competencias | Competência |
| nota | INTEGER | Nota (0-5 ou escala definida) |

Índice único: `(avaliacaoId, competenciaId)`

### `metas`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador |
| cicloId | INTEGER FK → ciclos_avaliacao | Ciclo |
| nome | TEXT | Nome da meta |
| descricao | TEXT | Descrição |
| metaEsperada | TEXT | Meta esperada |
| resultadoObtido | TEXT | Resultado |
| percentualConclusao | INTEGER | 0-100 |
| prazo | TEXT | Prazo |
| status | TEXT | pending, in_progress, completed |
| responsavelId | INTEGER FK → users | Responsável |
| createdAt | TEXT | ISO datetime |

### `pdi`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador |
| cicloId | INTEGER FK → ciclos_avaliacao | Ciclo |
| objetivo | TEXT | Objetivo do PDI |
| acoesPrevistas | TEXT | Ações previstas |
| prazo | TEXT | Prazo |
| responsavelId | INTEGER FK → users | Responsável |
| status | TEXT | pending, in_progress, completed |
| evidencias | TEXT | Evidências |
| observacoes | TEXT | Observações |
| createdAt | TEXT | ISO datetime |

### `feedbacks`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador |
| autorId | INTEGER FK → users | Autor |
| tipo | TEXT | autoavaliacao, gestor, colega, liderado |
| comentario | TEXT | Comentário |
| status | TEXT | pending, completed |
| createdAt | TEXT | ISO datetime |

### `historico_colaborador`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador |
| tipo | TEXT | admissao, cargo, lotacao, avaliacao, feedback, meta, pdi, promocao, desligamento |
| descricao | TEXT | Descrição do evento |
| dataReferencia | TEXT | Data do evento |
| createdAt | TEXT | ISO datetime |

### `documentos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador |
| nome | TEXT | Nome do arquivo |
| tipo | TEXT | Tipo documental |
| arquivo | TEXT | Caminho do arquivo |
| mimeType | TEXT | MIME type |
| tamanho | INTEGER | Tamanho em bytes |
| createdAt | TEXT | ISO datetime |

### `cursos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| nome | TEXT | Nome do curso |
| descricao | TEXT | Descrição |
| cargaHoraria | INTEGER | Carga horária |
| createdAt | TEXT | ISO datetime |

### `colaborador_cursos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador |
| cursoId | INTEGER FK → cursos | Curso |
| dataInicio | TEXT | Data início |
| dataFim | TEXT | Data conclusão |
| status | TEXT | pendente, em_andamento, concluído |
| certificado | TEXT | Certificado |
| createdAt | TEXT | ISO datetime |

## Seed Data

- **Admin**: `admin.admin@admin.com` / `admin@123` (role: admin)
- **Competências**: Comunicação, Trabalho em Equipe, Produtividade, Qualidade das Entregas, Comprometimento, Liderança
- **Settings**: 13 chaves (instituição, SMTP, horários, etc.)
