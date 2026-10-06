import Image from "next/image";
import { LocaleLink } from "@/components/shared/locale-link";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import logo from "../../../public/images/logo.png";

/** Brand mark. The artwork is a transparent PNG and renders without a backdrop. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <LocaleLink
      href={routes.home}
      onClick={onClick}
      aria-label="Eternal Sky Tour — home"
      className={cn("inline-flex shrink-0", className)}
    >
      <Image src={logo} alt="Eternal Sky Tour — Mongolian Expedition" priority className="h-16 w-auto sm:h-[4.5rem]" />
    </LocaleLink>
  );
}
