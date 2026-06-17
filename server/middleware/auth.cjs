const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "corporate-secret-key-2026";

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token nao fornecido" });
  }
  try {
    req.user = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido ou expirado" });
  }
}

module.exports = { authenticate };
