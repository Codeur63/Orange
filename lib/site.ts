/** Configuration publique du site. Aucune valeur ici n’est secrète. */
export const SITE_NAME = 'Orange Golf Cameroun'

export const SITE_DESCRIPTION =
  'Golf Open Day à Douala et Orange Golf Experience à Kribi : programme, agenda et inscription aux rendez-vous golf d’Orange Cameroun.'

export const OG_IMAGE_ALT =
  'Visible Orange Golf Cameroun : deux rendez-vous de golf à Douala et Kribi.'

/**
 * URL canonique. À définir en production via NEXT_PUBLIC_SITE_URL (variable publique).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://orange-golf.cm').replace(/\/$/, '')
