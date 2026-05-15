import React, { useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/Button';
import type { SearchResult } from '../types';

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cep, setCep] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get('/search', {
        params: { q: searchTerm, cep },
      });
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao buscar');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (result: SearchResult) => {
    const message = `Olá ${result.fantasy_name}, sou da oficina e vi no BuscaPeça que vocês têm a peça ${result.name} (Código: ${result.sku}) por R$ ${result.price}. Pode separar para mim?`;
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${result.whatsapp}?text=${encodedMessage}`;
    
    // Log intention
    api.post('/search/log', {
      organization_id: result.organization_id,
      product_id: result.product_id,
      search_term: searchTerm,
      sku: result.sku,
      price: result.price,
    }).catch(console.error);

    window.open(waLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          🔍 BuscaPeça
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Digite o nome ou código da peça"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            />
            <input
              type="text"
              placeholder="CEP (ex: 12345-678)"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? '⏳ Buscando...' : '🔎 Buscar'}
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {results.length === 0 && !loading && searchTerm && (
          <div className="text-center text-gray-500 py-8">
            Nenhuma peça encontrada
          </div>
        )}

        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{result.name}</h3>
                  <p className="text-sm text-gray-600">Código: {result.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    R$ {parseFloat(result.price).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {result.quantity > 0 ? `✅ ${result.quantity} em estoque` : '❌ Sem estoque'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3 mb-3">
                <p className="font-semibold text-gray-800">{result.fantasy_name}</p>
                <p className="text-sm text-gray-600">CEP: {result.cep}</p>
              </div>

              <Button
                onClick={() => handleWhatsApp(result)}
                className="w-full bg-green-500 hover:bg-green-600"
                size="md"
              >
                💬 Chamar no WhatsApp
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
