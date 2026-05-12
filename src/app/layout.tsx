import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-gilroy',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hermès — La messagerie d\'équipe, repensée avec clarté',
  description: 'Hermès rassemble vos conversations, vos canaux et vos décisions dans un espace unique, conçu pour les équipes qui privilégient la précision à la dispersion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
