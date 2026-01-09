import { pool } from "./db.js";

export async function seed() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS merchants (
      id UUID PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      api_key VARCHAR(64),
      api_secret VARCHAR(64),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      merchant_id UUID,
      amount INTEGER,
      currency CHAR(3),
      receipt VARCHAR(255),
      notes JSONB,
      status VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64),
      merchant_id UUID,
      amount INTEGER,
      currency CHAR(3),
      method VARCHAR(20),
      status VARCHAR(20),
      vpa VARCHAR(255),
      card_network VARCHAR(20),
      card_last4 CHAR(4),
      error_code VARCHAR(50),
      error_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    INSERT INTO merchants (id,name,email,api_key,api_secret)
    VALUES (
      '550e8400-e29b-41d4-a716-446655440000',
      'Test Merchant',
      'test@example.com',
      'key_test_abc123',
      'secret_test_xyz789'
    )
    ON CONFLICT (email) DO NOTHING
  `);
}
