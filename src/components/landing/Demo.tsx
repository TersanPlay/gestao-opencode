import { motion } from "motion/react";
import { Play } from "lucide-react";

export function Demo() {
  return (
    <section id="demo" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mb-10 text-center"
        >
          <h2 className="text-[clamp(28px,4vw,48px)] font-bold leading-[0.96] tracking-[-0.03em] text-[#0F172A]">
            Veja como funciona
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-muted-foreground">
            Assista a uma demonstração rápida da plataforma em ação.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl border border-black/5 bg-gradient-to-b from-slate-100 to-white p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)]">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg transition-transform active:scale-95 hover:scale-105">
                    <Play className="h-6 w-6 pl-0.5" />
                  </div>
                  <p className="text-sm font-medium text-indigo-700">Assistir demonstração</p>
                </div>

                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-300" />
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 text-center sm:grid-cols-3">
              {[
                { value: "2.4k+", label: "Empresas ativas" },
                { value: "15min", label: "Setup inicial" },
                { value: "99.9%", label: "Uptime garantido" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
