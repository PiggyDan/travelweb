import { NewsletterForm } from "@/components/forms/newsletter-form";
import { LocaleLink } from "@/components/shared/locale-link";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/shared/social-icons";
import { Container } from "@/components/ui/container";
import type { NavGroup } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { LanguageSelector } from "./language-selector";
import { Logo } from "./logo";

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YouTubeIcon },
];

export function SiteFooter({ groups }: { groups: readonly NavGroup[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sky-950 text-felt-50">
      <Container className="pt-20 pb-10 lg:pt-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-8 max-w-sm font-display text-2xl leading-snug font-light text-sky-50">
              {siteConfig.tagline}
            </p>
            <address className="mt-8 space-y-1 text-sm text-sky-200 not-italic">
              <p>{siteConfig.contact.address}</p>
              <p>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                  {siteConfig.contact.email}
                </a>
              </p>
            </address>
            <div className="mt-10">
              <NewsletterForm />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="eyebrow text-copper-300">{group.title}</h2>
                <ul className="mt-5 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <LocaleLink
                        href={item.href}
                        className="inline-flex min-h-10 items-center text-sm text-sky-100 transition-colors hover:text-white"
                      >
                        {item.label}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex items-center gap-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${siteConfig.name} on ${label}`}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-sky-100 transition-colors hover:border-white/60 hover:text-white"
                >
                  <Icon className="size-[1.125rem]" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 text-xs text-sky-300 sm:flex-row sm:items-center sm:gap-6">
            <LanguageSelector placement="top" className="-ml-3 sm:ml-0" />
            <LocaleLink href={`${routes.gallery}#credits`} className="hover:text-white">
              Photo credits
            </LocaleLink>
            <p>
              © {year} {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
