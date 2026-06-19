import { motion } from "motion/react";
import { FileText, GraduationCap, Mail, Download, Cog, Upload, PieChart, Clock, Bell, ShieldCheck } from "lucide-react";

const modules = [
  {
    title: "Gestão Documental",
    description: "Upload, download e organização de documentos por colaborador. Arraste arquivos PDF, DOC, XLS e imagens com segurança.",
    span: "lg:col-span-2",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    borderGlow: "group-hover:border-blue-400/50",
    shadowGlow: "group-hover:shadow-blue-500/10",
    icon: FileText,
    stats: ["Armazenamento seguro", "20MB por arquivo", "Múltiplos formatos"],
    detail: (
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Upload className="h-3 w-3 text-blue-500" /> Upload</span>
        <span className="flex items-center gap-1"><Download className="h-3 w-3 text-blue-500" /> Download</span>
        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-blue-500" /> Controle</span>
      </div>
    ),
  },
  {
    title: "Cursos & Treinamentos",
    description: "Matricule colaboradores em cursos, acompanhe progresso e status: pendente, em andamento ou concluído.",
    span: "lg:col-span-1",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    borderGlow: "group-hover:border-emerald-400/50",
    shadowGlow: "group-hover:shadow-emerald-500/10",
    icon: GraduationCap,
    stats: ["Carga horária", "Status tracking", "Histórico completo"],
    detail: (
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Pendente</span>
        <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">Em andamento</span>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Concluído</span>
      </div>
    ),
  },
  {
    title: "Notificações por Email",
    description: "Configure servidor SMTP e dispare notificações automáticas para avaliações, metas e eventos importantes.",
    span: "lg:col-span-1",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    borderGlow: "group-hover:border-amber-400/50",
    shadowGlow: "group-hover:shadow-amber-500/10",
    icon: Mail,
    stats: ["SMTP configurável", "Disparo automático", "Logs de envio"],
    detail: (
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Bell className="h-3 w-3 text-amber-500" /> Alertas</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" /> Agendado</span>
      </div>
    ),
  },
  {
    title: "Exportação CSV",
    description: "Exporte dados de colaboradores e avaliações com filtros inteligentes. Planilhas prontas para análise em Excel ou Google Sheets.",
    span: "lg:col-span-2",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    lightText: "text-violet-700",
    borderGlow: "group-hover:border-violet-400/50",
    shadowGlow: "group-hover:shadow-violet-500/10",
    icon: Download,
    stats: ["Filtros dinâmicos", "UTF-8 + BOM", "Pronto para Excel"],
    detail: (
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700">Colaboradores</span>
        <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700">Avaliações</span>
        <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700">Filtros</span>
      </div>
    ),
  },
  {
    title: "Automações Inteligentes",
    description: "Lembretes automáticos de avaliações, fechamento de ciclos, backups agendados e disparo de notificações — tudo sem intervenção manual.",
    span: "lg:col-span-3",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    lightBg: "bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50",
    lightText: "text-indigo-700",
    borderGlow: "group-hover:border-indigo-400/50",
    shadowGlow: "group-hover:shadow-indigo-500/10",
    icon: Cog,
    stats: ["Cron jobs", "Lembretes", "Backups", "Fechamento automático"],
    detail: (
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-medium text-indigo-700"><Clock className="h-3 w-3" /> Avaliações pendentes</span>
        <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-[11px] font-medium text-purple-700"><Cog className="h-3 w-3" /> Fechar ciclos</span>
        <span className="flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-[11px] font-medium text-pink-700"><Bell className="h-3 w-3" /> Notificações</span>
      </div>
    ),
  },
];

function BentoCard({ mod, index }: { mod: typeof modules[number]; index: number }) {
  const Icon = mod.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-1 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-xl ${mod.shadowGlow} ${mod.span}`}
    >
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${mod.lightBg}`} />
      <div className="relative rounded-[calc(1.5rem-0.375rem)] bg-card p-6 h-full">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${mod.gradient} text-white shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold">{mod.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {mod.description}
        </p>
        {mod.detail}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          {mod.stats.map((stat) => (
            <span key={stat} className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">{stat}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function BentoModules() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
            Novos Módulos
          </span>
          <h2 className="mt-4 text-[clamp(32px,5vw,56px)] font-bold leading-[0.96] tracking-[-0.03em] text-[#0F172A]">
            Potencialize sua gestão
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-muted-foreground">
            Cinco novos módulos para levar o controle da sua empresa ao próximo nível — tudo integrado e automatizado.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <BentoCard key={mod.title} mod={mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
