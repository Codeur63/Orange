import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Payload = {
  profile?: string
  event?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  stand?: string
  level?: string
  formula?: string
  message?: string
  website?: string
  startedAt?: number
}

const MAX_BODY = 8_000
const MIN_FILL_MS = 1_200
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 6

/** Limite en mémoire : suffisant pour une instance, à remplacer par Redis en multi-instances. */
const attempts = new Map<string, { count: number; resetAt: number }>()

function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip') || 'local'
}

function rateLimited(key: string) {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > MAX_PER_WINDOW
}

function validate(input: Payload): Record<string, string> {
  const errors: Record<string, string> = {}
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
  const name = text(input.name)
  const email = text(input.email)
  const profile = text(input.profile)
  const event = text(input.event)

  if (!name || name.length > 120) errors.name = 'Indiquez votre nom complet (120 caractères maximum).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 180) errors.email = 'Indiquez une adresse email valide.'
  if (profile !== 'partenaire' && profile !== 'joueur') errors.profile = 'Choisissez un profil.'
  if (!['douala', 'kribi', 'les-deux'].includes(event)) errors.event = 'Choisissez un événement.'
  if (profile === 'partenaire' && !text(input.company)) errors.company = 'Indiquez le nom de votre entreprise.'
  if (text(input.message).length > 2_000) errors.message = 'Votre message ne peut pas dépasser 2 000 caractères.'
  return errors
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_BODY) {
    return NextResponse.json({ ok: false, message: 'Demande trop volumineuse.' }, { status: 413 })
  }

  let input: Payload
  try {
    input = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ ok: false, message: 'Requête invalide.' }, { status: 400 })
  }

  // Honeypot : un bot remplit ce champ invisible, une personne ne le voit pas.
  if (typeof input.website === 'string' && input.website.trim()) {
    return NextResponse.json({ ok: true, message: 'Demande enregistrée.' })
  }

  // Un envoi instantané est typiquement automatique.
  const elapsed = Date.now() - Number(input.startedAt || 0)
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, message: 'Veuillez patienter avant d’envoyer la demande.' }, { status: 429 })
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ ok: false, message: 'Trop de demandes. Réessayez dans quelques minutes.' }, { status: 429 })
  }

  const errors = validate(input)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors, message: 'Vérifiez les champs indiqués.' }, { status: 400 })
  }

  // Aucune donnée n’est stockée ni envoyée : brancher ici le service d’email ou le CRM.
  return NextResponse.json({ ok: true, message: 'Demande enregistrée. L’équipe Orange Golf vous recontacte.' })
}
