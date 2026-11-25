import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/** Police du site vitrine, auto-hébergée et préchargée (plus de requête Google Fonts). */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const title = `${SITE_NAME} — Golf Open Day Douala & Orange Golf Experience Kribi`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: [
    "Orange Golf Cameroun",
    "Golf Open Day Douala",
    "Orange Golf Experience Kribi",
    "golf Cameroun",
    "inscription golf Douala Kribi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CM",
    url: SITE_URL,
    siteName: SITE_NAME,
    title,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
