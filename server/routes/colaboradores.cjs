const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const conditions = [];
  const params = [];

  if (req.scopeDepartmentId) {
    conditions.push("c.departamentoId = ?");
    params.push(req.scopeDepartmentId);
  }

  const { search, departamentoId, cargo, status, gestorId, vinculo, page, pageSize } = req.query;
  if (search) {
    conditions.push("(c.nome LIKE ? OR c.matricula LIKE ? OR c.email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (departamentoId) {
    conditions.push("c.departamentoId = ?");
    params.push(departamentoId);
  }
  if (status) {
    conditions.push("c.status = ?");
    params.push(status);
  }
  if (vinculo) {
    conditions.push("c.vinculo = ?");
    params.push(vinculo);
  }
  if (cargo) {
    conditions.push("c.cargo = ?");
    params.push(cargo);
  }
  if (gestorId) {
    conditions.push("c.gestorId = ?");
    params.push(gestorId);
  }

  const where = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

  const total = db.prepare(`SELECT COUNT(*) as count FROM colaboradores c${where}`).get(...params).count;

  const p = Math.max(parseInt(page, 10) || 1, 1);
  const ps = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 200);
  const offset = (p - 1) * ps;

  const sql = `
    SELECT c.*, d.name as departamentoNome, u.name as gestorNome,
      stats.media,
      metas.count as metasAtivas,
      pdis.count as pdisAtivos,
      ultAv.notaFinal as ultimaNota,
      ultAv.conceitoFinal as ultimoConceito,
      ultAv.cicloNome as ultimoCicloNome,
      ultAv.createdAt as ultimaAvCreatedAt
    FROM colaboradores c
    LEFT JOIN departments d ON c.departamentoId = d.id
    LEFT JOIN users u ON c.gestorId = u.id
    LEFT JOIN (SELECT colaboradorId, ROUND(AVG(notaFinal), 2) as media FROM avaliacoes WHERE status = 'completed' GROUP BY colaboradorId) stats ON c.id = stats.colaboradorId
    LEFT JOIN (SELECT colaboradorId, COUNT(*) as count FROM metas WHERE status IN ('pending','in_progress') GROUP BY colaboradorId) metas ON c.id = metas.colaboradorId
    LEFT JOIN (SELECT colaboradorId, COUNT(*) as count FROM pdi WHERE status IN ('pending','in_progress') GROUP BY colaboradorId) pdis ON c.id = pdis.colaboradorId
    LEFT JOIN (SELECT a.colaboradorId, a.notaFinal, a.conceitoFinal, a.createdAt, cc.nome as cicloNome FROM avaliacoes a LEFT JOIN ciclos_avaliacao cc ON a.cicloId = cc.id WHERE a.status = 'completed' AND a.id IN (SELECT MAX(a2.id) FROM avaliacoes a2 WHERE a2.status = 'completed' GROUP BY a2.colaboradorId)) ultAv ON c.id = ultAv.colaboradorId
    ${where}
    ORDER BY c.nome ASC
    LIMIT ? OFFSET ?
  `;

  const rows = db.prepare(sql).all(...params, ps, offset);

  const data = rows.map((c) => {
    let statusAvaliacao = "nunca_avaliado";
    if (c.ultimaAvCreatedAt) {
      const diffDays = (Date.now() - new Date(c.ultimaAvCreatedAt).getTime()) / 86400000;
      statusAvaliacao = diffDays > 180 ? "pendente" : "em_dia";
    }
    return {
      ...c,
      notaMedia: c.media || null,
      ultimaAvaliacao: c.ultimaNota ? { notaFinal: c.ultimaNota, conceitoFinal: c.ultimoConceito, cicloNome: c.ultimoCicloNome, createdAt: c.ultimaAvCreatedAt } : null,
      statusAvaliacao,
    };
  });

  res.json({ data, total, page: p, pageSize: ps, totalPages: Math.ceil(total / ps) });
});

router.get("/:id", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const col = db.prepare(`
    SELECT c.*, d.name as departamentoNome, u.name as gestorNome
    FROM colaboradores c
    LEFT JOIN departments d ON c.departamentoId = d.id
    LEFT JOIN users u ON c.gestorId = u.id
    WHERE c.id = ?
  `).get(req.params.id);

  if (!col) return res.status(404).json({ error: "Colaborador nao encontrado" });

  const stats = db.prepare("SELECT AVG(notaFinal) as media FROM avaliacoes WHERE colaboradorId = ? AND status = 'completed'").get(col.id);
  const metasAtivas = db.prepare("SELECT COUNT(*) as count FROM metas WHERE colaboradorId = ? AND status IN ('pending','in_progress')").get(col.id);
  const pdisAtivos = db.prepare("SELECT COUNT(*) as count FROM pdi WHERE colaboradorId = ? AND status IN ('pending','in_progress')").get(col.id);
  const totalAvaliacoes = db.prepare("SELECT COUNT(*) as count FROM avaliacoes WHERE colaboradorId = ?").get(col.id);
  const metasConcluidas = db.prepare("SELECT COUNT(*) as count FROM metas WHERE colaboradorId = ? AND status = 'completed'").get(col.id);
  const pdisConcluidos = db.prepare("SELECT COUNT(*) as count FROM pdi WHERE colaboradorId = ? AND status = 'completed'").get(col.id);
  const ultimaAvaliacao = db.prepare(`
    SELECT a.*, u.name as avaliadorNome, c.nome as cicloNome
    FROM avaliacoes a
    LEFT JOIN users u ON a.avaliadorId = u.id
    LEFT JOIN ciclos_avaliacao c ON a.cicloId = c.id
    WHERE a.colaboradorId = ? AND a.status = 'completed'
    ORDER BY a.createdAt DESC LIMIT 1
  `).get(col.id);

  res.json({
    ...col,
    notaMedia: stats.media ? Math.round(stats.media * 100) / 100 : null,
    metasAtivas: metasAtivas.count,
    pdisAtivos: pdisAtivos.count,
    totalAvaliacoes: totalAvaliacoes.count,
    metasConcluidas: metasConcluidas.count,
    pdisConcluidos: pdisConcluidos.count,
    ultimaAvaliacao: ultimaAvaliacao || null,
  });
});

router.post("/", checkRole("admin", "gestor"), (req, res) => {
  const { nome, cpf, matricula, cargo, departamentoId, funcao, cargaHoraria, ano, mes, vinculo, dataAdmissao, dataDesligamento, gestorId, userId, status, foto } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatorio" });

  const result = db.prepare(`
    INSERT INTO colaboradores (nome, cpf, matricula, cargo, departamentoId, funcao, cargaHoraria, ano, mes, vinculo, dataAdmissao, dataDesligamento, gestorId, userId, foto, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(nome, cpf || "", matricula || "", cargo || "", departamentoId || null, funcao || "", cargaHoraria || 0, ano || null, mes || null, vinculo || "", dataAdmissao || "", dataDesligamento || null, gestorId || null, userId || null, foto || null, status || "ativo");

  db.prepare("INSERT INTO historico_colaborador (colaboradorId, tipo, descricao, dataReferencia) VALUES (?, ?, ?, ?)").run(result.lastInsertRowid, "admissao", `Admissão de ${nome}`, dataAdmissao || "");

  res.status(201).json({ id: result.lastInsertRowid, nome });
});

router.put("/:id", checkRole("admin", "gestor"), (req, res) => {
  const existing = db.prepare("SELECT * FROM colaboradores WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Colaborador nao encontrado" });

  const { nome, cpf, matricula, cargo, departamentoId, funcao, cargaHoraria, ano, mes, vinculo, dataAdmissao, dataDesligamento, gestorId, userId, status, foto } = req.body;

  db.prepare(`
    UPDATE colaboradores SET nome=?, cpf=?, matricula=?, cargo=?, departamentoId=?, funcao=?, cargaHoraria=?, ano=?, mes=?, vinculo=?, dataAdmissao=?, dataDesligamento=?, gestorId=?, userId=?, status=?, foto=?, updatedAt=datetime('now')
    WHERE id=?
  `).run(
    nome || existing.nome, cpf !== undefined ? cpf : existing.cpf,
    matricula !== undefined ? matricula : existing.matricula, cargo !== undefined ? cargo : existing.cargo,
    departamentoId !== undefined ? departamentoId : existing.departamentoId, funcao !== undefined ? funcao : existing.funcao,
    cargaHoraria !== undefined ? cargaHoraria : existing.cargaHoraria, ano !== undefined ? ano : existing.ano,
    mes !== undefined ? mes : existing.mes, vinculo !== undefined ? vinculo : existing.vinculo,
    dataAdmissao !== undefined ? dataAdmissao : existing.dataAdmissao,
    dataDesligamento !== undefined ? dataDesligamento : existing.dataDesligamento,
    gestorId !== undefined ? gestorId : existing.gestorId, userId !== undefined ? userId : existing.userId,
    status !== undefined ? status : existing.status, foto !== undefined ? foto : existing.foto,
    req.params.id
  );

  if (status === "desligado" && existing.status !== "desligado") {
    db.prepare("INSERT INTO historico_colaborador (colaboradorId, tipo, descricao, dataReferencia) VALUES (?, ?, ?, ?)").run(req.params.id, "desligamento", `Desligamento de ${existing.nome}`, dataDesligamento || "");
  }

  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM colaboradores WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/import", checkRole("admin", "gestor"), (req, res) => {
  const { colaboradores } = req.body;
  if (!Array.isArray(colaboradores) || colaboradores.length === 0) {
    return res.status(400).json({ error: "Array de colaboradores é obrigatorio" });
  }

  const importar = db.transaction((dados) => {
    const seenMatriculas = new Set();
    const errors = [];
    let imported = 0;
    let skipped = 0;
    let departamentosCriados = 0;

    const getOrCreateDepartamento = (nome) => {
      if (!nome || nome.trim() === "") return null;
      const trimmed = nome.trim();
      const existing = db.prepare("SELECT id FROM departments WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))").get(trimmed);
      if (existing) return existing.id;
      const result = db.prepare("INSERT INTO departments (name, description) VALUES (?, ?)").run(trimmed, trimmed);
      departamentosCriados++;
      return result.lastInsertRowid;
    };

    for (let i = 0; i < dados.length; i++) {
      const row = dados[i];
      const matricula = (row.matricula || "").toString().trim();

      if (!row.nome || !row.nome.toString().trim()) {
        errors.push({ row: i + 1, matricula, reason: "Nome vazio" });
        continue;
      }

      if (!matricula) {
        errors.push({ row: i + 1, matricula: "", reason: "Matricula vazia" });
        continue;
      }

      if (seenMatriculas.has(matricula)) {
        skipped++;
        continue;
      }

      const existing = db.prepare("SELECT id FROM colaboradores WHERE matricula = ?").get(matricula);
      if (existing) {
        skipped++;
        continue;
      }

      seenMatriculas.add(matricula);

      const departamentoId = getOrCreateDepartamento(row.lotacao);
      const cargaHoraria = parseInt(row.cargaHoraria, 10) || 0;
      const ano = parseInt(row.ano, 10) || null;
      const mes = parseInt(row.mes, 10) || null;

      const result = db.prepare(`
        INSERT INTO colaboradores (nome, cpf, matricula, cargo, departamentoId, funcao, cargaHoraria, ano, mes, vinculo, dataAdmissao, dataDesligamento, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')
      `).run(
        row.nome.toString().trim(),
        (row.cpf || "").toString().trim(),
        matricula,
        (row.cargo || "").toString().trim(),
        departamentoId,
        (row.funcao || "").toString().trim(),
        cargaHoraria,
        ano,
        mes,
        (row.vinculo || "").toString().trim(),
        (row.dataAdmissao || "").toString().trim(),
        row.dataDesligamento ? row.dataDesligamento.toString().trim() : null
      );

      db.prepare("INSERT INTO historico_colaborador (colaboradorId, tipo, descricao, dataReferencia) VALUES (?, ?, ?, ?)").run(
        result.lastInsertRowid,
        "admissao",
        `Admissão de ${row.nome.toString().trim()}`,
        (row.dataAdmissao || "").toString().trim()
      );

      imported++;
    }

    return { imported, skipped, errors, departamentosCriados };
  });

  const result = importar(colaboradores);
  res.json(result);
});

module.exports = router;
