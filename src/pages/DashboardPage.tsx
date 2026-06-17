import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getDashboardMetrics, getVisitors, getUsers } from "@/services/api";
import type { DashboardMetrics, Visitor, User } from "@/types";
import { Users, Building2, UserCheck, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { VisitorStatusBadge } from "@/components/shared/StatusBadge";

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    getDashboardMetrics().then(setMetrics);
    getVisitors().then((v) => setRecentVisitors(v.slice(0, 4)));
    getUsers().then((u) => setRecentUsers(u.slice(0, 3)));
  }, []);

  if (!metrics) return null;

  const metricCards = [
    { label: "Usuários Ativos", value: metrics.activeUsers, total: metrics.totalUsers, icon: Users, color: "from-indigo-500 to-blue-600" },
    { label: "Departamentos", value: metrics.totalDepartments, icon: Building2, color: "from-emerald-500 to-teal-600" },
    { label: "Visitantes Hoje", value: metrics.totalVisitorsToday, icon: UserCheck, color: "from-amber-500 to-orange-600" },
    { label: "Em Andamento", value: metrics.visitorsInProgress, icon: Clock, color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <Card key={card.label} className="transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">
                    {card.value}
                    {card.total && (
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        / {card.total}
                      </span>
                    )}
                  </p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12% este mês</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Visitantes Recentes</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {recentVisitors.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar name={v.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.company || "Sem empresa"}</p>
                  </div>
                </div>
                <VisitorStatusBadge status={v.status || "registered"} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Usuários do Sistema</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <Badge variant={u.role === "admin" ? "default" : u.role === "gestor" ? "success" : u.role === "assessor" ? "warning" : "slate"}>
                  {u.role === "admin" ? "Admin" : u.role === "gestor" ? "Gestor" : u.role === "assessor" ? "Assessor" : "Operador"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
