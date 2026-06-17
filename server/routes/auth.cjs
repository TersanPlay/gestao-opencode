const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.cjs");
const { auditLogin } = require("../middleware/audit.cjs");

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
      phone: user.phone,
      role: user.role,
      departmentId: user.departmentId,
    },
  });
  auditLogin(user, req.ip);
});

router.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const user = db.prepare("SELECT id, name, email, phone, role, active, departmentId FROM users WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

router.put("/profile", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const { name, email, phone, currentPassword, newPassword, role, departmentId } = req.body;

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    if (email && email !== user.email) {
      const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, user.id);
      if (existing) return res.status(400).json({ error: "Email já em uso" });
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: "Senha atual é obrigatória para alterar a senha" });
      if (!bcrypt.compareSync(currentPassword, user.password)) return res.status(400).json({ error: "Senha atual incorreta" });
      if (newPassword.length < 6) return res.status(400).json({ error: "Nova senha deve ter no mínimo 6 caracteres" });
    }

    if (role !== undefined && role !== user.role && decoded.role !== "admin") {
      return res.status(403).json({ error: "Apenas administradores podem alterar o papel" });
    }

    if (departmentId !== undefined && departmentId !== user.departmentId && decoded.role !== "admin") {
      return res.status(403).json({ error: "Apenas administradores podem alterar o departamento" });
    }

    const finalName = name || user.name;
    const finalEmail = email || user.email;
    const finalPhone = phone !== undefined ? phone : user.phone;
    const finalPassword = newPassword ? bcrypt.hashSync(newPassword, 10) : user.password;
    const finalRole = role !== undefined ? role : user.role;
    const finalDeptId = departmentId !== undefined ? departmentId : user.departmentId;

    db.prepare("UPDATE users SET name = ?, email = ?, phone = ?, password = ?, role = ?, departmentId = ? WHERE id = ?")
      .run(finalName, finalEmail, finalPhone, finalPassword, finalRole, finalDeptId, user.id);

    const updated = db.prepare("SELECT id, name, email, phone, role, departmentId FROM users WHERE id = ?").get(user.id);
    res.json({ user: updated });
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

module.exports = router;
