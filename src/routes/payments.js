import { Router } from 'express';
import { configs } from '../state.js';

export const router = Router();

// Placeholder endpoints for mobile money payments. Replace with real integrations.
router.get('/channels', (req, res) => {
  res.json({
    airtel: process.env.AIRTEL_NUMBER || null,
    mtn: process.env.MTN_NUMBER || null,
    zamtel: process.env.ZAMTEL_NUMBER || null,
    zanaco: process.env.ZANACO_ACCOUNT || null,
    group_activation_fee_zmw: configs.payments.group_activation_fee_zmw,
    viewing_unlock_fee_zmw: configs.viewing_charges.unlock_fee_zmw
  });
});

router.post('/verify', (req, res) => {
  // Accepts { reference, amount, channel }, returns fake OK for now
  res.json({ ok: true, verified: true });
});
