/**
 * Programs — programme des événements (onglets Douala / Kribi)
 * Intro plein écran puis panneaux : défilement horizontal dès 700 px,
 * empilement vertical sur téléphone uniquement.
 * Uses the template's animation primitives (Reveal, Swap).
 */
import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

import SlotCard from './SlotCard'
import { PROGRAMMES, type EventKey, type Moment, type Programme } from './programmes'

/* ---------- Fonts & images ---------- */
const INTRO_PHOTO = '/au_programme/Rendez-vous.webp'

/** Aperçus flous (16×9, < 200 octets) pour éviter toute zone vide pendant le chargement. */
const BLUR: Record<string, string> = {
  '/au_programme/Rendez-vous.webp': 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoQAAkAAwBSJbACdAYqrZby2gAA+OWyipIrbzUF/CXnbBZBs9CKnRoSUGgBL8fvdXs8hJoFH/RnZZwan7QfGTJ9vuekehyHh7hvcb/PgAA=',
  '/au_programme/classement.webp': 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADwAQCdASoQAAkAAwBSJYgCdAYt9ZmuMoAA/bZLDjXU4Xa+G2AtTk3IBPbD3Fo4446FnNrajbOjCAPoMjbGu1yRxz8I7Jk/8Q/Rds1IlGDUKtddgroBT/SkyIYTM/sPHIlJ94AA',
  '/au_programme/echange_pro.webp': 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAAAQAgCdASoQAAkAAwBSJZACdAYtpaaTgagAAP4Hh7uPEYLL1z7wSFkHU2pwt5Q3NzqKEh8+cDdjGHXvsmLsefs9GO4XabuJbGcmRQzQqHfZeTXC3gIbkd7tRDxq/ge5OxuLdb5CcM2ofTkjkYCHOYwA',
  '/au_programme/golf_rencontre.webp': 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQAgCdASoQAAkAAwBSJbACdAYq1NNTgawAAP64H97iY5HE4sOTHwy1Sdjcyf6WVPfBhu4MYy75z/iU1cdM5nSsipVhTzwMZrGSiWCpalf0DU1AlOUqoAAA',
  '/au_programme/golfeur.webp': 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoQAAkAAwBSJagCdAEI6/WfAAD+1yzbOROBMFELYXEPn8NdecL7aAsv1EAalCnzcHtfwhAckJT6CkNBaLI7hcxdgAA=',
}

/* ---------- Content ---------- */
const HEADING_1 = 'Le déroulé'
const HEADING_2 = 'de nos journées.'
const LEAD = 'Choisissez votre ville pour découvrir les activités, de l’accueil des participants à la remise des prix.'

const micro = 'text-[12px] font-medium uppercase leading-[1.3]'

/* ---------- Template primitives ---------- */
const EASE = 'cubic-bezier(0.16,1,0.3,1)'
function prefersReducedMotion() { return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches }
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

/** Bascule l'expérience en horizontal dès 700 px ; au-dessous, cartes empilées. */
function useWideLayout() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 700px)')
    const sync = () => setWide(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  return wide
}

/**
 * Image de fond avec le léger zoom du Hero, relancée à chaque entrée dans l'écran.
 * `next/image` sert une variante adaptée à la taille réelle et au DPR de l'écran.
 */
function ZoomImage({ src, alt, sizes, eager = false }: { src: string; alt: string; sizes: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let animation: Animation | null = null
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animation?.cancel()
        animation = el.animate(
          [{ transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
          { duration: 22000, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' },
        )
      } else {
        animation?.cancel()
        animation = null
      }
    }, { threshold: 0.45 })
    io.observe(el)
    return () => { io.disconnect(); animation?.cancel() }
  }, [])
  return (
    <div ref={ref} className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={82}
        placeholder={BLUR[src] ? 'blur' : 'empty'}
        blurDataURL={BLUR[src]}
        loading={eager ? 'eager' : 'lazy'}
        className="object-cover"
      />
    </div>
  )
}

/* ---------- Panneau d'accueil (grand écran) ---------- */
function IntroPanel({ programme, active, onChange, visible }: { programme: Programme; active: EventKey; onChange: (key: EventKey) => void; visible: boolean }) {
  return (
    <div inert={!visible} className="relative isolate flex h-[100svh] w-full flex-none items-center justify-center overflow-hidden bg-[#000000]">
      <ZoomImage src={INTRO_PHOTO} alt="Joueurs réunis sur le parcours d’un rendez-vous Orange Golf" sizes="100vw" eager />
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

      </div>
    </div>
  )
}

/** Numéro de chapitre en filigrane : décoratif, non annoncé aux lecteurs d’écran. */
function Watermark({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span aria-hidden className={`program-watermark pointer-events-none select-none font-extrabold leading-none tracking-[-0.08em] text-white/[0.05] ${className}`}>
      {String(n).padStart(2, '0')}
    </span>
  )
}

/* ---------- Slide plein écran (grand écran) ---------- */
function Slide({ moment, date, active, number, eager = false }: { moment: Moment; date: string; active: boolean; number: number; eager?: boolean }) {
  return (
    <div inert={!active} className="relative isolate flex h-[100svh] w-full flex-none items-center justify-center overflow-hidden bg-[#000000]">
      <ZoomImage src={moment.image} alt={`Illustration du temps fort : ${moment.title}`} sizes="100vw" eager={eager} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.14)_50%,rgba(0,0,0,0.46)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.04)_32%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_54%,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0)_76%)]" />
      <Watermark n={number} className="absolute right-[3%] top-[47%] -translate-y-1/2 text-[clamp(12rem,26vw,26rem)]" />

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

/* ---------- Cartes verticales (tablette / mobile) ---------- */
const CARD_SIZES = '(min-width: 768px) 720px, calc(100vw - 2.5rem)'

function StackedIntro({ programme, active, onChange }: { programme: Programme; active: EventKey; onChange: (key: EventKey) => void }) {
  const stats = [
    { k: '2', l: 'rendez-vous' },
    { k: '4', l: 'temps forts' },
    { k: active === 'kribi' ? '2' : '1', l: active === 'kribi' ? 'jours de jeu' : 'jour de jeu' },
  ]
  return (
    <div className="relative overflow-hidden px-5 pb-10 pt-20 md:px-8 md:pb-14 md:pt-24">
      <div className="mx-auto w-full max-w-[760px]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#FF7900]">Programme · {programme.city}</p>
        <h2 className="mt-3 text-[clamp(2rem,9vw,3.4rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
          <span className="block">{HEADING_1}</span>
          <span className="block text-[#FF7900]">{HEADING_2}</span>
        </h2>
        <p className="mt-4 max-w-[560px] text-[15px] leading-[1.6] text-white/75 md:text-[17px]">{LEAD}</p>

        <div className="relative mt-7 inline-grid grid-cols-2 rounded-full border border-white/20 bg-white/[0.06] p-1 backdrop-blur-md">
          <span className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#FF7900] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: active === 'kribi' ? 'translateX(100%)' : 'translateX(0)' }} />
          {(['douala', 'kribi'] as EventKey[]).map((key) => (
            <button key={key} type="button" onClick={() => onChange(key)} aria-pressed={active === key} className={`relative z-10 rounded-full px-6 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${active === key ? 'text-[#000000]' : 'text-white/80 hover:text-white'}`}>
              {PROGRAMMES[key].city}
            </button>
          ))}
        </div>

        <div className="relative mt-8" style={{ perspective: '1400px' }}>
          <div aria-hidden className="absolute -inset-x-5 -top-8 bottom-2 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,121,0,0.18),transparent_70%)]" />
          <article className="program-card relative overflow-hidden rounded-[26px] border border-white/12 bg-[#0B0B0B]">
            <div className="relative aspect-video overflow-hidden">
              <ZoomImage src={INTRO_PHOTO} alt="Joueurs réunis sur le parcours d’un rendez-vous Orange Golf" sizes={CARD_SIZES} eager />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.12)_55%,rgba(0,0,0,0.82)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-5">
                <p className="text-[16px] font-semibold text-white md:text-[18px]">{programme.event} · {programme.city}</p>
                <p className="rounded-full bg-[#FF7900] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[#000000]">{programme.date}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10">
              {stats.map((s) => (
                <div key={s.l} className="px-2 py-3 text-center">
                  <span className="block text-[19px] font-bold leading-none text-[#FF7900]">{s.k}</span>
                  <span className="mt-1.5 block text-[12px] font-medium uppercase tracking-[0.08em] text-white/75">{s.l}</span>
                </div>
              ))}
            </div>
            <p className="px-5 py-4 text-[14px] leading-[1.6] text-white/70 md:px-6">{programme.intro}</p>
          </article>
        </div>
      </div>
    </div>
  )
}

function StackedSlide({ moment, date, number, eager = false }: { moment: Moment; date: string; number: number; eager?: boolean }) {
  return (
    <div className="relative overflow-hidden px-5 py-7 md:px-8 md:py-10">
      <div className="relative mx-auto w-full max-w-[760px]" style={{ perspective: '1400px' }}>
        <div aria-hidden className="absolute -inset-x-5 -top-6 bottom-2 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,121,0,0.12),transparent_70%)]" />
        <article className="program-card relative overflow-hidden rounded-[26px] border border-white/12 bg-[#0B0B0B]">
          <div className="relative aspect-video overflow-hidden">
            <ZoomImage src={moment.image} alt={`Illustration du temps fort : ${moment.title}`} sizes={CARD_SIZES} eager={eager} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.12)_55%,rgba(0,0,0,0.72)_100%)]" />
            <p className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              {moment.day} · {moment.time.replace(':', ' h ')}
            </p>
          </div>
          <Watermark n={number} className="absolute right-3 top-[26%] text-[clamp(7rem,26vw,11rem)]" />
          <div className="relative z-10 p-5 md:p-7">
            <h3 className="text-[clamp(1.75rem,7vw,2.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">{moment.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-white/75 md:text-[16px]">{moment.desc}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {moment.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[12px] font-medium text-white/75">{tag}</span>
              ))}
            </div>
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#FF7900]">{date}</p>
          </div>
        </article>
      </div>
    </div>
  )
}

function ProgrammeExperience({ programme, active, onChange }: { programme: Programme; active: EventKey; onChange: (key: EventKey) => void }) {
  const wide = useWideLayout()
  const wrap = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = programme.moments.length + 1
  const labels = ['Introduction', ...programme.moments.map((m) => m.title)]

  useEffect(() => {
    if (!wide) return
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
  }, [count, wide])

  const go = (i: number) => {
    const el = wrap.current
    if (!el) return
    const total = Math.max(el.offsetHeight - window.innerHeight, 1)
    const top = el.getBoundingClientRect().top + window.scrollY + (i / Math.max(count - 1, 1)) * total
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  /* Téléphone (< 700 px) : cartes verticales, sans boutons ni numérotation. */
  if (!wide) {
    return (
      <div className="flex w-full flex-col bg-[#050505]">
        <StackedIntro programme={programme} active={active} onChange={onChange} />
        {programme.moments.map((m, i) => (
          <StackedSlide key={m.title} moment={m} date={programme.date} number={i + 1} eager={i === 0} />
        ))}
      </div>
    )
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
            <Slide key={m.title} moment={m} date={programme.date} number={i + 1} active={index === i + 1} eager={i === 0} />
          ))}
        </div>

        {/* Repères de progression : pas de boutons précédent / suivant. */}
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-2">
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
    <section id="programs" className="relative w-full bg-[#000000] font-archivo text-white antialiased">
      <span id="programme-douala" aria-hidden className="absolute top-0" />
      <span id="programme-kribi" aria-hidden className="absolute top-0" />
      <ProgrammeExperience key={active} programme={PROGRAMMES[active]} active={active} onChange={changeProgramme} />
    </section>
  )
}
