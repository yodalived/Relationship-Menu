import { Container } from '../components/ui/Container';

export const dynamic = 'force-static';

export default function SupportPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--main-text-color)] mb-4">Support</h1>
          <div className="w-24 h-1 bg-[var(--main-bg-color)] mx-auto rounded-full"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4">
            <h2 className="text-xl font-bold text-[var(--main-text-color)]">Contact</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-700 dark:text-gray-300">You can reach me by email:</p>
            <p>
              <a href="mailto:paul-vincent@relationshipmenu.org" className="text-[var(--main-text-color)] hover:underline">
                paul-vincent@relationshipmenu.org
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Please note: Relationship Menu is a one-person project that I maintain in my spare time. I try to respond to every message, but replies might not be instant. Thanks for your patience and understanding.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}


