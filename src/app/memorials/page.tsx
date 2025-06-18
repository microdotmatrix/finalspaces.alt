import { UserEpitaphs } from "@/components/auth/user/epitaphs";
import { UserUploads } from "@/components/auth/user/uploads";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getSession } from "@/lib/auth/server";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const experimental_ppr = true;

export default async function Memorials() {
  const { session } = await getSession();

  return (
    <main className="flex flex-col justify-center px-2 lg:px-4 py-8">
      {session ? (
        <>
          <section className="flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-24 lg:py-0">
              <p>Welcome back, {session.user.name}</p>
              <Link
                href="/memorials/create"
                className={buttonVariants({
                  variant: "default",
                  size: "icon",
                })}
              >
                <Icon icon="mdi:plus" />
              </Link>
            </div>
            <div className="flex-2 w-full">
              <UserEpitaphs />
            </div>
          </section>
          <section className="py-12 max-w-3xl mx-auto">
            <h5 className="font-semibold">Your Uploads:</h5>
            <Suspense fallback={<div>Loading...</div>}>
              <UserUploads userId={session.user.id} />
            </Suspense>
          </section>
        </>
      ) : (
        <div className="flex flex-col gap-2 max-w-xl mx-auto py-12">
          <figure className="relative overflow-clip w-full aspect-square border border-border rounded-lg mb-8">
            <Image
              src="/images/image-generate.png"
              alt="Image Generate"
              fill
              className="object-contain size-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </figure>
          <p>Please login or register to create an epitaph</p>
          <div className="flex gap-2 mx-auto">
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "default" })}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className={buttonVariants({ variant: "secondary" })}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
