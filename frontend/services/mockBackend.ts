import { ClickData, HeatmapPoint, PageStats } from '../types';

const STORAGE_KEY = 'minjar_lite_data';

// Helper to get data from storage
const getStorageData = (): ClickData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Mock: POST /api/track
export const trackClick = async (payload: Omit<ClickData, 'timestamp'>): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const currentData = getStorageData();
  const newEntry: ClickData = {
    ...payload,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...currentData, newEntry]));
  console.log('[Backend] Click tracked:', newEntry);
};

// Mock: GET /api/heatmap?url=...
export const fetchHeatmap = async (url: string): Promise<{ points: HeatmapPoint[] }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allData = getStorageData();
  
  // Filter by the specific page URL
  const pageClicks = allData.filter(d => d.url === url);
  
  // Transform clicks into heatmap points
  // In a real app, you might aggregate clustering here, but for simplicity
  // we return raw points with a default intensity.
  const points: HeatmapPoint[] = pageClicks.map(click => ({
    x: click.x,
    y: click.y,
    value: 1 // Base intensity per click
  }));

  return { points };
};

// Helper: Get aggregated stats for the dashboard
export const getPageStats = async (): Promise<PageStats[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const allData = getStorageData();
  
  const statsMap = new Map<string, number>();
  
  allData.forEach(item => {
    const count = statsMap.get(item.url) || 0;
    statsMap.set(item.url, count + 1);
  });
  
  const stats: PageStats[] = [];
  statsMap.forEach((count, url) => {
    stats.push({ url, clickCount: count });
  });
  
  return stats;
};

// Helper: Clear data
export const clearData = () => {
  localStorage.removeItem(STORAGE_KEY);
};