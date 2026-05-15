import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const signupBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  // For now: only allow minimal payload; actual org validation later.
  organization_type: z.enum(['STORE', 'SHOP']).optional(),
  cnpj: z.string().optional(),
  fantasy_name: z.string().optional(),
});

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/auth/signup', async (request, reply) => {
    const body = signupBodySchema.parse(request.body);


    // MVP placeholder: no DB yet.
    // Next step will be to connect Supabase, create org/user with is_active=false for stores.

    // Return 501 until DB layer is ready.
    return reply.code(501).send({
      message: 'Not implemented yet: signup requires Supabase integration',
      received: body,
    });
  });

  app.post('/auth/login', async (request, reply) => {
    const body = loginBodySchema.parse(request.body);

    return reply.code(501).send({
      message: 'Not implemented yet: login requires Supabase integration',
      received: body,
    });
  });
};

export default authRoutes;

