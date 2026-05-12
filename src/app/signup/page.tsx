export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-snow-white)' }}>
      <div className="text-center">
        <h1
          className="font-bold"
          style={{
            fontSize: 'clamp(32px, 4vw, 50px)',
            color: 'var(--color-midnight-indigo)',
            lineHeight: 1.1,
          }}
        >
          Inscription
        </h1>
        <p
          className="mt-4"
          style={{
            fontSize: '18px',
            color: 'var(--color-slate-blue)',
            maxWidth: '400px',
          }}
        >
          La page d&apos;inscription sera disponible prochainement.
        </p>
      </div>
    </main>
  )
}
