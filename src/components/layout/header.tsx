"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserButton } from "@daveyplate/better-auth-ui";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/toggle";
import { Icon } from "../ui/icon";

export const Header = () => {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();

  // Transform scroll position to background opacity
  const backgroundOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
  const backdropBlur = useTransform(scrollY, [0, 50], [0, 12]);

  return (
    <motion.header
      className="sticky w-full top-0 mt-2 z-50 flex items-center justify-between px-4 py-2 lg:py-4 transition-all duration-100"
      style={{
        backgroundColor: useTransform(
          backgroundOpacity,
          (opacity) =>
            `oklch(from var(--color-background) l c h / ${opacity * 0.25})`
        ),
        backdropFilter: useTransform(
          backdropBlur,
          (blur) => `blur(${blur}px) saturate(80%)`
        ),
        borderBottom: useTransform(
          backgroundOpacity,
          (opacity) =>
            `1px solid oklch(from var(--color-muted) l c h / ${opacity * 0.25})`
        ),
      }}
    >
      <section>
        <Link href="/" className="hover:text-primary" aria-label="Home">
          <Icon icon="ph:skull-duotone" className="size-6 md:size-8" />
          <span className="sr-only">Home</span>
        </Link>
      </section>
      <section className="flex items-center gap-4">
        <nav className="flex items-center gap-3 lg:gap-6 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:hover:text-primary [&>a]:transition-colors [&>a]:duration-200 [&>a]:uppercase [&>a]:font-medium">
          <Link
            href="/dashboard/obituaries"
            className={cn(
              "pr-4 border-r",
              pathname.startsWith("/dashboard") ? "text-primary" : ""
            )}
            aria-label="Dashboard"
          >
            <Icon
              icon="mdi:view-dashboard-outline"
              className="size-6 md:size-8"
            />
            <span className="hidden lg:inline">Dashboard</span>
          </Link>
          <Link
            href="/memorials"
            className={cn(
              pathname.startsWith("/memorials") ? "text-primary" : ""
            )}
            aria-label="Memorials"
          >
            <Icon icon="mdi:image-plus-outline" className="size-6 md:size-8" />
            <span className="sr-only">Memorials</span>
          </Link>
          <Link
            href="/quotes"
            className={cn(pathname.startsWith("/quotes") ? "text-primary" : "")}
            aria-label="Quotes"
          >
            <Icon icon="carbon:quotes" className="size-6 md:size-8" />
            <span className="sr-only">Quotes</span>
          </Link>
          <Link
            href="/obituaries"
            className={cn(
              pathname.startsWith("/obituaries") ? "text-primary" : ""
            )}
            aria-label="Obituaries"
          >
            <Icon icon="carbon:new-tab" className="size-6 md:size-8" />
            <span className="sr-only">Obituaries</span>
          </Link>
        </nav>
        <div className="flex items-center gap-2 ml-2 lg:ml-4">
          <div className="pl-2">
            <UserButton
              size={isMobile ? "icon" : "default"}
              align="center"
              classNames={{
                base: "rounded-md border border-input size-9 group",
                trigger: {
                  base: "bg-transparent text-foreground",
                  avatar: {
                    base: "rounded-md bg-background hover:bg-accent group-hover:bg-accent",
                    fallback: "bg-background group-hover:bg-accent",
                  },
                },
              }}
            />
          </div>
          <ThemeToggle />
        </div>
      </section>
    </motion.header>
  );
};
