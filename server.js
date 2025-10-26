// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- basics
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("tiny"));

// --- paths & tiny JSON store helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const ensureFile = (name, fallback) => {
  const p = path.join(dataDir, name);
  if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify(fallback, null, 2));
  return p;
};
const listingsPath = ensureFile("listings.json", { items: [] });
const jobsPath = ensureFile("jobs.json", { items: [] });
const groupsPath = ensureFile("groups.json", { items: [] });
const chilimbaPath = ensureFile("chilimba.json", { items: [] });

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJSON = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");

// --- health
app.get("/health", (_req, res) =>
  res.json({ ok: true, service: "reshenia", now: new Date().toISOString() })
);

// --- legal / disclaimer (restored)
app.get("/api/legal/terms", (_req, res) => {
  res.type("text/plain").send(
`Reshenia Terms (Short)
1) Reshenia is an adverts platform. We are not a party to user transactions and do not hold client funds.
2) Unlocking contact details is informational only; perform your own due diligence.
3) Jobs: employers pay to post; job-seekers view contacts free.
4) Security is best-effort; protect your devices, passwords, and personal data.
5) Lost & Found and Scholarships are free to support community access.`
  );
});

// --- listings
app.get("/api/listings", (_req, res) => res.json(readJSON(listingsPath)));
app.post("/api/listings", (req, res) => {
  const db = readJSON(listingsPath);
  const nextId = (db.items.at(-1)?.id || 0) + 1;
  db.items.push({ id: nextId, ...req.body });
  writeJSON(listingsPath, db);
  res.json({ ok: true, id: nextId });
});

// quick land/plots view (filter from listings)
app.get("/api/land", (_req, res) => {
  const all = readJSON(listingsPath).items;
  res.json({ items: all.filter(x => (x.type || "").toLowerCase() === "land") });
});

// --- jobs
app.get("/api/jobs", (_req, res) => res.json(readJSON(jobsPath)));
app.post("/api/jobs", (req, res) => {
  const db = readJSON(jobsPath);
  const nextId = (db.items.at(-1)?.id || 0) + 1;
  db.items.push({ id: nextId, ...req.body });
  writeJSON(jobsPath, db);
  res.json({ ok: true, id: nextId });
});

// --- WhatsApp groups
app.get("/api/groups", (_req, res) => res.json(readJSON(groupsPath)));
app.post("/api/groups", (req, res) => {
  const db = readJSON(groupsPath);
  const nextId = (db.items.at(-1)?.id || 0) + 1;
  db.items.push({ id: nextId, ...req.body });
  writeJSON(groupsPath, db);
  res.json({ ok: true, id: nextId });
});

// --- Chilimba
app.get("/api/chilimba", (_req, res) => res.json(readJSON(chilimbaPath)));
app.post("/api/chilimba", (req, res) => {
  const db = readJSON(chilimbaPath);
  const nextId = (db.items.at(-1)?.id || 0) + 1;
  db.items.push({ id: nextId, ...req.body });
  writeJSON(chilimbaPath, db);
  res.json({ ok: true, id: nextId });
});

// --- start
const PORT = process.env.PORT || 4001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Reshenia API] listening on http://localhost:${PORT}`);
});
