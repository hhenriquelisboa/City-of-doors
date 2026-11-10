import React, { useEffect, useRef } from 'react';
import { WeatherType } from '../types/rpg';

interface WeatherOverlayProps {
  weather: WeatherType;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ weather }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (weather !== 'rain' && weather !== 'storm') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const raindrops: { x: number; y: number; l: number; speed: number }[] = [];
    const count = weather === 'storm' ? 140 : 80;

    for (let i = 0; i < count; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 20 + 10,
        speed: Math.random() * 8 + 12
      });
    }

    let lightningTimer = 0;
    let lightningOpacity = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rain streaks
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const drop = raindrops[i];
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.l);
        drop.y += drop.speed;
        drop.x -= 1;
        if (drop.y > height) {
          drop.y = -20;
          drop.x = Math.random() * width;
        }
      }
      ctx.stroke();

      // Storm lightning flash
      if (weather === 'storm') {
        lightningTimer++;
        if (lightningTimer > 240 && Math.random() < 0.04) {
          lightningOpacity = 0.5;
          lightningTimer = 0;
        }
        if (lightningOpacity > 0) {
          ctx.fillStyle = `rgba(240, 249, 255, ${lightningOpacity})`;
          ctx.fillRect(0, 0, width, height);
          lightningOpacity -= 0.05;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weather]);

  if (weather === 'clear') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Sunset warm tint */}
      {weather === 'sunset' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/30 via-orange-950/20 to-purple-950/30 mix-blend-color-burn" />
      )}

      {/* Night deep indigo moonlight */}
      {weather === 'night' && (
        <div className="absolute inset-0 bg-blue-950/45 mix-blend-multiply" />
      )}

      {/* Fog mist */}
      {weather === 'fog' && (
        <div className="absolute inset-0 bg-stone-300/20 backdrop-blur-[1px] mix-blend-screen" />
      )}

      {/* Rain / Storm canvas */}
      {(weather === 'rain' || weather === 'storm') && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
};
