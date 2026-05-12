import Link from 'next/link'

function MessageIcon({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  )
}

function ArrowRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  )
}

function SendIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  )
}

function CheckCircleIcon({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Blobs */}
      <div
        className="blob"
        style={{
          background: 'var(--color-lavender-glow)',
          width: '380px',
          height: '380px',
          top: '-120px',
          right: '-80px',
          filter: 'blur(60px)',
          opacity: 0.35,
          borderRadius: '50%',
          position: 'absolute',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        className="blob"
        style={{
          background: 'var(--color-skybound-blue)',
          width: '320px',
          height: '320px',
          top: '180px',
          left: '-100px',
          filter: 'blur(60px)',
          opacity: 0.25,
          borderRadius: '50%',
          position: 'absolute',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        className="blob"
        style={{
          background: 'var(--color-sunset-gold)',
          width: '220px',
          height: '220px',
          bottom: '-80px',
          right: '30%',
          filter: 'blur(60px)',
          opacity: 0.2,
          borderRadius: '50%',
          position: 'absolute',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        {/* Text Content */}
        <div className="lg:col-span-6 z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2"
            style={{
              background: 'var(--color-pale-gray)',
              color: 'var(--color-glacier-blue)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-glacier-blue)',
                display: 'inline-block',
              }}
            />
            Nouveauté · Threads intelligents
          </div>

          {/* Headline */}
          <h1
            className="mt-6"
            style={{
              fontSize: 'clamp(44px, 6.4vw, 76px)',
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-midnight-indigo)',
            }}
          >
            Communiquez<br />
            avec <span style={{ color: 'var(--color-action-blue)' }}>clarté</span>.<br />
            Avancez ensemble.
          </h1>

          {/* Subtitle */}
          <p
            className="mt-7 max-w-xl"
            style={{
              fontSize: '20px',
              lineHeight: 1.6,
              color: 'var(--color-slate-blue)',
            }}
          >
            Hermès rassemble vos conversations, vos canaux et vos décisions dans un espace unique, conçu pour les équipes qui privilégient la précision à la dispersion.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="text-white font-semibold transition-all duration-150"
              style={{
                background: 'var(--color-action-blue)',
                borderRadius: 'var(--radius-buttons)',
                padding: '14px 24px',
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-sm-3)',
              }}
            >
              Commencer
              <ArrowRightIcon />
            </Link>
            <Link
              href="#features"
              className="font-semibold transition-colors duration-150"
              style={{
                color: 'var(--color-midnight-indigo)',
                padding: '14px 20px',
                borderRadius: 'var(--radius-buttons)',
                fontSize: '15px',
              }}
            >
              Voir la plateforme →
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-6 text-sm" style={{ color: 'var(--color-slate-blue)' }}>
            <div className="flex -space-x-2">
              <span
                className="w-8 h-8 rounded-full border-2 border-white"
                style={{ background: 'linear-gradient(135deg, #e55cff, #8247f5)' }}
              />
              <span
                className="w-8 h-8 rounded-full border-2 border-white"
                style={{ background: 'linear-gradient(135deg, #0099ff, #006BFF)' }}
              />
              <span
                className="w-8 h-8 rounded-full border-2 border-white"
                style={{ background: 'linear-gradient(135deg, #ffa600, #e55cff)' }}
              />
              <span
                className="w-8 h-8 rounded-full border-2 border-white"
                style={{ background: 'linear-gradient(135deg, #0B3558, #476788)' }}
              />
            </div>
            <span>
              Choisi par <span className="font-semibold" style={{ color: 'var(--color-midnight-indigo)' }}>12 000+</span> équipes en Europe
            </span>
          </div>
        </div>

        {/* Floating UI Card */}
        <div className="lg:col-span-6 relative z-10">
          <div
            className="relative overflow-hidden"
            style={{
              background: 'var(--color-snow-white)',
              borderRadius: 'var(--radius-cards)',
              boxShadow: 'var(--shadow-sm-2)',
            }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--color-outline-gray)' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>
              <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--color-slate-blue)' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#00c170',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 4px rgba(0,193,112,0.15)',
                    display: 'inline-block',
                  }}
                />
                En direct · #design-system
              </div>
              <span className="text-xs" style={{ color: 'var(--color-slate-blue)' }}>14:32</span>
            </div>

            <div className="grid grid-cols-12">
              {/* Sidebar */}
              <aside
                className="col-span-4 hidden sm:block p-4"
                style={{
                  background: 'var(--color-cloud-mist)',
                  borderRight: '1px solid var(--color-outline-gray)',
                }}
              >
                <p
                  className="text-[11px] uppercase tracking-wider font-semibold mb-2"
                  style={{ color: 'var(--color-slate-blue)' }}
                >
                  Canaux
                </p>
                <div className="space-y-1">
                  {[
                    { name: 'général', active: false },
                    { name: 'design-system', active: true },
                    { name: 'produit', active: false },
                    { name: 'annonces', active: false },
                  ].map((channel) => (
                    <div
                      key={channel.name}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium"
                      style={{
                        background: channel.active ? 'var(--color-pale-gray)' : 'transparent',
                        color: channel.active ? 'var(--color-midnight-indigo)' : 'var(--color-slate-blue)',
                      }}
                    >
                      <span>#</span> {channel.name}
                    </div>
                  ))}
                </div>
                <p
                  className="text-[11px] uppercase tracking-wider font-semibold mt-5 mb-2"
                  style={{ color: 'var(--color-slate-blue)' }}
                >
                  Messages directs
                </p>
                <div className="space-y-1">
                  {[
                    { name: 'Camille L.', online: true },
                    { name: 'Marc D.', online: false },
                  ].map((dm) => (
                    <div
                      key={dm.name}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium"
                      style={{ color: 'var(--color-slate-blue)' }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: dm.online ? '#00c170' : 'var(--color-steel-gray)',
                          display: 'inline-block',
                        }}
                      />
                      {dm.name}
                    </div>
                  ))}
                </div>
              </aside>

              {/* Conversation */}
              <div className="col-span-12 sm:col-span-8 p-5 space-y-3">
                {/* Message 1 */}
                <div className="flex items-start gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #8247f5, #e55cff)' }}
                  />
                  <div>
                    <p className="text-[12px] font-semibold" style={{ color: 'var(--color-midnight-indigo)' }}>
                      Camille · <span style={{ color: 'var(--color-slate-blue)', fontWeight: 400 }}>14:28</span>
                    </p>
                    <div
                      className="mt-1"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        fontSize: '14px',
                        lineHeight: 1.45,
                        maxWidth: '80%',
                        background: 'var(--color-cloud-mist)',
                        color: 'var(--color-midnight-indigo)',
                        borderBottomLeftRadius: '4px',
                      }}
                    >
                      La nouvelle palette est validée. Je publie le composant <b>Button</b> dans le canal ✨
                    </div>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex items-start gap-2 justify-end">
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '14px',
                      fontSize: '14px',
                      lineHeight: 1.45,
                      maxWidth: '80%',
                      background: 'var(--color-action-blue)',
                      color: 'white',
                      borderBottomRightRadius: '4px',
                    }}
                  >
                    Parfait — j&apos;enchaîne sur l&apos;onboarding ce soir 👌
                  </div>
                </div>

                {/* Message 3 — Typing */}
                <div className="flex items-start gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ffa600, #e55cff)' }}
                  />
                  <div>
                    <p className="text-[12px] font-semibold" style={{ color: 'var(--color-midnight-indigo)' }}>
                      Marc · <span style={{ color: 'var(--color-slate-blue)', fontWeight: 400 }}>14:31</span>
                    </p>
                    <div
                      className="mt-1 flex items-center gap-1.5"
                      style={{ padding: '10px 14px', borderRadius: '14px', background: 'var(--color-cloud-mist)' }}
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="typing-dot"
                          style={{
                            width: '6px',
                            height: '6px',
                            background: 'var(--color-steel-gray)',
                            borderRadius: '50%',
                            display: 'inline-block',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div
                  className="mt-4 flex items-center gap-2"
                  style={{
                    border: '1px solid var(--color-platinum-tint)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                  }}
                >
                  <MessageIcon className="flex-shrink-0" style={{ color: 'var(--color-slate-blue)' }} />
                  <span className="text-sm flex-1" style={{ color: 'var(--color-slate-blue)' }}>
                    Écrire un message à #design-system…
                  </span>
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ background: 'var(--color-action-blue)' }}
                  >
                    <SendIcon className="text-white" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating mini card */}
          <div
            className="hidden md:flex items-center gap-3 px-4 py-3 absolute -bottom-6 -left-6"
            style={{
              background: 'var(--color-snow-white)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-sm-2)',
            }}
          >
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,107,255,0.1)' }}
            >
              <CheckCircleIcon style={{ color: 'var(--color-action-blue)' }} />
            </span>
            <div>
              <p className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--color-midnight-indigo)' }}>
                Message livré
              </p>
              <p className="text-[12px] leading-tight" style={{ color: 'var(--color-slate-blue)' }}>
                Chiffré de bout en bout
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
