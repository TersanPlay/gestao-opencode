const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  let sql = `
    SELECT p.*, u.name as responsavelNome, c.nome as colaboradorNome
    FROM pdi p
    LEFT JOIN users u ON p.responsavelId = u.id
    LEFT JOIN colaboradores c ON p.colaboradorId = c.id
  `;
  const conditions = [];
  const params = [];

  const { colaboradorId, cicloId } = req.query;
  if (colaboradorId) { conditions.push("p.colaboradorId = ?"); params.push(colaboradorId); }
  if (cicloId) { conditions.push("p.cicloId = ?"); params.push(cicloId); }
  if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY p.createdAt DESC";

  res.json(db.prepare(sql).all(...params));
});

router.get("/:id", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const pdi = db.prepare(`
    SELECT p.*, u.name as responsavelNome, c.nome as colaboradorNome
    FROM pdi p
    LEFT JOIN users u ON p.responsavelId = u.id
    LEFT JOIN colaboradores c ON p.colaboradorId = c.id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!pdi) return res.status(404).json({ error: "PDI nao encontrado" });
  res.json(pdi);
});

router.post("/", checkRole("admin", "gestor"), (req, res) => {
  const { colaboradorId, cicloId, objetivo, acoesPrevistas, prazo, responsavelId, observacoes } = req.body;
  if (!colaboradorId || !objetivo) return res.status(400).json({ error: "Colaborador e objetivo obrigatorios" });

  const result = db.prepare(`
    INSERT INTO pdi (colaboradorId, cicloId, objetivo, acoesPrevistas, prazo, responsavelId, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(colaboradorId, cicloId || null, objetivo, acoesPrevistas || "", prazo || "", responsavelId || null, observacoes || "");

  db.insertHistorico(colaboradorId, "pdi", `PDI criado: ${objetivo}`, new Date().toISOString().slice(0, 10));

  res.status(201).json({ id: result.lastInsertRowid });
});

router.put("/:id", checkRole("admin", "gestor"), (req, res) => {
  const existing = db.prepare("SELECT * FROM pdi WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "PDI nao encontrado" });

  const { objetivo, acoesPrevistas, prazo, responsavelId, status, evidencias, observacoes } = req.body;

  db.prepare(`
    UPDATE pdi SET objetivo=?, acoesPrevistas=?, prazo=?, responsavelId=?, status=?, evidencias=?, observacoes=?
    WHERE id=?
  `).run(
    objetivo || existing.objetivo, acoesPrevistas !== undefined ? acoesPrevistas : existing.acoesPrevistas,
    prazo !== undefined ? prazo : existing.prazo, responsavelId !== undefined ? responsavelId : existing.responsavelId,
    status || existing.status, evidencias !== undefined ? evidencias : existing.evidencias,
    observacoes !== undefined ? observacoes : existing.observacoes,
    req.params.id
  );

  if (status === "completed" && existing.status !== "completed") {
    db.insertHistorico(existing.colaboradorId, "pdi", `PDI concluído: ${existing.objetivo}`, new Date().toISOString().slice(0, 10));
  }

  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM pdi WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
