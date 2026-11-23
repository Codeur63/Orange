'use client'

import { useEffect } from 'react'
import { CONSENT_EVENT, readConsent, type Consent } from '@/lib/consent'

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const SCRIPT_ID = 'orange-golf-plausible'

/** Charge Plausible uniquement après consentement explicite. Aucune clé secrète ici. */
export default function Analytics() {
  useEffect(() => {
    const sync = (consent: Consent | null) => {
      const existing = document.getElementById(SCRIPT_ID)
      if (consent === 'granted' && DOMAIN) {
        if (existing) return
        const script = document.createElement('script')
        script.id = SCRIPT_ID
        script.src = 'https://plausible.io/js/script.js'
        script.async = true
        script.defer = true
        script.dataset.domain = DOMAIN
        document.head.appendChild(script)
      } else if (existing) {
        existing.remove()
      }
    }

    sync(readConsent())
    const onConsent = (event: Event) => sync((event as CustomEvent<Consent>).detail)
    window.addEventListener(CONSENT_EVENT, onConsent)
    return () => window.removeEventListener(CONSENT_EVENT, onConsent)
  }, [])

  return null
}
