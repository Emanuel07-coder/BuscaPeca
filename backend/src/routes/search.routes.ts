import { FastifyInstance } from 'fastify';
import { SearchController } from '../controllers/search.controllers';

export default async function searchRoutes(app: FastifyInstance) {
  app.get('/search', SearchController.search);
  app.post('/search/log', SearchController.logClick);
}
