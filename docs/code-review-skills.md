# Skills de Revisão de Código — Referência Rápida

## Skills instaladas

| Skill | Localização | Tipo |
|---|---|---|
| `code-review` | `.agents/skills/code-review/` | Skill |
| `comprehensive-review` | `.agents/skills/comprehensive-review/` | Skill |
| `cross-review` | `.agents/skills/cross-review/` | Skill |
| `zen-review` | `.agents/skills/zen-review/` | Skill |
| `zen-comprehensive-review` | `.agents/skills/zen-comprehensive-review/` | Skill |
| `requesting-code-review` | `superpowers/skills/requesting-code-review/` | Skill (workflow) |
| `receiving-code-review` | `superpowers/skills/receiving-code-review/` | Skill (workflow) |
| `architectural-analysis` | `.opencode/skills/architectural-analysis/` | Skill |
| `review` | n/a (subagent_type) | Task agent |

---

## 1. `code-review`

**Quando usar:** Revisão rápida de diff, commit, ou range.

**Input:** diff textual, hash(es) de commit, range git, descrição da tarefa.

```
Reveja o diff entre abc123..def456
```

```
Review commit a1b2c3d — adicionou autenticação
```

**Output:** Verdict (APPROVE / REQUEST CHANGES / NEEDS DISCUSSION) + tabela de findings P0-P3 + detalhes com sugestões.

**Prioridades:**
| Level | Significado |
|-------|-------------|
| P0 | Crítico — security, data loss, crash. **Must fix** |
| P1 | Major — bug significativo, regressão. **Must fix** |
| P2 | Minor — code smell, inconsistência. Nice to fix |
| P3 | Sugestão — melhoria opcional |

---

## 2. `comprehensive-review`

**Quando usar:** Revisão completa e estruturada, suporte a PR do GitHub. **⚠️ CUSTO ALTO — só usar se solicitado.**

**Input:** PR URL ou branch local.

```
Use comprehensive review on this branch
```

```
Review https://github.com/user/repo/pull/42
```

**Fluxo:**
1. Determina modo (PR ou local)
2. Subagente busca diff + avalia complexidade (simple / medium / hard)
3. **Simple:** root agent revisa sozinho (lê 6 critérios)
4. **Medium:** 6 subagentes paralelos (1 por critério)
5. **Hard:** 12 subagentes (2 modelos × 6 critérios)
6. Merge, dedup, priorização
7. Pergunta ao usuário: fix ou post comment?
8. Aplica fixes ou posta comentários no PR via script

**Dimensões de análise:**
- Architecture
- Security
- Performance
- Code Quality
- Requirements Compliance
- Bugs

---

## 3. `cross-review`

**Quando usar:** Revisão com modelo específico escolhido pelo usuário.

```
Use review skill with gpt-5-3-codex to review the changes
```

```
Review with opus my changes to the visitor module. Review instructions: check for SQL injection
```

**Fluxo:**
1. Reconstrói diff das alterações feitas na conversa
2. Lê arquivos alterados + contexto (testes, tipos)
3. Dispara subagente com `code-review` no modelo indicado
4. Retorna resultado verbatim — sem agir sobre findings

---

## 4. `zen-review`

**Quando usar:** Revisão que retorna JSON processável. Foco estrito em bugs (ignora estilo/nomes). **⚠️ CUSTO ALTO — só usar se solicitado.**

```
Run zen-review on the current branch
```

**Output:**
```json
[{"path": "src/file.ts", "line": 42, "body": "descrição", "severity": "P1"}]
```

**Severidades:** P0 (crash/data loss), P1 (bug correção), P2 (real, baixo impacto), P3 (sugestão).

---

## 5. `zen-comprehensive-review`

**Quando usar:** Multi-modelo — 3 subagentes (opus, codex, gemini) com `zen-review`, merge + dedup. Suporte a PR. **⚠️ CUSTO ALTO — só usar se solicitado.**

```
Run zen-comprehensive-review
```

```
Owner/Repo: user/repo, PR Number: 42
```

**Fluxo:**
1. Salva diff em `/tmp/review-diff.patch`
2. 3 subagentes paralelos com `zen-review` (modelos diferentes)
3. Merge + dedup
4. Consensus signal: 2+ acharem o mesmo bug → muito provável
5. Máximo 5-7 findings por PR
6. Modo PR: posta comentários via script. Modo local: markdown

---

## 6. `review` (task agent)

**Quando usar:** Revisão específica para o stack do projeto (Vite + React + TS + Tailwind + Express + SQLite). Foco em bugs, segurança, performance, e conformidade com regras de UI do AGENTS.md.

```
Revisa o código novo do módulo de visitantes
```

**Invoca via:** `task` tool com `subagent_type: "review"`.

---

## 7. `requesting-code-review`

**Quando usar:** Após completar tarefa, antes de merge. Workflow para solicitar revisão.

**Fluxo:**
1. `BASE_SHA=$(git rev-parse HEAD~1)`
2. `HEAD_SHA=$(git rev-parse HEAD)`
3. Dispara subagente `general-purpose` com template `code-reviewer.md`
4. Placeholders: DESCRIPTION, PLAN_OR_REQUIREMENTS, BASE_SHA, HEAD_SHA
5. Age sobre feedback: Critical → fix imediato, Important → fix antes de prosseguir, Minor → nota

---

## 8. `receiving-code-review`

**Quando usar:** Ao receber feedback de revisão. Workflow para processar corretamente.

**Fluxo:** READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT

**Regras:**
- Sem agradecimentos performáticos
- Verificar antes de implementar
- Push back técnico se o revisor estiver errado
- Implementar um item por vez, testar cada um
- Se feedback pouco claro: parar e perguntar

---

## 9. `architectural-analysis`

**Quando usar:** Auditoria estrutural profunda — dead code, duplicação, anti-patterns, type confusion, code smells. **Análise apenas, sem edição.**

```
Find dead code in the project
```

```
Analyze architectural health of the visitor module
```

**Fases:**
1. Mapear estrutura + entry points
2. Dead code detection (arquivo por arquivo)
3. Duplication detection (exata, similar, conceitual, tipo)
4. Architectural anti-patterns (god objects, circular deps, tight coupling)
5. Type issues (`any`, assertions, `@ts-ignore`)
6. Code smells (long functions, magic numbers, commented code)

**Output:** Relatório em `.audits/architectural-analysis-[timestamp].md`

---

## Matriz de Decisão

| Cenário | Usar |
|---|---|
| Revisão rápida de diff/commit | `code-review` |
| PR do GitHub com comentários inline | `comprehensive-review` |
| Revisão com modelo específico | `cross-review` |
| Revisão programática (JSON) | `zen-review` |
| Revisão multi-modelo (mais robusta) | `zen-comprehensive-review` |
| Anti-patterns / dead code / duplicação | `architectural-analysis` |
| Verificação pré-commit ou PR | `requesting-code-review` |
| Processar feedback recebido | `receiving-code-review` |
| Revisão no stack do projeto | `review` (task agent) |
