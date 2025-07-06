import { AppContext } from "@/components/context";
import { ScrollUp } from "@/components/elements/scroll-up";
import { ViewportSize } from "@/components/elements/viewport-size";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { body, display, heading, mono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinalSpaces - Digital Epitaphs & Commemorative Media",
  description:
    "FinalSpaces combines compassion, experience in the grieving process, and advanced technology to make the process of dying less overwhelming.",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          body.variable,
          display.variable,
          heading.variable,
          mono.variable,
          "antialiased w-full md:w-auto"
        )}
      >
        <AppContext>
          <Header />
          {children}
          <Footer />
          <ScrollUp />
          {process.env.NODE_ENV === "development" && (
            <ViewportSize align="right" />
          )}
        </AppContext>
      </body>
    </html>
  );
}
