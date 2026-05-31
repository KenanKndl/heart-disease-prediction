"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "Prediction",
    href: "/predict",
  },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-6">
        {/* Sol Kısım: Logo ve Yeni Marka İsmi */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background shadow-sm transition-colors group-hover:bg-muted/60">
            <Activity className="h-4.5 w-4.5 text-foreground" strokeWidth={1.8} />
          </div>

          {/* text-sm yerine text-lg yapıldı */}
          <span className="text-lg font-bold tracking-tight text-foreground">
            LUMINA<span className="text-muted-foreground/60">.ai</span>
          </span>
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                {item.label}

                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full origin-center scale-x-0 bg-foreground transition-transform duration-200",
                    isActive && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobil Navigasyon */}
        <nav className="flex items-center gap-1 rounded-full border border-border/50 bg-background/70 p-1 shadow-sm md:hidden">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                  isActive && "bg-muted text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}