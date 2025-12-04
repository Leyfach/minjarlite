import React, { useEffect, useState } from 'react';
import { trackClick } from '../services/api';
import HeatmapLayer from './HeatmapLayer';
import { HeatmapPoint } from '../types';
import { fetchHeatmap } from '../services/api';
import ProductPage from './ProductPage';

interface DemoPageProps {
  onBack: () => void;
  showHeatmap: boolean;
}

const DemoPage: React.FC<DemoPageProps> = ({ onBack, showHeatmap }) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  const CURRENT_URL = '/product/simulated-endpoint';

  useEffect(() => {
    if (showHeatmap) {
      fetchHeatmap(CURRENT_URL).then(res => setHeatmapData(res.points));
    }
  }, [showHeatmap]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('#nav-controls')) return;

      const payload = {
        x: e.pageX,
        y: e.pageY,
        viewport_w: window.innerWidth,
        viewport_h: window.innerHeight,
        url: CURRENT_URL
      };

      trackClick(payload);
      
      if (showHeatmap) {
        setHeatmapData(prev => [...prev, { x: e.pageX, y: e.pageY, value: 1 }]);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showHeatmap]);

  return (
    <div className="relative min-h-screen bg-white">
      {showHeatmap && (
        <HeatmapLayer 
          points={heatmapData} 
          width={windowSize.w} 
          height={Math.max(windowSize.h, document.body.scrollHeight)} 
        />
      )}

      <div id="nav-controls" className="fixed top-4 left-4 z-[100] flex gap-2">
        <button 
          onClick={onBack}
          className="bg-brand-black text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-brand-orange transition-colors"
        >
          ← Dashboard
        </button>
        <div className="bg-brand-black/90 text-white px-4 py-2 text-sm backdrop-blur-sm border border-brand-gray/20">
          {showHeatmap ? 'Heatmap Mode: ON' : 'Live Tracking Mode'}
        </div>
      </div>

      <ProductPage />
    </div>
  );
};

export default DemoPage;
