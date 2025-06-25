import { cn } from "@/lib/utils";

export function ViewportSize({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div
      data-viewport-size=""
      className={cn(
        "fixed bottom-2 z-50 flex size-8 items-center justify-center rounded-full bg-gray-800 p-3 font-mono font-bold text-xs text-white",
        align === "left" ? "left-2" : "right-2"
      )}
    >
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
