import type { UserRole, Resource, Action } from "@/types";

type Permission = `${Action}:${Resource}`;

const PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "create:users", "read:users", "update:users", "delete:users",
    "create:departments", "read:departments", "update:departments", "delete:departments",
    "create:visitors", "read:visitors", "update:visitors", "delete:visitors",
    "read:reports",
    "read:dashboard",
  ],
  gestor: [
    "create:users", "read:users", "update:users",
    "read:departments",
    "create:visitors", "read:visitors", "update:visitors",
    "read:reports",
    "read:dashboard",
  ],
  assessor: [
    "create:visitors", "read:visitors", "update:visitors",
    "read:reports",
    "read:dashboard",
  ],
  operator: [
    "create:visitors", "read:visitors",
    "read:dashboard",
  ],
};

export function can(role: UserRole | undefined | null, action: Action, resource: Resource): boolean {
  if (!role) return false;
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(`${action}:${resource}`);
}

export function canAny(role: UserRole | undefined | null, ...permissions: Permission[]): boolean {
  if (!role) return false;
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  return permissions.some((p) => perms.includes(p));
}

export function hasRouteAccess(role: UserRole | undefined | null, path: string): boolean {
  if (!role) return false;
  if (role === "admin") return true;
  if (path.startsWith("/dashboard")) return true;
  if (path.startsWith("/visitors")) return true;
  if (path.startsWith("/reports")) return role !== "operator";
  if (path.startsWith("/users")) return role === "gestor";
  if (path.startsWith("/departments")) return false;
  return false;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  assessor: "Assessor",
  operator: "Operador",
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  gestor: 3,
  assessor: 2,
  operator: 1,
};
