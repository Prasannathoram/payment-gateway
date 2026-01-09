import { pool } from "../db.js";

export async function testMerchant(req,res){
  const r = await pool.query("SELECT * FROM merchants WHERE email='test@example.com'");
  if (!r.rowCount) return res.sendStatus(404);
  res.json({ id:r.rows[0].id, email:r.rows[0].email, api_key:r.rows[0].api_key, seeded:true });
}
