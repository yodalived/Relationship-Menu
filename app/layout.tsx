import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ui/Toast";
import LayoutWrapper from "./components/LayoutWrapper";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <ToastProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
