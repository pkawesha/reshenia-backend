// backend/lib/commission.js
export function calcCommission(amount, rateStr = process.env.COMMISSION_RATE, minStr = process.env.COMMISSION_MIN) {
  const rate = Number(rateStr || 0), min = Number(minStr || 0), amt = Number(amount || 0);
  const fee = Math.max(amt * rate, min);
  return { amount: amt, rate, min, commission: +fee.toFixed(2), net_to_seller: +(amt - fee).toFixed(2), currency: process.env.CURRENCY || "ZMW" };
}
