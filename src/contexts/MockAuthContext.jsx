import React, { createContext, useContext } from 'react';

const MockAuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  // Usuário fixo sempre autenticado com UUID válido
  const user = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'zharickdiias@gmail.com',
  };

  const profile = {
    id: '00000000-0000-0000-0000-000000000001',
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
