/**
 * Inscription — choix du profil (partenaire / joueur), de l'événement et formulaire de demande.
 * 100% self-contained.
 * Needs: only React 18 + Tailwind CSS. Fonts load from Google Fonts (no npm package).
 */
import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type ElementType, type FormEvent, type ReactNode, type SVGProps } from 'react'

import { PROGRAMMES, type EventKey as CityKey } from './programmes'

/* ---------- Fonts & images ---------- */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap'

/* ---------- Content ---------- */
const BODY = 'Choisissez votre profil et l’événement auquel vous souhaitez participer.'

type ProfileKey = 'partenaire' | 'joueur'
type EventKey = CityKey | 'les-deux'

const PROFILES: Record<ProfileKey, { title: string; subtitle: string; blurb: string }> = {
  partenaire: {
    title: 'Partenaire',
    subtitle: 'Stand & visibilité',
    blurb: 'Réservez un stand et rencontrez les dirigeants, clients et partenaires présents.',
  },
  joueur: {
    title: 'Joueur & participant',
    subtitle: 'Tournoi & découverte',
    blurb: 'Jouez, découvrez le golf et partagez la journée avec la communauté Orange.',
  },
}

const EVENTS: { value: EventKey; label: string }[] = [
  { value: 'douala', label: `Douala · ${PROGRAMMES.douala.event}` },
  { value: 'kribi', label: `Kribi · ${PROGRAMMES.kribi.event}` },
  { value: 'les-deux', label: 'Les deux événements' },
]

const label = 'block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#000000]/65'
const inputBase =
  'h-10 w-full rounded-none border-b border-black/40 bg-transparent px-0 text-base text-black outline-none placeholder:text-[#666666] focus:border-[#A64200] focus:shadow-[0_1px_0_#A64200] aria-invalid:border-[#C2410C]'
const errorText = 'mt-1 text-[12px] font-medium leading-[1.4] text-[#B23A0A]'

type FormValues = {
  name: string
  email: string
  phone: string
  company: string
  stand: string
  level: string
  formula: string
  message: string
}
const EMPTY_FORM: FormValues = { name: '', email: '', phone: '', company: '', stand: 'Standard', level: 'Débutant', formula: 'Initiation', message: '' }

function ProfileChooser({ value, onChange }: { value: ProfileKey; onChange: (p: ProfileKey) => void }) {
  return (
    <fieldset className="grid grid-cols-2 gap-2">
      <legend className={`${label} mb-2`}>Votre profil</legend>
      {(Object.keys(PROFILES) as ProfileKey[]).map((key) => (
        <label key={key} className="relative cursor-pointer">
          <input type="radio" name="registration-profile" checked={value === key} onChange={() => onChange(key)} className="peer sr-only" />
          <span className="flex min-h-11 items-center justify-center rounded-md border border-black/25 px-2 py-2 text-center text-sm font-semibold peer-checked:border-black peer-checked:bg-black peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#A64200]">
            {key === 'joueur' ? 'Joueur' : PROFILES[key].title}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

/** Formulaire de demande : champs conditionnels selon le profil, validation locale. */
function RegistrationForm({ profile, event, setEvent, className = '' }: { profile: ProfileKey; event: EventKey; setEvent: (e: EventKey) => void; className?: string }) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [summary, setSummary] = useState<{ profile: ProfileKey; event: EventKey } | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const [serverError, setServerError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending'>('idle')
  const startedAtRef = useRef(Date.now())
  const selected = event === 'les-deux' ? Object.values(PROGRAMMES) : [PROGRAMMES[event]]

  const set = (key: keyof FormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const next: Partial<Record<keyof FormValues, string>> = {}
    if (!values.name.trim()) next.name = 'Indiquez votre nom complet.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Indiquez une adresse email valide.'
    if (profile === 'partenaire' && !values.company.trim()) next.company = 'Indiquez le nom de votre entreprise.'
    setErrors(next)
    setServerError('')
    if (Object.keys(next).length > 0) return

    setStatus('sending')
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, profile, event, website: honeypot, startedAt: startedAtRef.current }),
      })
      const data: { ok?: boolean; message?: string; errors?: Record<string, string> } = await response.json()
      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors)
        setServerError(data.message || 'La demande n’a pas pu être envoyée. Réessayez.')
        return
      }
      setSummary({ profile, event })
    } catch {
      setServerError('La demande n’a pas pu être envoyée. Réessayez.')
    } finally {
      setStatus('idle')
    }
  }

  if (summary) {
    return (
      <div className={`flex flex-col justify-center text-[#000000] ${className}`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF7900]">
          <CheckIcon size={22} />
        </span>
        <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#B23A0A]">Récapitulatif</p>
        <h3 className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-[-0.02em]">Votre demande est prête</h3>
        <p className="mt-3 text-[15px] leading-[1.6] text-[#000000]/65">
          {values.name.trim()} · {PROFILES[summary.profile].title} · {EVENTS.find((option) => option.value === summary.event)?.label}
        </p>
        <p className="mt-2 break-all text-[15px]">{values.email.trim()}</p>
        <p role="status" className="mt-3 text-[14px] text-[#000000]/70">
          Votre demande a été transmise. L’équipe Orange Golf vous recontacte à l’adresse indiquée.
        </p>
        <button
          type="button"
          onClick={() => setSummary(null)}
          className="mt-6 inline-flex min-h-11 items-center justify-center self-start rounded-md bg-[#FF7900] px-4 text-sm font-semibold text-black hover:bg-[#F06F00] focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Modifier ma demande
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={`flex flex-col justify-center text-[#000000] ${className}`}
      aria-busy={status === 'sending'}
    >
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="reg-website">Site web</label>
        <input id="reg-website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <h3 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.02em]">Votre demande</h3>
      <p className="mt-2 text-sm text-[#000000]/70">{PROFILES[profile].title} · Les champs marqués d’un * sont obligatoires.</p>

      <div className="mt-6 flex flex-col gap-5 md:gap-6">
        <div>
          <label htmlFor="reg-event" className={label}>Événement *</label>
          <Select id="reg-event" value={event} onChange={(e) => setEvent(e.target.value as EventKey)} options={EVENTS} />
          <div aria-live="polite" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/75">
            {selected.map(({ city, date }) => (
              <p key={city} className="flex items-center gap-2">
                <CalendarIcon size={16} className="shrink-0 text-[#A64200]" />
                <span><strong>{city}</strong> · {date}</span>
              </p>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="reg-name" className={label}>Nom complet *</label>
          <input id="reg-name" name="name" autoComplete="name" value={values.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'err-name' : undefined} className={inputBase} placeholder="Ex. Awa Ndiaye" />
          {errors.name && <p id="err-name" role="alert" className={errorText}>{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 [&>div]:min-w-0">
          <div>
            <label htmlFor="reg-email" className={label}>Email *</label>
            <input id="reg-email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'err-email' : undefined} className={inputBase} placeholder="vous@entreprise.cm" />
            {errors.email && <p id="err-email" role="alert" className={errorText}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="reg-phone" className={label}>Téléphone</label>
            <input id="reg-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} className={inputBase} placeholder="+237 6 00 00 00 00" />
          </div>
        </div>

        {profile === 'partenaire' ? (
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 [&>div]:min-w-0">
            <div>
              <label htmlFor="reg-company" className={label}>Entreprise *</label>
              <input id="reg-company" name="company" autoComplete="organization" value={values.company} onChange={set('company')} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? 'err-company' : undefined} className={inputBase} placeholder="Nom de l’entreprise" />
              {errors.company && <p id="err-company" role="alert" className={errorText}>{errors.company}</p>}
            </div>
            <div>
              <label htmlFor="reg-stand" className={label}>Type de stand</label>
              <Select id="reg-stand" value={values.stand} onChange={set('stand')} options={['Standard', 'Premium', 'Sur mesure']} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 [&>div]:min-w-0">
            <div>
              <label htmlFor="reg-level" className={label}>Niveau de jeu</label>
              <Select id="reg-level" value={values.level} onChange={set('level')} options={['Débutant', 'Intermédiaire', 'Confirmé']} />
            </div>
            <div>
              <label htmlFor="reg-formula" className={label}>Formule</label>
              <Select id="reg-formula" value={values.formula} onChange={set('formula')} options={['Initiation', 'Compétition']} />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="reg-message" className={label}>Message (facultatif)</label>
          <textarea id="reg-message" name="message" rows={4} value={values.message} onChange={set('message')} className={`${inputBase} h-auto min-h-28 resize-y py-2`} placeholder="Précisez vos besoins, votre équipe ou une question." />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#FF7900] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#F06F00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>
        {serverError && <p role="alert" className={errorText}>{serverError}</p>}
        <p className="text-[12px] leading-[1.5] text-[#000000]/55">Vos données servent uniquement au traitement de votre demande.</p>
      </div>
    </form>
  )
}

function Select({ id, value, onChange, options }: { id: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: (string | { value: string; label: string })[] }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={onChange} className={`${inputBase} appearance-none pr-5`}>
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o
          return <option key={opt.value} value={opt.value}>{opt.label}</option>
        })}
      </select>
      <ChevronDownIcon size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#000000]/45" />
    </div>
  )
}

/* ------------------------------------------------------------------
   Inscription — partenaires (stands) & joueurs / participants
   ------------------------------------------------------------------ */

function RegistrationSection() {
  const [profile, setProfile] = useState<ProfileKey>('partenaire')
  const [event, setEvent] = useState<EventKey>('kribi')

  useEffect(() => {
    function selectFromHash() {
      if (window.location.hash === '#levels-douala') setEvent('douala')
      if (window.location.hash === '#levels-kribi') setEvent('kribi')
    }
    selectFromHash()
    window.addEventListener('hashchange', selectFromHash)
    return () => window.removeEventListener('hashchange', selectFromHash)
  }, [])

  return (
    <section id="levels" aria-labelledby="registration-heading" className="relative flex max-h-[100svh] flex-col bg-white pt-20 text-black md:pt-24">
      <span id="levels-douala" className="absolute top-0" aria-hidden />
      <span id="levels-kribi" className="absolute top-0" aria-hidden />
      <div tabIndex={0} role="region" aria-label="Formulaire et choix du profil" className="min-h-0 overflow-y-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#A64200]">
        <div className="mx-auto grid max-w-[1160px] gap-5 px-5 pb-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12 md:px-10 md:pb-8">
          <div>
            <h2 id="registration-heading" className="text-[clamp(1.65rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.035em]">Inscription à l’événement</h2>
            <p className="mt-3 hidden max-w-[36ch] text-base leading-relaxed text-black/70 md:block">{BODY}</p>
            <div className="mt-3 max-w-[360px] md:mt-6">
              <ProfileChooser value={profile} onChange={setProfile} />
              <p className="mt-3 hidden text-sm leading-relaxed text-black/70 md:block">{PROFILES[profile].blurb}</p>
            </div>
          </div>
          <RegistrationForm profile={profile} event={event} setEvent={setEvent} />
        </div>
      </div>
    </section>
  )
}

export default function Levels() {
  useGoogleFonts()
  return (
    <div className="font-['Archivo',sans-serif] text-[#000000] antialiased">
      <RegistrationSection />
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
    <a href="#hero" aria-label="Orange Golf — accueil" className={`inline-flex text-[30px] font-bold leading-none tracking-[-0.05em] ${className}`}>
      <span className="text-[#FFFFFF]">Links</span>
      <span className="text-[#FF7900]">.</span>
    </a>
  )
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

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

function CheckIcon({ size = 16, strokeWidth = 2, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
      <path d="M2.5 8.5 6 12l7.5-8" />
    </svg>
  )
}

function ChevronDownIcon({ size = 16, strokeWidth = 1.8, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
      <path d="m3.5 6 4.5 4.5L12.5 6" />
    </svg>
  )
}

function CalendarIcon({ size = 16, strokeWidth = 1.6, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
      <rect x="2" y="3.2" width="12" height="11" rx="2" />
      <path d="M2 6.6h12M5.4 1.8v2.8M10.6 1.8v2.8" />
    </svg>
  )
}
