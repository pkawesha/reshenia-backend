// backend/services/zra.js
export function buildZraInvoicePayload({ localInvoiceNo, customer, totals, items }) {
  return { invoiceNo: localInvoiceNo, customer, totals, items };
}
export async function submitInvoiceToZRA(payload) {
  return { status: 'submitted', raw: { sandbox: true, payload } }; // stub for now
}
