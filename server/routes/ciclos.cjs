const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor"), (req, res) => {
  const ciclos = db.prepare("SELECT * FROM ciclos_avaliacao ORDER BY dataInicio DESC").all();
  res.json(ciclos);
});

router.get("/:id", checkRole("admin", "gestor", "assessor"), (req, res) => {
  const ciclo = db.prepare("SELECT * FROM ciclos_avaliacao WHERE id = ?").get(req.params.id);
  if (!ciclo) return res.status(404).json({ error: "Ciclo nao encontrado" });
  res.json(ciclo);
});

router.post("/", checkRole("admin"), (req, res) => {
  const { nome, dataInicio, dataFim } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatorio" });
  const result = db.prepare("INSERT INTO ciclos_avaliacao (nome, dataInicio, dataFim) VALUES (?, ?, ?)").run(nome, dataInicio || "", dataFim || "");
  res.status(201).json({ id: result.lastInsertRowid, nome });
});

router.put("/:id", checkRole("admin"), (req, res) => {
  const existing = db.prepare("SELECT * FROM ciclos_avaliacao WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Ciclo nao encontrado" });
  const { nome, dataInicio, dataFim, status } = req.body;
  db.prepare("UPDATE ciclos_avaliacao SET nome=?, dataInicio=?, dataFim=?, status=? WHERE id=?")
    .run(nome || existing.nome, dataInicio !== undefined ? dataInicio : existing.dataInicio, dataFim !== undefined ? dataFim : existing.dataFim, status || existing.status, req.params.id);
  res.json({ success: true });
});

router.get("/:id/progress", checkRole("admin", "gestor"), (req, res) => {
  const ciclo = db.prepare("SELECT * FROM ciclos_avaliacao WHERE id = ?").get(req.params.id);
  if (!ciclo) return res.status(404).json({ error: "Ciclo nao encontrado" });

  const totalColaboradores = db.prepare("SELECT COUNT(*) as count FROM colaboradores WHERE status = 'ativo'").get().count;
  const avaliacoesRealizadas = db.prepare("SELECT COUNT(*) as count FROM avaliacoes WHERE cicloId = ? AND status = 'completed'").get(req.params.id).count;
  const avaliacoesPendentes = db.prepare("SELECT COUNT(*) as count FROM avaliacoes WHERE cicloId = ? AND status = 'pending'").get(req.params.id).count;
  const mediaGeral = db.prepare("SELECT AVG(notaFinal) as media FROM avaliacoes WHERE cicloId = ? AND status = 'completed'").get(req.params.id).media;

  const pendentes = db.prepare(`
    SELECT c.id, c.nome FROM colaboradores c
    WHERE c.id NOT IN (SELECT DISTINCT colaboradorId FROM avaliacoes WHERE cicloId = ?)
    AND c.status = 'ativo'
    ORDER BY c.nome
  `).all(req.params.id);

  res.json({
    totalColaboradores,
    avaliacoesRealizadas,
    avaliacoesPendentes,
    percentualConcluido: totalColaboradores > 0 ? Math.round((avaliacoesRealizadas / totalColaboradores) * 100) : 0,
    mediaGeral: mediaGeral ? Math.round(mediaGeral * 100) / 100 : null,
    pendentes,
  });
});

module.exports = router;
