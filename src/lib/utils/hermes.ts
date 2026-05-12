// ============================================================
// Shared utility helpers for Hermès messaging UI
// ============================================================

/**
 * Formats a timestamp as a human-readable relative string in French.
 * e.g. "il y a 2 min", "hier à 14:30", "12 janv."
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'à l\'instant'
  if (diffMin < 60) return `il y a ${diffMin} min`
  if (diffHour < 24) {
    return `il y a ${diffHour}h`
  }
  if (diffDay === 1) {
    return `hier à ${formatTime(date)}`
  }
  if (diffDay < 7) {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    return `${days[date.getDay()]} à ${formatTime(date)}`
  }

  // Fallback: short date
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  return `${date.getDate()} ${months[date.getMonth()]}`
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * Returns initials from a display name (up to 2 chars).
 * Falls back to '?' if the name is empty or null.
 */
export function getInitials(displayName: string | null | undefined): string {
  if (!displayName) return '?'
  const parts = displayName.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Returns a deterministic CSS class for avatar background colors.
 * Cycles through a set of pleasant palette colors based on user id hash.
 */
export function getAvatarColor(userId: string): string {
  const palette = [
    'bg-[#006BFF]', // action-blue
    'bg-[#8247f5]', // royal-amethyst
    'bg-[#BB32D5]', // ocean-glimmer
    'bg-[#ffa600]', // sunset-gold
    'bg-[#0099ff]', // skybound-blue
    'bg-[#004EBA]', // glacier-blue
    'bg-[#0B3558]', // midnight-indigo
  ]

  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash |= 0
  }

  return palette[Math.abs(hash) % palette.length]
}
