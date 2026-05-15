import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { JWTPayload } from './types';
import type { UserRole } from '../types/domain';

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: {
      id: string;
      role: UserRole;
      organization_id: string | null;
      email?: string;
      tokenPayload: JWTPayload;
    };
  }
}

export interface AuthorizeOptions {
  roles: UserRole[];
}

export default fp(async (app: FastifyInstance) => {
  app.decorate(
    'authorize',
    async (
      request: import('fastify').FastifyRequest,
      reply: import('fastify').FastifyReply,
      options: AuthorizeOptions
    ) => {
      const user = (request as any).authUser as import('./types').AuthUser | undefined;
      if (!user) {
        reply.code(401).send({ message: 'Unauthorized' });
        return;
      }

      if (!options.roles.includes(user.role)) {
        reply.code(403).send({ message: 'Forbidden' });
        return;
      }
    }
  );
});


