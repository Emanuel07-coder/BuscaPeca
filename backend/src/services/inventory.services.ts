import { query, queryOne } from '../lib/db';

export interface InventoryItem {
  id: string;
  organization_id: string;
  product_id: string;
  price: string;
  quantity: number;
}

export class InventoryService {
  /**
   * UC-03: Ajuste Rápido de Balcão
   * Decrement (com proteção contra valores negativos)
   */
  static async decrementQuantity(
    inventoryId: string,
    organizationId: string
  ): Promise<boolean> {
    const result = await queryOne<any>(
      `UPDATE inventory SET quantity = quantity - 1
       WHERE id = $1 AND organization_id = $2 AND quantity >= 1
       RETURNING quantity`,
      [inventoryId, organizationId]
    );

    return !!result;
  }

  static async incrementQuantity(
    inventoryId: string,
    organizationId: string
  ): Promise<boolean> {
    const result = await queryOne<any>(
      `UPDATE inventory SET quantity = quantity + 1
       WHERE id = $1 AND organization_id = $2
       RETURNING quantity`,
      [inventoryId, organizationId]
    );

    return !!result;
  }

  static async getInventoryByOrganization(
    organizationId: string
  ): Promise<InventoryItem[]> {
    return query<InventoryItem>(
      `SELECT * FROM inventory
       WHERE organization_id = $1
       ORDER BY updated_at DESC`,
      [organizationId]
    );
  }

  static async getInventoryItem(
    id: string,
    organizationId: string
  ): Promise<InventoryItem | null> {
    return queryOne<InventoryItem>(
      `SELECT * FROM inventory WHERE id = $1 AND organization_id = $2`,
      [id, organizationId]
    );
  }

  /**
   * UC-02: Importação de Estoque
   * CSV Upsert logic
   */
  static async upsertInventoryLine(
    organizationId: string,
    sku: string,
    productName: string,
    price: number,
    quantity: number
  ): Promise<{ id: string; isNew: boolean }> {
    // Sanitize price (remove R$, convert , to .)
    const sanitizedPrice = Math.max(0, price);
    const sanitizedQty = Math.max(0, Math.floor(quantity));

    // 1. Get or create product
    let productId = await queryOne<{ id: string }>(
      `SELECT id FROM products WHERE sku = $1`,
      [sku]
    );

    if (!productId) {
      productId = await queryOne<{ id: string }>(
        `INSERT INTO products (sku, name) VALUES ($1, $2) RETURNING id`,
        [sku, productName]
      );
    }

    if (!productId) throw new Error('Product creation failed');

    // 2. Upsert inventory
    const existing = await queryOne<InventoryItem>(
      `SELECT id FROM inventory WHERE organization_id = $1 AND product_id = $2`,
      [organizationId, productId.id]
    );

    const result = await queryOne<{ id: string }>(
      existing
        ? `UPDATE inventory SET price = $1, quantity = $2, updated_at = now()
           WHERE organization_id = $3 AND product_id = $4
           RETURNING id`
        : `INSERT INTO inventory (organization_id, product_id, price, quantity)
           VALUES ($3, $4, $1, $2)
           RETURNING id`,
      [sanitizedPrice, sanitizedQty, organizationId, productId.id]
    );

    return { id: result?.id || '', isNew: !existing };
  }

  static async importBatch(
    organizationId: string,
    lines: Array<{
      sku: string;
      name: string;
      price: number;
      quantity: number;
    }>
  ): Promise<{ updated: number; created: number; errors: Array<{ line: number; error: string }> }> {
    const stats = {
      updated: 0,
      created: 0,
      errors: [] as Array<{ line: number; error: string }>,
    };

    for (let i = 0; i < lines.length; i++) {
      try {
        const line = lines[i];
        if (!line.sku || !line.name) {
          stats.errors.push({
            line: i + 1,
            error: 'SKU or Name missing',
          });
          continue;
        }

        const result = await this.upsertInventoryLine(
          organizationId,
          line.sku,
          line.name,
          line.price,
          line.quantity
        );

        if (result.isNew) {
          stats.created++;
        } else {
          stats.updated++;
        }
      } catch (err: any) {
        stats.errors.push({
          line: i + 1,
          error: err.message,
        });
      }
    }

    return stats;
  }
}
