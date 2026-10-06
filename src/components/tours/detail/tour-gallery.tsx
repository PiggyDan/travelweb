import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/common";
import { TourSection } from "./tour-section";

/** Editorial image grid: the first image spans two columns. */
export function TourGallery({ images }: { images: readonly ImageAsset[] }) {
  if (images.length === 0) return null;
  return (
    <TourSection id="gallery" eyebrow="Gallery" title="Moments along the way">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4">
        {images.map((image, index) => (
          <li
            key={image.src}
            className={cn(
              "relative overflow-hidden rounded-[1.25rem]",
              // The first image is wide; so is the last one if it would otherwise sit alone.
              index === 0 || (index === images.length - 1 && images.length % 2 === 0)
                ? "col-span-2 aspect-[16/9]"
                : "aspect-square sm:aspect-[4/3]",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={index === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 50vw"}
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </TourSection>
  );
}
