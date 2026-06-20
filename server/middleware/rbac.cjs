const HIERARCHY = { admin: 4, gestor: 3, assessor: 2, operator: 1 };
const ALL_ROLES = ["admin", "gestor", "assessor", "operator"];

function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Nao autenticado" });
    }
    const userLevel = HIERARCHY[req.user.role] || 0;
    const minLevel = Math.min(...allowedRoles.map((r) => HIERARCHY[r] || 0));
    if (userLevel < minLevel) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
}

function checkScope() {
  return (req, res, next) => {
    if (req.user.role === "admin") return next();
    req.scopeDepartmentId = req.user.departmentId || null;
    next();
  };
}

module.exports = { checkRole, checkScope, ALL_ROLES };
