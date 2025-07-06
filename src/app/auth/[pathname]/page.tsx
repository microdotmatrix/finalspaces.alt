import { getSession } from "@/lib/auth/server";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
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
    const { session } = await getSession();
    if (!session?.user) redirect("/auth/login?redirectTo=/auth/settings");
  }

  return (
    <main className="flex flex-col grow p-4 items-center justify-center">
      <AuthView pathname={pathname} />
    </main>
  );
}
