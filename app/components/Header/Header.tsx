'use client';

import ShowLegendWhenMenuActive from './ShowLegendWhenMenuActive';
import ConditionalSubtitle from './ConditionalSubtitle';

export default function Header() {
  return (
    <header>
      <div className="title-bar">
        <h1>Relationship Menu</h1>
        <ConditionalSubtitle />
      </div>
      <ShowLegendWhenMenuActive />
    </header>
  );
} 