import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import type { InventoryItem } from '../types';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data } = await api.get('/inventory');
      setInventory(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (inventoryId: string, change: -1 | 1) => {
    try {
      const endpoint = change === -1 ? 'decrement' : 'increment';
      await api.post(`/inventory/${inventoryId}/${endpoint}`);
      
      // Atualizar localmente
      setInventory((prev) =>
        prev.map((item) =>
          item.id === inventoryId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar quantidade');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">⏳ Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📦 Inventário</h1>
          <Button variant="primary">
            📥 Importar
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {inventory.length === 0 ? (
          <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg text-center">
            <p className="text-lg">Nenhuma peça em estoque. Importe um arquivo CSV.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Preço</th>
                  <th className="px-4 py-3 text-center">Quantidade</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{item.product_id.substring(0, 8)}</td>
                    <td className="px-4 py-3">{item.product_id}</td>
                    <td className="px-4 py-3">R$ {parseFloat(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-lg font-bold ${item.quantity === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity === 0}
                      >
                        −
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
