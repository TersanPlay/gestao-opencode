import type { UserRole, Resource, Action } from "@/types";

type Permission = `${Action}:${Resource}`;

const PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "create:users", "read:users", "update:users", "delete:users",
    "create:departments", "read:departments", "update:departments", "delete:departments",
    "create:visitors", "read:visitors", "update:visitors", "delete:visitors",
    "create:notifications", "read:notifications", "update:notifications", "delete:notifications",
    "read:logs",
    "read:reports",
    "read:dashboard",
    "update:settings",
    "create:performance", "read:performance", "update:performance", "delete:performance",
  ],
  gestor: [
    "create:users", "read:users", "update:users",
    "read:departments",
    "create:visitors", "read:visitors", "update:visitors",
    "create:notifications", "read:notifications",
    "read:logs",
    "read:reports",
    "read:dashboard",
    "create:performance", "read:performance", "update:performance",
  ],
  assessor: [
    "create:visitors", "read:visitors",
    "read:notifications",
    "read:reports",
    "read:dashboard",
    "read:performance",
  ],
  operator: [
    "create:visitors", "read:visitors", "update:visitors",
    "create:departments", "read:departments", "update:departments", "delete:departments",
    "read:notifications",
    "read:dashboard",
    "read:performance",
  ],
};

export function can(role: UserRole | undefined | null, action: Action, resource: Resource): boolean {
  if (!role) return false;
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(`${action}:${resource}`);
}
