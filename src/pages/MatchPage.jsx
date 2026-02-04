import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';

const MatchPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/60 hover:text-cyan-electric mb-8 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-black uppercase">Voltar</span>
        </button>

        <div className="card-glass p-12 rounded-[2rem] text-center">
          <Trophy className="text-cyan-electric mx-auto mb-6" size={64} />
          <h1 className="text-3xl font-black italic uppercase mb-4">Partida</h1>
          <p className="text-white/60">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
