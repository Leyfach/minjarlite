import { ClickData, HeatmapPoint, PageStats } from '../types';

const STORAGE_KEY = 'minjar_lite_data';

const getStorageData = (): ClickData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const trackClick = async (payload: Omit<ClickData, 'timestamp'>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const currentData = getStorageData();
  const newEntry: ClickData = {
    ...payload,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...currentData, newEntry]));
  console.log('[Backend] Click tracked:', newEntry);
};

export const fetchHeatmap = async (url: string): Promise<{ points: HeatmapPoint[] }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allData = getStorageData();
  
  const pageClicks = allData.filter(d => d.url === url);
  
  const points: HeatmapPoint[] = pageClicks.map(click => ({
    x: click.x,
    y: click.y,
    value: 1
  }));

  return { points };
};

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

export const clearData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
