"use client";

import './marquee-brands.css';

interface MarqueeBrandsProps {
  items: string[];
  speed?: number;
}

export default function MarqueeBrands({ items, speed = 30 }: MarqueeBrandsProps) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];
  return (
    <div className="marquee-container">
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((name, i) => (
          <span key={`${name}-${i}`} className="marquee-item">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
