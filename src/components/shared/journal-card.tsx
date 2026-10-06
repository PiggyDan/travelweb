import Image from "next/image";
import { routes } from "@/lib/routes";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/content";
import { LocaleLink } from "./locale-link";

interface JournalCardProps {
  post: BlogPost;
  variant?: "feature" | "compact" | "row";
  headingLevel?: "h2" | "h3";
}

export function JournalCard({ post, variant = "compact", headingLevel: Heading = "h3" }: JournalCardProps) {
  const feature = variant === "feature";
  if (variant === "row") {
    return (
      <article className="group relative grid grid-cols-[7rem_1fr] items-start gap-5 sm:grid-cols-[10rem_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-[1.25rem]">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] motion-safe:group-hover:scale-105"
          />
        </div>
        <div>
          <div className="flex items-center gap-3 text-xs font-medium text-charcoal-500">
            <span className="eyebrow text-copper-600">{post.category}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
          <Heading className="mt-2 font-display text-xl leading-tight font-normal text-sky-950 sm:text-2xl">
            <LocaleLink
              href={routes.journalPost(post.slug)}
              className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-[1.25rem] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-copper-500"
            >
              {post.title}
            </LocaleLink>
          </Heading>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal-600">{post.excerpt}</p>
        </div>
      </article>
    );
  }
  return (
    <article className="group relative flex h-full flex-col">
      <div className={cn("relative overflow-hidden rounded-[1.5rem]", feature ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes={feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-center gap-3 text-xs font-medium text-charcoal-500">
        <span className="eyebrow text-copper-600">{post.category}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </div>
      <Heading
        className={cn(
          "mt-3 font-display leading-tight font-normal text-sky-950",
          feature ? "text-3xl sm:text-4xl" : "text-2xl",
        )}
      >
        <LocaleLink
          href={routes.journalPost(post.slug)}
          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-[1.5rem] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-copper-500"
        >
          {post.title}
        </LocaleLink>
      </Heading>
      <p className={cn("mt-3 leading-relaxed text-charcoal-600", feature ? "text-base" : "line-clamp-3 text-sm")}>
        {post.excerpt}
      </p>
    </article>
  );
}
