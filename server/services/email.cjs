const nodemailer = require("nodemailer");

function getConfig() {
  return {
    smtp_host: process.env.SMTP_HOST || "",
    smtp_port: process.env.SMTP_PORT || "587",
    smtp_secure: process.env.SMTP_SECURE || "false",
    smtp_user: process.env.SMTP_USER || "",
    smtp_pass: process.env.SMTP_PASS || "",
    smtp_from: process.env.SMTP_FROM || "noreply@gestao-opencode.app",
  };
}

function createTransporter(cfg) {
  if (!cfg.smtp_host || !cfg.smtp_port) return null;
  const port = parseInt(cfg.smtp_port, 10);
  if (isNaN(port) || port < 1 || port > 65535) return null;
  const opts = {
    host: cfg.smtp_host,
    port,
    secure: cfg.smtp_secure === "true",
  };
  if (cfg.smtp_user && cfg.smtp_pass) {
    opts.auth = { user: cfg.smtp_user, pass: cfg.smtp_pass };
  }
  return nodemailer.createTransport(opts);
}

let transporter = null;
let lastCfgKey = "";
function getTransporter() {
  const cfg = getConfig();
  const key = `${cfg.smtp_host}:${cfg.smtp_port}:${cfg.smtp_user}`;
  if (key !== lastCfgKey || !transporter) {
    transporter = createTransporter(cfg);
    lastCfgKey = key;
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  const cfg = getConfig();
  const from = cfg.smtp_from;
  const tr = getTransporter();

  if (tr) {
    try {
      await tr.sendMail({ from, to, subject, html });
      return { sent: true };
    } catch (err) {
      console.error("SMTP send error:", err.message);
      return { sent: false, error: err.message };
    }
  }

  return { sent: false, error: "SMTP nao configurado" };
}

module.exports = { sendEmail };
