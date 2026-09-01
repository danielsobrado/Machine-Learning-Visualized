import React, { Suspense, lazy, useState } from 'react';
import {
  Crosshair,
  MousePointer2,
  Ruler,
  ScanSearch,
  TrendingUp,
} from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const ResidualsPanel = lazy(() => import('./ResidualsPanel.jsx'));
const DiagnosticsPanel = lazy(() => import('./DiagnosticsPanel.jsx'));
const InfluenceLab = lazy(() => import('./InfluenceLab.jsx'));
const InteractivePanel = lazy(() => import('./InteractivePanel.jsx'));
const CostPanel = lazy(() => import('./CostPanel.jsx'));

const TABS = Object.freeze([
  { id: 'residuals', label: '1. Residuals', icon: Ruler, className: 'from-indigo-500 to-violet-500' },
  { id: 'diagnostics', label: '2. Diagnose the Fit', icon: ScanSearch, className: 'from-violet-500 to-fuchsia-500' },
  { id: 'influence', label: '3. Influence Lab', icon: Crosshair, className: 'from-cyan-500 to-blue-500' },
  { id: 'interactive', label: '4. Interactive Fitter', icon: MousePointer2, className: 'from-blue-500 to-cyan-500' },
  { id: 'cost', label: '5. Cost Landscape', icon: TrendingUp, className: 'from-green-500 to-emerald-500' },
]);

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500" />
    </div>
  );
}

function panelFor(tabId) {
  if (tabId === 'diagnostics') return <DiagnosticsPanel />;
  if (tabId === 'influence') return <InfluenceLab />;
  if (tabId === 'interactive') return <InteractivePanel />;
  if (tabId === 'cost') return <CostPanel />;
  return <ResidualsPanel />;
}

export default function LinearRegressionAnimation() {
  const [activeTab, setActiveTab] = useState('residuals');

  return (
    <div className="space-y-6">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="overflow-x-auto px-4">
          <div className="flex space-x-1 py-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    selected
                      ? `bg-gradient-to-r ${tab.className} text-white shadow-md`
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <Suspense fallback={<LoadingPanel />}>{panelFor(activeTab)}</Suspense>
      <AssessmentPanel lessonId="linear-regression" title="Linear Regression check" />
    </div>
  );
}
