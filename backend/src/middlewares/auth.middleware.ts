import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ error: 'Token não fornecido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // Injetamos o usuário no request para as próximas etapas
    request.user = decoded; 
  } catch (err) {
    return reply.status(401).send({ error: 'Token inválido ou expirado' });
  }
}

export async function authorize(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;
    if (!user || !allowedRoles.includes(user.role)) {
      return reply.status(403).send({ error: 'Acesso negado: Permissão insuficiente' });
    }
  };
}
