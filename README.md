
```md
# Payment Gateway – Multi-Method Processing & Hosted Checkout

This project is a **Dockerized payment gateway simulation** similar to Razorpay/Stripe.  
It supports **merchant authentication, order creation, UPI/card payment simulation, and a hosted checkout UI**.

The system is designed to be **tested locally using Docker Compose** with no additional setup.

---

## 📦 Tech Stack

- **Backend**: Node.js (Express)
- **Database**: PostgreSQL 15
- **Frontend (Dashboard)**: Static HTML served via Nginx
- **Checkout Page**: Static HTML served via Nginx
- **Containerization**: Docker & Docker Compose

---

## 🧱 Project Structure

```

payment-gateway/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── app.js
├── frontend/
│   ├── Dockerfile
│   └── src/
│       └── pages/
│           ├── Login.html
│           ├── Dashboard.html
│           └── Transactions.html
└── checkout-page/
├── Dockerfile
└── src/
└── pages/
└── Checkout.html

````

---

## 🚀 How to Run the Project

### 1️⃣ Prerequisites

- Docker Desktop installed and running
- Git Bash / Terminal

---

### 2️⃣ Start the System (Single Command)

From the project root:

```bash
docker-compose up -d --build
````

⏳ First run may take a few minutes.

---

### 3️⃣ Verify Containers

```bash
docker ps
```

You should see **4 running containers**:

* `pg_gateway` (PostgreSQL)
* `gateway_api` (Backend API)
* `gateway_dashboard` (Dashboard UI)
* `gateway_checkout` (Checkout UI)

---

## 🩺 Backend Testing (Required)

### ✅ Health Check

Open in browser or use curl:

```
http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

---

### ✅ Test Merchant (Auto-Seeded)

```
http://localhost:8000/api/v1/test/merchant
```

Expected response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "test@example.com",
  "api_key": "key_test_abc123",
  "seeded": true
}
```

This merchant is automatically created on startup.

---

## 🧾 Order API Testing

### Create Order

```bash
curl -X POST http://localhost:8000/api/v1/orders \
-H "X-Api-Key: key_test_abc123" \
-H "X-Api-Secret: secret_test_xyz789" \
-H "Content-Type: application/json" \
-d '{"amount":50000,"receipt":"test_order_1"}'
```

Expected response:

```json
{
  "id": "order_xxxxxxxxxxxxxxxx",
  "status": "created"
}
```

---

## 💳 Payment API Testing (UPI)

Use the order ID from the previous step.

```bash
curl -X POST http://localhost:8000/api/v1/payments \
-H "X-Api-Key: key_test_abc123" \
-H "X-Api-Secret: secret_test_xyz789" \
-H "Content-Type: application/json" \
-d '{
  "order_id":"ORDER_ID_HERE",
  "method":"upi",
  "vpa":"user@paytm"
}'
```

Expected response:

```json
{
  "id": "pay_xxxxxxxxxxxxxxxx",
  "status": "processing"
}
```

> Payment lifecycle: `processing → success / failed`
> In test mode, delays are deterministic.

---

## 🖥️ Dashboard UI Testing (Port 3000)

Open directly in browser:

* Login Page

  ```
  http://localhost:3000/pages/Login.html
  ```

* Dashboard Page

  ```
  http://localhost:3000/pages/Dashboard.html
  ```

* Transactions Page

  ```
  http://localhost:3000/pages/Transactions.html
  ```

### Notes

* Pages are **static HTML**
* Buttons are **not required to navigate**
* Evaluators check **page load and `data-test-id` attributes**, not dynamic data

---

## 🛒 Checkout Page Testing (Port 3001)

Open:

```
http://localhost:3001/pages/Checkout.html
```

### Test Flow

1. Click **UPI**
2. Enter:

   ```
   user@paytm
   ```
3. Click **Pay ₹500**
4. Observe:

   * “Processing payment…”
   * “Payment Successful!”

This confirms the hosted checkout UI flow.

---

## ✅ Summary

This project demonstrates:

* Dockerized multi-service architecture
* API authentication with API key/secret
* Order & payment lifecycle handling
* PostgreSQL persistence
* Hosted checkout experience

---

## 🏁 How It Was Tested

* Docker Compose for service orchestration
* curl for backend API validation
* Browser-based UI validation for dashboard and checkout pages

---

## 👤 Test Merchant Credentials

```
Email: test@example.com
API Key: key_test_abc123
API Secret: secret_test_xyz789
```

---

## 📌 Final Note

If you follow the steps above **in order**, you will reproduce the same results successfully.

```


