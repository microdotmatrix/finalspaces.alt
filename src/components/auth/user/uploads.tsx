import { getUserUploads } from "@/lib/db/queries";
import { UserThumbnails } from "./thumbnails";

export async function UserUploads({ userId }: { userId: string }) {
  const files = await getUserUploads(userId);

  if (files.length === 0) {
    return (
      <p className="mt-2 text-sm text-muted-foreground">
        You have no images saved
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {[...files]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((file) => (
          <UserThumbnails
            key={file.id}
            file={{
              id: file.id,
              url: file.url,
              name: file.fileName,
              createdAt: file.createdAt,
              key: file.storageKey,
            }}
          />
        ))}
    </div>
  );
}
