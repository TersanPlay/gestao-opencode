const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor"), (req, res) => {
  const { action, resource, userId, start, end, limit } = req.query;
  const conditions = [];
  const params = [];

  if (req.user.role !== "admin") {
    conditions.push("l.userId IN (SELECT id FROM users WHERE departmentId = ?)");
    params.push(req.user.departmentId);
  }

  if (action) { conditions.push("l.action = ?"); params.push(action); }
  if (resource) { conditions.push("l.resource = ?"); params.push(resource); }
  if (userId) { conditions.push("l.userId = ?"); params.push(userId); }
  if (start) { conditions.push("l.createdAt >= ?"); params.push(start); }
  if (end) { conditions.push("l.createdAt <= ?"); params.push(end); }

  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
  const max = Math.min(parseInt(limit) || 200, 1000);

  const logs = db.prepare(`
    SELECT l.*, u.name as uName, u.role as uRole
    FROM audit_logs l
    LEFT JOIN users u ON l.userId = u.id
    ${where}
    ORDER BY l.createdAt DESC
    LIMIT ?
  `).all(...params, max);

  res.json(logs);
});

router.get("/users", checkRole("admin", "gestor"), (req, res) => {
  const users = req.user.role === "admin"
    ? db.prepare("SELECT id, name FROM users WHERE active = 1 ORDER BY name").all()
    : db.prepare("SELECT id, name FROM users WHERE departmentId = ? AND active = 1 ORDER BY name").all(req.user.departmentId);
  res.json(users);
});

module.exports = router;
