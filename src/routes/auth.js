import { Router } from 'express';
import jwt from 'jsonwebtoken';

export const router = Router();

// Super‑simple demo auth; replace with DB users in production.
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ sub: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});
