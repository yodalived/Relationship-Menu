import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ui/Toast";
// Import temporarily removed due to TypeScript error - fix by ensuring proper module resolution
// import ConditionalSubtitle from "./components/ConditionalSubtitle";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Relationship Menu - Reflect on and Define Your Relationships",
  description: "Reflect on and define your romantic, platonic, familial, or professional relationships through shared dialogue — explore shared needs, wants, and boundaries.",
  keywords: [
    "Boundaries",
    "Collaborative Relationships",
    "Customizable Relationships",
    "ENM",
    "ENM Relationship",
    "Ethical Non-Monogamy",
    "Ethical Non-Monogamy",
    "Monogamy",
    "Needs and Wants",
    "Non-Escalator Relationship",
    "Non-Escalator Relationship Menu",
    "Non-Monogamy",
    "Polyamory",
    "Relationship",
    "Relationship Agreement",
    "Relationship Anarchy",
    "Relationship Anarchy Smorgasbord",
    "Relationship Boundaries",
    "Relationship Definition",
    "Relationship Dialogue",
    "Relationship Frameworks",
    "Relationship Menu",
    "Relationship Reflection"
  ],
  creator: "Paul-Vincent Roll",
  formatDetection: {
    email: false,
    telephone: true,
    address: false,
  },
  metadataBase: new URL("https://relationshipmenu.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Relationship Menu - Reflect on and Define Your Relationships",
    description: "Reflect on and define your romantic, platonic, familial, or professional relationships through shared dialogue — explore shared needs, wants, and boundaries.",
    url: "https://relationshipmenu.org",
    siteName: "Relationship Menu",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            {/* Skip to content link for keyboard users */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline focus:outline-2 focus:outline-[var(--main-text-color)]"
            >
              Skip to content
            </a>
            
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              <div className="wrapper">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
