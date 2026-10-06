import type { Metadata, Viewport } from "next";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { themeInitScript } from "@/components/layout/theme-toggle";
import { JsonLd } from "@/components/shared/json-ld";
import { MotionProvider } from "@/components/shared/motion-provider";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { localeStaticParams, resolveLocale } from "@/lib/locale-params";
import { buildAlternates } from "@/lib/metadata";
import { footerNavigation, mainNavigation, secondaryNavigation } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { organizationJsonLd } from "@/lib/structured-data";
import { display, sans } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return localeStaticParams();
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — Journeys across Mongolia`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    alternates: buildAlternates("/", locale),
    openGraph: {
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: siteConfig.ogImage.src, width: siteConfig.ogImage.width, height: siteConfig.ogImage.height, alt: siteConfig.ogImage.alt }],
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b1522",
  colorScheme: "light dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);

  return (
    // The theme script adds `dark` to <html> before hydration.
    <html lang={locale} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-svh flex-col antialiased">
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-felt-50 px-5 py-3 text-sm font-semibold text-sky-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <MotionProvider>
          <SiteHeader primary={mainNavigation} secondary={secondaryNavigation} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter groups={footerNavigation} />
          <ChatWidget />
        </MotionProvider>
        <JsonLd data={organizationJsonLd(locale)} />
      </body>
    </html>
  );
}
