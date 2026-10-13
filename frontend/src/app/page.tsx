import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";

export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-[#080B12]">
      <LandingHeader />

      <main>
        <LandingHero />
        <LandingFeatures />
      </main>

      <LandingFooter />
    </div>
  );
}
