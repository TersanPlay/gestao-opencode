import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderAction {
  label: string;
  to: string;
  icon?: LucideIcon;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: PageHeaderAction;
  secondaryActions?: PageHeaderAction[];
}

export function PageHeader({ title, description, action, secondaryActions }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {secondaryActions?.map((sa) => {
          const Icon = sa.icon;
          return (
            <Button key={sa.to} variant="outline" onClick={() => navigate(sa.to)} className="gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {sa.label}
            </Button>
          );
        })}
        {action && (
          <Button onClick={() => navigate(action.to)} className="gap-2">
            {action.icon ? <action.icon className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
