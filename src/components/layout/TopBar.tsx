import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Usuários",
  "/departments": "Departamentos",
  "/visitors": "Visitantes",
};

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const basePath = "/" + location.pathname.split("/")[1];
  const title = pageTitles[basePath] || "Gestão Corporativa";

  return (
    <header className="sticky top-0 z-30 mx-auto mt-4 w-[calc(100%-2rem)] max-w-7xl">
      <div className="flex h-14 items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="h-9 w-56 rounded-xl border-none bg-muted pl-9 text-sm placeholder:text-muted-foreground/60"
            />
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-black/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xs font-medium">
              {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "AD"}
            </div>
            <div className="hidden md:block text-sm leading-tight">
              <p className="font-medium text-foreground">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "admin@org.com"}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => { logout(); navigate("/"); }}
            className="text-muted-foreground hover:text-foreground"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
