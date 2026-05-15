import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { SearchPage } from './pages/SearchPage';
import { ImportPage } from './pages/ImportPage';
import { InventoryPage } from './pages/InventoryPage';
import { AdminPage } from './pages/AdminPage';
import { supabase } from './utils/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isSuperAdmin) {
    return <Navigate to="/busca" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select();

      if (error) {
        console.error('Supabase todos error:', error);
        return;
      }

      if (data) {
        setTodos(data);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      <section className="p-4 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-semibold">Supabase Todos Demo</h2>
        <p className="text-sm text-slate-600">Carregando dados da tabela <code>todos</code>.</p>
        <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
          {todos.map((todo) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      </section>

      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/busca" 
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventario" 
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/importar" 
            element={
              <ProtectedRoute>
                <ImportPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

