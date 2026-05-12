'use client'

function HermesLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2H21.5l-7.5 8.59L23 22h-6.844l-5.36-7.013L4.5 22H1.244l8.082-9.246L1 2h7.014l4.84 6.42L18.244 2zm-1.2 18h1.879L7.04 4H5.04l12.004 16z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.27 2.38 4.27 5.47v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0h.003z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.13c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.68 5.36-5.24 5.64.41.36.78 1.07.78 2.15v3.19c0 .31.2.66.79.55 4.56-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  )
}

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const columns: FooterColumn[] = [
  {
    title: 'Produit',
    links: [
      { label: 'Fonctionnalités', href: '#' },
      { label: 'Tarifs', href: '#' },
      { label: 'Sécurité', href: '#' },
      { label: 'Intégrations', href: '#' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '#' },
      { label: 'Carrières', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: "Conditions d'utilisation", href: '#' },
      { label: 'Politique de confidentialité', href: '#' },
      { label: 'Mentions légales', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-outline-gray)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ background: 'var(--color-midnight-indigo)' }}
              >
                <HermesLogo />
              </span>
              <span className="font-bold text-lg" style={{ color: 'var(--color-midnight-indigo)' }}>
                Hermès
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-slate-blue)' }}>
              La messagerie d&apos;équipe pensée pour la clarté, la sécurité et la durée.
            </p>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <p
                className="font-semibold text-sm mb-3"
                style={{ color: 'var(--color-midnight-indigo)' }}
              >
                {col.title}
              </p>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--color-slate-blue)' }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors duration-150"
                      style={{ color: 'var(--color-slate-blue)' }}
                      onMouseEnter={(e) => {
                        ;(e.target as HTMLAnchorElement).style.color = 'var(--color-action-blue)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.target as HTMLAnchorElement).style.color = 'var(--color-slate-blue)'
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--color-outline-gray)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-slate-blue)' }}>
            © 2025 Hermès Communications. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4" style={{ color: 'var(--color-slate-blue)' }}>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-[var(--color-action-blue)] transition-colors duration-150"
              style={{ color: 'var(--color-slate-blue)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-action-blue)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-slate-blue)'
              }}
            >
              <TwitterIcon />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-[var(--color-action-blue)] transition-colors duration-150"
              style={{ color: 'var(--color-slate-blue)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-action-blue)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-slate-blue)'
              }}
            >
              <LinkedInIcon />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-[var(--color-action-blue)] transition-colors duration-150"
              style={{ color: 'var(--color-slate-blue)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-action-blue)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-slate-blue)'
              }}
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
