"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import React from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOpenRoute = pathname.startsWith("/open");
  const isAppRoute = pathname.startsWith("/app");

  if (isOpenRoute) {
    // For /open, render only the page content, no header/footer/wrapper
    return <>{children}</>;
  }

  // For all other routes, render the full site shell
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline focus:outline-2 focus:outline-[var(--main-text-color)]"
      >
        Skip to content
      </a>
      {!isAppRoute && <Header />}
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <div className="wrapper">{children}</div>
      </main>
      <Footer />
    </div>
  );
} 