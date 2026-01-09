import { pool } from "../db.js";

const gen = () => "order_" + Math.random().toString(36).substring(2,18);

export async function create(req,res){
  const { amount,currency="INR",receipt,notes } = req.body;
  if (!amount || amount < 100)
    return res.status(400).json({ error:{ code:"BAD_REQUEST_ERROR", description:"amount must be at least 100"} });

  const id = gen();
  await pool.query(
    "INSERT INTO orders VALUES($1,$2,$3,$4,$5,$6,'created',NOW(),NOW())",
    [id, req.merchant.id, amount, currency, receipt, notes]
  );
  res.status(201).json({ id, merchant_id:req.merchant.id, amount, currency, receipt, notes, status:"created", created_at:new Date().toISOString() });
}

export async function get(req,res){
  const r = await pool.query("SELECT * FROM orders WHERE id=$1",[req.params.id]);
  if (!r.rowCount) return res.status(404).json({ error:{ code:"NOT_FOUND_ERROR", description:"Order not found"} });
  res.json(r.rows[0]);
}
