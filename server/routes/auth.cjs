const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.cjs");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "corporate-secret-key-2026";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  if (!user.active) {
    return res.status(403).json({ error: "Usuário desativado" });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, departmentId: user.departmentId },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    },
  });
});

router.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const user = db.prepare("SELECT id, name, email, role, active, departmentId FROM users WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

module.exports = router;
