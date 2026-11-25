/**
 * Happening — tee-time intro, featured event photo, this week's events (click to select, + to add)
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode, type SVGProps } from 'react'

import SlotCard from './SlotCard'
import { PROGRAMMES, type EventKey } from './programmes'

/* ---------- Fonts & images ---------- */
const FEATURED_PHOTO = '/images-featured.webp'

/* ---------- Content ---------- */
const LABEL = '[ L’agenda golf d’Orange Cameroun ]'
const SINCE = { word: 'Since', digits: ['1', '0'] }
const HEADING = ['L’agenda', 'des deux événements']
const BODY = 'À Kribi, le tournoi se joue le premier jour et les tables rondes ont lieu le lendemain. À Douala, l’initiation commence à 8 h et la remise des prix est prévue à 15 h. Retrouvez les horaires de chaque rendez-vous ci-dessous.'
const LIVE_TAG = 'À la une'
const SUBHEADING = 'Les temps forts'

type CityKey = EventKey
type Slot = { day: string; time: string; title: string }
type City = { key: CityKey; name: string; title: string; bullets: string[]; link: string; schedule: Slot[] }

const CITIES: Record<CityKey, City> = {
  douala: {
    key: 'douala',
    name: 'Douala',
    title: 'Douala · Golf Open Day',
    bullets: ['Initiation avec matériel fourni', 'Défis de putting, de drive et d’approche'],
    link: 'Voir le programme de Douala',
    schedule: PROGRAMMES.douala.moments,
  },
  kribi: {
    key: 'kribi',
    name: 'Kribi',
    title: 'Kribi · Orange Golf Experience',
    bullets: ['Tournoi au Kribi Golf & Country Club', 'Tables rondes avec Orange Business'],
    link: 'Voir le programme de Kribi',
    schedule: PROGRAMMES.kribi.moments,
  },
}
const DEFAULT_CITY: CityKey = 'douala'

const micro = 'text-[12px] font-medium uppercase leading-[1.3]'
const upper = 'text-[16px] font-medium uppercase leading-[1.28] tracking-[-0.003em]'

function SinceBadge() {
  return (
    <div className="flex items-center gap-[4px]">
      <span className={`flex h-[40.4px] items-center rounded-full border-[1.2px] border-[#000000] px-[14px] text-[#000000] ${upper}`}>{SINCE.word}</span>
      {SINCE.digits.map((d, n) => (
        <span key={n} className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#000000] text-[17px] font-medium leading-[1.3] text-[#FF7900] transition-transform duration-500 hover:rotate-[360deg]">
          {d}
        </span>
      ))}
    </div>
  )
}

/** Photo with the "À la une" tag and the glass card showing the selected city. */
function Featured({ city, className = '', compact = false }: { city: City; className?: string; compact?: boolean }) {
  return (
    <div className={`group relative overflow-hidden rounded-[22px] ${className}`}>
      <img src={FEATURED_PHOTO} alt="Golfeur au départ d’un trou sur le parcours" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
      <span className={`absolute left-[20px] top-[20px] flex h-[30px] items-center gap-[8px] rounded-full bg-[#FF7900] pl-[10px] pr-[14px] text-[#000000] ${micro}`}>
        <span className="relative flex h-[8px] w-[8px]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#000000]/60" />
          <span className="relative h-[8px] w-[8px] rounded-full bg-[#000000]" />
        </span>
        {LIVE_TAG}
      </span>
      <div className={`absolute flex ${compact ? 'inset-x-[12px] bottom-[12px]' : 'bottom-[20px] left-[20px] right-[20px]'}`}>
        <div className={`flex max-w-full rounded-[16px] border border-[#FFFFFF]/25 bg-[#000000]/55 text-[#FFFFFF] backdrop-blur-[12px] ${compact ? 'w-full flex-wrap items-center gap-x-[14px] gap-y-[10px] p-[14px]' : 'items-center gap-[18px] px-[20px] py-[16px]'}`}>
          <CloverIcon size={28} className="shrink-0" />
          <Swap as="div" key={city.key} className={`flex min-w-0 flex-col gap-[2px] ${compact ? 'basis-[calc(100%-42px)]' : ''}`}>
            <span className="text-[20px] font-medium leading-[1.25] tracking-[-0.01em]">{city.title}</span>
            <span className="text-[15px] leading-[1.45] tracking-[-0.003em] opacity-75">{city.bullets.join(' · ')}</span>
          </Swap>
        </div>
      </div>
    </div>
  )
}

/** Bloc ville : titre, puces et lien « Voir le programme ». Cliquer sélectionne la ville. */
function CityBlock({ city, active, onSelect, className = '' }: { city: City; active: boolean; onSelect: () => void; className?: string }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={onSelect}
      onKeyDown={(e) => e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}
      className={`flex w-full cursor-pointer flex-col justify-between rounded-[18px] border p-[18px] text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.35)] ${className} ${
        active ? 'border-[#000000] bg-[#000000] text-[#FFFFFF]' : 'border-[#CCCCCC] bg-white text-[#000000]'
      }`}
    >
      <div>
        <p className="text-[20px] font-medium leading-[1.25] tracking-[-0.01em]">{city.title}</p>
        <p className="mt-1 text-sm">{PROGRAMMES[city.key].date}</p>
      </div>
      <a
        href={`#programme-${city.key}`}
        onClick={(e) => e.stopPropagation()}
        className={`mt-[14px] inline-flex items-center gap-[7px] self-start text-[14px] font-bold transition-colors duration-300 ${active ? 'text-[#FF7900] hover:text-[#FF7900]' : 'text-[#A64200] hover:text-[#A64200]'}`}
      >
        {city.link}
        <span aria-hidden>→</span>
      </a>
    </div>
  )
}

function useCity() {
  const [active, setActive] = useState<CityKey>(DEFAULT_CITY)
  return { active, setActive, city: CITIES[active] }
}

function HappeningDesktop() {
  const { active, setActive, city } = useCity()
  return (
    <Artboard id="happening" height={1104} className="bg-[#FFFFFF]">
      <div className="relative h-[1104px] w-[1440px] bg-[#FFFFFF] text-[#000000]">
        <Reveal as="p" style={at(48, 48)} className={`whitespace-nowrap text-[#A64200] ${upper}`}>{LABEL}</Reveal>
        <Reveal style={at(1227.6, 48)} delay={100}><SinceBadge /></Reveal>
        <div style={at(48, 124, 1344, 1)} className="bg-[#CCCCCC]" />

        <Reveal as="h2" style={at(48, 158, 610)} delay={150} className="text-[50px] font-bold leading-[0.98] tracking-[-0.04em]">
          {HEADING.map((l) => <span key={l} className="block whitespace-nowrap">{l}</span>)}
        </Reveal>
        <Reveal as="p" style={at(48, 330, 610)} delay={250} className="text-[18px] leading-[1.4] tracking-[-0.01em] text-[#666666]">{BODY}</Reveal>

        <Reveal style={at(700, 158, 692, 658)} delay={200}>
          <Featured city={city} className="h-[658px] w-[692px]" />
        </Reveal>

        <Reveal style={at(48, 500, 610, 150)} delay={300}>
          <CityBlock city={CITIES.douala} active={active === 'douala'} onSelect={() => setActive('douala')} className="h-[150px]" />
        </Reveal>
        <Reveal style={at(48, 666, 610, 150)} delay={360}>
          <CityBlock city={CITIES.kribi} active={active === 'kribi'} onSelect={() => setActive('kribi')} className="h-[150px]" />
        </Reveal>

        <h3 style={at(48, 852)} className="text-[28px] font-medium leading-[1.2] tracking-[-0.015em]">{SUBHEADING} à {city.name}</h3>
        <p aria-live="polite" style={at(48, 902)} className={`text-[#A64200] ${upper}`}>{city.name} · {PROGRAMMES[active].date}</p>
        <div style={at(48, 940, 1344)} className="grid grid-cols-4 gap-4">
          {city.schedule.map((slot, i) => (
            <SlotCard key={slot.time} {...slot} featured={i === 0} />
          ))}
        </div>
      </div>
    </Artboard>
  )
}

function HappeningMobile() {
  const { active, setActive, city } = useCity()
  return (
    <section id="happening" className="bg-[#FFFFFF] px-5 py-14 text-[#000000]">
      <div className="flex items-center justify-between gap-3 border-b border-[#CCCCCC] pb-5">
        <p className="text-[13px] font-medium uppercase text-[#A64200]">{LABEL}</p>
        <div className="origin-right scale-[0.85]"><SinceBadge /></div>
      </div>
      <Reveal as="h2" className="mt-8 text-[40px] font-bold leading-[0.98] tracking-[-0.04em]">
        {HEADING.map((l) => <span key={l} className="block">{l}</span>)}
      </Reveal>
      <Reveal as="p" delay={100} className="mt-5 text-[17px] leading-[1.4] tracking-[-0.01em] text-[#666666]">{BODY}</Reveal>
      <Reveal className="mt-9">
        <Featured city={city} compact className="aspect-[4/5] w-full" />
      </Reveal>

      <div className="mt-12 flex flex-col gap-3">
        {(['douala', 'kribi'] as CityKey[]).map((key, i) => (
          <Reveal key={key} delay={i * 80}>
            <CityBlock city={CITIES[key]} active={active === key} onSelect={() => setActive(key)} className="min-h-[168px]" />
          </Reveal>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-[24px] font-medium leading-[1.2] tracking-[-0.015em]">{SUBHEADING} à {city.name}</h3>
        <p aria-live="polite" className={`mt-3 text-[#A64200] ${micro}`}>{city.name} · {PROGRAMMES[active].date}</p>
        <div className="mt-3 flex flex-col gap-3">
          {city.schedule.map((slot, i) => (
            <SlotCard key={slot.time} {...slot} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Happening() {
  return <Responsive desktop={<HappeningDesktop />} mobile={<HappeningMobile />} />
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
  return <div className="font-archivo text-[#000000] antialiased">{useIsDesktop() ? desktop : mobile}</div>
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

/** Animates its content in when it mounts (give it a changing `key` to replay). */
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

type IconProps = SVGProps<SVGSVGElement> & { size?: number; stroke?: number }

function CheckIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m4.5 9.4 3 3 6-6.8" />
    </svg>
  )
}

function CloverIcon({ size = 30, color = '#FF7900', ...p }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill={color} {...p}>
      <circle cx="10.25" cy="10.25" r="5.25" />
      <circle cx="19.75" cy="10.25" r="5.25" />
      <circle cx="10.25" cy="19.75" r="5.25" />
      <circle cx="19.75" cy="19.75" r="5.25" />
    </svg>
  )
}

function PlusIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" {...p}>
      <path d="M9 4.5v9M4.5 9h9" />
    </svg>
  )
}