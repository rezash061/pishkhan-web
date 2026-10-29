import Link from "next/link";
import { blogCategories } from "@/content/blog";

export function CategoryNav({ active, allLabel, label }: { active: string | null; allLabel: string; label: string }) {
  const pill = (on: boolean) => `rounded-full px-4 py-2 text-sm font-bold ${on ? "bg-brand-600 text-white" : "border border-border bg-surface hover:bg-surface-2"}`;
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/blog" className={pill(active === null)} aria-current={active === null ? "page" : undefined}>
            {allLabel}
          </Link>
        </li>
        {blogCategories.map((c) => (
          <li key={c.slug}>
            <Link href={`/blog/category/${c.slug}`} className={pill(active === c.slug)} aria-current={active === c.slug ? "page" : undefined}>
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
