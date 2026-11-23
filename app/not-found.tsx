import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page introuvable',
  description: 'La page demandée n’existe pas sur Orange Golf Cameroun.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#0A0A0A] px-5 py-16 text-white md:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full border border-[#FF7900]/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-[620px] w-[620px] rounded-full border border-white/10"
      />

      <div className="relative mx-auto w-full max-w-[960px]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#FF7900]">Orange Golf Cameroun</p>
        <p className="mt-6 text-[clamp(6rem,22vw,15rem)] font-extrabold leading-[0.82] tracking-[-0.07em]">404</p>
        <h1 className="mt-8 max-w-[18ch] text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
          Cette page est hors parcours.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-white/70 md:text-[18px]">
          L’adresse demandée n’existe pas ou a changé. Revenez à l’accueil pour retrouver le programme, l’agenda et l’inscription.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#FF7900] px-6 text-[15px] font-semibold text-[#0A0A0A] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7900]"
        >
          Retour à l’accueil
          <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  )
}
