import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center py-6 text-gray-500 dark:text-gray-400">
      <div className="border-t border-gray-300 dark:border-gray-700 w-4/5 mx-auto mt-5 mb-2.5 pt-5">
        <div className="flex gap-4 justify-center">
          <p><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></p>
          <p><Link href="/legal-disclosure" className="hover:underline">Legal Disclosure</Link></p>
          <p><Link href="https://github.com/paviro/Relationship-Menu" className="hover:underline">Source Code</Link></p>
        </div>
      </div>
    </footer>
  );
} 