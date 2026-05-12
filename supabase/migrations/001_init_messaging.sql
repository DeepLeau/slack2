-- ============================================================
-- Migration 001: Création complète du système de messagerie Hermès
-- Tables: profiles, channels, channel_members, dm_conversations, messages
-- Includes: indexes, trigger handle_new_user, RLS, policies
-- ============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Table profiles : métadonnées utilisateur liées à auth.users
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Métadonnées utilisateur (display_name, avatar_url) liées à auth.users';

-- ─────────────────────────────────────────────────────────────────────────────
-- Table channels : espaces de conversation publics/privés
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_private boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT channels_name_length CHECK (
    length(trim(name)) >= 1 AND length(trim(name)) <= 100
  )
);

COMMENT ON TABLE public.channels IS 'Espaces de conversation (channels publics ou privés)';

-- ─────────────────────────────────────────────────────────────────────────────
-- Table channel_members : junction table user <-> channels
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (channel_id, user_id)
);

COMMENT ON TABLE public.channel_members IS 'Junction table associant les users aux channels';

-- ─────────────────────────────────────────────────────────────────────────────
-- Table dm_conversations : conversations DM entre exactement 2 users
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.dm_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id_2 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dm_conversations_different_users CHECK (user_id_1 != user_id_2)
);

COMMENT ON TABLE public.dm_conversations IS 'Conversations DM entre exactement 2 utilisateurs';

-- ─────────────────────────────────────────────────────────────────────────────
-- Table messages : messages unitaires (channel OU dm, discriminés par message_type)
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes de performance
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON public.messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_dm_id ON public.messages(dm_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channel_members_channel_id ON public.channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_user_id ON public.channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_conversations_user_id_1 ON public.dm_conversations(user_id_1);
CREATE INDEX IF NOT EXISTS idx_dm_conversations_user_id_2 ON public.dm_conversations(user_id_2);

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger handle_new_user : provisioning auto des profiles à la création de user
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'display_name'
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Crée automatiquement une row profiles lors de auth.signUp()';

-- ─────────────────────────────────────────────────────────────────────────────
-- Activation RLS sur toutes les tables
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- Policies RLS — profiles
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User voit les profils des autres membres de ses channels
CREATE POLICY "profiles_select_members"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.channel_members cm
      WHERE cm.user_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM public.channel_members cm2
          WHERE cm2.channel_id = cm.channel_id
            AND cm2.user_id = profiles.id
        )
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Policies RLS — channels
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "channels_select"
  ON public.channels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.channel_members
      WHERE channel_id = channels.id
        AND user_id = auth.uid()
    )
    OR created_by = auth.uid()
  );

CREATE POLICY "channels_insert"
  ON public.channels FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "channels_update"
  ON public.channels FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.channel_members cm
      WHERE cm.channel_id = channels.id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.channel_members cm
      WHERE cm.channel_id = channels.id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "channels_delete"
  ON public.channels FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- Policies RLS — channel_members
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "channel_members_select"
  ON public.channel_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.channel_members my_cm
      WHERE my_cm.user_id = auth.uid()
        AND my_cm.channel_id = channel_members.channel_id
    )
  );

CREATE POLICY "channel_members_insert"
  ON public.channel_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "channel_members_update"
  ON public.channel_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.channel_members caller_cm
      WHERE caller_cm.channel_id = channel_members.channel_id
        AND caller_cm.user_id = auth.uid()
        AND caller_cm.role = 'owner'
        AND channel_members.role != 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.channel_members caller_cm
      WHERE caller_cm.channel_id = channel_members.channel_id
        AND caller_cm.user_id = auth.uid()
        AND caller_cm.role = 'owner'
        AND channel_members.role != 'owner'
    )
  );

CREATE POLICY "channel_members_delete"
  ON public.channel_members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- Policies RLS — dm_conversations
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "dm_conversations_select"
  ON public.dm_conversations FOR SELECT
  TO authenticated
  USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

-- Création de DM côté client désactivée — passe par RPC avec consentement
DROP POLICY IF EXISTS "dm_conversations_insert" ON public.dm_conversations;

CREATE POLICY "dm_conversations_update"
  ON public.dm_conversations FOR UPDATE
  TO authenticated
  USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
  WITH CHECK (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- Policies RLS — messages
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "messages_select"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    -- Messages de channel : user est membre du channel
    (
      message_type = 'channel'
      AND EXISTS (
        SELECT 1 FROM public.channel_members cm
        WHERE cm.channel_id = messages.channel_id
          AND cm.user_id = auth.uid()
      )
    )
    OR
    -- Messages de DM : user est participant de la conversation
    (
      message_type = 'dm'
      AND EXISTS (
        SELECT 1 FROM public.dm_conversations dm
        WHERE dm.id = messages.dm_id
          AND (dm.user_id_1 = auth.uid() OR dm.user_id_2 = auth.uid())
      )
    )
  );

CREATE POLICY "messages_insert"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      (message_type = 'channel' AND EXISTS (
        SELECT 1 FROM public.channel_members
        WHERE channel_id = messages.channel_id AND user_id = auth.uid()
      ))
      OR
      (message_type = 'dm' AND EXISTS (
        SELECT 1 FROM public.dm_conversations
        WHERE id = messages.dm_id
          AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
      ))
    )
  );

CREATE POLICY "messages_update"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "messages_delete"
  ON public.messages FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid());

COMMIT;
