/**
 * Programs — programme des événements (onglets Douala / Kribi)
 * Intro plein écran (image de fond, texte centré) puis panneaux en défilement horizontal « swipe ».
 * Uses the template's animation primitives (Reveal, Swap).
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

import SlotCard from './SlotCard'
import { PROGRAMMES, type EventKey, type Moment, type Programme } from './programmes'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'
const INTRO_PHOTO = '/au_programme/Rendez-vous.webp'

/* ---------- Content ---------- */
const HEADING_1 = 'Le déroulé'
const HEADING_2 = 'de nos journées.'
const LEAD = 'Choisissez votre ville pour découvrir les activités, de l’accueil des participants à la remise des prix.'

const micro = 'text-[12px] font-medium uppercase leading-[1.3]'

/* ---------- Template primitives ---------- */
const EASE = 'cubic-bezier(0.16,1,0.3,1)'
function prefersReducedMotion() { return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches }
function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_URL
    document.head.appendChild(link)
  }, [])
}
function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style }: { children: ReactNode; delay?: number; as?: ElementType; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [still, setStill] = useState(false)
  useEffect(() => {
    const el = ref.current
    /* Lire la préférence seulement après l'hydratation : sinon le serveur et le client divergent. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setStill(reduced)
    if (!el || reduced) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const on = still || shown
  return (
    <Tag ref={ref} className={className} style={{ ...style, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(64px) scale(0.96)', filter: on ? 'none' : 'blur(12px)', transition: still ? 'none' : `opacity 1100ms ${EASE} ${delay}ms, transform 1100ms ${EASE} ${delay}ms, filter 1100ms ${EASE} ${delay}ms` }}>
      {children}
    </Tag>
  )
}
function Swap({ children, className = '', from = 'translateY(10px)', as: Tag = 'span' }: { children: ReactNode; className?: string; from?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ref.current?.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' })
  }, [from])
  return <Tag ref={ref} className={className}>{children}</Tag>
}
/* ---------- Panneau d'accueil (premier volet de la section) ---------- */
function IntroPanel({ programme, active, onChange, visible }: { programme: Programme; active: EventKey; onChange: (key: EventKey) => void; visible: boolean }) {
  return (
    <div inert={!visible} className="relative flex h-[100svh] w-full flex-none items-center justify-center overflow-hidden bg-[#000000]">
      <img src={INTRO_PHOTO} alt="Joueurs réunis sur le parcours d’un rendez-vous Orange Golf" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: visible ? 'scale(1.06)' : 'scale(1.12)', willChange: 'transform' }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.26)_45%,rgba(0,0,0,0.84)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.34)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center px-5 pb-16 text-center md:px-6 md:py-20" style={{ opacity: visible ? 1 : 0.3, transform: visible ? 'none' : 'scale(0.97)', transition: `opacity 800ms ${EASE}, transform 800ms ${EASE}` }}>
        <Reveal as="h2" delay={100} className="text-[clamp(2rem,10vw,2.7rem)] md:mt-7 md:text-[clamp(2.7rem,6.4vw,5.6rem)] font-extrabold leading-[0.96] tracking-[-0.04em] [text-shadow:0_4px_34px_rgba(0,0,0,0.45)]">
          <span className="block">{HEADING_1}</span>
          <span className="block text-[#FF7900]">{HEADING_2}</span>
        </Reveal>
        <Reveal as="p" delay={200} className="mt-4 max-w-[620px] text-[15px] font-medium leading-[1.55] text-white/85 [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] md:text-[19px]">{LEAD}</Reveal>

        <Reveal delay={300} className="relative mt-5 inline-grid md:mt-8 grid-cols-2 rounded-full border border-white/25 bg-black/45 p-1 backdrop-blur-md">
          <span className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ backgroundColor: '#FF7900', transform: active === 'kribi' ? 'translateX(100%)' : 'translateX(0)' }} />
          {(['douala', 'kribi'] as EventKey[]).map((key) => (
            <button key={key} type="button" onClick={() => onChange(key)} aria-pressed={active === key} className={`relative z-10 rounded-full px-7 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${active === key ? 'text-[#000000]' : 'text-white/80 hover:text-white'}`}>
              {PROGRAMMES[key].city}
            </button>
          ))}
        </Reveal>

        <Reveal delay={380} className="mt-5 w-full max-w-[740px] md:mt-8 overflow-hidden rounded-[20px] border border-white/20 bg-[#0A0A0A]/85 text-left backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/12 bg-black/30 px-4 py-3 md:gap-4 md:px-5">
            <Swap key={`${active}-ev`} className="text-[15px] font-semibold text-white md:text-[16px]">{programme.event} · {programme.city}</Swap>
            <Swap key={`${active}-date`} className="shrink-0 rounded-full bg-[#FF7900] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[#000000]">{programme.date}</Swap>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/12">
            {[
              { k: '2', l: 'rendez-vous' },
              { k: '4', l: 'temps forts' },
              { k: active === 'kribi' ? '2' : '1', l: active === 'kribi' ? 'jours de jeu' : 'jour de jeu' },
            ].map((s) => (
              <div key={s.l} className="px-1 py-2.5 text-center md:px-3 md:py-3.5">
                <span className="block text-[20px] font-bold leading-none text-[#FF7900]">{s.k}</span>
                <span className="mt-1.5 block text-[12px] font-medium uppercase tracking-[0.08em] text-white/80">{s.l}</span>
              </div>
            ))}
          </div>
          <Swap key={`${active}-intro`} as="p" className="block border-t border-white/12 px-5 py-3 text-[13px] leading-[1.55] text-white/80 md:text-[14px]">{programme.intro}</Swap>
        </Reveal>

        <Reveal as="p" delay={460} className="mt-6 hidden text-[12px] font-medium uppercase tracking-[0.16em] text-white/60 sm:block">Faites défiler pour découvrir les temps forts</Reveal>
      </div>
    </div>
  )
}

/* ---------- Slide (panneau étape) ---------- */
function Slide({ moment, date, index, total, active }: { moment: Moment; date: string; index: number; total: number; active: boolean }) {
  const number = String(index + 1).padStart(2, '0')
  return (
    <div inert={!active} className="relative flex h-[100svh] w-full flex-none items-center justify-center overflow-hidden bg-[#000000]">
      <img
        src={moment.image}
        alt={`Illustration du temps fort : ${moment.title}`}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: active ? 'scale(1.06)' : 'scale(1.12)', willChange: 'transform' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.14)_50%,rgba(0,0,0,0.46)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.04)_32%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_54%,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0)_76%)]" />

      <span aria-hidden className="pointer-events-none absolute right-6 top-8 text-xs font-semibold tracking-[0.24em] text-white/85 md:right-12 md:top-10">{number} / {String(total).padStart(2, '0')}</span>
      <span aria-hidden className="pointer-events-none absolute -right-4 bottom-10 select-none text-[26vw] font-extrabold leading-none tracking-[-0.06em] text-white/10 md:right-10 md:bottom-2 md:text-[18vw]">{number}</span>

      <div
        className="relative mx-auto flex w-full max-w-[880px] flex-col items-center px-6 py-24 text-center"
        style={{
          opacity: active ? 1 : 0.3,
          transform: active ? 'none' : 'translateY(28px) scale(0.97)',
          filter: active ? 'none' : 'blur(4px)',
          transition: `opacity 800ms ${EASE}, transform 800ms ${EASE}, filter 800ms ${EASE}`,
          willChange: 'opacity, transform, filter',
        }}
      >
        <h3 className="text-[clamp(2.3rem,6vw,4.8rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">{moment.title}</h3>
        <p className="mt-6 max-w-[600px] text-[clamp(0.95rem,1.5vw,1.12rem)] leading-[1.6] text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_18px_rgba(0,0,0,0.65)]">{moment.desc}</p>

        <div className="mt-6 w-full max-w-[460px] text-left">
          <SlotCard day={moment.day} time={moment.time} label={date} title={moment.tags.join(' · ')} featured />
        </div>
      </div>
    </div>
  )
}

function ProgrammeExperience({ programme, active, onChange }: { programme: Programme; active: EventKey; onChange: (key: EventKey) => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = programme.moments.length + 1
  const labels = ['Introduction', ...programme.moments.map((m) => m.title)]

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const total = Math.max(el.offsetHeight - window.innerHeight, 1)
      const p = Math.min(Math.max(-rect.top / total, 0), 1)
      setIndex(Math.min(Math.round(p * (count - 1)), count - 1))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [count])

  const go = (i: number) => {
    const el = wrap.current
    if (!el) return
    const total = Math.max(el.offsetHeight - window.innerHeight, 1)
    const top = el.getBoundingClientRect().top + window.scrollY + (i / Math.max(count - 1, 1)) * total
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <div ref={wrap} className="relative w-full" style={{ height: `${count * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#000000]">
        <div
          className="flex h-full w-full transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)`, willChange: 'transform' }}
        >
          <IntroPanel programme={programme} active={active} onChange={onChange} visible={index === 0} />
          {programme.moments.map((m, i) => (
            <Slide key={m.title} moment={m} date={programme.date} index={i} total={programme.moments.length} active={index === i + 1} />
          ))}
        </div>

        {/* flèches desktop */}
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Volet précédent" className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#FF7900] hover:text-[#FF7900] disabled:pointer-events-none disabled:opacity-20 md:flex">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Volet suivant" className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:border-[#FF7900] hover:text-[#FF7900] disabled:pointer-events-none disabled:opacity-20 md:flex">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>

        <div role="group" aria-label="Navigation du programme" className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 md:hidden">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="min-h-11 rounded-full border border-white/40 bg-black/85 px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50">Précédent</button>
          <span aria-live="polite" className="rounded-full bg-black/85 px-2 py-1 text-xs tabular-nums text-white">{index + 1} / {count}</span>
          <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} className="min-h-11 rounded-full bg-[#FF7900] px-4 text-sm font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50">Suivant</button>
        </div>

        <div className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 gap-2 md:flex">
          {labels.map((label, i) => (
            <button key={label} type="button" onClick={() => go(i)} aria-label={`Aller à ${label}`} className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-[#FF7900]' : 'w-2 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Section ---------- */
export default function Programs() {
  useGoogleFonts()
  const [active, setActive] = useState<EventKey>('douala')

  useEffect(() => {
    function selectFromHash() {
      if (window.location.hash === '#programme-kribi') setActive('kribi')
      if (window.location.hash === '#programme-douala') setActive('douala')
    }
    selectFromHash()
    window.addEventListener('hashchange', selectFromHash)
    return () => window.removeEventListener('hashchange', selectFromHash)
  }, [])

  function changeProgramme(key: EventKey) {
    setActive(key)
    window.history.replaceState(null, '', `#programme-${key}`)
  }

  return (
    /* une seule section, sans overflow-hidden (qui casserait le sticky) */
    <section id="programs" className="relative w-full bg-[#000000] font-['Archivo',sans-serif] text-white antialiased">
      <span id="programme-douala" aria-hidden className="absolute top-0" />
      <span id="programme-kribi" aria-hidden className="absolute top-0" />
      <ProgrammeExperience key={active} programme={PROGRAMMES[active]} active={active} onChange={changeProgramme} />
    </section>
  )
}
