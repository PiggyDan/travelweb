"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/common";

interface ParallaxImageProps {
  image: ImageAsset;
  sizes: string;
  priority?: boolean;
  /** How far the image drifts, as a percentage of its frame (keep ≤ 9). */
  strength?: number;
  className?: string;
}

/**
 * A `fill` image that drifts against the scroll inside its (overflow-hidden)
 * parent. It is slightly oversized so the edges never show.
 */
export function ParallaxImage({ image, sizes, priority, strength = 8, className }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0 will-change-transform">
        <Image src={image.src} alt={image.alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}
