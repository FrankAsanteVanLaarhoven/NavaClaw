'use client';

import { useEffect, useRef } from 'react';

export function CharacterMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
    const fontSize = 16;
    let columns = 0;
    let rows = 0;

    // Grid representing the mosaic. Each cell has a char and a brightness (0 to 1)
    let grid: { char: string, brightness: number, targetBrightness: number }[][] = [];

    const initGrid = () => {
      columns = Math.ceil(width / fontSize);
      rows = Math.ceil(height / fontSize);
      grid = Array.from({ length: columns }, () => 
        Array.from({ length: rows }, () => ({
          char: chars[Math.floor(Math.random() * chars.length)],
          brightness: Math.random() * 0.15, // Low ambient brightness
          targetBrightness: Math.random() * 0.15
        }))
      );
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initGrid();
    };
    
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 ${fontSize}px "JetBrains Mono", "IBM Plex Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const cell = grid[i][j];

          // Slowly transition brightness
          cell.brightness += (cell.targetBrightness - cell.brightness) * 0.05;

          // Occasionally pick a new target brightness to create a twinkling effect
          if (Math.random() > 0.995) {
            cell.targetBrightness = Math.random() > 0.95 ? 0.6 : Math.random() * 0.15; // Rare bright flashes
          }

          // Very occasionally flip the character
          if (Math.random() > 0.999) {
            cell.char = chars[Math.floor(Math.random() * chars.length)];
          }

          // Use strict monochrome (whites and grays)
          const colorValue = Math.floor(cell.brightness * 255);
          ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

          const x = i * fontSize + (fontSize / 2);
          const y = j * fontSize + (fontSize / 2);
          
          ctx.fillText(cell.char, x, y);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-black dark:bg-[#0b0b0f] transition-colors duration-500">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-40 mix-blend-screen"
      />
      {/* Soft monochrome vignettes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_85%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,#0b0b0f_85%)] transition-colors duration-500" />
    </div>
  );
}
