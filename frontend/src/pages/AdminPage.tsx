import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/Button';
import type { Organization } from '../types';

export const AdminPage: React.FC = () => {
  const [pending, setPending] = useState<Organization[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'pending') {
        const { data } = await api.get('/admin/organizations/pending');
        setPending(data);
      } else {
        const { data } = await api.get('/admin/organizations');
        setOrganizations(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orgId: string) => {
    try {
      await api.post(`/admin/organizations/${orgId}/approve`);
      setPending((prev) => prev.filter((org) => org.id !== orgId));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao aprovar');
    }
  };

  const handleReject = async (orgId: string) => {
    try {
      await api.post(`/admin/organizations/${orgId}/reject`);
      setPending((prev) => prev.filter((org) => org.id !== orgId));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao rejeitar');
    }
  };

  const data = tab === 'pending' ? pending : organizations;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">⚙️ Painel de Administração</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <Button
            variant={tab === 'pending' ? 'primary' : 'secondary'}
            onClick={() => setTab('pending')}
          >
            ⏳ Pendentes ({pending.length})
          </Button>
          <Button
            variant={tab === 'all' ? 'primary' : 'secondary'}
            onClick={() => setTab('all')}
          >
            📋 Todas ({organizations.length})
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-lg">⏳ Carregando...</p>
        ) : data.length === 0 ? (
          <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center">
            <p className="text-lg">✅ Nenhuma organização {tab === 'pending' ? 'pendente' : 'cadastrada'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((org) => (
              <div
                key={org.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="text-lg font-bold">{org.fantasy_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo</p>
                    <p className="text-lg font-bold">{org.type === 'STORE' ? '🏪 Loja' : '🚗 Oficina'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CNPJ</p>
                    <p className="text-lg font-mono">{org.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <p className="text-lg font-mono">{org.whatsapp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg">
                      {org.is_active ? '✅ Ativo' : '❌ Pendente'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assinatura</p>
                    <p className="text-lg">
                      {org.subscription_status === 'trial'
                        ? '🔄 Trial'
                        : org.subscription_status === 'active'
                        ? '✅ Ativa'
                        : '⏹️ Expirada'}
                    </p>
                  </div>
                </div>

                {tab === 'pending' && !org.is_active && (
                  <div className="flex gap-4 pt-4 border-t">
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(org.id)}
                      className="flex-1"
                    >
                      ✅ Aprovar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(org.id)}
                      className="flex-1"
                    >
                      ❌ Rejeitar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
