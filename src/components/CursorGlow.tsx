import React, { useEffect, useState, useRef } from "react";

export const CursorGlow: React.FC = () => {
  const mousePos = useRef<{ x: number; y: number }>({ x: -500, y: -500 });
  const [smoothPos, setSmoothPos] = useState<{ x: number; y: number }>({ x: -500, y: -500 });
  const [trailPos, setTrailPos] = useState<{ x: number; y: number }>({ x: -500, y: -500 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animId: number;
    let curr = { x: -500, y: -500 };
    let trail = { x: -500, y: -500 };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const animateGlow = () => {
      curr.x += (mousePos.current.x - curr.x) * 0.22;
      curr.y += (mousePos.current.y - curr.y) * 0.22;

      trail.x += (curr.x - trail.x) * 0.08;
      trail.y += (curr.y - trail.y) * 0.08;

      setSmoothPos({ x: curr.x, y: curr.y });
      setTrailPos({ x: trail.x, y: trail.y });

      animId = requestAnimationFrame(animateGlow);
    };

    animId = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Lagging Soft Ambient Aura */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${trailPos.x}px`,
          top: `${trailPos.y}px`,
          width: "650px",
          height: "650px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(232, 169, 160, 0.12) 0%, rgba(232, 147, 92, 0.04) 50%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      {/* Primary Radiant Core following cursor smoothly */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${smoothPos.x}px`,
          top: `${smoothPos.y}px`,
          width: "220px",
          height: "220px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(245, 200, 192, 0.25) 0%, rgba(232, 169, 160, 0.08) 60%, transparent 80%)",
          mixBlendMode: "screen",
          filter: "blur(8px)",
        }}
      />

      {/* Small Crystal Sparkle Point */}
      <div
        className="absolute w-2 h-2 rounded-full bg-cream/80 shadow-[0_0_12px_#E8A9A0] pointer-events-none"
        style={{
          left: `${mousePos.current.x}px`,
          top: `${mousePos.current.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};
