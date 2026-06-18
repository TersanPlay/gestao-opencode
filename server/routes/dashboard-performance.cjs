const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/rh", checkRole("admin"), (req, res) => {
  const totalColaboradores = db.prepare("SELECT COUNT(*) as count FROM colaboradores WHERE status = 'ativo'").get().count;
  const avaliacoesRealizadas = db.prepare("SELECT COUNT(*) as count FROM avaliacoes WHERE status = 'completed'").get().count;
  const avaliacoesPendentes = db.prepare("SELECT COUNT(*) as count FROM avaliacoes WHERE status = 'pending'").get().count;
  const mediaGeral = db.prepare("SELECT AVG(notaFinal) as media FROM avaliacoes WHERE status = 'completed'").get().media;
  const ciclosAbertos = db.prepare("SELECT COUNT(*) as count FROM ciclos_avaliacao WHERE status = 'aberto'").get().count;

  const compMedias = db.prepare(`
    SELECT cp.nome, AVG(ac.nota) as media
    FROM avaliacao_competencias ac
    JOIN competencias cp ON ac.competenciaId = cp.id
    GROUP BY ac.competenciaId
    ORDER BY media DESC
  `).all();

  const melhoresCompetencias = compMedias.slice(0, 3).map((c) => ({ nome: c.nome, media: Math.round(c.media * 100) / 100 }));
  const pioresCompetencias = compMedias.slice(-3).reverse().map((c) => ({ nome: c.nome, media: Math.round(c.media * 100) / 100 }));

  res.json({
    totalColaboradores,
    avaliacoesRealizadas,
    avaliacoesPendentes,
    mediaGeral: mediaGeral ? Math.round(mediaGeral * 100) / 100 : 0,
    melhoresCompetencias,
    pioresCompetencias,
    ciclosAbertos,
  });
});

router.get("/gestor", checkRole("gestor"), checkScope(), (req, res) => {
  const deptCondition = req.scopeDepartmentId ? "AND departamentoId = ?" : "";
  const deptParams = req.scopeDepartmentId ? [req.scopeDepartmentId] : [];

  const totalEquipe = db.prepare(`SELECT COUNT(*) as count FROM colaboradores WHERE status = 'ativo' ${deptCondition}`).get(...deptParams).count;

  const equipeAvaliada = db.prepare(`
    SELECT COUNT(DISTINCT c.id) as count
    FROM colaboradores c
    JOIN avaliacoes a ON a.colaboradorId = c.id AND a.status = 'completed'
    WHERE 1=1 ${deptCondition}
  `).get(...deptParams).count;

  const avaliacoesPendentes = db.prepare(`
    SELECT COUNT(*) as count
    FROM avaliacoes a
    JOIN colaboradores c ON a.colaboradorId = c.id
    WHERE a.status = 'pending' ${req.scopeDepartmentId ? "AND c.departamentoId = ?" : ""}
  `).get(...deptParams).count;

  const pdisPendentes = db.prepare(`
    SELECT COUNT(*) as count
    FROM pdi p
    JOIN colaboradores c ON p.colaboradorId = c.id
    WHERE p.status IN ('pending','in_progress') ${req.scopeDepartmentId ? "AND c.departamentoId = ?" : ""}
  `).get(...deptParams).count;

  const metasAtrasadas = db.prepare(`
    SELECT COUNT(*) as count
    FROM metas m
    JOIN colaboradores c ON m.colaboradorId = c.id
    WHERE m.status IN ('pending','in_progress') AND m.prazo < date('now') ${req.scopeDepartmentId ? "AND c.departamentoId = ?" : ""}
  `).get(...deptParams).count;

  const destaques = db.prepare(`
    SELECT c.id, c.nome, AVG(a.notaFinal) as notaMedia
    FROM colaboradores c
    JOIN avaliacoes a ON a.colaboradorId = c.id AND a.status = 'completed'
    WHERE 1=1 ${deptCondition}
    GROUP BY c.id
    ORDER BY notaMedia DESC LIMIT 5
  `).all(...deptParams);

  const baixoDesempenho = db.prepare(`
    SELECT c.id, c.nome, AVG(a.notaFinal) as notaMedia
    FROM colaboradores c
    JOIN avaliacoes a ON a.colaboradorId = c.id AND a.status = 'completed'
    WHERE 1=1 ${deptCondition}
    GROUP BY c.id
    ORDER BY notaMedia ASC LIMIT 5
  `).all(...deptParams);

  res.json({
    totalEquipe,
    equipeAvaliada,
    avaliacoesPendentes,
    pdisPendentes,
    metasAtrasadas,
    destaques: destaques.map((d) => ({ id: d.id, nome: d.nome, notaMedia: Math.round(d.notaMedia * 100) / 100 })),
    baixoDesempenho: baixoDesempenho.map((d) => ({ id: d.id, nome: d.nome, notaMedia: Math.round(d.notaMedia * 100) / 100 })),
  });
});

router.get("/colaborador", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId obrigatorio" });

  const col = db.prepare("SELECT id, nome FROM colaboradores WHERE userId = ?").get(userId);
  if (!col) return res.json({
    colaboradorNome: "", ultimaAvaliacao: null, metasEmAndamento: 0,
    pdiEmAndamento: 0, feedbacksRecebidos: 0, melhoresCompetencias: [], pioresCompetencias: [],
  });

  const ultimaAvaliacao = db.prepare(`
    SELECT a.notaFinal, a.conceitoFinal, a.createdAt, c.nome as cicloNome
    FROM avaliacoes a LEFT JOIN ciclos_avaliacao c ON a.cicloId = c.id
    WHERE a.colaboradorId = ? AND a.status = 'completed'
    ORDER BY a.createdAt DESC LIMIT 1
  `).get(col.id);

  const metasAndamento = db.prepare("SELECT COUNT(*) as count FROM metas WHERE colaboradorId = ? AND status IN ('pending','in_progress')").get(col.id).count;
  const pdiAndamento = db.prepare("SELECT COUNT(*) as count FROM pdi WHERE colaboradorId = ? AND status IN ('pending','in_progress')").get(col.id).count;
  const feedbacksRecebidos = db.prepare("SELECT COUNT(*) as count FROM feedbacks WHERE colaboradorId = ?").get(col.id).count;

  const compMedias = db.prepare(`
    SELECT cp.nome, AVG(ac.nota) as media
    FROM avaliacao_competencias ac
    JOIN competencias cp ON ac.competenciaId = cp.id
    JOIN avaliacoes a ON ac.avaliacaoId = a.id
    WHERE a.colaboradorId = ? AND a.status = 'completed'
    GROUP BY ac.competenciaId
    ORDER BY media DESC
  `).all(col.id);

  res.json({
    colaboradorNome: col.nome,
    ultimaAvaliacao: ultimaAvaliacao || null,
    metasEmAndamento: metasAndamento,
    pdiEmAndamento: pdiAndamento,
    feedbacksRecebidos,
    melhoresCompetencias: compMedias.slice(0, 3).map((c) => ({ nome: c.nome, media: Math.round(c.media * 100) / 100 })),
    pioresCompetencias: compMedias.slice(-3).reverse().map((c) => ({ nome: c.nome, media: Math.round(c.media * 100) / 100 })),
  });
});

module.exports = router;
