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
