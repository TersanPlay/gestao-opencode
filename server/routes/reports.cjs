const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

router.get("/visitors", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const { start, end, departmentId, status } = req.query;
  let conditions = [];
  let params = [];

  if (req.scopeDepartmentId) {
    conditions.push("v.departmentId = ?");
    params.push(req.scopeDepartmentId);
  } else if (departmentId) {
    conditions.push("v.departmentId = ?");
    params.push(departmentId);
  }
  if (start && end) {
    conditions.push("date(v.scheduledAt) BETWEEN ? AND ?");
    params.push(start, end);
  } else if (start) {
    conditions.push("date(v.scheduledAt) >= ?");
    params.push(start);
  } else if (end) {
    conditions.push("date(v.scheduledAt) <= ?");
    params.push(end);
  }
  if (status && status !== "all") {
    conditions.push("v.status = ?");
    params.push(status);
  }

  const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const total = db.prepare(`SELECT COUNT(*) as count FROM visitors v ${where}`).get(...params).count;

  const byStatus = db.prepare(`
    SELECT v.status, COUNT(*) as count
    FROM visitors v ${where}
    GROUP BY v.status ORDER BY count DESC
  `).all(...params);

  const byDepartment = db.prepare(`
    SELECT v.departmentId, d.name as departmentName, COUNT(*) as count
    FROM visitors v LEFT JOIN departments d ON v.departmentId = d.id
    ${where}
    GROUP BY v.departmentId ORDER BY count DESC
  `).all(...params);

  const byDate = db.prepare(`
    SELECT date(v.scheduledAt) as date, COUNT(*) as count
    FROM visitors v ${where}
    GROUP BY date(v.scheduledAt) ORDER BY date ASC
  `).all(...params);

  res.json({ total, byStatus, byDepartment, byDate });
});

router.get("/departments", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  let deptCondition = "";
  let params = [];
  if (req.scopeDepartmentId) {
    deptCondition = "WHERE d.id = ?";
    params.push(req.scopeDepartmentId);
  }

  const depts = db.prepare(`
    SELECT
      d.id, d.name, d.description,
      (SELECT COUNT(*) FROM visitors v WHERE v.departmentId = d.id) as visitorCount,
      (SELECT COUNT(*) FROM visitors v WHERE v.departmentId = d.id AND v.status = 'in_progress') as activeVisits,
      (SELECT COUNT(*) FROM visitors v WHERE v.departmentId = d.id AND date(v.scheduledAt) = date('now')) as todayVisits
    FROM departments d ${deptCondition}
    ORDER BY visitorCount DESC
  `).all(...params);

  const total = depts.length;

  res.json({ total, departments: depts });
});

router.get("/users", checkRole("admin", "gestor"), checkScope(), (req, res) => {
  let condition = "";
  let params = [];
  if (req.scopeDepartmentId) {
    condition = "WHERE departmentId = ?";
    params.push(req.scopeDepartmentId);
  }

  const byRole = db.prepare(`
    SELECT role, COUNT(*) as count
    FROM users ${condition} GROUP BY role ORDER BY count DESC
  `).all(...params);

  const byStatus = db.prepare(`
    SELECT
      CASE WHEN active = 1 THEN 'active' ELSE 'inactive' END as status,
      COUNT(*) as count
    FROM users ${condition} GROUP BY active
  `).all(...params);

  const total = db.prepare(`SELECT COUNT(*) as count FROM users ${condition}`).get(...params).count;
  const activeCondition = condition ? `${condition} AND active = 1` : "WHERE active = 1";
  const active = db.prepare(`SELECT COUNT(*) as count FROM users ${activeCondition}`).get(...params).count;

  res.json({ total, active, byRole, byStatus });
});

module.exports = router;
