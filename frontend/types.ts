export interface ClickData {
  x: number;
  y: number;
  viewport_w: number;
  viewport_h: number;
  url: string;
  timestamp: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number; // 0 to 1 intensity
  viewport_w?: number;
  viewport_h?: number;
}

export type ViewMode = 'dashboard' | 'live-demo' | 'admin';

export interface PageStats {
  url: string;
  clickCount: number;
}
