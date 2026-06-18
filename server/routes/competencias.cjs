const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const competencias = db.prepare("SELECT * FROM competencias ORDER BY nome ASC").all();
  res.json(competencias);
});

module.exports = router;
