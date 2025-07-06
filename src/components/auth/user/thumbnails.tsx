"use client";

import { Icon } from "@/components/ui/icon";
import { deleteFile } from "@/lib/actions/uploads";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function UserThumbnails({
  file,
}: {
  file: { id: string; url: string; name: string; createdAt: Date; key: string };
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = () => {
    startTransition(async () => {
      await deleteFile(file.key);
      startTransition(() => router.refresh());
    });
  };
  return (
    <figure className="relative overflow-clip group aspect-square @container/thumbnail">
      <Image
        src={file.url}
        alt={file.name}
        width={640}
        height={640}
        className="object-cover size-full"
      />
      <figcaption className="absolute bottom-0.5 right-0.5 text-xs text-center text-white bg-black/50 py-1 px-1.5 group-hover:opacity-100 opacity-50 transition-opacity">
        {format(file.createdAt, "MM/dd/yyyy")}
      </figcaption>
      <button
        className="absolute top-0.5 right-0.5 z-50 p-1 rounded-md bg-background opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete Upload"
      >
        {isPending ? (
          <Icon icon="mdi:loading" className="animate-spin size-3" />
        ) : (
          <Icon icon="mdi:close" className="size-3" />
        )}
        <span className="sr-only">Delete Upload</span>
      </button>
    </figure>
  );
}
