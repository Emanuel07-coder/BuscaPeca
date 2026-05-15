import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, error } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    type: 'SHOP' as 'SHOP' | 'STORE',
    cnpj: '',
    fantasyName: '',
    whatsapp: '',
    cep: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.type,
          formData.cnpj,
          formData.fantasyName,
          formData.whatsapp,
          formData.cep
        );
      }
      navigate(formData.type === 'SHOP' ? '/busca' : '/inventario');
    } catch (err) {
      // Error displayed via error state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          🔍 BuscaPeça
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'Faça login' : 'Crie sua conta'}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />

          {!isLogin && (
            <>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="SHOP">🚗 Oficina Mecânica</option>
                <option value="STORE">🏪 Auto Peças</option>
              </select>

              <input
                type="text"
                name="cnpj"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="fantasyName"
                placeholder="Nome da Empresa"
                value={formData.fantasyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />

              <input
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp (55XXXXXXXXX)"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="md"
          >
            {isLoading ? '⏳ Aguarde...' : isLogin ? '🔓 Entrar' : '✅ Criar Conta'}
          </Button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-blue-600 hover:text-blue-700 font-semibold"
        >
          {isLogin ? 'Criar nova conta' : 'Já tem conta? Faça login'}
        </button>
      </div>
    </div>
  );
};
