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
    loadTodayMatch,
    manualDraw,
    isDrawing,
    loading 
  } = useBaba();

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (currentBaba) {
      loadTodayMatch(currentBaba.id);
    }
  }, [currentBaba, loadTodayMatch]);

  // Carregar times do teams_data
  useEffect(() => {
    if (currentMatch?.teams_data) {
      setTeams(currentMatch.teams_data);
    }
  }, [currentMatch]);

  if (loading || !currentMatch) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-electric border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Carregando Times...
        </p>
      </div>
    );
  }

  const isPresident = currentBaba?.president_id === profile?.id;
  const totalPlayers = teams.reduce((sum, t) => sum + t.starters.length + t.reserves.length, 0);

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
            <span>{teams.length} Times</span>
            <span>•</span>
            <span>{totalPlayers} Jogadores</span>
          </div>
        </div>

        {/* Grid de Times */}
        <div className={`grid gap-6 ${
          teams.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
          teams.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {teams.map((team, index) => {
            const colors = [
              { border: 'border-cyan-electric/30', text: 'text-cyan-electric', bg: 'bg-cyan-electric/10' },
              { border: 'border-yellow-500/30', text: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              { border: 'border-green-500/30', text: 'text-green-500', bg: 'bg-green-500/10' },
              { border: 'border-purple-500/30', text: 'text-purple-500', bg: 'bg-purple-500/10' },
            ];
            const color = colors[index % colors.length];

            return (
              <div key={team.id} className={`card-glass p-6 rounded-[2rem] border-2 ${color.border}`}>
                {/* Header do Time */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-black uppercase italic ${color.text}`}>
                    {team.name}
                  </h2>
                  <div className={`flex items-center gap-2 ${color.bg} px-3 py-1 rounded-xl`}>
                    <Users size={16} className={color.text} />
                    <span className={`text-sm font-black ${color.text}`}>
                      {team.starters.length}
                    </span>
                  </div>
                </div>

                {/* Titulares */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={14} className={color.text} />
                    <p className="text-[10px] font-black uppercase tracking-wider text-white/40">
                      Titulares
                    </p>
                  </div>
                  {team.starters.map((player, idx) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                    >
                      <span className="text-lg font-black text-white/40 w-6">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold uppercase">{player.name}</p>
                        <p className="text-[9px] text-white/40 uppercase">
                          {player.position}
                        </p>
                      </div>
                      {player.position === 'goleiro' && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Reservas */}
                {team.reserves.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-white/30 mb-2">
                      Reservas ({team.reserves.length})
                    </p>
                    {team.reserves.map((player, idx) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5"
                      >
                        <span className="text-xs font-black text-white/20 w-4">
                          R{idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-bold opacity-60">{player.name}</p>
                        </div>
                        {player.position === 'goleiro' && (
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-50"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info adicional */}
        <div className="card-glass p-4 rounded-2xl text-center">
          <p className="text-xs text-white/60">
            Horário: <span className="text-white font-black">
              {currentMatch?.match_time || currentBaba?.game_time || '--:--'}
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
