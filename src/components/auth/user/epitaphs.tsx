import { Icon } from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchImage } from "@/lib/api/placid";
import { getSession } from "@/lib/auth/server";
import { getUserGeneratedImages } from "@/lib/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export async function UserEpitaphs() {
  const { session } = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const userId = session.user.id;
  const images = await getUserGeneratedImages(userId);
  return (
    <div className="flex flex-col gap-2 min-h-80">
      <h3>Recent Epitaphs</h3>
      <ScrollArea className="flex-1 max-h-[calc(100vh-180px)] 2xl:max-h-[calc(100vh-48px)] overflow-y-auto  rounded-md border">
        {images.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 flex-1">
            <Icon icon="ph:image-thin" className="size-12" />
            <p className="text-muted-foreground">
              Click the + button to create an epitaph
            </p>
          </div>
        )}
        <ul className="grid grid-cols-1 sm:grid-cols-2 sm:[&>li]:nth-[3n+1]:col-span-2 lg:grid-cols-2 2xl:grid-cols-3 gap-2 lg:[&>li]:nth-[3n+1]:col-span-2 2xl:[&>li]:nth-[3n+1]:col-span-1">
          {images.map((image) => (
            <li key={image.id}>
              <Suspense
                fallback={
                  <div className="size-full aspect-square bg-muted animate-pulse" />
                }
              >
                <EpitaphThumbnail epitaphId={image.epitaphId} />
              </Suspense>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

async function EpitaphThumbnail({ epitaphId }: { epitaphId: number }) {
  const image = await fetchImage(epitaphId);
  return (
    <figure className="relative overflow-hidden aspect-square">
      <Image
        src={image.image_url}
        alt={image.id.toString()}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover size-full"
      />
    </figure>
  );
}
