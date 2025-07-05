"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { deleteImage } from "@/lib/actions/images";
import type { PlacidImage } from "@/lib/api/placid";
import { cn, downloadImage } from "@/lib/utils";
import Image from "next/image";
import { useTransition } from "react";

export const EpitaphThumbnail = ({ image }: { image: PlacidImage }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteImage(image.id.toString());
    });
  };

  return (
    <figure className="relative overflow-hidden aspect-square">
      <Image
        src={image?.image_url}
        alt="Generated epitaph"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover size-full"
      />
      <figcaption className="absolute bottom-2 left-2 z-10 flex flex-col items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="p-2.5 lg:p-2 rounded-sm transition-colors"
          disabled={isPending}
          onClick={() => downloadImage(image.image_url, `epitaph-${image.id}`)}
        >
          <Icon icon="carbon:download" className="size-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("p-2.5 lg:p-2 rounded-sm transition-colors", {
            "opacity-50 cursor-not-allowed": isPending,
          })}
          disabled={isPending}
          onClick={handleDelete}
        >
          <Icon icon="mdi:delete" className="size-8" />
        </Button>
      </figcaption>
    </figure>
  );
};
