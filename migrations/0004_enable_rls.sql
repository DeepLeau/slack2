-- ============================================================
-- Migration 0004: Activation RLS sur toutes les tables
-- security_invoker = true (défaut) + ENABLE ROW LEVEL SECURITY
-- ============================================================

-- Activation RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Activation RLS sur channels
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Activation RLS sur channel_members
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;

-- Activation RLS sur dm_conversations
ALTER TABLE public.dm_conversations ENABLE ROW LEVEL SECURITY;

-- Activation RLS sur messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
