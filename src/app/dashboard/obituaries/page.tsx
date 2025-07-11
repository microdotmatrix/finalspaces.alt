import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { getUserObituaries, getUserObituariesDraft } from "@/lib/db/queries";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export const experimental_ppr = false;

export default async function ObituariesDashboard() {
  const [obituaries, drafts] = await Promise.all([
    getUserObituaries(),
    getUserObituariesDraft(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="mb-6">
          <h3 className="flex items-center gap-4 font-bold tracking-tight">
            My Obituaries
            {obituaries.length > 0 && (
              <Badge variant="secondary" className="font-sans tracking-normal">
                {obituaries.length}
              </Badge>
            )}
          </h3>
          <p className="text-muted-foreground">
            Manage your created obituaries and saved drafts
          </p>
        </div>
        <Link
          href="/obituaries"
          className={buttonVariants({
            variant: "default",
          })}
        >
          <Icon icon="lucide:plus" className="size-4" />
          <span className="sr-only">Create New</span>
        </Link>
      </div>

      {/* Recent Obituaries */}
      <section className="space-y-4">
        {obituaries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icon
                icon="lucide:file-text"
                className="h-12 w-12 text-muted-foreground mb-4"
              />
              <h3 className="text-lg font-medium mb-2">No obituaries yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first obituary to see it here
              </p>
              <Link
                href="/obituaries"
                className={buttonVariants({ variant: "default" })}
              >
                <Icon icon="lucide:plus" className="h-4 w-4 mr-2" />
                Create Obituary
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {obituaries.map((obituary) => (
              <Card key={obituary.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">
                        {obituary.fullName}
                      </CardTitle>
                      <Badge variant="outline" className="w-fit">
                        <Icon icon="lucide:clock" className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(obituary.createdAt), {
                          addSuffix: true,
                        })}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    <Link
                      href={`/obituaries/${obituary.id}`}
                      className={buttonVariants({
                        variant: "default",
                        size: "sm",
                      })}
                    >
                      <Icon
                        icon="lucide:eye"
                        className="size-3 md:size-4 mr-1"
                      />
                      Read
                    </Link>
                    <Link
                      href={`/obituaries/${obituary.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <Icon
                        icon="lucide:edit"
                        className="size-3 md:size-4 mr-1"
                      />
                      Edit
                    </Link>
                    <Link
                      href={`/obituaries/${obituary.id}/share`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <Icon
                        icon="lucide:share"
                        className="size-3 md:size-4 mr-1"
                      />
                      Share
                    </Link>
                    <Button size="sm" variant="destructive">
                      <Icon
                        icon="lucide:trash"
                        className="size-3 md:size-4 mr-1"
                      />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Saved Drafts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:file-edit" className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Saved Drafts</h2>
          {drafts.length > 0 && (
            <Badge variant="secondary">{drafts.length}</Badge>
          )}
        </div>

        {drafts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Icon
                icon="lucide:file-edit"
                className="h-8 w-8 text-muted-foreground mb-3"
              />
              <h3 className="font-medium mb-1">No saved drafts</h3>
              <p className="text-muted-foreground text-sm text-center">
                Your saved drafts will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => {
              const fullName = draft.inputData?.fullName || "Untitled Draft";
              const updatedAt = formatDistanceToNow(new Date(draft.updatedAt), {
                addSuffix: true,
              });

              return (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="lucide:file-edit"
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <div>
                      <p className="font-medium">{fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        Last updated {updatedAt}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/obituaries?draftId=${draft.id}`}>
                      <Icon icon="lucide:play" className="h-4 w-4 mr-1" />
                      Resume
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
