import { FastifyInstance } from 'fastify';
import { AdminController } from '../controllers/admin.controllers';

export default async function adminRoutes(app: FastifyInstance) {
  app.get('/admin/organizations/pending', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') throw new Error('Forbidden');
    }
  }, AdminController.getPendingOrganizations);

  app.get('/admin/organizations', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') throw new Error('Forbidden');
    }
  }, AdminController.getAllOrganizations);

  app.post('/admin/organizations/:id/approve', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') throw new Error('Forbidden');
    }
  }, AdminController.approveOrganization);

  app.post('/admin/organizations/:id/reject', {
    preHandler: (request, _reply) => {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') throw new Error('Forbidden');
    }
  }, AdminController.rejectOrganization);
}
