"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/toggle";
import { Icon } from "../ui/icon";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="fixed w-full top-0 z-50 flex items-center justify-between px-4 py-2 lg:py-4">
      <section>
        <Link href="/" className="hidden md:block hover:text-primary">
          <Icon icon="ph:skull-duotone" className="size-9" />
        </Link>
      </section>
      <section className="flex items-center">
        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={cn(
              pathname.startsWith("/dashboard") ? "text-primary" : ""
            )}
          >
            <Icon icon="mdi:view-dashboard-outline" className="size-9" />
          </Link>
          <Link
            href="/memorials"
            className={cn(
              pathname.startsWith("/memorials") ? "text-primary" : ""
            )}
          >
            <Icon icon="mdi:image-plus-outline" className="size-9" />
          </Link>
          <Link
            href="/quotes"
            className={cn(pathname.startsWith("/quotes") ? "text-primary" : "")}
          >
            <Icon icon="carbon:quotes" className="size-9" />
          </Link>
        </nav>
        <div className="flex items-center gap-2 ml-2 lg:ml-4">
          <div className="pl-2">
            <UserButton
              size="default"
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
    </header>
  );
};
