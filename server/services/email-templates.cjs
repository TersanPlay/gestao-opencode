const db = require("../db.cjs");
const { sendEmail } = require("./email.cjs");

const TEMPLATE_KEYS = [
  "email_template_welcome",
  "email_template_scheduled",
  "email_template_checkin",
  "email_template_started",
  "email_template_finished",
  "email_template_cancelled",
];

const DEFAULTS = {
  email_template_welcome: {
    subject: "Bem-vindo ao {{instituicao_nome}}, {{visitante_nome}}!",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a56db;">Bem-vindo ao {{instituicao_nome}}</h2>
  <p>Ol\u00e1 <strong>{{visitante_nome}}</strong>,</p>
  <p>Seu cadastro no sistema de visitantes do {{instituicao_nome}} foi realizado com sucesso.</p>
  <p>A partir de agora, voc\u00ea pode:</p>
  <ul>
    <li>Agendar visitas aos nossos departamentos</li>
    <li>Receber notifica\u00e7\u00f5es sobre o status da sua visita</li>
    <li>Realizar check-in de forma agilizada</li>
  </ul>
  <p>Em caso de d\u00favidas, entre em contato com a portaria.</p>
  <p style="margin-top: 30px;">Atenciosamente,<br/><strong>Equipe {{instituicao_nome}}</strong></p>
</div>`,
  },
  email_template_scheduled: {
    subject: "Visita agendada - {{instituicao_nome}}",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a56db;">Visita Agendada</h2>
  <p>Ol\u00e1 <strong>{{visitante_nome}}</strong>,</p>
  <p>Sua visita foi agendada com sucesso no <strong>{{instituicao_nome}}</strong>.</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Departamento</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{departamento_nome}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Data/Hora</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{data}}</td>
    </tr>
  </table>
  <p><strong>Importante:</strong> Apresente-se na portaria no hor\u00e1rio agendado com um documento de identifica\u00e7\u00e3o.</p>
  <p style="margin-top: 30px;">Atenciosamente,<br/><strong>Equipe {{instituicao_nome}}</strong></p>
</div>`,
  },
  email_template_checkin: {
    subject: "Check-in registrado - {{instituicao_nome}}",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a56db;">Check-in Realizado</h2>
  <p>Ol\u00e1 <strong>{{visitante_nome}}</strong>,</p>
  <p>Seu check-in foi registrado no <strong>{{instituicao_nome}}</strong>.</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Departamento</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{departamento_nome}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Data/Hora</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{data}}</td>
    </tr>
  </table>
  <p>Dirija-se ao departamento para dar in\u00edcio \u00e0 sua visita.</p>
  <p style="margin-top: 30px;">Atenciosamente,<br/><strong>Equipe {{instituicao_nome}}</strong></p>
</div>`,
  },
  email_template_started: {
    subject: "Visita iniciada - {{instituicao_nome}}",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a56db;">Visita em Andamento</h2>
  <p>Ol\u00e1 <strong>{{visitante_nome}}</strong>,</p>
  <p>Sua visita ao departamento <strong>{{departamento_nome}}</strong> foi iniciada.</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Departamento</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{departamento_nome}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">In\u00edcio</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{data}}</td>
    </tr>
  </table>
  <p>Ao finalizar, dirija-se \u00e0 portaria para registrar sua sa\u00edda.</p>
  <p style="margin-top: 30px;">Atenciosamente,<br/><strong>Equipe {{instituicao_nome}}</strong></p>
</div>`,
  },
  email_template_finished: {
    subject: "Visita finalizada - {{instituicao_nome}}",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a56db;">Visita Finalizada</h2>
  <p>Ol\u00e1 <strong>{{visitante_nome}}</strong>,</p>
  <p>Sua visita ao departamento <strong>{{departamento_nome}}</strong> foi finalizada.</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Departamento</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{departamento_nome}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">T\u00e9rmino</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{data}}</td>
    </tr>
  </table>
  <p>Agradecemos sua visita ao {{instituicao_nome}}. Esperamos voc\u00ea em breve!</p>
  <p style="margin-top: 30px;">Atenciosamente,<br/><strong>Equipe {{instituicao_nome}}</strong></p>
</div>`,
  },
  email_template_cancelled: {
    subject: "Visita cancelada - {{instituicao_nome}}",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #dc2626;">Visita Cancelada</h2>
  <p>Ol\u00e1 <strong>{{visitante_nome}}</strong>,</p>
  <p>Sua visita ao departamento <strong>{{departamento_nome}}</strong> foi cancelada.</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Departamento</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{departamento_nome}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Data original</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{data}}</td>
    </tr>
  </table>
  <p>Se desejar, voc\u00ea pode agendar uma nova visita diretamente em nosso sistema.</p>
  <p>Em caso de d\u00favidas, entre em contato conosco.</p>
  <p style="margin-top: 30px;">Atenciosamente,<br/><strong>Equipe {{instituicao_nome}}</strong></p>
</div>`,
  },
};

function getTemplate(key) {
  const stored = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
  if (stored && stored.value) {
    try { return JSON.parse(stored.value); } catch {}
    const def = DEFAULTS[key];
    if (stored.value.startsWith("Subject:")) {
      const lines = stored.value.split("\n");
      const subject = lines[0].replace(/^Subject:\s*/, "").trim();
      const body = lines.slice(1).join("\n").trim();
      return { subject, body };
    }
    return def;
  }
  return DEFAULTS[key];
}

function render(str, vars) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);
}

async function sendVisitorEmail({ visitor, templateKey, extraVars = {} }) {
  const template = getTemplate(templateKey);
  if (!template) return { sent: false, error: "Template nao encontrado" };

  const inst = db.prepare("SELECT value FROM settings WHERE key = 'instituicao_nome'").get();
  const vars = {
    visitante_nome: visitor.name || "",
    visitante_email: visitor.email || "",
    departamento_nome: extraVars.departamento_nome || "",
    data: extraVars.data || "",
    responsavel_nome: extraVars.responsavel_nome || "",
    instituicao_nome: inst?.value || "Sistema",
    ...extraVars,
  };

  return sendEmail({
    to: visitor.email,
    subject: render(template.subject, vars),
    html: render(template.body, vars),
  });
}

module.exports = { sendVisitorEmail, TEMPLATE_KEYS, DEFAULTS };
