/**
 * Hero — fixed navbar (desktop + mobile menu), hero photo with wordmark, event card, intro, socials, marquee
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode, type SVGProps } from 'react'

import { PROGRAMMES } from './programmes'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'
const HERO_PHOTO = '/Header.webp'

/* ---------- Content ---------- */
const NAV_LINKS = [
  { label: 'À propos', href: '#about' },
  { label: 'Agenda', href: '#happening' },
  { label: 'Programme', href: '#programs' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Inscription', href: '#levels' },
]
const COORDS = '38° 17′ 49″ – 122° 17′ 9″ W'
const EST = 'EST.98'

const HERO_H = 613
const MARQUEE_H = 78
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
        <nav aria-label="Navigation principale" className="pointer-events-auto relative ml-[24px] mt-[16px] flex h-[64px] w-[1392px] items-center justify-between rounded-[14px] bg-[#000000] px-[22px]">
          <Logo />
          <ul className="flex gap-[44px]">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <TextLink href={l.href} className={`${LABEL_M} text-[#FFFFFF]`}>{l.label}</TextLink>
              </li>
            ))}
          </ul>
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
      <nav aria-label="Navigation principale" className="rounded-[14px] bg-[#000000] px-4 text-[#FFFFFF] shadow-lg">
        <div className="flex h-14 items-center justify-between">
          <Logo className="!text-[26px]" />
          <button
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-controls="golf-mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF7900] text-[#000000]"
          >
            <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
            <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
          </button>
        </div>
        <div id="golf-mobile-menu" inert={!open} className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
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
          </ul>
        </div>
      </nav>
    </div>
  )
}

/* ---------- Hero ---------- */
function EventHero() {
  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black text-white">
      <img src={HERO_PHOTO} alt="Golfeur sur un parcours lors d’un événement Orange Golf au Cameroun" fetchPriority="high" decoding="async" className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/65 to-black/95" />
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-14 pt-28 md:px-10 md:py-32">
        <h1 className="hero-fade-up max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em]">
          Orange Golf Cameroun
        </h1>
        <div className="mt-9 grid gap-7 md:mt-14 md:grid-cols-2 md:gap-10">
          {(['kribi', 'douala'] as const).map((key) => {
            const { city, date, event, intro } = PROGRAMMES[key]
            return (
              <div key={key} className="flex flex-col items-start border-t border-white/40 pt-4 md:pt-6">
                <p className="text-sm font-semibold text-[#FF9A40]">{city} · {date}</p>
                <h2 className="mt-2 text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold leading-tight tracking-[-0.025em]">{event}</h2>
                <p className="mb-4 mt-2 max-w-[48ch] text-[15px] leading-relaxed text-white/90 md:text-base">{intro}</p>
                <a href={`#programme-${key}`} className="mt-auto inline-flex min-h-11 items-center font-semibold underline decoration-[#FF9A40] underline-offset-4 hover:text-[#FF9A40]">
                  Voir le programme de {city}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  return (
    <div className="font-['Archivo',sans-serif] antialiased">
      <Responsive desktop={<DesktopNav />} mobile={<MobileNav />} />
      <EventHero />
    </div>
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
function Button({ children, variant = 'lime', href = '#levels', className = '' }: { children: ReactNode; variant?: keyof typeof BUTTON_VARIANTS; href?: string; className?: string }) {
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

type IconProps = SVGProps<SVGSVGElement> & { size?: number; stroke?: number }



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

function XIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" {...p}>
      <path d="M4.2 3.75h3.6l8 12.5h-3.6z" />
      <path d="M15.5 3.75 10.9 9M9.1 11.1l-4.6 5.15" />
    </svg>
  )
}
