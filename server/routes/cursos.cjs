const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const cursos = db.prepare("SELECT c.*, COUNT(cc.id) as colaboradorCount FROM cursos c LEFT JOIN colaborador_cursos cc ON cc.cursoId = c.id GROUP BY c.id ORDER BY c.nome ASC").all();
  res.json(cursos);
});

router.get("/vinculos", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const scopeJoin = req.scopeDepartmentId ? " JOIN colaboradores c2 ON cc.colaboradorId = c2.id AND c2.departamentoId = ?" : "";
  const scopeParams = req.scopeDepartmentId ? [req.scopeDepartmentId] : [];
  const vinculos = db.prepare(`
    SELECT cc.*, c.nome as cursoNome, c.cargaHoraria as cursoCargaHoraria, c2.nome as colaboradorNome
    FROM colaborador_cursos cc
    JOIN cursos c ON cc.cursoId = c.id
    JOIN colaboradores c2 ON cc.colaboradorId = c2.id${scopeJoin}
    ORDER BY c2.nome ASC
  `).all(...scopeParams);
  res.json(vinculos);
});

router.get("/:id", checkRole("admin", "gestor", "assessor"), (req, res) => {
  const curso = db.prepare("SELECT * FROM cursos WHERE id = ?").get(req.params.id);
  if (!curso) return res.status(404).json({ error: "Curso nao encontrado" });
  res.json(curso);
});

router.post("/", checkRole("admin", "gestor"), (req, res) => {
  const { nome, descricao, cargaHoraria } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome obrigatorio" });
  if (nome.length > 200) return res.status(400).json({ error: "Nome muito longo" });
  if (descricao && descricao.length > 1000) return res.status(400).json({ error: "Descricao muito longa" });
  const result = db.prepare("INSERT INTO cursos (nome, descricao, cargaHoraria) VALUES (?, ?, ?)").run(nome, descricao || "", parseInt(cargaHoraria) || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put("/:id", checkRole("admin", "gestor"), (req, res) => {
  const { nome, descricao, cargaHoraria } = req.body;
  const existing = db.prepare("SELECT id FROM cursos WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Curso nao encontrado" });
  db.prepare("UPDATE cursos SET nome=COALESCE(?,nome), descricao=COALESCE(?,descricao), cargaHoraria=COALESCE(?,cargaHoraria) WHERE id=?").run(
    nome || null, descricao !== undefined ? descricao : null, cargaHoraria !== undefined ? parseInt(cargaHoraria) : null, req.params.id
  );
  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  const vinculos = db.prepare("SELECT COUNT(*) as count FROM colaborador_cursos WHERE cursoId = ?").get(req.params.id);
  if (vinculos.count > 0) return res.status(400).json({ error: "Curso possui vinculos ativos. Remova-os primeiro." });
  db.prepare("DELETE FROM cursos WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.get("/colaborador/:colaboradorId", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const scopeJoin = req.scopeDepartmentId ? " AND c2.departamentoId = ?" : "";
  const scopeParams = req.scopeDepartmentId ? [req.scopeDepartmentId, req.params.colaboradorId] : [req.params.colaboradorId];
  const vinculos = db.prepare(`
    SELECT cc.*, c.nome as cursoNome, c.cargaHoraria as cursoCargaHoraria
    FROM colaborador_cursos cc
    JOIN cursos c ON cc.cursoId = c.id
    JOIN colaboradores c2 ON cc.colaboradorId = c2.id
    WHERE cc.colaboradorId = ?${scopeJoin}
    ORDER BY cc.createdAt DESC
  `).all(...scopeParams);
  res.json(vinculos);
});

router.post("/vincular", checkRole("admin", "gestor"), checkScope(), (req, res) => {
  const { colaboradorId, cursoId, dataInicio, dataFim } = req.body;
  if (!colaboradorId || !cursoId) return res.status(400).json({ error: "colaboradorId e cursoId obrigatorios" });
  const scopeCondition = req.scopeDepartmentId ? " AND departamentoId = ?" : "";
  const scopeParams = req.scopeDepartmentId ? [req.scopeDepartmentId] : [];
  const col = db.prepare(`SELECT id FROM colaboradores WHERE id = ?${scopeCondition}`).get(colaboradorId, ...scopeParams);
  if (!col) return res.status(404).json({ error: "Colaborador nao encontrado ou sem acesso" });
  const curso = db.prepare("SELECT id FROM cursos WHERE id = ?").get(cursoId);
  if (!curso) return res.status(404).json({ error: "Curso nao encontrado" });
  const existing = db.prepare("SELECT id FROM colaborador_cursos WHERE colaboradorId = ? AND cursoId = ?").get(colaboradorId, cursoId);
  if (existing) return res.status(400).json({ error: "Colaborador ja vinculado a este curso" });
  const result = db.prepare("INSERT INTO colaborador_cursos (colaboradorId, cursoId, dataInicio, dataFim, status) VALUES (?, ?, ?, ?, 'pendente')").run(
    colaboradorId, cursoId, dataInicio || null, dataFim || null
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put("/vincular/:id", checkRole("admin", "gestor"), checkScope(), (req, res) => {
  const { dataInicio, dataFim, status } = req.body;
  const existing = db.prepare("SELECT id FROM colaborador_cursos WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Vinculo nao encontrado" });
  db.prepare("UPDATE colaborador_cursos SET dataInicio=COALESCE(?,dataInicio), dataFim=COALESCE(?,dataFim), status=COALESCE(?,status) WHERE id=?").run(
    dataInicio || null, dataFim || null, status || null, req.params.id
  );
  res.json({ success: true });
});

router.delete("/vincular/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM colaborador_cursos WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
