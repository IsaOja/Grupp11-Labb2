const express = require("express"),
  path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { getClient, ensureTables } = require("./db");

const app = express(),
  port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/", async (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  try {
    const client = await getClient();
    if (!client)
      return res.status(500).json({ error: "database not configured" });

    const password_hash = await bcrypt.hash(password, 10);
    const insert = await client.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
      [username, password_hash]
    );
    await client.end();
    res.status(201).json({ user: insert.rows[0] });
  } catch (err) {
    if (err && err.code === "23505") {
      return res.status(409).json({ error: "username_taken" });
    }
    console.error(err);
    res.status(500).json({ error: "internal_error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  try {
    const client = await getClient();
    if (!client)
      return res.status(500).json({ error: "database not configured" });

    const q = await client.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username]
    );
    await client.end();
    const user = q.rows[0];
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    res.json({ ok: true, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_error" });
  }
});

app.use(express.static(path.join(path.resolve(), "dist")));

ensureTables()
  .catch((e) => console.error("Failed to ensure tables:", e))
  .finally(() => {
    app.listen(port, () => {
      console.log(`Redo på http://localhost:${port}/`);
    });
  });
