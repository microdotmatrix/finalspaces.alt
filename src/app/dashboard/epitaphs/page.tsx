import { UserEpitaphs } from "@/components/auth/user/epitaphs";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSession } from "@/lib/auth/server";
import { getUserGeneratedImages } from "@/lib/db/queries";
import Link from "next/link";
import { Suspense } from "react";

export default async function EpitaphsTab() {
  const { session } = await getSession();
  const userId = session!.user.id;
  const images = await getUserGeneratedImages(userId);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Your Memorial Images</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading epitaphs...</div>}>
              <ScrollArea className="h-full max-h-[48rem] overflow-y-auto rounded-md border">
                <UserEpitaphs />
              </ScrollArea>
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Epitaph Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Epitaphs</span>
                <span className="text-2xl font-bold">{images.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Latest Created</span>
                <span className="text-sm text-muted-foreground">
                  {images.length > 0
                    ? new Date(images[0].createdAt).toLocaleDateString()
                    : "None"}
                </span>
              </div>
              <Link
                href="/memorials"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "w-full mt-4",
                })}
              >
                View All Epitaphs
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
