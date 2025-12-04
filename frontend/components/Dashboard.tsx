import React, { useEffect, useState } from 'react';
import { getPageStats, clearData } from '../services/api';
import { PageStats } from '../types';

interface DashboardProps {
  onLaunchDemo: (heatmapMode: boolean) => void;
  onOpenAdmin?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunchDemo, onOpenAdmin }) => {
  const [stats, setStats] = useState<PageStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await getPageStats();
      setStats(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleReset = async () => {
    if(confirm('Clear all recorded click data?')) {
      await clearData();
      loadStats();
    }
  };

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black font-sans">
      <header className="bg-white border-b border-brand-gray h-16 flex items-center px-8 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full opacity-50"></div>
            </div>
            <span className="font-bold text-xl tracking-tight">Minjar<span className="font-light">Lite</span></span>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
           <button onClick={loadStats} className="text-gray-500 hover:text-black">Refresh Data</button>
           <button onClick={handleReset} className="text-red-500 hover:text-red-700">Clear Data</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 border border-brand-gray shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold mb-4">Generate Data</h2>
                <p className="text-gray-500 mb-6">
                    Go to the live simulated product page and click around to generate heatmap points.
                </p>
                <button 
                    onClick={() => onLaunchDemo(false)}
                    className="w-full bg-brand-black text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
                >
                    Launch Live Site
                </button>
            </div>
            
            <div className="bg-white p-8 border border-brand-gray shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold mb-4">Visualize Heatmaps</h2>
                <p className="text-gray-500 mb-6">
                    Overlay the recorded click data onto the product page to analyze user behavior.
                </p>
                <button 
                    onClick={() => onLaunchDemo(true)}
                    className="w-full border-2 border-brand-black text-brand-black py-3 px-6 font-bold uppercase tracking-wide hover:bg-brand-black hover:text-white transition-colors"
                >
                    View Heatmap
                </button>
            </div>

            <div className="bg-white p-8 border border-brand-gray shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold mb-4">Admin Heatmap</h2>
                <p className="text-gray-500 mb-6">
                    Jump to the admin viewer to inspect heatmaps for any tracked URL.
                </p>
                <button 
                    onClick={() => onOpenAdmin && onOpenAdmin()}
                    className="w-full bg-brand-orange text-white py-3 px-6 font-bold uppercase tracking-wide hover:bg-brand-black transition-colors"
                >
                    Admin Viewer
                </button>
            </div>
        </div>

        <div className="bg-white border border-brand-gray">
            <div className="px-6 py-4 border-b border-brand-gray flex justify-between items-center">
                <h3 className="font-bold text-lg">Tracked Pages</h3>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">API</span>
            </div>
            
            {isLoading ? (
                <div className="p-8 text-center text-gray-400">Loading analytics...</div>
            ) : stats.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-gray-400 mb-4">No data recorded yet.</p>
                    <button 
                         onClick={() => onLaunchDemo(false)}
                         className="text-brand-orange font-bold hover:underline"
                    >
                        Start tracking clicks &rarr;
                    </button>
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">URL Path</th>
                            <th className="px-6 py-3 font-semibold text-right">Total Clicks</th>
                            <th className="px-6 py-3 font-semibold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gray">
                        {stats.map((page) => (
                            <tr key={page.url} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{page.url}</td>
                                <td className="px-6 py-4 text-right font-mono">{page.clickCount}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Active
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
