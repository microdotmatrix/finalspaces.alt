import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "@/lib/auth/server";
import { getUserGeneratedImages, getUserUploads } from "@/lib/db/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const experimental_ppr = true;

export default async function DashboardLayout({
  children,
  tabs,
}: {
  children: React.ReactNode;
  tabs: React.ReactNode;
}) {
  const { session } = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;
  const images = await getUserGeneratedImages(userId);
  const userUploads = await getUserUploads(userId);

  return (
    <main className="px-4 py-12 mx-auto container">
      <div className="flex flex-col gap-6">
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name}
            </p>
          </div>
          <div className="gap-2 items-center hidden lg:flex">
            <Link
              href="/memorials/create"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              <Icon icon="mdi:plus" className="mr-1" /> New Memorial
            </Link>
            <Link
              href="/quotes/search"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              <Icon icon="carbon:quotes" className="mr-1" /> Search Quotes
            </Link>
          </div>
        </header>

        {/* Dashboard Tabs Navigation */}
        <Tabs defaultValue="epitaphs" className="w-full">
          <TabsList className="grid grid-cols-3 w-full lg:max-w-[640px] mb-8">
            <TabsTrigger value="epitaphs" asChild>
              <Link href="/dashboard/epitaphs">Epitaphs</Link>
            </TabsTrigger>
            <TabsTrigger value="uploads" asChild>
              <Link href="/dashboard/uploads">Uploads</Link>
            </TabsTrigger>
            <TabsTrigger value="quotes" asChild>
              <Link href="/dashboard/quotes">Quotes</Link>
            </TabsTrigger>
          </TabsList>

          {/* Tab content will be rendered here via parallel routes */}
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Tabs>

        {/* Recent Activity */}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...images, ...userUploads]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={
                          "epitaphId" in item ? "mdi:image" : "mdi:file-upload"
                        }
                        className="text-muted-foreground size-6"
                      />
                      <span className="text-sm">
                        {"epitaphId" in item
                          ? `Created memorial image #${item.epitaphId}`
                          : `Uploaded ${item.fileName}`}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              {[...images, ...userUploads].length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
