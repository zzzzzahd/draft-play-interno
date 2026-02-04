import React, { createContext, useContext } from 'react';

const MockAuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  // Usuário fixo sempre autenticado
  const user = {
    id: 'mock-user-id-001',
    email: 'zharickdiias@gmail.com',
  };

  const profile = {
    id: 'mock-user-id-001',
    name: 'Zharick Dias',
    email: 'zharickdiias@gmail.com',
    avatar_url: null,
    phone: null,
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
