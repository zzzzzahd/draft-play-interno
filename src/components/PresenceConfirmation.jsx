import React, { useState, useEffect } from 'react';
import { useBaba } from '../contexts/BabaContext';
import { Clock, CheckCircle2, XCircle, Users, AlertCircle } from 'lucide-react';

const PresenceConfirmation = () => {
  const { 
    currentBaba, 
    gameConfirmations, 
    myConfirmation, 
    canConfirm, 
    confirmationDeadline,
    confirmPresence,
    cancelConfirmation,
    loading 
  } = useBaba();

  const [timeRemaining, setTimeRemaining] = useState('');

  // Calcular tempo restante até o deadline
  useEffect(() => {
    if (!confirmationDeadline) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const diff = confirmationDeadline - now;

      if (diff <= 0) {
        setTimeRemaining('Encerrado');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}min`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}min ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [confirmationDeadline]);

  // Calcular horário do jogo e deadline
  const getGameTime = () => {
    if (!currentBaba?.game_time) return '--:--';
    return currentBaba.game_time.substring(0, 5);
  };

  const getDeadlineTime = () => {
    if (!confirmationDeadline) return '--:--';
    return confirmationDeadline.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // ESTADO: ANTES DO DEADLINE
  if (canConfirm) {
    return (
      <div className="card-glass p-6 rounded-[2rem] border border-cyan-electric/30 bg-gradient-to-br from-cyan-electric/10 to-transparent">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-electric/20 flex items-center justify-center">
              <Clock className="text-cyan-electric" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Confirmar Presença
              </h3>
              <p className="text-[9px] font-black text-cyan-electric/60 uppercase tracking-widest">
                Dia do Jogo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-cyan-electric/20 px-4 py-2 rounded-xl border border-cyan-electric/30">
            <Users size={16} className="text-cyan-electric" />
            <span className="text-sm font-black text-cyan-electric">
              {gameConfirmations.length}
            </span>
          </div>
        </div>

        {/* Horários em Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/30 p-4 rounded-xl border border-white/10">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">
              Horário do Jogo
            </p>
            <p className="text-2xl font-black font-mono text-white">
              {getGameTime()}
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-xl border border-yellow-500/20">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">
              Prazo até
            </p>
            <p className="text-2xl font-black font-mono text-yellow-500">
              {getDeadlineTime()}
            </p>
          </div>
        </div>

        {/* Contador Destacado */}
        <div className="mb-6 p-6 bg-gradient-to-r from-black/40 to-black/20 rounded-2xl border border-white/10 text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">
            Tempo Restante para Confirmar
          </p>
          <p className={`text-4xl font-black font-mono tracking-tight ${
            timeRemaining.includes('h') || (timeRemaining.includes('min') && parseInt(timeRemaining) > 5)
              ? 'text-green-400' 
              : timeRemaining.includes('min')
              ? 'text-yellow-500'
              : 'text-red-500 animate-pulse'
          }`}>
            {timeRemaining}
          </p>
        </div>

        {/* Botão de Ação */}
        {myConfirmation ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-5 bg-green-500/10 border border-green-500/30 rounded-2xl">
              <CheckCircle2 className="text-green-500" size={24} />
              <span className="text-base font-black text-green-500 uppercase tracking-wide">
                Presença Confirmada ✓
              </span>
            </div>
            <button
              onClick={cancelConfirmation}
              disabled={loading}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white/60 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white hover:border-red-500/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Cancelando...' : 'Cancelar Confirmação'}
            </button>
          </div>
        ) : (
          <button
            onClick={confirmPresence}
            disabled={loading}
            className="w-full py-6 rounded-2xl bg-gradient-to-r from-cyan-electric via-blue-500 to-cyan-electric text-black font-black uppercase italic tracking-tight text-base shadow-[0_10px_40px_rgba(0,255,242,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                Confirmando...
              </span>
            ) : (
              '✓ Confirmar Minha Presença'
            )}
          </button>
        )}

        {/* Lista de Confirmados */}
        {gameConfirmations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Jogadores Confirmados
              </p>
              <span className="text-[10px] font-black text-cyan-electric bg-cyan-electric/10 px-2 py-1 rounded">
                {gameConfirmations.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {gameConfirmations.slice(0, 12).map((conf, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    conf.player?.position === 'goleiro' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-cyan-electric shadow-[0_0_8px_rgba(0,242,255,0.6)]'
                  }`}></div>
                  <span className="text-[10px] font-bold text-white">
                    {conf.player?.name || 'Jogador'}
                  </span>
                </div>
              ))}
              {gameConfirmations.length > 12 && (
                <span className="text-[10px] font-black text-white/40 px-3 py-2">
                  +{gameConfirmations.length - 12} jogadores
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ESTADO: APÓS O DEADLINE (Confirmações encerradas)
  return (
    <div className="card-glass p-6 rounded-[2rem] border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <AlertCircle className="text-yellow-500" size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-yellow-500">
            Confirmações Encerradas
          </h3>
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
            Prazo Expirado
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mb-6 p-5 bg-black/30 rounded-xl border border-white/10 text-center">
        <p className="text-xs text-white/60 mb-4">
          O prazo para confirmação de presença terminou.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Users className="text-cyan-electric" size={20} />
          <span className="text-2xl font-black text-cyan-electric">
            {gameConfirmations.length}
          </span>
          <span className="text-xs font-black text-white/60 uppercase">
            confirmado{gameConfirmations.length !== 1 && 's'}
          </span>
        </div>
      </div>

      {/* Status do usuário */}
      {myConfirmation ? (
        <div className="flex items-center justify-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-6">
          <CheckCircle2 className="text-green-500" size={20} />
          <span className="text-sm font-black text-green-500 uppercase">
            Você Confirmou Presença
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
          <XCircle className="text-red-500" size={20} />
          <span className="text-sm font-black text-red-500 uppercase">
            Você Não Confirmou
          </span>
        </div>
      )}

      {/* Lista de Confirmados */}
      {gameConfirmations.length > 0 && (
        <div className="pt-6 border-t border-white/10">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
            Lista de Confirmados ({gameConfirmations.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {gameConfirmations.map((conf, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10"
              >
                <div className={`w-2 h-2 rounded-full ${
                  conf.player?.position === 'goleiro' ? 'bg-yellow-400' : 'bg-cyan-electric'
                }`}></div>
                <span className="text-[10px] font-bold text-white">
                  {conf.player?.name || 'Jogador'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem de aguardo */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">
          ⏳ Aguardando sorteio automático...
        </p>
      </div>
    </div>
  );
};

export default PresenceConfirmation;
