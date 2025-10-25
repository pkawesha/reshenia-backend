import { Router } from 'express';
export const router = Router();
router.get('/', (req, res) => res.json({ ok: true, service: 'reshenia', ts: Date.now() }));
