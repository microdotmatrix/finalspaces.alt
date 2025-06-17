import { CreateImage } from "@/components/media/memorial/create-image";
import { ImageResult } from "@/components/media/memorial/image-result";
import { createEpitaphs, getEpitaphImage } from "@/lib/api/actions";
import type { PlacidImage } from "@/lib/api/placid";
import { getSession } from "@/lib/auth/server";
import { getUserUploads } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const experimental_ppr = true;

export default async function Create({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const imageIds = id ? id.split(",").map((id) => Number(id)) : [];

  let images: PlacidImage[] = [];

  if (imageIds.length > 0) {
    images = (await Promise.all(
      imageIds.map(async (id) => await getEpitaphImage(id))
    )) as PlacidImage[];
  }
  const { session } = await getSession();
  if (!session) redirect("/auth/login?redirectTo=/create");

  const userId = session.user.id;
  const uploads = await getUserUploads(userId);

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center relative">
      <aside className="flex-none lg:flex-1/3 lg:sticky lg:top-48 mt-12 lg:mt-48 order-2 lg:order-1">
        <CreateImage
          action={createEpitaphs}
          userId={userId}
          uploads={uploads}
        />
      </aside>
      <article className="flex-1 lg:flex-2/3 px-4 order-1 lg:order-2">
        <Suspense fallback={<div>Loading...</div>}>
          {imageIds.length > 0 ? (
            <div className=" grid grid-cols-1 md:grid-cols-1 gap-2">
              {images &&
                images.map((image) => (
                  <ImageResult
                    key={image.id}
                    id={image.id}
                    initialImageData={image}
                  />
                ))}
            </div>
          ) : (
            <div className="grid place-content-center h-full">
              <h3 className="text-center py-12">
                Complete the form to generate your epitaph
              </h3>
            </div>
          )}
        </Suspense>
      </article>
    </div>
  );
}
