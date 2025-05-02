import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="flex gap-4 justify-center">
        <p><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></p>
        <p><Link href="/legal-disclosure" className="hover:underline">Legal Disclosure</Link></p>
        <p><Link href="https://github.com/paviro/Relationship-Menu" className="hover:underline">Source Code</Link></p>
      </div>
    </footer>
  );
} 