import { HeroSection } from "@/components/sections/hero";
import { MemorialSection } from "@/components/sections/memorial";
import { ObituarySection } from "@/components/sections/obituary";
import { QuotesSection } from "@/components/sections/quotes";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <HeroSection />

      {/* Obituary Writer Section */}
      <section id="obituary-writer" className="py-24 lg:py-48 px-4 md:px-6">
        <ObituarySection />
      </section>

      {/* Quote Generator Section */}
      <section
        id="quote-generator"
        className="py-24 lg:py-48 px-4 md:px-6 bg-secondary/15"
      >
        <QuotesSection />
      </section>

      {/* Memorial Card/Image Creator Section */}
      <section id="memorial-card" className="py-24 lg:py-48 px-4 md:px-6">
        <MemorialSection />
      </section>
    </main>
  );
}
