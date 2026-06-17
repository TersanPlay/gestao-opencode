import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart3, Users, Building2, UserCheck, ArrowRight } from "lucide-react";

const reportCards = [
  {
    title: "Visitantes",
    description: "Por período, status e departamento",
    icon: UserCheck,
    to: "/reports/visitors",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Departamentos",
    description: "Contagem de visitas por departamento",
    icon: Building2,
    to: "/reports/departments",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Usuários",
    description: "Distribuição por papel e status",
    icon: Users,
    to: "/reports/users",
    color: "bg-amber-50 text-amber-600",
  },
];

export function ReportsIndexPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Relatórios" description="Métricas e análises do sistema" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.to}
              className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
              onClick={() => navigate(card.to)}
            >
              <CardHeader className="pb-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600">
                  Visualizar <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
