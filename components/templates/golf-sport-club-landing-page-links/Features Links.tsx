/**
 * Programs — programme des événements (onglets Douala / Kribi)
 * Intro plein écran (image de fond, texte centré) puis panneaux en défilement horizontal « swipe ».
 * 100% self-contained. Uses the template's animation primitives (Reveal, Swap, Button).
 */
import { memo, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'
const IMG = {
  intro: '/au_programme/Rendez-vous.png',
  discover: '/au_programme/golf_rencontre.png',
  games: '/au_programme/golfeur.png',
  b2b: '/au_programme/echange_pro.png',
  ranking: '/au_programme/classement.png',
}

/* ---------- Content ---------- */
const HEADING_1 = 'Le déroulé'
const HEADING_2 = 'de nos journées.'
const LEAD = 'Deux rendez-vous, une même conviction : le golf comme espace de rencontre.'
const BODY = 'Découvrir, jouer, échanger, célébrer : un programme pensé pour vivre le golf autrement, à Douala comme à Kribi.'
const CTA_BODY = 'Sur les greens de Douala comme sur le parcours de Kribi, venez partager des moments de sport, d’échanges et de convivialité avec la communauté Orange Business.'

type EventKey = 'douala' | 'kribi'
type Moment = { time: string; day: string; title: string; desc: string; note: string; tags: string[]; image: string }
type Programme = { event: string; city: string; date: string; intro: string; moments: Moment[] }

const PROGRAMMES: Record<EventKey, Programme> = {
  douala: {
    event: 'Golf Open Day',
    city: 'Douala',
    date: '10 avril 2027',
    intro: 'Une journée portes ouvertes pour découvrir le golf, jouer et rencontrer les partenaires d’Orange.',
    moments: [
      { time: '08:00', day: 'Matinée', title: 'Découvrir le golf', desc: 'Accueil des participants puis initiation encadrée par nos professionnels. Aucun niveau requis, le matériel est fourni.', note: 'Un premier contact avec le golf, sans pression et dans la bonne humeur.', tags: ['Initiation', 'Matériel fourni', 'Tous niveaux'], image: IMG.discover },
      { time: '10:30', day: 'Matinée', title: 'Les jeux', desc: 'Ateliers et concours ludiques autour du putting, du drive et de l’approche. Des défis ouverts à tous les participants.', note: 'Chacun trouve son défi, du geste technique au concours le plus convivial.', tags: ['Putting', 'Drive', 'Approche'], image: IMG.games },
      { time: '12:30', day: 'Après-midi', title: 'Rencontres B2B', desc: 'Déjeuner et temps de networking avec les partenaires, clients et décideurs présents sur place.', note: 'Le golf devient un espace d’échange naturel entre professionnels.', tags: ['Networking', 'Déjeuner', 'Partenaires'], image: IMG.b2b },
      { time: '15:00', day: 'Après-midi', title: 'Classement', desc: 'Derniers résultats, remise des prix et photo de groupe pour clôturer la journée dans la convivialité.', note: 'Un moment de célébration collective avant de se retrouver sur le green.', tags: ['Remise des prix', 'Photo de groupe'], image: IMG.ranking },
    ],
  },
  kribi: {
    event: 'Orange Golf Experience',
    city: 'Kribi',
    date: '13 – 14 mars 2027',
    intro: 'Deux jours de golf et de rencontres professionnelles avec les dirigeants, clients et partenaires d’Orange Business.',
    moments: [
      { time: '09:00', day: 'Jour 1', title: 'Découvrir le golf', desc: 'Accueil des invités, briefing et départ du tournoi scramble sur le parcours en bord de mer.', note: 'Deux jours qui s’ouvrent sur le parcours et sur la rencontre.', tags: ['Accueil', 'Briefing', 'Scramble'], image: IMG.discover },
      { time: '14:00', day: 'Jour 1', title: 'Les jeux', desc: 'Compétition sur 18 trous et défis annexes : concours de drive, d’approche et de putting.', note: 'Un savant mélange de performance et de plaisir de jeu.', tags: ['18 trous', 'Concours', 'Compétition'], image: IMG.games },
      { time: '10:00', day: 'Jour 2', title: 'Rencontres B2B', desc: 'Tables rondes et échanges professionnels au club-house avec les dirigeants et partenaires d’Orange Business.', note: 'Des conversations qui prolongent celles engagées sur le parcours.', tags: ['Tables rondes', 'Networking', 'Décideurs'], image: IMG.b2b },
      { time: '17:00', day: 'Jour 2', title: 'Classement', desc: 'Dîner de gala, proclamation du classement et remise des prix aux équipes gagnantes.', note: 'La journée se termine dans la fête et la convivialité.', tags: ['Dîner de gala', 'Remise des prix'], image: IMG.ranking },
    ],
  },
}

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
  const [still] = useState(prefersReducedMotion)
  useEffect(() => {
    const el = ref.current
    if (!el || still) return
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [still])
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
const BUTTON_VARIANTS = {
  lime: { base: 'bg-[#FF7900] text-[#000000]', sweep: 'bg-[#000000]', hover: 'text-[#FF7900]' },
  cream: { base: 'bg-[#FFFFFF] text-[#000000]', sweep: 'bg-[#000000]', hover: 'text-[#FFFFFF]' },
}
function Button({ children, variant = 'lime', href = '#join', className = '' }: { children: ReactNode; variant?: keyof typeof BUTTON_VARIANTS; href?: string; className?: string }) {
  const v = BUTTON_VARIANTS[variant]
  const ease = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
  return (
    <a href={href} className={`group/btn relative isolate inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full transition-[transform,box-shadow] duration-[450ms] ${ease} hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] active:scale-[0.97] ${v.base} ${className}`}>
      <span aria-hidden className={`absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-[550ms] ${ease} group-hover/btn:scale-x-100 ${v.sweep}`} />
      <span className="relative block overflow-hidden">
        <span className={`block transition-transform duration-[550ms] ${ease} group-hover/btn:-translate-y-[105%]`}>{children}</span>
        <span aria-hidden className={`absolute left-0 top-0 block w-full translate-y-[105%] transition-transform duration-[550ms] ${ease} group-hover/btn:translate-y-0 ${v.hover}`}>{children}</span>
      </span>
    </a>
  )
}
/* ---------- Panneau d'accueil (premier volet de la section) ---------- */
function IntroPanel({ programme, active, onChange, visible }: { programme: Programme; active: EventKey; onChange: (key: EventKey) => void; visible: boolean }) {
  return (
    <div className="relative flex h-[100svh] w-full flex-none items-center justify-center overflow-hidden bg-[#000000]">
      <img src={IMG.intro} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: visible ? 'scale(1.06)' : 'scale(1.12)', willChange: 'transform' }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.28)_45%,rgba(0,0,0,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.38)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[900px] flex-col items-center px-6 py-24 text-center" style={{ opacity: visible ? 1 : 0.3, transform: visible ? 'none' : 'scale(0.97)', transition: `opacity 800ms ${EASE}, transform 800ms ${EASE}` }}>
        <Reveal as="h2" className="text-[clamp(2.8rem,7vw,6rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
          <span className="block">{HEADING_1}</span>
          <span className="block">{HEADING_2}</span>
        </Reveal>
        <Reveal as="p" delay={150} className="mt-6 max-w-[640px] text-[18px] font-semibold leading-[1.5] text-[#FF7900] md:text-[21px]">{LEAD}</Reveal>
        <Reveal as="p" delay={280} className="mt-5 max-w-[560px] text-[15px] font-medium leading-[1.6] text-white/70 md:text-[17px]">{BODY}</Reveal>

        <Reveal delay={380} className="relative mt-9 inline-grid grid-cols-2 rounded-full border border-white/20 bg-white/[0.07] p-1 backdrop-blur-sm">
          <span className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ backgroundColor: '#FF7900', transform: active === 'kribi' ? 'translateX(100%)' : 'translateX(0)' }} />
          {(['douala', 'kribi'] as EventKey[]).map((key) => (
            <button key={key} type="button" onClick={() => onChange(key)} aria-pressed={active === key} className={`relative z-10 rounded-full px-6 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${active === key ? 'text-[#000000]' : 'text-white/60 hover:text-white'}`}>
              {PROGRAMMES[key].city}
            </button>
          ))}
        </Reveal>

        <Reveal delay={480} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Swap key={`${active}-ev`} className="text-[18px] font-medium">{programme.event} · {programme.city}</Swap>
          <Swap key={`${active}-date`} className={`text-[#FF7900] ${micro}`}>{programme.date}</Swap>
          <Swap key={`${active}-intro`} as="p" className="w-full max-w-[620px] text-[14px] leading-[1.6] text-white/55">{programme.intro}</Swap>
        </Reveal>
      </div>
    </div>
  )
}

/* ---------- Slide (panneau étape) ---------- */
function Slide({ moment, index, active }: { moment: Moment; index: number; active: boolean }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <div className="relative flex h-[100svh] w-full flex-none items-center justify-center overflow-hidden bg-[#000000]">
      <img
        src={moment.image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: active ? 'scale(1.06)' : 'scale(1.12)', willChange: 'transform' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.52)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.32)_100%)]" />

      <div
        className="relative mx-auto flex w-full max-w-[900px] flex-col items-center px-6 py-24 text-center"
        style={{
          opacity: active ? 1 : 0.3,
          transform: active ? 'none' : 'translateY(28px) scale(0.97)',
          filter: active ? 'none' : 'blur(4px)',
          transition: `opacity 800ms ${EASE}, transform 800ms ${EASE}, filter 800ms ${EASE}`,
          willChange: 'opacity, transform, filter',
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-semibold tracking-[0.3em] text-[#FF7900]">{num}</span>
          <span className="h-px w-10 bg-[#FF7900]/60" />
          <span className={`text-[#FFFFFF]/60 ${micro}`}>{moment.day}</span>
        </div>

        <h3 className="mt-6 text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">{moment.title}</h3>
        <p className="mt-6 max-w-[620px] text-[clamp(0.95rem,1.5vw,1.15rem)] leading-[1.6] text-white/75">{moment.desc}</p>
        <p className="mt-3 max-w-[600px] border-l-2 border-[#FF7900]/70 pl-4 text-left text-[14px] italic leading-[1.55] text-white/50 md:text-center md:border-l-0 md:pl-0">{moment.note}</p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-[#FF7900] px-4 py-1.5 text-[13px] font-bold text-[#000000]">{moment.time}</span>
          {moment.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/25 px-4 py-1.5 text-[12px] font-medium text-white/75 backdrop-blur-sm">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Évite de re-rendre les 4 panneaux à chaque frame de scroll (progress bar). */
const MemoSlide = memo(Slide)

/* ---------- Dernier volet : inscription ---------- */
function CtaPanel({ visible }: { visible: boolean }) {
  return (
    <div className="relative flex h-[100svh] w-full flex-none items-center justify-center overflow-hidden bg-[#000000] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,121,0,0.14),transparent_65%)]" />
      <div className="relative flex flex-col items-center" style={{ opacity: visible ? 1 : 0.3, transform: visible ? 'none' : 'translateY(28px) scale(0.97)', filter: visible ? 'none' : 'blur(4px)', transition: `opacity 800ms ${EASE}, transform 800ms ${EASE}, filter 800ms ${EASE}` }}>
        <h2 className="max-w-[760px] text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">Vivez le golf Orange.</h2>
        <p className="mt-6 max-w-[620px] text-[clamp(0.95rem,1.5vw,1.1rem)] leading-[1.65] text-white/65">{CTA_BODY}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button variant="lime" href="#contact" className="h-[58px] px-8 text-[15px] font-medium">S’inscrire à cet événement</Button>
          <Button variant="cream" href="#happening" className="h-[58px] px-8 text-[15px] font-medium">Voir les dates</Button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Une seule section : intro + 4 étapes + CTA dans un même swipe ---------- */
function ProgrammeExperience({ programme, active, onChange }: { programme: Programme; active: EventKey; onChange: (key: EventKey) => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const count = programme.moments.length + 2 // intro + étapes + CTA
  const labels = ['Introduction', ...programme.moments.map((m) => m.title), 'Inscription']

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const total = Math.max(el.offsetHeight - window.innerHeight, 1)
      const p = Math.min(Math.max(-rect.top / total, 0), 1)
      setProgress(p)
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
            <MemoSlide key={m.title} moment={m} index={i} active={index === i + 1} />
          ))}
          <CtaPanel visible={index === count - 1} />
        </div>

        {/* flèches desktop */}
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Volet précédent" className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#FF7900] hover:text-[#FF7900] disabled:pointer-events-none disabled:opacity-20 md:flex">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Volet suivant" className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:border-[#FF7900] hover:text-[#FF7900] disabled:pointer-events-none disabled:opacity-20 md:flex">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>

        {/* dots */}
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-2">
          {labels.map((label, i) => (
            <button key={label} type="button" onClick={() => go(i)} aria-label={`Aller à ${label}`} className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-[#FF7900]' : 'w-2 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>

        {/* barre de progression */}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/10">
          <div className="h-full bg-[#FF7900] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Section ---------- */
export default function Programs() {
  useGoogleFonts()
  const [active, setActive] = useState<EventKey>('douala')

  return (
    /* une seule section, sans overflow-hidden (qui casserait le sticky) */
    <section id="programs" className="relative w-full bg-[#000000] font-['Archivo',sans-serif] text-white antialiased">
      <ProgrammeExperience key={active} programme={PROGRAMMES[active]} active={active} onChange={setActive} />
    </section>
  )
}
