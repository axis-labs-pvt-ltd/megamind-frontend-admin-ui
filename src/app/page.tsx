// Server Component - Public landing page
import { FAQSection } from '@/components/landing/FAQSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowSection } from '@/components/landing/HowSection';
import { IndividualTestsSection } from '@/components/landing/IndividualTestsSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { PaletteSwitcher } from '@/components/landing/PaletteSwitcher';
import { PricingSection } from '@/components/landing/PricingSection';
import { QuizPreviewSection } from '@/components/landing/QuizPreviewSection';
import { SubjectsSection } from '@/components/landing/SubjectsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>
      <LandingNav />
      <HeroSection />
      <HowSection />
      <SubjectsSection />
      <IndividualTestsSection />
      <QuizPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <LandingFooter />
      <PaletteSwitcher />
    </div>
  );
}
