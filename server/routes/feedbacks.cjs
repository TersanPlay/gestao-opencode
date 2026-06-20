const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  let sql = `
    SELECT f.*, u.name as autorNome
    FROM feedbacks f
    LEFT JOIN users u ON f.autorId = u.id
  `;
  const conditions = [];
  const params = [];

  const { colaboradorId } = req.query;
  if (colaboradorId) { conditions.push("f.colaboradorId = ?"); params.push(colaboradorId); }

  if (req.user.role !== "admin") {
    conditions.push("(f.autorId = ? OR f.colaboradorId IN (SELECT id FROM colaboradores WHERE gestorId = ?))");
    params.push(req.user.id, req.user.id);
  }

  if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY f.createdAt DESC";

  res.json(db.prepare(sql).all(...params));
});

router.post("/", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const { colaboradorId, tipo, comentario } = req.body;
  if (!colaboradorId || !comentario) return res.status(400).json({ error: "Colaborador e comentario obrigatorios" });

  const result = db.prepare("INSERT INTO feedbacks (colaboradorId, autorId, tipo, comentario, status) VALUES (?, ?, ?, ?, 'pending')")
    .run(colaboradorId, req.user.id, tipo || "gestor", comentario);

  const autorNome = req.user.name || db.prepare("SELECT name FROM users WHERE id = ?").get(req.user.id)?.name || "Desconhecido";
  db.insertHistorico(colaboradorId, "feedback", `Feedback registrado por ${autorNome}`, new Date().toISOString().slice(0, 10));

  res.status(201).json({ id: result.lastInsertRowid });
});

module.exports = router;
