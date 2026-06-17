import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      <div className="pointer-events-none fixed inset-0 opacity-[0.12]" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(79,70,229,0.6), transparent)"
      }} />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
            Plataforma Corporativa
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="mt-6 text-[clamp(40px,7vw,80px)] font-bold leading-[0.96] tracking-[-0.035em] text-[#0F172A]"
        >
          Gestão Corporativa
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Inteligente e Segura
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="mx-auto mt-6 max-w-[52ch] text-lg text-muted-foreground leading-relaxed"
        >
          A plataforma completa para gerenciar usuários, departamentos e visitantes 
          com segurança, relatórios em tempo real e integração inteligente.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="group relative gap-2 rounded-full px-8 py-6 text-base shadow-sm active:scale-[0.98] transition-transform" onClick={() => navigate("/login")}>
            Começar Grátis
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
          <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 py-6 text-base active:scale-[0.98] transition-transform">
            <Play className="h-4 w-4" />
            Ver Demonstração
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["AS", "CM", "JC", "RA"].map((initials, i) => (
                <div
                  key={i}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-[10px] font-medium text-indigo-700"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span>+2.4k empresas ativas</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <span>Avaliação 4.9 ★</span>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <span>99.9% uptime</span>
        </motion.div>
      </div>
    </section>
  );
}
