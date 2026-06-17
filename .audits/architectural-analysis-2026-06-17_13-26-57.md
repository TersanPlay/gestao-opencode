
# Architectural Analysis Report

**Project**: Gestão Corporativa (Vite + React + TypeScript + Tailwind CSS v4)
**Date**: 2026-06-17
**Files Analyzed**: 56 source files (2528 .ts, 96 .tsx)
**Audit Date**: 2026-06-17_13-26-57

---

## Executive Summary

| Category | Count | Severity |
|----------|-------|----------|
| Dead Code | 5 exports unused | MEDIUM |
| Duplicated Functionality | 2 groups (CRITICAL) | HIGH |
| Architectural Anti-Patterns | 4 issues | HIGH |
| Type Issues | 6 instances | MEDIUM |
| Code Smells | 8 instances | LOW |

**Cleanup Potential**: ~150 lines dead/duplicated

---

## Dead Code

### Unused Exports in src/lib/permissions.ts

| Export | Status | Confidence |
|--------|--------|------------|
| canAny() | DEAD — never imported anywhere | HIGH |
| hasRouteAccess() | DEAD — never imported anywhere | HIGH |
| ROLE_LABELS | DEAD — never imported anywhere | HIGH |
| ROLE_HIERARCHY | DEAD — never imported anywhere | HIGH |
| can() | **POSSIBLY_DEAD** — imported only in AuthContext but AuthContext reimplements its own can() | MEDIUM |

**Analysis**: The entire permissions.ts module is unused in practice. AuthContext has its own copy of the PERMISSIONS map and can() method. No page imports from permissions.ts.

### Unused API Exports in src/services/api.ts

| Export | Status | Confidence |
|--------|--------|------------|
| deleteVisitor() | DEAD — no delete action on visitor pages | HIGH |
| createTimelineEvent() | DEAD — no UI creates timeline events | HIGH |

---

## Duplicated Functionality

### CRITICAL: Permissions Map (2 copies)

**Instances**: 2
- src/lib/permissions.ts:5-29 — Full PERMISSIONS map
- src/contexts/AuthContext.tsx:25-37 — Identical PERMISSIONS map

**Analysis**: Exact copy-paste. Any permission change requires updating both files.
**Lines**: ~30 lines × 2 = 60 lines duplicated
**Recommendation**: Delete permissions.ts, keep only AuthContext version. Or export from permissions.ts and import in AuthContext.

### HIGH: statusActions Array (2 copies)

**Instances**: 2
- src/pages/VisitorDetailPage.tsx:14-20
- src/pages/VisitorSchedulePage.tsx:39-45

**Analysis**: Identical workflow definitions for visitor status transitions.
**Lines**: ~7 lines × 2 = 14 lines duplicated
**Recommendation**: Extract to shared constant in src/lib/visitor-utils.ts.

---

## Architectural Anti-Patterns

### God Object: DesignSystemPage.tsx (635 lines)
**File**: src/pages/DesignSystemPage.tsx
**Issue**: Single component with 8 sections, 7 data arrays, states for every demo component.
**Impact**: Hard to test, navigate, or modify individual sections.
**Recommendation**: Split into section components per feature (ColorsSection, ButtonsSection, etc.).

### Duplicated Auth — No Single Source of Truth
**Issue**: permissions.ts and AuthContext.tsx both define same permissions logic. The can() function exists in both places with identical implementation.
**Impact**: Permission changes must be made in two files. Inconsistent behavior possible.
**Recommendation**: AuthContext should import can() from permissions.ts instead of redefining.

### Type Conflict: User Shape Mismatch
**Issue**: 
- src/types/index.ts:7 — User { id: string, departmentId: string }
- src/contexts/AuthContext.tsx:4 — Local User { id: number, departmentId: number | null }

**Impact**: Runtime type confusion. DashboardPage imports from @/types but API returns whatever format AuthContext defines.
**Recommendation**: Align types — use consistent id and departmentId types across codebase.

### Layer Violation: Components Import API Directly
**Issue**: Pages like VisitorsPage, DashboardPage import getVisitors from @/services/api directly instead of going through a service layer.
**Impact**: Tight coupling. Changing API shape means updating every page.
**Recommendation**: Add service layer between pages and API.

---

## Type Issues

| File | Line | Issue | Severity |
|------|------|-------|----------|
| src/pages/LoginPage.tsx | 24 | catch (err: any) — bypasses type safety | MEDIUM |
| src/pages/VisitorFormPage.tsx | 24 | catch (err: any) — bypasses type safety | MEDIUM |
| src/contexts/AuthContext.tsx | 4-10 | Local User type uses 
umber for ids, conflicts with @/types User (string IDs) | HIGH |
| src/types/index.ts | 77 | ReportVisitors.byDepartment[].departmentId: number | null inconsistent with Department.id: string | MEDIUM |
| src/pages/VisitorSchedulePage.tsx | 56 | setScheduleDate(new CalendarDate(...)) — passing 
umber to CalendarDate constructor without day parameter | LOW |

---

## Code Smells

### Long Components (>400 lines)
| File | Lines | Issue |
|------|-------|-------|
| src/pages/DesignSystemPage.tsx | 635 | God component, 8 sections in one file |
| src/pages/VisitorSchedulePage.tsx | 414 | Complex state management, 2 modals inline |

### Duplicate Constants
| Constant | Files |
|----------|-------|
| purposeOptions (13 strings) | VisitorSchedulePage.tsx:23 — defined but also magic strings scattered |

### Magic Numbers
| File | Value | Should Be |
|------|-------|-----------|
| src/pages/ReportVisitorsPage.tsx:18 | 86400000 | MS_PER_DAY |

### Unused Imports
- ReportDepartmentsPage.tsx: imports Users, Clock, Calendar from lucide — never used
- VisitorSchedulePage.tsx: imports Search from lucide — never used
- VisitorDetailPage.tsx: statusColors object defined (line 22-28) but never used as className

---

## Impact Assessment

### Code Cleanup Potential
- **Dead code removal**: ~80 lines (permissions.ts, 2 API functions)
- **Duplication consolidation**: ~74 lines (permissions map, statusActions)
- **Total reduction**: ~154 lines (~4% of src code)

### Maintainability Improvement
- Single source of truth for permissions
- No type confusion between local User and global User types
- Easier to test split components

---

## Recommendations (Priority Order)

1. **HIGH** — Delete permissions.ts and use AuthContext's version, OR import from permissions.ts in AuthContext
2. **HIGH** — Fix type conflict: align AuthContext User type with @/types/index.ts User type
3. **MEDIUM** — Extract statusActions to shared constant
4. **MEDIUM** — Replace catch (err: any) with typed error handling
5. **LOW** — Split DesignSystemPage.tsx into section components
6. **LOW** — Remove unused imports (lucide icons in report pages)

---

## Applied Fixes (2026-06-17)

| # | Status | Action | Details |
|---|--------|--------|---------|
| 1 | ✅ DONE | Deduplicate permissions | `permissions.ts` now single source of truth. `AuthContext.tsx` imports `can()` from it. Removed duplicate `PERMISSIONS` map from AuthContext. Removed dead exports (`canAny`, `hasRouteAccess`, `ROLE_LABELS`, `ROLE_HIERARCHY`). |
| 2 | ✅ DONE | Fix type conflict | Renamed AuthContext local `User` → `AuthUser` to avoid confusion with `@/types.User`. |
| 3 | ✅ DONE | Extract `statusActions` | Created `src/lib/visitor-utils.ts` with `STATUS_ACTIONS`. Both `VisitorDetailPage` and `VisitorSchedulePage` import from it. Duplicate removed. |
| 4 | ✅ DONE | Replace `catch (err: any)` | `LoginPage.tsx` — replaced with `err instanceof Error` check. `VisitorFormPage.tsx` had bare `catch { }`, no change needed. |
| 5 | ⏸️ SKIPPED | Split DesignSystemPage | 635-line god component. Requires larger refactor—deferred. |
| 6 | ✅ DONE | Remove unused imports | `ReportDepartmentsPage.tsx`: removed `Users`, `Clock`, `Calendar`. `VisitorSchedulePage.tsx`: removed `Search`. `DesignSystemPage.tsx`: removed `Info`, `User`. `VisitorDetailPage.tsx`: removed unused `statusColors` block. |

### Files Changed
- `src/lib/permissions.ts` — kept `can()`, removed dead exports
- `src/contexts/AuthContext.tsx` — imports `can()` from permissions.ts, removed duplicate PERMISSIONS, renamed `User` → `AuthUser`
- `src/lib/visitor-utils.ts` — **new file**, shared `STATUS_ACTIONS`
- `src/pages/VisitorDetailPage.tsx` — imports STATUS_ACTIONS, removed local duplicate + unused statusColors
- `src/pages/VisitorSchedulePage.tsx` — imports STATUS_ACTIONS, removed local duplicate, cleaned unused import
- `src/pages/ReportDepartmentsPage.tsx` — cleaned unused lucide imports
- `src/pages/DesignSystemPage.tsx` — cleaned unused lucide imports
- `src/pages/LoginPage.tsx` — typed error handling

**TypeScript**: `tsc --noEmit` — clean, no errors.

