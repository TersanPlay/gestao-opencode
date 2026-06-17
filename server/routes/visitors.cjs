const express = require("express");
const https = require("https");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

const MINELEAD_KEY = process.env.MINELEAD_API_KEY || "";

function checkDisposableEmail(email) {
  return new Promise((resolve) => {
    if (!MINELEAD_KEY || !email) return resolve(false);
    const url = `https://api.minelead.io/v1/detect-disposable/?key=${MINELEAD_KEY}&email=${encodeURIComponent(email)}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.disposable_status === "Disposable");
        } catch { resolve(false); }
      });
    }).on("error", () => resolve(false));
  });
}

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), checkScope(), (req, res) => {
  const { status } = req.query;
  let sql = "SELECT * FROM visitors";
  const conditions = [];
  const params = [];

  if (req.scopeDepartmentId) {
    conditions.push("departmentId = ?");
    params.push(req.scopeDepartmentId);
  }
  if (status && status !== "all") {
    conditions.push("status = ?");
    params.push(status);
  }
  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY createdAt DESC";

  res.json(db.prepare(sql).all(...params));
});

router.get("/check-email", checkRole("admin", "gestor", "assessor", "operator"), async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email obrigatorio" });
  const disposable = await checkDisposableEmail(email);
  res.json({ email, disposable });
});

router.get("/:id", checkRole("admin", "gestor", "assessor", "operator"), (req, res) => {
  const visitor = db.prepare("SELECT * FROM visitors WHERE id = ?").get(req.params.id);
  if (!visitor) return res.status(404).json({ error: "Visitante nao encontrado" });
  if (req.user.role !== "admin" && visitor.departmentId !== req.user.departmentId) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  res.json(visitor);
});

router.post("/", checkRole("admin", "gestor", "assessor", "operator"), checkScope(), async (req, res) => {
  const { name, email, phone, document, company, photo, departmentId, responsibleId, status, purpose, scheduledAt } = req.body;
  const deptId = req.scopeDepartmentId || departmentId || null;
  const isDisposable = email ? (await checkDisposableEmail(email) ? 1 : 0) : 0;

  const result = db.prepare(`
    INSERT INTO visitors (name, email, phone, document, company, photo, isDisposable, departmentId, responsibleId, status, purpose, scheduledAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, email, phone || "", document || "", company || "", photo || null,
    isDisposable,
    deptId, responsibleId || null,
    status || "registered", purpose || "",
    scheduledAt || null
  );
  res.status(201).json({ id: result.lastInsertRowid, name });
});

router.put("/:id", checkRole("admin", "gestor", "assessor"), async (req, res) => {
  const existing = db.prepare("SELECT * FROM visitors WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Visitante nao encontrado" });
  if (req.user.role !== "admin" && existing.departmentId !== req.user.departmentId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const fields = [];
  const params = [];
  const allowed = ["name","email","phone","document","company","photo","isDisposable","departmentId","responsibleId","status","purpose","scheduledAt","checkinAt","checkoutAt"];

  if (req.body.email !== undefined && req.body.email !== existing.email) {
    req.body.isDisposable = (await checkDisposableEmail(req.body.email)) ? 1 : 0;
  }

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key}=?`);
      params.push(req.body[key]);
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: "Nenhum campo para atualizar" });
  params.push(req.params.id);
  db.prepare(`UPDATE visitors SET ${fields.join(", ")} WHERE id=?`).run(...params);
  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM visitors WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
