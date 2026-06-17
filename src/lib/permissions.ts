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
