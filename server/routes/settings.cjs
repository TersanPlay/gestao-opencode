const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { sendEmail } = require("../services/email.cjs");
const { checkRole } = require("../middleware/rbac.cjs");
const { DEFAULTS, TEMPLATE_KEYS } = require("../services/email-templates.cjs");

router.get("/", checkRole("admin"), (req, res) => {
  const settings = db.prepare("SELECT * FROM settings ORDER BY key").all();
  const map = {};
  const dbMap = {};
  for (const s of settings) {
    if (s.key.startsWith("smtp_")) continue;
    dbMap[s.key] = s.value;
    map[s.key] = { value: s.value, description: s.description, updatedAt: s.updatedAt };
  }
  for (const key of TEMPLATE_KEYS) {
    if (!dbMap[key]) {
      map[key] = { value: JSON.stringify(DEFAULTS[key] || { subject: "", body: "" }) };
    }
  }
  res.json(map);
});

router.put("/", checkRole("admin"), (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== "object") return res.status(400).json({ error: "Body deve conter objeto chave:valor" });

  const allowed = ["instituicao_nome", "logo_url", "sessao_expiracao", "notificacoes_ativas", "horario_abertura", "horario_fechamento", "email_notificacoes", "email_template_welcome", "email_template_scheduled", "email_template_checkin", "email_template_started", "email_template_finished", "email_template_cancelled"];
  const update = db.prepare("UPDATE settings SET value = ?, updatedAt = datetime('now') WHERE key = ?");

  for (const [key, val] of Object.entries(updates)) {
    if (allowed.includes(key) && typeof val === "string") update.run(val, key);
  }

  const saved = db.prepare("SELECT * FROM settings ORDER BY key").all();
  const map = {};
  for (const s of saved) {
    if (s.key.startsWith("smtp_")) continue;
    map[s.key] = { value: s.value, description: s.description, updatedAt: s.updatedAt };
  }
  res.json(map);
});

router.post("/test-email", checkRole("admin"), async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ error: "Destinatario obrigatorio" });
  const result = await sendEmail({ to, subject: "[Gestao] Teste de Email", html: "<p>Email de teste enviado com sucesso!</p>" });
  if (result.sent) {
    res.json({ message: "Email enviado" });
  } else {
    res.status(500).json({ error: result.error || "Falha ao enviar" });
  }
});

module.exports = router;
