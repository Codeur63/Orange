/** Configuration publique du site. Aucune valeur ici n’est secrète. */
export const SITE_NAME = 'Orange Golf Cameroun'

export const SITE_DESCRIPTION =
  'Golf Open Day à Douala et Orange Golf Experience à Kribi : programme, agenda et inscription aux rendez-vous golf d’Orange Cameroun.'

export const OG_IMAGE_ALT =
  'Visible Orange Golf Cameroun : deux rendez-vous de golf à Douala et Kribi.'

/**
 * Retourne une URL absolue valide, ou null pour une valeur vide, wildcard
 * (`*.vercel.app`) ou invalide. Évite tout `ERR_INVALID_URL` au build.
 */
function toValidUrl(value?: string | null): string | null {
  const trimmed = value?.trim()
  if (!trimmed || trimmed.includes('*')) return null
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(candidate)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

/**
 * URL canonique utilisée par les métadonnées, le sitemap et robots.txt.
 * Ordre : variable configurée, URL Vercel de déploiement, valeur par défaut.
 */
export const SITE_URL =
  toValidUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  toValidUrl(process.env.VERCEL_URL) ??
  'https://orange-golf.cm'
