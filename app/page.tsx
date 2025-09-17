import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from './components/ui/Container';
import { LoadingIndicator } from './components/ui/LoadingIndicator';
import DynamicContent from './components/LandingPage/DynamicContent';
import { AboutSection } from './components/LandingPage/AboutSection';
import { GettingStartedSection } from './components/LandingPage/GettingStartedSection';
import { PrivacySection } from './components/LandingPage/PrivacySection';
import { AttributionSection } from './components/LandingPage/AttributionSection';
import { AppPromoSection } from './components/LandingPage/AppPromoSection';

export const metadata: Metadata = {
  other: {
    'apple-itunes-app': 'app-id=6746169721',
  },
};

export default function Home() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        {/* Dynamic content inside Suspense boundary */}
        <Suspense fallback={<LoadingIndicator message="Loading..." />}>
          <DynamicContent />
        </Suspense>

        {/* Static Info Cards - Displayed in a grid layout */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* About this tool - Left column */}
          <AboutSection />
          
          {/* Right column - stacked cards */}
          <div className="space-y-8">
            {/* Getting Started - Top right */}
            <GettingStartedSection />
            
            {/* Privacy Information - Bottom right */}
            <PrivacySection />
          </div>
        </div>
        
        {/* Full-width iOS app promo below the grid */}
        <div className="mt-8">
          <AppPromoSection />
        </div>
        
        {/* Attribution */}
        <AttributionSection />
      </div>
    </Container>
  );
}
