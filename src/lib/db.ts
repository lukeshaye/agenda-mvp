import { Pool } from 'pg';

// Se estiver rodando localmente, use localhost. Se for no Docker, usa as env vars.
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'sua_senha_do_banco',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  database: process.env.DB_NAME || 'n8n', // Ou o nome do banco que você criou
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}