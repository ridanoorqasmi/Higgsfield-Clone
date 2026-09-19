"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV_ITEMS = [
  { href: "/", label: "Explore" },
  { href: "/image", label: "Image" },
  { href: "/video", label: "Video" },
  { href: "/assets", label: "Assets" },
] as const;

export function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-hf-border bg-hf-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-3 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo className="h-7 w-7" />
        </Link>

        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors sm:px-3",
                  active
                    ? "text-hf-accent"
                    : "text-hf-muted hover:text-hf-text",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-hf-border bg-hf-surface-2 text-[11px] font-semibold text-hf-muted"
          >
            R
          </button>
        </div>
      </div>
    </header>
  );
}
