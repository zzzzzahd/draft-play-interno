import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaba } from '../contexts/BabaContext';
import { useAuth } from '../contexts/MockAuthContext';
import { Trophy, Users, ArrowLeft, RotateCcw, Crown } from 'lucide-react';

const MatchPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    currentBaba, 
    currentMatch, 
    matchPlayers,
    loadTodayMatch,
    manualDraw,
    isDrawing,
    loading 
  } = useBaba();

  // ✅ CORRIGIDO: Remover loadTodayMatch das dependências
  useEffect(() => {
    if (currentBaba) {
      loadTodayMatch(currentBaba.id);
    }
  }, [currentBaba]); // ✅ Só executa quando currentBaba muda

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-electric border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Carregando Times...
        </p>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-6">
        <Trophy className="text-white/20" size={64} />
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black uppercase text-white/60">
            Nenhum Sorteio Hoje
          </h2>
          <p className="text-sm text-white/40 max-w-md">
            O sorteio automático acontece quando o prazo de confirmação termina.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-electric text-black rounded-xl font-black text-sm uppercase"
        >
          <ArrowLeft size={16} />
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const isPresident = currentBaba?.president_id === profile?.id;

  // Organizar jogadores por time
  const teamAPlayers = matchPlayers.filter(mp => mp.team === 'Team A');
  const teamBPlayers = matchPlayers.filter(mp => mp.team === 'Team B');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
            <span className="text-xs font-black uppercase">Voltar</span>
          </button>

          {isPresident && (
            <button
              onClick={manualDraw}
              disabled={isDrawing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-cyan-electric/30 rounded-xl text-cyan-electric text-xs font-black uppercase hover:bg-cyan-electric/10 transition-all disabled:opacity-50"
            >
              <RotateCcw size={16} />
              {isDrawing ? 'Sorteando...' : 'Sortear Novamente'}
            </button>
          )}
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="text-cyan-electric" size={32} />
            <h1 className="text-3xl font-black uppercase italic">Times Sorteados</h1>
          </div>
          <p className="text-sm text-white/60 uppercase tracking-widest">
            {currentBaba?.name}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-white/40">
            <span>{currentMatch.team_a_name} vs {currentMatch.team_b_name}</span>
            <span>•</span>
            <span>{matchPlayers.length} Jogadores</span>
          </div>
        </div>

        {/* Grid de Times */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Time A */}
          <div className="card-glass p-6 rounded-[2rem] border-2 border-cyan-electric/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase italic text-cyan-electric">
                {currentMatch.team_a_name}
              </h2>
              <div className="flex items-center gap-2 bg-cyan-electric/10 px-3 py-1 rounded-xl">
                <Users size={16} className="text-cyan-electric" />
                <span className="text-sm font-black text-cyan-electric">
                  {teamAPlayers.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {teamAPlayers.map((mp, idx) => (
                <div
                  key={mp.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <span className="text-lg font-black text-white/40 w-6">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase">{mp.player?.name}</p>
                    <p className="text-[9px] text-white/40 uppercase">
                      {mp.position}
                    </p>
                  </div>
                  {mp.position === 'goleiro' && (
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time B */}
          <div className="card-glass p-6 rounded-[2rem] border-2 border-yellow-500/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase italic text-yellow-500">
                {currentMatch.team_b_name}
              </h2>
              <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-xl">
                <Users size={16} className="text-yellow-500" />
                <span className="text-sm font-black text-yellow-500">
                  {teamBPlayers.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {teamBPlayers.map((mp, idx) => (
                <div
                  key={mp.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <span className="text-lg font-black text-white/40 w-6">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase">{mp.player?.name}</p>
                    <p className="text-[9px] text-white/40 uppercase">
                      {mp.position}
                    </p>
                  </div>
                  {mp.position === 'goleiro' && (
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="card-glass p-4 rounded-2xl text-center">
          <p className="text-xs text-white/60">
            Horário: <span className="text-white font-black">
              {currentBaba?.game_time || '--:--'}
            </span>
          </p>
          <p className="text-[9px] text-white/40 mt-1">
            Sorteio automático baseado nas confirmações de presença
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
