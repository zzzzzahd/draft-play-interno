import React, { createContext, useContext } from 'react';

const MockAuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  // ⚠️ IMPORTANTE: User ID real do banco (do Supabase Authentication)
  // Este ID deve corresponder ao president_id do baba no banco
  const user = {
    id: 'e83cdb27-0040-44d1-b998-ac8d879f2b24', // ⭐ USER_ID REAL DO BANCO
    email: 'zharickdiias@gmail.com',
  };

  const profile = {
    id: 'e83cdb27-0040-44d1-b998-ac8d879f2b24', // ⭐ MESMO USER_ID
    name: 'Zharick Dias',
    email: 'zharickdiias@gmail.com',
    avatar_url: null,
    phone: null,
    age: 28,
    position: 'meio-campo',
    favorite_team: 'Flamengo',
  };

  // Sempre autenticado
  const isAuthenticated = true;

  // Função de logout simulada (não faz nada real)
  const signOut = () => {
    console.log('Mock SignOut - não implementado');
  };

  return (
    <MockAuthContext.Provider value={{ 
      user, 
      profile, 
      isAuthenticated,
      signOut
    }}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within MockAuthProvider');
  }
  return context;
};
