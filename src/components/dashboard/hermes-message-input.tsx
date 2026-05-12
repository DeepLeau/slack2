'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface HermesMessageInputProps {
  onSend: (content: string) => Promise<void>
  disabled?: boolean
}

export function HermesMessageInput({ onSend, disabled = false }: HermesMessageInputProps) {
  const [value, setValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    if (!value.trim() || isSending || disabled) return

    const content = value.trim()
    setValue('')
    setError(null)
    setIsSending(true)

    try {
      await onSend(content)
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      textareaRef.current?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'envoi')
      setValue(content) // Restore the message on failure
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    setError(null)

    // Auto-grow textarea
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
    }
  }

  const isDisabled = disabled || isSending

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex items-end gap-2 px-3 py-2.5 rounded-lg border transition-colors duration-150"
        style={{
          background: 'var(--color-cloud-mist)',
          borderColor: error
            ? 'var(--color-sunset-gold)'
            : 'var(--color-outline-gray)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message… (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
          disabled={isDisabled}
          rows={1}
          className={[
            'flex-1 min-w-0 resize-none text-sm bg-transparent',
            'placeholder:text-[var(--color-steel-gray)]',
            'focus:outline-none',
            'disabled:cursor-not-allowed',
            'leading-relaxed',
          ].join(' ')}
          style={{ color: 'var(--color-text-black)' }}
        />

        <button
          onClick={handleSend}
          disabled={isDisabled || !value.trim()}
          className={[
            'w-8 h-8 flex items-center justify-center rounded-md shrink-0 transition-all duration-150',
            !isDisabled && value.trim()
              ? 'cursor-pointer'
              : 'cursor-not-allowed',
          ].join(' ')}
          style={{
            background: value.trim() && !isDisabled
              ? 'var(--color-action-blue)'
              : 'var(--color-pale-gray)',
            color: value.trim() && !isDisabled ? 'white' : 'var(--color-steel-gray)',
          }}
          title="Envoyer le message (Entrée)"
        >
          {isSending ? (
            <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <Send size={14} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs px-1" style={{ color: 'var(--color-sunset-gold)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
