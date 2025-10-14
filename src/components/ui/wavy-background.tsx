"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafari, setIsSafari] = useState(false);

  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  const render = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      nt: number,
      waveColors: string[]
    ) => {
      // 🔥 Removed black background fill:
      ctx.clearRect(0, 0, w, h); // clears previous frame but keeps transparency

      ctx.globalAlpha = waveOpacity || 0.5;
      const drawWave = (n: number) => {
        nt += getSpeed();
        for (let i = 0; i < n; i++) {
          ctx.beginPath();
          ctx.lineWidth = waveWidth || 50;
          ctx.strokeStyle = waveColors[i % waveColors.length];
          for (let x = 0; x < w; x += 5) {
            const y = noise(x / 800, 0.3 * i, nt) * 100;
            ctx.lineTo(x, y + h * 0.5);
          }
          ctx.stroke();
          ctx.closePath();
        }
      };
      drawWave(5);
      return requestAnimationFrame(() => render(ctx, w, h, nt, waveColors));
    },
    [getSpeed, noise, waveOpacity, waveWidth]
  );

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (ctx.canvas.width = window.innerWidth);
    let h = (ctx.canvas.height = window.innerHeight);
    ctx.filter = `blur(${blur}px)`;
    const nt = 0;
    const waveColors = colors ?? [
      "#38bdf8",
      "#818cf8",
      "#c084fc",
      "#e879f9",
      "#22d3ee",
    ];

    const animationId = render(ctx, w, h, nt, waveColors);

    const handleResize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [blur, colors, render]);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "relative h-screen flex flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          background: "transparent", // 🟢 ensure transparency
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>

      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
