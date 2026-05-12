-- ============================================================
-- Migration 0005: Policies RLS pour la messagerie Hermès
-- ============================================================

-- ============================================================
-- Table profiles
-- ============================================================

-- Policy UPDATE: user peut modifier son propre profil (display_name, avatar_url)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy SELECT: user voit son propre profil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy SELECT: user voit les profils des autres membres de ses channels
-- (utilise EXISTS pour éviter les problèmes de RLS récursive)
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

-- ============================================================
-- Table channels
-- ============================================================

-- Policy SELECT: user voit les channels dont il est membre OU qu'il a créés
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

-- Policy INSERT: seul un admin/owner peut créer un channel (service_role recommandé)
CREATE POLICY "channels_insert"
  ON public.channels FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Policy UPDATE: owner ou admin du channel peut renommer/éditer la description
-- USING filtre les lignes accessibles ; WITH CHECK autorise la modification
-- sans réimposer created_by = auth.uid() pour les admins/non-créateurs
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

-- Policy DELETE: seul le créateur du channel peut le supprimer
CREATE POLICY "channels_delete"
  ON public.channels FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- ============================================================
-- Table channel_members
-- ============================================================

-- [BLOCKER FIX 1] Policy SELECT: user voit les membres de ses channels
-- ET ses propres memberships. Correction : ajout de my_cm.channel_id = channel_members.channel_id
-- pour éviter qu'Alice puisse lister TOUS les channels de Bob (fuites de membership).
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

-- [BLOCKER FIX 1] Policy INSERT: un user ne peut s'ajouter qu'à lui-même (auto-join).
-- L'invitation par owner/admin doit passer par une RPC SECURITY DEFINER avec
-- consentement explicite de la cible — interdit côté client.
CREATE POLICY "channel_members_insert"
  ON public.channel_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- [BLOCKER FIX BONUS] Policy UPDATE: owner du channel peut modifier les rôles.
-- Correction syntaxe SQL : ajout de AND manquant entre la condition owner
-- et la condition role != 'owner'.
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

-- Policy DELETE: un user peut quitter un channel (supprimer sa propre membership)
CREATE POLICY "channel_members_delete"
  ON public.channel_members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- Table dm_conversations
-- ============================================================

-- Policy SELECT: user voit les DM dont il est participant (user_id_1 OU user_id_2)
CREATE POLICY "dm_conversations_select"
  ON public.dm_conversations FOR SELECT
  TO authenticated
  USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

-- [BLOCKER FIX 3] Policy INSERT supprimée : la création de DM côté client est interdite.
-- Un attaquant pourrait énumérer les channels d'une cible (via channel_members_select)
-- et initier un DM sans consentement de la cible. La création de DM doit passer par
-- une RPC SECURITY DEFINER avec logique de consentement explicite (demande/acceptée),
-- ou être initiée par un owner/admin de channel shared.
DROP POLICY IF EXISTS "dm_conversations_insert" ON public.dm_conversations;

-- Policy UPDATE: participant peut modifier la conversation DM (future feature renaming/archiving)
CREATE POLICY "dm_conversations_update"
  ON public.dm_conversations FOR UPDATE
  TO authenticated
  USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
  WITH CHECK (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

-- ============================================================
-- Table messages
-- ============================================================

-- Policy SELECT: user voit les messages de ses channels OU de ses DM
CREATE POLICY "messages_select"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    -- Messages de channel: user est membre du channel
    (
      message_type = 'channel'
      AND EXISTS (
        SELECT 1 FROM public.channel_members cm
        WHERE cm.channel_id = messages.channel_id
          AND cm.user_id = auth.uid()
      )
    )
    OR
    -- Messages de DM: user est participant de la conversation
    (
      message_type = 'dm'
      AND EXISTS (
        SELECT 1 FROM public.dm_conversations dm
        WHERE dm.id = messages.dm_id
          AND (dm.user_id_1 = auth.uid() OR dm.user_id_2 = auth.uid())
      )
    )
  );

-- Policy INSERT: seul le sender_id peut envoyer un message ET il doit être membre du channel
-- ou participant de la DM — sinon élévation de privilège (envoi vers n'importe quelle conv).
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
        WHERE id = messages.dm_id AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
      ))
    )
  );

-- Policy UPDATE: seul l'auteur peut éditer son propre message
CREATE POLICY "messages_update"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Policy DELETE: seul l'auteur peut supprimer son propre message
CREATE POLICY "messages_delete"
  ON public.messages FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid());
