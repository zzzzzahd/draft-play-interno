import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './MockAuthContext';
import toast from 'react-hot-toast';

const BabaContext = createContext();

export const BabaProvider = ({ children }) => {
  const { user } = useAuth();
  const [myBabas, setMyBabas] = useState([]);
  const [currentBaba, setCurrentBaba] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ NOVOS ESTADOS - Confirmações
  const [gameConfirmations, setGameConfirmations] = useState([]);
  const [myConfirmation, setMyConfirmation] = useState(null);
  const [canConfirm, setCanConfirm] = useState(false);
  const [confirmationDeadline, setConfirmationDeadline] = useState(null);

  // Carregar babas do usuário
  const loadMyBabas = async () => {
    try {
      const { data, error } = await supabase
        .from('babas')
        .select('*')
        .eq('president_id', user.id);

      if (error) throw error;
      setMyBabas(data || []);
      
      // Se houver babas, seleciona a primeira automaticamente
      if (data && data.length > 0 && !currentBaba) {
        setCurrentBaba(data[0]);
      }
    } catch (error) {
      console.error('Error loading babas:', error);
      toast.error('Erro ao carregar babas');
    }
  };

  // Carregar jogadores do baba atual
  const loadPlayers = async (babaId) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('baba_id', babaId)
        .order('name');

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  // ⭐ NOVA: Carregar confirmações de presença do dia
  const loadConfirmations = async (babaId, gameDate) => {
    try {
      const { data, error } = await supabase
        .from('game_confirmations')
        .select(`
          *,
          player:players(id, name, position)
        `)
        .eq('baba_id', babaId)
        .eq('game_date', gameDate)
        .eq('confirmed', true);

      if (error) throw error;
      
      setGameConfirmations(data || []);
      
      // Verificar se usuário já confirmou
      const userPlayer = players.find(p => p.user_id === user.id);
      const userConfirmation = data?.find(c => c.player_id === userPlayer?.id);
      setMyConfirmation(userConfirmation || null);
      
    } catch (error) {
      console.error('Error loading confirmations:', error);
    }
  };

  // ⭐ NOVA: Verificar se deadline passou (30min antes do jogo)
  const checkDeadline = (baba, gameDate) => {
    if (!baba?.game_time) return false;

    try {
      // Construir datetime do jogo
      const gameDateTime = new Date(`${gameDate}T${baba.game_time}`);
      
      // Calcular deadline (30 minutos antes)
      const deadline = new Date(gameDateTime.getTime() - 30 * 60 * 1000);
      
      // Horário atual
      const now = new Date();
      
      // Pode confirmar se ainda não passou o deadline
      const canStillConfirm = now < deadline;
      
      setCanConfirm(canStillConfirm);
      setConfirmationDeadline(deadline);
      
      return canStillConfirm;
    } catch (error) {
      console.error('Error checking deadline:', error);
      return false;
    }
  };

  // ⭐ NOVA: Confirmar presença do usuário
  const confirmPresence = async () => {
    try {
      setLoading(true);

      // Buscar player do usuário atual
      const userPlayer = players.find(p => p.user_id === user.id);
      
      if (!userPlayer) {
        toast.error('Você não está cadastrado neste baba');
        return false;
      }

      // Verificar deadline
      const today = new Date().toISOString().split('T')[0];
      if (!checkDeadline(currentBaba, today)) {
        toast.error('Prazo de confirmação encerrado');
        return false;
      }

      // Inserir confirmação
      const { data, error } = await supabase
        .from('game_confirmations')
        .insert([{
          baba_id: currentBaba.id,
          player_id: userPlayer.id,
          game_date: today,
          confirmed: true
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('Você já confirmou presença');
        } else {
          throw error;
        }
        return false;
      }

      toast.success('Presença confirmada!');
      await loadConfirmations(currentBaba.id, today);
      return true;
      
    } catch (error) {
      console.error('Error confirming presence:', error);
      toast.error('Erro ao confirmar presença');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NOVA: Cancelar confirmação
  const cancelConfirmation = async () => {
    try {
      setLoading(true);

      if (!myConfirmation) {
        toast.error('Você não tem confirmação para cancelar');
        return false;
      }

      // Verificar deadline
      const today = new Date().toISOString().split('T')[0];
      if (!checkDeadline(currentBaba, today)) {
        toast.error('Prazo de confirmação encerrado');
        return false;
      }

      // Deletar confirmação
      const { error } = await supabase
        .from('game_confirmations')
        .delete()
        .eq('id', myConfirmation.id);

      if (error) throw error;

      toast.success('Confirmação cancelada');
      await loadConfirmations(currentBaba.id, today);
      return true;
      
    } catch (error) {
      console.error('Error canceling confirmation:', error);
      toast.error('Erro ao cancelar confirmação');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Criar novo baba
  const createBaba = async (babaData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('babas')
        .insert([{
          ...babaData,
          president_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Baba criado com sucesso!');
      await loadMyBabas();
      setCurrentBaba(data);
      return data;
    } catch (error) {
      console.error('Error creating baba:', error);
      toast.error('Erro ao criar baba');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Entrar em um baba existente por código de convite
  const joinBaba = async (inviteCode) => {
    try {
      setLoading(true);
      
      // Buscar baba pelo código
      const { data: baba, error: babaError } = await supabase
        .from('babas')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (babaError) throw new Error('Código inválido');

      // Adicionar usuário como jogador
      const { error: playerError } = await supabase
        .from('players')
        .insert([{
          baba_id: baba.id,
          user_id: user.id,
          name: user.profile?.name || 'Jogador',
          position: 'linha',
        }]);

      if (playerError) {
        if (playerError.code === '23505') {
          toast.error('Você já está neste baba!');
        } else {
          throw playerError;
        }
      } else {
        toast.success('Entrou no baba com sucesso!');
      }

      await loadMyBabas();
      setCurrentBaba(baba);
      return baba;
    } catch (error) {
      console.error('Error joining baba:', error);
      toast.error(error.message || 'Erro ao entrar no baba');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sortear times
  const drawTeams = (availablePlayers) => {
    const shuffled = [...availablePlayers].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    
    const teamA = shuffled.slice(0, mid);
    const teamB = shuffled.slice(mid);

    return { teamA, teamB };
  };

  // Efeito para carregar dados quando o usuário está disponível
  useEffect(() => {
    if (user) {
      loadMyBabas();
    }
    setLoading(false);
  }, [user]);

  // Efeito para carregar jogadores quando o baba atual muda
  useEffect(() => {
    if (currentBaba) {
      loadPlayers(currentBaba.id);
    }
  }, [currentBaba]);

  // ⭐ NOVO: Efeito para carregar confirmações do dia
  useEffect(() => {
    if (currentBaba && players.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      loadConfirmations(currentBaba.id, today);
      checkDeadline(currentBaba, today);
    }
  }, [currentBaba, players]);

  // ⭐ NOVO: Efeito para verificar deadline periodicamente (a cada 1 minuto)
  useEffect(() => {
    if (!currentBaba) return;

    // Verificar a cada 1 minuto
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      checkDeadline(currentBaba, today);
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, [currentBaba]);

  return (
    <BabaContext.Provider value={{
      myBabas,
      currentBaba,
      setCurrentBaba,
      players,
      matches,
      loading,
      createBaba,
      joinBaba,
      loadMyBabas,
      drawTeams,
      
      // ⭐ NOVOS VALORES - Confirmações
      gameConfirmations,
      myConfirmation,
      canConfirm,
      confirmationDeadline,
      confirmPresence,
      cancelConfirmation,
      loadConfirmations,
    }}>
      {children}
    </BabaContext.Provider>
  );
};

export const useBaba = () => {
  const context = useContext(BabaContext);
  if (!context) {
    throw new Error('useBaba must be used within BabaProvider');
  }
  return context;
};
