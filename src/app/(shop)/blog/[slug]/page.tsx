import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
  if (!post) return { title: "Article non trouvé" };

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  const post = await BlogPost.findOne({ slug, isPublished: true })
    .populate("author", "name")
    .lean();

  if (!post) notFound();

  // Articles connexes (autres articles publiés)
  const related = await BlogPost.find({
    isPublished: true,
    slug: { $ne: post.slug },
  })
    .sort({ publishedAt: -1 })
    .limit(2)
    .lean();

  return (
    <div className="bg-[var(--cream)]">
      {/* Header */}
      <section className="border-b-[2.5px] border-[var(--black)] py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-8 hover:opacity-70 transition"
          >
            <ArrowLeft size={14} strokeWidth={2.5} /> Retour au journal
          </Link>
          {post.category && (
            <div className="mb-5">
              <span className="inline-block pill-rosa bg-[var(--orange)] text-white px-3 py-1 text-[11px] font-display font-extrabold uppercase tracking-wide">
                {post.category}
              </span>
            </div>
          )}
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[var(--black)] leading-[0.95]">
            {post.title}
          </h1>
          <div className="w-12 h-1 rounded-full bg-[var(--orange)] mx-auto mt-7 mb-6" />
          <div className="flex items-center justify-center gap-3 text-[12px] font-serif italic text-gray-500">
            <span>{(post.author as unknown as { name: string })?.name}</span>
            <span className="text-[var(--brand-gold)]/60">·</span>
            <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
          </div>
        </div>
      </section>

      {/* Cover */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-12 mb-12 md:mb-16 relative z-10">
          <div className="relative aspect-[16/9] card-rosa bg-[var(--pink)] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      )}

      {/* JSON-LD Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            ...(post.coverImage && { image: post.coverImage }),
            author: {
              "@type": "Person",
              name: (post.author as unknown as { name: string })?.name,
            },
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
          }),
        }}
      />

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-14 md:pb-20">
        <div
          className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[15px] prose-p:leading-[1.85] prose-p:text-gray-700 prose-li:text-[15px] prose-li:text-gray-700 prose-li:leading-[1.85] prose-a:text-[var(--brand-gold)] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-em:text-gray-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-[var(--black)]/10">
            <p className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-4">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] font-bold text-[var(--black)] pill-rosa px-3 py-1.5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Articles connexes */}
      {related.length > 0 && (
        <section className="border-t-[2.5px] border-[var(--black)] py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--black)]">
                Autres articles
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-12">
              {related.map((r) => (
                <Link
                  key={String(r._id)}
                  href={`/blog/${r.slug}`}
                  className="group block"
                >
                  {r.coverImage && (
                    <div className="relative aspect-[16/10] card-rosa overflow-hidden bg-[var(--pink)] mb-4">
                      <Image
                        src={r.coverImage}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  {r.category && (
                    <span className="inline-block pill-rosa bg-[var(--orange)] text-white px-3 py-1 text-[11px] font-display font-extrabold uppercase tracking-wide mb-2">
                      {r.category}
                    </span>
                  )}
                  <h3 className="font-display font-extrabold text-2xl text-[var(--black)] leading-tight mb-3 group-hover:text-[var(--orange)] transition">
                    {r.title}
                  </h3>
                  <span className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Lire <ArrowRight size={13} strokeWidth={2.5} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
