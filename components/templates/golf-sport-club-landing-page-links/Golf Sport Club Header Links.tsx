/**
 * Hero — fixed navbar (desktop + mobile menu), hero photo with wordmark, event card, intro, socials, marquee
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode, type SVGProps } from 'react'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'
const HERO_PHOTO = '/Header.png'
const EVENT_PHOTO = 'https://cdn.jiro.build/Golf/a1.png'

/* ---------- Content ---------- */
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Shop', href: '#shop' },
  { label: 'Inscription', href: '#levels' },
  { label: 'Agenda', href: '#happening' },
  { label: 'Facilities', href: '#programs' },
  { label: 'Galerie', href: '#gallery' },
]
const EVENT = { dates: 'October 24–25', city: 'Napa', title: 'Autumn Classic', image: EVENT_PHOTO, href: '#events' }
const COORDS = '38° 17′ 49″ – 122° 17′ 9″ W'
const EST = 'EST.98'
const INTRO = 'Deux jours de golf et de rencontres pour les dirigeants, clients et partenaires d’Orange Business.'
const SOCIALS = [
  { label: 'X', href: '#', Icon: XIcon },
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'LinkedIn', href: '#', Icon: LinkedinIcon },
]

const HERO_H = 613
const MARQUEE_H = 78
const ICON_CIRCLE =
  'transition-[background-color,color,border-color,transform] duration-300 hover:-translate-y-[2px] hover:border-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000]'
const LABEL_M = 'text-[17px] font-medium leading-[1.3] tracking-[-0.005em]'
/** If an image link fails, hide the broken-image icon (the tile colour shows instead). */
const hideBroken = (e: { currentTarget: HTMLImageElement }) => (e.currentTarget.style.visibility = 'hidden')

/* ---------- Navbar ---------- */
/** Hides while scrolling down, comes back when scrolling up. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setHidden(y > 240 && y > last)
      last = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return hidden
}

/** Fixed bar outside the artboard (transforms break position: fixed), scaled on its own from the top centre. */
function DesktopNav() {
  const s = useDesignScale()
  const hidden = useHideOnScroll()
  return (
    <div
      className="site-header pointer-events-none fixed left-1/2 top-0 z-50 transition-transform duration-500 ease-out"
      style={{ width: FRAME_W, transform: `translateX(-50%) scale(${s}) ${hidden ? 'translateY(-120%)' : ''}`, transformOrigin: 'center top' }}
    >
      <div style={{ width: FIGMA_W, transform: `scale(${FIT})`, transformOrigin: 'left top' }}>
        <nav aria-label="Main" className="pointer-events-auto relative ml-[24px] mt-[16px] flex h-[64px] w-[1392px] items-center justify-between rounded-[14px] bg-[#000000] pl-[22px] pr-[10px]">
          <Logo />
          <ul className="absolute left-[468.5px] top-[21px] flex gap-[44px]">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <TextLink href={l.href} className={`${LABEL_M} text-[#FFFFFF]`}>{l.label}</TextLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-[18px]">
            <TextLink href="#login" underlined className={`${LABEL_M} text-[#FFFFFF]`}>Log In</TextLink>
            <button aria-label="Search" className={`flex h-[44px] w-[44px] items-center justify-center rounded-full border-[1.2px] border-[#FFFFFF]/60 text-[#FFFFFF] ${ICON_CIRCLE}`}>
              <SearchIcon />
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)
  const hidden = useHideOnScroll()
  return (
    <div className={`site-header fixed inset-x-3 top-3 z-50 transition-transform duration-500 ${hidden && !open ? '-translate-y-[130%]' : ''}`}>
      <nav aria-label="Main" className="rounded-[14px] bg-[#000000] px-4 text-[#FFFFFF] shadow-lg">
        <div className="flex h-14 items-center justify-between">
          <Logo className="!text-[26px]" />
          <div className="flex items-center gap-2">
            <button aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FFFFFF]/60">
              <SearchIcon size={18} />
            </button>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF7900] text-[#000000]"
            >
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
        <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <ul className="overflow-hidden">
            {NAV_LINKS.map((l, i) => (
              <li key={l.label} className="border-t border-[#FFFFFF]/15 first:mt-1">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-[22px] font-medium tracking-[-0.02em] transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                  style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="flex items-center justify-between border-t border-[#FFFFFF]/15 py-4">
              <a href="#login" className="text-[17px] font-medium underline underline-offset-4">Log In</a>
              <a href="#join" className="rounded-full bg-[#FF7900] px-5 py-2.5 text-[15px] font-medium text-[#000000]">Join the Club</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

/* ---------- Hero ---------- */
function HeroDesktop() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#000000]">
      <img
        src={HERO_PHOTO}
        alt="Orange Golf Experience — golfeur sur le parcours de Kribi"
        className="hero-zoom absolute inset-0 h-full w-full object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.48)_45%,rgba(0,0,0,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_32%,rgba(0,0,0,0.8)_100%)]" />

      {/* subtle orange glow for depth */}
      <div className="hero-fade-in pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#FF7900]/20 blur-[120px]" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 py-28 md:px-10">
        <p className="hero-fade-up text-[13px] font-semibold uppercase tracking-[0.3em] text-[#FF7900]" style={{ animationDelay: '0.1s' }}>
          Orange Business · Cameroun
        </p>

        <h1 className="hero-fade-up mt-5 max-w-[900px] text-[clamp(2.9rem,7vw,7rem)] font-bold leading-[0.92] tracking-[-0.04em] text-white" style={{ animationDelay: '0.28s' }}>
          Orange Golf<br />Experience<span className="text-[#FF7900]">.</span>
        </h1>

        <p className="hero-fade-up mt-7 max-w-[560px] text-[17px] font-medium leading-[1.55] text-white/85 md:text-[19px]" style={{ animationDelay: '0.48s' }}>
          {INTRO}
        </p>

        <div className="hero-fade-up mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.68s' }}>
          <Button variant="lime" href="#programs" className="h-[58px] px-8 text-[16px] leading-[1.3] tracking-[-0.01em]">Découvrir l’événement</Button>
          <a href="#about" className="inline-flex h-[58px] items-center gap-2 rounded-full border border-white/40 px-7 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-white/10">
            En savoir plus
          </a>
        </div>

        <div className="hero-fade-up mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6" style={{ animationDelay: '0.88s' }}>
          {[
            { v: '2', l: 'jours de golf' },
            { v: 'Kribi', l: 'Cameroun' },
            { v: 'B2B', l: 'dirigeants & partenaires' },
          ].map((s) => (
            <div key={s.l} className="flex items-baseline gap-3">
              <span className="text-[26px] font-bold text-[#FF7900]">{s.v}</span>
              <span className="text-[12px] uppercase tracking-[0.14em] text-white/60">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* scroll hint */}
      <div className="hero-fade-in pointer-events-none absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" style={{ animationDelay: '1.1s' }}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Défiler</span>
        <span className="hero-scroll block h-6 w-px bg-white/60" />
      </div>

      <div className="relative w-full">
        <Marquee />
      </div>
    </section>
  )
}

function HeroMobile() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#000000]">
      <img src={HERO_PHOTO} alt="Orange Golf Experience" className="hero-zoom absolute inset-0 h-full w-full object-cover object-[66%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.35)_42%,rgba(0,0,0,0.95)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-16 pt-32">
        <span className="hero-fade-up inline-flex w-fit items-center rounded-full bg-[#FF7900] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#000000]" style={{ animationDelay: '0.08s' }}>
          Orange Business
        </span>
        <h1 className="hero-fade-up mt-5 text-[clamp(2.6rem,12vw,4.6rem)] font-bold leading-[0.94] tracking-[-0.04em] text-white" style={{ animationDelay: '0.24s' }}>
          Orange Golf<br />Experience<span className="text-[#FF7900]">.</span>
        </h1>
        <p className="hero-fade-up mt-6 max-w-[360px] text-[15px] font-medium leading-[1.55] text-white/85" style={{ animationDelay: '0.44s' }}>
          {INTRO}
        </p>
        <div className="hero-fade-up mt-8" style={{ animationDelay: '0.64s' }}>
          <Button variant="lime" href="#programs" className="h-[56px] px-7 text-[16px] font-medium">Découvrir l’événement</Button>
        </div>
      </div>

      <div className="relative w-full">
        <Marquee height={56} size={18} />
      </div>
    </section>
  )
}

export default function Hero() {
  return (
    <Responsive
      desktop={
        <>
          <DesktopNav />
          <HeroDesktop />
        </>
      }
      mobile={
        <>
          <MobileNav />
          <HeroMobile />
        </>
      }
    />
  )
}

/* ------------------------------------------------------------------
   Section-local helpers — kept in this file so the section is 100% self-contained
   ------------------------------------------------------------------ */

/* Desktop frame: 1600px wide. The Figma frames are 1440px, so the Figma numbers are kept as-is
   inside a 1440 layer that is fitted to the 1600 frame (×1600/1440). Scale = clientWidth / 1600. */
const FRAME_W = 1600
const FIGMA_W = 1440
const FIT = FRAME_W / FIGMA_W
/** Max rendered width of the content. Section backgrounds stay full-bleed. */
const CONTENT_MAX = 1400

function useViewportWidth() {
  const read = () => (typeof document === 'undefined' ? FRAME_W : document.documentElement.clientWidth)
  const [w, setW] = useState(FRAME_W)
  useEffect(() => {
    const on = () => setW(read())
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

function useDesignScale() {
  return Math.min(useViewportWidth(), CONTENT_MAX) / FRAME_W
}

function useIsDesktop() {
  return useViewportWidth() >= 768
}

/** Absolute position with the exact Figma numbers. */
function at(left: number, top: number, width?: number, height?: number): CSSProperties {
  return { position: 'absolute', left, top, width, height }
}

/** Fixed 1600px frame (height = Figma height × 1600/1440), scaled to the viewport width. Children use Figma (1440) coordinates. */
function Artboard({ height, className = '', id, children }: { height: number; className?: string; id?: string; children: ReactNode }) {
  const s = useDesignScale()
  const frameH = height * FIT
  return (
    <section id={id} className={`relative w-full overflow-hidden ${className}`} style={{ height: frameH * s }}>
      <div className="absolute left-1/2 top-0" style={{ width: FRAME_W, height: frameH, transform: `translateX(-50%) scale(${s})`, transformOrigin: 'center top' }}>
        <div className="relative" style={{ width: FIGMA_W, height, transform: `scale(${FIT})`, transformOrigin: 'left top' }}>
          {children}
        </div>
      </div>
    </section>
  )
}

/** Picks the desktop artboard or the mobile layout, loads the fonts and sets the base font + colour. */
function Responsive({ desktop, mobile }: { desktop: ReactNode; mobile: ReactNode }) {
  useGoogleFonts()
  return <div className="font-['Archivo',sans-serif] text-[#000000] antialiased">{useIsDesktop() ? desktop : mobile}</div>
}

/** Adds the Google Fonts stylesheet to <head> once. */
function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_URL
    document.head.appendChild(link)
  }, [])
}

const EASE = 'cubic-bezier(0.16,1,0.3,1)'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Rise + scale + blur-in; replays every time the element re-enters the viewport. */
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
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(64px) scale(0.96)',
        filter: on ? 'none' : 'blur(12px)',
        transition: still ? 'none' : `opacity 1100ms ${EASE} ${delay}ms, transform 1100ms ${EASE} ${delay}ms, filter 1100ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

const BUTTON_VARIANTS = {
  lime: { base: 'bg-[#FF7900] text-[#000000]', sweep: 'bg-[#000000]', hover: 'text-[#FF7900]' },
  cream: { base: 'bg-[#FFFFFF] text-[#000000]', sweep: 'bg-[#000000]', hover: 'text-[#FFFFFF]' },
  pine: { base: 'bg-[#000000] text-[#FFFFFF]', sweep: 'bg-[#FF7900]', hover: 'text-[#000000]' },
}

/** Pill button: fill sweeps in from the left, label rolls up, button lifts; shrinks on click. */
function Button({ children, variant = 'lime', href = '#join', className = '' }: { children: ReactNode; variant?: keyof typeof BUTTON_VARIANTS; href?: string; className?: string }) {
  const v = BUTTON_VARIANTS[variant]
  const ease = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
  return (
    <a
      href={href}
      className={`group/btn relative isolate inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full transition-[transform,box-shadow] duration-[450ms] ${ease} hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] active:scale-[0.97] ${v.base} ${className}`}
    >
      <span aria-hidden className={`absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-[550ms] ${ease} group-hover/btn:scale-x-100 ${v.sweep}`} />
      <span className="relative block overflow-hidden">
        <span className={`block transition-transform duration-[550ms] ${ease} group-hover/btn:-translate-y-[105%]`}>{children}</span>
        <span aria-hidden className={`absolute left-0 top-0 block w-full translate-y-[105%] transition-transform duration-[550ms] ${ease} group-hover/btn:translate-y-0 ${v.hover}`}>
          {children}
        </span>
      </span>
    </a>
  )
}

/** Link whose underline grows from the left on hover. `underlined` keeps a resting underline (Figma style). */
function TextLink({ children, href = '#', className = '', underlined = false }: { children: ReactNode; href?: string; className?: string; underlined?: boolean }) {
  const grow =
    'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[length:100%_1px]'
  const rest = 'underline decoration-1 underline-offset-[0.14em] hover:decoration-2'
  return (
    <a href={href} className={`inline-block ${underlined ? rest : grow} ${className}`}>
      {children}
    </a>
  )
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#hero" aria-label="Orange Golf — accueil" className={`inline-flex items-center gap-[8px] text-[26px] font-bold leading-none tracking-[-0.04em] ${className}`}>
      <span className="inline-block h-[18px] w-[18px] rounded-[3px] bg-[#FF7900]" />
      <span className="text-[#FFFFFF]">orange</span>
    </a>
  )
}

const MARQUEE_ITEMS = ['Orange Golf Experience', 'Deux jours de golf & de rencontres', 'Kribi · Cameroun', 'Orange Business']

/** Dark ticker strip. Content is repeated `copies` times and slid by one copy (Web Animations API); pauses on hover. */
function Marquee({ height = 78, size = 26, reverse = false, offset = 43, copies = 2, duration = 38000 }: { height?: number; size?: number; reverse?: boolean; offset?: number; copies?: number; duration?: number }) {
  const track = useRef<HTMLDivElement>(null)
  const anim = useRef<Animation>()
  useEffect(() => {
    if (!track.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    anim.current = track.current.animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${100 / copies}%)` }], {
      duration,
      iterations: Infinity,
      direction: reverse ? 'reverse' : 'normal',
    })
    return () => anim.current?.cancel()
  }, [copies, duration, reverse])
  const icon = Math.round(size * 0.846)
  const gap = Math.round(size * 1.31)
  const set = (k: number) => (
    <div key={k} className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }}>
      {MARQUEE_ITEMS.map((t) => (
        <Fragment key={t}>
          <span className="whitespace-nowrap font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#FFFFFF]" style={{ fontSize: size }}>
            {t}
          </span>
          <CopyrightIcon size={icon} color="#FF7900" className="shrink-0" />
        </Fragment>
      ))}
    </div>
  )
  return (
    <div
      className="relative flex w-full items-center overflow-hidden bg-[#000000]"
      style={{ height }}
      aria-label={MARQUEE_ITEMS.join(' ')}
      onMouseEnter={() => anim.current?.pause()}
      onMouseLeave={() => anim.current?.play()}
    >
      <div ref={track} className="flex w-max" style={{ marginLeft: -offset * (size / 26) }} aria-hidden>
        {Array.from({ length: copies }, (_, k) => set(k))}
      </div>
    </div>
  )
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number; stroke?: number }

function CopyrightIcon({ size = 22, stroke, color = 'currentColor', ...p }: IconProps & { color?: string }) {
  const sw = stroke ?? size * 0.1167
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" {...p}>
      <circle cx="30" cy="30" r="24" stroke={color} strokeWidth={(sw * 60) / size} />
      <path d="M38.5 24.5a10 10 0 1 0 0 11" stroke={color} strokeWidth={(sw * 60) / size} />
    </svg>
  )
}

function InstagramIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.42" {...p}>
      <rect x="3.33" y="3.33" width="13.33" height="13.33" rx="3.6" />
      <circle cx="10" cy="10" r="3.17" />
      <circle cx="13.9" cy="6.1" r=".9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedinIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" {...p}>
      <path d="M6.2 8.4V15M6.2 5.2v.1M9.6 15V8.4M9.6 11.2c0-1.6 1.1-2.8 2.5-2.8s2.2 1 2.2 2.6V15" />
    </svg>
  )
}

function SearchIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <circle cx="9.2" cy="9.2" r="5.4" />
      <path d="M13.3 13.3 16.7 16.7" />
    </svg>
  )
}

function XIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" {...p}>
      <path d="M4.2 3.75h3.6l8 12.5h-3.6z" />
      <path d="M15.5 3.75 10.9 9M9.1 11.1l-4.6 5.15" />
    </svg>
  )
}