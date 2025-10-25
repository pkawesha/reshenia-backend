// backend/routes/referral.js
import { Router } from "express";
import { pool } from "../lib/db.js";
const r = Router();

r.get("/r/:code", async (req,res)=>{
  const code = req.params.code;
  const to = req.query.to || "/";
  await pool.query(`INSERT INTO referrals(code, landing_url, ip, ua) VALUES (?,?,?,?)`,
    [code, String(to).slice(0,250), req.ip, (req.headers['user-agent']||'').slice(0,250)]);
  res.redirect(to);
});

export default r;
