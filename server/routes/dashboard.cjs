const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), checkScope(), (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const deptCondition = req.scopeDepartmentId ? "WHERE departmentId = ?" : "";
  const todayCondition = req.scopeDepartmentId
    ? "WHERE departmentId = ? AND date(scheduledAt) = ?"
    : "WHERE date(scheduledAt) = ?";
  const getStatusCondition = (status) => req.scopeDepartmentId
    ? "WHERE departmentId = ? AND status = ?"
    : "WHERE status = ?";

  const deptParams = req.scopeDepartmentId ? [req.scopeDepartmentId] : [];
  const todayParams = req.scopeDepartmentId ? [req.scopeDepartmentId, today] : [today];
  const statusParams = (status) => req.scopeDepartmentId ? [req.scopeDepartmentId, status] : [status];

  const totalUsers = db.prepare(`SELECT COUNT(*) as count FROM users ${deptCondition}`).get(...deptParams).count;
  const activeUsers = req.scopeDepartmentId
    ? db.prepare("SELECT COUNT(*) as count FROM users WHERE departmentId = ? AND active = 1").get(req.scopeDepartmentId).count
    : db.prepare("SELECT COUNT(*) as count FROM users WHERE active = 1").get().count;
  const totalDepartments = req.scopeDepartmentId ? 1 : db.prepare("SELECT COUNT(*) as count FROM departments").get().count;
  const totalVisitorsToday = db.prepare(`SELECT COUNT(*) as count FROM visitors ${todayCondition}`).get(...todayParams).count;
  const visitorsInProgress = db.prepare(`SELECT COUNT(*) as count FROM visitors ${getStatusCondition("in_progress")}`).get(...statusParams("in_progress")).count;
  const visitorsCompleted = db.prepare(`SELECT COUNT(*) as count FROM visitors ${getStatusCondition("completed")}`).get(...statusParams("completed")).count;

  res.json({
    totalUsers,
    activeUsers,
    totalDepartments,
    totalVisitorsToday,
    visitorsInProgress,
    visitorsCompleted,
  });
});

module.exports = router;
