import React, { useEffect, useMemo, useRef, useState } from 'react';
import HeatmapLayer from './HeatmapLayer';
import { fetchHeatmap, getPageStats } from '../services/api';
import { HeatmapPoint, PageStats } from '../types';
import ProductPage from './ProductPage';

interface AdminHeatmapProps {
  onBack: () => void;
}

type Cluster = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count: number;
  cx: number;
  cy: number;
};

const mergePointsToClusters = (pts: HeatmapPoint[], mergeDistance = 40, padding = 12) => {
  const clusters: Cluster[] = [];

  pts.forEach((p) => {
    let target: Cluster | undefined;
    for (const c of clusters) {
      const dist = Math.hypot(p.x - c.cx, p.y - c.cy);
      if (dist <= mergeDistance) {
        target = c;
        break;
      }
    }

    if (!target) {
      clusters.push({
        x1: p.x,
        y1: p.y,
        x2: p.x,
        y2: p.y,
        count: 1,
        cx: p.x,
        cy: p.y,
      });
    } else {
      target.count += 1;
      target.x1 = Math.min(target.x1, p.x);
      target.y1 = Math.min(target.y1, p.y);
      target.x2 = Math.max(target.x2, p.x);
      target.y2 = Math.max(target.y2, p.y);
      target.cx = target.cx + (p.x - target.cx) / target.count;
      target.cy = target.cy + (p.y - target.cy) / target.count;
    }
  });

  return clusters.map((c) => ({
    ...c,
    x1: c.x1 - padding,
    y1: c.y1 - padding,
    x2: c.x2 + padding,
    y2: c.y2 + padding,
  }));
};

const AdminHeatmap: React.FC<AdminHeatmapProps> = ({ onBack }) => {
  const [stats, setStats] = useState<PageStats[]>([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [overlaySize, setOverlaySize] = useState({ w: 0, h: 0 });

  const scaledPoints = useMemo(() => {
    return points.map((p) => {
      const vw = p.viewport_w || overlaySize.w || 1;
      const vh = p.viewport_h || overlaySize.h || 1;
      const scaleX = overlaySize.w / vw;
      const scaleY = overlaySize.h / vh;
      return {
        x: p.x * scaleX,
        y: p.y * scaleY,
        value: p.value,
      };
    });
  }, [points, overlaySize]);

  const clusters = useMemo(() => mergePointsToClusters(scaledPoints), [scaledPoints]);
  const totalClicks = points.length || 1;

  const measure = () => {
    if (pageRef.current) {
      const rect = pageRef.current.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      setOverlaySize({ w, h });
    }
  };

  const loadStats = async () => {
    try {
      const data = await getPageStats();
      setStats(data);
      if (data.length > 0 && !selectedUrl) {
        setSelectedUrl(data[0].url);
      }
    } catch (err) {
      setError('Failed to load page list');
    }
  };

  const loadHeatmap = async (url: string) => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchHeatmap(url);
      setPoints(res.points);
      setTimeout(measure, 0);
    } catch (err) {
      setError('Failed to load heatmap');
      setPoints([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedUrl) {
      loadHeatmap(selectedUrl);
    }
  }, [selectedUrl]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-brand-black">
      <div className="fixed top-4 left-4 z-[101] flex gap-2 items-center">
        <button
          onClick={onBack}
          className="bg-brand-black text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-brand-orange transition-colors"
        >
          ← Dashboard
        </button>
        <div className="px-3 py-2 bg-white border border-brand-gray shadow-sm text-sm">
          Admin Heatmap Viewer
        </div>
      </div>

      <header className="border-b border-brand-gray px-8 py-6 flex items-center justify-between sticky top-0 bg-white z-[100]">
        <div>
          <h1 className="text-2xl font-bold">Heatmap (Admin)</h1>
          <p className="text-gray-500 text-sm">Immersive page preview with hotspot analysis</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedUrl}
            onChange={e => setSelectedUrl(e.target.value)}
            className="border border-brand-gray px-3 py-2 text-sm"
          >
            <option value="">Select URL</option>
            {stats.map((s) => (
              <option key={s.url} value={s.url}>
                {s.url} ({s.clickCount})
              </option>
            ))}
          </select>
          <button
            onClick={() => loadHeatmap(selectedUrl)}
            disabled={!selectedUrl || isLoading}
            className="bg-brand-black text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-brand-orange disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="relative min-h-[80vh] bg-brand-offwhite">
        <div className="relative max-w-6xl mx-auto py-12 px-6">
          <div className="relative border border-brand-gray shadow-sm bg-white overflow-hidden">
            <div ref={pageRef} className="relative">
              <div className="pointer-events-none select-none">
                <ProductPage />
              </div>

              {overlaySize.w > 0 && overlaySize.h > 0 && (
                <div
                  className="absolute top-0 left-0 z-40 pointer-events-none"
                  style={{ width: `${overlaySize.w}px`, height: `${overlaySize.h}px` }}
                >
                  <HeatmapLayer points={scaledPoints} width={overlaySize.w} height={overlaySize.h} />
                  {clusters.map((c, idx) => {
                    const left = Math.max(c.x1, 0);
                    const top = Math.max(c.y1, 0);
                    const width = Math.max(c.x2 - c.x1, 24);
                    const height = Math.max(c.y2 - c.y1, 24);
                    const percent = ((c.count / totalClicks) * 100).toFixed(1);
                    return (
                      <div
                        key={`${c.cx}-${c.cy}-${idx}`}
                        className="absolute border-2 border-red-500/80 rounded-lg shadow-[0_0_0_2px_rgba(255,255,255,0.4)] pointer-events-auto group"
                        style={{ left, top, width, height }}
                      >
                        <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-red-500 text-xs px-3 py-1 shadow-md whitespace-nowrap">
                          {c.count} clicks · {percent}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {error && <div className="text-red-600 text-center py-4">{error}</div>}
        {!error && points.length === 0 && (
          <div className="text-gray-500 text-center pb-8">No data for the selected URL</div>
        )}
      </main>
    </div>
  );
};

export default AdminHeatmap;
