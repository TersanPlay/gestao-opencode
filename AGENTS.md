<!-- modern-ui-begin -->
Regras de UI para este projeto Vite + React + TypeScript + Tailwind CSS v4.

## Componentes modernos (react-aria-components)

Sempre usar componentes do projeto em `src/components/ui/` em vez de HTML nativo.

| Substituir | Usar |
|-----------|------|
| `<input type="date">` / `<input type="datetime-local">` | `JollyDatePicker` + `JollyTimeField` (datefield.tsx) |
| `<input type="text">` com validacao | `Input` + `react-hook-form` + `zod` |
| `<select>` / `<option>` | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` |
| `<dialog>` / modal manual | `Dialog` |
| `<table>` puro | `Table`, `TableHeader`, `TableBody`, etc |
| `<button>` | `Button` com variants (default, outline, ghost, destructive) |
| `<label>` | `Label` |
| `<input type="text">` simples | `Input` |
| `<textarea>` | `Textarea` |
| `<input type="checkbox">` | `Checkbox` |

## Icones
- Usar `lucide-react` — nunca emoji como icone.

## Estilo
- Tailwind CSS v4 (sem `@apply` em componentes, usar className direto)
- Padrao: `rounded-xl` em cards/inputs, `gap-3`/`gap-4` em layouts
- Cores semanticas: `bg-background`, `text-muted-foreground`, `border-input`, `bg-accent`, `text-accent-foreground`

## Formularios
- Usar `react-hook-form` + `zod` com `@hookform/resolvers` para validacao
- Campos obrigatorios marcados com `required` no HTML
- `toast` do `sonner` para feedback de sucesso/erro

## Nao usar
- HTML nativo `<input type="date">` ou `<input type="datetime-local">`
- `alert()` / `confirm()` / `prompt()`
- Emoji como icone UI
- CSS Modules ou styled-components
- Bibliotecas de icone que nao sejam lucide-react
<!-- modern-ui-end -->
