import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Resource, Action, UserRole } from "@/types";

interface PermissionGateProps {
  action?: Action;
  resource?: Resource;
  roles?: UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({ action, resource, roles, fallback = null, children }: PermissionGateProps) {
  const { user, can } = useAuth();

  if (!user) return null;

  if (roles && roles.includes(user.role)) return <>{children}</>;

  if (action && resource && can(action, resource)) return <>{children}</>;

  if (!roles && !action && !resource) return null;

  return <>{fallback}</>;
}
