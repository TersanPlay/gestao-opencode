const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/colaboradores", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const conditions = [];
  const params = [];

  if (req.scopeDepartmentId) {
    conditions.push("c.departamentoId = ?");
    params.push(req.scopeDepartmentId);
  }

  const filter = db.buildColaboradorFilter(req.query);
  conditions.push(...filter.conditions);
  params.push(...filter.params);

  const where = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

  const rows = db.prepare(`
    SELECT c.*, d.name as departamentoNome, u.name as gestorNome
    FROM colaboradores c
    LEFT JOIN departments d ON c.departamentoId = d.id
    LEFT JOIN users u ON c.gestorId = u.id
    ${where}
    ORDER BY c.nome ASC
  `).all(...params);

  const headers = ["Matrícula", "Nome", "CPF", "Cargo", "Função", "Lotação", "Vínculo", "Carga Horária", "Ano", "Mês", "Data Admissão", "Data Desligamento", "Status", "Gestor"];
  const csvRows = [headers.map(escapeCsv).join(",")];

  for (const r of rows) {
    csvRows.push([
      r.matricula, r.nome, r.cpf, r.cargo, r.funcao, r.departamentoNome || "",
      r.vinculo, r.cargaHoraria, r.ano, r.mes, r.dataAdmissao, r.dataDesligamento || "",
      r.status, r.gestorNome || "",
    ].map(escapeCsv).join(","));
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="colaboradores-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send("\uFEFF" + csvRows.join("\n"));
});

router.get("/avaliacoes/:cicloId", checkRole("admin", "gestor"), checkScope(), (req, res) => {
  const ciclo = db.prepare("SELECT * FROM ciclos_avaliacao WHERE id = ?").get(req.params.cicloId);
  if (!ciclo) return res.status(404).json({ error: "Ciclo nao encontrado" });

  const rows = db.prepare(`
    SELECT col.nome as colaborador, col.matricula, col.cargo, col.vinculo,
           a.notaFinal, a.conceitoFinal, a.status, a.createdAt,
           u.name as avaliadorNome
    FROM avaliacoes a
    JOIN colaboradores col ON a.colaboradorId = col.id
    JOIN users u ON a.avaliadorId = u.id
    WHERE a.cicloId = ?
    ORDER BY col.nome ASC
  `).all(req.params.cicloId);

  const headers = ["Colaborador", "Matrícula", "Cargo", "Vínculo", "Nota Final", "Conceito", "Status", "Avaliador", "Data"];
  const csvRows = [headers.map(escapeCsv).join(",")];

  for (const r of rows) {
    csvRows.push([
      r.colaborador, r.matricula, r.cargo, r.vinculo, r.notaFinal,
      r.conceitoFinal, r.status === "completed" ? "Finalizada" : "Pendente",
      r.avaliadorNome, r.createdAt,
    ].map(escapeCsv).join(","));
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="avaliacoes-${ciclo.nome.replace(/\s+/g, "-")}.csv"`);
  res.send("\uFEFF" + csvRows.join("\n"));
});

function escapeCsv(val) {
  if (val === null || val === undefined) return "";
  let s = String(val);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

module.exports = router;
