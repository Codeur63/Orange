/**
 * Levels — level accordion, swing assessment, testimonial carousel
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode, type SVGProps } from 'react'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'
const PHOTO = 'https://cdn.jiro.build/Golf/l1.webp'
/** Testimonial avatars (full-body portraits, zoomed in on the face). */
const MAYA = 'https://cdn.jiro.build/Golf/t4.webp'
const DANIEL = 'https://cdn.jiro.build/Golf/t5.webp'
const PRIYA = 'https://cdn.jiro.build/Golf/t2.webp'

/* ---------- Content ---------- */
const LABEL = '[ Choisissez votre événement ]'
const LINE_1 = ['Votre place', 'sur le green.']
const LINE_2 = 'Douala ou Kribi : à vous de choisir.'
const LEVELS = [
  { title: 'Douala · Golf Open Day', description: 'Une journée de compétition sur le parcours et de découverte du golf au bord du green.' },
  { title: 'Kribi · Orange Golf Experience', description: 'Deux jours de golf au Kribi Golf & Country Club et de rencontres avec les clients et partenaires d’Orange Business.' },
  { title: 'Les deux rendez-vous', description: 'Pourquoi choisir ? Inscrivez-vous aux deux événements et vivez toute l’expérience Orange Golf.' },
]
const DEFAULT_LEVEL = 1
const QUESTION = 'Besoin d’aide pour choisir ?'
const NOTE = 'Découvrez le programme de chaque événement, puis réservez la place qui vous correspond.'
const LINK = { label: 'Voir les programmes', href: '#programs' }
const BUTTON = 'S’inscrire à l’événement'
const TESTIMONIALS = [
  { name: 'Équipe Orange Golf', avatar: MAYA, quote: '« Un parcours clair : vous choisissez Douala, Kribi ou les deux, et nous nous occupons du reste. »' },
  { name: 'Participants · Douala', avatar: DANIEL, quote: '« Une journée de golf ouverte à tous, avec initiation et compétition sur le parcours. »' },
  { name: 'Participants · Kribi', avatar: PRIYA, quote: '« Deux jours de golf et de rencontres avec les clients et partenaires d’Orange Business. »' },
]
const TESTIMONIAL_MS = 6000

const heading = 'text-[50px] font-medium leading-[1.08] tracking-[-0.03em]'
const name = 'text-[20px] font-medium leading-[1.25] tracking-[-0.01em]'

/** Progress ring that fills over TESTIMONIAL_MS (Web Animations API, restarts when `k` changes). */
function Ring({ k }: { k: number }) {
  const ref = useRef<SVGCircleElement>(null)
  useEffect(() => {
    const a = ref.current?.animate([{ strokeDashoffset: 69.1 }, { strokeDashoffset: 0 }], { duration: TESTIMONIAL_MS, easing: 'linear', fill: 'both' })
    return () => a?.cancel()
  }, [k])
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" className="-rotate-90" aria-hidden>
      <circle cx="13" cy="13" r="11" fill="none" stroke="rgba(255,121,0,.25)" strokeWidth="2.4" />
      <circle ref={ref} cx="13" cy="13" r="11" fill="none" stroke="#FF7900" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="69.1" strokeDashoffset="69.1" />
    </svg>
  )
}

function Testimonial({ className = '' }: { className?: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setTimeout(() => setI((n) => (n + 1) % TESTIMONIALS.length), TESTIMONIAL_MS)
    return () => window.clearTimeout(t)
  }, [i])
  const t = TESTIMONIALS[i]
  return (
    <figure
      className={`flex cursor-pointer flex-col gap-[22px] rounded-[18px] border border-[#FFFFFF]/30 bg-[#FFFFFF]/[0.14] px-[24px] py-[22px] text-[#FFFFFF] backdrop-blur-[14px] ${className}`}
      onClick={() => setI((n) => (n + 1) % TESTIMONIALS.length)}
    >
      <Swap as="div" key={i} className="flex h-[44px] items-center gap-[14px]">
        <span className="block h-[44px] w-[44px] shrink-0 overflow-hidden rounded-[8px] bg-[#FFFFFF]">
          <img src={t.avatar} alt="" className="h-full w-full object-cover" style={{ transform: 'scale(2.2)', transformOrigin: '50% 12%' }} />
        </span>
        <figcaption className={`flex-1 ${name}`}>{t.name}</figcaption>
        <span className="text-[15px] leading-[1.45] opacity-70">{i + 1}/{TESTIMONIALS.length}</span>
        <Ring k={i} />
      </Swap>
      <Swap as="blockquote" key={`q${i}`} className="min-h-[40px] text-[16px] font-medium uppercase leading-[1.28] tracking-[-0.003em]">{t.quote}</Swap>
    </figure>
  )
}

function LevelList({ width = 520 }: { width?: number }) {
  const [active, setActive] = useState(DEFAULT_LEVEL)
  return (
    <ul style={{ width }} className="max-w-full">
      {LEVELS.map((l, i) => {
        const open = i === active
        return (
          <li key={l.title} className={i > 0 ? 'border-t border-[#FFFFFF]/15' : ''}>
            <button
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-expanded={open}
              className={`relative flex w-full flex-col items-start justify-start overflow-hidden text-left transition-[height,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'pl-[18px]' : 'pl-0'}`}
              style={{ height: open ? 123 : 69 }}
            >
              <span className={`absolute left-0 top-0 w-[2px] bg-[#FF7900] transition-all duration-700 ${open ? 'h-full' : 'h-0'}`} />
              <span className={`block pt-[22px] ${name} transition-colors duration-500 ${open ? 'text-[#FF7900]' : 'text-[#FFFFFF]/30 hover:text-[#FFFFFF]/60'}`}>{l.title}</span>
              <span className={`mt-[10px] block text-[15px] leading-[1.45] tracking-[-0.003em] text-[#FFFFFF]/70 transition-opacity duration-500 ${open ? 'opacity-100 delay-150' : 'opacity-0'}`}>
                {l.description}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function Content({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      <Reveal as="p" className="text-[12px] font-medium uppercase leading-[1.3]">{LABEL}</Reveal>
      <div className="h-[40px] shrink-0" />
      <Reveal as="h2" delay={150} className={mobile ? 'w-full' : ''}>
        <span className={`flex items-center gap-[12px] ${heading}`}>
          {LINE_1[0]}
          <GolfBallIcon className="shrink-0 animate-[spin_10s_linear_infinite]" />
          {LINE_1[1]}
        </span>
        <span className={`block opacity-[0.38] ${mobile ? 'w-full' : 'w-[487px]'} ${heading}`}>{LINE_2}</span>
      </Reveal>
    </>
  )
}

function LevelsDesktop() {
  return (
    <Artboard id="levels" height={860} className="bg-white">
      <div className="px-[24px]">
        <div className="relative h-[860px] w-[1392px] overflow-hidden rounded-[26px] bg-[linear-gradient(143.13deg,#000000_14.29%,#000000_85.71%)] text-[#FFFFFF]">
          <img src={PHOTO} alt="Golfer walking the fairway with his putter" style={at(696, 0, 696, 860)} className="object-cover" />
          <div style={at(696, 0, 696, 860)} className="bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0)_62%,rgba(0,0,0,0.75)_100%)]" />
          <Reveal style={at(1003.5, 50, 81, 30)}><Logo /></Reveal>

          <div style={at(72, 72, 560, 750)} className="flex flex-col items-start">
            <Content />
            <div className="h-[40px] shrink-0" />
            <LevelList />
            <div className="h-[36px] shrink-0" />
            <Reveal as="p" className={name}>{QUESTION}</Reveal>
            <div className="h-[12px] shrink-0" />
            <Reveal as="p" delay={80} className="w-[520px] text-[14px] font-medium uppercase leading-[1.4] opacity-75">{NOTE}</Reveal>
            <TextLink href={LINK.href} underlined className="text-[17px] font-medium leading-[1.3] tracking-[-0.005em] text-[#FF7900]">{LINK.label}</TextLink>
            <div className="h-[30px] shrink-0" />
            <Reveal>
              <Button variant="cream" href="#contact" className="h-[64px] px-[32px] text-[17px] font-medium leading-[1.3] tracking-[-0.005em]">{BUTTON}</Button>
            </Reveal>
          </div>

          <Reveal style={at(774, 660, 540, 152)} delay={200}>
            <Testimonial className="h-[152px] w-[540px]" />
          </Reveal>
        </div>
      </div>
    </Artboard>
  )
}

function LevelsMobile() {
  return (
    <section id="levels" className="bg-white px-3">
      <div className="overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#000000_14%,#000000_86%)] text-[#FFFFFF]">
        <div className="flex flex-col items-start px-5 pb-10 pt-10 [&_h2_span]:!text-[34px]">
          <Content mobile />
          <div className="h-6" />
          <LevelList width={600} />
          <p className={`mt-8 ${name}`}>{QUESTION}</p>
          <p className="mt-3 text-[13px] font-medium uppercase leading-[1.4] opacity-75">{NOTE}</p>
          <TextLink href={LINK.href} underlined className="mt-1 text-[16px] font-medium text-[#FF7900]">{LINK.label}</TextLink>
          <Button variant="cream" href="#contact" className="mt-7 h-[56px] px-7 text-[16px] font-medium">{BUTTON}</Button>
        </div>
        <div className="relative px-4 pb-4 pt-[300px]">
          <img src={PHOTO} alt="Golfer walking the fairway with his putter" className="absolute inset-0 h-full w-full object-cover object-[70%_20%]" />
          <div className="absolute inset-x-0 top-8 flex justify-center"><Logo /></div>
          <Testimonial className="relative" />
        </div>
      </div>
    </section>
  )
}

export default function Levels() {
  return <Responsive desktop={<LevelsDesktop />} mobile={<LevelsMobile />} />
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
    <a href="#top" aria-label="Links — home" className={`inline-flex text-[30px] font-bold leading-none tracking-[-0.05em] ${className}`}>
      <span className="text-[#FFFFFF]">Links</span>
      <span className="text-[#FF7900]">.</span>
    </a>
  )
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number; stroke?: number }

const DIMPLES = [
  [13.8, 13.8], [21.47, 10.92], [29.13, 13.8], [11.88, 21.47], [19.55, 19.55],
  [27.22, 21.47], [31.05, 28.17], [15.72, 29.13], [23.38, 28.17], [21.47, 34.88],
]
function GolfBallIcon({ size = 46, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" {...p}>
      <circle cx="23" cy="23" r="19.17" fill="#FF7900" />
      {DIMPLES.map(([x, y], i) => (
        <circle key={i} cx={x + 1.535} cy={y + 1.535} r="1.535" fill="#CC6600" />
      ))}
    </svg>
  )
}