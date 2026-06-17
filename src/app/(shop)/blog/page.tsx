import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import RetroStar from "@/components/shop/RetroStar";
import { getContent } from "@/lib/content";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le Journal",
  description:
    "Conseils chien, coulisses de fabrication et histoires de cordes d'escalade recyclées. Le journal de Rosa Malheur.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  await connectDB();

  const t = await getContent();
  const posts = await BlogPost.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .populate("author", "name")
    .lean();

  return (
    <div className="bg-[var(--cream)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b-[2.5px] border-[var(--black)] py-14 md:py-20">
        <RetroStar points={8} className="absolute top-8 left-[8%] w-10 h-10 text-[var(--orange)] hidden sm:block" />
        <RetroStar points={10} className="absolute bottom-8 right-[10%] w-12 h-12 text-[var(--pink-dark)] hidden sm:block" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-5 py-2 text-[12px] font-display font-extrabold uppercase tracking-wide">
            {t("blog_eyebrow")}
          </span>
          <h1 className="mt-6 font-display font-extrabold text-5xl md:text-6xl text-[var(--black)] leading-[0.9]">
            {t("blog_title")} <span className="text-[var(--orange)]">{t("blog_title_accent")}</span>
          </h1>
          <p className="mt-6 text-[16px] text-[var(--black)]/75 font-semibold leading-relaxed max-w-xl mx-auto">
            {t("blog_subtitle")}
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <RetroStar points={8} className="w-14 h-14 text-[var(--pink)] mx-auto mb-5" />
            <p className="font-display font-extrabold text-2xl text-[var(--black)]">
              {t("blog_empty_title")}
            </p>
            <p className="mt-2 text-[var(--black)]/60 font-semibold">
              {t("blog_empty_text")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
            {posts.map((post) => (
              <Link key={String(post._id)} href={`/blog/${post.slug}`} className="group block">
                {post.coverImage && (
                  <div className="relative aspect-[4/5] card-rosa overflow-hidden bg-[var(--pink)] mb-5">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                {post.category && (
                  <span className="inline-block pill-rosa bg-[var(--orange)] text-white px-3 py-1 text-[11px] font-display font-extrabold uppercase tracking-wide mb-3">
                    {post.category}
                  </span>
                )}
                <h2 className="font-display font-extrabold text-2xl text-[var(--black)] leading-tight mb-2 group-hover:text-[var(--orange)] transition">
                  {post.title}
                </h2>
                <p className="text-[14px] text-[var(--black)]/70 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[var(--black)]/50">
                    {post.publishedAt ? formatDate(post.publishedAt) : ""}
                  </span>
                  <span className="font-display font-extrabold uppercase tracking-wide text-[var(--orange)] inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Lire <ArrowRight size={13} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
