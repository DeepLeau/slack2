import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SendMessageBody, SendMessageResponse, ApiError } from '@/lib/types/messaging'

// ─── POST /api/messages ───────────────────────────────────────────────────────
// Accepts: { content, channel_id?, dm_id? }
// Returns: 201 { id, sender_id, content, created_at }
//          400 validation error or user not a member
//          401 not authenticated
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // 1. Authenticate — 401 if no valid session
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

  // 2. Parse and validate body
  let body: SendMessageBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { content, channel_id, dm_id } = body

  // content must be a non-empty string
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json<ApiError>(
      { error: 'content is required and must be a non-empty string' },
      { status: 400 }
    )
  }

  // XOR: exactly one of channel_id / dm_id must be provided
  const hasChannel = channel_id !== undefined && channel_id !== null && channel_id !== ''
  const hasDm = dm_id !== undefined && dm_id !== null && dm_id !== ''

  if (hasChannel && hasDm) {
    return NextResponse.json<ApiError>(
      { error: 'cannot specify both channel_id and dm_id' },
      { status: 400 }
    )
  }

  if (!hasChannel && !hasDm) {
    return NextResponse.json<ApiError>(
      { error: 'must specify either channel_id or dm_id' },
      { status: 400 }
    )
  }

  // 3. Validate membership / participation before inserting
  if (hasChannel) {
    const { data: membership, error: membershipError } = await supabase
      .from('channel_members')
      .select('id')
      .eq('channel_id', channel_id)
      .eq('user_id', user.id)
      .limit(1)

    if (membershipError) {
      console.error('[POST /api/messages] channel_members query error:', membershipError)
      return NextResponse.json<ApiError>(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    if (!membership || membership.length === 0) {
      return NextResponse.json<ApiError>(
        { error: 'not a member of this channel' },
        { status: 400 }
      )
    }
  } else {
    // hasDm — user must be a participant of the DM conversation
    const { data: dmConversation, error: dmError } = await supabase
      .from('dm_conversations')
      .select('id')
      .eq('id', dm_id)
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .limit(1)

    if (dmError) {
      console.error('[POST /api/messages] dm_conversations query error:', dmError)
      return NextResponse.json<ApiError>(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    if (!dmConversation || dmConversation.length === 0) {
      return NextResponse.json<ApiError>(
        { error: 'not a participant of this DM conversation' },
        { status: 400 }
      )
    }
  }

  // 4. Insert the message
  const message_type = hasChannel ? 'channel' : 'dm'
  const targetId = hasChannel ? channel_id : dm_id

  const { data: inserted, error: insertError } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      channel_id: hasChannel ? targetId : null,
      dm_id: hasDm ? targetId : null,
      message_type,
      content: content.trim(),
    })
    .select('id, sender_id, content, created_at')
    .limit(1)
    .single()

  if (insertError) {
    console.error('[POST /api/messages] insert error:', insertError)
    return NextResponse.json<ApiError>(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }

  if (!inserted) {
    return NextResponse.json<ApiError>(
      { error: 'Failed to retrieve created message' },
      { status: 500 }
    )
  }

  const response: SendMessageResponse = {
    id: inserted.id,
    sender_id: inserted.sender_id,
    content: inserted.content,
    created_at: inserted.created_at,
  }

  return NextResponse.json<SendMessageResponse>(response, { status: 201 })
}
