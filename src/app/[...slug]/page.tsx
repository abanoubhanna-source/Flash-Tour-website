import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardCmsPage } from "@/components/StandardCmsPage";
import { getPublishedPageContent } from "@/lib/cms/pages/public";

function pathFromSlug(slug: string[]) {
  return `/${slug.map(encodeURIComponent).join("/")}`;
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  const content = await getPublishedPageContent(path);
  if (!content) return {};

  return {
    title: content.seo?.title || content.hero.title,
    description: content.seo?.description || content.hero.subtitle,
    alternates: content.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default async function CmsWebsitePage({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const content = await getPublishedPageContent(pathFromSlug(slug));
  if (!content) notFound();

  return <StandardCmsPage hero={content.hero} />;
}
