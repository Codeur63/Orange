/**
 * Footer — navigation, liens utiles, coordonnées Orange Golf, grand wordmark, pastilles
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type MouseEvent, type ReactNode, type SVGProps } from 'react'
import { CONSENT_OPEN_EVENT } from '@/lib/consent'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'

/* ---------- Content ---------- */
/** Uniquement des ancres qui existent réellement dans la page. */
const NAV = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À propos', href: '#about' },
  { label: 'Agenda', href: '#happening' },
  { label: 'Programme', href: '#programs' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Inscription', href: '#levels' },
]
const WEATHER = 'Douala \\ Kribi \\ Cameroun'
const CLUBHOUSE = { title: 'Orange Golf Cameroun', lines: ['Douala · Golf Open Day', 'Kribi · Orange Golf Experience'] }
const COPYRIGHT = '© 2026 Orange Golf Cameroun. Tous droits réservés.'
const YEAR = '2026'

const name = 'text-[20px] font-medium leading-[1.25] tracking-[-0.01em]'
const small = 'text-[15px] leading-[1.45] tracking-[-0.003em]'

const toTop = (e: MouseEvent) => {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function FooterDesktop() {
  return (
    <Artboard height={730} className="bg-[#FF7900]">
      <footer className="relative m-5 mx-auto max-w-[1400px] rounded-xl bg-[#FF7900] text-[#0B0B0B]">
        <ul style={at(48, 60, 130)} className="flex flex-col gap-[18px]">
          {NAV.map((l, i) => (
            <Reveal as="li" key={l.label} delay={i * 70}>
              <TextLink href={l.href} className={`${name} whitespace-nowrap hover:text-[#FFFFFF]`}>{l.label}</TextLink>
            </Reveal>
          ))}
        </ul>

        <Reveal style={at(570, 60, 300)} delay={120} className="flex flex-col items-center text-center">
          <span className="text-[12px] font-semibold uppercase leading-[1.3] tracking-[0.08em]">{WEATHER}</span>
          <span className="h-[84px]" />
          <span className="text-[17px] font-semibold leading-[1.45] tracking-[-0.005em]">{CLUBHOUSE.title}</span>
          <span className="h-[10px]" />
          <p className={`opacity-70 ${small}`}>
            {CLUBHOUSE.lines.map((l) => <span key={l} className="block">{l}</span>)}
          </p>
        </Reveal>

        <Reveal style={at(1090, 60, 310)} delay={180} className="flex flex-col items-end gap-3">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] opacity-70">Inscription</span>
          <a
            href="#levels"
            className="group/cta inline-flex h-[52px] items-center gap-3 rounded-full bg-[#000000] px-6 text-[15px] font-semibold text-[#FFFFFF] transition-colors duration-300 hover:bg-[#FFFFFF] hover:text-[#000000]"
          >
            S’inscrire à l’événement
            <span aria-hidden className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
          </a>
        </Reveal>

        <div style={at(48, 330, 1344, 1)} className="bg-[#000000]/20" />
        <p style={at(48, 354)} className={`whitespace-nowrap opacity-75 ${small}`}>{COPYRIGHT}</p>
        <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} style={at(980, 354, 220)} className={`text-left opacity-75 underline-offset-4 hover:opacity-100 hover:underline ${small}`}>
          Gérer les cookies
        </button>
        <a href="#hero" onClick={toTop} style={at(1244, 354, 100)} className={`group text-right opacity-75 transition-opacity hover:opacity-100 ${small}`}>
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">Retour en haut</span>
        </a>

        <Reveal style={at(50, 420, 62, 62)}>
          <GolfBall size={62} color="#000000" dimpleColor="#FF7900" />
        </Reveal>
        <Reveal
          as="p"
          delay={150}
          style={{ ...at(136, 382, 1060, 290), fontSize: 362, lineHeight: '80%', letterSpacing: '-0.06em' }}
          className="whitespace-nowrap font-bold"
          aria-hidden
        >
          GOLF
        </Reveal>
        <span style={at(66, 644, 25, 46)} className={`flex items-center justify-center opacity-80 ${name}`}>
          <span className="-rotate-90 whitespace-nowrap">{YEAR}</span>
        </span>
      </footer>
    </Artboard>
  )
}

function FooterMobile() {
  return (
    <footer className="m-5 mx-auto max-w-[1400px] rounded-xl bg-[#FF7900] px-5 pb-10 pt-12 text-[#0B0B0B]">
      <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em]">{WEATHER}</p>
      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
        {NAV.map((l) => <li key={l.label}><a href={l.href} className={name}>{l.label}</a></li>)}
      </ul>
      <a
        href="#levels"
        className="mt-8 inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[#000000] px-6 text-[15px] font-semibold text-[#FFFFFF]"
      >
        S’inscrire à l’événement <span aria-hidden>→</span>
      </a>
      <div className="mt-9 text-center">
        <p className="text-[17px] font-semibold">{CLUBHOUSE.title}</p>
        <p className={`mt-2 opacity-70 ${small}`}>
          {CLUBHOUSE.lines.map((l) => <span key={l} className="block">{l}</span>)}
        </p>
      </div>
      <Reveal className="mt-10 flex items-start gap-2">
        <GolfBall size={28} color="#000000" dimpleColor="#FF7900" className="mt-3 shrink-0" />
        <p className="text-[26vw] font-bold leading-[0.8] tracking-[-0.06em]" aria-hidden>GOLF</p>
      </Reveal>
      <div className="mt-6 h-px bg-[#000000]/20" />
      <div className={`mt-4 flex flex-col gap-2 opacity-75 sm:flex-row sm:items-center sm:justify-between ${small} !text-[13px]`}>
        <span>{COPYRIGHT}</span>
        <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className="underline-offset-4 hover:underline">Gérer les cookies</button>
        <a href="#hero" onClick={toTop}>Retour en haut</a>
      </div>
    </footer>
  )
}

export default function Footer() {
  return <Responsive desktop={<FooterDesktop />} mobile={<FooterMobile />} />
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

/** Outline pill with a micro uppercase label (Figma "Chip/Outline"). */
function Chip({ children, tone = 'dark', className = '' }: { children: ReactNode; tone?: 'dark' | 'light'; className?: string }) {
  const c =
    tone === 'dark'
      ? 'border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF]'
      : 'border-[#FFFFFF]/55 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000]'
  return (
    <span className={`inline-flex h-[34px] items-center whitespace-nowrap rounded-full border px-[14px] text-[12px] font-medium uppercase leading-[1.3] transition-colors duration-300 ${c} ${className}`}>
      {children}
    </span>
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

const BALL_DIMPLES = [
  [22, 14], [36, 13], [46, 24], [14, 26], [28, 25], [39, 35], [20, 38], [50, 38], [30, 47], [42, 47],
]
/** Golf ball mark for the footer: solid disc with cut-out dimples. */
function GolfBall({ size = 28, color = '#000000', dimpleColor = '#FF7900', className = '' }: { size?: number; color?: string; dimpleColor?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden>
      <circle cx="30" cy="30" r="29" fill={color} />
      {BALL_DIMPLES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill={dimpleColor} />
      ))}
    </svg>
  )
}