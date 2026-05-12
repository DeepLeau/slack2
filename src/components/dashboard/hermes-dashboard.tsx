'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HermesSidebar } from '@/components/dashboard/hermes-sidebar'
import { HermesMessageThread } from '@/components/dashboard/hermes-message-thread'
import { HermesMessageInput } from '@/components/dashboard/hermes-message-input'
import { HermesCreateChannelModal } from '@/components/dashboard/hermes-create-channel-modal'
import { MessageSquare } from 'lucide-react'
import type { Channel, DMConversation, Message, Profile } from '@/lib/types/messaging'

interface HermesDashboardProps {
  initialChannels: Channel[]
  initialDms: DMConversation[]
  currentUserId: string
}

type ActiveConversation =
  | { type: 'channel'; data: Channel }
  | { type: 'dm'; data: DMConversation }
  | null

export function HermesDashboard({
  initialChannels,
  initialDms,
  currentUserId,
}: HermesDashboardProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [dms, setDms] = useState<DMConversation[]>(initialDms)
  const [activeConversation, setActiveConversation] = useState<ActiveConversation>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [participantsMap, setParticipantsMap] = useState<Record<string, Profile>>({})
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  // Fetch messages when active conversation changes
  const fetchMessages = useCallback(
    async (conversation: NonNullable<ActiveConversation>) => {
      const supabase = createClient()
      if (!supabase) return

      setMessagesLoading(true)
      setMessages([])
      setParticipantsMap({})

      try {
        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })

        if (conversation.type === 'channel') {
          query = query.eq('message_type', 'channel').eq('channel_id', conversation.data.id)
        } else {
          query = query.eq('message_type', 'dm').eq('dm_id', conversation.data.id)
        }

        const { data: msgs, error } = await query

        if (error) {
          console.error('[HermesDashboard] Error fetching messages:', error)
          setMessagesLoading(false)
          return
        }

        // Collect unique sender IDs
        const senderIds = [...new Set((msgs ?? []).map((m) => m.sender_id))]

        // Fetch participant profiles in bulk
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', senderIds)

        const map: Record<string, Profile> = {}
        for (const p of profiles ?? []) {
          map[p.id] = p
        }

        setMessages(msgs ?? [])
        setParticipantsMap(map)
      } catch (err) {
        console.error('[HermesDashboard] Unexpected error:', err)
      } finally {
        setMessagesLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation)
    }
  }, [activeConversation, fetchMessages])

  // Scroll to last message when messages update
  useEffect(() => {
    if (messages.length > 0 && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages.length])

  const handleSelectChannel = useCallback((channel: Channel) => {
    setActiveConversation({ type: 'channel', data: channel })
  }, [])

  const handleSelectDM = useCallback((dm: DMConversation) => {
    setActiveConversation({ type: 'dm', data: dm })
  }, [])

  const handleNewChannel = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleChannelCreated = useCallback((newChannel: Channel) => {
    setChannels((prev) => [...prev, newChannel].sort((a, b) => a.name.localeCompare(b.name)))
    setActiveConversation({ type: 'channel', data: newChannel })
    setIsCreateModalOpen(false)
  }, [])

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeConversation || !content.trim()) return

      const supabase = createClient()
      if (!supabase) throw new Error('Client Supabase non disponible')

      const payload: Record<string, unknown> = {
        sender_id: currentUserId,
        content: content.trim(),
        message_type: activeConversation.type,
      }

      if (activeConversation.type === 'channel') {
        payload.channel_id = activeConversation.data.id
      } else {
        payload.dm_id = activeConversation.data.id
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(payload)
        .select()
        .single()

      if (error) {
        console.error('[HermesDashboard] Error sending message:', error)
        throw new Error('Impossible d\'envoyer le message')
      }

      // Optimistic update: add message to list
      setMessages((prev) => [...prev, data])

      // Update participants map if sender not already present
      if (!participantsMap[currentUserId]) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .eq('id', currentUserId)
          .single()

        if (profile) {
          setParticipantsMap((prev) => ({ ...prev, [profile.id]: profile }))
        }
      }
    },
    [activeConversation, currentUserId, participantsMap]
  )

  const conversationTitle = activeConversation
    ? activeConversation.type === 'channel'
      ? `#${activeConversation.data.name}`
      : activeConversation.data.other_user_name
    : null

  return (
    <>
      <HermesSidebar
        channels={channels}
        dms={dms}
        selectedId={activeConversation?.data.id ?? null}
        onSelectChannel={handleSelectChannel}
        onSelectDM={handleSelectDM}
        onNewChannel={handleNewChannel}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Conversation header */}
        <header className="shrink-0 flex items-center h-12 px-5 border-b border-[rgba(0,0,0,0.07)] bg-[var(--color-snow-white)]">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[var(--color-midnight-indigo)] truncate">
              {conversationTitle ?? 'Hermès'}
            </h2>
            {activeConversation?.type === 'dm' && (
              <p className="text-xs text-[var(--color-slate-blue)] truncate">
                Message direct
              </p>
            )}
          </div>
        </header>

        {/* Message thread or empty state */}
        <div className="flex-1 overflow-y-auto bg-white">
          {activeConversation ? (
            <HermesMessageThread
              messages={messages}
              participantsMap={participantsMap}
              loading={messagesLoading}
              currentUserId={currentUserId}
              lastMessageRef={lastMessageRef}
            />
          ) : (
            <EmptyConversationState />
          )}
        </div>

        {/* Message input */}
        {activeConversation && (
          <div className="shrink-0 px-4 py-3 border-t border-[rgba(0,0,0,0.07)] bg-white">
            <HermesMessageInput
              onSend={handleSendMessage}
              disabled={messagesLoading}
            />
          </div>
        )}
      </div>

      <HermesCreateChannelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleChannelCreated}
      />
    </>
  )
}

function EmptyConversationState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-pale-gray)' }}
      >
        <MessageSquare
          size={22}
          strokeWidth={1.5}
          style={{ color: 'var(--color-action-blue)' }}
        />
      </div>
      <h3
        className="font-semibold mb-2"
        style={{ fontSize: '18px', color: 'var(--color-midnight-indigo)' }}
      >
        Bienvenue sur Hermès
      </h3>
      <p
        className="text-sm leading-relaxed max-w-xs"
        style={{ color: 'var(--color-slate-blue)' }}
      >
        Sélectionnez un canal ou une conversation pour commencer à échanger avec votre équipe.
      </p>
    </div>
  )
}
