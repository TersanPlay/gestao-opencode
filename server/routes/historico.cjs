const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/:colaboradorId", checkRole("admin", "gestor"), (req, res) => {
  const historico = db.prepare(`
    SELECT * FROM historico_colaborador
    WHERE colaboradorId = ?
    ORDER BY createdAt DESC
  `).all(req.params.colaboradorId);

  res.json(historico);
});

module.exports = router;
