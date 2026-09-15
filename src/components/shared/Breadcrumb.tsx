"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb({ name }: { name?: string }) {
  const pathname = usePathname() || "/";

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 md:my-5 my-3">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-black">
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");

          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <li key={href} className="flex items-center gap-2">
              <span>›</span>
              <Link
                href={href}
                className={`capitalize from-foreground ${index === segments.length - 1 ? "font-semibold text-foreground" : ""}`}
              >
                {name && index === segments.length - 1 ? name : label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
