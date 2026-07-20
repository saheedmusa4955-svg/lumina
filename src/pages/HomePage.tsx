import { HeroSection } from '@/sections/home/HeroSection';
import { FeaturesSection } from '@/sections/home/FeaturesSection';
import { PricingSection } from '@/sections/home/PricingSection';
import { IntegrationsSection } from '@/sections/home/IntegrationsSection';
import { TestimonialsSection } from '@/sections/home/TestimonialsSection';
import { FaqSection } from '@/sections/home/FaqSection';
import { CtaSection } from '@/sections/home/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
