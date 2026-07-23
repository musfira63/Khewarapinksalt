/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

export const SaltCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId: number;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const colors = ["rgba(232,169,160,", "rgba(232,147,92,", "rgba(237,227,214,"];
    const count = window.innerWidth < 700 ? 25 : 60;

    interface Grain {
      x: number;
      y: number;
      r: number;
      speedY: number;
      drift: number;
      sway: number;
      swaySpeed: number;
      alphaBase: number;
      twinkle: number;
      twinkleSpeed: number;
      color: string;
    }

    const makeGrain = (): Grain => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 2.1,
      speedY: 0.08 + Math.random() * 0.22,
      drift: (Math.random() - 0.5) * 0.2,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.003 + Math.random() * 0.008,
      alphaBase: 0.2 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.008 + Math.random() * 0.015,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const grains: Grain[] = Array.from({ length: count }, makeGrain);

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      grains.forEach((g) => {
        ctx.beginPath();
        ctx.fillStyle = `${g.color}${g.alphaBase * 0.55})`;
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    if (reduceMotion) {
      drawStatic();
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      grains.forEach((g) => {
        // Mouse interaction: push grains slightly away when cursor is near
        const dx = g.x - mouseX;
        const dy = g.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 1.8;
          g.x += (dx / dist) * force;
          g.y += (dy / dist) * force;
          g.twinkle += 0.08; // Twinkle faster near cursor
        }

        g.y -= g.speedY;
        g.sway += g.swaySpeed;
        g.x += g.drift + Math.sin(g.sway) * 0.12;
        g.twinkle += g.twinkleSpeed;

        if (g.y < -10) {
          g.y = h + 10;
          g.x = Math.random() * w;
        }
        if (g.x < -10) g.x = w + 10;
        if (g.x > w + 10) g.x = -10;

        const alpha = g.alphaBase * (0.5 + 0.5 * Math.sin(g.twinkle));
        ctx.beginPath();
        ctx.fillStyle = `${g.color}${alpha})`;
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();

        // Elegant secondary glow around larger flakes
        if (g.r > 1.8 || dist < maxDist) {
          ctx.beginPath();
          ctx.fillStyle = `${g.color}${alpha * 0.22})`;
          ctx.arc(g.x, g.y, g.r * 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="saltCanvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-1 opacity-70"
    />
  );
};
