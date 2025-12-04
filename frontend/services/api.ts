import { ClickData, HeatmapPoint, PageStats } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API error ${res.status}: ${detail}`);
  }
  return res.json();
};

export const trackClick = async (payload: Omit<ClickData, 'timestamp'>): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await handleResponse(res);
};

export const fetchHeatmap = async (url: string): Promise<{ points: HeatmapPoint[] }> => {
  const res = await fetch(`${API_BASE}/api/heatmap?url=${encodeURIComponent(url)}`);
  return handleResponse(res);
};

export const getPageStats = async (): Promise<PageStats[]> => {
  const res = await fetch(`${API_BASE}/api/stats`);
  return handleResponse(res);
};

export const clearData = async (): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/data`, { method: 'DELETE' });
  await handleResponse(res);
};
