// backend/routes/listings.js
import { Router } from "express";
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "reshenia_dev",
  waitForConnections: true,
  connectionLimit: 10,
});

/** Create index only if it’s missing (works on all MySQL versions). */
async function ensureIndex(table, indexName, colsParen) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS cnt
       FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name   = ?
        AND index_name   = ?`,
    [table, indexName]
  );
  if (rows[0].cnt === 0) {
    await pool.query(`CREATE INDEX ${indexName} ON ${table} ${colsParen}`);
    console.log(`Created index ${indexName} on ${table}`);
  }
}

const r = Router();

/** Create table if missing; then add indexes (no IF NOT EXISTS in ALTER). */
async function ensureSchema() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        kind          VARCHAR(20)  NOT NULL,     -- property | car | job | hotel/lodge | lost | scholarship
        role          VARCHAR(20)  NOT NULL,     -- agent | owner | landlord | employer
        category      VARCHAR(50)  NULL,         -- apartment, house, saloon, pickup, etc.
        sale_rent     ENUM('sale','rent','hire') NULL,
        title         VARCHAR(255) NOT NULL,
        city          VARCHAR(80)  NULL,
        location_name VARCHAR(255) NULL,
        price         DECIMAL(12,2) NULL,
        phone         VARCHAR(40)  NULL,
        summary       VARCHAR(500) NULL,
        image_url     VARCHAR(255) NULL,
        gps_lat       DECIMAL(10,7) NULL,
        gps_lng       DECIMAL(10,7) NULL,
        user_id       INT          NULL,
        is_verified   TINYINT      DEFAULT 0,
        is_free       TINYINT      DEFAULT 0,
        created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } finally {
    conn.release();
  }

  // Add helpful indexes (portable way)
  await ensureIndex("listings", "idx_kind_city", "(kind, city)");
  await ensureIndex("listings", "idx_created",   "(created_at)");
}

// Ensure schema on module load
await ensureSchema();

/** GET /api/listings */
r.get("/listings", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, kind, role, category, sale_rent, title, city, location_name,
              price, phone, summary, image_url, gps_lat, gps_lng, created_at
         FROM listings
        ORDER BY id DESC
        LIMIT 200`
    );
    res.json({ ok: true, data: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "List failed" });
  }
});

/** POST /api/listings */
r.post("/listings", async (req, res) => {
  try {
    const {
      kind, role, category, sale_rent,
      title, city, location_name,
      price, phone, summary, image_url,
      gps_lat, gps_lng, user_id
    } = req.body;

    const [rs] = await pool.query(
      `INSERT INTO listings
       (kind, role, category, sale_rent, title, city, location_name, price, phone, summary, image_url, gps_lat, gps_lng, user_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        kind ?? "property",
        role ?? "landlord",
        category ?? null,
        sale_rent ?? null,
        title ?? "",
        city ?? null,
        location_name ?? null,
        price ?? null,
        phone ?? null,
        summary ?? null,
        image_url ?? null,
        gps_lat ?? null,
        gps_lng ?? null,
        user_id ?? null
      ]
    );

    res.json({ ok: true, id: rs.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message || "Create failed" });
  }
});

export default r;
