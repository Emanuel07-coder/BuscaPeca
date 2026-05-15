import { parse } from 'csv-parse/sync';

export interface ParsedCSVLine {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export class CSVService {
  /**
   * Parse CSV/XLSX buffer and extract inventory lines
   * Expected columns: sku, name, price, quantity
   */
  static parseCSV(fileBuffer: Buffer): {
    lines: ParsedCSVLine[];
    errors: Array<{ lineNum: number; reason: string }>;
  } {
    const lines: ParsedCSVLine[] = [];
    const errors: Array<{ lineNum: number; reason: string }> = [];

    try {
      const records = parse(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
        relaxColumnCount: true,
      }) as Record<string, string>[];

      records.forEach((record, index) => {
        try {
          const sku = (record.sku || record.SKU || '').trim();
          const name = (record.name || record.nome || record.NAME || '').trim();
          let price = parseFloat(
            (record.price || record.preço || record.PRICE || '0')
              .toString()
              .replace('R$', '')
              .replace(',', '.')
              .trim()
          );
          let quantity = parseInt(
            (record.quantity || record.qtd || record.QUANTITY || '0').toString().trim()
          );

          if (isNaN(price)) price = 0;
          if (isNaN(quantity)) quantity = 0;

          if (!sku || !name) {
            errors.push({
              lineNum: index + 2,
              reason: 'Missing SKU or Name',
            });
            return;
          }

          lines.push({
            sku,
            name,
            price: Math.max(0, price),
            quantity: Math.max(0, Math.floor(quantity)),
          });
        } catch (err: any) {
          errors.push({
            lineNum: index + 2,
            reason: err.message,
          });
        }
      });
    } catch (err: any) {
      errors.push({
        lineNum: 0,
        reason: `CSV Parse Error: ${err.message}`,
      });
    }

    return { lines, errors };
  }
}
