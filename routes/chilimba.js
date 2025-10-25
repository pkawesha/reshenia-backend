// backend/routes/chilimba.js
import { Router } from "express";
import { pool } from "../lib/db.js";

const r = Router();

r.post("/groups", async (req,res)=>{
  const { name, city=null, frequency='monthly', contribution_amount, cycle_start=null } = req.body || {};
  const [rs] = await pool.query(`INSERT INTO chilimba_groups (name, city, frequency, contribution_amount, cycle_start) VALUES (?,?,?,?,?)`,
    [name, city, frequency, contribution_amount, cycle_start]);
  res.json({ ok:true, id: rs.insertId });
});

r.post("/groups/:id/members", async (req,res)=>{
  const gid = Number(req.params.id);
  const { name, phone, share_order } = req.body || {};
  const [rs] = await pool.query(`INSERT INTO chilimba_members (group_id, name, phone, share_order) VALUES (?,?,?,?)`, [gid, name, phone, share_order]);
  res.json({ ok:true, id: rs.insertId });
});

r.post("/groups/:id/contributions/generate", async (req,res)=>{
  const gid = Number(req.params.id);
  const { start_date, periods=12 } = req.body || {};
  const [members] = await pool.query(`SELECT id, share_order FROM chilimba_members WHERE group_id=? AND is_active=1 ORDER BY share_order ASC`, [gid]);
  if (!members.length) return res.json({ ok:false, error:"No members" });
  let inserted = 0
  for (let p=0; p<periods; p++) {
    for (const m of members) {
      const due = new Date(start_date || Date.now());
      due.setMonth(due.getMonth() + p);
      await pool.query(`INSERT INTO chilimba_contributions (group_id, member_id, amount, due_date) VALUES (?,?, (SELECT contribution_amount FROM chilimba_groups WHERE id=?), ?)`,
        [gid, m.id, gid, due.toISOString().slice(0,10)]);
      inserted += 1
    }
  }
  res.json({ ok:true, inserted });
});

r.get("/groups/:id/contributions", async (req,res)=>{
  const gid = Number(req.params.id);
  const [rows] = await pool.query(`SELECT c.*, m.name, m.phone FROM chilimba_contributions c JOIN chilimba_members m ON m.id=c.member_id WHERE c.group_id=? ORDER BY due_date ASC`, [gid]);
  res.json({ ok:true, rows });
});

export default r;
