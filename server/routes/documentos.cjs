const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const db = require("../db.cjs");
const { checkRole, checkScope } = require("../middleware/rbac.cjs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "documentos");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIMES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/png", "image/jpeg", "image/gif"];

function safeFilename(original) {
  const ext = path.extname(original);
  const base = path.basename(original, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${base}${ext}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Tipo de arquivo nao permitido. Use PDF, DOC, DOCX, XLS, XLSX, PNG, JPG ou GIF."));
  },
});

router.get("/:colaboradorId", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const scopeJoin = req.scopeDepartmentId ? " JOIN colaboradores c ON d.colaboradorId = c.id AND c.departamentoId = ?" : "";
  const scopeParams = req.scopeDepartmentId ? [req.scopeDepartmentId, req.params.colaboradorId] : [req.params.colaboradorId];
  const docs = db.prepare(`SELECT d.id, d.nome, d.tipo, d.mimeType, d.tamanho, d.createdAt FROM documentos d${scopeJoin} WHERE d.colaboradorId = ? ORDER BY d.createdAt DESC`).all(...scopeParams);
  res.json(docs);
});

router.post("/", checkRole("admin", "gestor"), checkScope(), upload.single("arquivo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Arquivo obrigatorio" });
  const { colaboradorId, nome, tipo } = req.body;
  if (!colaboradorId || !nome) return res.status(400).json({ error: "colaboradorId e nome obrigatorios" });
  if (nome.length > 200) return res.status(400).json({ error: "Nome muito longo" });
  const scopeCondition = req.scopeDepartmentId ? " AND departamentoId = ?" : "";
  const scopeParams = req.scopeDepartmentId ? [req.scopeDepartmentId] : [];
  const col = db.prepare(`SELECT id FROM colaboradores WHERE id = ?${scopeCondition}`).get(colaboradorId, ...scopeParams);
  if (!col) return res.status(404).json({ error: "Colaborador nao encontrado ou sem acesso" });
  const result = db.prepare("INSERT INTO documentos (colaboradorId, nome, tipo, arquivo, mimeType, tamanho) VALUES (?, ?, ?, ?, ?, ?)").run(
    colaboradorId, nome, tipo || "", req.file.filename, req.file.mimetype, req.file.size
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

router.get("/:id/download", checkRole("admin", "gestor", "assessor"), checkScope(), (req, res) => {
  const scopeJoin = req.scopeDepartmentId ? " JOIN colaboradores c ON d.colaboradorId = c.id AND c.departamentoId = ?" : "";
  const scopeParams = req.scopeDepartmentId ? [req.scopeDepartmentId, req.params.id] : [req.params.id];
  const doc = db.prepare(`SELECT d.* FROM documentos d${scopeJoin} WHERE d.id = ?`).get(...scopeParams);
  if (!doc) return res.status(404).json({ error: "Documento nao encontrado" });
  const filePath = path.join(UPLOAD_DIR, doc.arquivo);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Arquivo nao encontrado" });
  res.download(filePath, doc.nome);
});

router.delete("/:id", checkRole("admin"), (req, res) => {
  const doc = db.prepare("SELECT * FROM documentos WHERE id = ?").get(req.params.id);
  if (!doc) return res.status(404).json({ error: "Documento nao encontrado" });
  const filePath = path.join(UPLOAD_DIR, doc.arquivo);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.prepare("DELETE FROM documentos WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
