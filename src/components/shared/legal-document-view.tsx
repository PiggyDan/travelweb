import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/utils";
import type { LegalDocument } from "@/types/content";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <article className="py-20 sm:py-28">
      <Container width="narrow">
        <p className="rounded-2xl bg-sand-100 px-5 py-4 text-sm text-sand-700">
          Draft — this document is a placeholder and will be finalised before bookings open.
        </p>
        <p className="mt-10 text-sm text-charcoal-500">
          Last updated <time dateTime={document.updatedAt}>{formatDate(document.updatedAt)}</time>
        </p>
        <div className="mt-8 space-y-10">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-light text-sky-950 sm:text-3xl">{section.heading}</h2>
              <div className="prose-editorial mt-4 leading-relaxed text-charcoal-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
