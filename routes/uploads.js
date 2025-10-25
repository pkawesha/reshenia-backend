// backend/routes/uploads.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const r = Router();
const dir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg");
    cb(null, Date.now() + "-" + Math.random().toString(36).slice(2) + ext);
  }
});
const upload = multer({ storage });

r.post("/image", upload.single("image"), (req,res)=>{
  if (!req.file) return res.json({ ok:false, error:"No file" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ ok:true, url });
});

export default r;
