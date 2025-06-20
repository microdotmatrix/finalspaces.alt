import { UserUploads } from "@/components/auth/user/uploads";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { getSession } from "@/lib/auth/server";
import { getUserUploads } from "@/lib/db/queries";
import Link from "next/link";
import { Suspense } from "react";

export default async function UploadsTab() {
  const { session } = await getSession();
  const userId = session!.user.id;
  const uploads = await getUserUploads(userId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading uploads...</div>}>
            <div className="min-h-[300px]">
              {uploads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Icon
                    icon="mdi:cloud-upload-outline"
                    className="size-12 mb-4 text-muted-foreground"
                  />
                  <p className="text-muted-foreground">
                    You haven't uploaded any images yet
                  </p>
                  <Link
                    href="/memorials/create"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "mt-4",
                    })}
                  >
                    Upload Images
                  </Link>
                </div>
              ) : (
                <UserUploads userId={userId} />
              )}
            </div>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
