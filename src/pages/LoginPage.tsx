import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LightRays } from "@/components/ui/light-rays";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { ArrowLeft, LogIn, AlertCircle, Loader2, Building, Shield, Users, Briefcase, Globe, ChartBar, Fingerprint, Lock, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin.admin@admin.com");
  const [password, setPassword] = useState("admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 p-4">
      <style>{`
        @keyframes dash-flow {
          to { stroke-dashoffset: -200; }
        }
        @keyframes node-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        @keyframes data-particle {
          0% { transform: translateX(0); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translateX(120px); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes shield-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-dash, .animate-node, .animate-particle,
          .animate-glow, .animate-shield { animation: none !important; }
        }
      `}</style>

      {/* Voltar para landing */}
      <button
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      {/* Lado A — Light Rays + Orbiting Circles + Ícones Corporativos */}
      <div
        className="absolute inset-0 z-0"
        style={{ clipPath: "polygon(0 0, 48% 0, 55% 100%, 0 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50" />
        <LightRays color="rgba(99, 102, 241, 0.07)" count={5} speed={20} blur={30} length="70vh" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute">
            <Building className="h-14 w-14 text-slate-600" />
          </div>

          <OrbitingCircles radius={110} duration={30} iconSize={36} path={false}>
            <Shield className="h-9 w-9 text-emerald-500" />
            <Users className="h-9 w-9 text-blue-500" />
            <Briefcase className="h-9 w-9 text-amber-500" />
          </OrbitingCircles>

          <OrbitingCircles radius={200} duration={40} reverse iconSize={28} path={false}>
            <Globe className="h-7 w-7 text-indigo-500" />
            <ChartBar className="h-7 w-7 text-rose-500" />
            <Fingerprint className="h-7 w-7 text-violet-500" />
            <Lock className="h-7 w-7 text-emerald-600" />
            <FileText className="h-7 w-7 text-sky-500" />
          </OrbitingCircles>

          <OrbitingCircles radius={300} duration={50} iconSize={22} path={false}>
            <Shield className="h-5 w-5 text-emerald-400" />
            <Users className="h-5 w-5 text-blue-400" />
            <Briefcase className="h-5 w-5 text-amber-400" />
            <Globe className="h-5 w-5 text-indigo-400" />
            <Lock className="h-5 w-5 text-emerald-500" />
            <ChartBar className="h-5 w-5 text-rose-400" />
          </OrbitingCircles>
        </div>
      </div>

      {/* Lado B — Circuitos / Tech */}
      <div
        className="absolute inset-0 z-0"
        style={{ clipPath: "polygon(48% 0, 100% 0, 100% 100%, 55% 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-50/60 via-blue-50/40 to-white" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="animate-dash" style={{ animation: "dash-flow 28s linear infinite" }}>
            <path d="M600 200 H700 V300 H800" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.5" />
            <path d="M650 350 H750 V250 H850" fill="none" stroke="#818CF8" strokeWidth="1" strokeDasharray="6 8" opacity="0.4" />
            <path d="M620 500 H720 V400 H820" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="10 8" opacity="0.45" />
            <path d="M680 600 H780 V500 H880" fill="none" stroke="#A5B4FC" strokeWidth="1" strokeDasharray="5 10" opacity="0.35" />
            <path d="M640 700 H740 V650 H840" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4" />
            <path d="M660 150 H760" fill="none" stroke="#6366F1" strokeWidth="1" strokeDasharray="6 10" opacity="0.3" />
            <path d="M700 450 H800 V550 H900" fill="none" stroke="#A5B4FC" strokeWidth="1" strokeDasharray="7 7" opacity="0.35" />
          </g>

          <g className="animate-dash" style={{ animation: "dash-flow 35s linear infinite reverse" }}>
            <path d="M750 150 V250 H850" fill="none" stroke="#818CF8" strokeWidth="1" strokeDasharray="6 8" opacity="0.4" />
            <path d="M800 300 V400 H900" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.45" />
            <path d="M700 550 V650 H800" fill="none" stroke="#A5B4FC" strokeWidth="1" strokeDasharray="5 10" opacity="0.35" />
            <path d="M850 200 V300 H950" fill="none" stroke="#818CF8" strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
          </g>

          {/* Nós */}
          {[
            [700, 200], [800, 300], [720, 400], [820, 350],
            [780, 500], [880, 450], [760, 600], [840, 650],
            [740, 700], [800, 550], [850, 250], [750, 150],
            [900, 400], [860, 300], [710, 500],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={2 + (i % 3)}
              fill="#6366F1"
              className="animate-node"
              style={{
                animation: `node-pulse ${5 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}

          {/* Glow */}
          <circle cx="800" cy="300" r="8" fill="#6366F1" className="animate-glow" style={{ animation: "glow-pulse 7s ease-in-out infinite", filter: "blur(4px)", opacity: 0.4 }} />
          <circle cx="760" cy="600" r="6" fill="#818CF8" className="animate-glow" style={{ animation: "glow-pulse 9s ease-in-out infinite 1s", filter: "blur(3px)", opacity: 0.35 }} />
          <circle cx="700" cy="200" r="10" fill="#6366F1" className="animate-glow" style={{ animation: "glow-pulse 8s ease-in-out infinite 0.5s", filter: "blur(5px)", opacity: 0.3 }} />

          {/* Shield */}
          <g className="animate-shield" style={{ animation: "shield-float 14s ease-in-out infinite", transformOrigin: "900px 200px" }}>
            <circle cx="900" cy="200" r="35" fill="none" stroke="#6366F1" strokeWidth="0.5" opacity="0.4" />
            <circle cx="900" cy="200" r="35" fill="none" stroke="#818CF8" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
            <path d="M900 180 L916 188 L916 202 C916 214 900 222 900 222 C900 222 884 214 884 202 L884 188 Z" fill="none" stroke="#6366F1" strokeWidth="1.2" opacity="0.5" />
          </g>

          {/* Partículas */}
          <circle r="2.5" fill="#6366F1" className="animate-particle" style={{ animation: "data-particle 10s linear infinite", position: "absolute" }}>
            <animateMotion dur="10s" repeatCount="indefinite" path="M680 300 L760 300 L760 200" />
          </circle>
          <circle r="2" fill="#818CF8" className="animate-particle" style={{ animation: "data-particle 12s linear infinite 1s" }}>
            <animateMotion dur="12s" repeatCount="indefinite" path="M720 500 L800 500 L800 400" />
          </circle>
          <circle r="2.5" fill="#6366F1" className="animate-particle" style={{ animation: "data-particle 9s linear infinite 0.5s" }}>
            <animateMotion dur="9s" repeatCount="indefinite" path="M700 650 L780 650 L780 550" />
          </circle>
        </svg>
      </div>

      {/* Glow atrás do card para efeito glass */}
      <div className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200/50 via-purple-200/30 to-pink-200/20 blur-3xl" />
      </div>

      {/* Formulário */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-3xl border border-white/30 bg-white/60 p-8 shadow-lg shadow-black/5 backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
              G
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Gestão Corporativa</h1>
            <p className="mt-1 text-sm text-slate-500">Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            admin.admin@admin.com / admin@123
          </p>
        </div>
      </div>
    </div>
  );
}
