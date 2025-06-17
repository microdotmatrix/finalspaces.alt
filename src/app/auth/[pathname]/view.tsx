"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";

export function AuthView({ pathname }: { pathname: string }) {
  return (
    <AuthCard
      pathname={pathname}
      socialLayout="auto"
      className="container mx-auto"
      classNames={{
        title: "text-2xl",
      }}
    />
  );
}
