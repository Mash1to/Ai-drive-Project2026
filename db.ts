import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URLが設定されていません');
}

// SSLモードをverify-fullに設定
const dbUrl = new URL(process.env.DATABASE_URL);
dbUrl.searchParams.set('sslmode', 'verify-full');

export const pool = new Pool({
  connectionString: dbUrl.toString(),
  max: 2,
});