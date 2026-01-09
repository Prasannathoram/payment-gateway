import { pool } from "../db.js";

export async function auth(req, res, next) {
  const key = req.header("X-Api-Key");
  const secret = req.header("X-Api-Secret");

  const r = await pool.query(
    "SELECT * FROM merchants WHERE api_key=$1 AND api_secret=$2",
    [key, secret]
  );

  if (!r.rowCount) {
    return res.status(401).json({
      error: { code: "AUTHENTICATION_ERROR", description: "Invalid API credentials" }
    });
  }

  req.merchant = r.rows[0];
  next();
}
