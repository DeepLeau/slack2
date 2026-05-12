-- ============================================================
-- Migration 0001: Création des tables de messagerie Hermès
-- Tables: profiles, channels, channel_members, dm_conversations, messages
-- ============================================================

-- Table profiles: métadonnées utilisateur liées à auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Métadonnées utilisateur (display_name, avatar_url) liées à auth.users';

-- Table channels: espaces de conversation publics/privés
CREATE TABLE IF NOT EXISTS public.channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_private boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT channels_name_length CHECK (length(trim(name)) >= 1 AND length(trim(name)) <= 100)
);

COMMENT ON TABLE public.channels IS 'Espaces de conversation (channels publics ou privés)';

-- Table channel_members: junction table user <-> channels
CREATE TABLE IF NOT EXISTS public.channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (channel_id, user_id)
);

COMMENT ON TABLE public.channel_members IS 'Junction table associant les users aux channels';

-- Table dm_conversations: conversations DM entre exactement 2 users
CREATE TABLE IF NOT EXISTS public.dm_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id_2 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dm_conversations_different_users CHECK (user_id_1 != user_id_2)
);

COMMENT ON TABLE public.dm_conversations IS 'Conversations DM entre exactement 2 utilisateurs';

-- Table messages: messages unitaires (channel OU dm,discriminés par message_type)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE,
  dm_id uuid REFERENCES public.dm_conversations(id) ON DELETE CASCADE,
  message_type text NOT NULL CHECK (message_type IN ('channel', 'dm')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT messages_exclusive_target CHECK (
    (message_type = 'channel' AND channel_id IS NOT NULL AND dm_id IS NULL) OR
    (message_type = 'dm' AND dm_id IS NOT NULL AND channel_id IS NULL)
  )
);

COMMENT ON TABLE public.messages IS 'Messages unitaires avec canal (channel) OU DM comme cible';
