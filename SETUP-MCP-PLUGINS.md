# MCPs e Plugins — Configuracao do Projeto

## Sumario

| Tipo | Nome | Origem | Instalacao |
|------|------|--------|------------|
| MCP | magic (21st.dev) | `opencode.json` | Automatica via npx |
| MCP | context7 | `opencode.json` | Automatica via npx |
| Plugin | caveman | `~/.config/opencode/opencode.json` | Manual (uma vez) |
| Skill | caveman, cavecrew, ui-ux-pro-max, etc | `.opencode/skills/` | Copia de diretorio |
| Agent | caveman mode | `~/.config/opencode/AGENTS.md` | Manual (uma vez) |

---

## 1. MCPs — Machine-Promptable Commands

Definidos em `opencode.json` na raiz do projeto. Nao requerem instalacao explicita — o OpenCode baixa e executa automaticamente via `npx`.

### magic (21st.dev)
```json
{
  "mcp": {
    "magic": {
      "type": "local",
      "command": ["npx", "-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "<sua-chave-aqui>"
      }
    }
  }
}
```
- **Funcao**: Gera componentes UI React sob demanda (botoes, dialogos, tabelas, formularios).
- **Dependencia**: Node.js 18+ com `npx` disponivel.
- **Chave API**: Obter em https://21st.dev — substituir no campo `env.API_KEY`.

### context7
```json
{
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"],
      "enabled": true
    }
  }
}
```
- **Funcao**: Consulta documentacao tecnica atualizada de bibliotecas (React, Next.js, Tailwind, etc).
- **Dependencia**: Node.js 18+.

---

## 2. Plugins OpenCode

### Plugin caveman (global)

Arquivo: `~/.config/opencode/plugins/caveman/plugin.js`

**Instalacao manual** (unica vez por maquina):

```powershell
# 1. Criar diretorio do plugin
New-Item -ItemType Directory -Path "$env:USERPROFILE\.config\opencode\plugins\caveman" -Force

# 2. Copiar os 3 arquivos do plugin
#    (plugin.js, package.json, caveman-config.cjs)
#    Origem: <projeto>/plugins/caveman/  ou  repositorio oficial

# 3. Ativar no config global
#    ~/.config/opencode/opencode.json deve conter:
#    { "plugin": ["./plugins/caveman/plugin.js"] }
```

Efeito:
- Parseia comandos `/caveman lite|full|ultra|wenyan`
- Habilita modo de comunicacao ultra-compacto
- Nao afeta codigo escrito — apenas conversacao

---

## 3. Skills OpenCode

Skills sao instrucoes carregadas sob demanda pelo OpenCode. Cada skill e um diretorio com `SKILL.md`.

### Skills do projeto (`.opencode/skills/`)

| Skill | Descricao |
|-------|-----------|
| `caveman` | Comunicacao ultra-compacta |
| `caveman-commit` | Mensagens de commit comprimidas |
| `caveman-compress` | Comprimir arquivos de memoria |
| `caveman-help` | Referencia rapida de comandos |
| `caveman-review` | Code review ultra-compacto |
| `caveman-stats` | Estatisticas de tokens da sessao |
| `cavecrew` | Delegacao para sub-agentes |
| `customize-opencode` | Editar config do proprio OpenCode |
| `ui-ux-pro-max` | Guia de design UI/UX (requer Python) |

### Instalacao

Copiar o diretorio `.opencode/skills/` para dentro do projeto:

```powershell
Copy-Item -Recurse ".opencode/skills" "<destino>/projeto/.opencode/skills"
```

Ou, se o projeto ja possui as skills, nenhuma acao e necessaria.

### Pre-requisito: ui-ux-pro-max (Python)

```powershell
winget install Python.Python.3.12
pip install -r .opencode/skills/ui-ux-pro-max/requirements.txt   # se existir
```

---

## 4. Agents (modo de conversa)

Definido em `~/.config/opencode/AGENTS.md`.

**Instalacao manual** (unica vez por maquina):

```powershell
Copy-Item .config/opencode/AGENTS.md "$env:USERPROFILE\.config\opencode\AGENTS.md"
```

Conteudo: regras de comunicacao estilo caveman (sistema de prompt base).

---

## 5. Checklist rapido

- [ ] `npx` disponivel (Node.js 18+)
- [ ] `opencode.json` na raiz do projeto com MCPs `magic` e `context7`
- [ ] Chave API 21st.dev configurada em `env.API_KEY`
- [ ] Plugin caveman em `~/.config/opencode/plugins/caveman/plugin.js`
- [ ] Plugin ativado em `~/.config/opencode/opencode.json`
- [ ] `AGENTS.md` em `~/.config/opencode/AGENTS.md`
- [ ] Python 3.12+ instalado (para skill ui-ux-pro-max)
