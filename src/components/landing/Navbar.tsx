import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Recursos", href: "#features" },
  { label: "Sobre", href: "#demo" },
  { label: "Depoimentos", href: "#testimonials" },
  { label: "Preços", href: "#cta" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed left-1/2 top-4 z-50 w-max max-w-[calc(100%-2rem)] -translate-x-1/2">
      <div className="flex items-center gap-6 rounded-2xl border border-black/5 bg-white/80 px-5 py-2.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xs font-bold shadow-sm">
            G
          </div>
          <span className="text-sm font-semibold">Corporate</span>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm focus-visible:ring-4 focus-visible:ring-indigo-300"
            onClick={() => navigate("/design-system")}
            aria-label="Abrir página do Design System (atalho: Ctrl+Shift+D)"
          >
            Design System
          </Button>
          <Button variant="ghost" size="sm" className="text-sm" onClick={() => navigate("/login")}>
            Entrar
          </Button>
          <Button size="sm" className="rounded-full text-sm" onClick={() => navigate("/login")}>
            Começar Grátis
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-accent md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-black/5 bg-white p-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-black/5" />
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setOpen(false); navigate("/design-system"); }} aria-label="Abrir Design System">
              Design System
            </Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/login")}>
              Entrar
            </Button>
            <Button size="sm" className="justify-center" onClick={() => navigate("/login")}>
              Começar Grátis
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
