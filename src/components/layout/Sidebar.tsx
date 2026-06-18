import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  CalendarCheck,
  BarChart3,
  Bell,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  User,
  Upload,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const allNavItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "gestor", "assessor", "operator"] },
  { to: "/users", label: "Usuários", icon: Users, roles: ["admin", "gestor"] },
  { to: "/departments", label: "Departamentos", icon: Building2, roles: ["admin", "gestor"] },
  { to: "/visitors", label: "Visitantes", icon: UserCheck, roles: ["admin", "gestor", "assessor", "operator"] },
  { to: "/visitors/schedule", label: "Agendamento", icon: CalendarCheck, roles: ["admin", "gestor", "assessor", "operator"] },
  { to: "/reports", label: "Relatórios", icon: BarChart3, roles: ["admin", "gestor", "assessor"] },
  { to: "/performance/my-dashboard", label: "Meu Desempenho", icon: User, roles: ["admin", "gestor", "assessor", "operator"] },
  { to: "/performance/profiles", label: "Perfil-CMP", icon: ClipboardList, roles: ["admin", "gestor", "assessor"] },
  { to: "/performance/profiles/import", label: "Importar", icon: Upload, roles: ["admin", "gestor"] },
  { to: "/performance/dashboard", label: "Dashboard RH", icon: LayoutDashboard, roles: ["admin"] },
  { to: "/performance/team-dashboard", label: "Dashboard Equipe", icon: Users, roles: ["gestor"] },
  { to: "/performance/cycles", label: "Ciclos", icon: CalendarCheck, roles: ["admin", "gestor"] },
  { to: "/notifications", label: "Notificações", icon: Bell, roles: ["admin", "gestor", "assessor", "operator"] },
  { to: "/logs", label: "Auditoria", icon: Shield, roles: ["admin"] },
  { to: "/settings", label: "Configurações", icon: Settings, roles: ["admin"] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const navItems = allNavItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-black/5 bg-white transition-all duration-500",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-black/5 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-sm font-bold shadow-sm">
          G
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Gestão Corporate
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-black/5 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
