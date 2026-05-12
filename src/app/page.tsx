'use client'

import Link from 'next/link'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'

function HermesLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  )
}

function NavBar() {
  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-outline-gray)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: 'var(--color-midnight-indigo)' }}
          >
            <HermesLogo />
          </span>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ color: 'var(--color-midnight-indigo)' }}
          >
            Hermès
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-9">
          {[
            { label: 'Fonctionnalités', href: '#features' },
            { label: 'Plateforme', href: '#workflow' },
            { label: 'Sécurité', href: '#security' },
            { label: 'Tarifs', href: '#pricing' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-medium transition-colors duration-150"
              style={{ color: 'var(--color-midnight-indigo)', fontSize: '15px' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-action-blue)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-midnight-indigo)'
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="hidden sm:inline-flex font-semibold transition-colors duration-150"
            style={{
              color: 'var(--color-midnight-indigo)',
              padding: '14px 20px',
              borderRadius: 'var(--radius-buttons)',
              fontSize: '15px',
            }}
          >
            Connexion
          </Link>
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
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#0058d6'
              el.style.boxShadow = 'var(--shadow-sm-3)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--color-action-blue)'
              el.style.transform = 'translateY(0)'
            }}
          >
            Commencer
          </Link>
        </div>
      </div>
    </header>
  )
}

function LogoStrip() {
  const logos = ['Northwind', 'Atelier\u00A042', 'Lumen', '◆ Cobalt', 'Méridien', 'Veritas\u2122']

  return (
    <section
      className="py-12"
      style={{
        background: 'var(--color-cloud-mist)',
        borderTop: '1px solid var(--color-outline-gray)',
        borderBottom: '1px solid var(--color-outline-gray)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p
          className="text-center font-semibold uppercase tracking-wider mb-8"
          style={{ fontSize: '14px', color: 'var(--color-slate-blue)' }}
        >
          Des équipes exigeantes utilisent Hermès au quotidien
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-70">
          {logos.map((name) => (
            <div
              key={name}
              className="text-center font-bold"
              style={{ fontSize: '20px', color: 'var(--color-midnight-indigo)' }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="py-24 lg:py-32"
      style={{
        background: 'var(--color-cloud-mist)',
        borderTop: '1px solid var(--color-outline-gray)',
        borderBottom: '1px solid var(--color-outline-gray)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div>
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
            Workflow
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
            Du brief à la décision, en une seule fenêtre.
          </h2>

          <p
            className="mt-5"
            style={{
              fontSize: '20px',
              lineHeight: 1.6,
              color: 'var(--color-slate-blue)',
            }}
          >
            Hermès orchestre vos échanges autour des objets qui comptent : projets, documents, décisions. Plus de contexte perdu entre les outils.
          </p>

          {/* Steps */}
          <div className="mt-10 space-y-6">
            {[
              {
                step: 1,
                color: 'var(--color-action-blue)',
                title: 'Créez un canal par sujet',
                desc: "Une initiative, une équipe ou un client — chaque conversation trouve sa place.",
              },
              {
                step: 2,
                color: 'var(--color-royal-amethyst)',
                title: 'Échangez en temps réel',
                desc: 'Messages, fichiers, threads et appels — tout reste lié au bon contexte.',
              },
              {
                step: 3,
                color: 'var(--color-glacier-blue)',
                title: 'Capitalisez sur l\'historique',
                desc: 'Recherchez, épinglez, archivez. Les décisions importantes restent retrouvables.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
                  style={{ background: item.color }}
                >
                  {item.step}
                </span>
                <div>
                  <h4
                    className="font-semibold"
                    style={{ fontSize: '17px', color: 'var(--color-midnight-indigo)' }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[15px] mt-1" style={{ color: 'var(--color-slate-blue)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Card */}
        <div className="relative">
          <div
            className="p-6 relative z-10"
            style={{
              background: 'var(--color-snow-white)',
              borderRadius: 'var(--radius-cards)',
              boxShadow: 'var(--shadow-sm-2)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p
                  className="text-[11px] uppercase tracking-wider font-semibold"
                  style={{ color: 'var(--color-slate-blue)' }}
                >
                  Activité aujourd&apos;hui
                </p>
                <p
                  className="font-bold text-2xl mt-1"
                  style={{ color: 'var(--color-midnight-indigo)' }}
                >
                  847 messages
                </p>
              </div>
              <span
                className="inline-flex items-center gap-2"
                style={{
                  background: 'var(--color-pale-gray)',
                  color: 'var(--color-glacier-blue)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                +12% vs hier
              </span>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-32">
              {[
                { h: '40%', color: 'var(--color-platinum-tint)' },
                { h: '60%', color: 'var(--color-platinum-tint)' },
                { h: '35%', color: 'var(--color-platinum-tint)' },
                { h: '75%', color: 'var(--color-skybound-blue)' },
                { h: '90%', color: 'var(--color-action-blue)' },
                { h: '70%', color: 'var(--color-royal-amethyst)' },
                { h: '55%', color: 'var(--color-platinum-tint)' },
              ].map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{ height: bar.h, background: bar.color }}
                />
              ))}
            </div>
            <div
              className="flex justify-between mt-3 text-[11px] font-medium"
              style={{ color: 'var(--color-slate-blue)' }}
            >
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div
                className="p-4 rounded-xl"
                style={{ background: 'var(--color-cloud-mist)' }}
              >
                <p className="text-[12px] font-medium" style={{ color: 'var(--color-slate-blue)' }}>
                  Canaux actifs
                </p>
                <p
                  className="font-bold text-xl mt-1"
                  style={{ color: 'var(--color-midnight-indigo)' }}
                >
                  42
                </p>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ background: 'var(--color-cloud-mist)' }}
              >
                <p className="text-[12px] font-medium" style={{ color: 'var(--color-slate-blue)' }}>
                  Temps de réponse
                </p>
                <p
                  className="font-bold text-xl mt-1"
                  style={{ color: 'var(--color-midnight-indigo)' }}
                >
                  3 min
                </p>
              </div>
            </div>
          </div>

          {/* Floating mention card */}
          <div
            className="hidden md:flex items-center gap-3 px-4 py-3 absolute -top-5 -right-4 z-20"
            style={{
              background: 'var(--color-snow-white)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-sm-2)',
            }}
          >
            <span
              className="w-8 h-8 rounded-full"
              style={{ background: 'linear-gradient(135deg, #e55cff, #8247f5)' }}
            />
            <div>
              <p
                className="text-[13px] font-semibold leading-tight"
                style={{ color: 'var(--color-midnight-indigo)' }}
              >
                Camille vous a mentionné
              </p>
              <p className="text-[11px] leading-tight" style={{ color: 'var(--color-slate-blue)' }}>
                #design-system · à l&apos;instant
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SecuritySection() {
  return (
    <section id="security" className="py-24 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
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
          Conçu en Europe
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
          La confiance n&apos;est pas une option.<br />C&apos;est une fondation.
        </h2>

        <p
          className="mt-5 max-w-2xl mx-auto"
          style={{
            fontSize: '20px',
            lineHeight: 1.6,
            color: 'var(--color-slate-blue)',
          }}
        >
          Hermès est hébergé en France, chiffré de bout en bout et audité chaque année. Vous gardez le contrôle sur vos données, sur vos accès, et sur leur durée de conservation.
        </p>

        {/* Security badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'ISO 27001', sub: 'Certifié' },
            { label: 'RGPD', sub: 'Conforme' },
            { label: 'SOC 2', sub: 'Type II' },
            { label: '99.99%', sub: 'Uptime' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="p-6 flex flex-col items-center"
              style={{
                background: 'var(--color-snow-white)',
                borderRadius: 'var(--radius-cards)',
                boxShadow: 'var(--shadow-sm-2)',
              }}
            >
              <span
                className="font-bold text-2xl"
                style={{ color: 'var(--color-midnight-indigo)' }}
              >
                {badge.label}
              </span>
              <span className="text-sm mt-1" style={{ color: 'var(--color-slate-blue)' }}>
                {badge.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="pb-24 lg:pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div
          className="relative overflow-hidden p-10 lg:p-16"
          style={{
            background: 'linear-gradient(135deg, #0B3558 0%, #004EBA 60%, #006BFF 100%)',
            borderRadius: 'var(--radius-3xl)',
          }}
        >
          {/* Blobs */}
          <div
            style={{
              background: 'var(--color-lavender-glow)',
              width: '320px',
              height: '320px',
              top: '-100px',
              right: '-100px',
              filter: 'blur(60px)',
              opacity: 0.4,
              borderRadius: '50%',
              position: 'absolute',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              background: 'var(--color-skybound-blue)',
              width: '260px',
              height: '260px',
              bottom: '-120px',
              left: '-60px',
              filter: 'blur(60px)',
              opacity: 0.5,
              borderRadius: '50%',
              position: 'absolute',
              pointerEvents: 'none',
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2
                className="font-bold leading-[1.1] tracking-tight"
                style={{ fontSize: 'clamp(30px, 4vw, 46px)', color: 'white' }}
              >
                Donnez à vos équipes<br />une nouvelle clarté.
              </h2>
              <p
                className="text-white/80 mt-5"
                style={{ fontSize: '18px', maxWidth: '450px' }}
              >
                Créez votre espace en moins de deux minutes. Aucune carte bancaire requise — l&apos;essai s&apos;arrête quand vous le souhaitez.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/signup"
                className="font-semibold transition-all duration-150"
                style={{
                  background: 'white',
                  color: 'var(--color-midnight-indigo)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 24px',
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Commencer
                <ArrowRightIcon />
              </Link>
              <a
                href="#"
                className="font-semibold transition-all duration-150"
                style={{
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 24px',
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                }}
              >
                Parler à l&apos;équipe
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <Hero />
      <LogoStrip />
      <Features />
      <WorkflowSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </main>
  )
}
