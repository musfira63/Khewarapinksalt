/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";

interface DepthMarker {
  id: string;
  label: string;
  depth: string;
  topPct: number;
}

const MARKERS: DepthMarker[] = [
  { id: "hero", label: "Surface", depth: "0 ft", topPct: 0 },
  { id: "origin", label: "First Seams", depth: "150 ft", topPct: 28 },
  { id: "minerals", label: "Crystal Halls", depth: "450 ft", topPct: 56 },
  { id: "craft", label: "Khewara Selection", depth: "800 ft", topPct: 82 },
];

export const DepthRail: React.FC = () => {
  const [activeId, setActiveId] = useState("hero");
  const [depthVal, setDepthVal] = useState(0);
  const [fillHeight, setFillHeight] = useState("0%");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      
      // Calculate continuous percentage scrolled of the total page
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      
      // Interpolate depth value continuously up to 1,250 ft deep
      const currentDepth = Math.round(pct * 1250);
      setDepthVal(currentDepth);
      setFillHeight(`${pct * 100}%`);

      let currentActive = "hero";
      for (const m of MARKERS) {
        const el = document.getElementById(m.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            currentActive = m.id;
          }
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once at start
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      id="depthRail"
      className="fixed left-6 md:left-8 top-1/2 -translate-y-1/2 w-14 h-[340px] z-40 hidden lg:flex flex-col items-center select-none"
    >
      <div className="relative w-0.5 flex-1 bg-cream/10 rounded-full">
        {/* Fill bar */}
        <div
          id="depthFill"
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-salt-pink to-rose-deep rounded-full"
          style={{ height: fillHeight }}
        />

        {/* Real-time Glowing Elevator Indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-salt-pink border border-ink shadow-[0_0_10px_#E8A9A0] pointer-events-none transition-all duration-75 flex items-center justify-center"
          style={{ top: fillHeight }}
        >
          <div className="w-1.5 h-1.5 bg-ink rounded-full animate-ping absolute" />
        </div>

        {/* Dynamic ticking circles */}
        {MARKERS.map((m) => {
          const isActive = activeId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleClick(m.id)}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-ink border border-cream/20 hover:scale-135 transition-all duration-300 group focus:outline-none z-10"
              style={{ top: `${m.topPct}%` }}
              title={`${m.label} (${m.depth})`}
              id={`tick-${m.id}`}
            >
              {/* Inner glowing core */}
              <div
                className={`w-1.5 h-1.5 rounded-full mx-auto my-auto mt-[3px] transition-all duration-300 ${
                  isActive
                    ? "bg-salt-pink scale-110 shadow-[0_0_12px_rgba(232,169,160,0.8)]"
                    : "bg-stone/50 group-hover:bg-salt-pink"
                }`}
              />

              {/* Tooltip side label */}
              <span
                className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[11px] tracking-wider transition-all duration-300 pointer-events-none ${
                  isActive
                    ? "opacity-100 text-salt-pink translate-x-1"
                    : "opacity-0 text-stone -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                }`}
              >
                {m.depth} — {m.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 font-mono text-[10px] text-stone text-center leading-tight">
        <span className="block text-xs font-bold text-salt-pink mb-0.5 tabular-nums animate-pulse" id="depthRail-text">
          {depthVal.toLocaleString()} ft
        </span>
        below surface
      </div>
    </div>
  );
};
