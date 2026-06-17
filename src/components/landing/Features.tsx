import { motion } from "motion/react";
import { Users, Building2, UserCheck, Shield, BarChart3, Bell } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestão de Usuários",
    description: "Cadastre, edite e gerencie usuários com diferentes níveis de permissão e papéis organizacionais.",
    wide: false,
  },
  {
    icon: Building2,
    title: "Departamentos",
    description: "Organize setores e departamentos com hierarquia e atribuição de responsáveis.",
    wide: false,
  },
  {
    icon: UserCheck,
    title: "Controle de Visitantes",
    description: "Registre e acompanhe visitantes com histórico completo e notificações em tempo real.",
    wide: false,
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Autenticação multifator, auditoria de acesso e conformidade com LGPD.",
    wide: true,
  },
  {
    icon: BarChart3,
    title: "Relatórios e Analytics",
    description: "Dashboards em tempo real com métricas de acesso, ocupação e produtividade.",
    wide: false,
  },
  {
    icon: Bell,
    title: "Notificações Inteligentes",
    description: "Alertas automáticos para check-ins, agendamentos e eventos importantes.",
    wide: false,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
            Recursos
          </span>
          <h2 className="mt-4 text-[clamp(32px,5vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-[#0F172A]">
            Tudo que sua empresa precisa
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-muted-foreground">
            Uma plataforma completa com os recursos essenciais para gestão corporativa moderna.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
              className={`rounded-2xl border border-black/5 bg-white p-1.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.10)] ${feature.wide ? "sm:col-span-2" : ""}`}
            >
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
