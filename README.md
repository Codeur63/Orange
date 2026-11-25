# Orange Golf Cameroun

Site vitrine des rendez-vous golf d’Orange Cameroun : Golf Open Day à Douala et Orange Golf Experience à Kribi.

## Démarrage

```bash
npm install
npm run dev
```

`npm run build && npm run start` pour la version de production.

## Configuration

Copier `.env.example` vers `.env.local` et renseigner :

- `NEXT_PUBLIC_SITE_URL` : URL canonique **complète** du site, par exemple `https://orange-golf.cm` ou `https://orange-golf.vercel.app`. Ne pas saisir un joker (`*.vercel.app`) : la valeur est ignorée et le build utilise alors l’URL Vercel du déploiement, puis `https://orange-golf.cm`.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` : domaine de l’instance Plausible. Le script n’est injecté qu’après consentement ; aucune donnée n’est chargée si la variable est absente.

Ces deux variables sont **publiques** par conception. Ne jamais placer de clé secrète dans une variable `NEXT_PUBLIC_*` ni dans un composant client.

## HTTPS

`proxy.ts` redirige en HTTPS (308) toute requête HTTP arrivant avec `x-forwarded-proto: http` sur un domaine autre que `localhost`, et `next.config.ts` ajoute l’en-tête HSTS en production. Selon l’hébergement :

- **Vercel / Cloudflare** : HTTPS est géré par la plateforme ; vérifier que « Always Use HTTPS » est actif. Aucune action supplémentaire.
- **Reverse proxy (Nginx, Caddy)** : terminer TLS sur le proxy, transmettre `X-Forwarded-Proto: https` et rediriger le port 80 vers HTTPS.
- **Node nu derrière un load balancer** : configurer la redirection HTTP→HTTPS sur le load balancer pour éviter toute requête en clair.

## Formulaires et anti-spam

`POST /api/register` valide les champs côté serveur, applique un champ honeypot, un délai minimum de remplissage et une limite de 6 demandes / 10 min / IP (en mémoire, par instance). Le formulaire n’envoie pas encore d’email : brancher le service souhaité dans le route handler.

## Mesure d’audience

Plausible, sans cookies, chargé uniquement après acceptation du bandeau. Le choix est mémorisé dans `localStorage` et peut être modifié via « Gérer les cookies » dans le footer.

## Assets

Les photos sont converties en WebP optimisé dans `public/`. L’image de partage social est générée par la convention `app/opengraph-image.png` (et `twitter-image.png`).
