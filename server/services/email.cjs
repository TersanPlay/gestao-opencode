const nodemailer = require("nodemailer");
const db = require("../db.cjs");

let transporter = null;
let lastConfig = {};

function getConfig() {
  const settings = db.prepare("SELECT key, value FROM settings WHERE key LIKE 'smtp_%'").all();
  const cfg = {};
  for (const s of settings) cfg[s.key] = s.value;
  return cfg;
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

function getTransporter() {
  const cfg = getConfig();
  const cfgKey = JSON.stringify(cfg);
  if (cfgKey !== lastConfig.configKey || !transporter) {
    transporter = createTransporter(cfg);
    lastConfig = { configKey: cfgKey, cfg };
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  const cfg = lastConfig.cfg || getConfig();
  const from = cfg.smtp_from || "noreply@gestao-opencode.app";
  const tr = getTransporter();
  if (!tr) return { sent: false, error: "SMTP nao configurado" };
  try {
    await tr.sendMail({ from, to, subject, html });
    return { sent: true };
  } catch (err) {
    console.error("Email send error:", err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendEmail };
