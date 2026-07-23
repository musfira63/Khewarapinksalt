/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";

export const CrystalVein: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const getVeinDescription = () => {
    switch (hoveredPoint) {
      case "core":
        return "Deepest Vein (800 ft) - Ultra-compressed pure rose-pink crystal. High density and perfect mineral integrity.";
      case "mid":
        return "Medium Depth (450 ft) - The Crystal Halls. Rich banding of deep reds and light peach hues.";
      case "top":
        return "Upper Vein (150 ft) - Soft blush pink. Flaky structure, ideal for premium bath salts.";
      default:
        return "Hover over the crystal layers to inspect the subterranean geology of the Khewra mine.";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-ink-2/30 p-6 rounded-lg border border-cream/5 backdrop-blur-sm">
      <div className="relative w-full aspect-square max-w-[340px] md:max-w-[400px]">
        <svg viewBox="0 0 400 420" width="100%" className="w-full h-full select-none" id="crystalVeinSvg">
          <defs>
            <linearGradient id="tunnelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E221A" />
              <stop offset="100%" stopColor="#1C1410" />
            </linearGradient>
            <radialGradient id="torchGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4CFC7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#E8935C" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#E8935C" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background tunnel */}
          <rect x="0" y="0" width="400" height="420" rx="12" fill="url(#tunnelGrad)" />

          {/* Floating miner's headlamp glow */}
          <motion.circle
            r="120"
            fill="url(#torchGrad)"
            animate={{
              cx: [150, 250, 180, 220, 150],
              cy: [160, 240, 280, 140, 160],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Outermost crystal layer (Upper Seam) */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint("top")}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <polygon
              points="200,60 260,180 200,300 140,180"
              fill="none"
              stroke="#E8A9A0"
              strokeWidth={hoveredPoint === "top" ? 3 : 1.4}
              opacity={hoveredPoint === "top" ? 0.9 : 0.45}
              className="transition-all duration-300"
            />
          </g>

          {/* Middle crystal layer (Mid Seam) */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint("mid")}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <polygon
              points="200,110 240,190 200,270 160,190"
              fill="none"
              stroke="#E8935C"
              strokeWidth={hoveredPoint === "mid" ? 3 : 1.4}
              opacity={hoveredPoint === "mid" ? 0.95 : 0.6}
              className="transition-all duration-300"
            />
          </g>

          {/* Core crystal layer (Deepest Seam) */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint("core")}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <motion.polygon
              points="200,150 222,190 200,230 178,190"
              fill="#E8A9A0"
              opacity={hoveredPoint === "core" ? 1 : 0.8}
              stroke="#EDE3D6"
              strokeWidth={hoveredPoint === "core" ? 2 : 0}
              animate={hoveredPoint === "core" ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "200px 190px" }}
            />
          </g>

          {/* Structural grid lines */}
          <line x1="200" y1="20" x2="200" y2="60" stroke="#8C6B60" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
          <line x1="200" y1="300" x2="200" y2="400" stroke="#8C6B60" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
          <line x1="60" y1="180" x2="140" y2="180" stroke="#8C6B60" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
          <line x1="260" y1="180" x2="340" y2="180" stroke="#8C6B60" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />

          {/* Text markers */}
          <text x="200" y="395" textAnchor="middle" fill="#9C8C7E" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="0.05em">
            CROSS-SECTION — GEOLOGICAL CHASM
          </text>
        </svg>
      </div>

      <div className="mt-4 text-center max-w-[280px]">
        <p className="font-mono text-[11px] text-salt-pink uppercase tracking-widest mb-1.5" id="vein-status">
          {hoveredPoint ? `${hoveredPoint.toUpperCase()} SEAM ACTIVE` : "TUNNEL SCANNER"}
        </p>
        <p className="text-xs text-stone leading-relaxed min-h-[48px]" id="vein-desc">
          {getVeinDescription()}
        </p>
      </div>
    </div>
  );
};
