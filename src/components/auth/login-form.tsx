'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type LoginStatus = 'idle' | 'loading' | 'error'

/** Traduit les messages d'erreur Supabase en français */
function translateError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Email non confirmé. Vérifiez votre boîte de réception.'
  }
  if (message.includes('Too many requests')) {
    return 'Trop de tentatives. Veuillez patienter quelques minutes.'
  }
  return message
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<LoginStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const supabase = createClient()

    if (!supabase) {
      setStatus('error')
      setErrorMessage('Configuration en cours.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setStatus('error')
      setErrorMessage(translateError(error.message))
    } else {
      router.push('/dashboard')
    }
  }

  const handleChange = () => {
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-cloud-mist)' }}
    >
      <div
        className="w-full max-w-sm px-6"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--color-snow-white)',
            boxShadow: 'var(--shadow-sm-2)',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1
              className="font-bold text-center"
              style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                color: 'var(--color-midnight-indigo)',
                lineHeight: 1.1,
              }}
            >
              Connexion
            </h1>
            <p
              className="text-center mt-3"
              style={{
                fontSize: '15px',
                color: 'var(--color-slate-blue)',
              }}
            >
              Accédez à votre espace Hermès
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                className="block mb-1.5 font-medium"
                style={{ fontSize: '13px', color: 'var(--color-midnight-indigo)' }}
                htmlFor="login-email"
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-slate-blue)' }}
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); handleChange() }}
                  placeholder="vous@entreprise.com"
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-lg text-sm transition-colors duration-150"
                  style={{
                    background: 'var(--color-snow-white)',
                    border: '1.5px solid var(--color-outline-gray)',
                    color: 'var(--color-text-black)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-action-blue)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,107,255,0.12)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-outline-gray)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                className="block mb-1.5 font-medium"
                style={{ fontSize: '13px', color: 'var(--color-midnight-indigo)' }}
                htmlFor="login-password"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-slate-blue)' }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); handleChange() }}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 pl-9 pr-10 rounded-lg text-sm transition-colors duration-150"
                  style={{
                    background: 'var(--color-snow-white)',
                    border: '1.5px solid var(--color-outline-gray)',
                    color: 'var(--color-text-black)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-action-blue)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,107,255,0.12)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-outline-gray)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: 'var(--color-slate-blue)' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-midnight-indigo)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-slate-blue)'
                  }}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {status === 'error' && errorMessage && (
              <div
                className="mb-4 px-4 py-3 rounded-lg text-sm"
                style={{
                  background: 'rgba(255,166,0,0.08)',
                  border: '1px solid rgba(255,166,0,0.25)',
                  color: 'var(--color-sunset-gold)',
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-10 font-semibold transition-all duration-150 rounded-lg"
              style={{
                background: status === 'loading' ? '#0058d6' : 'var(--color-action-blue)',
                color: 'white',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: status === 'loading' ? 'none' : 'var(--shadow-sm-3)',
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading') {
                  ;(e.currentTarget as HTMLButtonElement).style.background = '#0058d6'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (status !== 'loading') {
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-action-blue)'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                }
              }}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={15} className="animate-spin mr-2" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-slate-blue)' }}>
              Pas encore de compte ?{' '}
              <Link
                href="/signup"
                className="font-semibold transition-colors duration-150"
                style={{ color: 'var(--color-action-blue)' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'
                }}
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
