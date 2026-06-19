# Módulo: Configurações

## Propósito

Configurações do sistema em chave-valor (instituição, SMTP, horários).

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/settings` | admin | Listar (oculta smtp_pass) |
| PUT | `/api/settings` | admin | Atualizar |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/settings` | `SettingsPage` | admin | Formulário de configuração |

## Chaves

| Chave | Descrição |
|-------|-----------|
| `instituicao_nome` | Nome da instituição |
| `logo_url` | URL da logomarca |
| `sessao_expiracao` | Horas de expiração da sessão |
| `notificacoes_ativas` | Ativar notificações |
| `horario_abertura` | Horário de abertura |
| `horario_fechamento` | Horário de fechamento |
| `email_notificacoes` | Enviar notificações por email |
| `smtp_host` | Servidor SMTP |
| `smtp_port` | Porta SMTP |
| `smtp_secure` | Usar TLS |
| `smtp_user` | Usuário SMTP |
| `smtp_pass` | Senha SMTP |
| `smtp_from` | Remetente |

## Tabelas DB

`settings` — key (PK), value, description, updatedAt

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| demais | — |

## Dependências

- Auth
