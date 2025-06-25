"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userUpload } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { UploadThingError } from "uploadthing/server";
import type { UploadFileResult } from "uploadthing/types";
import { utapi } from "../api/uploads";
import { CACHE_TAGS } from "../constants";

export async function deleteFile(key: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new UploadThingError("Unauthorized");
  }
  try {
    await utapi.deleteFiles(key);
    await db.delete(userUpload).where(eq(userUpload.storageKey, key));

    revalidatePath("/auth");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Error deleting file");
  }
}

export async function uploadFile(prevState: unknown, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new UploadThingError("Unauthorized");
  }

  const files = formData.getAll("files") as File[] | string[];
  let uploadResults: UploadFileResult[];
  if (files.some((file) => typeof file === "string")) {
    uploadResults = await utapi.uploadFilesFromUrl(files as string[]);
  } else {
    uploadResults = await utapi.uploadFiles(files as File[]);
  }

  if (uploadResults.every((result) => result.error !== null)) {
    return {
      success: false as const,
      error: "Failed to upload some files",
    };
  }

  revalidateTag(CACHE_TAGS.LIST_FILES);

  const uploadedCount = uploadResults.filter(
    (result) => result.data != null
  ).length;

  return {
    success: uploadedCount === uploadResults.length,
    uploadedCount,
  };
}
