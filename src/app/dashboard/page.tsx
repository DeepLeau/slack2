export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Double protection : le middleware a déjà redirigé, mais on vérifie ici aussi
  if (!user) {
    redirect('/login')
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-snow-white)' }}
    >
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{ background: 'var(--color-action-blue)' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1
          className="font-bold"
          style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            color: 'var(--color-midnight-indigo)',
            lineHeight: 1.1,
          }}
        >
          Tableau de bord
        </h1>
        <p
          className="mt-4"
          style={{
            fontSize: '16px',
            color: 'var(--color-slate-blue)',
            maxWidth: '400px',
          }}
        >
          Connecté en tant que{' '}
          <span
            className="font-semibold"
            style={{ color: 'var(--color-midnight-indigo)' }}
          >
            {user.email}
          </span>
        </p>
      </div>
    </main>
  )
}
