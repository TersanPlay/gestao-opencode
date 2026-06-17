import { motion } from "motion/react";

const logos = [
  "TechCorp", "DataFlow", "Nexus", "PrimeSys",
  "CloudBase", "InovaTI", "GlobalTech", "OmniSol",
];

export function Marquee() {
  return (
    <section className="border-y border-black/5 bg-muted/30 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Empresas que confiam na gente
        </p>
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-16 hover:[animation-play-state:paused]">
            {[...logos, ...logos].map((name, i) => (
              <div
                key={i}
                className="flex h-10 items-center justify-center text-base font-semibold tracking-tight text-muted-foreground/40"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
