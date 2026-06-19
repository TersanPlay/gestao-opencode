const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

if (typeof BigInt !== "undefined" && !BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function () { return Number(this); };
}

const dbPath = path.join(__dirname, "corporate.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT DEFAULT '',
    role TEXT DEFAULT 'operator',
    active INTEGER DEFAULT 1,
    departmentId INTEGER DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    parentId INTEGER DEFAULT NULL,
    responsibleId INTEGER DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parentId) REFERENCES departments(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    document TEXT DEFAULT '',
    company TEXT DEFAULT '',
    photo TEXT DEFAULT NULL,
    isDisposable INTEGER DEFAULT 0,
    departmentId INTEGER DEFAULT NULL,
    responsibleId INTEGER DEFAULT NULL,
    status TEXT DEFAULT 'scheduled',
    purpose TEXT DEFAULT '',
    scheduledAt TEXT DEFAULT (datetime('now')),
    checkinAt TEXT DEFAULT NULL,
    checkoutAt TEXT DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS timeline_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitorId INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    author TEXT DEFAULT '',
    timestamp TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (visitorId) REFERENCES visitors(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    title TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    link TEXT DEFAULT NULL,
    read INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER DEFAULT NULL,
    userName TEXT DEFAULT '',
    userRole TEXT DEFAULT '',
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resourceId TEXT DEFAULT NULL,
    details TEXT DEFAULT '',
    ip TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    updatedAt TEXT DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS colaboradores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT DEFAULT '',
    cpf TEXT DEFAULT '',
    matricula TEXT DEFAULT '',
    cargo TEXT DEFAULT '',
    departamentoId INTEGER DEFAULT NULL,
    funcao TEXT DEFAULT '',
    cargaHoraria INTEGER DEFAULT 0,
    ano INTEGER DEFAULT NULL,
    mes INTEGER DEFAULT NULL,
    vinculo TEXT DEFAULT '',
    dataAdmissao TEXT DEFAULT '',
    dataDesligamento TEXT DEFAULT NULL,
    gestorId INTEGER DEFAULT NULL,
    userId INTEGER DEFAULT NULL,
    status TEXT DEFAULT 'ativo',
    foto TEXT DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (departamentoId) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (gestorId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS ciclos_avaliacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    dataInicio TEXT DEFAULT '',
    dataFim TEXT DEFAULT '',
    status TEXT DEFAULT 'aberto',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS competencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    colaboradorId INTEGER NOT NULL,
    cicloId INTEGER NOT NULL,
    avaliadorId INTEGER NOT NULL,
    tipo TEXT DEFAULT 'gestor',
    notaFinal REAL DEFAULT 0,
    conceitoFinal TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id) ON DELETE CASCADE,
    FOREIGN KEY (cicloId) REFERENCES ciclos_avaliacao(id) ON DELETE CASCADE,
    FOREIGN KEY (avaliadorId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS avaliacao_competencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    avaliacaoId INTEGER NOT NULL,
    competenciaId INTEGER NOT NULL,
    nota INTEGER DEFAULT 0,
    FOREIGN KEY (avaliacaoId) REFERENCES avaliacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (competenciaId) REFERENCES competencias(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS metas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    colaboradorId INTEGER NOT NULL,
    cicloId INTEGER DEFAULT NULL,
    nome TEXT NOT NULL,
    descricao TEXT DEFAULT '',
    metaEsperada TEXT DEFAULT '',
    resultadoObtido TEXT DEFAULT '',
    percentualConclusao INTEGER DEFAULT 0,
    prazo TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    responsavelId INTEGER DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id) ON DELETE CASCADE,
    FOREIGN KEY (cicloId) REFERENCES ciclos_avaliacao(id) ON DELETE SET NULL,
    FOREIGN KEY (responsavelId) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS pdi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    colaboradorId INTEGER NOT NULL,
    cicloId INTEGER DEFAULT NULL,
    objetivo TEXT NOT NULL,
    acoesPrevistas TEXT DEFAULT '',
    prazo TEXT DEFAULT '',
    responsavelId INTEGER DEFAULT NULL,
    status TEXT DEFAULT 'pending',
    evidencias TEXT DEFAULT '',
    observacoes TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id) ON DELETE CASCADE,
    FOREIGN KEY (cicloId) REFERENCES ciclos_avaliacao(id) ON DELETE SET NULL,
    FOREIGN KEY (responsavelId) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    colaboradorId INTEGER NOT NULL,
    autorId INTEGER NOT NULL,
    tipo TEXT DEFAULT 'gestor',
    comentario TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id) ON DELETE CASCADE,
    FOREIGN KEY (autorId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS historico_colaborador (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    colaboradorId INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT DEFAULT '',
    dataReferencia TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id) ON DELETE CASCADE
  );
`);

try {
  const dupCount = db.prepare("SELECT COUNT(*) as count FROM (SELECT nome FROM competencias GROUP BY nome HAVING COUNT(*) > 1)").get().count;
  if (dupCount > 0) db.exec("DELETE FROM competencias WHERE id NOT IN (SELECT MIN(id) FROM competencias GROUP BY nome)");
} catch (e) {}
try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_competencias_nome ON competencias(nome)"); } catch (e) {}
try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_avaliacao_competencia ON avaliacao_competencias(avaliacaoId, competenciaId)"); } catch (e) {}

const COMPETENCIAS_SEED = [
  { nome: "Comunicação", descricao: "Capacidade de se expressar e se comunicar com clareza" },
  { nome: "Trabalho em Equipe", descricao: "Capacidade de colaborar e trabalhar em grupo" },
  { nome: "Produtividade", descricao: "Capacidade de entregar resultados no prazo" },
  { nome: "Qualidade das Entregas", descricao: "Capacidade de entregar com excelência" },
  { nome: "Comprometimento", descricao: "Envolvimento e dedicação com o trabalho" },
  { nome: "Liderança", descricao: "Capacidade de liderar e inspirar pessoas" },
];

const seedCompetencias = db.prepare("INSERT OR IGNORE INTO competencias (nome, descricao) VALUES (?, ?)");
for (const c of COMPETENCIAS_SEED) seedCompetencias.run(c.nome, c.descricao);

const SETTINGS_SEED = [
  { key: "instituicao_nome", value: "Câmara Municipal", description: "Nome da instituição" },
  { key: "logo_url", value: "", description: "URL da logomarca" },
  { key: "sessao_expiracao", value: "8", description: "Tempo de expiração da sessão (horas)" },
  { key: "notificacoes_ativas", value: "true", description: "Ativar notificações do sistema" },
  { key: "horario_abertura", value: "08:00", description: "Horário de abertura da portaria" },
  { key: "horario_fechamento", value: "18:00", description: "Horário de fechamento da portaria" },
  { key: "email_notificacoes", value: "false", description: "Enviar notificações por email" },
  { key: "smtp_host", value: "", description: "Servidor SMTP" },
  { key: "smtp_port", value: "587", description: "Porta SMTP" },
  { key: "smtp_secure", value: "false", description: "SMTP usar TLS" },
  { key: "smtp_user", value: "", description: "Usuário SMTP" },
  { key: "smtp_pass", value: "", description: "Senha SMTP" },
  { key: "smtp_from", value: "noreply@gestao-opencode.app", description: "Remetente de email" },
];

const seedSettings = db.prepare("INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)");
for (const s of SETTINGS_SEED) seedSettings.run(s.key, s.value, s.description);

try { db.exec("ALTER TABLE visitors ADD COLUMN isDisposable INTEGER DEFAULT 0"); } catch (e) {}
try { db.exec("ALTER TABLE avaliacoes ADD COLUMN comentarios TEXT DEFAULT ''"); } catch (e) {}
try { db.exec("ALTER TABLE colaboradores ADD COLUMN ano INTEGER DEFAULT NULL"); } catch (e) {}
try { db.exec("ALTER TABLE colaboradores ADD COLUMN mes INTEGER DEFAULT NULL"); } catch (e) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS documentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    colaboradorId INTEGER NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT DEFAULT '',
    arquivo TEXT NOT NULL,
    mimeType TEXT DEFAULT '',
    tamanho INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT DEFAULT '',
    cargaHoraria INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS colaborador_cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    colaboradorId INTEGER NOT NULL,
    cursoId INTEGER NOT NULL,
    dataInicio TEXT DEFAULT '',
    dataFim TEXT DEFAULT '',
    status TEXT DEFAULT 'pendente',
    certificado TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (colaboradorId) REFERENCES colaboradores(id) ON DELETE CASCADE,
    FOREIGN KEY (cursoId) REFERENCES cursos(id) ON DELETE CASCADE
  );
`);

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get("admin.admin@admin.com");

if (!existing) {
  const hash = bcrypt.hashSync("admin@123", 10);
  db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
  ).run("Admin Principal", "admin.admin@admin.com", hash, "admin");
  console.log("✓ Usuário admin criado: admin.admin@admin.com");
}

module.exports = db;
