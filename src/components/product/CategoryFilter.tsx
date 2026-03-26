"use client";

import clsx from "clsx";

type Category = "all" | "bowls" | "chopsticks" | "cups" | "knives";

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: Category;
  onChange: (cat: Category) => void;
}) {
  const categories: { value: Category; label: string }[] = [
    { value: "bowls", label: "Bowls" },
    { value: "cups", label: "Cups" },
    { value: "chopsticks", label: "Chopsticks" },
    { value: "knives", label: "Knives" },
    { value: "all", label: "Browse All" },
  ];

  return (
    <div className="flex gap-1">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={clsx(
            "px-4 py-2 text-sm tracking-wide transition-colors",
            active === cat.value
              ? "bg-charcoal text-warm-white"
              : "text-stone-dark hover:text-charcoal hover:bg-cream"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
