const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole } = require("../middleware/rbac.cjs");

router.get("/unread-count", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const count = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND read = 0").get(req.user.id).count;
  res.json({ count });
});

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const { unreadOnly } = req.query;
  let sql = "SELECT * FROM notifications WHERE userId = ?";
  const params = [req.user.id];
  if (unreadOnly === "true") { sql += " AND read = 0"; }
  sql += " ORDER BY createdAt DESC LIMIT 50";
  res.json(db.prepare(sql).all(...params));
});

router.put("/:id/read", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  db.prepare("UPDATE notifications SET read = 1 WHERE id = ? AND userId = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

router.post("/read-all", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  db.prepare("UPDATE notifications SET read = 1 WHERE userId = ? AND read = 0").run(req.user.id);
  res.json({ success: true });
});

function notifyUser(userId, type, title, message, link) {
  try {
    db.prepare("INSERT INTO notifications (userId, type, title, message, link) VALUES (?, ?, ?, ?, ?)").run(userId, type, title, message, link || null);
  } catch (e) { console.error("notifyUser error:", e.message); }
}

function notifyDepartmentUsers(departmentId, type, title, message, link) {
  const users = db.prepare("SELECT id FROM users WHERE departmentId = ? AND active = 1").all(departmentId);
  for (const u of users) notifyUser(u.id, type, title, message, link);
}

function notifyAdmins(type, title, message, link) {
  const admins = db.prepare("SELECT id FROM users WHERE role = 'admin' AND active = 1").all();
  for (const a of admins) notifyUser(a.id, type, title, message, link);
}

module.exports = { router, notifyUser, notifyDepartmentUsers, notifyAdmins };
