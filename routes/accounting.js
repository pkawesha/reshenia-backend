// backend/routes/accounting.js
import { Router } from "express";
import { pool } from "../lib/db.js";
import { requireAdmin } from "../lib/adminAuth.js";
import { trialBalance } from "../models/ledger.js";

const r = Router();
r.use(requireAdmin);

r.get("/ledger/trial-balance", async (_req,res)=>{
  const rows = await trialBalance();
  res.json({ ok:true, rows });
});

r.get("/payments", async (_req,res)=>{
  const [rows] = await pool.query(`SELECT * FROM payments ORDER BY id DESC LIMIT 100`);
  res.json({ ok:true, rows });
});

r.get("/zra/invoices", async (_req,res)=>{
  const [rows] = await pool.query(`SELECT * FROM zra_invoices ORDER BY id DESC LIMIT 100`);
  res.json({ ok:true, rows });
});

export default r;
