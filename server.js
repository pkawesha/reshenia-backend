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

// 
app.get("/api/legal/terms", (_req, res) => {
  res.type("text/plain").send(
`Reshenia Opportunities - Legal Disclaimer and Terms of Use

1. Platform Scope:
   Reshenia Opportunities (the "Platform") is a listings and information service that allows users to advertise goods, services, land, employment, groups, and community activities including Chilimba, AU/UN/COMESA jobs, and lost & found announcements.

2. Transactions:
   The Platform does not participate in, intermediate, or guarantee any payments, transactions, or transfers between users. 
   All transactions, agreements, or exchanges of money are strictly between the parties involved. Reshenia does not hold, receive, or refund any funds on behalf of users.

3. Verification:
   While the Platform encourages legitimate postings, it does not independently verify ownership, authenticity, or accuracy of any listing or claim.
   Users must conduct their own due diligence before making payments, sharing personal data, or visiting any property or contact.

4. Communication and Contact:
   “Call” and “WhatsApp” buttons are provided for convenience only. Users communicate directly at their own discretion and risk. 
   Reshenia does not record or monitor such communications.

5. Employment and External Opportunities:
   Job listings under UN, AU, COMESA, or similar organizations are provided for public convenience.
   Applicants are encouraged to confirm vacancies directly through the respective official portals.

6. Lost and Found / Community Notices:
   Lost, stolen, or found property posts are provided as a free public service.
   Reshenia accepts no liability for recovery outcomes or related actions.

7. Data and Privacy:
   Contact information shared in listings is voluntary. The Platform does not sell personal data to third parties.

8. Limitation of Liability:
   Reshenia Opportunities, its developers, and affiliates are not liable for any direct or indirect losses, damages, or fraud arising from the use of the Platform or interactions between users.

9. Acceptance:
   By using this application, you acknowledge and accept these terms and agree to use the Platform lawfully and responsibly.`
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

// --- jobs (AU / UN / COMESA) — JSON-backed
app.get("/api/jobs", (_req, res) => res.json(readJSON(jobsPath)));
app.post("/api/jobs", (req, res) => {
  const db = readJSON(jobsPath);
  const nextId = (db.items.at(-1)?.id || 0) + 1;
  db.items.push({ id: nextId, ...req.body });
  writeJSON(jobsPath, db);
  res.json({ ok: true, id: nextId });
});

// --- start
const PORT = process.env.PORT || 4001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Reshenia API] listening on http://localhost:${PORT}`);
});

