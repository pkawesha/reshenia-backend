// backend/routes/payments_simulate.js
import { Router } from "express";
const r = Router();


/**
 * Simulate a payment transaction.
 * Later, this route will be replaced by real Mobile Money APIs (Zamtel, Airtel, MTN).
 */
r.post("/simulate", async (req, res) => {
  try {
    const { listing_id, payer, network } = req.body;

    if (!listing_id || !payer || !network) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const msg = `Payment simulated for listing ${listing_id} by ${payer} via ${network}`;
    console.log(msg);

    res.json({
      ok: true,
      message: msg,
      reference: `TX-${Date.now()}`,
    });
  } catch (err) {
    console.error("Payment simulation error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default r;
