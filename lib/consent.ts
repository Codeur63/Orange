export type Consent = 'granted' | 'denied'

export const CONSENT_KEY = 'orange-golf-consent'
export const CONSENT_EVENT = 'orange-golf:consent'
export const CONSENT_OPEN_EVENT = 'orange-golf:consent-open'

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function publishConsent(consent: Consent) {
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }))
}
