import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default function QuotesTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Saved Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px]">
            {/* This would need a component for saved quotes */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon
                icon="carbon:quotes"
                className="size-12 mb-4 text-muted-foreground"
              />
              <p className="text-muted-foreground">
                Your saved quotes will appear here
              </p>
              <Link
                href="/quotes"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "mt-4",
                })}
              >
                Browse Quotes
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
