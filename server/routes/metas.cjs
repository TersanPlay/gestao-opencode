const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  let sql = `
    SELECT m.*, u.name as responsavelNome
    FROM metas m
    LEFT JOIN users u ON m.responsavelId = u.id
  `;
  const conditions = [];
  const params = [];

  const { colaboradorId, cicloId } = req.query;
  if (colaboradorId) { conditions.push("m.colaboradorId = ?"); params.push(colaboradorId); }
  if (cicloId) { conditions.push("m.cicloId = ?"); params.push(cicloId); }
  if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY m.createdAt DESC";

  res.json(db.prepare(sql).all(...params));
});

router.get("/:id", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const meta = db.prepare(`
    SELECT m.*, u.name as responsavelNome
    FROM metas m
    LEFT JOIN users u ON m.responsavelId = u.id
    WHERE m.id = ?
  `).get(req.params.id);
  if (!meta) return res.status(404).json({ error: "Meta nao encontrada" });
  res.json(meta);
});

router.post("/", checkRole("admin", "gestor"), (req, res) => {
  const { colaboradorId, cicloId, nome, descricao, metaEsperada, prazo, responsavelId } = req.body;
  if (!colaboradorId || !nome) return res.status(400).json({ error: "Colaborador e nome obrigatorios" });

  const result = db.prepare(`
    INSERT INTO metas (colaboradorId, cicloId, nome, descricao, metaEsperada, prazo, responsavelId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(colaboradorId, cicloId || null, nome, descricao || "", metaEsperada || "", prazo || "", responsavelId || null);

  const col = db.prepare("SELECT nome FROM colaboradores WHERE id = ?").get(colaboradorId);
  db.prepare("INSERT INTO historico_colaborador (colaboradorId, tipo, descricao, dataReferencia) VALUES (?, ?, ?, ?)")
    .run(colaboradorId, "meta", `Meta criada: ${nome}`, new Date().toISOString().slice(0, 10));

  res.status(201).json({ id: result.lastInsertRowid });
});

router.put("/:id", checkRole("admin", "gestor"), (req, res) => {
  const existing = db.prepare("SELECT * FROM metas WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Meta nao encontrada" });

  const { nome, descricao, metaEsperada, resultadoObtido, percentualConclusao, prazo, status, responsavelId } = req.body;

  db.prepare(`
    UPDATE metas SET nome=?, descricao=?, metaEsperada=?, resultadoObtido=?, percentualConclusao=?, prazo=?, status=?, responsavelId=?
    WHERE id=?
  `).run(
    nome || existing.nome, descricao !== undefined ? descricao : existing.descricao,
    metaEsperada !== undefined ? metaEsperada : existing.metaEsperada,
    resultadoObtido !== undefined ? resultadoObtido : existing.resultadoObtido,
    percentualConclusao !== undefined ? percentualConclusao : existing.percentualConclusao,
    prazo !== undefined ? prazo : existing.prazo, status || existing.status,
    responsavelId !== undefined ? responsavelId : existing.responsavelId,
    req.params.id
  );

  if (status === "completed" && existing.status !== "completed") {
    db.prepare("INSERT INTO historico_colaborador (colaboradorId, tipo, descricao, dataReferencia) VALUES (?, ?, ?, ?)")
      .run(existing.colaboradorId, "meta", `Meta concluída: ${existing.nome}`, new Date().toISOString().slice(0, 10));
  }

  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM metas WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
