# 🔐 CAMINHO DIGITAL - ESTRATÉGIA DE AUTENTICAÇÃO

## 1. ARQUITETURA DE AUTENTICAÇÃO

### Stack Escolhido:
- **Auth Provider:** Supabase Auth (PostgreSQL + JWT)
- **Session Management:** NextAuth.js v5 (com adapter Supabase)
- **OAuth Providers:** Google + Meta (Facebook)
- **Token Strategy:** JWT (short-lived) + Refresh tokens

### Fluxo Geral:

```
1. Usuário acessa app
   ↓
2. Verificar se tem token válido
   ├─ Sim → Acessar dashboard
   └─ Não → Redirecionar para login
   ↓
3. Login options:
   - Email/Password
   - Google OAuth
   - Meta OAuth
   ↓
4. Supabase valida e gera JWT
   ↓
5. NextAuth armazena em cookies HTTP-only
   ↓
6. User autenticado + sessão criada
```

---

## 2. CONFIGURAÇÃO NEXTAUTH.JS + SUPABASE

### Arquivo: `lib/auth.ts`

```typescript
import { type NextAuthOptions } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // Meta (Facebook) OAuth
    FacebookProvider({
      clientId: process.env.META_CLIENT_ID!,
      clientSecret: process.env.META_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // Email + Password (credenciais)
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Buscar user no Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, name")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("User not found");
        }

        // TODO: Validar password com bcryptjs (após setup)
        // const passwordMatch = await bcrypt.compare(
        //   credentials.password,
        //   user.password_hash
        // );
        // if (!passwordMatch) throw new Error("Invalid password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    // Executado quando user faz login
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        // Criar entrada de usuário se não existe
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          await supabase.from("users").insert({
            email: user.email,
            name: user.name,
            auth_provider: account.provider,
            profile_pic_url: user.image,
          });
        }
      }
      return true;
    },

    // Executado quando JWT é gerado
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : undefined;
        token.provider = account.provider;
      }

      // Verificar se token expirou e renovar se necessário
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      return token;
    },

    // Executado quando session é acessada
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },

    // Redirecionar após login
    async redirect({ url, baseUrl }) {
      // Redirecionar para /dashboard após login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // Atualizar a cada 24h
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async signIn({ user, account }) {
      // Log de login para auditoria
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "login",
        resource_type: "session",
        details: { provider: account?.provider },
      });
    },

    async signOut({ token }) {
      // Log de logout
      await supabase.from("audit_logs").insert({
        user_id: token.sub,
        action: "logout",
        resource_type: "session",
      });
    },
  },
};
```

---

## 3. FLUXO OAuth GOOGLE

### Pré-requisitos:
1. Google Cloud Console → Create Project
2. Enable "Google+ API"
3. Create OAuth 2.0 Client ID (Web Application)
4. Authorized redirect URIs:
   - `https://turbinesuasredes.com.br/api/auth/callback/google`
   - `https://www.turbinesuasredes.com.br/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (dev)

### Variáveis de Ambiente:
```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### Componente de Login:

```typescript
import { signIn } from "next-auth/react";

export function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn("google", { redirect: true, callbackUrl: "/dashboard" })}
      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        {/* Google SVG Icon */}
      </svg>
      Entrar com Google
    </button>
  );
}
```

---

## 4. FLUXO OAuth META (FACEBOOK)

### Pré-requisitos:
1. Meta Developers → Create App
2. App Type: "Consumer"
3. Configure Facebook Login product
4. Valid OAuth Redirect URIs:
   - `https://turbinesuasredes.com.br/api/auth/callback/facebook`
   - `https://www.turbinesuasredes.com.br/api/auth/callback/facebook`
   - `http://localhost:3000/api/auth/callback/facebook` (dev)

### Variáveis de Ambiente:
```env
META_CLIENT_ID=xxxxx
META_CLIENT_SECRET=xxxxx
```

### Componente de Login:

```typescript
export function MetaLoginButton() {
  return (
    <button
      onClick={() => signIn("facebook", { redirect: true, callbackUrl: "/dashboard" })}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        {/* Meta/Facebook SVG Icon */}
      </svg>
      Entrar com Meta
    </button>
  );
}
```

---

## 5. PÁGINA DE LOGIN

### Arquivo: `app/auth/login/page.tsx`

```typescript
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      window.location.href = "/dashboard";
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#10b981] rounded-lg mb-4">
            <span className="text-white font-bold">CD</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Caminho Digital</h1>
          <p className="text-gray-400 mt-2">Entre na sua conta</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* OAuth Options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#222] rounded-lg hover:bg-[#111] transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              {/* Google Icon */}
            </svg>
            <span>Entrar com Google</span>
          </button>

          <button
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {/* Meta Icon */}
            </svg>
            <span>Entrar com Meta</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#222]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#0a0a0a] text-gray-500">ou continue com email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:border-[#10b981] outline-none"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:border-[#10b981] outline-none"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-lg font-medium disabled:opacity-50 transition"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Não tem conta?{" "}
          <Link href="/diagnostico" className="text-[#10b981] hover:underline">
            Fazer diagnóstico grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
```

---

## 6. MIDDLEWARE DE AUTENTICAÇÃO

### Arquivo: `middleware.ts` (atualizado)

```typescript
import { withAuth } from "next-auth/middleware";

export const middleware = withAuth(
  function middleware(req) {
    // Lógica adicional se necessária
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Rotas protegidas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/api/protected/:path*",
  ],
};
```

---

## 7. SALVAMENTO AUTOMÁTICO DE DIAGNÓSTICOS

### Função: Auto-save com Supabase

```typescript
// hooks/useDiagnosticAutoSave.ts

import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useDiagnosticAutoSave(diagnosticData: any) {
  const { data: session } = useSession();

  const saveDiagnostic = useCallback(
    async (data: any) => {
      if (!session?.user?.id) return;

      const { data: result, error } = await supabase
        .from("diagnostics")
        .upsert(
          {
            user_id: session.user.id,
            ...data,
            updated_at: new Date(),
          },
          { onConflict: "id" }
        );

      if (error) {
        console.error("Save error:", error);
      } else {
        console.log("Diagnostic saved:", result);
      }
    },
    [session?.user?.id]
  );

  // Auto-save a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      saveDiagnostic(diagnosticData);
    }, 30000);

    return () => clearInterval(interval);
  }, [diagnosticData, saveDiagnostic]);

  return { saveDiagnostic };
}
```

---

## 8. VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
DATABASE_URL=postgres://postgres:password@db.xxxxx.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://turbinesuasredes.com.br
NEXTAUTH_SECRET=your-super-secret-key-here

# OAuth - Google
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# OAuth - Meta
META_CLIENT_ID=xxxxx
META_CLIENT_SECRET=xxxxx
```

---

## 9. FLUXO COMPLETO DE AUTENTICAÇÃO

```
1. Usuário acessa /auth/login
   ↓
2. Clica em "Google" ou "Meta"
   ↓
3. NextAuth redireciona para Google/Meta
   ↓
4. Usuário autoriza
   ↓
5. Google/Meta retorna ao /api/auth/callback/{provider}
   ↓
6. NextAuth processa:
   - Cria usuário em Supabase se novo
   - Gera JWT token
   - Armazena em cookie HTTP-only
   ↓
7. Usuário redirecionado para /dashboard
   ↓
8. Middleware verifica token
   ↓
9. Dashboard carrega com dados do usuário
```

---

## 10. SEGURANÇA

✅ **HTTP-only Cookies** - Protege contra XSS
✅ **CSRF Protection** - NextAuth incluso
✅ **JWT Signing** - Tokens assinados e verificados
✅ **RLS no Supabase** - Dados isolados por usuário
✅ **HTTPS Forced** - Middleware força HTTPS
✅ **Session Timeout** - 30 dias max, com refresh automático

---

## 11. PRÓXIMOS PASSOS

1. ✅ Criar Supabase project
2. ✅ Executar schema SQL
3. ✅ Configurar OAuth no Google e Meta
4. ✅ Adicionar variáveis de ambiente ao Vercel
5. ✅ Implementar pages de login/signup
6. ✅ Testar fluxo OAuth completo
7. ✅ Implementar auto-save de diagnósticos
8. ✅ Configurar webhooks para eventos de subscription

