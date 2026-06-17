import { motion } from "motion/react";
import { Avatar } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Ana Silva",
    role: "CEO, TechCorp",
    content: "Reduzimos o tempo de gestão de visitantes em 80%. A plataforma transformou a forma como gerenciamos o acesso ao escritório.",
  },
  {
    name: "Carlos Mendes",
    role: "CTO, DataFlow",
    content: "A hierarquia de departamentos é exatamente o que precisávamos. A integração com nossos sistemas foi simples e rápida.",
  },
  {
    name: "Juliana Costa",
    role: "Head de RH, NexSys",
    content: "O controle de permissões por papel facilitou muito a gestão da equipe. Recomendo para qualquer empresa em crescimento.",
  },
  {
    name: "Roberto Alves",
    role: "Diretor Financeiro, PrimeCorp",
    content: "Os relatórios em tempo real nos deram visibilidade completa sobre o fluxo de pessoas na organização.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mb-12 text-center"
        >
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
            Depoimentos
          </span>
          <h2 className="mt-4 text-[clamp(28px,4vw,48px)] font-bold leading-[0.96] tracking-[-0.03em] text-[#0F172A]">
            O que nossos clientes dizem
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-2xl border border-black/5 bg-white p-1.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
            >
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={t.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
