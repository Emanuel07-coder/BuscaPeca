import type { FastifyPluginAsync } from 'fastify';
import decorators from '../auth/decorators';

const rbacPlugin: FastifyPluginAsync = async (app) => {
  await app.register(decorators);
};

export default rbacPlugin;

