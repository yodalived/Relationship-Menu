import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '../components/ui/Container';
import { APP_CONFIG } from '../config';

export const metadata: Metadata = {
  title: 'Relationship Menu for iPhone and iPad',
  description:
    'Design your connections. Create unique relationship agreements, free from traditional and societal expectations. iPhone and iPad app with PDF export, encrypted sharing, and web compatibility.',
  alternates: { canonical: '/app' },
  openGraph: {
    title: 'Relationship Menu for iPhone and iPad',
    description:
      'Design your connections. Create unique relationship agreements, free from traditional and societal expectations.',
    url: 'https://relationshipmenu.org/app',
    type: 'website',
  },
  other: {
    'apple-itunes-app': `app-id=${APP_CONFIG.APP_STORE_ID}`,
  },
};

const screenshots = [
  '/app/screenshots/1.jpg',
  '/app/screenshots/2.jpg',
  '/app/screenshots/3.jpg',
  '/app/screenshots/4.jpg',
];

const appStoreUrl = APP_CONFIG.APP_STORE_URL;

export default function IOSAppPage() {
  return (
    <Container>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--main-text-color)]">Relationship Menu for iPhone and iPad</h1>
          </div>
          <div className="p-6">
            <div className="flex flex-col min-[420px]:flex-row items-center min-[420px]:items-start gap-4 md:gap-6">
              <div className="shrink-0 mb-3 min-[420px]:mb-0">
                <Image src="/app/icon.png" alt="Relationship Menu App icon" width={96} height={96} />
              </div>
              <div className="space-y-4 flex-1">
                <p className="text-[rgba(79,139,149,1)] font-semibold text-xs uppercase tracking-wide text-center min-[420px]:text-left">Design your connections</p>
                <div className="pl-4 border-l-4 border-[var(--main-bg-color)] italic space-y-3">
                  <p className="text-gray-600 dark:text-white/90 leading-relaxed text-base md:text-[17px]">
                    Think of relationships as customizable recipes — you and others select ingredients from the menu that appeal to your tastes and preferences. The resulting dish becomes your unique relationship.
                  </p>
                  <p className="text-gray-600 dark:text-white/90 leading-relaxed text-base md:text-[17px]">
                    Relationship Menus can be used for all forms of connection — whether platonic, familial, professional, or romantic. They are designed to bring clarity to how we define our relationships, moving beyond unspoken assumptions.
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-1 justify-center min-[420px]:justify-start">
                  <Link href={appStoreUrl} target="_blank" rel="noopener" className="inline-flex items-center my-3 md:my-4">
                    <Image src="/app/app_store_light.svg" alt="Download on the App Store" width={240} height={72} className="h-12 md:h-14 w-auto block dark:hidden" />
                    <Image src="/app/app_store_dark.svg" alt="Download on the App Store" width={240} height={72} className="h-12 md:h-14 w-auto hidden dark:block" />
                  </Link>
                  <span className="text-xs text-[rgba(79,139,149,1)]">Free • No tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Screenshots card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4">
              <h2 className="text-xl font-bold text-[var(--main-text-color)]">Screenshots</h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{scrollbarWidth: 'thin'}}>
                  {screenshots.map((src, idx) => (
                    <div key={src} className="snap-center shrink-0 rounded-xl overflow-hidden border border-[var(--main-bg-color)] dark:border-gray-700">
                      <Image src={src} alt={`App screenshot ${idx + 1}`} width={900} height={1958} className="w-[260px] md:w-[320px] h-auto" />
                    </div>
                  ))}
                </div>
                <div className="text-xs text-[rgba(79,139,149,1)] mt-2">Swipe to view more</div>
              </div>
            </div>
          </div>

          {/* Features card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4">
              <h2 className="text-xl font-bold text-[var(--main-text-color)]">Features</h2>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[var(--main-text-color)] dark:text-[var(--main-text-color)]">Comprehensive Menu Builder</h3>
              <ul className="mt-3 list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                <li>Pre-built romantic/sexual template adaptable to your needs</li>
                <li>More templates coming soon</li>
                <li>20+ categories: communication, intimacy, finances, caregiving, autonomy, commitment</li>
                <li>Intuitive preferences: Must Have, Would Like, Maybe, Prefer Not, Off-Limit</li>
              </ul>

              <h3 className="mt-6 text-lg font-semibold text-[var(--main-text-color)] dark:text-[var(--main-text-color)]">Personalised Notes</h3>
              <ul className="mt-3 list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                <li>Add notes to any item for context or to summarise conversations</li>
              </ul>

              <h3 className="mt-6 text-lg font-semibold text-[var(--main-text-color)] dark:text-[var(--main-text-color)]">Privacy & Security</h3>
              <ul className="mt-3 list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                <li>All information stored locally on your device</li>
                <li>100% no tracking or data collection</li>
              </ul>

              <h3 className="mt-6 text-lg font-semibold text-[var(--main-text-color)] dark:text-[var(--main-text-color)]">Export & Sharing</h3>
              <ul className="mt-3 list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                <li>Generate beautiful PDF exports for printing or sharing</li>
                <li>Share safely via end-to-end encrypted link</li>
                <li>Full compatibility with the web version</li>
                <li>JSON encoded file import/export</li>
              </ul>

              <h3 className="mt-6 text-lg font-semibold text-[var(--main-text-color)] dark:text-[var(--main-text-color)]">International</h3>
              <ul className="mt-3 list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                <li>Supports multiple languages including English and German</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Apple trademark credit (very small) */}
        <div className="mt-6 md:mt-8 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Apple, the Apple logo, iPhone, iPad, Mac, Apple Watch, Apple TV, App Store, and Mac App Store are trademarks of Apple Inc., registered in the U.S. and other countries and regions.
          </p>
        </div>
      </div>
    </Container>
  );
}


