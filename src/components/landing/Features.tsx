'use client'

function MessageIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function LayoutIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1"/>
      <rect x="3" y="10" width="18" height="4" rx="1"/>
      <rect x="3" y="16" width="18" height="4" rx="1"/>
    </svg>
  )
}

function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.3-4.3"/>
    </svg>
  )
}

function CheckIcon({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M5 12l5 5L20 7"/>
    </svg>
  )
}

interface Feature {
  icon: React.ReactNode
  badge: { label: string; style?: React.CSSProperties }
  iconBg: string
  iconColor: string
  checkColor: string
  title: string
  description: string
  items: { label: string }[]
}

const features: Feature[] = [
  {
    icon: <MessageIcon />,
    badge: { label: 'Temps réel' },
    iconBg: 'rgba(0,107,255,0.1)',
    iconColor: 'var(--color-action-blue)',
    checkColor: 'var(--color-action-blue)',
    title: 'Messagerie instantanée',
    description:
      'Conversations fluides avec accusés de lecture, indicateurs de saisie et synchronisation immédiate sur tous vos appareils. Pas de latence, pas de friction.',
    items: [
      { label: 'Synchronisation multi-appareils' },
      { label: 'Réactions, mentions, threads' },
    ],
  },
  {
    icon: <LayoutIcon />,
    badge: { label: 'Structure', style: { background: 'rgba(130,71,245,0.1)', color: '#5b2ec5' } },
    iconBg: 'rgba(130,71,245,0.12)',
    iconColor: 'var(--color-royal-amethyst)',
    checkColor: 'var(--color-royal-amethyst)',
    title: 'Canaux organisés',
    description:
      'Structurez chaque sujet, équipe ou projet dans son propre canal. Publics, privés ou invités externes — la bonne information arrive aux bonnes personnes.',
    items: [
      { label: 'Canaux publics, privés & invités' },
      { label: 'Sections & favoris personnalisés' },
    ],
  },
  {
    icon: <ShieldIcon />,
    badge: { label: 'Sécurité' },
    iconBg: 'rgba(0,78,186,0.12)',
    iconColor: 'var(--color-glacier-blue)',
    checkColor: 'var(--color-glacier-blue)',
    title: 'Sécurité de bout en bout',
    description:
      'Chiffrement E2E, authentification SSO, conformité RGPD et hébergement européen. Vos conversations restent là où elles doivent rester : entre vous.',
    items: [
      { label: 'Chiffrement E2E & SSO SAML' },
      { label: 'Conformité RGPD, ISO 27001' },
    ],
  },
  {
    icon: <SearchIcon />,
    badge: { label: 'Mémoire', style: { background: 'rgba(255,166,0,0.15)', color: '#a36900' } },
    iconBg: 'rgba(255,166,0,0.15)',
    iconColor: '#cf8400',
    checkColor: '#cf8400',
    title: 'Historique & recherche intelligente',
    description:
      'Retrouvez n\'importe quel message, fichier ou décision en quelques secondes. La recherche d\'Hermès comprend le contexte, pas seulement les mots-clés.',
    items: [
      { label: 'Historique illimité, indexé' },
      { label: 'Filtres par personne, date, canal' },
    ],
  },
]

function FeatureCard({ feature }: { feature: Feature }) {
  const badgeStyle: React.CSSProperties = {
    background: 'var(--color-pale-gray)',
    color: 'var(--color-glacier-blue)',
    borderRadius: 'var(--radius-full)',
    padding: '4px 8px',
    fontSize: '13px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    ...feature.badge.style,
  }

  return (
    <div
      className="flex flex-col p-8 transition-all duration-200"
      style={{
        background: 'var(--color-snow-white)',
        border: '1px solid var(--color-pale-gray)',
        borderRadius: 'var(--radius-cards)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = 'var(--shadow-sm-2)'
        el.style.borderColor = 'transparent'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'var(--color-pale-gray)'
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-xl)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: feature.iconBg,
            color: feature.iconColor,
          }}
        >
          {feature.icon}
        </div>
        <span style={badgeStyle}>{feature.badge.label}</span>
      </div>

      <h3
        className="font-semibold mt-1"
        style={{
          fontSize: '22px',
          color: 'var(--color-midnight-indigo)',
        }}
      >
        {feature.title}
      </h3>

      <p
        className="mt-3"
        style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: 'var(--color-slate-blue)',
        }}
      >
        {feature.description}
      </p>

      <ul className="mt-5 space-y-2" style={{ fontSize: '14px', color: 'var(--color-slate-blue)' }}>
        {feature.items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <CheckIcon style={{ color: feature.checkColor, flexShrink: 0 }} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      {/* Blob */}
      <div
        style={{
          background: 'var(--color-royal-amethyst)',
          width: '280px',
          height: '280px',
          top: '200px',
          right: '-80px',
          filter: 'blur(60px)',
          opacity: 0.18,
          borderRadius: '50%',
          position: 'absolute',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
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
            Plateforme
          </div>

          <h2
            className="mt-5"
            style={{
              fontSize: 'clamp(32px, 4vw, 50px)',
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: 'var(--color-midnight-indigo)',
            }}
          >
            Tout ce qu&apos;il faut pour communiquer, rien de superflu.
          </h2>

          <p
            className="mt-5"
            style={{
              fontSize: '20px',
              lineHeight: 1.6,
              color: 'var(--color-slate-blue)',
            }}
          >
            Quatre piliers, une expérience cohérente. Hermès est conçu pour réduire le bruit et amplifier les décisions qui comptent.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
