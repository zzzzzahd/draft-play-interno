import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MockAuthProvider } from './contexts/MockAuthContext';
import { BabaProvider } from './contexts/BabaContext';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MatchPage from './pages/MatchPage';
import FinancialPage from './pages/FinancialPage';
import RankingsPage from './pages/RankingsPage';
import TeamsPage from './pages/TeamsPage';

function App() {
  return (
    <MockAuthProvider>
      <BabaProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/financial" element={<FinancialPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
          </Routes>
          
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0d0d0d',
                color: '#fff',
                border: '1px solid rgba(0, 242, 255, 0.2)',
                borderRadius: '1rem',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 'bold',
              },
              success: {
                iconTheme: {
                  primary: '#00f2ff',
                  secondary: '#0d0d0d',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff003c',
                  secondary: '#0d0d0d',
                },
              },
            }}
          />
        </BrowserRouter>
      </BabaProvider>
    </MockAuthProvider>
  );
}

export default App;
