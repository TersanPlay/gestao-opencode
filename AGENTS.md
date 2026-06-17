<!-- modern-ui-begin -->
Regras de UI para este projeto Vite + React + TypeScript + Tailwind CSS v4.

## Componentes modernos (react-aria-components / shadcn/ui)

Sempre usar componentes do projeto em `src/components/ui/` em vez de HTML nativo.
Componentes compartilhados em `src/components/shared/`.

### Substituicoes por tipo

| Tipo | Html nativo (nao usar) | Componente do projeto |
|------|------------------------|----------------------|
| Botao | `<button>` | `Button` — variants: default, secondary, outline, ghost, destructive, link, indigo. Sizes: sm, default, lg, icon |
| Input texto | `<input>` | `Input` — com `Label` + `id` para acessibilidade |
| Label | `<label>` | `Label` — usar `htmlFor` vinculado ao `id` do input |
| Select | `<select>` + `<option>` | `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` (Radix UI) |
| Data/hora | `<input type="date">` ou `<input type="datetime-local">` | `JollyDatePicker` (date-range-picker.tsx) + `JollyTimeField` (datefield.tsx) |
| Modal | `<dialog>` ou div manual | `Dialog` — com `open`, `onOpenChange`, `title`, `description` |
| Tabela | `<table>` puro | `Table` + `TableHeader` + `TableBody` + `TableRow` + `TableCell` + `TableHead` |
| Card | div com borda manual | `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter` |
| Badge | span com classe manual | `Badge` — variants: default, secondary, outline, success, warning, destructive, info, slate |
| Avatar | img com fallback manual | `Avatar` — props: name (iniciais), size (sm/md/lg) |
| Checkbox | `<input type="checkbox">` | `Checkbox` |
| Textarea | `<textarea>` | `Textarea` |
| Busca | input + botao manual | `SearchInput` — `value`, `onChange`, `placeholder` |
| Estado vazio | div manual | `EmptyState` — `title`, `description`, `action?` (`{ label, to }`) |
| Cabecalho pagina | div manual | `PageHeader` — `title`, `description`, `action?`, `secondaryActions?` |
| Status visitante | span manual | `VisitorStatusBadge` — `status`: registered, scheduled, checking_in, in_progress, completed, cancelled |
| Papel usuario | span manual | `UserRoleBadge` — `role`: admin, gestor, assessor, operator |

## Icones
- Usar `lucide-react` — nunca emoji como icone.
- Icones decorativos: `aria-hidden="true"`.
- Botoes icone: `aria-label` descritivo.

## Estilo
- Tailwind CSS v4 (sem `@apply` em componentes, usar className direto).
- Padrao: `rounded-xl` em cards/inputs, `gap-3`/`gap-4` em layouts.
- Cores semanticas: `bg-background`, `text-muted-foreground`, `border-input`, `bg-accent`, `text-accent-foreground`.
- Cards: `border border-border bg-card text-card-foreground shadow-sm`.

## Formularios
- Usar `react-hook-form` + `zod` com `@hookform/resolvers` para validacao.
- Campos obrigatorios marcados com `required` no HTML.
- `toast` do `sonner` para feedback de sucesso/erro.

## Acessibilidade
- `focus-visible:ring-2 ring-ring ring-offset-2` em elementos interativos.
- `aria-label` em botoes icone.
- `aria-hidden="true"` em icones decorativos.
- Ordem tab logica (Select e Dialog operam por teclado nativamente).

## Nao usar
- HTML nativo `<input type="date">` ou `<input type="datetime-local">`.
- `alert()` / `confirm()` / `prompt()`.
- Emoji como icone UI.
- CSS Modules ou styled-components.
- Bibliotecas de icone que nao sejam `lucide-react`.
- `@apply` em componentes.
<!-- modern-ui-end -->
