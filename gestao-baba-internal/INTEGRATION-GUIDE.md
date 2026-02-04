# 🔄 Guia de Integração com o Projeto Principal

Este documento explica como integrar o módulo interno com o projeto principal quando estiver pronto.

## 📋 Visão Geral

O módulo interno foi desenvolvido com arquitetura modular para facilitar a integração. A separação clara entre **autenticação** e **lógica de negócio** permite uma transição suave.

## 🎯 Estratégias de Integração

### Opção 1: Integração Completa (Recomendado)

Mesclar tudo em um único projeto.

#### Passo 1: Unificar Contextos

**MockAuthContext → AuthContext**

```jsx
// ANTES (módulo interno)
// src/contexts/MockAuthContext.jsx
export const MockAuthProvider = ({ children }) => {
  const user = { id: 'mock-user-id-001', ... };
  // ...
};

// DEPOIS (projeto unificado)
// src/contexts/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  // ...
};
```

#### Passo 2: Atualizar Importações

Fazer busca e substituição global:

```bash
# Substituir em todos os arquivos
from: import { useAuth } from '../contexts/MockAuthContext'
to:   import { useAuth } from '../contexts/AuthContext'
```

#### Passo 3: Adicionar ProtectedRoute

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;

  return children;
};
```

#### Passo 4: Reorganizar Rotas

```jsx
// src/App.jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  
  {/* Rotas protegidas */}
  <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
  <Route path="/match" element={<ProtectedRoute><MatchPage /></ProtectedRoute>} />
  <Route path="/financial" element={<ProtectedRoute><FinancialPage /></ProtectedRoute>} />
  <Route path="/rankings" element={<ProtectedRoute><RankingsPage /></ProtectedRoute>} />
  <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
</Routes>
```

### Opção 2: Micro-Frontend

Manter projetos separados e comunicar via API.

#### Arquitetura

```
┌─────────────────────────────────────┐
│   Projeto Principal (Landing/Auth)  │
│   - LandingPage                     │
│   - LoginPage                       │
│   - AuthContext real                │
└──────────────┬──────────────────────┘
               │ Após login redireciona
               ↓
┌──────────────────────────────────────┐
│   Módulo Interno (App funcional)     │
│   - HomePage                         │
│   - DashboardPage                    │
│   - Recebe token via URL param       │
└──────────────────────────────────────┘
```

#### Implementação

**Projeto Principal:**
```jsx
// Após login bem-sucedido
const token = session.access_token;
window.location.href = `https://app.seubaba.com?token=${token}`;
```

**Módulo Interno:**
```jsx
// src/contexts/AuthContext.jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Validar token com Supabase
      supabase.auth.setSession({ access_token: token });
      // Carregar dados do usuário
    }
  }, []);
};
```

## 🗄️ Banco de Dados

### Opção A: Unificar Bancos

Se optar por um único banco:

1. **Ajustar tabela `users`**

```sql
-- Remover tabela users independente
DROP TABLE public.users CASCADE;

-- Usar auth.users + perfil estendido
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualizar foreign keys
ALTER TABLE babas 
  RENAME COLUMN president_id TO president_id_temp;
  
ALTER TABLE babas 
  ADD COLUMN president_id UUID REFERENCES auth.users(id);

-- Migrar dados (ajustar conforme necessário)
UPDATE babas SET president_id = president_id_temp::uuid;

ALTER TABLE babas DROP COLUMN president_id_temp;
```

2. **Ativar RLS**

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE babas ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Adicionar políticas (exemplo)
CREATE POLICY "Users can manage own babas"
  ON babas FOR ALL
  USING (president_id = auth.uid());
```

### Opção B: Manter Bancos Separados

Se optar por manter separados, use replicação ou sincronização:

```javascript
// Sincronizar dados entre bancos
const syncData = async (fromDB, toDB) => {
  const { data } = await fromDB.from('babas').select('*');
  await toDB.from('babas').upsert(data);
};
```

## 🔐 Segurança

### Checklist de Segurança Pré-Produção

- [ ] Remover MockAuthContext
- [ ] Implementar AuthContext real com Supabase Auth
- [ ] Ativar RLS em todas as tabelas
- [ ] Configurar políticas de segurança
- [ ] Validar tokens em todas as requisições
- [ ] Implementar rate limiting
- [ ] Adicionar CORS apropriado
- [ ] Sanitizar inputs do usuário
- [ ] Adicionar logs de auditoria
- [ ] Configurar variáveis de ambiente de produção

## 🧪 Testes de Integração

### 1. Testar Autenticação

```javascript
describe('Auth Flow', () => {
  it('should redirect to login if not authenticated', () => {
    // Testar redirecionamento
  });
  
  it('should load user data after login', () => {
    // Testar carregamento de dados
  });
});
```

### 2. Testar Migração de Dados

```sql
-- Verificar integridade dos dados
SELECT COUNT(*) FROM babas;
SELECT COUNT(*) FROM players WHERE user_id IS NULL;
```

### 3. Testar Funcionalidades

- [ ] Criar baba funciona
- [ ] Entrar em baba funciona
- [ ] Sortear times funciona
- [ ] Dashboard carrega corretamente
- [ ] Navegação entre páginas funciona

## 📊 Monitoramento Pós-Integração

### Métricas a Acompanhar

1. **Performance**
   - Tempo de carregamento das páginas
   - Tempo de resposta do Supabase
   - Uso de memória

2. **Erros**
   - Erros de autenticação
   - Erros de banco de dados
   - Erros de JavaScript

3. **Uso**
   - Usuários ativos
   - Babas criados
   - Partidas registradas

## 🚀 Deploy da Versão Integrada

### Vercel

```bash
# 1. Build
npm run build

# 2. Deploy
vercel --prod

# 3. Configurar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Variáveis de Ambiente Necessárias

```env
# Produção
VITE_SUPABASE_URL=https://seu-projeto-prod.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-prod

# Opcional
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=seu-sentry-dsn
```

## 🔄 Rollback Plan

Se algo der errado:

1. **Manter backup do banco anterior**
   ```sql
   pg_dump > backup_pre_integration.sql
   ```

2. **Manter branch separada**
   ```bash
   git checkout -b pre-integration-backup
   git push origin pre-integration-backup
   ```

3. **Poder reverter deploy**
   - Vercel: Rollback para deploy anterior
   - Banco: Restaurar backup

## 📋 Checklist de Integração

### Pré-Integração
- [ ] Fazer backup completo do banco principal
- [ ] Fazer backup do código atual
- [ ] Documentar todas as diferenças entre os projetos
- [ ] Testar módulo interno completamente

### Durante Integração
- [ ] Criar branch de integração
- [ ] Substituir MockAuthContext por AuthContext
- [ ] Atualizar todas as importações
- [ ] Adicionar ProtectedRoute
- [ ] Reorganizar rotas
- [ ] Unificar ou sincronizar bancos
- [ ] Ativar RLS
- [ ] Testar cada funcionalidade

### Pós-Integração
- [ ] Testar fluxo completo (landing → login → dashboard)
- [ ] Verificar todas as páginas
- [ ] Testar em diferentes navegadores
- [ ] Testar em mobile
- [ ] Monitorar logs de erro
- [ ] Verificar performance
- [ ] Coletar feedback de usuários beta

## 🎯 Resultado Final

Após a integração bem-sucedida:

```
Projeto Unificado
├── Landing/Login (público)
└── Sistema Interno (protegido)
    ├── HomePage
    ├── DashboardPage
    ├── ProfilePage
    ├── MatchPage
    ├── FinancialPage
    ├── RankingsPage
    └── TeamsPage
```

**Tudo funcionando em harmonia! 🎉**

---

## 💡 Dicas Finais

1. **Integre gradualmente** - Não tente fazer tudo de uma vez
2. **Teste cada etapa** - Valide antes de prosseguir
3. **Mantenha backups** - Sempre tenha um plano B
4. **Monitore tudo** - Use ferramentas de observabilidade
5. **Documente mudanças** - Facilita manutenção futura

**Boa sorte com a integração! 🚀**
