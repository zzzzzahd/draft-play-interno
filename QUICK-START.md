# ⚡ Setup Rápido - 5 Minutos

## 🎯 Objetivo
Colocar o sistema rodando localmente em 5 minutos.

## 📝 Passo a Passo

### 1️⃣ Instalar Dependências (1 min)
```bash
npm install
```

### 2️⃣ Criar Projeto no Supabase (2 min)

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - Nome: `gestao-baba-internal`
   - Database Password: (escolha uma senha forte)
   - Region: (escolha mais próxima)
4. Aguarde criar (~1-2 minutos)

### 3️⃣ Executar Schema SQL (1 min)

1. No projeto criado, vá em "SQL Editor"
2. Clique em "New query"
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor
5. Clique em "Run" (canto inferior direito)
6. Aguarde confirmar sucesso

### 4️⃣ Pegar Credenciais (30 seg)

1. Vá em "Project Settings" (ícone de engrenagem)
2. Clique em "API"
3. Copie:
   - **URL** (campo "Project URL")
   - **anon/public key** (campo "anon public")

### 5️⃣ Configurar .env (30 seg)

```bash
cp .env.example .env.local
```

Edite `.env.local` e cole as credenciais:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6️⃣ Iniciar Servidor (10 seg)

```bash
npm run dev
```

🎉 **Pronto!** Acesse http://localhost:3000

## ✅ Verificação

Você deve ver:
- Logo "DRAFT TACTICAL COACH"
- Dois botões: "Criar Novo Baba" e "Entrar em um Baba"
- Estilo cyberpunk preto com cyan

## 🧪 Teste Rápido

### Criar Primeiro Baba

1. Clique em "Criar Novo Baba"
2. Preencha:
   - Nome: `Baba Teste`
   - Modalidade: `Futsal`
   - Horário: `20:00`
3. Clique em "Criar Baba"
4. Você será redirecionado para o Dashboard

### Ver Código de Convite

1. No Supabase, vá em "Table Editor"
2. Abra a tabela `babas`
3. Veja o código no campo `invite_code` (ex: `A3X7K9M2`)

### Testar Entrar em Baba

1. Abra uma aba anônima em `http://localhost:3000`
2. Clique em "Entrar em um Baba"
3. Digite o código que você viu
4. Clique em "Entrar"
5. Você verá o mesmo baba!

## ❌ Problemas Comuns

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Supabase credentials not found"
- Verifique se `.env.local` existe
- Verifique se as variáveis estão corretas
- Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: "relation does not exist"
- Verifique se executou o SQL completo
- Verifique se não teve erros no SQL Editor
- Re-execute o schema se necessário

### Página em branco
- Abra o console do navegador (F12)
- Veja se tem erros
- Verifique se o servidor está rodando

## 📞 Precisa de Ajuda?

1. Verifique o `README.md` completo
2. Veja o `INTEGRATION-GUIDE.md` para integração futura
3. Confira se todas as dependências estão instaladas

## 🚀 Próximos Passos

Agora que está rodando:

1. Explore o Dashboard
2. Crie alguns babas de teste
3. Experimente as diferentes páginas
4. Comece a desenvolver funcionalidades!

**Bom desenvolvimento! ⚽🔥**
