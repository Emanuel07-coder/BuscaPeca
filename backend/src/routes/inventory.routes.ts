import { FastifyInstance } from 'fastify';
import { InventoryController } from '../controllers/inventory.controllers';

export default async function inventoryRoutes(app: FastifyInstance) {
  // Get inventory for authenticated user's organization
  app.get('/inventory', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user) throw new Error('Unauthorized');
    }
  }, InventoryController.getInventory);

  // Decrement quantity (quick adjustment)
  app.post('/inventory/:id/decrement', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user) throw new Error('Unauthorized');
    }
  }, InventoryController.decrementQuantity);

  // Increment quantity (quick adjustment)
  app.post('/inventory/:id/increment', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user) throw new Error('Unauthorized');
    }
  }, InventoryController.incrementQuantity);

  // Import CSV
  app.post('/inventory/import', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user) throw new Error('Unauthorized');
    }
  }, InventoryController.importCSV);
}
