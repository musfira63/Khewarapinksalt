/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Layers,
  Sparkles,
  Eye,
  RotateCcw,
  Sun,
  Grid
} from "lucide-react";

interface CrystalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TextureMode = "grain" | "cracks" | "specular" | "prismatic";

export const CrystalModal: React.FC<CrystalModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.8);
  const [grainFrequency, setGrainFrequency] = useState<number>(0.045);
  const [displacementScale, setDisplacementScale] = useState<number>(18);
  const [textureMode, setTextureMode] = useState<TextureMode>("grain");
  const [activeFacet, setActiveFacet] = useState<string | null>("gFace1");
  const [lightAzimuth, setLightAzimuth] = useState<number>(135);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Adjust default parameters based on selected preset texture mode
  const handleTextureModeChange = (mode: TextureMode) => {
    setTextureMode(mode);
    switch (mode) {
      case "grain":
        setGrainFrequency(0.045);
        setDisplacementScale(16);
        break;
      case "cracks":
        setGrainFrequency(0.095);
        setDisplacementScale(28);
        break;
      case "specular":
        setGrainFrequency(0.025);
        setDisplacementScale(10);
        break;
      case "prismatic":
        setGrainFrequency(0.06);
        setDisplacementScale(22);
        break;
    }
  };

  const handleReset = () => {
    setZoomLevel(1.8);
    setGrainFrequency(0.045);
    setDisplacementScale(18);
    setTextureMode("grain");
    setPanOffset({ x: 0, y: 0 });
    setLightAzimuth(135);
  };

  // Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const facetDescriptions: Record<string, { title: string; desc: string; density: string; composition: string }> = {
    gFace1: {
      title: "Apex Rose Facet (North Face)",
      desc: "Ultra-dense halite crystal structure. Displays fine parallel mineral growth striations and high iron oxide saturation.",
      density: "2.17 g/cm³",
      composition: "NaCl 98.9%, Fe₂O₃ 0.08%, Mg 0.03%"
    },
    gFace2: {
      title: "Terracotta Side Facet (East Slope)",
      desc: "Warm amber-terracotta cleavage plane. High concentration of trapped ancient trace minerals giving a fiery glow.",
      density: "2.16 g/cm³",
      composition: "NaCl 98.4%, Fe₂O₃ 0.12%, Ca 0.15%"
    },
    gFace3: {
      title: "Basal Mineral Seam (West Slope)",
      desc: "Deep burgundy-maroon vein interface. Shows micro-cleavage steps formed under subterranean pressure 800ft deep.",
      density: "2.18 g/cm³",
      composition: "NaCl 98.1%, Fe₂O₃ 0.16%, SO₄ 0.22%"
    },
    apexHighlight: {
      title: "Crystal Tip Specular Zone",
      desc: "Micro-polished natural termination point with high light transmissivity and zero internal fracture voids.",
      density: "2.17 g/cm³",
      composition: "NaCl 99.2% (Pristine Termination)"
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-ink/90 backdrop-blur-xl"
      >
        {/* Modal Backdrop overlay click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60"
        />

        {/* Modal Main Dialog Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-ink-2 border border-salt-pink/30 rounded-2xl shadow-[0_0_60px_rgba(232,169,160,0.15)] overflow-hidden flex flex-col max-h-[92vh] z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-ink-3/80 border-b border-cream/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-salt-pink/10 border border-salt-pink/20 text-salt-pink">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg md:text-xl text-cream font-semibold flex items-center gap-2">
                  Khewra Crystal <span className="text-salt-pink italic">Facet Microscope</span>
                </h3>
                <p className="text-[11px] font-mono text-stone tracking-wide">
                  SVG Filter Displacement &amp; Sub-Micron Texture Inspector
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/5 border border-cream/10 text-stone hover:text-cream hover:bg-cream/10 font-mono text-xs transition-all"
                title="Reset Zoom & Filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-cream/5 border border-cream/10 text-cream hover:bg-salt-pink hover:text-ink transition-all duration-200"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto lg:overflow-hidden">
            {/* Left/Main Canvas Viewer */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`lg:col-span-8 bg-ink relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-cream/10 ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              {/* Grid Background Pattern */}
              {showGrid && (
                <div className="absolute inset-0 bg-[radial-gradient(#E8A9A0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
              )}

              {/* Ambient Glow Aura */}
              <div
                className="absolute bg-gradient-to-tr from-rose-deep via-salt-pink to-amber opacity-30 blur-[90px] rounded-full pointer-events-none transition-transform duration-300"
                style={{
                  width: `${300 * zoomLevel}px`,
                  height: `${300 * zoomLevel}px`,
                  transform: `translate(${panOffset.x * 0.5}px, ${panOffset.y * 0.5}px)`
                }}
              />

              {/* Scaled Crystal SVG Container */}
              <div
                className="relative transition-transform duration-100 ease-out select-none flex items-center justify-center"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
                }}
              >
                <svg
                  width="420"
                  height="460"
                  viewBox="0 0 360 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_0_50px_rgba(232,169,160,0.3)]"
                >
                  <defs>
                    {/* SVG FILTER DISPLACEMENT & LIGHTING */}
                    <filter id="facetGrainZoom" x="-30%" y="-30%" width="160%" height="160%">
                      {/* Turbulence creates micro-grain noise */}
                      <feTurbulence
                        type={textureMode === "cracks" ? "turbulence" : "fractalNoise"}
                        baseFrequency={grainFrequency}
                        numOctaves={textureMode === "cracks" ? 5 : 4}
                        result="microNoise"
                      />

                      {/* Displacement map creates textured facet roughness */}
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="microNoise"
                        scale={displacementScale}
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="displacedFacet"
                      />

                      {/* Specular lighting for crystal facet sheen */}
                      <feSpecularLighting
                        in="displacedFacet"
                        surfaceScale={zoomLevel * 3}
                        specularConstant={textureMode === "specular" ? 1.8 : 1.2}
                        specularExponent="28"
                        lightingColor="#EDE3D6"
                        result="specularHighlight"
                      >
                        <feDistantLight azimuth={lightAzimuth} elevation={50} />
                      </feSpecularLighting>

                      <feComposite
                        in="specularHighlight"
                        in2="displacedFacet"
                        operator="in"
                        result="specularMasked"
                      />

                      <feBlend in="displacedFacet" in2="specularMasked" mode="screen" />
                    </filter>

                    {/* Gradient Definitions */}
                    <linearGradient id="modalFace1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F4CFC7" />
                      <stop offset="50%" stopColor="#E8A9A0" />
                      <stop offset="100%" stopColor="#C97B72" />
                    </linearGradient>

                    <linearGradient id="modalFace2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F0B088" />
                      <stop offset="50%" stopColor="#E8935C" />
                      <stop offset="100%" stopColor="#B85C4A" />
                    </linearGradient>

                    <linearGradient id="modalFace3" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8C4A42" />
                      <stop offset="50%" stopColor="#AA584C" />
                      <stop offset="100%" stopColor="#C97B72" />
                    </linearGradient>

                    {/* Fine Micro-Grain Pattern for Overlay */}
                    <pattern id="microLattice" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 0 8 L 8 0 M 0 0 L 8 8" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.15" />
                    </pattern>
                  </defs>

                  {/* CRYSTAL FACET POLYGONS WITH SVG FILTER APPLIED */}
                  <g filter="url(#facetGrainZoom)">
                    {/* Top North Facet */}
                    <polygon
                      points="180,20 260,120 180,175 100,120"
                      fill="url(#modalFace1)"
                      opacity="0.95"
                      stroke={activeFacet === "gFace1" ? "#EDE3D6" : "#E8A9A0"}
                      strokeWidth={activeFacet === "gFace1" ? 2 / zoomLevel : 0.5 / zoomLevel}
                      className="cursor-pointer transition-all duration-200 hover:opacity-100"
                      onClick={() => setActiveFacet("gFace1")}
                    />

                    {/* West Lower Facet */}
                    <polygon
                      points="100,120 180,175 150,260 60,190"
                      fill="url(#modalFace3)"
                      opacity="0.92"
                      stroke={activeFacet === "gFace3" ? "#EDE3D6" : "#C97B72"}
                      strokeWidth={activeFacet === "gFace3" ? 2 / zoomLevel : 0.5 / zoomLevel}
                      className="cursor-pointer transition-all duration-200 hover:opacity-100"
                      onClick={() => setActiveFacet("gFace3")}
                    />

                    {/* East Lower Facet */}
                    <polygon
                      points="260,120 180,175 210,260 300,190"
                      fill="url(#modalFace2)"
                      opacity="0.94"
                      stroke={activeFacet === "gFace2" ? "#EDE3D6" : "#E8935C"}
                      strokeWidth={activeFacet === "gFace2" ? 2 / zoomLevel : 0.5 / zoomLevel}
                      className="cursor-pointer transition-all duration-200 hover:opacity-100"
                      onClick={() => setActiveFacet("gFace2")}
                    />

                    {/* Center Base Pyramidal Facet */}
                    <polygon
                      points="150,260 180,175 210,260 180,380"
                      fill="url(#modalFace1)"
                      opacity="0.88"
                      stroke="#E8A9A0"
                      strokeWidth={0.5 / zoomLevel}
                    />

                    {/* Bottom Left Corner Facet */}
                    <polygon
                      points="60,190 150,260 180,380 100,300"
                      fill="url(#modalFace3)"
                      opacity="0.8"
                      stroke="#8C4A42"
                      strokeWidth={0.5 / zoomLevel}
                    />

                    {/* Bottom Right Corner Facet */}
                    <polygon
                      points="300,190 210,260 180,380 260,300"
                      fill="url(#modalFace2)"
                      opacity="0.82"
                      stroke="#B85C4A"
                      strokeWidth={0.5 / zoomLevel}
                    />

                    {/* Top Apex Specular Reflection Sheen */}
                    <polygon
                      points="180,20 100,120 60,190 130,90"
                      fill="#F4CFC7"
                      opacity={textureMode === "prismatic" ? "0.65" : "0.4"}
                      onClick={() => setActiveFacet("apexHighlight")}
                      className="cursor-pointer"
                    />
                  </g>

                  {/* Micro-Lattice Overlay revealed on high zoom */}
                  {zoomLevel >= 2.2 && (
                    <g pointerEvents="none">
                      <polygon
                        points="180,20 260,120 180,175 100,120"
                        fill="url(#microLattice)"
                        opacity={(zoomLevel - 2) * 0.4}
                      />
                      <polygon
                        points="260,120 180,175 210,260 300,190"
                        fill="url(#microLattice)"
                        opacity={(zoomLevel - 2) * 0.4}
                      />
                      <polygon
                        points="100,120 180,175 150,260 60,190"
                        fill="url(#microLattice)"
                        opacity={(zoomLevel - 2) * 0.4}
                      />
                    </g>
                  )}

                  {/* Micro-mineral impurity particles overlay */}
                  {zoomLevel >= 3 && (
                    <g pointerEvents="none" opacity={(zoomLevel - 2.8) * 0.8}>
                      <circle cx="170" cy="110" r="1.5" fill="#EDE3D6" opacity="0.9" />
                      <circle cx="210" cy="140" r="2" fill="#E8935C" opacity="0.8" />
                      <circle cx="140" cy="210" r="1.2" fill="#FFFFFF" opacity="0.9" />
                      <circle cx="230" cy="220" r="1.8" fill="#C97B72" opacity="0.75" />
                      <circle cx="185" cy="270" r="2.2" fill="#EDE3D6" opacity="0.85" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Floating Overlay Instruction Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="bg-ink-3/90 border border-cream/10 px-3 py-1 rounded-full text-[10px] font-mono text-salt-pink flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <Maximize2 size={11} />
                  Zoom: {(zoomLevel * 100).toFixed(0)}%
                </span>
                <span className="bg-ink-3/90 border border-cream/10 px-3 py-1 rounded-full text-[10px] font-mono text-stone flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <Eye size={11} />
                  Click facet to inspect minerals
                </span>
              </div>

              {/* Quick Floating Zoom Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ink-3/90 border border-cream/10 p-1.5 rounded-full shadow-2xl backdrop-blur-md z-20">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                  className="p-2 rounded-full text-stone hover:text-cream hover:bg-cream/10 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <div className="w-24 px-2 flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-full accent-salt-pink cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(5, z + 0.5))}
                  className="p-2 rounded-full text-stone hover:text-cream hover:bg-cream/10 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <div className="h-4 w-[1px] bg-cream/10 my-auto" />
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded-full transition-colors ${
                    showGrid ? "text-salt-pink bg-salt-pink/10" : "text-stone hover:text-cream"
                  }`}
                  title="Toggle Geological Grid"
                >
                  <Grid size={15} />
                </button>
              </div>
            </div>

            {/* Right Control & Facet Details Inspector Panel */}
            <div className="lg:col-span-4 p-6 bg-ink-2 flex flex-col justify-between gap-6 overflow-y-auto">
              {/* Facet Inspector Details Card */}
              {activeFacet && facetDescriptions[activeFacet] && (
                <div className="bg-ink-3/60 border border-salt-pink/20 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-salt-pink font-semibold bg-salt-pink/10 px-2 py-0.5 rounded">
                      Selected Facet
                    </span>
                    <span className="font-mono text-[10px] text-stone">
                      {facetDescriptions[activeFacet].density}
                    </span>
                  </div>
                  <h4 className="font-serif text-base text-cream font-medium">
                    {facetDescriptions[activeFacet].title}
                  </h4>
                  <p className="text-xs text-stone leading-relaxed">
                    {facetDescriptions[activeFacet].desc}
                  </p>
                  <div className="pt-2 border-t border-cream/5 font-mono text-[10px] text-stone flex justify-between">
                    <span>Mineral Assay:</span>
                    <span className="text-cream">{facetDescriptions[activeFacet].composition}</span>
                  </div>
                </div>
              )}

              {/* SVG Filter Texture Controls */}
              <div className="flex flex-col gap-5">
                <div>
                  <label className="font-mono text-[10px] text-stone uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Sliders size={12} className="text-salt-pink" />
                    SVG Filter Texture Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTextureModeChange("grain")}
                      className={`py-2 px-2.5 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-all ${
                        textureMode === "grain"
                          ? "bg-salt-pink text-ink font-semibold shadow-md"
                          : "bg-ink-3 border border-cream/10 text-stone hover:text-cream"
                      }`}
                    >
                      Halite Grain
                    </button>
                    <button
                      onClick={() => handleTextureModeChange("cracks")}
                      className={`py-2 px-2.5 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-all ${
                        textureMode === "cracks"
                          ? "bg-salt-pink text-ink font-semibold shadow-md"
                          : "bg-ink-3 border border-cream/10 text-stone hover:text-cream"
                      }`}
                    >
                      Vein Micro-Cracks
                    </button>
                    <button
                      onClick={() => handleTextureModeChange("specular")}
                      className={`py-2 px-2.5 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-all ${
                        textureMode === "specular"
                          ? "bg-salt-pink text-ink font-semibold shadow-md"
                          : "bg-ink-3 border border-cream/10 text-stone hover:text-cream"
                      }`}
                    >
                      Facet Specular
                    </button>
                    <button
                      onClick={() => handleTextureModeChange("prismatic")}
                      className={`py-2 px-2.5 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-all ${
                        textureMode === "prismatic"
                          ? "bg-salt-pink text-ink font-semibold shadow-md"
                          : "bg-ink-3 border border-cream/10 text-stone hover:text-cream"
                      }`}
                    >
                      Prismatic Refract
                    </button>
                  </div>
                </div>

                {/* Filter Fine-Tuning Sliders */}
                <div className="space-y-4 bg-ink/40 p-4 rounded-xl border border-cream/5">
                  <div>
                    <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
                      <span className="text-stone uppercase">Filter Turbulence (baseFreq)</span>
                      <span className="text-salt-pink">{grainFrequency.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.15"
                      step="0.005"
                      value={grainFrequency}
                      onChange={(e) => setGrainFrequency(parseFloat(e.target.value))}
                      className="w-full accent-salt-pink cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
                      <span className="text-stone uppercase">Displacement Scale</span>
                      <span className="text-salt-pink">{displacementScale}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="45"
                      step="1"
                      value={displacementScale}
                      onChange={(e) => setDisplacementScale(parseInt(e.target.value, 10))}
                      className="w-full accent-salt-pink cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
                      <span className="text-stone uppercase flex items-center gap-1">
                        <Sun size={11} className="text-amber" /> Lighting Angle
                      </span>
                      <span className="text-salt-pink">{lightAzimuth}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={lightAzimuth}
                      onChange={(e) => setLightAzimuth(parseInt(e.target.value, 10))}
                      className="w-full accent-salt-pink cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Geology Summary Footer Note */}
              <div className="p-3 bg-ink-3/40 rounded-lg border border-cream/5 text-[11px] text-stone leading-relaxed font-sans">
                <span className="font-mono text-[10px] text-salt-pink uppercase block mb-1">
                  Sub-Micron Geological Matrix
                </span>
                The SVG filter displacement maps simulated subterranean rock pressure distortion onto the vector facets, demonstrating how light refracts through genuine unpolished Khewra halite.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
