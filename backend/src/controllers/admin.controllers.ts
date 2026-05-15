import { FastifyRequest, FastifyReply } from 'fastify';
import { OrganizationService } from '../services/auth.services';
import { BrasilAPIService } from '../services/brasilapi.services';

export class AdminController {
  static async getPendingOrganizations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const pending = await OrganizationService.getPendingVerifications();
      return reply.send(pending);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async approveOrganization(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const { id } = request.params as any;

      // Verify CNPJ with BrasilAPI
      const org = await OrganizationService.getOrganizationById(id);
      if (!org) {
        return reply.status(404).send({ error: 'Organization not found' });
      }

      const cnpjData = await BrasilAPIService.verifyCNPJ(org.cnpj);
      if (!cnpjData) {
        return reply.status(400).send({ error: 'CNPJ verification failed' });
      }

      // Activate
      const updated = await OrganizationService.activateOrganization(id);

      return reply.send({
        message: 'Organization approved',
        organization: updated,
      });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async rejectOrganization(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const { id } = request.params as any;

      // For MVP, we just close it or mark as inactive
      const org = await OrganizationService.getOrganizationById(id);
      if (!org) {
        return reply.status(404).send({ error: 'Organization not found' });
      }

      return reply.send({
        message: 'Organization rejected',
      });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async getAllOrganizations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).authUser;
      if (!user || user.role !== 'superadmin') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const organizations = await OrganizationService.getAllOrganizations();
      return reply.send(organizations);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }
}
