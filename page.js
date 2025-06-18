'use client';

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&$%*!";
    const columns = [];
    let width, height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns.length = Math.floor(width / 10);
      for (let i = 0; i < columns.length; i++) {
        columns[i] = Math.floor(Math.random() * height);
      }
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = "14px monospace";

      for (let i = 0; i < columns.length; i++) {
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * 10;
        const y = columns[i] * 10;

        ctx.fillStyle = "rgb(0,255,0)";
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          columns[i] = 0;
        } else {
          columns[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 style={{ fontFamily: 'monospace', color: '#00ff00', fontSize: 32 }}>
          Welcome to Murmverse
        </h1>
      </div>
    </div>
  );
}
