import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DemoPage from './components/DemoPage';
import AdminHeatmap from './components/AdminHeatmap';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [showHeatmapInDemo, setShowHeatmapInDemo] = useState(false);

  const handleLaunchDemo = (enableHeatmap: boolean) => {
    setShowHeatmapInDemo(enableHeatmap);
    setViewMode('live-demo');
  };

  const handleBackToDash = () => {
    setViewMode('dashboard');
  };

  const handleOpenAdmin = () => {
    setViewMode('admin');
  };

  return (
    <>
      {viewMode === 'dashboard' && (
        <Dashboard onLaunchDemo={handleLaunchDemo} onOpenAdmin={handleOpenAdmin} />
      )}
      {viewMode === 'live-demo' && (
        <DemoPage 
          onBack={handleBackToDash} 
          showHeatmap={showHeatmapInDemo} 
        />
      )}
      {viewMode === 'admin' && (
        <AdminHeatmap onBack={handleBackToDash} />
      )}
    </>
  );
};

export default App;
