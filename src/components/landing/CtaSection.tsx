import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

export function CtaSection() {
  const navigate = useNavigate();
  return (
    <section id="cta" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-indigo-950 to-[#0F172A] p-1 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]"
        >
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-gradient-to-br from-[#1e293b] to-[#0f172a] px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{
              background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(99,102,241,0.8), transparent)"
            }} />

            <Sparkles className="mx-auto h-8 w-8 text-indigo-400" />
            <h2 className="mt-4 text-[clamp(28px,4vw,48px)] font-bold leading-[0.96] tracking-[-0.03em] text-white">
              Pronto para transformar
              <br />
              sua gestão?
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-indigo-200/80">
              Comece grátis. Sem cartão de crédito. Setup em menos de 15 minutos.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group relative gap-2 rounded-full bg-white px-8 py-6 text-base text-[#0F172A] shadow-sm hover:bg-indigo-50 active:scale-[0.98] transition-transform" onClick={() => navigate("/login")}>
                Começar Grátis
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 rounded-full border-indigo-400/30 px-8 py-6 text-base text-indigo-200 hover:bg-indigo-900/50 hover:text-white active:scale-[0.98] transition-transform">
                <Shield className="h-4 w-4" />
                Falar com Vendas
              </Button>
            </div>

            <p className="mt-6 text-xs text-indigo-300/60">
              Grátis por 14 dias · Cancele quando quiser · Sem compromisso
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
