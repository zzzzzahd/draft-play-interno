import React, { createContext, useContext } from 'react';

const MockAuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  // ✅ ID REAL DO SEU USUÁRIO (existe em auth.users e profiles)
  const user = {
    id: 'e83cdb27-0040-44d1-b998-ac8d879f2b24',
    email: 'zharickdiias@gmail.com',
  };

  // ✅ profile usa os campos REAIS da tabela profiles:
  // id, name, age, position, favorite_team (era heart_team), avatar_url, email
  const profile = {
    id: 'e83cdb27-0040-44d1-b998-ac8d879f2b24',
    name: 'Zharick Dias',
    email: 'zharickdiias@gmail.com',
    avatar_url: null,
    phone: null,
    age: 28,
    position: 'meio-campo',
    favorite_team: 'Flamengo',
  };

  const isAuthenticated = true;

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
