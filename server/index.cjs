require("dotenv").config();
const express = require("express");
const cors = require("cors");
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



app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
});
