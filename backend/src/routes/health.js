import { pool } from "../db.js";
export default async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status:"healthy", database:"connected", timestamp:new Date().toISOString() });
  } catch {
    res.json({ status:"healthy", database:"disconnected", timestamp:new Date().toISOString() });
  }
};
