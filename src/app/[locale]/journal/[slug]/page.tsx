import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { localeStaticParams, resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { formatDate } from "@/lib/utils";
import { getJournalPostBySlug, getJournalPosts, getPageImages } from "@/services/content-service";

export async function generateStaticParams() {
  const posts = await getJournalPosts();
  return localeStaticParams().flatMap(({ locale }) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/journal/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};
  return buildPageMetadata({
    locale,
    path: routes.journalPost(post.slug),
    title: post.title,
    description: post.excerpt,
    image: post.image,
    type: "article",
  });
}

export default async function JournalPostPage({ params }: PageProps<"/[locale]/journal/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const [post, images] = await Promise.all([getJournalPostBySlug(slug), getPageImages()]);
  if (!post) notFound();

  const breadcrumbs = [
    { name: "Home", path: routes.home },
    { name: "Journal", path: routes.journal },
    { name: post.title, path: routes.journalPost(post.slug) },
  ];

  return (
    <>
      <PageHero
        image={post.image}
        top={<Breadcrumbs items={breadcrumbs} />}
        eyebrow={post.category}
        title={post.title}
        description={
          <p>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}</time>{" "}
            · {post.readingMinutes} min read
          </p>
        }
      />
      <article className="py-20 sm:py-28">
        <Container width="narrow">
          <p className="font-display text-2xl leading-snug font-light text-sky-950 sm:text-3xl">{post.excerpt}</p>
          <div className="mt-12 space-y-10">
            {post.body.map((section, index) => (
              <section key={section.heading ?? index}>
                {section.heading && <h2 className="font-display text-3xl font-light text-sky-950">{section.heading}</h2>}
                <div className="prose-editorial mt-4 text-lg leading-relaxed text-charcoal-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </article>
      <CtaBanner
        title={
          <>
            Ready to see it <span className="italic">for yourself?</span>
          </>
        }
        image={images.finalCta}
        primary={{ label: "Plan my journey", href: routes.tripPlanner }}
        secondary={{ label: "More articles", href: routes.journal }}
      />
      <JsonLd data={breadcrumbJsonLd(locale, breadcrumbs)} />
    </>
  );
}
