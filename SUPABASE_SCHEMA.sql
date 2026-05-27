-- ============================================
-- CAMINHO DIGITAL - SUPABASE SCHEMA
-- ERP de Presença Digital
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  profile_pic_url TEXT,

  -- Business Info
  business_type TEXT,
  industry TEXT,
  website_url TEXT,

  -- Social Media
  instagram_account TEXT,
  instagram_followers INT DEFAULT 0,
  tiktok_account TEXT,
  tiktok_followers INT DEFAULT 0,
  youtube_channel TEXT,
  youtube_subscribers INT DEFAULT 0,

  -- Subscription
  plan TEXT DEFAULT 'free',
  plan_status TEXT DEFAULT 'inactive',
  subscription_starts_at TIMESTAMP DEFAULT NOW(),
  subscription_ends_at TIMESTAMP,
  stripe_customer_id TEXT,
  ticto_customer_id TEXT,

  -- Auth
  auth_provider TEXT DEFAULT 'email',
  last_login_at TIMESTAMP,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan ON public.users(plan);

-- ============================================
-- 2. TABELA DE DIAGNÓSTICOS
-- ============================================

CREATE TABLE public.diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  title TEXT DEFAULT 'Diagnóstico Digital',
  description TEXT,

  overall_score INT DEFAULT 0,
  status TEXT DEFAULT 'draft',

  -- Scores por canal
  instagram_score INT DEFAULT 0,
  instagram_issues JSONB DEFAULT '[]'::jsonb,
  instagram_recommendations TEXT,

  tiktok_score INT DEFAULT 0,
  tiktok_issues JSONB DEFAULT '[]'::jsonb,
  tiktok_recommendations TEXT,

  youtube_score INT DEFAULT 0,
  youtube_issues JSONB DEFAULT '[]'::jsonb,
  youtube_recommendations TEXT,

  website_score INT DEFAULT 0,
  website_issues JSONB DEFAULT '[]'::jsonb,
  website_recommendations TEXT,

  -- AI Generated
  ai_summary TEXT,
  ai_action_plan TEXT,
  ai_quick_wins JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_diagnostics_user_id ON public.diagnostics(user_id);
CREATE INDEX idx_diagnostics_created_at ON public.diagnostics(created_at DESC);

-- ============================================
-- 3. TABELA DE PLANOS
-- ============================================

CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,

  price_monthly INT DEFAULT 0,
  price_yearly INT DEFAULT 0,
  currency TEXT DEFAULT 'BRL',

  features JSONB DEFAULT '[]'::jsonb,

  max_diagnostics_per_month INT DEFAULT 0,
  max_social_accounts INT DEFAULT 0,
  max_team_members INT DEFAULT 1,
  has_ai_recommendations BOOLEAN DEFAULT FALSE,
  has_priority_support BOOLEAN DEFAULT FALSE,
  has_api_access BOOLEAN DEFAULT FALSE,

  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  stripe_price_id TEXT,
  ticto_plan_id TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO public.plans
  (name, display_name, description, price_monthly, features, has_ai_recommendations, display_order)
VALUES
  ('gratuito', 'Diagnóstico Gratuito', 'Acesso ao diagnóstico básico', 0, '["Diagnóstico completo", "Score 0-100", "1 quick win"]', FALSE, 1),
  ('estrategico', 'Plano Estratégico', 'Com agentes IA', 49700, '["Diagnósticos ilimitados", "Recomendações IA"]', TRUE, 2),
  ('premium', 'Plano Premium', 'IA Master + Automação', 119700, '["Tudo do Estratégico", "IA Master dedicada"]', TRUE, 3);

-- ============================================
-- 4. TABELA DE SESSÕES
-- ============================================

CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,

  user_agent TEXT,
  ip_address INET,
  device_type TEXT,

  oauth_provider TEXT,
  oauth_access_token TEXT,
  oauth_refresh_token TEXT,
  oauth_token_expires_at TIMESTAMP,

  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMP,
  last_activity_at TIMESTAMP DEFAULT NOW(),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_token ON public.sessions(session_token);

-- ============================================
-- 5. TABELA DE CONVERSAS COM IA
-- ============================================

CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE SET NULL,

  title TEXT,
  topic TEXT,
  messages JSONB DEFAULT '[]'::jsonb,

  model_used TEXT DEFAULT 'claude-3-sonnet',
  total_tokens_used INT DEFAULT 0,

  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);

-- ============================================
-- 6. TABELA DE SUBSCRIPTIONS
-- ============================================

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),

  stripe_subscription_id TEXT UNIQUE,
  ticto_subscription_id TEXT UNIQUE,

  billing_period_start TIMESTAMP NOT NULL,
  billing_period_end TIMESTAMP NOT NULL,
  next_billing_date TIMESTAMP,

  status TEXT DEFAULT 'pending',
  payment_method TEXT,

  coupon_code TEXT,
  discount_amount INT DEFAULT 0,

  auto_renew BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users: Own data only
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Diagnostics: Own only
CREATE POLICY "Users can view own diagnostics"
  ON public.diagnostics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create diagnostics"
  ON public.diagnostics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Sessions: Own only
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

-- AI Conversations: Own only
CREATE POLICY "Users can view own conversations"
  ON public.ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Plans: Everyone views active
CREATE POLICY "Everyone can view active plans"
  ON public.plans FOR SELECT
  USING (is_active = TRUE);

-- Subscriptions: Own only
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- HELPER TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_diagnostics_updated_at
  BEFORE UPDATE ON public.diagnostics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
