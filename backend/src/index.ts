import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import multipart from '@fastify/multipart';

import { authenticatePlugin } from './auth/authenticate';
import rbacPlugin from './plugins/rbac';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import inventoryRoutes from './routes/inventory.routes';
import adminRoutes from './routes/admin.routes';
import healthRoutes from './routes/health';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

await app.register(sensible);
await app.register(multipart);

// Auth + RBAC core (JWT + request.user injection + authorize decorator)
await app.register(authenticatePlugin);
await app.register(rbacPlugin);

// Routes
await app.register(authRoutes);
await app.register(searchRoutes);
await app.register(inventoryRoutes);
await app.register(adminRoutes);
await app.register(healthRoutes);

app.get('/', async () => {
  return { message: 'Hello World - BuscaPeça Backend' };
});

const port = Number(process.env.PORT ?? 3001);

try {
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`✅ Backend running on http://localhost:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}


