/**
 * Community — tagline, statement, city chips, member avatars
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'
/** `face: true` zooms a full-body portrait in on the face. */
const AVATARS = [
  { src: 'https://cdn.jiro.build/Golf/a1.png', face: false },
  { src: 'https://cdn.jiro.build/Golf/a2.webp', face: false },
  { src: 'https://cdn.jiro.build/Golf/t1.webp', face: true },
  { src: 'https://cdn.jiro.build/Golf/t2.webp', face: true },
]
/** Shown when an image link fails, so the tile colour shows instead of a broken-image icon. */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/* ---------- Content ---------- */
const TAGLINE = 'Le golf Orange au Cameroun'
const HEADLINE = 'Deux rendez-vous autour du golf'
const PARAGRAPHS = [
  'À Douala, le Golf Open Day invite à découvrir le golf et à vivre l’événement de près.',
  'À Kribi, l’Orange Golf Experience réunit les dirigeants, clients et partenaires d’Orange Business pour deux jours de golf et de rencontres professionnelles.',
  'Que vous veniez pour découvrir le jeu à Douala ou pour échanger avec d’autres professionnels à Kribi, retrouvez ici les informations de chaque rendez-vous.',
]
const CITIES = ['Douala', 'Kribi']
const MEMBER_COUNT = '120+'
const LEFT_NOTE = 'Golf Open Day · Douala'
const RIGHT_NOTE = '/ Orange Golf Experience · Kribi'

const micro = 'text-[12px] font-medium uppercase leading-[1.3]'

function Members({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center">
      {AVATARS.map((a, i) => (
        <span
          key={i}
          className="relative -mr-[10px] block overflow-hidden rounded-[8px] border-2 border-[#FFFFFF] bg-[#FFFFFF] transition-transform duration-300 hover:z-10 hover:-translate-y-1"
          style={{ width: size, height: size }}
        >
          <img
            src={a.src}
            alt=""
            onError={(e) => e.currentTarget.src !== BLANK && (e.currentTarget.src = BLANK)}
            className="h-full w-full object-cover"
            style={a.face ? { transform: 'scale(2.2)', transformOrigin: '50% 12%' } : undefined}
          />
        </span>
      ))}
      <span
        className={`relative flex items-center justify-center rounded-[8px] border-2 border-[#FFFFFF] bg-[#000000] text-[#FF7900] ${micro}`}
        style={{ width: size + 4, height: size }}
      >
        {MEMBER_COUNT}
      </span>
    </div>
  )
}

function CommunityDesktop() {
  return (
    <Artboard id="about" height={620} className="bg-white">
      <div className="flex h-[620px] w-[1440px] flex-col items-center px-[56px] pt-[72px] text-[#000000]">
        <Reveal className={`flex h-[20px] w-[360px] items-center justify-between ${micro}`}>
          <span>(</span>
          <span>{TAGLINE}</span>
          <span>)</span>
        </Reveal>

        <Reveal as="h2" delay={160} className="mt-[34px] w-[900px] text-center text-[40px] font-normal leading-[1.2] tracking-[-0.02em]">
          {HEADLINE}
        </Reveal>

        <div className="mt-[26px] flex w-[780px] flex-col gap-[14px] text-center">
          {PARAGRAPHS.map((p, i) => (
            <Reveal as="p" key={i} delay={260 + i * 90} className="text-[18px] leading-[1.55] tracking-[-0.005em] text-[#000000]/75">
              {p}
            </Reveal>
          ))}
        </div>

        <ul className="mt-[26px] flex gap-[8px]">
          {CITIES.map((c, i) => (
            <Reveal as="li" key={c} delay={300 + i * 90}>
              <Chip>{c}</Chip>
            </Reveal>
          ))}
        </ul>

        <div className="relative mt-auto flex h-[72px] w-[1328px] items-end justify-between pb-[40px]">
          <Reveal as="p" className={micro}>{LEFT_NOTE}</Reveal>
          <Reveal style={at(572, 0, 184, 44)} delay={120}>
            <Members />
          </Reveal>
          <Reveal as="p" delay={200} className={micro}>{RIGHT_NOTE}</Reveal>
        </div>
      </div>
    </Artboard>
  )
}

function CommunityMobile() {
  return (
    <section id="about" className="bg-white px-5 py-16 text-center text-[#000000]">
      <Reveal className={`mx-auto flex max-w-[340px] justify-between ${micro}`}>
        <span>(</span>
        <span>{TAGLINE}</span>
        <span>)</span>
      </Reveal>
      <Reveal as="h2" delay={150} className="mt-7 text-[28px] leading-[1.2] tracking-[-0.02em]">
        {HEADLINE}
      </Reveal>
      <div className="mt-6 flex flex-col gap-4 text-left">
        {PARAGRAPHS.map((p, i) => (
          <Reveal as="p" key={i} delay={200 + i * 80} className="text-[15px] leading-[1.6] text-[#000000]/75">
            {p}
          </Reveal>
        ))}
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {CITIES.map((c, i) => (
          <Reveal as="li" key={c} delay={300 + i * 80}>
            <Chip>{c}</Chip>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-10 flex justify-center">
        <Members />
      </Reveal>
      <div className={`mt-8 flex flex-col gap-2 ${micro}`}>
        <span>{LEFT_NOTE}</span>
        <span>{RIGHT_NOTE}</span>
      </div>
    </section>
  )
}

export default function Community() {
  return <Responsive desktop={<CommunityDesktop />} mobile={<CommunityMobile />} />
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