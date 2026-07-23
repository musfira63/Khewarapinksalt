import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Flame, Layers, Sparkles, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// @ts-ignore
import polishedSphereLamp from "../assets/images/sphere_salt_lamp_glowing_1784464477760.jpg";
// @ts-ignore
import naturalCrystalLamp from "../assets/images/natural_crystal_lamp_1784461745552.jpg";
// @ts-ignore
import naturalRawLampAmbient from "../assets/images/natural_raw_lamp_ambient_1784462241269.jpg";
// @ts-ignore
import basketChunksLamp from "../assets/images/basket_chunks_lamp_1784463762402.jpg";
// @ts-ignore
import fireBowlLampActive from "../assets/images/fire_bowl_lamp_active_1784462636935.jpg";
// @ts-ignore
import saltPyramidLamp from "../assets/images/salt_pyramid_lamp_1784462037373.jpg";
// @ts-ignore
import cylinderLamp from "../assets/images/cylinder_salt_lamp_glowing_1784465192588.jpg";
// @ts-ignore
import coloredSaltLamp from "../assets/images/colored_salt_lamp_glowing_1784486554960.jpg";

interface Angle {
  name: string;
  url: string;
}

interface LampItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  angles: Angle[];
}

export function LampsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lamp collection with 3 high-quality Unsplash image angles per lamp type
  const lamps: LampItem[] = [
    {
      id: "raw-chunks",
      name: "Natural Raw Chunks Lamp",
      description: "Irregular blocks sculpted exactly as extracted from the primary seam, retaining high structural crystal folds.",
      icon: <Flame className="text-amber" size={16} />,
      angles: [
        { name: "Wire Basket Chunks", url: basketChunksLamp },
        { name: "Single Crystal Glow", url: naturalCrystalLamp },
        { name: "Ambient Bedroom", url: naturalRawLampAmbient },
      ],
    },
    {
      id: "fire-bowl",
      name: "Glowing Fire Bowl Lamp",
      description: "A sculpted, hollowed bowl packed with natural loose crystal nuggets that glow like embers when lit.",
      icon: <Flame className="text-salt-pink" size={16} />,
      angles: [
        { name: "Active Ember Glow", url: fireBowlLampActive },
        { name: "Raw Crystal Nuggets", url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80" },
        { name: "Ambient Corner", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" },
      ],
    },
    {
      id: "pyramids",
      name: "Geometric Pyramid Lamp",
      description: "Architectural pyramids featuring four flat cut faces that display distinct interior banding layers.",
      icon: <Layers className="text-rose-deep" size={16} />,
      angles: [
        { name: "Geometric Glow", url: saltPyramidLamp },
        { name: "Structural Angle", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80" },
        { name: "Workspace Ambient", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
      ],
    },
    {
      id: "sphere",
      name: "Hand-Polished Sphere Lamp",
      description: "Perfectly rounded columns turned and sanded to a smooth velvet sheen, dispersing light in a 360° circle.",
      icon: <Sparkles className="text-salt-pink" size={16} />,
      angles: [
        { name: "Glow Closeup", url: polishedSphereLamp },
        { name: "Globe Mineral Pattern", url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80" },
        { name: "Living Room Setting", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80" },
      ],
    },
    {
      id: "cylinder",
      name: "Modern Cylinder Lamp",
      description: "Precisely carved cylindrical pillars displaying beautiful natural pink, peach, and orange crystalline veins.",
      icon: <Sun className="text-amber-500" size={16} />,
      angles: [
        { name: "Cylinder Glow", url: cylinderLamp },
        { name: "Warm Aura Angle", url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80" },
        { name: "Desktop Setup", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" },
      ],
    },
    {
      id: "colored-lamp",
      name: "Colored Salt Lamp",
      description: "Naturally hand-carved flame-shaped pink salt lamps emitting rich, vibrant custom-colored glow gradients of magenta, indigo, and violet.",
      icon: <Sparkles className="text-salt-pink" size={16} />,
      angles: [
        { name: "Vibrant Flame Glow", url: coloredSaltLamp },
        { name: "Spectrum Hue Angle", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" },
        { name: "Bedroom Ambient Glow", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80" },
      ],
    },
  ];

  // Store active image index (angle) per lamp id
  const [activeAngles, setActiveAngles] = useState<Record<string, number>>({
    "raw-chunks": 0,
    "fire-bowl": 0,
    "pyramids": 0,
    "sphere": 0,
    "cylinder": 0,
    "colored-lamp": 0,
  });

  const handlePrevAngle = (lampId: string, maxAngles: number) => {
    setActiveAngles((prev) => {
      const current = prev[lampId] || 0;
      return {
        ...prev,
        [lampId]: current === 0 ? maxAngles - 1 : current - 1,
      };
    });
  };

  const handleNextAngle = (lampId: string, maxAngles: number) => {
    setActiveAngles((prev) => {
      const current = prev[lampId] || 0;
      return {
        ...prev,
        [lampId]: (current + 1) % maxAngles,
      };
    });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Carousel Navigation Buttons */}
      <div className="absolute -top-16 right-0 flex items-center gap-2">
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full border border-cream/10 bg-ink-2/40 hover:bg-salt-pink/20 hover:border-salt-pink/50 transition-all text-cream hover:text-white"
          aria-label="Scroll left"
          id="btn-carousel-left"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full border border-cream/10 bg-ink-2/40 hover:bg-salt-pink/20 hover:border-salt-pink/50 transition-all text-cream hover:text-white"
          aria-label="Scroll right"
          id="btn-carousel-right"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Horizontal Scroller container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cream/10 scrollbar-track-transparent snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {lamps.map((lamp) => {
          const currentAngleIndex = activeAngles[lamp.id] || 0;
          const currentAngle = lamp.angles[currentAngleIndex];

          return (
            <div
              key={lamp.id}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] flex-shrink-0 bg-ink-2/30 p-5 rounded border border-cream/5 hover:border-salt-pink/25 transition-all snap-start flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Faint background watermark */}
              <span className="absolute -right-3 -bottom-2 font-serif text-[36px] font-black tracking-widest text-cream/[0.03] uppercase select-none pointer-events-none group-hover:text-salt-pink/[0.06] transition-colors z-0">
                KHEWARA
              </span>

              <div className="relative z-10">
                {/* Image Container with Inner Carousel Controls */}
                <div className="relative aspect-square w-full overflow-hidden rounded mb-4 bg-ink/50">
                  {/* Active Image with slide/fade animation */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${lamp.id}-${currentAngleIndex}`}
                      src={currentAngle.url}
                      alt={`${lamp.name} - ${currentAngle.name}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      loading="lazy"
                      className="w-full h-full object-cover rounded"
                    />
                  </AnimatePresence>

                  {/* Khewara Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                    <span className="font-serif text-xs md:text-sm font-bold tracking-[0.3em] text-cream/35 uppercase border border-cream/20 px-3 py-1 bg-ink/30 backdrop-blur-[1px] rotate-[-12deg] shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-salt-pink animate-pulse" />
                      KHEWARA
                    </span>
                  </div>

                  {/* Top-Right Khewara Corner Watermark Stamp */}
                  <span className="absolute top-2 right-2 bg-ink/90 border border-salt-pink/20 text-[8px] font-mono text-salt-pink uppercase px-2 py-0.5 rounded tracking-widest z-20 shadow-sm pointer-events-none select-none font-semibold">
                    Khewara®
                  </span>

                  {/* Micro Left/Right Arrow Overlays on Hover */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevAngle(lamp.id, lamp.angles.length);
                      }}
                      className="p-1.5 rounded-full bg-ink/75 border border-cream/10 hover:bg-salt-pink text-cream hover:text-white transition-all scale-90 hover:scale-100"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextAngle(lamp.id, lamp.angles.length);
                      }}
                      className="p-1.5 rounded-full bg-ink/75 border border-cream/10 hover:bg-salt-pink text-cream hover:text-white transition-all scale-90 hover:scale-100"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Angle Label Pill */}
                  <div className="absolute bottom-2 left-2 bg-ink/80 backdrop-blur-sm border border-cream/5 px-2 py-0.5 rounded text-[10px] font-mono text-stone z-20">
                    {currentAngle.name}
                  </div>

                  {/* Angle Micro-Dot Indicators */}
                  <div className="absolute bottom-2 right-2 flex gap-1 z-20">
                    {lamp.angles.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAngles((prev) => ({ ...prev, [lamp.id]: idx }));
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentAngleIndex
                            ? "bg-salt-pink w-3"
                            : "bg-cream/30 hover:bg-cream/60"
                        }`}
                        aria-label={`Go to angle ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Info and Details */}
                <div className="flex gap-2.5 items-start mb-2.5">
                  <div className="p-1.5 rounded bg-salt-pink/10 border border-salt-pink/15 mt-0.5">
                    {lamp.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-salt-pink/75 uppercase tracking-wider block mb-0.5">
                      Pink Salt Craft Lamp
                    </span>
                    <h4 className="font-serif text-lg text-cream leading-tight font-medium group-hover:text-salt-pink transition-colors">
                      {lamp.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-stone leading-relaxed">
                  {lamp.description}
                </p>
              </div>

              {/* View Angles Quick Selector row */}
              <div className="mt-4 pt-3 border-t border-cream/5 flex justify-between items-center text-[10px] text-stone">
                <span className="font-mono">Angles: {currentAngleIndex + 1} / {lamp.angles.length}</span>
                <button
                  onClick={() => handleNextAngle(lamp.id, lamp.angles.length)}
                  className="font-mono text-salt-pink hover:text-rose-deep transition-all flex items-center gap-0.5 hover:underline"
                >
                  Next Angle <ChevronRight size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
