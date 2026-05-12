import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { DMConversation, ApiError } from '@/lib/types/messaging'

// ─── GET /api/dms ───────────────────────────────────────────────────────────
// Returns: 200 { id, other_user_id, other_user_name, last_message_at }[]
//          401 not authenticated
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json<ApiError>(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // 1. Fetch all DM conversations where the user is a participant
  const { data: conversations, error: convError } = await supabase
    .from('dm_conversations')
    .select('id, user_id_1, user_id_2')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)

  if (convError) {
    console.error('[GET /api/dms] conversations query error:', convError)
    return NextResponse.json<ApiError>(
      { error: 'Failed to fetch DM conversations' },
      { status: 500 }
    )
  }

  if (!conversations || conversations.length === 0) {
    return NextResponse.json<DMConversation[]>([], { status: 200 })
  }

  // 2. Collect all participant IDs (the "other" users)
  const otherUserIds: string[] = []
  const convMap: Record<string, string> = {} // convId → otherUserId

  for (const conv of conversations) {
    const otherId =
      conv.user_id_1 === user.id ? conv.user_id_2 : conv.user_id_1
    otherUserIds.push(otherId)
    convMap[conv.id] = otherId
  }

  // 3. Fetch profiles for all "other" users (two queries + merge pattern)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', otherUserIds)

  if (profileError) {
    console.error('[GET /api/dms] profiles query error:', profileError)
    return NextResponse.json<ApiError>(
      { error: 'Failed to fetch participant profiles' },
      { status: 500 }
    )
  }

  const profileMap: Record<string, string | null> = {}
  for (const p of profiles ?? []) {
    profileMap[p.id] = p.display_name
  }

  // 4. Fetch the last message timestamp per conversation
  const convIds = conversations.map((c) => c.id)
  const { data: lastMessages, error: msgError } = await supabase
    .from('messages')
    .select('dm_id, created_at')
    .in('dm_id', convIds)
    .order('created_at', { ascending: false })

  if (msgError) {
    console.error('[GET /api/dms] messages query error:', msgError)
    return NextResponse.json<ApiError>(
      { error: 'Failed to fetch last messages' },
      { status: 500 }
    )
  }

  // Build a map of convId → last message timestamp
  const lastMessageMap: Record<string, string> = {}
  for (const msg of lastMessages ?? []) {
    if (msg.dm_id && !lastMessageMap[msg.dm_id]) {
      lastMessageMap[msg.dm_id] = msg.created_at
    }
  }

  // 5. Assemble the response
  const response: DMConversation[] = conversations.map((conv) => {
    const otherUserId = convMap[conv.id]
    return {
      id: conv.id,
      other_user_id: otherUserId,
      other_user_name: profileMap[otherUserId] ?? null,
      last_message_at: lastMessageMap[conv.id] ?? null,
    }
  })

  return NextResponse.json<DMConversation[]>(response, { status: 200 })
}
