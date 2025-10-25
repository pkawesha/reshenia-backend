import { Router } from 'express';
import { configs } from '../state.js';

export const router = Router();

// Demo in-memory groups store
const groups = [
  { id: 1, name: 'Chipata Chilimba Group A', platform: 'WhatsApp', active: false, members: 12 },
];

router.get('/', (req, res) => res.json({ items: groups }));

router.post('/activate/:id', (req, res) => {
  const id = Number(req.params.id);
  const g = groups.find(x => x.id === id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  // In production, verify payment txn before activation
  g.active = true;
  res.json({ ok: true, feeZMW: configs.payments.group_activation_fee_zmw, group: g });
});
