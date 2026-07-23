/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Volume2, VolumeX, Flame, Sparkles, Sliders, ChevronDown, Activity } from "lucide-react";

interface ColorPreset {
  id: string;
  name: string;
  temp: string;
  hex: string;
  glow: string;
}

const presets: ColorPreset[] = [
  { id: "amber", name: "2200K Candlelight", temp: "Candlelight", hex: "#E8935C", glow: "rgba(232, 147, 92, 0.35)" },
  { id: "pink", name: "2700K Rose Halite", temp: "Warm Rose", hex: "#E8A9A0", glow: "rgba(232, 169, 160, 0.4)" },
  { id: "deep", name: "3200K Terracotta", temp: "Terracotta", hex: "#C97B72", glow: "rgba(201, 123, 114, 0.42)" },
  { id: "prismatic", name: "5000K Prismatic", temp: "Prismatic", hex: "#F4CFC7", glow: "rgba(244, 207, 199, 0.45)" }
];

interface AmbientGlowControllerProps {
  className?: string;
  buttonClassName?: string;
}

export const AmbientGlowController: React.FC<AmbientGlowControllerProps> = ({
  className = "relative font-sans z-30",
  buttonClassName = "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-salt-pink/40 bg-ink-3/90 text-cream text-[10px] font-mono tracking-wider shadow-lg backdrop-blur-md hover:border-salt-pink transition-all group cursor-pointer"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<ColorPreset>(presets[1]);
  const [intensity, setIntensity] = useState(65);
  const [isBreathing, setIsBreathing] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Apply dynamic CSS background variables for ambient lighting across the app
  useEffect(() => {
    document.documentElement.style.setProperty("--salt-glow-color", activePreset.hex);
    document.documentElement.style.setProperty("--salt-glow-alpha", `${(intensity / 100).toFixed(2)}`);
  }, [activePreset, intensity]);

  // Web Audio API ambient salt cave warmth synthesizer (432Hz harmonic hum)
  const toggleAmbientAudio = () => {
    if (isPlayingAudio) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.8);
        setTimeout(() => {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          setIsPlayingAudio(false);
        }, 800);
      }
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Subterranean warm sine oscillator (108Hz base octave)
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(108, ctx.currentTime);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(216, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc2.start();

        oscRef.current = osc;
        gainRef.current = gain;

        setIsPlayingAudio(true);
      } catch {
        console.warn("Web Audio API not supported");
      }
    }
  };

  return (
    <div className={className}>
      {/* Dynamic Ambient Background Overlay Filter */}
      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-700 z-[-1] ${
          isBreathing ? "animate-pulse" : ""
        }`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activePreset.glow} 0%, transparent 65%)`,
          opacity: (intensity / 100) * 0.75
        }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute top-full mt-2 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-80 bg-ink-2/95 border border-salt-pink/40 rounded-2xl p-4 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl text-cream z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-salt-pink/10 text-salt-pink border border-salt-pink/20">
                  <Flame size={15} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-cream">
                    Ambient Lamp Glow
                  </h4>
                  <p className="text-[10px] font-mono text-stone">
                    Subterranean Lighting &amp; Sound Engine
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-cream/10 text-stone hover:text-cream transition-colors"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-stone uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Sparkles size={11} className="text-salt-pink" /> Spectrum Preset
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePreset(p)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                        activePreset.id === p.id
                          ? "bg-salt-pink/20 border-salt-pink text-cream font-medium"
                          : "bg-ink-3/60 border-cream/5 text-stone hover:text-cream hover:border-cream/20"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: p.hex }}
                      />
                      <div className="truncate">
                        <div className="text-[11px] leading-tight truncate">{p.temp}</div>
                        <div className="text-[9px] font-mono text-stone">{p.name.split(" ")[0]}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="pt-2 border-t border-cream/5">
                <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
                  <span className="text-stone uppercase flex items-center gap-1">
                    <Sun size={11} className="text-amber" /> Glow Luminance
                  </span>
                  <span className="text-salt-pink">{intensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                  className="w-full accent-salt-pink cursor-pointer"
                />
              </div>

              {/* Toggles Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-cream/5 text-xs">
                {/* Candle Pulse Toggle */}
                <button
                  onClick={() => setIsBreathing(!isBreathing)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[10px] transition-all ${
                    isBreathing
                      ? "bg-amber/15 border-amber/40 text-amber"
                      : "bg-ink-3 border-cream/10 text-stone"
                  }`}
                >
                  <Activity size={12} />
                  <span>{isBreathing ? "Pulse Active" : "Static Light"}</span>
                </button>

                {/* Subterranean Acoustic Resonance Hum */}
                <button
                  onClick={toggleAmbientAudio}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[10px] transition-all ${
                    isPlayingAudio
                      ? "bg-salt-pink/20 border-salt-pink text-salt-pink"
                      : "bg-ink-3 border-cream/10 text-stone hover:text-cream"
                  }`}
                  title="Toggle 108Hz Khewra Salt Cave Ambient Sound"
                >
                  {isPlayingAudio ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  <span>{isPlayingAudio ? "Resonance On" : "Sound Off"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName}
        title="Control Ambient Salt Crystal Glow & Lighting"
      >
        <div
          className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse transition-colors"
          style={{ backgroundColor: activePreset.hex, color: activePreset.hex }}
        />
        <Sliders size={12} className="text-salt-pink group-hover:rotate-45 transition-transform" />
        <span className="font-semibold">Lighting Suite</span>
      </motion.button>
    </div>
  );
};
