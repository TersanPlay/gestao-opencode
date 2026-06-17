const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/:visitorId", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const visitor = db.prepare("SELECT * FROM visitors WHERE id = ?").get(req.params.visitorId);
  if (!visitor) return res.status(404).json({ error: "Visitante nao encontrado" });
  if (req.user.role !== "admin" && visitor.departmentId !== req.user.departmentId) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  const events = db.prepare("SELECT * FROM timeline_events WHERE visitorId = ? ORDER BY timestamp ASC").all(req.params.visitorId);
  res.json(events);
});

router.post("/", checkRole("admin", "gestor", "assessor", "operator"), async (req, res) => {
  const { visitorId, type, description, author } = req.body;
  if (!visitorId) return res.status(400).json({ error: "visitorId obrigatorio" });

  const visitor = db.prepare("SELECT * FROM visitors WHERE id = ?").get(visitorId);
  if (!visitor) return res.status(404).json({ error: "Visitante nao encontrado" });
  if (req.user.role !== "admin" && visitor.departmentId !== req.user.departmentId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const result = db.prepare("INSERT INTO timeline_events (visitorId, type, description, author) VALUES (?, ?, ?, ?)").run(
    visitorId, type, description, author || ""
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

module.exports = router;
