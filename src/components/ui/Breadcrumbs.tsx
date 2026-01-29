"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  admin: "Admin",
  overview: "Overview",
  products: "Products",
  new: "New",
  edit: "Edit"
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 2) return null;

  const parts = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = labelMap[seg] || seg;
    return { href, label, key: href };
  });

  return (
    <nav aria-label="Breadcrumbs" className="mb-4 text-sm text-slate-600">
      <ol className="flex flex-wrap items-center gap-2">
        {parts.map((p, idx) => (
          <li key={p.key} className="flex items-center gap-2">
            {idx === parts.length - 1 ? (
              <span className="font-medium text-slate-900">{p.label}</span>
            ) : (
              <Link href={p.href} className="hover:text-slate-900">
                {p.label}
              </Link>
            )}
            {idx < parts.length - 1 ? <span className="text-slate-400">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

