const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");
const { notifyAdmins } = require("./notifications.cjs");

router.get("/", checkRole("admin", "gestor"), checkScope(), (req, res) => {
  if (req.user.role === "admin") {
    const users = db.prepare("SELECT id, name, email, phone, role, active, departmentId, createdAt FROM users ORDER BY id DESC").all();
    return res.json(users);
  }
  const deptId = req.user.departmentId;
  const users = db.prepare("SELECT id, name, email, phone, role, active, departmentId, createdAt FROM users WHERE departmentId = ? ORDER BY id DESC").all(deptId);
  res.json(users);
});

router.get("/:id", checkRole("admin", "gestor"), (req, res) => {
  const user = db.prepare("SELECT id, name, email, phone, role, active, departmentId, createdAt FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário nao encontrado" });
  if (req.user.role !== "admin" && user.departmentId !== req.user.departmentId) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  res.json(user);
});

router.post("/", checkRole("admin", "gestor"), (req, res) => {
  const { name, email, password, phone, role, departmentId, active } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Nome e email obrigatorios" });

  const targetDept = departmentId || req.user.departmentId;
  if (req.user.role !== "admin" && targetDept !== req.user.departmentId) {
    return res.status(403).json({ error: "So pode criar usuarios no seu setor" });
  }
  if (req.user.role === "gestor" && role === "admin") {
    return res.status(403).json({ error: "Gestor nao pode criar admin" });
  }

  const hash = password ? bcrypt.hashSync(password, 10) : bcrypt.hashSync("temp123", 10);
  const result = db.prepare("INSERT INTO users (name, email, password, phone, role, departmentId, active) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    name, email, hash, phone || "", role || "operator", targetDept, active !== undefined ? (active ? 1 : 0) : 1
  );
  notifyAdmins("user_created", "Novo usuário", `${name} (${role || "operator"}) foi criado`, `/users/${result.lastInsertRowid}`);
  res.status(201).json({ id: result.lastInsertRowid, name, email });
});

router.put("/:id", checkRole("admin", "gestor"), (req, res) => {
  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Usuario nao encontrado" });
  if (req.user.role !== "admin" && existing.departmentId !== req.user.departmentId) {
    return res.status(403).json({ error: "So pode editar usuarios do seu setor" });
  }
  if (req.user.role === "gestor" && (existing.role === "admin" || req.body.role === "admin")) {
    return res.status(403).json({ error: "Gestor nao pode alterar admin" });
  }

  const { name, email, password, phone, role, departmentId, active } = req.body;
  db.prepare("UPDATE users SET name=?, email=?, phone=?, role=?, departmentId=?, active=? WHERE id=?").run(
    name, email, phone || "", role, departmentId || null,
    active !== undefined ? (active ? 1 : 0) : 1, req.params.id
  );
  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hash, req.params.id);
  }
  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
