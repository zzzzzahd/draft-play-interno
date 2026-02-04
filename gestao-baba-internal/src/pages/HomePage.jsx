import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaba } from '../contexts/BabaContext';
import { PlusCircle, LogIn, Trophy, Users } from 'lucide-react';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const { createBaba, joinBaba, loading } = useBaba();
  
  const [mode, setMode] = useState(null); // 'create' ou 'join'
  const [formData, setFormData] = useState({
    name: '',
    modality: 'futsal',
    game_time: '20:00',
    game_days: [],
    match_duration: 10,
    invite_code: '',
  });

  const handleCreateBaba = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Digite o nome do baba');
      return;
    }

    const result = await createBaba({
      name: formData.name,
      modality: formData.modality,
      game_time: formData.game_time,
      match_duration: formData.match_duration,
      game_days: formData.game_days,
    });

    if (result) {
      navigate('/dashboard');
    }
  };

  const handleJoinBaba = async (e) => {
    e.preventDefault();
    
    if (!formData.invite_code.trim()) {
      toast.error('Digite o código do baba');
      return;
    }

    const result = await joinBaba(formData.invite_code);

    if (result) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-electric border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Carregando Sistema...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <Logo size="large" />

        {mode === null && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-center text-white/60 text-sm font-tactical">
              Escolha uma opção para começar
            </p>

            <button
              onClick={() => setMode('create')}
              className="w-full p-6 rounded-[2rem] bg-gradient-to-r from-cyan-electric to-blue-600 text-black font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(0,255,242,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <PlusCircle size={24} />
              Criar Novo Baba
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full p-6 rounded-[2rem] bg-white/5 border border-green-neon text-green-neon font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 hover:bg-green-neon/10 transition-all"
            >
              <LogIn size={24} />
              Entrar em um Baba
            </button>
          </div>
        )}

        {/* Formulário de Criar Baba */}
        {mode === 'create' && (
          <form onSubmit={handleCreateBaba} className="space-y-6 animate-fade-in">
            <div className="card-glass p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-cyan-electric" size={24} />
                <h2 className="text-2xl font-black italic uppercase">Criar Baba</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Nome do Baba
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Baba da Galera"
                    className="input-tactical"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Modalidade
                  </label>
                  <select
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                    className="input-tactical"
                  >
                    <option value="futsal">Futsal</option>
                    <option value="society">Society</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Horário do Jogo
                  </label>
                  <input
                    type="time"
                    value={formData.game_time}
                    onChange={(e) => setFormData({ ...formData, game_time: e.target.value })}
                    className="input-tactical"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="flex-1 py-5 rounded-2xl bg-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 rounded-2xl bg-cyan-electric text-black font-black uppercase text-[10px] tracking-widest shadow-neon-cyan hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Baba'}
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Entrar em Baba */}
        {mode === 'join' && (
          <form onSubmit={handleJoinBaba} className="space-y-6 animate-fade-in">
            <div className="card-glass p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-green-neon" size={24} />
                <h2 className="text-2xl font-black italic uppercase">Entrar no Baba</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Código do Convite
                  </label>
                  <input
                    type="text"
                    value={formData.invite_code}
                    onChange={(e) => setFormData({ ...formData, invite_code: e.target.value.toUpperCase() })}
                    placeholder="Ex: ABC12345"
                    className="input-tactical text-center text-2xl font-black tracking-widest"
                    maxLength={8}
                    required
                  />
                  <p className="text-[9px] text-white/30 mt-2 text-center">
                    Digite o código de 8 caracteres fornecido pelo presidente
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="flex-1 py-5 rounded-2xl bg-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 rounded-2xl bg-green-neon text-black font-black uppercase text-[10px] tracking-widest shadow-neon-green hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePage;
