import { FastifyRequest, FastifyReply } from 'fastify';
import { SearchService } from '../services/search.services';

export class SearchController {
  static async search(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { q, cep } = request.query as any;

      if (!q || !cep) {
        return reply.status(400).send({ error: 'Search term (q) and CEP required' });
      }

      const results = await SearchService.search(q, cep.substring(0, 5), 50);

      return reply.send({
        total: results.length,
        results,
      });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }

  static async logClick(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { organization_id, product_id, search_term, sku, price } = request.body as any;
      const user = (request as any).authUser;

      await SearchService.logIntention(
        user?.id || null,
        organization_id,
        product_id,
        search_term,
        sku,
        price
      );

      return reply.send({ ok: true });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }
}
