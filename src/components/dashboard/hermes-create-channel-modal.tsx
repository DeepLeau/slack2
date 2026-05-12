'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Hash, Loader2 } from 'lucide-react'
import type { Channel } from '@/lib/types/messaging'

interface HermesCreateChannelModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (channel: Channel) => void
}

export function HermesCreateChannelModal({
  isOpen,
  onClose,
  onCreated,
}: HermesCreateChannelModalProps) {
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = name.trim()

    if (trimmed.length < 2) {
      setError('Le nom doit contenir au moins 2 caractères')
      return
    }

    if (trimmed.length > 100) {
      setError('Le nom ne peut pas dépasser 100 caractères')
      return
    }

    setIsCreating(true)

    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Impossible de créer le canal')
        setIsCreating(false)
        return
      }

      // Reset state
      setName('')
      setError(null)
      setIsCreating(false)

      // Notify parent with created channel
      onCreated({
        id: data.id,
        name: data.name,
        created_at: new Date().toISOString(),
      })
    } catch {
      setError('Erreur réseau — veuillez réessayer')
      setIsCreating(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-channel-title"
    >
      <div
        className="w-full max-w-sm rounded-xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--color-snow-white)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-outline-gray)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-pale-gray)' }}
            >
              <Hash size={14} strokeWidth={1.5} style={{ color: 'var(--color-action-blue)' }} />
            </div>
            <h2
              id="create-channel-title"
              className="text-sm font-semibold"
              style={{ color: 'var(--color-midnight-indigo)' }}
            >
              Créer un canal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-pale-gray)] transition-colors duration-150"
            style={{ color: 'var(--color-slate-blue)' }}
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="channel-name"
              className="text-xs font-medium"
              style={{ color: 'var(--color-slate-blue)' }}
            >
              Nom du canal
            </label>
            <div className="relative">
              <Hash
                size={14}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--color-steel-gray)' }}
              />
              <input
                ref={inputRef}
                id="channel-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                placeholder="général"
                disabled={isCreating}
                maxLength={100}
                className={[
                  'w-full h-9 pl-8 pr-3 rounded-md text-sm transition-colors duration-150',
                  'focus:outline-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                ].join(' ')}
                style={{
                  background: 'var(--color-cloud-mist)',
                  border: `1px solid ${error ? 'var(--color-sunset-gold)' : 'var(--color-outline-gray)'}`,
                  color: 'var(--color-text-black)',
                }}
              />
            </div>
            {error ? (
              <p className="text-xs" style={{ color: 'var(--color-sunset-gold)' }}>
                {error}
              </p>
            ) : (
              <p className="text-xs" style={{ color: 'var(--color-steel-gray)' }}>
                Les canaux permettent de regrouper les discussions par thème.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="h-8 px-4 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--color-pale-gray)',
                color: 'var(--color-slate-blue)',
                border: '1px solid var(--color-outline-gray)',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCreating || name.trim().length < 2}
              className="h-8 px-4 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--color-action-blue)',
                color: 'white',
              }}
            >
              {isCreating ? (
                <>
                  <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />
                  Création…
                </>
              ) : (
                'Créer le canal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
