"use client";

import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { HeroChapter, HeroVideo } from "@/types/content";
import { HeroContent } from "./hero-content";

/** Share of the pinned scroll spent on chapters; the rest reveals the closing call to action. */
const CHAPTERS_END = 0.86;

/**
 * Home hero pinned for several screens of scroll. Scrolling scrubs through
 * the journey like film, summer through to winter: chapter photos zoom and dissolve into one another
 * (or a video's playhead follows the scroll, when one is provided), the
 * intro copy lifts away, chapter titles pass by and a call to action closes.
 * Reduced-motion users get a single still hero.
 */
export function ScrollHero({ chapters, video }: { chapters: HeroChapter[]; video?: HeroVideo }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35 });

  const [active, setActive] = useState(-1);
  const segment = CHAPTERS_END / chapters.length;
  useMotionValueEvent(progress, "change", (value) => {
    const next = value >= CHAPTERS_END ? chapters.length : value < 0.1 ? -1 : Math.floor(value / segment);
    setActive((current) => (current === next ? current : next));
  });

  const copyOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  const copyY = useTransform(progress, [0, 0.1], [0, -60]);
  const copyPointer = useTransform(progress, (v) => (v < 0.06 ? "auto" : "none"));
  const cueOpacity = useTransform(progress, [0, 0.04], [1, 0]);
  const ctaOpacity = useTransform(progress, [CHAPTERS_END, CHAPTERS_END + 0.08], [0, 1]);
  const ctaY = useTransform(progress, [CHAPTERS_END, CHAPTERS_END + 0.08], [40, 0]);
  const ctaPointer = useTransform(progress, (v) => (v > CHAPTERS_END + 0.04 ? "auto" : "none"));
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  const first = chapters[0];
  if (!first) return null;

  if (reduceMotion) {
    return (
      <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-sky-950 text-white">
        <Image src={first.image.src} alt={first.image.alt} fill priority sizes="100vw" className="-z-20 object-cover" />
        <Shades />
        <Container className="pt-32 pb-24 sm:pb-28 lg:pb-32">
          <HeroContent />
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} data-hero-pin className="relative h-[500svh] bg-sky-950 text-white">
      <div className="sticky top-0 isolate flex h-svh items-end overflow-hidden">
        {video ? (
          <ScrubVideo video={video} poster={first.image.src} progress={progress} />
        ) : (
          chapters.map((chapter, index) => (
            <ChapterFrame key={chapter.label} chapter={chapter} index={index} segment={segment} progress={progress} />
          ))
        )}
        <Shades />
        <Snowfall progress={progress} start={CHAPTERS_END - segment * 1.25} />

        {/* Chapter titles that pass through the centre as you scroll. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {chapters.map((chapter, index) => (
            <ChapterTitle key={chapter.label} chapter={chapter} index={index} segment={segment} progress={progress} />
          ))}
        </div>

        <motion.div style={{ opacity: copyOpacity, y: copyY, pointerEvents: copyPointer }} className="w-full">
          <Container className="pt-32 pb-24 sm:pb-28 lg:pb-32">
            <HeroContent />
          </Container>
        </motion.div>

        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}
          className="absolute inset-x-0 bottom-0"
        >
          <Container className="flex flex-col items-center pb-24 text-center sm:pb-28">
            <p className="eyebrow text-copper-300">Your journey starts here</p>
            <p className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] font-light tracking-tight text-balance sm:text-6xl">
              Where will the steppe take you?
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <ButtonLink href={routes.tours} variant="light">
                Explore tours
              </ButtonLink>
              <ButtonLink href={routes.tripPlanner} variant="outline-light">
                Design my journey
              </ButtonLink>
            </div>
          </Container>
        </motion.div>

        {/* Chapter index. */}
        <ol aria-hidden className="absolute top-1/2 right-6 hidden -translate-y-1/2 space-y-4 text-right md:block lg:right-12">
          {chapters.map((chapter, index) => (
            <li
              key={chapter.label}
              className={cn(
                "font-display text-lg transition-colors duration-500",
                index === active ? "text-copper-300" : "text-white/40",
              )}
            >
              <span className="mr-3 font-sans text-[0.6875rem] tracking-[0.2em] text-white/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              {chapter.label}
            </li>
          ))}
        </ol>

        <motion.a
          href="#intro"
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.625rem] font-semibold tracking-[0.3em] text-white/80 uppercase hover:text-white sm:flex"
        >
          Scroll
          <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-white/20">
            <span className="absolute inset-0 animate-scroll-cue bg-white" />
          </span>
        </motion.a>

        <motion.div
          aria-hidden
          style={{ scaleX: barScale }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-copper-300/80"
        />
      </div>
    </section>
  );
}

function Shades() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-sky-950/95 via-sky-950/30 to-sky-950/45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-sky-950/55 via-transparent to-transparent" />
    </>
  );
}

interface ChapterProps {
  chapter: HeroChapter;
  index: number;
  segment: number;
  progress: MotionValue<number>;
}

/** One photo: it dissolves in over the previous one and keeps slowly pushing in and drifting. */
function ChapterFrame({ chapter, index, segment, progress }: ChapterProps) {
  const start = index * segment;
  const fade = segment * 0.35;
  const opacity = useTransform(progress, [start - fade, start], index === 0 ? [1, 1] : [0, 1]);
  const scale = useTransform(progress, [start - fade, start + segment + fade], [1.06, 1.3]);
  const drift = index % 2 === 0 ? -3 : 3;
  const x = useTransform(progress, [start - fade, start + segment + fade], ["0%", `${drift}%`]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 -z-20">
      <motion.div style={{ scale, x }} className="absolute inset-0 will-change-transform">
        <Image
          src={chapter.image.src}
          alt={index === 0 ? chapter.image.alt : ""}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

function ChapterTitle({ chapter, index, segment, progress }: ChapterProps) {
  const start = Math.max(index * segment, 0.1);
  const end = (index + 1) * segment;
  const ramp = Math.min(0.05, (end - start) / 4);
  const range = [start, start + ramp, end - ramp, end];
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [60, 0, 0, -60]);
  const letterSpacing = useTransform(progress, range, ["0.02em", "-0.01em", "-0.02em", "-0.04em"]);

  return (
    <motion.div style={{ opacity, y }} className="absolute px-6 text-center">
      <p className="eyebrow text-copper-300">
        {String(index + 1).padStart(2, "0")} — {chapter.caption}
      </p>
      <motion.p
        style={{ letterSpacing }}
        className="mt-4 max-w-5xl font-display text-6xl leading-[0.95] font-light text-balance italic sm:text-7xl lg:text-[8.5rem]"
      >
        {chapter.label}
      </motion.p>
    </motion.div>
  );
}

/**
 * Falling snow that settles in as the scroll reaches the winter scenes. Three
 * tiled layers of soft dots drift at different speeds for depth.
 */
function Snowfall({ progress, start }: { progress: MotionValue<number>; start: number }) {
  const opacity = useTransform(progress, [start, start + 0.12], [0, 1]);
  return (
    <motion.div aria-hidden style={{ opacity }} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="snow-layer animate-snow-near" />
      <div className="snow-layer snow-layer--mid animate-snow-mid" />
      <div className="snow-layer snow-layer--far animate-snow-far" />
    </motion.div>
  );
}

/**
 * Video whose playhead follows the scroll. For smooth seeking, encode the clip
 * with frequent keyframes, e.g. `ffmpeg -i in.mp4 -an -c:v libx264 -g 6 -crf 24 out.mp4`.
 */
function ScrubVideo({ video, poster, progress }: { video: HeroVideo; poster: string; progress: MotionValue<number> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useMotionValueEvent(progress, "change", (value) => {
    const element = ref.current;
    if (!element?.duration) return;
    target.current = Math.min(value / CHAPTERS_END, 1) * (element.duration - 0.05);
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      if (Math.abs(element.currentTime - target.current) > 0.03) element.currentTime = target.current;
    });
  });

  return (
    <video
      ref={ref}
      muted
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden
      className="absolute inset-0 -z-20 h-full w-full object-cover"
    >
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
