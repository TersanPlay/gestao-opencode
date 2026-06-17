const express = require("express");
const router = express.Router();
const db = require("../db.cjs");

router.get("/:visitorId", (req, res) => {
  const events = db.prepare("SELECT * FROM timeline_events WHERE visitorId = ? ORDER BY timestamp ASC").all(req.params.visitorId);
  res.json(events);
});

router.post("/", (req, res) => {
  const { visitorId, type, description, author } = req.body;
  const result = db.prepare("INSERT INTO timeline_events (visitorId, type, description, author) VALUES (?, ?, ?, ?)").run(
    visitorId, type, description, author || ""
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

module.exports = router;
