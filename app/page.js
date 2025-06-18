'use client';

import { useEffect, useRef, useState } from 'react';

const asciiBig = {
  M: [
    '███   ███',
    '████ ████',
    '██ ███ ██',
    '██  █  ██',
    '██     ██'
  ],
  U: [
    '██     ██',
    '██     ██',
    '██     ██',
    '██     ██',
    ' ███████ '
  ],
  R: [
    '██████  ',
    '██   ██ ',
    '██████  ',
    '██  ██  ',
    '██   ██ '
  ]
};

export default function Home() {
  const canvasRef = useRef(null);
  const [bannerLines, setBannerLines] = useState([]);
  const [t, setT] = useState(0);

  useEffect(() => {
    fetch('/murm.txt')
      .then((res) => res.text())
      .then((text) => setBannerLines(text.split('\n')))
      .catch((err) => console.error('Failed to load murm.txt', err));
  }, []);

  useEffect(() => {
    if (bannerLines.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&$%*!';
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

    const drawBigMurm = (t) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const letters = ['M', 'U', 'R', 'M'];
      const wiggle = Math.sin(t * 0.05) * 5;
      ctx.font = '16px monospace';
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const pattern = asciiBig[letter];
        const offsetX = centerX - 90 + i * 60;
        const offsetY = centerY + wiggle;
        for (let y = 0; y < pattern.length; y++) {
          for (let x = 0; x < pattern[y].length; x++) {
            const ch = pattern[y][x];
            if (ch !== ' ') {
              ctx.fillStyle = 'rgba(255,0,0,0.9)';
              ctx.fillText(ch, offsetX + x * 8, offsetY + y * 16);
            } else if (Math.random() < 0.05) {
              ctx.fillStyle = 'rgba(120,0,0,0.4)';
              ctx.fillText('.', offsetX + x * 8, offsetY + y * 16);
            }
          }
        }
      }
    };

    const drawSwirlingMurm = (t) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const word = 'MURM';
      const radius = 120;
      const spacing = 1.5;

      ctx.font = 'bold 18px monospace';
      for (let i = 0; i < word.length; i++) {
        const angle = t * 0.03 + i * spacing;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.fillStyle = 'rgba(255, 40, 40, 0.8)';
        ctx.fillText(word[i], x, y);
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '14px monospace';

      for (let i = 0; i < columns.length; i++) {
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * 10;
        const y = columns[i] * 10;

        ctx.fillStyle = 'rgb(0,255,0)';
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          columns[i] = 0;
        } else {
          columns[i]++;
        }
      }

      ctx.font = '12px monospace';
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      for (let y = 0; y < bannerLines.length; y++) {
        ctx.fillText(bannerLines[y], 10, 14 * (y + 1));
      }

      drawBigMurm(t);
      drawSwirlingMurm(t);
      setT((prev) => prev + 1);
      animationFrameId = requestAnimationFrame(() => draw());
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bannerLines]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
    </div>
  );
}
