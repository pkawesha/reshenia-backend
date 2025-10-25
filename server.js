import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import listingsRouter from "./routes/listings.js";
// import paymentRouter from "./routes/payments_simulate.js"; // <-- leave commented until later

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// legal terms
// visible disclaimer (text/plain) — includes Lost & Found & Scholarships line
app.get("/api/legal/terms", (_req, res) => {
  res.type("text/plain").send(
`Reshenia Terms (Short)
1) Reshenia is an adverts platform. We are not a party to user transactions and do not hold client funds.
2) Contact unlocks are informational; you are responsible for due diligence.
3) Jobs: employers pay to post; job-seekers view contacts free.
4) Security best-efforts only; protect your devices and passwords.
5) Lost & Found and Scholarships are free-to-post to support community access.`
  );
});


// routes
app.use("/api", listingsRouter);
// app.use("/api/payments", paymentRouter); // enable later

// health
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Reshenia backend running on http://localhost:${PORT}`));
