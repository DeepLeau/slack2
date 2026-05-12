// ============================================================
// Shared TypeScript types for the Hermès messaging system
// Imported by both backend routes and frontend components
// ============================================================

/**
 * User profile — metadata linked to auth.users
 * Source: public.profiles
 */
export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
}

/**
 * A chat channel (public or private group conversation)
 * Source: public.channels
 */
export interface Channel {
  id: string
  name: string
  created_at: string
}

/**
 * A DM conversation between exactly two users.
 * other_user_id and other_user_name identify the participant
 * who is NOT the current user.
 * last_message_at is null when no messages exist yet.
 * Source: public.dm_conversations joined with public.profiles
 */
export interface DMConversation {
  id: string
  other_user_id: string
  other_user_name: string | null
  last_message_at: string | null
}

/**
 * A single message targeting either a channel or a DM conversation.
 * Exactly one of channel_id / dm_id is set (XOR invariant enforced
 * by the CHECK constraint on the messages table).
 * Source: public.messages
 */
export interface Message {
  id: string
  sender_id: string
  channel_id: string | null
  dm_id: string | null
  content: string
  created_at: string
}

/**
 * Discriminates the target type of a message.
 * Used to branch rendering logic in frontend components.
 */
export type ConversationType = 'channel' | 'dm'

/**
 * Payload accepted by POST /api/messages.
 * Exactly one of channel_id or dm_id must be provided.
 */
export interface SendMessageBody {
  content: string
  channel_id?: string
  dm_id?: string
}

/**
 * Response returned after a successful message insertion.
 * Shape matches the contract API 201 response.
 */
export interface SendMessageResponse {
  id: string
  sender_id: string
  content: string
  created_at: string
}

/**
 * Response returned after a successful channel creation.
 * Shape matches the contract API 201 response.
 */
export interface CreateChannelResponse {
  id: string
  name: string
}

/**
 * Standard API error shape used across all routes.
 */
export interface ApiError {
  error: string
}
