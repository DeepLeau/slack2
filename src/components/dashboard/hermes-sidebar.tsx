'use client'

import { useState } from 'react'
import { Hash, Plus, MessageCircle, ChevronDown, ChevronRight } from 'lucide-react'
import type { Channel, DMConversation } from '@/lib/types/messaging'

interface HermesSidebarProps {
  channels: Channel[]
  dms: DMConversation[]
  selectedId: string | null
  onSelectChannel: (channel: Channel) => void
  onSelectDM: (dm: DMConversation) => void
  onNewChannel: () => void
}

export function HermesSidebar({
  channels,
  dms,
  selectedId,
  onSelectChannel,
  onSelectDM,
  onNewChannel,
}: HermesSidebarProps) {
  const [channelsOpen, setChannelsOpen] = useState(true)
  const [dmsOpen, setDmsOpen] = useState(true)

  return (
    <aside
      className="w-[260px] shrink-0 h-screen flex flex-col overflow-hidden"
      style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Workspace header */}
      <div className="shrink-0 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
            style={{ background: 'var(--color-action-blue)', color: 'white' }}
          >
            H
          </div>
          <span className="text-sm font-semibold text-[var(--text-1)] tracking-tight truncate">
            Hermès
          </span>
        </div>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {/* Channels section */}
        <div className="mb-4">
          <button
            onClick={() => setChannelsOpen((o) => !o)}
            className="w-full flex items-center gap-1.5 px-2 py-1 mb-1 rounded hover:bg-white/[0.04] transition-colors duration-150 group"
          >
            {channelsOpen ? (
              <ChevronDown size={12} strokeWidth={1.5} className="text-[var(--text-3)] shrink-0" />
            ) : (
              <ChevronRight size={12} strokeWidth={1.5} className="text-[var(--text-3)] shrink-0" />
            )}
            <span className="text-[11px] font-medium text-[var(--text-3)] uppercase tracking-wider group-hover:text-[var(--text-2)] transition-colors">
              Canaux
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNewChannel()
              }}
              className="ml-auto w-5 h-5 flex items-center justify-center rounded hover:bg-white/[0.08] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-150"
              title="Créer un canal"
            >
              <Plus size={13} strokeWidth={1.5} />
            </button>
          </button>

          {channelsOpen && (
            <div className="flex flex-col gap-0.5">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={[
                    'w-full flex items-center gap-2 px-2 h-8 rounded-md text-sm transition-all duration-150',
                    selectedId === channel.id
                      ? 'bg-[var(--action-blue)]/[0.15] text-[var(--action-blue)] font-medium border-l-2 border-[var(--action-blue)] pl-[6px]'
                      : 'text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-white/[0.03] border-l-2 border-transparent pl-[6px]',
                  ].join(' ')}
                >
                  <Hash size={14} strokeWidth={1.5} className="shrink-0 opacity-60" />
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}

              {channels.length === 0 && (
                <p className="px-2 py-2 text-xs text-[var(--text-3)]">
                  Aucun canal — créez-en un
                </p>
              )}
            </div>
          )}
        </div>

        {/* DMs section */}
        <div>
          <button
            onClick={() => setDmsOpen((o) => !o)}
            className="w-full flex items-center gap-1.5 px-2 py-1 mb-1 rounded hover:bg-white/[0.04] transition-colors duration-150 group"
          >
            {dmsOpen ? (
              <ChevronDown size={12} strokeWidth={1.5} className="text-[var(--text-3)] shrink-0" />
            ) : (
              <ChevronRight size={12} strokeWidth={1.5} className="text-[var(--text-3)] shrink-0" />
            )}
            <span className="text-[11px] font-medium text-[var(--text-3)] uppercase tracking-wider group-hover:text-[var(--text-2)] transition-colors">
              Messages directs
            </span>
          </button>

          {dmsOpen && (
            <div className="flex flex-col gap-0.5">
              {dms.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => onSelectDM(dm)}
                  className={[
                    'w-full flex items-center gap-2 px-2 h-8 rounded-md text-sm transition-all duration-150',
                    selectedId === dm.id
                      ? 'bg-[var(--action-blue)]/[0.15] text-[var(--action-blue)] font-medium border-l-2 border-[var(--action-blue)] pl-[6px]'
                      : 'text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-white/[0.03] border-l-2 border-transparent pl-[6px]',
                  ].join(' ')}
                >
                  <MessageCircle size={14} strokeWidth={1.5} className="shrink-0 opacity-60" />
                  <span className="truncate">{dm.other_user_name}</span>
                </button>
              ))}

              {dms.length === 0 && (
                <p className="px-2 py-2 text-xs text-[var(--text-3)]">
                  Aucun message direct
                </p>
              )}
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
