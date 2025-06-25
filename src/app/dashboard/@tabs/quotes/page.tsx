import { SavedQuotes } from "@/components/quotes/saved";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

// Loading skeleton for saved quotes
function SavedQuotesSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-full bg-muted animate-pulse mb-4"></div>
      <div className="h-4 w-48 bg-muted animate-pulse mb-2"></div>
      <div className="h-4 w-32 bg-muted animate-pulse mb-4"></div>
      <div className="h-8 w-28 bg-muted animate-pulse rounded-md"></div>
    </div>
  );
}

export default function QuotesTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Saved Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px]">
            <Suspense fallback={<SavedQuotesSkeleton />}>
              <SavedQuotes />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
