require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { authenticate } = require("./middleware/auth.cjs");
const { auditLog } = require("./middleware/audit.cjs");
const authRoutes = require("./routes/auth.cjs");
const usersRoutes = require("./routes/users.cjs");
const departmentsRoutes = require("./routes/departments.cjs");
const visitorsRoutes = require("./routes/visitors.cjs");
const timelineRoutes = require("./routes/timeline.cjs");
const dashboardRoutes = require("./routes/dashboard.cjs");
const reportsRoutes = require("./routes/reports.cjs");
const notificationsRoutes = require("./routes/notifications.cjs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);

app.use("/api", authenticate);
app.use("/api", auditLog);

app.use("/api/users", usersRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/visitors", visitorsRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/notifications", notificationsRoutes.router);
app.use("/api/logs", require("./routes/logs.cjs"));
app.use("/api/settings", require("./routes/settings.cjs"));
app.use("/api/colaboradores", require("./routes/colaboradores.cjs"));
app.use("/api/ciclos", require("./routes/ciclos.cjs"));
app.use("/api/competencias", require("./routes/competencias.cjs"));
app.use("/api/avaliacoes", require("./routes/avaliacoes.cjs"));
app.use("/api/metas", require("./routes/metas.cjs"));
app.use("/api/pdi", require("./routes/pdi.cjs"));
app.use("/api/feedbacks", require("./routes/feedbacks.cjs"));
app.use("/api/historico", require("./routes/historico.cjs"));
app.use("/api/dashboard-performance", require("./routes/dashboard-performance.cjs"));
app.use("/api/export", require("./routes/export.cjs"));
app.use("/api/documentos", require("./routes/documentos.cjs"));
app.use("/api/cursos", require("./routes/cursos.cjs"));

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "Arquivo muito grande. Maximo 20MB." });
  if (err.message && err.message.includes("Tipo de arquivo")) return res.status(400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
});
