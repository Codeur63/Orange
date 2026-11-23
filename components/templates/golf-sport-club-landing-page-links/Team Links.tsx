/**
 * Gallery — grille de photos des événements Orange Golf + lightbox au clic
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode, type SVGProps } from 'react'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'

/* ---------- Content ---------- */
const LABEL = '[ Galerie photos ]'
const HEADING = ['Le golf en images']
const BODY = 'Découvrez en images les activités au programme à Douala et à Kribi. Cliquez sur une photo pour l’agrandir.'
const BUTTON = { label: 'S’inscrire à l’événement', href: '#levels' }

type Photo = { title: string; meta: string; tag: string; photo: string; caption: string }
const PHOTOS: Photo[] = [
  { title: 'Deux rendez-vous', meta: 'Douala · Kribi', tag: 'L’essentiel', photo: '/au_programme/Rendez-vous.webp', caption: 'L’initiation à Douala, le golf d’affaires à Kribi.' },
  { title: 'Découvrir le golf', meta: 'Douala · Golf Open Day', tag: 'Initiation', photo: '/au_programme/golf_rencontre.webp', caption: 'Accueil et initiation encadrée au bord du green, pour tous les niveaux.' },
  { title: 'Les jeux', meta: 'Douala · Golf Open Day', tag: 'Ateliers', photo: '/au_programme/golfeur.webp', caption: 'Putting, drive et approche : des défis ludiques ouverts à tous les participants.' },
  { title: 'Rencontres B2B', meta: 'Kribi · Orange Golf Experience', tag: 'Networking', photo: '/au_programme/echange_pro.webp', caption: 'Clients et partenaires d’Orange Business se retrouvent autour du golf.' },
  { title: 'Classement', meta: 'Kribi · Orange Golf Experience', tag: 'Célébration', photo: '/au_programme/classement.webp', caption: 'Dîner de gala, annonce du classement et remise des prix aux équipes gagnantes.' },
]

/* Grid positions inside the 1344 × 760 grid (Figma). */
const GRID = [
  { left: 0, top: 0, w: 520, h: 760 },
  { left: 536, top: 0, w: 396, h: 372 },
  { left: 948, top: 0, w: 396, h: 372 },
  { left: 536, top: 388, w: 396, h: 372 },
  { left: 948, top: 388, w: 396, h: 372 },
]

const micro = 'text-[12px] font-medium uppercase leading-[1.3]'

/** Carte photo : titre, légende et zoom au survol. Le clic ouvre la photo en grand. */
function PhotoCard({ p, featured = false, className = '', onOpen }: { p: Photo; featured?: boolean; className?: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-label={`Agrandir la photo : ${p.title}`} className={`group relative block overflow-hidden rounded-[22px] bg-[#FFFFFF] text-left ${className}`}>
      <img src={p.photo} alt={`${p.title} — ${p.meta}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
      <span className={`absolute left-[16px] top-[16px] rounded-full px-[10px] py-[5px] ${micro} ${featured ? 'bg-[#FF7900] text-[#000000]' : 'bg-[#000000] text-[#FF7900]'}`}>{p.tag}</span>
      <span className="absolute right-[16px] top-[16px] flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FF7900] text-[#000000] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <ZoomIcon size={16} />
      </span>
      <div className="absolute inset-x-[16px] bottom-[14px] rounded-[14px] border border-white/[0.22] bg-[#000000]/60 py-[12px] pl-[16px] pr-[12px] text-[#FFFFFF] backdrop-blur-[11px]">
        <div className="flex items-center gap-[12px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className={`font-medium ${featured ? 'text-[28px] leading-[1.2] tracking-[-0.015em]' : 'text-[20px] leading-[1.25] tracking-[-0.01em]'}`}>{p.title}</span>
            <span className="truncate text-[15px] leading-[1.45] tracking-[-0.003em] opacity-70">{p.meta}</span>
          </div>
          <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#FF7900] text-[#000000]">
            <ArrowIcon size={16} className="group-hover:translate-x-[3px] group-hover:-rotate-45" />
          </span>
        </div>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <p className="overflow-hidden text-[14px] leading-[1.4] opacity-85">
            <span className="block pr-[48px] pt-[8px]">{p.caption}</span>
          </p>
        </div>
      </div>
    </button>
  )
}

/** Lightbox : photo en grand, navigation au clavier, fermeture par Échap ou clic sur le fond. */
function Lightbox({ index, photos, onClose, onPrev, onNext }: { index: number; photos: Photo[]; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onPrev, onNext])

  const p = photos[index]
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} sur ${photos.length} : ${p.title}`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/92 px-4 py-16 backdrop-blur-md md:px-12"
    >
      <button type="button" onClick={onClose} aria-label="Fermer la galerie" className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300 hover:rotate-90 hover:border-[#FF7900] hover:text-[#FF7900]">
        <CloseIcon size={20} />
      </button>

      <div className="relative flex max-h-full w-full max-w-[1200px] flex-col items-center gap-5" onClick={(e) => e.stopPropagation()}>
        <div className="relative flex max-h-[78vh] w-full items-center justify-center">
          <img key={p.photo} src={p.photo} alt={`${p.title} — ${p.caption}`} className="max-h-[78vh] w-auto max-w-full rounded-[14px] object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]" />
          {photos.length > 1 && (
            <>
              <button type="button" onClick={onPrev} aria-label="Photo précédente" className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#FF7900] hover:text-[#FF7900] md:-left-16">
                <span className="rotate-180"><ArrowIcon size={18} /></span>
              </button>
              <button type="button" onClick={onNext} aria-label="Photo suivante" className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:border-[#FF7900] hover:text-[#FF7900] md:-right-16">
                <ArrowIcon size={18} />
              </button>
            </>
          )}
        </div>
        <div className="text-center text-white">
          <p className={`text-[#FF7900] ${micro}`}>{p.tag} · {p.meta}</p>
          <h3 className="mt-2 text-[24px] font-medium leading-[1.2] tracking-[-0.01em] md:text-[30px]">{p.title}</h3>
          <p className="mx-auto mt-2 max-w-[640px] text-[14px] leading-[1.5] text-white/65 md:text-[16px]">{p.caption}</p>
          <p className={`mt-3 text-white/65 ${micro}`}>{index + 1} / {photos.length}</p>
        </div>
      </div>
    </div>
  )
}

function GalleryDesktop() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(() => setOpen((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)), [])
  const next = useCallback(() => setOpen((i) => (i === null ? null : (i + 1) % PHOTOS.length)), [])

  return (
    <>
      <Artboard id="gallery" height={1189} className="bg-[#FFFFFF]">
        <div className="relative h-[1189px] w-[1440px] bg-[#FFFFFF] text-[#000000]">
          {/* Header (Figma: padding 110/48, row aligned to bottom) */}
          <div style={at(48, 110, 1344, 161)} className="flex items-end justify-between">
            <div className="flex w-[480px] flex-col gap-[20px]">
              <Reveal as="p" className="text-[16px] font-medium uppercase leading-[1.28] tracking-[-0.003em] text-[#A64200]">{LABEL}</Reveal>
              <Reveal as="h2" delay={150} className="text-[50px] font-medium leading-[1.08] tracking-[-0.03em]">
                {HEADING.map((l) => <span key={l} className="block whitespace-nowrap">{l}</span>)}
              </Reveal>
            </div>
            <div className="flex w-[400px] flex-col items-end gap-[22px]">
              <Reveal as="p" delay={200} className="text-right text-[17px] leading-[1.45] tracking-[-0.005em] text-[#666666]">{BODY}</Reveal>
              <Reveal delay={280}>
                <Button variant="lime" href={BUTTON.href} className="h-[64px] px-[32px] text-[17px] font-medium leading-[1.3] tracking-[-0.005em]">{BUTTON.label}</Button>
              </Reveal>
            </div>
          </div>

          {/* Grid */}
          <div style={at(48, 319, 1344, 760)}>
            {PHOTOS.map((p, i) => {
              const g = GRID[i]
              return (
                <Reveal key={p.title} style={at(g.left, g.top, g.w, g.h)} delay={i * 100}>
                  <PhotoCard p={p} featured={i === 0} className="h-full w-full" onOpen={() => setOpen(i)} />
                </Reveal>
              )
            })}
          </div>
        </div>
      </Artboard>
      {open !== null && <Lightbox index={open} photos={PHOTOS} onClose={close} onPrev={prev} onNext={next} />}
    </>
  )
}

function GalleryMobile() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(() => setOpen((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)), [])
  const next = useCallback(() => setOpen((i) => (i === null ? null : (i + 1) % PHOTOS.length)), [])

  return (
    <>
      <section id="gallery" className="bg-[#FFFFFF] px-5 py-16 text-[#000000]">
        <Reveal as="p" className="text-[14px] font-medium uppercase text-[#A64200]">{LABEL}</Reveal>
        <Reveal as="h2" delay={120} className="mt-4 text-[36px] font-medium leading-[1.08] tracking-[-0.03em]">{HEADING.join(' ')}</Reveal>
        <Reveal as="p" delay={180} className="mt-5 text-[17px] leading-[1.45] text-[#666666]">{BODY}</Reveal>
        <Reveal className="mt-6">
          <Button variant="lime" href={BUTTON.href} className="h-[56px] px-7 text-[16px] font-medium">{BUTTON.label}</Button>
        </Reveal>
        <div className="mt-10 flex flex-col gap-4">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <PhotoCard p={p} featured={i === 0} className={`w-full ${i === 0 ? 'aspect-[4/5]' : 'aspect-[396/372]'}`} onOpen={() => setOpen(i)} />
            </Reveal>
          ))}
        </div>
      </section>
      {open !== null && <Lightbox index={open} photos={PHOTOS} onClose={close} onPrev={prev} onNext={next} />}
    </>
  )
}

export default function Gallery() {
  return <Responsive desktop={<GalleryDesktop />} mobile={<GalleryMobile />} />
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

type IconProps = SVGProps<SVGSVGElement> & { size?: number; stroke?: number }

function ArrowIcon({ size = 18, className = '', ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`} {...p}>
      <path d="M3.5 9h11M10 4.5 14.5 9 10 13.5" />
    </svg>
  )
}

function ZoomIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="7.8" cy="7.8" r="5.3" />
      <path d="m11.7 11.7 4 4M7.8 5.6v4.4M5.6 7.8h4.4" />
    </svg>
  )
}

function CloseIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4l10 10M14 4 4 14" />
    </svg>
  )
}