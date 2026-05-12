'use client'

import { useEffect, useRef } from 'react'
import type { Message, Profile } from '@/lib/types/messaging'
import { formatRelativeTime, getInitials, getAvatarColor } from '@/lib/utils/hermes'
import { Inbox } from 'lucide-react'

interface HermesMessageThreadProps {
  messages: Message[]
  participantsMap: Record<string, Profile>
  loading: boolean
  currentUserId: string
  lastMessageRef: React.RefObject<HTMLDivElement | null>
}

export function HermesMessageThread({
  messages,
  participantsMap,
  loading,
  currentUserId,
  lastMessageRef,
}: HermesMessageThreadProps) {
  if (loading) {
    return <MessageThreadSkeleton />
  }

  if (messages.length === 0) {
    return <EmptyThreadState />
  }

  return (
    <div className="flex flex-col min-h-full px-6 py-4">
      {messages.map((message, index) => {
        const profile = participantsMap[message.sender_id]
        const isOwn = message.sender_id === currentUserId
        const showAvatar =
          index === 0 ||
          messages[index - 1].sender_id !== message.sender_id

        return (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className="group"
          >
            {showAvatar ? (
              // Full message with avatar
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 mt-0.5 ${getAvatarColor(
                    message.sender_id
                  )} text-white`}
                >
                  {getInitials(profile?.display_name)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span
                      className={`text-sm font-medium ${
                        isOwn
                          ? 'text-[var(--action-blue)]'
                          : 'text-[var(--color-midnight-indigo)]'
                      }`}
                    >
                      {isOwn ? 'Vous' : profile?.display_name ?? 'Utilisateur'}
                    </span>
                    <span className="text-[11px] text-[var(--color-slate-blue)] font-mono">
                      {formatRelativeTime(message.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-black)] whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ) : (
              // Continuation of previous message (compact)
              <div
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className="flex items-start gap-[44px] mb-1 pl-[44px]"
              >
                {/* Timestamp on hover — rendered but subtle */}
                <span className="text-[10px] text-[var(--color-slate-blue)] font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 mt-0.5">
                  {formatRelativeTime(message.created_at)}
                </span>
                <p className="text-sm text-[var(--color-text-black)] whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EmptyThreadState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-pale-gray)' }}
      >
        <Inbox size={22} strokeWidth={1.5} style={{ color: 'var(--color-slate-blue)' }} />
      </div>
      <p className="text-sm font-medium text-[var(--color-slate-blue)] mb-1">
        Aucun message pour l&apos;instant
      </p>
      <p className="text-xs text-[var(--color-steel-gray)]">
        Soyez le premier à envoyer un message.
      </p>
    </div>
  )
}

function MessageThreadSkeleton() {
  return (
    <div className="flex flex-col min-h-full px-6 py-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-[var(--color-pale-gray)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div
              className="h-3 rounded mb-2"
              style={{
                width: `${Math.floor(Math.random() * 40 + 60)}%`,
                background: 'var(--color-pale-gray)',
              }}
            />
            <div
              className="h-3 rounded"
              style={{
                width: `${Math.floor(Math.random() * 60 + 30)}%`,
                background: 'var(--color-pale-gray)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
