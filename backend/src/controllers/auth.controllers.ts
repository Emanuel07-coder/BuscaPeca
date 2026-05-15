import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService, OrganizationService } from '../services/auth.services';
import { BrasilAPIService } from '../services/brasilapi.services';
import type { UserRole, OrganizationType } from '../types/domain';

export class AuthController {
  static async signup(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password, type, cnpj, fantasyName, whatsapp, cep } = request.body as any;

      if (!email || !password || !type) {
        return reply.status(400).send({ error: 'Missing required fields' });
      }

      // Create organization first
      const org = await OrganizationService.createOrganization(
        type as OrganizationType,
        cnpj || '',
        fantasyName || '',
        whatsapp || '',
        cep || ''
      );

      // Create user
      const role: UserRole = type === 'SHOP' ? 'admin' : 'admin';
      const user = await AuthService.signup(email, password, role, org.id);

      // Generate JWT token
      const token = request.server.jwt.sign({
        sub: user.id,
        role: user.role,
        organization_id: user.organization_id,
        email: user.email,
      });

      return reply.status(201).send({
        user,
        organization: org,
        token,
      });
    } catch (error: any) {
      console.error(error);
      return reply.status(400).send({ error: error.message });
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any;

      if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password required' });
      }

      const user = await AuthService.login(email, password);
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = request.server.jwt.sign({
        sub: user.id,
        role: user.role,
        organization_id: user.organization_id,
        email: user.email,
      });

      return reply.send({
        user,
        token,
      });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async me(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).authUser;
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const userData = await AuthService.getUserById(user.id);
    return reply.send(userData);
  }
}
