import { FastifyRequest, FastifyReply } from 'fastify';
import { InventoryService } from '../services/inventory.services';
import { CSVService } from '../services/csv.services';

export class InventoryController {
  static async decrementQuantity(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const { id } = request.params as any;

      const success = await InventoryService.decrementQuantity(id, user.organization_id);
      if (!success) {
        return reply.status(400).send({ error: 'Cannot decrement (zero quantity or not found)' });
      }

      return reply.send({ ok: true });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async incrementQuantity(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const { id } = request.params as any;

      const success = await InventoryService.incrementQuantity(id, user.organization_id);
      if (!success) {
        return reply.status(400).send({ error: 'Failed to increment' });
      }

      return reply.send({ ok: true });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async getInventory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const inventory = await InventoryService.getInventoryByOrganization(user.organization_id);
      return reply.send(inventory);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async importCSV(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      // Only admins can import
      if (user.role !== 'admin') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: 'No file provided' });
      }

      const buffer = await data.toBuffer();
      const parsed = CSVService.parseCSV(buffer);

      if (parsed.lines.length === 0) {
        return reply.status(400).send({
          error: 'No valid lines in CSV',
          parseErrors: parsed.errors,
        });
      }

      const result = await InventoryService.importBatch(
        user.organization_id,
        parsed.lines
      );

      return reply.send({
        ...result,
        parseErrors: parsed.errors,
      });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }
}
