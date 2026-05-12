import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  Channel,
  CreateChannelResponse,
  ApiError,
} from '@/lib/types/messaging'

// ─── GET /api/channels ────────────────────────────────────────────────────────
// Returns: 200 { id, name, created_at }[] (channels the user is a member of)
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

  // Return channels where the user is a member, via channel_members join
  const { data: channels, error } = await supabase
    .from('channels')
    .select('id, name, created_at')
    .in(
      'id',
      (
        await supabase
          .from('channel_members')
          .select('channel_id')
          .eq('user_id', user.id)
      ).data?.map((row: { channel_id: string }) => row.channel_id) ?? []
    )
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[GET /api/channels] query error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    )
  }

  const response: Channel[] = (channels ?? []).map((ch) => ({
    id: ch.id,
    name: ch.name,
    created_at: ch.created_at,
  }))

  return NextResponse.json<Channel[]>(response, { status: 200 })
}

// ─── POST /api/channels ──────────────────────────────────────────────────────
// Accepts: { name } (string, required, min 2 chars)
// Returns: 201 { id, name }
//          400 validation error
//          401 not authenticated
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
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

  let body: { name?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { name } = body

  if (
    !name ||
    typeof name !== 'string' ||
    name.trim().length < 2
  ) {
    return NextResponse.json<ApiError>(
      { error: 'name is required and must be at least 2 characters' },
      { status: 400 }
    )
  }

  const trimmedName = name.trim()

  // 1. Insert the channel with the creator recorded
  const { data: createdChannel, error: insertError } = await supabase
    .from('channels')
    .insert({
      name: trimmedName,
      created_by: user.id,
    })
    .select('id, name')
    .limit(1)
    .single()

  if (insertError) {
    console.error('[POST /api/channels] insert error:', insertError)
    return NextResponse.json<ApiError>(
      { error: 'Failed to create channel' },
      { status: 500 }
    )
  }

  if (!createdChannel) {
    return NextResponse.json<ApiError>(
      { error: 'Failed to retrieve created channel' },
      { status: 500 }
    )
  }

  // 2. Automatically add the creator to channel_members with 'owner' role
  const { error: memberError } = await supabase
    .from('channel_members')
    .insert({
      channel_id: createdChannel.id,
      user_id: user.id,
      role: 'owner',
    })

  if (memberError) {
    // Rollback: delete the channel we just created
    await supabase.from('channels').delete().eq('id', createdChannel.id)
    console.error('[POST /api/channels] channel_members insert error:', memberError)
    return NextResponse.json<ApiError>(
      { error: 'Failed to add creator as channel member' },
      { status: 500 }
    )
  }

  const response: CreateChannelResponse = {
    id: createdChannel.id,
    name: createdChannel.name,
  }

  return NextResponse.json<CreateChannelResponse>(response, { status: 201 })
}
