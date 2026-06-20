# Architectural Analysis Report

**Date**: 2026-06-19
**Project**: Gestão Corporate (Vite + React + TypeScript + Tailwind + Express + SQLite)
**Files Analyzed**: 103 source files (76 .tsx, 7 .ts, 29 .cjs)
**Dead Code Exports**: 45 (28 HIGH confidence, 6 POSSIBLY_DEAD)
**Duplication Groups**: 12 (2 EXACT, 4 SIMILAR, 6 CONCEPTUAL)
**Type Issues**: 30 `any` usages, 2 `as any`, 0 `@ts-ignore`
**Code Smells**: 6 long functions, 10 magic numbers, 11 empty catch blocks

---

## Executive Summary

- **Dead Code**: 45 exports unused across 24 files — mostly UI component sub-exports and landing page orphans
- **Duplicated Functionality**: 12 duplication groups — historico INSERT SQL copied 9× in 5 files, filter builder pattern in 8 files
- **Architectural Anti-Patterns**: 0 circular dependencies, 1 layer violation (api.ts mutation of DOM), no god objects >600 lines
- **Type Issues**: 30 explicit `any` usages (mostly CursosPage and PerfilCMPDetailPage), 2 unsafe `as any` casts
- **Code Smells**: 6 components >200 lines, 10 magic numbers, 11 empty catch blocks swallowing errors

**Estimated Cleanup**: Remove ~250 lines of dead code, consolidate 6 duplication groups

---

## Dead Code

### Completely Dead Files (DELETE)

| File | Reason | Confidence |
|------|--------|------------|
| `src/components/landing/Demo.tsx` | Never imported by any file | HIGH |
| `src/components/landing/Testimonials.tsx` | Never imported by any file | HIGH |
| `src/components/landing/CtaSection.tsx` | Never imported by any file | HIGH |

**Total Lines**: ~120 lines can be deleted

### Dead Exports (REMOVE)

| File | Export | Reason |
|------|--------|--------|
| `src/components/ui/calendar.tsx` | CalendarHeading, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, Calendar, RangeCalendar, JollyCalendar, JollyRangeCalendar (9 exports) | Sub-components never imported — only `calendar.tsx` itself is imported |
| `src/components/ui/datefield.tsx` | DateField, DateSegment, TimeField, JollyDateField (4 exports) | Never imported — date-range-picker imports only DateInput internally |
| `src/components/ui/date-range-picker.tsx` | DatePicker, DatePickerContent, DateRangePicker (3 exports) | Never imported by any page |
| `src/components/ui/popover.tsx` | PopoverTrigger, PopoverDialog (2 exports) | Never imported |
| `src/components/ui/select.tsx` | SelectGroup (1 export) | Never imported |
| `src/components/ui/field.tsx` | labelVariants, FieldGroup, FormDescription (3 exports) | Never imported |
| `src/services/api.ts` | updateUser, updateDepartment, deleteVisitor, createTimelineEvent, deleteColaborador, deleteAvaliacao, getCursoById (7 exports) | Functions defined but endpoint never called by any component |
| `src/types/index.ts` | AvaliacaoCompetencia (1 export) | Interface defined but never imported |

### Dead Type Exports (REMOVE)

| File | Export | Reason |
|------|--------|--------|
| `src/components/ui/button.tsx` | `ButtonProps` | Interface never imported |
| `src/components/ui/badge.tsx` | `BadgeProps` | Interface never imported |
| `src/components/ui/textarea.tsx` | `TextareaProps` | Interface never imported |
| `src/components/ui/orbiting-circles.tsx` | `OrbitingCirclesProps` | Interface never imported |
| `src/components/ui/checkbox.tsx` | `CheckboxProps` | Type never imported |
| `src/components/ui/calendar.tsx` | `JollyCalendarProps`, `JollyRangeCalendarProps` | Types never imported |
| `src/components/ui/datefield.tsx` | `DateInputProps`, `JollyDateFieldProps`, `JollyTimeFieldProps` | Types never imported |
| `src/components/ui/date-range-picker.tsx` | `JollyDatePickerProps`, `JollyDateRangePickerProps` | Types never imported |

### Possibly Dead (VERIFY)

| File | Export | Reason | Verification Needed |
|------|--------|--------|---------------------|
| `server/routes/notifications.cjs` | `notifyUser` | Exported but never imported externally — only called internally by `notifyDepartmentUsers`/`notifyAdmins` | Check if any future module needs import |
| `src/components/ui/field.tsx` | Label (react-aria), FieldError | Used only internally by datefield.tsx/date-range-picker.tsx; main app uses label.tsx Label | Could consolidate with label.tsx |
| `src/components/ui/popover.tsx` | Popover | Only used internally by date-range-picker.tsx | Could inline |
| `src/components/ui/datefield.tsx` | DateInput | Only used internally by date-range-picker.tsx | Could inline |
| `src/components/ui/button.tsx` | buttonVariants | Only used internally by calendar.tsx | Could inline |

---

## Duplicated Functionality

### EXACT: CRITICAL

#### Duplication Group 1: Historico Colaborador INSERT SQL

**Instances**: 9
**Files**:
- `server/routes/avaliacoes.cjs:90`
- `server/routes/colaboradores.cjs:136,164,248`
- `server/routes/feedbacks.cjs:37`
- `server/routes/metas.cjs:47,73`
- `server/routes/pdi.cjs:46,70`

**Analysis**: Same SQL INSERT statement copied verbatim 9 times across 5 route files. Columns: `(colaboradorId, tipo, descricao, dataReferencia) VALUES (?, ?, ?, ?)`
**Lines Duplicated**: ~5 lines × 9 = 45 lines
**Impact**: Schema changes require edits in 5 files
**Recommendation**: Extract to `db.cjs` as `db.insertHistorico(colaboradorId, tipo, descricao, dataReferencia)`

#### Duplication Group 2: colaboradorId + cicloId Filter Block

**Instances**: 3
**Files**:
- `server/routes/avaliacoes.cjs:17-19`
- `server/routes/metas.cjs:16-19`
- `server/routes/pdi.cjs:16-19`

**Analysis**: Identical 4-line conditional filter builder (const conditions, const params, if colaboradorId push, if cicloId push)
**Lines Duplicated**: ~4 lines × 3 = 12 lines
**Recommendation**: Extract to a shared helper `buildFilter(colaboradorId, cicloId, alias)` in db.cjs

### SIMILAR: HIGH

#### Duplication Group 3: Colaborador Filter Builder

**Instances**: 2
**Files**:
- `server/routes/colaboradores.cjs:15-41` (GET list)
- `server/routes/export.cjs:15-26` (CSV export)

**Analysis**: Near-identical filter construction (search, departamentoId, cargo, status, gestorId, vinculo). Same 6 filter fields, same conditions+params array pattern, same LIKE clauses.
**Lines Duplicated**: ~25 lines × 2 = 50 lines
**Impact**: Adding a filter field requires updating both endpoints
**Recommendation**: Extract to a shared `buildColaboradorFilter(query)` function

#### Duplication Group 4: Conditions/Params Query Builder Pattern

**Instances**: 8
**Files**: avaliacoes.cjs, colaboradores.cjs, export.cjs, feedbacks.cjs, logs.cjs, metas.cjs, pdi.cjs, visitors.cjs

**Analysis**: The `conditions = []; params = []; if (x) { conditions.push(...); params.push(...) } ... WHERE conditions.join(' AND ')` template appears in all 8 files.
**Lines Duplicated**: ~20 lines × 8 = 160 lines
**Impact**: Standard idiom but creates maintenance surface area
**Recommendation**: Optional — extract to a lightweight query builder helper

#### Duplication Group 5: Two Label Components

**Instances**: 2
**Files**:
- `src/components/ui/label.tsx` — renders native `<label>` (used by 19 pages)
- `src/components/ui/field.tsx` — renders react-aria Label (used internally by 2 date components)

**Analysis**: Same conceptual purpose, different implementations. One uses native HTML, the other wraps react-aria.
**Impact**: Confusing API surface — could consolidate into a single Label
**Recommendation**: If Shadcn/ui compatible, replace all usages with the label.tsx variant and remove from field.tsx

### CONCEPTUAL: MEDIUM

#### Duplication Group 6: 404 Not Found Checks

**Instances**: 26
**Files**: 11 route files (avaliacoes, ciclos, colaboradores, cursos, departments, documentos, export, pdi, timeline, users, visitors)

**Analysis**: `if (!record) return res.status(404).json({ error: 'X nao encontrado' })` pattern repeated 26×
**Impact**: Slight inconsistency in error messages
**Recommendation**: Add `db.notFound(res, 'Resource')` helper

#### Duplication Group 7: Role List Repetition

**Instances**: ~12
**Files**: 12 route files

**Analysis**: `checkRole("admin", "gestor", "assessor", "operator")` repeated as the permissive access tier
**Impact**: Role changes require updates across files
**Recommendation**: Define `const ALL_ROLES = ["admin", "gestor", "assessor", "operator"]` in rbac.cjs

#### Duplication Group 8: Form Page Layout

**Instances**: 9 form pages
**Files**: DepartmentFormPage, CycleFormPage, UserFormPage, VisitorFormPage, PerfilCMPFormPage, MetaFormPage, PDIFormPage, FeedbackFormPage, EvaluationFormPage

**Analysis**: All follow the same shell pattern: PageHeader + Card + form fields (react-hook-form + zod). Each has unique fields but identical layout wrapper.
**Impact**: Medium — form scaffolding code duplicated
**Recommendation**: Extract a generic `FormPageLayout` component

#### Duplication Group 9: List Page Pattern

**Instances**: 6 list pages
**Files**: VisitorsPage, DepartmentsPage, UsersPage, PerfilCMPListPage, LogsPage, NotificationsPage

**Analysis**: Shared SearchInput + Table + EmptyState pattern
**Impact**: Low — pattern is already modular via shared components

#### Duplication Group 10: EmptyState vs PageHeader Action Prop

**Instances**: 2 components
**Files**: EmptyState.tsx, PageHeader.tsx

**Analysis**: Both accept `action` with same shape `{ label, to }`; PageHeader also has `secondaryActions`
**Impact**: Minor API overlap
**Recommendation**: Extract shared `ActionButton` type

#### Duplication Group 11: VisitorStatusBadge vs UserRoleBadge

**Instances**: 2 functions
**Files**: StatusBadge.tsx

**Analysis**: Separate badge variants with similar rendering but different semantics
**Impact**: Low — could unify as generic Badge with variant prop
**Recommendation**: Optional refactor

#### Duplication Group 12: Error Handling — Empty Catch Blocks

**Instances**: 11
**Files**: ProfilePage, SettingsPage (×3), UserFormPage, VisitorFormPage, CursosPage, CyclesListPage, PerfilCMPDetailPage (×3)

**Analysis**: `catch {}` or `catch { toast.error(...) }` pattern — no error details logged
**Impact**: Debugging difficulty, silent failures
**Recommendation**: Always log the error: `catch (err) { console.error(err); toast.error(...); }`

---

## Architectural Anti-Patterns

### God Objects

No files over 600 lines. Largest:

| File | Lines | Analysis |
|------|-------|----------|
| `src/pages/DesignSystemPage.tsx` | 595 | Single giant component rendering dozens of examples. Acceptable for a design system page. |
| `src/pages/performance/PerfilCMPDetailPage.tsx` | 487 | Single component handling profile view, evaluations, courses, documents, timeline. **RISK** — violates SRP. |
| `src/pages/VisitorSchedulePage.tsx` | 381 | Calendar + scheduling in one component. Moderate risk. |
| `src/types/index.ts` | 340 | All project types in one file. Acceptable for a project this size. |
| `server/db.cjs` | 289 | Database setup + seeds. Acceptable. |

**Recommendation**: Split `PerfilCMPDetailPage` (~487 lines) into smaller focused components (ProfileInfo, EvaluationList, CourseList, DocumentList, TimelineEvents).

### Circular Dependencies

**None found.** Import graph is clean — Express routes import from services, React pages import from components and services, no bidirectional module imports.

### Tight Coupling

- **Route files → DB direct**: All route files import `db.cjs` directly and execute raw SQL. This is intentional minimalism (no ORM), but means SQL knowledge is scattered.
- **React pages → api.ts direct**: All pages call `api.ts` directly. Acceptable for a small project — no service layer abstraction needed at this scale.

### Layer Violations

- **`src/services/api.ts`** mutates the DOM directly (`document.createElement("a")` for file download). A service should not touch the DOM — download logic belongs in a utility or hook.
- **No other layer violations detected** — pages use components, components use UI primitives. Clean separation.

### Singleton Abuse

- `AuthContext` is the only global state. Acceptable for auth state.
- `db.cjs` exports a singleton database connection. Standard for SQLite + Express.

### Shotgun Surgery

- Adding a new template email key requires: db.cjs seed, email-templates.cjs default, settings.cjs allowed list, route file trigger — 4 files. Moderate.
- Adding a new filter to colaborador list requires: route file + export file + frontend filter component — 3 files. Moderate.

---

## Type Issues

### `any` Usage (30 instances)

| File | Count | Context |
|------|-------|---------|
| `src/pages/performance/CursosPage.tsx` | 15 | `catch (err: any)`, `filter((v: any) => ...)`, `map((c: any) => ...)` |
| `src/pages/performance/PerfilCMPDetailPage.tsx` | 5 | `catch (err: any)`, `map((c: any) => ...)`, `competencias: any[]` |
| `src/services/api.ts` | 4 | `Promise<any>`, `data: any` in curso functions |
| `src/pages/performance/PerfilCMPListPage.tsx` | 2 | `params?: any` |
| Various pages | 4 | `catch (err: any)` in CycleFormPage, CyclesListPage, EvaluationFormPage, FeedbackFormPage, ImportProfilesPage, MetaFormPage, PDIFormPage |

**Concentration**: 15/30 (50%) in CursosPage alone. This page was likely developed quickly without proper typing.

**Recommendation**: Define proper interfaces for curso/vinculo data and replace `any` in CursosPage and PerfilCMPDetailPage.

### Type Assertions (2 instances)

| File | Line | Assertion | Issue |
|------|------|-----------|-------|
| `src/pages/performance/MetaFormPage.tsx` | 49 | `payload as any` | Bypasses type safety when calling createMeta |
| `src/pages/performance/PDIFormPage.tsx` | 47 | `payload as any` | Bypasses type safety when calling createPDI |

**Recommendation**: Fix the type mismatch instead of casting.

### @ts-ignore / @ts-expect-error

**Zero instances.** The codebase has no suppressed type errors.

---

## Code Smells

### Long Functions (>200 lines)

| File | Component | Lines | Recommendation |
|------|-----------|-------|----------------|
| `src/pages/DesignSystemPage.tsx` | `DesignSystemPage` | 595 | Acceptable — it's a design system showcase |
| `src/pages/performance/PerfilCMPDetailPage.tsx` | `PerfilCMPDetailPage` | 487 | **Split into sub-components** |
| `src/pages/VisitorSchedulePage.tsx` | `VisitorSchedulePage` | 381 | Consider splitting calendar from scheduling panel |
| `src/pages/performance/CursosPage.tsx` | `CursosPage` | 280 | Consider splitting course list from enrollment management |
| `src/pages/performance/PerfilCMPListPage.tsx` | `PerfilCMPListPage` | 246 | Acceptable for a list page with filters |
| `src/pages/performance/CycleDetailPage.tsx` | `CycleDetailPage` | 254 | Consider splitting evaluation list from cycle metrics |

### Magic Numbers

| File | Line | Value | Should Be |
|------|------|-------|-----------|
| `src/pages/ReportVisitorsPage.tsx` | 18 | `86400000` (24h) | `const MS_PER_DAY = 86400000` |
| `src/pages/VisitorFormPage.tsx` | 51 | `5242880` (5MB) | `const PHOTO_MAX_SIZE = 5 * 1024 * 1024` |
| `src/pages/performance/PerfilCMPDetailPage.tsx` | 347 | `1024` (KB) | `const KB = 1024` |
| `src/pages/UserFormPage.tsx` | 35 | `12` (pwd len) | `const PWD_LENGTH = 12` |
| `src/components/notifications/NotificationBell.tsx` | 20 | `30000` (30s) | `const POLL_INTERVAL_MS = 30000` |
| `src/App.tsx` | 9 | `4000` (4s) | `const TOAST_DURATION_MS = 4000` |
| `src/components/ui/avatar.tsx` | 37 | `5` (bit shift) | `const COLOR_HASH_SHIFT = 5` |
| `src/pages/performance/CyclesListPage.tsx` | 81 | `100`, `50` | `const PROGRESS_THRESHOLDS = { half: 50, complete: 100 }` |
| `src/pages/performance/PerfilCMPListPage.tsx` | 71 | `50` (page) | `const PAGE_SIZE = 50` |
| `src/pages/performance/PerfilCMPListPage.tsx` | 238 | `2` (padding) | `const PAGE_RANGE_PADDING = 2` |

### Empty Catch Blocks (11 instances)

| File | Line | Pattern |
|------|------|---------|
| `src/pages/SettingsPage.tsx` | 70 | `catch {}` — **silent failure** |
| `src/pages/VisitorFormPage.tsx` | 96 | `catch { /* ignore */ }` — **silent failure** |
| `src/pages/performance/CursosPage.tsx` | 108 | `catch { }` — **silent failure** |
| `src/pages/performance/CyclesListPage.tsx` | 29 | `catch {}` — **silent failure** |
| 7 more | various | `catch { toast.error(...) }` — better, but no error logging |

### Poor Naming

| File | Line | Name | Issue |
|------|------|------|-------|
| `src/services/api.ts` | 313 | `a` | `<a>` element — unclear |
| `src/pages/LogsPage.tsx` | 54 | `a` | `<a>` element — unclear |
| `src/pages/NotificationsPage.tsx` | 40 | `m` | Map result — unclear |
| `src/pages/VisitorSchedulePage.tsx` | 75 | `q` | Search query — ambiguous |
| `src/pages/VisitorSchedulePage.tsx` | 96 | `n` | Current time — unclear |
| `src/pages/performance/PerfilCMPListPage.tsx` | 238 | `p` | Page number — acceptable in filter lambda |

### Commented-Out Code

**Zero instances found.** The codebase has no commented-out code.

---

## Statistics

**Dead Code**:
- Files: 3 completely dead (landing components)
- Exports: 45 unused (27 UI sub-exports, 11 type exports, 7 API functions)
- Lines: ~250 estimated

**Duplication**:
- Groups: 12
- Files affected: ~30
- Duplicated lines: ~300

**Architectural Issues**:
- God objects: 1 (PerfilCMPDetailPage)
- Circular dependencies: 0
- Layer violations: 1 (api.ts DOM mutation)

**Type Issues**:
- `any` usage: 30 (15 in CursosPage alone)
- `as any` casts: 2
- `@ts-ignore`: 0
- Missing return types: 3 (implicit any from catch/untyped callbacks)

**Code Smells**:
- Long functions (>200 lines): 6
- Magic numbers: 10
- Empty catch blocks: 11
- Poor naming: 7

---

## Impact Assessment

### Code Cleanup Potential
- **Dead code removal**: ~250 lines (landing components, unused UI sub-exports, dead API functions)
- **Duplication consolidation**: ~300 lines (historico helper, filter builder, query builder)
- **Total reduction**: ~550 lines (4% of codebase)

### Maintainability Improvement
- Historico INSERT extracted to 1 helper vs 9 copies → bug fixes affect 1 file instead of 5
- PerfilCMPDetailPage split from 487 to ~5 × 100-line components
- 30 `any` → proper types → compile-time safety for course/vínculo data
- Named constants instead of magic numbers → self-documenting code

### Risk Areas
- **PerfilCMPDetailPage (487 lines)**: High risk of bugs due to complexity — handles profile, evaluations, courses, documents, timeline, modals
- **CursosPage (280 lines, 15 `any` usages)**: Most type-unsafe file — runtime errors likely
- **Empty catch blocks**: Critical errors silently ignored in settings save, visitor form, curso operations
- **Server duplication**: Changes to historico schema require editing 5 files — high risk of inconsistency

---

## Top Recommendations

| Priority | Action | Effort |
|----------|--------|--------|
| P0 | Fix empty catch blocks — at minimum log the error | 30 min |
| P1 | Extract historico INSERT helper to db.cjs | 15 min |
| P1 | Remove 3 dead landing components (Demo, Testimonials, CtaSection) | 10 min |
| P1 | Type CursosPage — replace 15 `any` with proper interfaces | 1 h |
| P1 | Remove 27 unused UI sub-exports from calendar.tsx, datefield.tsx, date-range-picker.tsx | 20 min |
| P2 | Split PerfilCMPDetailPage into sub-components | 3 h |
| P2 | Fix 2 `as any` casts in MetaFormPage + PDIFormPage | 15 min |
| P2 | Extract colaborador filter builder to shared helper | 30 min |
| P3 | Replace magic numbers with named constants | 30 min |
| P3 | Extract query builder helper for conditions/params pattern | 1 h |
| P3 | Define ALL_ROLES constant in rbac.cjs | 5 min |
| P3 | Remove 7 dead API functions (endpoints exist, no callers) | 20 min |
