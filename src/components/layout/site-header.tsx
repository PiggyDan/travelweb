"use client";

import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LocaleLink, useLocale } from "@/components/shared/locale-link";
import { buttonClasses } from "@/components/ui/button";
import { localizePath } from "@/lib/i18n";
import type { NavItem } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./language-selector";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";

interface SiteHeaderProps {
  primary: readonly NavItem[];
  secondary: readonly NavItem[];
}

/**
 * Transparent over the hero, solid ivory once the page scrolls past it.
 * Every page begins with a dark hero, so light text is safe at the top.
 */
export function SiteHeader({ primary, secondary }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    // Over the pinned home hero, stay transparent until the hero has played through.
    const pinnedHero = document.querySelector<HTMLElement>("[data-hero-pin]");
    const onScroll = () => {
      const threshold = pinnedHero ? pinnedHero.offsetTop + pinnedHero.offsetHeight - window.innerHeight : 24;
      setScrolled(window.scrollY > Math.max(threshold, 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => {
      const localized = localizePath(locale, href.split("?")[0] ?? href);
      return pathname === localized || pathname.startsWith(`${localized}/`);
    },
    [locale, pathname],
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500",
          scrolled
            ? "bg-felt-100/95 text-sky-950 shadow-[0_1px_0_rgba(11,21,34,0.08)] backdrop-blur-md"
            : "bg-transparent text-white",
        )}
      >
        <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Logo />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1 xl:gap-3">
              {primary.map((item) => (
                <li key={item.href}>
                  <LocaleLink
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="relative inline-flex min-h-11 items-center px-3 text-[0.8125rem] font-medium tracking-wide after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                  >
                    {item.label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              aria-haspopup="dialog"
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full transition-colors",
                scrolled ? "hover:bg-sky-950/5" : "hover:bg-white/10",
              )}
            >
              <Search aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
            <ThemeToggle className={scrolled ? "hover:bg-sky-950/5" : "hover:bg-white/10"} />
            <LanguageSelector className="hidden sm:block" tone={scrolled ? "dark" : "light"} />
            <div className="ml-2 hidden md:block">
              <LocaleLink href={routes.tripPlanner} className={buttonClasses(scrolled ? "dark" : "light", "md", "whitespace-nowrap")}>
                Plan your trip
              </LocaleLink>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full transition-colors xl:hidden",
                scrolled ? "hover:bg-sky-950/5" : "hover:bg-white/10",
              )}
            >
              <Menu aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} primary={primary} secondary={secondary} isActive={isActive} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}
