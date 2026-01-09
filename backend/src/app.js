import express from "express";
import { seed } from "./seed.js";
import { auth } from "./utils/auth.js";
import health from "./routes/health.js";
import { create,get } from "./routes/orders.js";
import { create as pay } from "./routes/payments.js";
import { testMerchant } from "./routes/test.js";

const app = express();
app.use(express.json());

await seed();

app.get("/health", health);
app.get("/api/v1/test/merchant", testMerchant);
app.post("/api/v1/orders", auth, create);
app.get("/api/v1/orders/:id", auth, get);
app.post("/api/v1/payments", auth, pay);

app.listen(8000, ()=>console.log("API running"));
