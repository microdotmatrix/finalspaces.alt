import { ObituaryGeneratorForm } from "@/components/obituary/form";
import { getSession } from "@/lib/auth/server";
import { getUserObituariesDraft } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export const experimental_ppr = true;

export default async function ObituaryPage() {
  const { session } = await getSession();
  if (!session?.user) {
    redirect("/auth/login?redirectTo=/obituaries");
  }

  const obituariesDraft = await getUserObituariesDraft();

  return (
    <main className="flex flex-col justify-center px-2 lg:px-4 py-8">
      <ObituaryGeneratorForm obituariesDraft={obituariesDraft} />
    </main>
  );
}
