import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ShowLegendWhenMenuActive from "./components/ShowLegendWhenMenuActive";
// Import temporarily removed due to TypeScript error - fix by ensuring proper module resolution
// import ConditionalSubtitle from "./components/ConditionalSubtitle";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Relationship Menu",
  description: "Create and customize relationship menus for all forms of connection. Define unique relationships through conscious co-creation, whether platonic, familial, professional or romantic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header>
            <div className="title-bar">
              <h1>Relationship Menu</h1>
            </div>
            <ShowLegendWhenMenuActive />
          </header>
          <main className="flex-grow">
            <div className="wrapper">
              {children}
            </div>
          </main>
          <footer>
            <div className="flex gap-4 justify-center">
              <p><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></p>
              <p><Link href="/legal-disclosure" className="hover:underline">Legal Disclosure</Link></p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
