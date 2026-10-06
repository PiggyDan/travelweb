"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const ease = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 1.1, delay, ease } }),
};

/** Text and actions of the home hero, with a restrained staggered entrance. */
export function HeroContent() {
  return (
    <div className="max-w-5xl">
      <motion.p
        variants={rise}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="eyebrow mb-6 text-copper-300"
      >
        Mongolia · Land of the eternal blue sky
      </motion.p>
      <h1 className="font-display text-[3.25rem] leading-[0.95] font-light tracking-tight text-balance sm:text-7xl lg:text-8xl xl:text-[7.5rem]">
        <motion.span variants={rise} initial="hidden" animate="visible" custom={0.25} className="block">
          The sky is
        </motion.span>
        <motion.span
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="block italic text-sand-200"
        >
          the only border.
        </motion.span>
      </h1>
      <motion.p
        variants={rise}
        initial="hidden"
        animate="visible"
        custom={0.6}
        className="mt-8 max-w-xl text-base leading-relaxed text-sky-50/90 sm:text-lg"
      >
        Eternal Sky Tour crafts unhurried journeys through deserts, mountains and open steppe —
        guided by Mongolians, welcomed by nomadic families, and shaped entirely around you.
      </motion.p>
      <motion.div
        variants={rise}
        initial="hidden"
        animate="visible"
        custom={0.75}
        className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
      >
        <ButtonLink href={routes.tours} variant="light">
          Explore tours
        </ButtonLink>
        <ButtonLink href={routes.tripPlanner} variant="outline-light">
          Design my journey
        </ButtonLink>
      </motion.div>
    </div>
  );
}
