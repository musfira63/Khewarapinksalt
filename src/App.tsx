/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Sparkles,
  Flame,
  Coins,
  ShieldCheck,
  Mail,
  Phone,
  Layers,
  MapPin,
  HelpCircle,
  Truck,
  Building,
  Globe,
  ArrowRight,
  Calculator,
  ChevronRight,
  Compass,
  ZoomIn,
  Sun
} from "lucide-react";

import { CustomerSegment } from "./types";
import { PRODUCTS_LIST, STRATA_LAYERS, MINERALS_LIST } from "./data";

// @ts-ignore
import polishedSphereLamp from "./assets/images/polished_sphere_lamp_1784401131328.jpg";

// Sub-components
import { DepthRail } from "./components/DepthRail";
import { SaltCanvas } from "./components/SaltCanvas";
import { CursorGlow } from "./components/CursorGlow";
import { CrystalVein } from "./components/CrystalVein";
import { PricingEngine } from "./components/PricingEngine";
import { ContactForm } from "./components/ContactForm";
import { LampsCarousel } from "./components/LampsCarousel";
import { FaqSection } from "./components/FaqSection";
import { OrderForm } from "./components/OrderForm";
import { CrystalModal } from "./components/CrystalModal";
import { AmbientGlowController } from "./components/AmbientGlowController";
import { WhatsAppButton, WhatsAppIcon, WhatsAppIconSVG } from "./components/WhatsAppIcon";
import { KhewraNewsSection } from "./components/KhewraNewsSection";

// Animated counter helper
const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const numericVal = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    let start = 0;
    const end = numericVal;
    if (end <= 1) {
      setCount(end);
      return;
    }
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = Math.ceil(end / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericVal]);

  return (
    <div className="flex flex-col bg-ink-2/20 border border-cream/5 rounded p-4 text-center hover:border-salt-pink/20 transition-all duration-300">
      <span className="font-serif text-3xl md:text-4xl text-salt-pink font-semibold">
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-stone mt-2">{label}</span>
    </div>
  );
};

export default function App() {
  const [activeSegment, setActiveSegment] = useState<CustomerSegment>("local");
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCrystalModalOpen, setIsCrystalModalOpen] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ transform: "rotateY(0deg) rotateX(0deg)" });

  // Trailing light-refraction caustic state
  const [isCausticsEnabled, setIsCausticsEnabled] = useState<boolean>(true);
  const targetPos = useRef<{ x: number; y: number }>({ x: 180, y: 180 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 180, y: 180 });
  const [trail1, setTrail1] = useState<{ x: number; y: number }>({ x: 180, y: 180 });
  const [trail2, setTrail2] = useState<{ x: number; y: number }>({ x: 180, y: 180 });
  const [causticOpacity, setCausticOpacity] = useState<number>(0);

  // Hover continuous 360-degree rotation & acceleration state
  const isHoveringRef = useRef<boolean>(false);
  const rotationAngleRef = useRef<number>(0);
  const rotationSpeedRef = useRef<number>(0);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [edgeBloom, setEdgeBloom] = useState<number>(0);
  const [ambientRadiance, setAmbientRadiance] = useState<number>(1.0);

  // Sparkle event state on crystal click
  const [sparkleActive, setSparkleActive] = useState<boolean>(false);
  const [sparkleFacets, setSparkleFacets] = useState<string[]>([]);
  const [sparkleParticles, setSparkleParticles] = useState<Array<{ id: number; x: number; y: number; size: number; rotation: number }>>([]);

  const handleCrystalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 360;
    const clickY = ((e.clientY - rect.top) / rect.height) * 400;

    const allFacets = ["faceNorth", "faceWest", "faceEast", "faceCenter", "faceBottomLeft", "faceBottomRight", "faceApex"];
    const shuffled = [...allFacets].sort(() => Math.random() - 0.5);
    const chosenFacets = shuffled.slice(0, 3 + Math.floor(Math.random() * 3));

    setSparkleFacets(chosenFacets);
    setSparkleActive(true);

    const particles = Array.from({ length: 16 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.max(30, Math.min(330, clickX + (Math.random() - 0.5) * 160)),
      y: Math.max(30, Math.min(370, clickY + (Math.random() - 0.5) * 180)),
      size: 10 + Math.random() * 20,
      rotation: Math.random() * 90
    }));

    setSparkleParticles(particles);

    // Auto fade sparkle illumination after duration
    setTimeout(() => {
      setSparkleActive(false);
    }, 1400);

    setIsCrystalModalOpen(true);
  };

  // Smooth lerp animation loop for caustic refraction trailing
  useEffect(() => {
    let animId: number;
    let curr = { x: 180, y: 180 };
    let t1 = { x: 180, y: 180 };
    let t2 = { x: 180, y: 180 };

    const animateCaustics = () => {
      curr.x += (targetPos.current.x - curr.x) * 0.18;
      curr.y += (targetPos.current.y - curr.y) * 0.18;

      t1.x += (curr.x - t1.x) * 0.12;
      t1.y += (curr.y - t1.y) * 0.12;

      t2.x += (t1.x - t2.x) * 0.08;
      t2.y += (t1.y - t2.y) * 0.08;

      setCursorPos({ x: curr.x, y: curr.y });
      setTrail1({ x: t1.x, y: t1.y });
      setTrail2({ x: t2.x, y: t2.y });

      // Calculate continuous 360-degree rotation & subtle center-proximity acceleration
      if (isHoveringRef.current) {
        const normX = targetPos.current.x / 360 - 0.5;
        const normY = targetPos.current.y / 400 - 0.5;
        const distFromCenter = Math.sqrt(normX * normX + normY * normY);
        const proximity = Math.max(0, 1 - distFromCenter / 0.65);

        // Base continuous rotation speed: 0.45 deg/frame; accelerates up to +1.5 deg/frame at center
        const targetSpeed = 0.45 + proximity * 1.5;
        rotationSpeedRef.current += (targetSpeed - rotationSpeedRef.current) * 0.1;
      } else {
        // Decelerate smoothly when cursor leaves
        rotationSpeedRef.current += (0 - rotationSpeedRef.current) * 0.08;
      }

      if (Math.abs(rotationSpeedRef.current) > 0.001) {
        rotationAngleRef.current = (rotationAngleRef.current + rotationSpeedRef.current) % 360;
        setRotationDeg(rotationAngleRef.current);
      }

      // Compute edge bloom intensity (0 to 1) based on current rotation speed acceleration
      const currentBloom = Math.min(1, Math.max(0, rotationSpeedRef.current / 1.95));
      setEdgeBloom(currentBloom);

      animId = requestAnimationFrame(animateCaustics);
    };

    animId = requestAnimationFrame(animateCaustics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle scroll events for nav solidifying
  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer scroll animation system
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            entry.target.classList.remove("reveal-out");
            // Unobserve after showing so it stays revealed
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -12% 0px" // Trigger slightly before entering to feel active and dynamic
      }
    );

    sections.forEach((section) => {
      // The hero section reveals immediately, others start in reveal-out state
      if (section.id === "hero") {
        section.classList.add("reveal-in");
      } else {
        section.classList.add("reveal-out");
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Crystal parallax & light refraction calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    isHoveringRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    // Map normalized coordinates to SVG viewBox (360 x 400)
    targetPos.current = { x: normX * 360, y: normY * 400 };
    setCausticOpacity(isCausticsEnabled ? 1 : 0);

    const relX = normX - 0.5;
    const relY = normY - 0.5;
    setTiltStyle({
      transform: `rotateY(${relX * 18}deg) rotateX(${relY * -18}deg)`
    });
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    targetPos.current = { x: 180, y: 180 };
    setCausticOpacity(0);
    setTiltStyle({ transform: "rotateY(0deg) rotateX(0deg)" });
  };

  // Switch segments and scroll smoothly to corresponding section
  const handlePortalSwitch = (seg: CustomerSegment) => {
    setActiveSegment(seg);
    if (seg === "wholesale") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Calculate relative parallax offsets (-1 to +1) for volumetric 3D crystal layers
  const pX = (cursorPos.x - 180) / 180;
  const pY = (cursorPos.y - 180) / 200;

  return (
    <div className="bg-ink text-cream font-sans min-h-screen selection:bg-salt-pink selection:text-ink overflow-x-hidden relative">
      {/* Dynamic drifting background particles */}
      <SaltCanvas />

      {/* Interactive Sync Cursor Glow */}
      <CursorGlow />

      {/* Floating vertical depth gauge */}
      <DepthRail />

      {/* Fixed Segment Floating Pills (Legendary Global Synchronizer!) */}
      <div className="fixed bottom-20 right-6 z-40 hidden md:block">
        <div className="bg-ink-3 border border-cream/10 p-2.5 rounded-lg shadow-2xl backdrop-blur-md flex flex-col gap-1 max-w-[240px]">
          <span className="font-mono text-[9px] text-stone uppercase tracking-widest text-center border-b border-cream/5 pb-1 mb-1">
            Browse Market Rates
          </span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handlePortalSwitch("local")}
              className={`w-full py-1.5 px-3 rounded text-[10px] font-mono tracking-wider uppercase text-left flex items-center justify-between ${
                activeSegment === "local" ? "bg-salt-pink text-ink font-semibold" : "text-stone hover:text-cream hover:bg-cream/5"
              }`}
            >
              <span>🇵🇰 Local Retail</span>
              {activeSegment === "local" && <span className="w-1 h-1 rounded-full bg-ink" />}
            </button>
            <button
              onClick={() => handlePortalSwitch("intl")}
              className={`w-full py-1.5 px-3 rounded text-[10px] font-mono tracking-wider uppercase text-left flex items-center justify-between ${
                activeSegment === "intl" ? "bg-salt-pink text-ink font-semibold" : "text-stone hover:text-cream hover:bg-cream/5"
              }`}
            >
              <span>🌎 Intl Export</span>
              {activeSegment === "intl" && <span className="w-1 h-1 rounded-full bg-ink" />}
            </button>
            <button
              onClick={() => handlePortalSwitch("wholesale")}
              className={`w-full py-1.5 px-3 rounded text-[10px] font-mono tracking-wider uppercase text-left flex items-center justify-between ${
                activeSegment === "wholesale" ? "bg-salt-pink text-ink font-semibold" : "text-stone hover:text-cream hover:bg-cream/5"
              }`}
            >
              <span>💼 Bulk B2B</span>
              {activeSegment === "wholesale" && <span className="w-1 h-1 rounded-full bg-ink" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
          isNavScrolled ? "bg-ink/90 border-b border-cream/5 py-3 shadow-lg" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#hero" className="flex items-center gap-2 group focus:outline-none" id="nav-logo">
            <span className="font-serif text-xl sm:text-2xl tracking-wider font-bold text-cream group-hover:text-salt-pink transition-colors">
              KHEWARA<span className="text-salt-pink italic ml-1">Pink Salt</span>
            </span>
          </a>

          {/* Desktop link menu */}
          <div className="hidden lg:flex items-center gap-8 text-[12px] font-mono tracking-wider uppercase text-stone">
            <a href="#origin" className="hover:text-salt-pink transition-colors">Origin</a>
            <a href="#products" className="hover:text-salt-pink transition-colors">Products</a>
            <a href="#lamps" className="hover:text-salt-pink transition-colors">Lamps</a>
            <a href="#minerals" className="hover:text-salt-pink transition-colors font-mono">Composition</a>
            <a href="#craft" className="hover:text-salt-pink transition-colors">Craft</a>
            <a href="#research" className="hover:text-salt-pink transition-colors text-salt-pink/90 font-semibold">Research &amp; News</a>
            <a href="#pricing" className="hover:text-salt-pink transition-colors font-semibold border border-salt-pink/20 px-3 py-1 rounded hover:bg-salt-pink hover:text-ink">Price List</a>
            <a href="#order" className="hover:text-salt-pink transition-colors font-semibold border border-salt-pink bg-salt-pink/10 px-3 py-1 rounded hover:bg-salt-pink hover:text-ink">Order Us</a>
            <a href="#contact" className="hover:text-salt-pink transition-colors">Contact</a>
            <a
              href="https://wa.me/923343711613?text=Hello%20Khewara%20Pink%20Salt%2C%20I%20have%20an%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-cream transition-all text-black bg-salt-pink px-3 py-1 rounded-full font-black text-xs flex items-center gap-1.5 shadow-sm pink-shiny-border"
              title="Chat on WhatsApp (0334 3711613)"
            >
              <WhatsAppIconSVG size={13} className="text-black" />
              <span className="text-black font-black">WhatsApp</span>
            </a>
            <a href="#admin" onClick={() => { window.location.hash = "#admin"; }} className="hover:text-salt-pink transition-colors text-salt-pink border border-salt-pink/30 px-2.5 py-1 rounded bg-salt-pink/5 hover:bg-salt-pink/20 font-bold flex items-center gap-1">
              <span>🔐 Admin Portal</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Header Segment Selector */}
            <div className="hidden md:flex items-center gap-1 bg-ink-2/80 border border-cream/10 p-0.5 rounded text-[10px] font-mono">
              <button
                onClick={() => handlePortalSwitch("local")}
                className={`px-2.5 py-1 rounded transition-all duration-200 ${
                  activeSegment === "local"
                    ? "bg-salt-pink text-ink font-semibold"
                    : "text-stone hover:text-cream"
                }`}
                title="View prices in PKR (Rupees)"
              >
                🇵🇰 Local Retail
              </button>
              <button
                onClick={() => handlePortalSwitch("intl")}
                className={`px-2.5 py-1 rounded transition-all duration-200 ${
                  activeSegment === "intl"
                    ? "bg-salt-pink text-ink font-semibold"
                    : "text-stone hover:text-cream"
                }`}
                title="View prices in USD (Dollars)"
              >
                🌎 International
              </button>
              <button
                onClick={() => handlePortalSwitch("wholesale")}
                className={`px-2.5 py-1 rounded transition-all duration-200 ${
                  activeSegment === "wholesale"
                    ? "bg-salt-pink text-ink font-semibold"
                    : "text-stone hover:text-cream"
                }`}
                title="Access B2B Wholesaling & Contact Us"
              >
                💼 B2B Wholesale
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-cream hover:bg-cream/5 focus:outline-none"
              aria-label="Toggle navigation menu"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile slide drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-ink-3 border-b border-cream/10"
              id="mobile-nav-panel"
            >
              <div className="px-6 py-6 flex flex-col gap-4 text-xs font-mono uppercase tracking-wider text-stone">
                <a
                  href="#origin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 hover:text-salt-pink"
                >
                  Origin History
                </a>
                <a
                  href="#products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 hover:text-salt-pink"
                >
                  Products Range
                </a>
                <a
                  href="#lamps"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 hover:text-salt-pink"
                >
                  Carved Lamps
                </a>
                <a
                  href="#minerals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 hover:text-salt-pink"
                >
                  Minerals
                </a>
                <a
                  href="#craft"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 hover:text-salt-pink"
                >
                  Our Craft
                </a>
                <a
                  href="#research"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 text-salt-pink font-semibold hover:text-cream"
                >
                  Research &amp; News
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 hover:text-salt-pink"
                >
                  Trade Pricing
                </a>
                <a
                  href="#order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 text-salt-pink font-semibold hover:text-cream"
                >
                  Order Us (Buy Now)
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-cream/5 hover:text-salt-pink"
                >
                  Get In Touch
                </a>
                <a
                  href="https://wa.me/923343711613?text=Hello%20Khewara%20Pink%20Salt%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-cream/5 text-salt-pink font-bold flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <WhatsAppIconSVG size={16} />
                    WhatsApp Direct Chat
                  </span>
                  <span className="text-[9px] bg-salt-pink/20 text-salt-pink px-2 py-0.5 rounded font-mono border border-salt-pink/30">0334 3711613</span>
                </a>
                <a
                  href="#admin"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.hash = "#admin";
                  }}
                  className="py-1 border-b border-cream/5 text-salt-pink font-bold flex items-center justify-between"
                >
                  <span>🔐 Owner Admin Portal</span>
                  <span className="text-[9px] bg-salt-pink/20 px-2 py-0.5 rounded font-mono">Orders &amp; Inquiries</span>
                </a>

                {/* Mobile direct segment selectors */}
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-cream/10">
                  <span className="text-[10px] text-stone font-mono tracking-widest uppercase mb-1">Select Market Segment:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        handlePortalSwitch("local");
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-1 rounded font-mono text-[9px] uppercase tracking-wider text-center border transition-all duration-200 ${
                        activeSegment === "local"
                          ? "bg-salt-pink text-ink font-semibold border-salt-pink"
                          : "text-stone border-cream/10 hover:text-cream"
                      }`}
                    >
                      🇵🇰 Local (Rs)
                    </button>
                    <button
                      onClick={() => {
                        handlePortalSwitch("intl");
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-1 rounded font-mono text-[9px] uppercase tracking-wider text-center border transition-all duration-200 ${
                        activeSegment === "intl"
                          ? "bg-salt-pink text-ink font-semibold border-salt-pink"
                          : "text-stone border-cream/10 hover:text-cream"
                      }`}
                    >
                      🌎 Intl ($)
                    </button>
                    <button
                      onClick={() => {
                        handlePortalSwitch("wholesale");
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-1 rounded font-mono text-[9px] uppercase tracking-wider text-center border transition-all duration-200 ${
                        activeSegment === "wholesale"
                          ? "bg-salt-pink text-ink font-semibold border-salt-pink"
                          : "text-stone border-cream/10 hover:text-cream"
                      }`}
                    >
                      💼 B2B Form
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-ink via-ink to-ink-2"
      >
        {/* Soft atmospheric ambient light filters */}
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-salt-pink/[0.04] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-15%] w-[40vw] h-[40vw] bg-rose-deep/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="text-salt-pink animate-pulse" size={14} />
              <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">Khewra Salt Range</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight tracking-tight">
              Salt pulled by hand from a <span className="italic text-salt-pink relative font-medium">mountain</span>.
            </h1>

            <p className="text-stone text-sm md:text-base leading-relaxed max-w-[520px]">
              Khewara sources pink crystal directly from the deepest seams of the Salt Range — unrefined, unbleached, and hand-sorted for the deep rose-terracotta veins that only the oldest layers carry.
            </p>

            {/* Portal Switcher directly in Hero block! */}
            <div className="flex flex-col gap-2 mt-2 bg-ink-3/40 p-4 rounded border border-cream/5 max-w-[550px]">
              <span className="font-mono text-[10px] text-stone uppercase tracking-wider block">
                Synchronize Pricing &amp; Products For Your Profile:
              </span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <button
                  onClick={() => handlePortalSwitch("local")}
                  className={`py-2 px-3 rounded font-mono text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 border ${
                    activeSegment === "local"
                      ? "bg-salt-pink text-ink font-semibold border-salt-pink"
                      : "text-stone hover:text-cream hover:bg-cream/5 border-cream/10"
                  }`}
                  id="hero-local-btn"
                >
                  🇵🇰 Local
                </button>
                <button
                  onClick={() => handlePortalSwitch("intl")}
                  className={`py-2 px-3 rounded font-mono text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 border ${
                    activeSegment === "intl"
                      ? "bg-salt-pink text-ink font-semibold border-salt-pink"
                      : "text-stone hover:text-cream hover:bg-cream/5 border-cream/10"
                  }`}
                  id="hero-intl-btn"
                >
                  🌎 Intl Export
                </button>
                <button
                  onClick={() => handlePortalSwitch("wholesale")}
                  className={`py-2 px-3 rounded font-mono text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 border ${
                    activeSegment === "wholesale"
                      ? "bg-salt-pink text-ink font-semibold border-salt-pink"
                      : "text-stone hover:text-cream hover:bg-cream/5 border-cream/10"
                  }`}
                  id="hero-wholesale-btn"
                >
                  💼 B2B Wholesale
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              <a href="#products" className="bg-salt-pink text-ink hover:bg-cream py-3 px-6 rounded font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 hover:shadow-[0_10px_20px_rgba(232,169,160,0.2)] hover:-translate-y-0.5">
                Shop the Range
              </a>
              <a href="#origin" className="border border-cream/10 hover:border-salt-pink/50 text-cream py-3 px-6 rounded font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5">
                Explore the Mine
              </a>
            </div>
          </div>

          {/* Majestic Interactive 3D Crystal rendering */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center perspective-1000 relative">
            {/* Real-time Caustic Light Refraction Toggle, Ambient Radiance Slider & Lighting Suite Controls */}
            <div className="w-72 md:w-80 lg:w-96 flex flex-wrap items-center justify-between gap-1.5 mb-2 z-20">
              {/* Ambient Radiance Slider Control */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-cream/15 bg-ink-3/90 backdrop-blur-md shadow-lg text-[10px] font-mono tracking-wider text-cream/90">
                <Sun size={12} className="text-amber animate-pulse" />
                <span className="hidden sm:inline text-stone">Radiance</span>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={ambientRadiance}
                  onChange={(e) => setAmbientRadiance(parseFloat(e.target.value))}
                  className="w-12 sm:w-16 h-1 bg-cream/20 rounded-lg appearance-none cursor-pointer accent-salt-pink"
                  title="Adjust crystal interior glow and radiance intensity"
                />
                <span className="w-6 text-right font-semibold text-salt-pink">
                  {Math.round(ambientRadiance * 100)}%
                </span>
              </div>

              {/* Caustics Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextState = !isCausticsEnabled;
                  setIsCausticsEnabled(nextState);
                  setCausticOpacity(nextState && isHoveringRef.current ? 1 : 0);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-mono tracking-wider transition-all duration-300 shadow-lg backdrop-blur-md cursor-pointer ${
                  isCausticsEnabled
                    ? "bg-salt-pink/20 border-salt-pink/60 text-cream hover:bg-salt-pink/30 hover:border-salt-pink"
                    : "bg-ink-3/90 border-cream/15 text-stone hover:text-cream hover:border-cream/30"
                }`}
                title={isCausticsEnabled ? "Disable real-time caustic light refraction" : "Enable real-time caustic light refraction"}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isCausticsEnabled
                      ? "bg-salt-pink shadow-[0_0_8px_#E8A9A0] animate-pulse"
                      : "bg-stone/40"
                  }`}
                />
                <Sparkles size={12} className={isCausticsEnabled ? "text-salt-pink" : "text-stone"} />
                <span>Caustics <strong className={isCausticsEnabled ? "text-salt-pink font-semibold" : "text-stone"}>{isCausticsEnabled ? "ON" : "OFF"}</strong></span>
              </button>

              {/* Ambient Lighting Suite Control Attached To Crystal */}
              <AmbientGlowController />
            </div>

            <motion.div
              className="relative w-72 md:w-80 lg:w-96 aspect-square cursor-pointer select-none group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleCrystalClick}
              whileHover={{
                scale: 1.08,
                y: -12,
                transition: { type: "spring", stiffness: 280, damping: 18 }
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                ...tiltStyle,
                transform: `${tiltStyle.transform} rotate(${rotationDeg.toFixed(2)}deg)`
              }}
              id="hero-crystal-container"
              title="Click to spark facet highlights and view microscope"
            >
              {/* Core glow aura that intensifies & expands as rotation accelerates, scaled by Ambient Radiance */}
              <div
                className="absolute inset-10 bg-gradient-to-tr from-rose-deep via-salt-pink to-amber rounded-full transition-all duration-150"
                style={{
                  opacity: Math.min(1, (0.22 + edgeBloom * 0.55) * ambientRadiance),
                  filter: `blur(${Math.max(10, (40 + edgeBloom * 35) * Math.sqrt(ambientRadiance))}px)`,
                  transform: `scale(${1 + edgeBloom * 0.2 * Math.sqrt(ambientRadiance)})`
                }}
              />

              <svg
                width="100%"
                height="100%"
                viewBox="0 0 360 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  filter: `drop-shadow(0 0 ${Math.round((20 + edgeBloom * 45) * Math.sqrt(ambientRadiance))}px rgba(244, 207, 199, ${Math.min(1, (0.25 + edgeBloom * 0.65) * ambientRadiance).toFixed(2)}))`
                }}
              >
                {/* Dynamic Edge Bloom & Light Scattering on Rotation Acceleration */}
                <g style={{ opacity: Math.min(1, Math.max(0.12, edgeBloom) * ambientRadiance), transition: "opacity 0.08s ease-out" }}>
                  {/* Diffused Outer Edge Bloom Halo */}
                  <polygon
                    points="180,20 260,120 300,190 260,300 180,380 100,300 60,190"
                    fill="none"
                    stroke="#FFF5EB"
                    strokeWidth={2 + edgeBloom * 9}
                    opacity={Math.min(1, (0.3 + edgeBloom * 0.6) * ambientRadiance)}
                    style={{ filter: `blur(${2 + edgeBloom * 8}px)`, mixBlendMode: "screen" }}
                  />
                  {/* Brilliant Specular Contour Light Line */}
                  <polygon
                    points="180,20 260,120 300,190 260,300 180,380 100,300 60,190"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={1 + edgeBloom * 3}
                    opacity={Math.min(1, (0.5 + edgeBloom * 0.5) * ambientRadiance)}
                    style={{ mixBlendMode: "color-dodge" }}
                  />
                  {/* Vertex Prismatic Light Scattering Beams */}
                  <path
                    d="M 180,20 L 180,2 M 260,120 L 285,108 M 300,190 L 328,190 M 260,300 L 285,316 M 180,380 L 180,398 M 100,300 L 75,316 M 60,190 L 32,190 M 100,120 L 75,108"
                    stroke="#FFE6DB"
                    strokeWidth={1 + edgeBloom * 3}
                    strokeLinecap="round"
                    opacity={Math.min(1, (0.15 + edgeBloom * 0.85) * ambientRadiance)}
                    style={{ mixBlendMode: "color-dodge", filter: `blur(${1 + edgeBloom * 3}px)` }}
                  />
                </g>
                {/* Layer -2: Deep Sub-surface Volumetric Core & Inclusions */}
                <g style={{ transform: `translate(${(pX * -15).toFixed(2)}px, ${(pY * -15).toFixed(2)}px)`, transition: "transform 0.05s linear" }} filter="url(#khewraOrganicDisplacement)">
                  {/* Internal crystalline lattice lines & mineral inclusions */}
                  <path d="M 180,20 L 180,380 M 100,120 L 260,120 M 60,190 L 300,190 M 150,260 L 210,260" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.22" strokeDasharray="3 4" />
                  <circle cx="180" cy="175" r="4" fill="#FFFFFF" opacity="0.4" />
                  <circle cx="160" cy="140" r="2" fill="#E8A9A0" opacity="0.5" />
                  <circle cx="210" cy="220" r="2.5" fill="#E8935C" opacity="0.45" />
                </g>

                {/* Layer -1: Rear Base Pyramidal Facets */}
                <g style={{ transform: `translate(${(pX * -7).toFixed(2)}px, ${(pY * -7).toFixed(2)}px)`, transition: "transform 0.05s linear" }} filter="url(#khewraOrganicDisplacement)">
                  <polygon points="150,260 180,175 210,260 180,380" fill="url(#gFace1)" opacity="0.85" />
                  <polygon points="60,190 150,260 180,380 100,300" fill="url(#gFace3)" opacity="0.75" />
                  <polygon points="300,190 210,260 180,380 260,300" fill="url(#gFace2)" opacity="0.8" />
                </g>

                {/* Layer 1: Midground Main Crystal Facets */}
                <g style={{ transform: `translate(${(pX * 7).toFixed(2)}px, ${(pY * 7).toFixed(2)}px)`, transition: "transform 0.05s linear" }} filter="url(#khewraOrganicDisplacement)">
                  <polygon points="180,20 260,120 180,175 100,120" fill="url(#gFace1)" opacity="0.95" />
                  <polygon points="100,120 180,175 150,260 60,190" fill="url(#gFace3)" opacity="0.9" />
                  <polygon points="260,120 180,175 210,260 300,190" fill="url(#gFace2)" opacity="0.92" />
                </g>

                {/* Layer 2: Foreground High-Specular Apex Highlight & Edge Flares */}
                <g style={{ transform: `translate(${(pX * 16).toFixed(2)}px, ${(pY * 16).toFixed(2)}px)`, transition: "transform 0.05s linear" }}>
                  <polygon points="180,20 100,120 60,190 130,90" fill="#F4CFC7" opacity="0.45" />
                  <line x1="180" y1="20" x2="180" y2="175" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
                  <line x1="180" y1="20" x2="260" y2="120" stroke="#FFF" strokeWidth="0.8" opacity="0.4" />
                </g>

                {/* Trailing Caustic Light Refraction Layers */}
                <g clipPath="url(#crystalOuterClip)" style={{ opacity: isCausticsEnabled ? causticOpacity : 0, transition: "opacity 0.3s ease-out" }}>
                  <circle cx={trail2.x} cy={trail2.y} r="140" fill="url(#causticLag2)" style={{ mixBlendMode: "screen" }} />
                  <circle cx={trail1.x} cy={trail1.y} r="120" fill="url(#causticLag1)" style={{ mixBlendMode: "screen" }} />
                  <circle cx={cursorPos.x} cy={cursorPos.y} r="95" fill="url(#causticLead)" style={{ mixBlendMode: "screen" }} />

                  {/* Refraction Caustic Beams & Prismatic Flares */}
                  <path
                    d={`M 180,20 Q ${cursorPos.x},${cursorPos.y} ${trail1.x},${trail1.y} T 180,380`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                    opacity="0.6"
                    style={{ mixBlendMode: "color-dodge" }}
                  />
                  <polygon
                    points={`${cursorPos.x},${cursorPos.y} ${trail1.x + 18},${trail1.y - 25} ${trail2.x - 12},${trail2.y + 30}`}
                    fill="#FFFDF9"
                    opacity="0.35"
                    style={{ mixBlendMode: "color-dodge" }}
                  />
                </g>

                {/* Sparkle Brilliant Facet Highlight Event Overlay */}
                {sparkleActive && (
                  <g clipPath="url(#crystalOuterClip)">
                    {sparkleFacets.map((facetKey) => {
                      const facetPoints: Record<string, string> = {
                        faceNorth: "180,20 260,120 180,175 100,120",
                        faceWest: "100,120 180,175 150,260 60,190",
                        faceEast: "260,120 180,175 210,260 300,190",
                        faceCenter: "150,260 180,175 210,260 180,380",
                        faceBottomLeft: "60,190 150,260 180,380 100,300",
                        faceBottomRight: "300,190 210,260 180,380 260,300",
                        faceApex: "180,20 100,120 60,190 130,90"
                      };
                      if (!facetPoints[facetKey]) return null;
                      return (
                        <motion.polygon
                          key={facetKey}
                          points={facetPoints[facetKey]}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.95, 0.85, 0] }}
                          transition={{ duration: 1.3, ease: "easeInOut" }}
                          fill="#FFFDF7"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          style={{ mixBlendMode: "color-dodge" }}
                        />
                      );
                    })}

                    {/* Starburst Sparkle Particles */}
                    {sparkleParticles.map((p) => (
                      <motion.g
                        key={p.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.6, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      >
                        <path
                          d={`M ${p.x},${p.y - p.size} Q ${p.x},${p.y} ${p.x + p.size},${p.y} Q ${p.x},${p.y} ${p.x},${p.y + p.size} Q ${p.x},${p.y} ${p.x - p.size},${p.y} Q ${p.x},${p.y} ${p.x},${p.y - p.size}`}
                          fill="#FFFFFF"
                        />
                        <circle cx={p.x} cy={p.y} r={p.size * 0.35} fill="#FFE2C0" />
                      </motion.g>
                    ))}
                  </g>
                )}

                <defs>
                  {/* Dynamic Organic Khewra Salt Interior Displacement Map Filter */}
                  <filter id="khewraOrganicDisplacement" x="-15%" y="-15%" width="130%" height="130%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency={(0.026 + Math.abs(pX) * 0.008 + edgeBloom * 0.006).toFixed(4)}
                      numOctaves="3"
                      result="saltOrganicNoise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="saltOrganicNoise"
                      scale={(3.5 + edgeBloom * 5.0 + Math.abs(pX + pY) * 2.5).toFixed(2)}
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>

                  <clipPath id="crystalOuterClip">
                    <polygon points="180,20 260,120 300,190 260,300 180,380 100,300 60,190" />
                  </clipPath>

                  <radialGradient id="causticLead" cx={cursorPos.x} cy={cursorPos.y} r="95" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="30%" stopColor="#F4CFC7" stopOpacity="0.7" />
                    <stop offset="65%" stopColor="#E8935C" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#E8A9A0" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="causticLag1" cx={trail1.x} cy={trail1.y} r="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFDFD3" stopOpacity="0.8" />
                    <stop offset="45%" stopColor="#E8A9A0" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#C97B72" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="causticLag2" cx={trail2.x} cy={trail2.y} r="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F0B088" stopOpacity="0.65" />
                    <stop offset="50%" stopColor="#B85C4A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8C4A42" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="gFace1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F0BDB4" />
                    <stop offset="100%" stopColor="#C97B72" />
                  </linearGradient>
                  <linearGradient id="gFace2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E8935C" />
                    <stop offset="100%" stopColor="#B85C4A" />
                  </linearGradient>
                  <linearGradient id="gFace3" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8C4A42" />
                    <stop offset="100%" stopColor="#C97B72" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Click instruction floating badge overlay */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-ink-3/95 border border-salt-pink/40 text-salt-pink text-[10px] font-mono uppercase px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 group-hover:bg-salt-pink group-hover:text-ink transition-all duration-300 pointer-events-none whitespace-nowrap">
                <ZoomIn size={12} />
                <span>Click to Inspect Facet Textures</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ORIGIN SECTION */}
      <section id="origin" className="py-24 px-6 md:px-12 bg-ink border-t border-cream/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">Ancient Geology</span>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mt-1">Mined from deep within the salt range mountains.</h2>
            </div>
            <p className="text-stone text-sm leading-relaxed">
              The Khewra Salt Range holds one of the most precious reserves of raw rock salt on earth — pristine mineral seams folded deep beneath ancient mountains long before human civilizations emerged. What is hand-chipped today formed under immense prehistoric pressure, layer by layer.
            </p>
            <p className="text-stone text-sm leading-relaxed">
              Khewara coordinates exclusively with generational local mining artisans inside the range. Using traditional pickaxes rather than dynamic blasting powders, our miners preserve the delicate crystal integrity and natural trace moisture.
            </p>
          </div>

          {/* Strata depth chart */}
          <div className="lg:col-span-6 flex flex-col bg-ink-2/30 border border-cream/5 rounded-lg divide-y divide-cream/5" id="origin-strata-list">
            {STRATA_LAYERS.map((layer, idx) => (
              <div key={idx} className="p-5 flex gap-5 items-start hover:bg-ink-3/25 transition-colors">
                <span className="font-mono text-xs text-salt-pink whitespace-nowrap pt-1 bg-salt-pink/5 px-2 py-1 rounded min-w-[64px] text-center">
                  {layer.depth}
                </span>
                <div>
                  <h4 className="font-serif text-base text-cream">{layer.title}</h4>
                  <p className="text-xs text-stone mt-1 leading-relaxed">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION (DYNAMIZED FOR CHANNELS!) */}
      <section id="products" className="py-24 px-6 md:px-12 bg-ink-2 border-t border-cream/5">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          {/* International Exchange Rate Notice with animated pink shiny border */}
          {activeSegment !== "local" && (
            <div className="relative p-[2px] rounded-xl overflow-hidden pink-shiny-border animate-fade-in shadow-[0_4px_24px_rgba(232,169,160,0.15)] w-full">
              <div className="bg-ink rounded-[10px] p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 leading-relaxed">
                <span className="font-mono text-[10px] bg-salt-pink text-ink px-3 py-1 rounded-full uppercase tracking-wider font-extrabold shrink-0 flex items-center gap-1.5 shadow-md">
                  🌍 Currency Exchange Notice
                </span>
                <p className="text-cream text-sm md:text-base font-extrabold tracking-wide text-center md:text-left leading-normal">
                  USD prices are converted from PKR and may fluctuate slightly with currency exchange rate movements at the time your order is placed.
                </p>
              </div>
            </div>
          )}
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">Catalog Range</span>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mt-1">A dozen forms, one seam.</h2>
              <p className="text-xs text-stone mt-1">
                Prices and parameters are dynamically calibrated to your active browsing portal.
              </p>
            </div>
            {/* Local vs Export vs B2B selector inside Shop */}
            <div className="flex items-center gap-1.5 bg-ink p-1 rounded-md border border-cream/5">
              <button
                onClick={() => handlePortalSwitch("local")}
                className={`py-1.5 px-3 rounded font-mono text-[9px] uppercase tracking-wider transition-all duration-300 ${
                  activeSegment === "local" ? "bg-salt-pink text-ink font-semibold" : "text-stone hover:text-cream"
                }`}
                id="products-local-tab"
              >
                Local Rates
              </button>
              <button
                onClick={() => handlePortalSwitch("intl")}
                className={`py-1.5 px-3 rounded font-mono text-[9px] uppercase tracking-wider transition-all duration-300 ${
                  activeSegment === "intl" ? "bg-salt-pink text-ink font-semibold" : "text-stone hover:text-cream"
                }`}
                id="products-intl-tab"
              >
                Export Rates
              </button>
              <button
                onClick={() => handlePortalSwitch("wholesale")}
                className={`py-1.5 px-3 rounded font-mono text-[9px] uppercase tracking-wider transition-all duration-300 ${
                  activeSegment === "wholesale" ? "bg-salt-pink text-ink font-semibold" : "text-stone hover:text-cream"
                }`}
                id="products-wholesale-tab"
              >
                B2B Trade Portal
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="products-catalog-grid">
            {PRODUCTS_LIST.map((prod) => {
              // Calculate dynamic displayed price/specs based on profile
              let activePrice = "";
              let specPrefix = "Retail Specifications";
              let badgeText = "";

              if (activeSegment === "local") {
                activePrice = prod.localPrice;
                badgeText = "Ex-Factory PK";
              } else if (activeSegment === "intl") {
                activePrice = prod.intlPrice;
                badgeText = "Export Retail";
              } else {
                activePrice = "Quote on Request";
                specPrefix = `B2B MOQ: ${prod.moq}`;
                badgeText = "B2B Trade Portal";
              }

              return (
                <div
                  key={prod.id}
                  className="bg-ink-3/40 rounded border border-cream/5 hover:border-salt-pink/20 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
                  id={`prod-card-${prod.id}`}
                >
                  {/* Faint product card background watermark */}
                  <span className="absolute -right-3 -bottom-2 font-serif text-[36px] font-black tracking-widest text-cream/[0.03] uppercase select-none pointer-events-none group-hover:text-salt-pink/[0.06] transition-colors z-0">
                    KHEWARA
                  </span>

                  <div className="relative aspect-video w-full overflow-hidden bg-ink">
                    {prod.imageUrl ? (
                      <>
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Khewara watermark overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                          <span className="font-serif text-xs md:text-sm font-bold tracking-[0.3em] text-cream/35 uppercase border border-cream/20 px-3 py-1 bg-ink/30 backdrop-blur-[1px] rotate-[-12deg] shadow-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-salt-pink animate-pulse" />
                            KHEWARA
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ink to-ink-3 relative">
                        <Flame className="text-salt-pink opacity-20" size={48} />
                        {/* Khewara watermark overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                          <span className="font-serif text-xs md:text-sm font-bold tracking-[0.3em] text-cream/35 uppercase border border-cream/20 px-3 py-1 bg-ink/30 backdrop-blur-[1px] rotate-[-12deg] shadow-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-salt-pink animate-pulse" />
                            KHEWARA
                          </span>
                        </div>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-ink/90 border border-cream/10 text-[9px] font-mono text-salt-pink uppercase px-2 py-0.5 rounded tracking-wide z-10">
                      {badgeText}
                    </span>
                    <span className="absolute top-3 right-3 bg-ink/90 border border-salt-pink/20 text-[8px] font-mono text-salt-pink uppercase px-2 py-0.5 rounded tracking-widest z-10 shadow-sm pointer-events-none select-none font-semibold">
                      Khewara®
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-cream group-hover:text-salt-pink transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-stone text-[12px] leading-relaxed mt-2">
                        {prod.description}
                      </p>
                    </div>

                    <div className="border-t border-cream/5 pt-3 mt-1">
                      <span className="text-[10px] font-mono text-stone uppercase block mb-1">
                        {specPrefix}
                      </span>
                      <span className="text-xs text-cream font-medium block mb-3">
                        {prod.specs}
                      </span>
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-mono text-stone uppercase">
                          {activeSegment === "wholesale" ? "Pricing" : "Cost Rate"}
                        </span>
                        <span className="font-mono text-sm text-salt-pink font-semibold">
                          {activePrice}
                        </span>
                      </div>
                      {activeSegment === "wholesale" && (
                        <a
                          href="#pricing"
                          className="block text-center w-full py-2 bg-salt-pink/10 hover:bg-salt-pink/20 text-salt-pink font-mono text-[10px] uppercase tracking-wider rounded transition-all duration-300 border border-salt-pink/20 font-semibold"
                        >
                          Send B2B Inquiry
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <FaqSection />
        </div>
      </section>

      {/* LAMPS COLLECTION SECTION */}
      <section id="lamps" className="py-24 px-6 md:px-12 bg-ink border-t border-cream/5">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div>
            <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">The Lamp Collection</span>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mt-1">Every shape we carve.</h2>
            <p className="text-stone text-sm leading-relaxed max-w-[600px] mt-2">
              From natural raw monolithic chunks to smooth symmetrical columns, each lamp is sculpted by hand. Lamps are sold by weight classifications. Toggle sizes in our Pricing Calculator below.
            </p>
          </div>

          <LampsCarousel />
        </div>
      </section>

      {/* MINERALS COMPOSITION SECTION */}
      <section id="minerals" className="py-24 px-6 md:px-12 bg-ink border-t border-cream/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">Composition Analysis</span>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mt-1">Why it's pink.</h2>
            </div>
            <p className="text-stone text-sm leading-relaxed">
              The iconic hue comes from trace iron compounds locked deep within the crystal matrix of the mountain seams millions of years ago. It carries no artificial dyes, anticaking powders, or chemical additives.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone font-mono bg-ink-2/30 p-3 rounded border border-cream/5">
              <ShieldCheck className="text-salt-pink" size={16} />
              Laboratory Certified Mineral Extraction
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col bg-ink-2/20 border border-cream/5 rounded divide-y divide-cream/5" id="minerals-list">
            {MINERALS_LIST.map((m, idx) => (
              <div key={idx} className="p-5 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-6 items-baseline hover:bg-ink-3/20 transition-colors">
                <span className="font-mono text-sm text-salt-pink font-semibold">{m.pct}</span>
                <div className="sm:col-span-3">
                  <h4 className="font-serif text-base text-cream">{m.name}</h4>
                  <p className="text-xs text-stone mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFT SECTION */}
      <section id="craft" className="py-24 px-6 md:px-12 bg-ink-2 border-t border-cream/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">Handcrafted Process</span>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mt-1">Cut by hand, sorted by eye.</h2>
            </div>
            <p className="text-stone text-sm leading-relaxed">
              Every block is extracted from the Khewra seams with pickaxes and hand chisels, avoiding the heavy concussive explosions of mass-scale miners that micro-fracture crystals and cloud color.
            </p>
            <p className="text-stone text-sm leading-relaxed">
              Once extracted, Khewara crystals are manually inspected, graded, and sized by experienced sorting artisans inside our local Karachi packing depot, ensuring unmatched quality.
            </p>

            {/* Custom counter statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4" id="craft-statistics-grid">
              <StatItem value="800ft" label="Deepest Seam" />
              <StatItem value="100%" label="Hand Chipped" />
              <StatItem value="1" label="Partner Mine" />
              <StatItem value="6" label="Color Grades" />
            </div>
          </div>

          <div className="lg:col-span-6" id="crystal-geology-scanner">
            <CrystalVein />
          </div>
        </div>
      </section>

      {/* SEARCH GROUNDED RESEARCH & NEWS SECTION */}
      <KhewraNewsSection />

      {/* PRICING & LOGISTICS SECTION (THE MASSIVE UPGRADE!) */}
      <section id="pricing" className="py-24 px-6 md:px-12 bg-ink-3/30 border-t border-cream/5">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="max-w-[700px]">
            <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">
              {activeSegment === "wholesale" ? "B2B Sourcing Desk" : "Comparative Trade Directory"}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mt-1">Different Channels, Unified Quality.</h2>
            <p className="text-stone text-sm leading-relaxed mt-2">
              {activeSegment === "wholesale" ? (
                "Submit a direct trade request to our Karachi dispatch office. All bulk, wholesale, and container shipments are custom-quoted to ensure direct ex-factory rates without standard markup."
              ) : (
                "Review full detailed catalogs or utilize our interactive Quotation Estimator below. Switch between local, international, and internal wholesale B2B desks."
              )}
            </p>
          </div>

          <PricingEngine activeSegment={activeSegment} onSegmentChange={handlePortalSwitch} />
        </div>
      </section>

      {/* DIRECT ORDER PORTAL */}
      <OrderForm />

      {/* Ambient Quote Banner */}
      <div className="py-16 px-6 text-center border-t border-b border-cream/5 bg-ink">
        <p className="font-serif italic text-xl md:text-2xl text-cream max-w-3xl mx-auto leading-relaxed">
          "You can tell a authentic Khewara crystal by holding it to the light — the deep rose color isn't a spray coating, it runs straight through the core."
        </p>
        <span className="block mt-4 font-mono text-[10px] text-stone uppercase tracking-widest">
          — Sorting Operations Desk, Karachi Depot
        </span>
      </div>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-ink border-t border-cream/5">
        <div className="max-w-7xl mx-auto">
          <ContactForm activeSegment={activeSegment} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink-3 border-t border-cream/10 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12" id="footer-grid">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <h3 className="font-serif text-2xl text-cream font-bold">
              KHEWARA<span className="text-salt-pink italic ml-1">Pink Salt</span>
            </h3>
            <p className="text-stone text-xs leading-relaxed max-w-sm">
              Sourcing the highest grade of deep rose pink crystal from the ancient seams of the Khewra Salt Range. Traditional pickaxe extraction, certified unrefined purity, shipped worldwide.
            </p>
            <div className="flex gap-4 text-xs font-mono text-stone mt-2">
              <span className="hover:text-salt-pink cursor-pointer">Local PK</span>
              <span>·</span>
              <span className="hover:text-salt-pink cursor-pointer">Intl Export</span>
              <span>·</span>
              <span className="hover:text-salt-pink cursor-pointer">B2B Trade Desk</span>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="font-mono text-[10px] text-stone uppercase tracking-widest">Explore</span>
            <div className="flex flex-col gap-2 text-xs text-cream hover:text-cream/80">
              <a href="#origin" className="hover:text-salt-pink transition-colors">Origin History</a>
              <a href="#products" className="hover:text-salt-pink transition-colors">Products Catalog</a>
              <a href="#lamps" className="hover:text-salt-pink transition-colors">Hand-Carved Lamps</a>
              <a href="#minerals" className="hover:text-salt-pink transition-colors">Mineral Breakdown</a>
              <a href="#craft" className="hover:text-salt-pink transition-colors">Extraction Craft</a>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="font-mono text-[10px] text-stone uppercase tracking-widest">Al-Musfira Enterprises</span>
            <p className="text-stone text-xs leading-relaxed">
              Wholesale inquiries are managed through our registered shipping desk in Karachi, Pakistan. WhatsApp us or submit the trade form for prompt shipping manifests.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-stone font-mono mt-1">
              <div className="flex items-center gap-2">
                <span className="text-cream">Hotline: 0334 3711613</span>
                <a
                  href="https://wa.me/923343711613?text=Hello%20Khewara%20Pink%20Salt%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-salt-pink hover:underline text-[11px] font-bold"
                >
                  <WhatsAppIconSVG size={12} />
                  <span>WhatsApp</span>
                </a>
              </div>
              <span className="text-stone text-[10px]">Email: Almusfiraenterprises@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-cream/5 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-stone tracking-wider uppercase">
          <div className="flex items-center gap-3">
            <span>© 2026 Khewara Pink Salt</span>
            <span>·</span>
            <a href="#admin" onClick={() => { window.location.hash = "#admin"; }} className="text-salt-pink hover:underline font-bold">
              🔐 Owner Admin Portal
            </a>
          </div>
          <div className="flex gap-4">
            <span>Karachi Depot</span>
            <span>·</span>
            <span>Khewra Seams</span>
          </div>
        </div>
      </footer>

      {/* Interactive Crystal Facet Microscope Modal */}
      <CrystalModal
        isOpen={isCrystalModalOpen}
        onClose={() => setIsCrystalModalOpen(false)}
      />

      {/* Floating Interactive WhatsApp Chat Button (Bottom-right) */}
      <WhatsAppButton />
    </div>
  );
}
