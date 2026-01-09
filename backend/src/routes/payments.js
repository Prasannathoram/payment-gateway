import { pool } from "../db.js";
import { validVPA } from "../utils/vpa.js";
import { luhn } from "../utils/luhn.js";
import { detect } from "../utils/cardNetwork.js";
import { validExpiry } from "../utils/expiry.js";

const gen = () => "pay_" + Math.random().toString(36).substring(2,18);

export async function create(req,res){
  const { order_id, method, vpa, card } = req.body;
  const o = await pool.query("SELECT * FROM orders WHERE id=$1",[order_id]);
  if (!o.rowCount) return res.status(404).json({ error:{ code:"NOT_FOUND_ERROR", description:"Order not found"} });

  let network,last4;
  if (method === "upi") {
    if (!validVPA(vpa))
      return res.status(400).json({ error:{ code:"INVALID_VPA", description:"Invalid VPA"} });
  }

  if (method === "card") {
    if (!luhn(card.number) || !validExpiry(card.expiry_month, card.expiry_year))
      return res.status(400).json({ error:{ code:"INVALID_CARD", description:"Card validation failed"} });
    network = detect(card.number);
    last4 = card.number.slice(-4);
  }

  const id = gen();
  await pool.query(
    "INSERT INTO payments(id,order_id,merchant_id,amount,currency,method,status,vpa,card_network,card_last4) VALUES($1,$2,$3,$4,'INR',$5,'processing',$6,$7,$8)",
    [id, order_id, o.rows[0].merchant_id, o.rows[0].amount, method, vpa, network, last4]
  );

  await new Promise(r=>setTimeout(r,Number(process.env.TEST_PROCESSING_DELAY)));

  await pool.query("UPDATE payments SET status='success', updated_at=NOW() WHERE id=$1",[id]);

  res.status(201).json({ id, order_id, amount:o.rows[0].amount, currency:"INR", method, vpa, card_network:network, card_last4:last4, status:"processing", created_at:new Date().toISOString() });
}
