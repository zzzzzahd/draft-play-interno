-- =============================================
-- SCHEMA SIMPLIFICADO PARA MÓDULO INTERNO
-- SEM RLS - APENAS ESTRUTURA
-- =============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: users (sem dependência de auth.users)
-- =============================================
CREATE TABLE public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: babas
-- =============================================
CREATE TABLE public.babas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  president_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('futsal', 'society')),
  is_private BOOLEAN DEFAULT false,
  game_days INTEGER[] DEFAULT '{}',
  game_time TIME NOT NULL,
  match_duration INTEGER DEFAULT 10,
  pix_key TEXT,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_babas_president ON public.babas(president_id);
CREATE INDEX idx_babas_invite_code ON public.babas(invite_code);

-- =============================================
-- TABELA: players
-- =============================================
CREATE TABLE public.players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  baba_id UUID REFERENCES public.babas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT CHECK (position IN ('goleiro', 'linha')) DEFAULT 'linha',
  is_suspended BOOLEAN DEFAULT false,
  suspension_until DATE,
  total_goals_month INTEGER DEFAULT 0,
  total_assists_month INTEGER DEFAULT 0,
  total_goals_year INTEGER DEFAULT 0,
  total_assists_year INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(baba_id, user_id)
);

-- Índices
CREATE INDEX idx_players_baba ON public.players(baba_id);
CREATE INDEX idx_players_user ON public.players(user_id);

-- =============================================
-- TABELA: matches
-- =============================================
CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  baba_id UUID REFERENCES public.babas(id) ON DELETE CASCADE NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  team_a_name TEXT NOT NULL,
  team_b_name TEXT NOT NULL,
  team_a_score INTEGER DEFAULT 0,
  team_b_score INTEGER DEFAULT 0,
  winner_team TEXT,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'finished')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX idx_matches_baba ON public.matches(baba_id);
CREATE INDEX idx_matches_date ON public.matches(match_date);

-- =============================================
-- TABELA: match_players
-- =============================================
CREATE TABLE public.match_players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
  team TEXT CHECK (team IN ('a', 'b')) NOT NULL,
  position TEXT CHECK (position IN ('goleiro', 'linha')) NOT NULL
);

-- Índices
CREATE INDEX idx_match_players_match ON public.match_players(match_id);
CREATE INDEX idx_match_players_player ON public.match_players(player_id);

-- =============================================
-- TABELA: goals
-- =============================================
CREATE TABLE public.goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
  assisted_by UUID REFERENCES public.players(id) ON DELETE SET NULL,
  team TEXT CHECK (team IN ('a', 'b')) NOT NULL,
  scored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_goals_match ON public.goals(match_id);
CREATE INDEX idx_goals_player ON public.goals(player_id);

-- =============================================
-- TABELA: financials
-- =============================================
CREATE TABLE public.financials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  baba_id UUID REFERENCES public.babas(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_financials_baba ON public.financials(baba_id);

-- =============================================
-- TABELA: payments
-- =============================================
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  financial_id UUID REFERENCES public.financials(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'rejected')) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  UNIQUE(financial_id, player_id)
);

-- Índices
CREATE INDEX idx_payments_financial ON public.payments(financial_id);
CREATE INDEX idx_payments_player ON public.payments(player_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_babas_updated_at BEFORE UPDATE ON public.babas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar código de convite único
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código de convite automaticamente
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_baba_invite_code BEFORE INSERT ON public.babas
  FOR EACH ROW EXECUTE FUNCTION set_invite_code();

-- =============================================
-- INSERIR USUÁRIO MOCK PARA DESENVOLVIMENTO
-- USANDO UUID VÁLIDO
-- =============================================
INSERT INTO public.users (id, name, email) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Zharick Dias', 'zharickdiias@gmail.com')
ON CONFLICT (email) DO NOTHING;
