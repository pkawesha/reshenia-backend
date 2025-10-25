import 'dotenv/config';            // <= make sure this is the first line
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS ?? '',   // will be "NewStrongPassword!"
  database: process.env.DB_NAME || 'reshenia_dev',
  waitForConnections: true,
  connectionLimit: 10,
});
