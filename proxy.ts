import { NextResponse, type NextRequest } from 'next/server'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/**
 * Force HTTPS dès que la requête arrive en HTTP chez un hébergeur qui renseigne
 * `x-forwarded-proto`. Les environnements locaux restent accessibles en HTTP.
 * La redirection définitive doit aussi être configurée chez l’hébergeur
 * (Vercel, Cloudflare, Nginx…) — voir README.
 */
export function proxy(request: NextRequest) {
  const hostHeader = request.headers.get('host') || ''
  const host = hostHeader.split(':')[0].toLowerCase()
  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim().toLowerCase()

  if (proto === 'http' && hostHeader && !LOCAL_HOSTS.has(host)) {
    // nextUrl can keep the internal host behind a reverse proxy: rebuild from Host.
    const url = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, `https://${hostHeader}`)
    return NextResponse.redirect(url, 308)
  }

  const response = NextResponse.next()
  response.headers.set('x-content-type-options', 'nosniff')
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  response.headers.set('x-frame-options', 'SAMEORIGIN')
  return response
}

export const config = {
  // Les fichiers statiques ne passent pas par le proxy : cela évite aussi que
  // l’optimiseur d’images interne (qui rejoue la requête sans en-têtes) soit
  // intercepté et échoue sur une URL relative.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:webp|avif|png|jpe?g|gif|svg|ico|txt|xml)$).*)'],
}
