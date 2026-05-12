-- ============================================================
-- Migration 0002: Indexes de performance pour la messagerie
-- ============================================================

-- Index sur messages.channel_id pour filtrage par channel
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON public.messages(channel_id);

-- Index sur messages.dm_id pour filtrage par DM
CREATE INDEX IF NOT EXISTS idx_messages_dm_id ON public.messages(dm_id);

-- Index sur messages.sender_id pour jointures avec profiles
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- Index sur messages.created_at pour tri chronologique
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Index sur channel_members.channel_id pour recherche de membres
CREATE INDEX IF NOT EXISTS idx_channel_members_channel_id ON public.channel_members(channel_id);

-- Index sur channel_members.user_id pour recherche des channels d'un user
CREATE INDEX IF NOT EXISTS idx_channel_members_user_id ON public.channel_members(user_id);

-- Index sur dm_conversations.user_id_1 pour DM initiés
CREATE INDEX IF NOT EXISTS idx_dm_conversations_user_id_1 ON public.dm_conversations(user_id_1);

-- Index sur dm_conversations.user_id_2 pour DM reçus
CREATE INDEX IF NOT EXISTS idx_dm_conversations_user_id_2 ON public.dm_conversations(user_id_2);
