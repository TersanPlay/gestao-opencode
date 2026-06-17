const db = require("../db.cjs");

const SKIP_PATHS = ["/api/notifications", "/api/dashboard", "/api/health", "/api/auth"];

function auditLog(req, res, next) {
  const originalEnd = res.end.bind(res);
  const fullPath = req.originalUrl || req.url;

  res.end = function (...args) {
    const skip = SKIP_PATHS.some((p) => fullPath.startsWith(p));
    const isMutation = ["POST", "PUT", "DELETE"].includes(req.method);

    if (req.user && !skip && isMutation) {
      const pathParts = fullPath.replace("/api/", "").split("/").filter(Boolean);
      const resource = pathParts[0] || "unknown";
      const resourceId = pathParts.length > 1 ? pathParts[pathParts.length - 1] : null;
      const bodyDetails = req.method === "POST" ? (req.body?.name || req.body?.email || "created") : (req.body?.status || "updated");

      try {
        db.prepare(
          "INSERT INTO audit_logs (userId, userName, userRole, action, resource, resourceId, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).run(
          req.user.id, req.user.name || "", req.user.role || "",
          req.method, resource, resourceId || null,
          bodyDetails, req.ip || req.socket?.remoteAddress || ""
        );
      } catch (e) { console.error("audit error:", e.message); }
    }

    originalEnd(...args);
  };

  next();
}

function auditLogin(user, ip) {
  try {
    db.prepare(
      "INSERT INTO audit_logs (userId, userName, userRole, action, resource, resourceId, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(user.id, user.name, user.role, "POST", "auth", null, "login", ip || "");
  } catch (e) { console.error("audit login error:", e.message); }
}

module.exports = { auditLog, auditLogin };
