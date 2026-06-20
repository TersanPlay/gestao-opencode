const express = require("express");
const https = require("https");
const router = express.Router();
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");
const { notifyDepartmentUsers, notifyAdmins } = require("./notifications.cjs");
const { sendVisitorEmail } = require("../services/email-templates.cjs");

const INVERTEXTO_TOKEN = process.env.INVERTEXTO_TOKEN || "";

const CDN_URL = "https://cdn.jsdelivr.net/npm/disposable-email-domains@latest/index.json";

const FALLBACK_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","guerrillamail.net","guerrillamail.org",
  "sharklasers.com","grr.la","10minutemail.com","tempmail.com","temp-mail.org",
  "yopmail.com","maildrop.cc","trashmail.com","throwaway.email",
]);

let disposableDomains = null;

function fetchDisposableDomains() {
  return new Promise((resolve) => {
    https.get(CDN_URL, (res) => {
      if (res.statusCode !== 200) return resolve(false);
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const list = JSON.parse(data);
          if (Array.isArray(list) && list.length > 0) {
            disposableDomains = new Set(list.map((d) => d.toLowerCase()));
            console.log(`[disposable] loaded ${disposableDomains.size} domains from CDN`);
            return resolve(true);
          }
        } catch { /* fallback */ }
        resolve(false);
      });
    }).on("error", () => resolve(false));
  });
}

fetchDisposableDomains().then((ok) => {
  if (!ok) {
    disposableDomains = FALLBACK_DOMAINS;
    console.log(`[disposable] CDN failed, using fallback (${FALLBACK_DOMAINS.size} domains)`);
  }
});

function checkDisposableLocal(email) {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1].toLowerCase();
  const list = disposableDomains || FALLBACK_DOMAINS;
  return list.has(domain);
}

function checkDisposableInvertexto(email) {
  return new Promise((resolve) => {
    if (!INVERTEXTO_TOKEN) return resolve(null);
    const url = `https://api.invertexto.com/v1/email-validator/${encodeURIComponent(email)}?token=${INVERTEXTO_TOKEN}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.disposable !== undefined) {
            return resolve(json.disposable === true);
          }
        } catch { /* fallback */ }
        resolve(null);
      });
    }).on("error", () => resolve(null));
  });
}

async function checkDisposableEmail(email) {
  if (!email) return false;

  const result = await checkDisposableInvertexto(email);
  if (result !== null) return result;

  return checkDisposableLocal(email);
}

router.get("/", checkRole("admin", "gestor", "assessor", "operator"), checkScope(), (req, res) => {
  const { status } = req.query;
  let sql = "SELECT * FROM visitors";
  const conditions = [];
  const params = [];

  if (req.scopeDepartmentId && req.user.role !== "operator") {
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
  if (req.user.role !== "admin" && req.user.role !== "operator" && visitor.departmentId !== req.user.departmentId) {
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
  if (deptId) notifyDepartmentUsers(deptId, "visitor_created", "Novo visitante", `${name} foi cadastrado`, `/visitors/${result.lastInsertRowid}`);
  const createdVisitor = db.prepare("SELECT * FROM visitors WHERE id = ?").get(result.lastInsertRowid);
  if (createdVisitor && createdVisitor.email) {
    sendVisitorEmail({ visitor: createdVisitor, templateKey: "email_template_welcome", extraVars: { data: new Date().toLocaleString("pt-BR") } }).catch(err => console.error(err));
  }
  res.status(201).json({ id: result.lastInsertRowid, name });
});

router.put("/:id", checkRole("admin", "gestor", "assessor", "operator"), async (req, res) => {
  const existing = db.prepare("SELECT * FROM visitors WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Visitante nao encontrado" });
  if (req.user.role !== "admin" && req.user.role !== "operator" && existing.departmentId !== req.user.departmentId) {
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

  if (req.body.status === "checking_in" && existing.departmentId) {
    notifyDepartmentUsers(existing.departmentId, "visitor_checkin", "Visitante chegou", `${existing.name} fez check-in`, `/visitors/${req.params.id}`);
    const dept = db.prepare("SELECT name FROM departments WHERE id = ?").get(existing.departmentId);
    if (existing.email) {
      sendVisitorEmail({ visitor: existing, templateKey: "email_template_checkin", extraVars: { departamento_nome: dept?.name || "", data: new Date().toLocaleString("pt-BR") } }).catch(err => console.error(err));
    }
  }
  if (req.body.status === "scheduled" && existing.departmentId) {
    notifyDepartmentUsers(existing.departmentId, "visitor_scheduled", "Visita agendada", `${existing.name} foi agendado`, `/visitors/${req.params.id}`);
    const dept = db.prepare("SELECT name FROM departments WHERE id = ?").get(existing.departmentId);
    if (existing.email) {
      sendVisitorEmail({ visitor: existing, templateKey: "email_template_scheduled", extraVars: { departamento_nome: dept?.name || "", data: req.body.scheduledAt || new Date().toLocaleString("pt-BR") } }).catch(err => console.error(err));
    }
  }
  if (req.body.status === "in_progress" && existing.departmentId) {
    const dept = db.prepare("SELECT name FROM departments WHERE id = ?").get(existing.departmentId);
    if (existing.email) {
      sendVisitorEmail({ visitor: existing, templateKey: "email_template_started", extraVars: { departamento_nome: dept?.name || "", data: new Date().toLocaleString("pt-BR") } }).catch(err => console.error(err));
    }
  }
  if (req.body.status === "completed" && existing.departmentId) {
    const dept = db.prepare("SELECT name FROM departments WHERE id = ?").get(existing.departmentId);
    if (existing.email) {
      sendVisitorEmail({ visitor: existing, templateKey: "email_template_finished", extraVars: { departamento_nome: dept?.name || "", data: new Date().toLocaleString("pt-BR") } }).catch(err => console.error(err));
    }
  }
  if (req.body.status === "cancelled") {
    const dept = existing.departmentId ? db.prepare("SELECT name FROM departments WHERE id = ?").get(existing.departmentId) : null;
    if (existing.email) {
      sendVisitorEmail({ visitor: existing, templateKey: "email_template_cancelled", extraVars: { departamento_nome: dept?.name || "", data: existing.scheduledAt || new Date().toLocaleString("pt-BR") } }).catch(err => console.error(err));
    }
  }

  res.json({ success: true });
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  db.prepare("DELETE FROM visitors WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
