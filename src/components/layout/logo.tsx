import Image from "next/image";
import { LocaleLink } from "@/components/shared/locale-link";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import logo from "../../../public/images/dolgion-tour-logo.svg";

/** Shared Dolgion’s Tour brand mark. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <LocaleLink
      href={routes.home}
      onClick={onClick}
      aria-label="Dolgion’s Tour — home"
      className={cn("inline-flex shrink-0", className)}
    >
      <Image src={logo} alt="Dolgion’s Tour — Mongolian Expedition" priority className="h-16 w-auto sm:h-[4.5rem]" />
    </LocaleLink>
  );
}
