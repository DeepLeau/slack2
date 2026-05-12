'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SignupStatus = 'idle' | 'loading' | 'error' | 'success'

/** Valide le format email */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Traduit les messages d'erreur Supabase en français */
function translateError(message: string): string {
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.'
  }
  if (message.includes('password') && message.includes('length')) {
    return 'Le mot de passe doit contenir au moins 8 caractères.'
  }
  if (message.includes('Invalid email')) {
    return 'Adresse email invalide.'
  }
  if (message.includes('Too many requests')) {
    return 'Trop de tentatives. Veuillez patienter quelques minutes.'
  }
  return message
}

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState<SignupStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    // Validation côté client
    if (!isValidEmail(email)) {
      setStatus('error')
      setErrorMessage('Adresse email invalide.')
      return
    }
    if (password.length < 8) {
      setStatus('error')
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setStatus('error')
      setErrorMessage('Les deux mots de passe ne correspondent pas.')
      return
    }

    const supabase = createClient()

    if (!supabase) {
      setStatus('error')
      setErrorMessage('Configuration en cours.')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setStatus('error')
      setErrorMessage(translateError(error.message))
    } else {
      setStatus('success')
    }
  }

  const handleChange = () => {
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-cloud-mist)' }}
      >
        <div className="w-full max-w-sm px-6">
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'var(--color-snow-white)',
              boxShadow: 'var(--shadow-sm-2)',
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{
                  background: 'rgba(0,107,255,0.08)',
                  border: '1px solid rgba(0,107,255,0.15)',
                }}
              >
                <CheckCircle
                  size={26}
                  style={{ color: 'var(--color-action-blue)' }}
                  strokeWidth={1.5}
                />
              </div>
              <h2
                className="font-bold mb-2"
                style={{
                  fontSize: '22px',
                  color: 'var(--color-midnight-indigo)',
                  lineHeight: 1.2,
                }}
              >
                Compte créé
              </h2>
              <p
                className="mb-6"
                style={{
                  fontSize: '15px',
                  color: 'var(--color-slate-blue)',
                  lineHeight: 1.6,
                }}
              >
                Vérifiez votre boîte de réception pour confirmer votre inscription.
              </p>
              <Link
                href="/login"
                className="w-full h-10 font-semibold transition-all duration-150 rounded-lg"
                style={{
                  background: 'var(--color-action-blue)',
                  color: 'white',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = '#0058d6'
                  ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-action-blue)'
                  ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
                }}
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-cloud-mist)' }}
    >
      <div className="w-full max-w-sm px-6">
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
              Créer un compte
            </h1>
            <p
              className="text-center mt-3"
              style={{
                fontSize: '15px',
                color: 'var(--color-slate-blue)',
              }}
            >
              Rejoignez Hermès en quelques secondes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                className="block mb-1.5 font-medium"
                style={{ fontSize: '13px', color: 'var(--color-midnight-indigo)' }}
                htmlFor="signup-email"
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
                  id="signup-email"
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
            <div className="mb-4">
              <label
                className="block mb-1.5 font-medium"
                style={{ fontSize: '13px', color: 'var(--color-midnight-indigo)' }}
                htmlFor="signup-password"
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
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); handleChange() }}
                  placeholder="8 caractères minimum"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                className="block mb-1.5 font-medium"
                style={{ fontSize: '13px', color: 'var(--color-midnight-indigo)' }}
                htmlFor="signup-confirm-password"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-slate-blue)' }}
                />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); handleChange() }}
                  placeholder="Confirmez votre mot de passe"
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: 'var(--color-slate-blue)' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-midnight-indigo)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-slate-blue)'
                  }}
                  aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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
                  Création en cours...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-slate-blue)' }}>
              Déjà un compte ?{' '}
              <Link
                href="/login"
                className="font-semibold transition-colors duration-150"
                style={{ color: 'var(--color-action-blue)' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'
                }}
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
