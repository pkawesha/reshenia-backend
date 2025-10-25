// backend/models/zraInvoices.js
import { pool } from "../lib/db.js";

export async function nextInvoiceNumber() {
  const y = new Date().toISOString().slice(0,7).replace('-','');
  const [r] = await pool.query(`SELECT COUNT(*) AS c FROM zra_invoices WHERE local_invoice_no LIKE ?`, [`ZRA-${y}-%`]);
  const c = (r[0]?.c || 0) + 1;
  return `ZRA-${y}-${String(c).padStart(4,'0')}`;
}

export async function createZraInvoiceRow({ payment_ref, local_invoice_no, customer_name, currency, total_net, tax_amount, total_gross, request_json }) {
  const [r] = await pool.query(
    `INSERT INTO zra_invoices (payment_ref, local_invoice_no, customer_name, currency, total_net, tax_amount, total_gross, request_json, status)
     VALUES (?,?,?,?,?,?,?,?, 'draft')`,
    [payment_ref, local_invoice_no, customer_name, currency, total_net, tax_amount, total_gross, JSON.stringify(request_json)]
  );
  return r.insertId;
}

export async function markZraInvoiceResult(id, result) {
  const status = result?.status || 'failed';
  await pool.query(`UPDATE zra_invoices SET response_json=?, status=? WHERE id=?`, [JSON.stringify(result||{}), status, id]);
}
