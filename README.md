# 🚀 Gestão Baba - Módulo Interno

Projeto isolado para desenvolvimento das funcionalidades internas do sistema de gestão de babas, **sem autenticação real**.

## 📋 Sobre o Projeto

Este é um módulo **completamente separado** do projeto principal, criado para:

- ✅ Desenvolver funcionalidades pós-login sem interferência de bugs de autenticação
- ✅ Usar um banco de dados Supabase totalmente novo e isolado
- ✅ Manter identidade visual idêntica ao projeto original
- ✅ Facilitar testes de funcionalidades internas
- ✅ Preparar arquitetura para futura integração

## 🎯 Características

### ✨ O que ESTE projeto TEM:
- ✅ Mock de autenticação (sempre logado como Zharick Dias)
- ✅ HomePage para criar ou entrar em babas
- ✅ DashboardPage funcional
- ✅ Banco de dados Supabase separado
- ✅ Identidade visual idêntica ao original
- ✅ Estrutura modular e limpa
- ✅ Context API para gestão de estado

### ❌ O que ESTE projeto NÃO TEM:
- ❌ LandingPage
- ❌ LoginPage
- ❌ Supabase Auth real
- ❌ ProtectedRoute
- ❌ VisitorMode
- ❌ Fluxo de registro/login

## 🏗️ Estrutura do Projeto

```
gestao-baba-internal/
├── src/
│   ├── contexts/
│   │   ├── MockAuthContext.jsx   # Autenticação simulada
│   │   └── BabaContext.jsx       # Gestão de babas
│   │
│   ├── pages/
│   │   ├── HomePage.jsx          # Criar ou entrar em baba
│   │   ├── DashboardPage.jsx     # Dashboard principal
│   │   ├── ProfilePage.jsx       # Perfil do usuário
│   │   ├── MatchPage.jsx         # Página de partida
│   │   ├── FinancialPage.jsx     # Gestão financeira
│   │   ├── RankingsPage.jsx      # Rankings
│   │   └── TeamsPage.jsx         # Times
│   │
│   ├── components/
│   │   └── Logo.jsx              # Logo do sistema
│   │
│   ├── services/
│   │   └── supabase.js           # Cliente Supabase
│   │
│   ├── styles/
│   │   └── global.css            # Estilos globais
│   │
│   ├── App.jsx                   # Configuração de rotas
│   └── main.jsx                  # Entry point
│
├── public/
├── supabase-schema.sql           # Schema do banco
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Instalação

### 1. Clone o repositório ou use este código

```bash
cd gestao-baba-internal
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um NOVO projeto no Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um projeto novo (não use o mesmo do projeto principal!)

#### 3.2 Execute o schema SQL
- Vá em SQL Editor no Supabase
- Copie todo o conteúdo de `supabase-schema.sql`
- Execute o script

#### 3.3 Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O projeto estará rodando em `http://localhost:3000`

## 👤 Usuário Mock

O sistema sempre inicia com o usuário:
- **Nome:** Zharick Dias
- **Email:** zharickdiias@gmail.com
- **ID:** mock-user-id-001
- **Status:** Sempre autenticado

Este usuário já está inserido no banco pela migration SQL.

## 🎨 Identidade Visual

A identidade visual é **IDÊNTICA** ao projeto original:

### Cores
- `cyber-dark`: #0d0d0d
- `cyan-electric`: #00f2ff
- `green-neon`: #39ff14
- `danger-red`: #ff003c
- `warning-gold`: #ffbd00

### Fontes
- **Rajdhani**: Corpo do texto
- **Orbitron**: Títulos e display

### Componentes
- Cards com efeito glass
- Botões com animações
- Inputs táticos
- Mesmos espaçamentos e bordas arredondadas

## 🗺️ Rotas

| Rota | Descrição |
|------|-----------|
| `/` | HomePage - Criar ou entrar em baba |
| `/dashboard` | Dashboard principal |
| `/profile` | Perfil do usuário |
| `/match` | Página de partida |
| `/financial` | Gestão financeira |
| `/rankings` | Rankings |
| `/teams` | Times |

## 🔄 Fluxo de Uso

1. **Iniciar aplicação** → HomePage
2. **Escolher:**
   - Criar novo baba → Preencher formulário → Dashboard
   - Entrar em baba existente → Digitar código → Dashboard
3. **Dashboard** → Gerenciar baba selecionado
4. **Navegar** entre as páginas internas

## 🗄️ Banco de Dados

### Tabelas Principais
- `users` - Usuários do sistema (sem auth)
- `babas` - Grupos/peladas
- `players` - Jogadores em cada baba
- `matches` - Partidas
- `financials` - Itens financeiros
- `payments` - Pagamentos

**Importante:** Este banco NÃO tem RLS configurado. É apenas para testes estruturais.

## 📦 Deploy

### GitHub + Vercel

1. Crie um repositório no GitHub
2. Faça push do código
3. Conecte na Vercel
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Build

```bash
npm run build
```

Os arquivos de produção estarão em `dist/`

## 🔮 Integração Futura

### Como integrar este módulo com o projeto principal:

1. **Substituir MockAuthContext**
   ```jsx
   // De:
   import { useAuth } from '../contexts/MockAuthContext';
   
   // Para:
   import { useAuth } from '../contexts/AuthContext';
   ```

2. **Unificar bancos de dados**
   - Migrar tabelas se necessário
   - Ajustar relacionamentos com `auth.users`
   - Ativar RLS

3. **Adicionar ProtectedRoute**
   ```jsx
   <Route path="/dashboard" element={
     <ProtectedRoute>
       <DashboardPage />
     </ProtectedRoute>
   } />
   ```

4. **Mesclar rotas**
   - Adicionar LandingPage em `/`
   - Mover HomePage para `/home` ou `/babas`

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **Supabase** - Backend & Database
- **React Router** - Navegação
- **Context API** - Estado global
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

## 📝 Scripts Disponíveis

```bash
npm run dev      # Modo desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview da build
```

## ⚠️ Importante

- Este projeto usa **autenticação simulada**
- Não há segurança real implementada
- Use **apenas para desenvolvimento/testes**
- Não exponha publicamente sem adicionar autenticação real

## 🎯 Próximos Passos

1. Implementar páginas stub:
   - MatchPage completa
   - FinancialPage completa
   - RankingsPage completa
   - TeamsPage completa

2. Adicionar funcionalidades:
   - Sorteio de times
   - Registro de gols
   - Controle financeiro
   - Rankings dinâmicos

3. Preparar para integração:
   - Documentar pontos de integração
   - Criar guia de migração
   - Testar compatibilidade

## 📄 Licença

Este é um projeto de estudo/desenvolvimento interno.

---

**Desenvolvido com 🔥 para focar nas funcionalidades sem interferência de bugs de autenticação!**
