import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { UserRole, Resource, Action } from "@/types";
import { can as checkPermission } from "@/lib/permissions";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  departmentId: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  can: (action: Action, resource: Resource) => boolean;
  updateUser: (u: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API = "/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth_token");
    if (saved) {
      setToken(saved);
      fetch(`${API}/me`, { headers: { Authorization: `Bearer ${saved}` } })
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((data) => setUser(data.user))
        .catch(() => { localStorage.removeItem("auth_token"); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erro ao fazer login");
    }
    const data = await res.json();
    localStorage.setItem("auth_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  const can = useCallback((action: Action, resource: Resource): boolean => {
    return checkPermission(user?.role, action, resource);
  }, [user]);

  const updateUser = (u: AuthUser) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, can, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
