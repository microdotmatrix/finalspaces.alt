import { uploadRouter } from "@/lib/api/uploads";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { connection } from "next/server";
import { Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";
import { AuthProvider } from "./auth/provider";
import { ThemeProvider } from "./theme/provider";
import { Toaster } from "./ui/sonner";

async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />;
}

export const AppContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
        <Suspense fallback={null}>
          <UTSSR />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
};
