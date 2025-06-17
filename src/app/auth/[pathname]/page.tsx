import { auth } from "@/lib/auth";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthView } from "./view";

export function generateStaticParams() {
  return Object.values(authViewPaths).map((pathname) => ({ pathname }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const { pathname } = await params;

  if (pathname === "settings") {
    const sessionData = await auth.api.getSession({ headers: await headers() });
    if (!sessionData) redirect("/auth/login?redirectTo=/auth/settings");
  }

  return (
    <main className="flex flex-col grow p-4 items-center justify-center">
      <AuthView pathname={pathname} />
    </main>
  );
}
