import { UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { ThemeToggle } from "../theme/toggle";
import { Icon } from "../ui/icon";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4">
      <section>
        <Link href="/">
          <Icon icon="line-md:home" className="size-8" />
        </Link>
      </section>
      <section className="flex gap-2 items-center">
        <Link href="/memorials">
          <Icon icon="mdi:image-plus-outline" className="size-8" />
        </Link>
        <Link href="/quotes">
          <Icon icon="carbon:quotes" className="size-8" />
        </Link>
        <ThemeToggle />
        <UserButton
          size="icon"
          classNames={{
            base: "rounded-md border border-border",
            trigger: {
              avatar: {
                base: "rounded-md",
              },
            },
          }}
        />
      </section>
    </header>
  );
};
