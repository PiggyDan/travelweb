import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/shared/legal-document-view";
import { PageHero } from "@/components/shared/page-hero";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getLegalDocument, getPageImages } from "@/services/content-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/booking-terms">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const document = await getLegalDocument("booking-terms");
  return buildPageMetadata({ locale, path: routes.bookingTerms, title: document.title, description: document.summary });
}

export default async function BookingTermsPage({ params }: PageProps<"/[locale]/booking-terms">) {
  await resolveLocale(params);
  const [document, images] = await Promise.all([getLegalDocument("booking-terms"), getPageImages()]);
  return (
    <>
      <PageHero eyebrow="Support" title={document.title} description={document.summary} image={images.legalHero} />
      <LegalDocumentView document={document} />
    </>
  );
}
