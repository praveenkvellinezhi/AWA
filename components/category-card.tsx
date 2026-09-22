import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

const defaultImageMap: Record<string, string> = {
  "cat-image-gen": "/images/categories/image-gen.jpg",
  "cat-video-gen": "/images/categories/video-gen.jpg",
  "cat-website-making": "/images/categories/website-making.jpg",
  "cat-slides-presentations": "/images/categories/slides.jpg",
  "cat-poster-design": "/images/categories/poster.jpg",
};

export function CategoryCard({ category }: CategoryCardProps) {
  const imageSrc =
    category.imageUrl ||
    defaultImageMap[category.id] ||
    "/images/categories/image-gen.jpg";

  return (
    <Link
      href={`/categories/${category.id}`}
      className="group relative block w-full h-44 sm:h-48 lg:h-52 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-lg transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Full-Bleed Background Image */}
      <img
        src={imageSrc}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Dark Gradient Overlay Scrim for Crisp Contrast (Matching Reference) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-300 pointer-events-none" />

      {/* Overlay Text at Bottom Left */}
      <div
        className="category-card-overlay absolute inset-x-0 bottom-0 p-3.5 sm:p-4 flex flex-col justify-end z-10"
        data-media-overlay
      >
        {/* Template Count (e.g. '5 TEMPLATES') */}
        <span
          className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider !text-white/85 drop-shadow-sm"
          style={{ color: "rgba(255, 255, 255, 0.85)" }}
        >
          {category.templateCount}{" "}
          {category.templateCount === 1 ? "TEMPLATE" : "TEMPLATES"}
        </span>

        {/* Category Name (e.g. 'IMAGE GENERATION') */}
        <h3
          className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-wide !text-white drop-shadow-md mt-0.5 leading-tight transition-colors"
          style={{ color: "#FFFFFF" }}
        >
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
