// backend/models/ledger.js
import { pool } from "../lib/db.js";

export async function postEntry({ tx_ref=null, account, debit=0, credit=0, memo=null }) {
  const sql = `INSERT INTO ledger_entries (tx_ref, account, debit, credit, memo) VALUES (?,?,?,?,?)`;
  const [r] = await pool.query(sql, [tx_ref, account, Number(debit||0), Number(credit||0), memo]);
  return r.insertId;
}

export async function postUnlockPaymentToBooks({ ref, amount, commission, net }) {
  await postEntry({ tx_ref: ref, account: "Cash", debit: amount, credit: 0, memo: "Contact unlock" });
  await postEntry({ tx_ref: ref, account: "Commission Revenue", debit: 0, credit: commission, memo: "Commission" });
  await postEntry({ tx_ref: ref, account: "Seller Payable", debit: 0, credit: net, memo: "Net owed to seller" });
}

export async function trialBalance() {
  const [rows] = await pool.query(`SELECT account, SUM(debit) AS total_debit, SUM(credit) AS total_credit FROM ledger_entries GROUP BY account`);
  return rows;
}
