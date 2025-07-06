import { ObituaryGeneratorForm } from "@/components/obituary/form";
import { getSession } from "@/lib/auth/server";
import { getUserObituariesDraft } from "@/lib/db/queries";
import { Suspense } from "react";

export const experimental_ppr = false;

export default async function ObituaryPage() {
  const { session } = await getSession();

  const obituariesDraft = await getUserObituariesDraft();

  return (
    <main className="flex flex-col justify-center px-2 lg:px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        {session?.user ? (
          <ObituaryGeneratorForm obituariesDraft={obituariesDraft} />
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">
              You must be logged in to access this page.
            </p>
          </div>
        )}
      </Suspense>
    </main>
  );
}
