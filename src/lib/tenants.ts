import { query } from './db';

// Define o formato dos dados que esperamos do banco
export type Tenant = {
  id: string;
  name: string;
  slug: string;
  primary_color: string;
  whatsapp: string;
  logo_url?: string;
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  // Busca no banco onde o slug (ex: 'viking') bate com a URL
  const result = await query(
    `SELECT * FROM tenants WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  
  if (result.rows.length === 0) return null;
  return result.rows[0];
}