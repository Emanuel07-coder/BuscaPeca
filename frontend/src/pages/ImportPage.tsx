import React, { useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/Button';

export const ImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Selecione um arquivo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post('/inventory/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(data);
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao importar');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'sku,name,price,quantity\nEX001,Filtro de Óleo,45.50,10\nEX002,Vela de Ignição,32.00,25';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-buscapeca.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">📥 Importar Estoque</h1>

          <div className="mb-6">
            <Button
              type="button"
              onClick={downloadTemplate}
              variant="secondary"
              className="w-full"
            >
              📋 Baixar Modelo de Planilha
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <p className="text-2xl mb-2">📁</p>
                <p className="font-semibold text-gray-700">
                  {file ? file.name : 'Clique ou arraste um arquivo'}
                </p>
                <p className="text-sm text-gray-500">CSV, XLSX ou XLS</p>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !file}
              className="w-full"
              size="lg"
            >
              {loading ? '⏳ Importando...' : '✅ Importar'}
            </Button>
          </form>

          {error && (
            <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
              <p className="font-semibold">❌ Erro</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 bg-green-100 text-green-700 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">✅ Importação Concluída!</h2>
              <div className="space-y-2 text-lg">
                <p>🔄 Atualizados: <strong>{result.updated}</strong></p>
                <p>✨ Novos: <strong>{result.created}</strong></p>
                {result.errors?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2">⚠️ Erros ({result.errors.length}):</p>
                    <div className="bg-white text-gray-800 p-3 rounded text-sm max-h-40 overflow-y-auto">
                      {result.errors.map((err: any, i: number) => (
                        <p key={i}>Linha {err.line}: {err.reason}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
