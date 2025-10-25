import { Router } from 'express';
export const router = Router();

router.post('/image', (req, res) => {
  const { base64, url } = req.body || {};
  if (!base64 && !url) {
    return res.status(400).json({ error: 'Provide base64 or url' });
  }

  const path = url || `data:image/*;base64,${String(base64).slice(0, 16)}...`;
  res.json({ ok: true, path });
});
