export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HermesDashboard } from '@/components/dashboard/hermes-dashboard'
import type { Channel, DMConversation } from '@/lib/types/messaging'

interface InitialData {
  channels: Channel[]
  dms: DMConversation[]
}

async function getInitialData(): Promise<InitialData> {
  const supabase = await createClient()

  // Fetch channels where user is a member
  const { data: channels, error: channelsError } = await supabase
    .from('channels')
    .select('id, name, created_at')
    .order('name', { ascending: true })

  if (channelsError) {
    console.error('[Dashboard] Error fetching channels:', channelsError)
  }

  // Fetch DM conversations for this user
  const { data: dms, error: dmsError } = await supabase
    .from('dm_conversations')
    .select('id, user_id_1, user_id_2, created_at')
    .order('created_at', { ascending: false })

  if (dmsError) {
    console.error('[Dashboard] Error fetching DMs:', dmsError)
  }

  // Build DM list with other user's info
  const { data: { user } } = await supabase.auth.getUser()
  const enrichedDms: DMConversation[] = []

  if (dms && user) {
    for (const dm of dms) {
      const otherUserId = dm.user_id_1 === user.id ? dm.user_id_2 : dm.user_id_1
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', otherUserId)
        .single()

      enrichedDms.push({
        id: dm.id,
        other_user_id: otherUserId,
        other_user_name: profile?.display_name ?? 'Utilisateur',
        last_message_at: dm.created_at,
      })
    }
  }

  return {
    channels: channels ?? [],
    dms: enrichedDms,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { channels, dms } = await getInitialData()

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--color-snow-white)' }}
    >
      <HermesDashboard
        initialChannels={channels}
        initialDms={dms}
        currentUserId={user.id}
      />
    </div>
  )
}
