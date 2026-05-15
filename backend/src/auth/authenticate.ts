import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import jwtPlugin from '@fastify/jwt';
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

type Env = {
  JWT_SECRET: string;
};

const getEnv = (): Env => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error('Missing env JWT_SECRET');
  return { JWT_SECRET };
};

export const authenticatePlugin: FastifyPluginAsync = fp(async (app: import('fastify').FastifyInstance) => {
  const { JWT_SECRET } = getEnv();



  await app.register(jwtPlugin, {
    secret: JWT_SECRET,
    sign: {
      expiresIn: '7d',
    },
  });

  app.addHook('onRequest', async (request, _reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return;

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) return;

    try {
      const payload = (await (request as any).jwtVerify<JWTPayload>()).payload;
      request.authUser = {
        id: payload.sub,
        role: payload.role,
        organization_id: payload.organization_id,
        tokenPayload: payload,
        email: (payload as any).email,
      };
    } catch {
      // Invalid token => keep request unauthenticated.
    }
  });
});

export default authenticatePlugin;


