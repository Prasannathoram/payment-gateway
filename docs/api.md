

\# API Documentation – Payment Gateway



Base URL (Local):



```

http://localhost:8000

```



Authentication is required for all protected endpoints using:



```

X-Api-Key

X-Api-Secret

```



---



\## 1️⃣ Health Check



\### GET `/health`



\*\*Authentication:\*\* ❌ Not required



\*\*Description:\*\*

Checks application and database health.



\*\*Response – 200 OK\*\*



```json

{

&nbsp; "status": "healthy",

&nbsp; "database": "connected",

&nbsp; "timestamp": "2026-01-09T10:20:03.747Z"

}

```



---



\## 2️⃣ Test Merchant Endpoint (Evaluation Only)



\### GET `/api/v1/test/merchant`



\*\*Authentication:\*\* ❌ Not required



\*\*Description:\*\*

Returns seeded test merchant details.



\*\*Response – 200 OK\*\*



```json

{

&nbsp; "id": "550e8400-e29b-41d4-a716-446655440000",

&nbsp; "email": "test@example.com",

&nbsp; "api\_key": "key\_test\_abc123",

&nbsp; "seeded": true

}

```



---



\## 3️⃣ Create Order



\### POST `/api/v1/orders`



\*\*Authentication:\*\* ✅ Required



\*\*Headers\*\*



```

X-Api-Key: key\_test\_abc123

X-Api-Secret: secret\_test\_xyz789

Content-Type: application/json

```



\*\*Request Body\*\*



```json

{

&nbsp; "amount": 50000,

&nbsp; "currency": "INR",

&nbsp; "receipt": "receipt\_123",

&nbsp; "notes": {

&nbsp;   "customer\_name": "John Doe"

&nbsp; }

}

```



\*\*Response – 201 Created\*\*



```json

{

&nbsp; "id": "order\_992ti3z89qb",

&nbsp; "merchant\_id": "550e8400-e29b-41d4-a716-446655440000",

&nbsp; "amount": 50000,

&nbsp; "currency": "INR",

&nbsp; "receipt": "receipt\_123",

&nbsp; "status": "created",

&nbsp; "created\_at": "2026-01-09T11:00:37.158Z"

}

```



\*\*Error – 400 BAD\_REQUEST\_ERROR\*\*



```json

{

&nbsp; "error": {

&nbsp;   "code": "BAD\_REQUEST\_ERROR",

&nbsp;   "description": "amount must be at least 100"

&nbsp; }

}

```



\*\*Error – 401 AUTHENTICATION\_ERROR\*\*



```json

{

&nbsp; "error": {

&nbsp;   "code": "AUTHENTICATION\_ERROR",

&nbsp;   "description": "Invalid API credentials"

&nbsp; }

}

```



---



\## 4️⃣ Get Order



\### GET `/api/v1/orders/{order\_id}`



\*\*Authentication:\*\* ✅ Required



\*\*Response – 200 OK\*\*



```json

{

&nbsp; "id": "order\_992ti3z89qb",

&nbsp; "merchant\_id": "550e8400-e29b-41d4-a716-446655440000",

&nbsp; "amount": 50000,

&nbsp; "currency": "INR",

&nbsp; "receipt": "receipt\_123",

&nbsp; "status": "created",

&nbsp; "created\_at": "2026-01-09T11:00:37.158Z",

&nbsp; "updated\_at": "2026-01-09T11:00:37.158Z"

}

```



\*\*Error – 404 NOT\_FOUND\_ERROR\*\*



```json

{

&nbsp; "error": {

&nbsp;   "code": "NOT\_FOUND\_ERROR",

&nbsp;   "description": "Order not found"

&nbsp; }

}

```



---



\## 5️⃣ Create Payment



\### POST `/api/v1/payments`



\*\*Authentication:\*\* ✅ Required



---



\### 🔹 UPI Payment



\*\*Request Body\*\*



```json

{

&nbsp; "order\_id": "order\_992ti3z89qb",

&nbsp; "method": "upi",

&nbsp; "vpa": "user@paytm"

}

```



\*\*Response – 201 Created\*\*



```json

{

&nbsp; "id": "pay\_wxscjykuqc",

&nbsp; "order\_id": "order\_992ti3z89qb",

&nbsp; "amount": 50000,

&nbsp; "currency": "INR",

&nbsp; "method": "upi",

&nbsp; "vpa": "user@paytm",

&nbsp; "status": "processing",

&nbsp; "created\_at": "2026-01-09T10:23:31.390Z"

}

```



---



\### 🔹 Card Payment



\*\*Request Body\*\*



```json

{

&nbsp; "order\_id": "order\_992ti3z89qb",

&nbsp; "method": "card",

&nbsp; "card": {

&nbsp;   "number": "4111111111111111",

&nbsp;   "expiry\_month": "12",

&nbsp;   "expiry\_year": "2026",

&nbsp;   "cvv": "123",

&nbsp;   "holder\_name": "John Doe"

&nbsp; }

}

```



\*\*Response – 201 Created\*\*



```json

{

&nbsp; "id": "pay\_demo",

&nbsp; "order\_id": "order\_992ti3z89qb",

&nbsp; "amount": 50000,

&nbsp; "currency": "INR",

&nbsp; "method": "card",

&nbsp; "card\_network": "visa",

&nbsp; "card\_last4": "1111",

&nbsp; "status": "processing",

&nbsp; "created\_at": "2026-01-09T10:25:00.000Z"

}

```



---



\## 6️⃣ Get Payment



\### GET `/api/v1/payments/{payment\_id}`



\*\*Authentication:\*\* ✅ Required



\*\*Response – 200 OK\*\*



```json

{

&nbsp; "id": "pay\_wxscjykuqc",

&nbsp; "order\_id": "order\_992ti3z89qb",

&nbsp; "amount": 50000,

&nbsp; "currency": "INR",

&nbsp; "method": "upi",

&nbsp; "vpa": "user@paytm",

&nbsp; "status": "success",

&nbsp; "created\_at": "2026-01-09T10:23:31.390Z",

&nbsp; "updated\_at": "2026-01-09T10:23:40.812Z"

}

```



---



\## 7️⃣ Error Codes Reference



| Code                 | Meaning                   |

| -------------------- | ------------------------- |

| AUTHENTICATION\_ERROR | Invalid API credentials   |

| BAD\_REQUEST\_ERROR    | Validation failure        |

| NOT\_FOUND\_ERROR      | Resource not found        |

| INVALID\_VPA          | Invalid UPI VPA format    |

| INVALID\_CARD         | Card validation failed    |

| EXPIRED\_CARD         | Card expiry invalid       |

| PAYMENT\_FAILED       | Payment processing failed |



---



\## ✅ Notes 



\* All IDs follow required formats (`order\_`, `pay\_`)

\* Payments skip `created` → start at `processing`

\* Card CVV \& full number are never stored

\* Test merchant is auto-seeded

\* Fully Dockerized





