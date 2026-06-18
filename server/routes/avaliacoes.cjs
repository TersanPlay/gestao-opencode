const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  let sql = `
    SELECT a.*, u.name as avaliadorNome, c.nome as cicloNome
    FROM avaliacoes a
    LEFT JOIN users u ON a.avaliadorId = u.id
    LEFT JOIN ciclos_avaliacao c ON a.cicloId = c.id
  `;
  const conditions = [];
  const params = [];

  const { colaboradorId, cicloId } = req.query;
  if (colaboradorId) { conditions.push("a.colaboradorId = ?"); params.push(colaboradorId); }
  if (cicloId) { conditions.push("a.cicloId = ?"); params.push(cicloId); }
  if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY a.createdAt DESC";

  res.json(db.prepare(sql).all(...params));
});

router.get("/:id", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const av = db.prepare(`
    SELECT a.*, u.name as avaliadorNome, c.nome as cicloNome
    FROM avaliacoes a
    LEFT JOIN users u ON a.avaliadorId = u.id
    LEFT JOIN ciclos_avaliacao c ON a.cicloId = c.id
    WHERE a.id = ?
  `).get(req.params.id);
  if (!av) return res.status(404).json({ error: "Avaliacao nao encontrada" });

  const competencias = db.prepare(`
    SELECT ac.*, cp.nome as competenciaNome
    FROM avaliacao_competencias ac
    LEFT JOIN competencias cp ON ac.competenciaId = cp.id
    WHERE ac.avaliacaoId = ?
  `).all(req.params.id);

  res.json({ ...av, competencias });
});

router.post("/", checkRole("admin", "gestor"), (req, res) => {
  const { colaboradorId, cicloId, tipo, competencias, comentarios } = req.body;
  if (!colaboradorId || !cicloId) return res.status(400).json({ error: "Colaborador e ciclo obrigatorios" });

  const colExists = db.prepare("SELECT id FROM colaboradores WHERE id = ?").get(colaboradorId);
  if (!colExists) return res.status(400).json({ error: "Colaborador nao encontrado" });
  const cicloExists = db.prepare("SELECT id FROM ciclos_avaliacao WHERE id = ?").get(cicloId);
  if (!cicloExists) return res.status(400).json({ error: "Ciclo nao encontrado" });

  const avaliadorId = req.user.id;
  const result = db.prepare("INSERT INTO avaliacoes (colaboradorId, cicloId, avaliadorId, tipo, comentarios) VALUES (?, ?, ?, ?, ?)")
    .run(colaboradorId, cicloId, avaliadorId, tipo || "gestor", comentarios || "");

  const avaliacaoId = result.lastInsertRowid;

  if (competencias && Array.isArray(competencias)) {
    const insert = db.prepare("INSERT INTO avaliacao_competencias (avaliacaoId, competenciaId, nota) VALUES (?, ?, ?)");
    for (const comp of competencias) {
      insert.run(avaliacaoId, comp.competenciaId, comp.nota);
    }
  }

  res.status(201).json({ id: avaliacaoId });
});

router.put("/:id/finalizar", checkRole("admin", "gestor"), (req, res) => {
  const existing = db.prepare("SELECT * FROM avaliacoes WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Avaliacao nao encontrada" });

  const notas = db.prepare("SELECT nota FROM avaliacao_competencias WHERE avaliacaoId = ?").all(req.params.id);
  const media = notas.length > 0 ? notas.reduce((s, n) => s + n.nota, 0) / notas.length : 0;
  const notaFinal = Math.round(media * 100) / 100;

  let conceitoFinal = "";
  if (notaFinal >= 4.5) conceitoFinal = "Excelente";
  else if (notaFinal >= 3.5) conceitoFinal = "Bom";
  else if (notaFinal >= 2.5) conceitoFinal = "Regular";
  else if (notaFinal >= 1.5) conceitoFinal = "Ruim";
  else conceitoFinal = "Insatisfatorio";

  db.prepare("UPDATE avaliacoes SET notaFinal = ?, conceitoFinal = ?, status = 'completed' WHERE id = ?")
    .run(notaFinal, conceitoFinal, req.params.id);

  const col = db.prepare("SELECT nome FROM colaboradores WHERE id = ?").get(existing.colaboradorId);
  db.prepare("INSERT INTO historico_colaborador (colaboradorId, tipo, descricao, dataReferencia) VALUES (?, ?, ?, ?)")
    .run(existing.colaboradorId, "avaliacao", `Avaliação concluída - Nota: ${notaFinal} (${conceitoFinal})`, new Date().toISOString().slice(0, 10));

  res.json({ success: true, notaFinal, conceitoFinal });
});

router.put("/:id", checkRole("admin", "gestor"), (req, res) => {
  const existing = db.prepare("SELECT * FROM avaliacoes WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Avaliacao nao encontrada" });

  const { tipo, competencias } = req.body;
  if (tipo !== undefined) db.prepare("UPDATE avaliacoes SET tipo = ? WHERE id = ?").run(tipo, req.params.id);

  if (competencias && Array.isArray(competencias)) {
    db.prepare("DELETE FROM avaliacao_competencias WHERE avaliacaoId = ?").run(req.params.id);
    const insert = db.prepare("INSERT INTO avaliacao_competencias (avaliacaoId, competenciaId, nota) VALUES (?, ?, ?)");
    for (const comp of competencias) {
      insert.run(req.params.id, comp.competenciaId, comp.nota);
    }
  }

  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  const existing = db.prepare("SELECT * FROM avaliacoes WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Avaliacao nao encontrada" });
  db.prepare("DELETE FROM avaliacoes WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
