'use client'

import { useEffect, useState } from 'react'
import { CONSENT_KEY, CONSENT_OPEN_EVENT, publishConsent, readConsent, type Consent } from '@/lib/consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!readConsent()) setVisible(true)
    const reopen = () => setVisible(true)
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  const choose = (consent: Consent) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, consent)
    } catch {
      // Navigation privée : le choix reste valable pour cette visite.
    }
    publishConsent(consent)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Consentement à la mesure d’audience"
      style={{ backgroundColor: "rgba(10, 10, 10, 0.95)" }}
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[680px] rounded-2xl border border-[#FF7900]/45 p-5 text-white shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md sm:bottom-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#FF7900]">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#FF7900]" />
            Votre vie privée
          </p>
          <p className="mt-2 text-[15px] leading-[1.55]">
            Nous utilisons une mesure d’audience sans cookies pour améliorer le site. Vous pouvez l’accepter ou la refuser.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:min-w-[190px]">
          <button
            type="button"
            onClick={() => choose('granted')}
            className="min-h-11 rounded-full bg-[#FF7900] px-5 text-[14px] font-semibold text-[#0A0A0A] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7900]"
          >
            Accepter
          </button>
          <button
            type="button"
            onClick={() => choose('denied')}
            className="min-h-11 rounded-full border border-white/35 px-5 text-[14px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  )
}
