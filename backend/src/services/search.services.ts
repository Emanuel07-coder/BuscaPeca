import { query, queryOne } from '../lib/db';

export interface SearchResult {
  id: string;
  organization_id: string;
  product_id: string;
  sku: string;
  name: string;
  price: string;
  quantity: number;
  fantasy_name: string;
  whatsapp: string;
  cep: string;
  updated_at: string;
}

export class SearchService {
  /**
   * UC-01: Busca de Peça pelo Mecânico
   * Fuzzy search + filter by subscription + proximity
   */
  static async search(
    searchTerm: string,
    cepPrefix: string, // 5 dígitos do CEP do mecânico
    limit: number = 50
  ): Promise<SearchResult[]> {
    const sanitizedTerm = searchTerm.trim().toLowerCase();

    const results = await query<SearchResult>(
      `
      SELECT
        inv.id,
        inv.organization_id,
        inv.product_id,
        p.sku,
        p.name,
        inv.price::text,
        inv.quantity,
        o.fantasy_name,
        o.whatsapp,
        o.cep,
        inv.updated_at
      FROM inventory inv
      JOIN products p ON inv.product_id = p.id
      JOIN organizations o ON inv.organization_id = o.id
      WHERE
        -- Multi-tenancy + Active filters
        o.is_active = true
        AND o.subscription_status = 'active'
        AND inv.quantity > 0
        
        -- Fuzzy search via similarity or ILIKE
        AND (
          p.name % $1
          OR p.sku ILIKE $2
          OR p.name ILIKE $2
        )
      ORDER BY
        -- Proximity (CEP prefix match first)
        CASE 
          WHEN substring(o.cep, 1, 5) = $3 THEN 0
          ELSE 1
        END,
        -- Then by price
        inv.price ASC,
        -- Then by name relevance
        CASE 
          WHEN p.name % $1 THEN similarity(p.name, $1)
          ELSE 0
        END DESC
      LIMIT $4
      `,
      [sanitizedTerm, `%${sanitizedTerm}%`, cepPrefix.substring(0, 5), limit]
    );

    return results;
  }

  static async logIntention(
    userId: string | null,
    organizationId: string,
    productId: string | null,
    searchTerm: string,
    sku: string,
    price: string
  ): Promise<void> {
    await query(
      `INSERT INTO intention_logs (user_id, organization_id, product_id, search_term, sku, price)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, organizationId, productId, searchTerm, sku, parseFloat(price)]
    );
  }

  static async getSearchStats(
    organizationId: string,
    daysBack: number = 30
  ): Promise<any> {
    const stats = await queryOne(
      `SELECT
        COUNT(*) as total_intentions,
        COUNT(DISTINCT user_id) as unique_mechs,
        COUNT(DISTINCT product_id) as unique_products
      FROM intention_logs
      WHERE organization_id = $1
        AND created_at >= now() - interval '$2 days'`,
      [organizationId, daysBack]
    );

    return stats;
  }
}
