const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), checkScope(), (req, res) => {
  if (req.user.role === "admin") {
    const depts = db.prepare("SELECT * FROM departments ORDER BY name ASC").all();
    return res.json(depts);
  }
  if (req.user.departmentId) {
    const dept = db.prepare("SELECT * FROM departments WHERE id = ?").get(req.user.departmentId);
    return res.json(dept ? [dept] : []);
  }
  res.json([]);
});

router.get("/:id", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const dept = db.prepare("SELECT * FROM departments WHERE id = ?").get(req.params.id);
  if (!dept) return res.status(404).json({ error: "Departamento nao encontrado" });
  if (req.user.role !== "admin" && dept.id !== req.user.departmentId) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  res.json(dept);
});

router.post("/", checkRole("admin"), (req, res) => {
  const { name, description, parentId, responsibleId } = req.body;
  const result = db.prepare("INSERT INTO departments (name, description, parentId, responsibleId) VALUES (?, ?, ?, ?)").run(
    name, description || "", parentId || null, responsibleId || null
  );
  res.status(201).json({ id: result.lastInsertRowid, name });
});

router.put("/:id", checkRole("admin"), (req, res) => {
  const { name, description, parentId, responsibleId } = req.body;
  db.prepare("UPDATE departments SET name=?, description=?, parentId=?, responsibleId=? WHERE id=?").run(
    name, description || "", parentId || null, responsibleId || null, req.params.id
  );
  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM departments WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
