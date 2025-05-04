'use client';

import ShowLegendWhenMenuActive from './ShowLegendWhenMenuActive';
import ConditionalSubtitle from './ConditionalSubtitle';

export default function Header() {
  return (
    <header className="bg-[#94BCC2] dark:bg-[rgba(45,85,95,0.85)] text-white font-bold text-xl sticky top-0 z-10 shadow-md">
      <div className="flex flex-col items-center justify-center text-center px-5 py-2.5 w-full">
        <h1 className="m-0 text-4xl leading-normal">Relationship Menu</h1>
        <ConditionalSubtitle />
      </div>
      <ShowLegendWhenMenuActive />
    </header>
  );
} 