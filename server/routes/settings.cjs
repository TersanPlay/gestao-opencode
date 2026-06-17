const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin"), (req, res) => {
  const settings = db.prepare("SELECT * FROM settings ORDER BY key").all();
  const map = {};
  for (const s of settings) map[s.key] = { value: s.value, description: s.description, updatedAt: s.updatedAt };
  res.json(map);
});

router.put("/", checkRole("admin"), (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== "object") return res.status(400).json({ error: "Body deve conter objeto chave:valor" });

  const allowed = ["instituicao_nome", "logo_url", "sessao_expiracao", "notificacoes_ativas", "horario_abertura", "horario_fechamento"];
  const update = db.prepare("UPDATE settings SET value = ?, updatedAt = datetime('now') WHERE key = ?");

  for (const [key, val] of Object.entries(updates)) {
    if (allowed.includes(key) && typeof val === "string") update.run(val, key);
  }

  const settings = db.prepare("SELECT * FROM settings ORDER BY key").all();
  const map = {};
  for (const s of settings) map[s.key] = { value: s.value, description: s.description, updatedAt: s.updatedAt };
  res.json(map);
});

module.exports = router;
