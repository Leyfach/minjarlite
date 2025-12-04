import React, { useEffect, useRef } from 'react';
import { HeatmapPoint } from '../types';

interface HeatmapLayerProps {
  points: HeatmapPoint[];
  width: number;
  height: number;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const RADIUS = 25;
  const BLUR = 15;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (points.length === 0) return;

    points.forEach(point => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, RADIUS);
      gradient.addColorStop(0, 'rgba(0,0,0,0.15)'); 
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.arc(point.x, point.y, RADIUS, 0, Math.PI * 2);
      ctx.fill();
    });

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const paletteCanvas = document.createElement('canvas');
    paletteCanvas.width = 1;
    paletteCanvas.height = 256;
    const paletteCtx = paletteCanvas.getContext('2d');
    
    if (paletteCtx) {
      const gradient = paletteCtx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0.0, 'blue');
      gradient.addColorStop(0.25, 'cyan');
      gradient.addColorStop(0.55, 'lime');
      gradient.addColorStop(0.85, 'yellow');
      gradient.addColorStop(1.0, 'red');
      
      paletteCtx.fillStyle = gradient;
      paletteCtx.fillRect(0, 0, 1, 256);
      
      const paletteData = paletteCtx.getImageData(0, 0, 1, 256).data;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha > 0) {
          const offset = alpha * 4;
          data[i] = paletteData[offset];
          data[i + 1] = paletteData[offset + 1];
          data[i + 2] = paletteData[offset + 2];
          data[i + 3] = Math.min(alpha * 4, 200); 
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }

  }, [points, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none z-50"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default HeatmapLayer;
