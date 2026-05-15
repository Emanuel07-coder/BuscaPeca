import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controllers';

export default async function authRoutes(app: FastifyInstance) {
  // Rotas Públicas
  app.post('/auth/signup', AuthController.signup);
  app.post('/auth/login', AuthController.login);

  // Rotas Protegidas
  app.get('/auth/me', { preHandler: (request, _reply) => {
    const user = (request as any).authUser;
    if (!user) throw new Error('Unauthorized');
  }}, AuthController.me);
}
