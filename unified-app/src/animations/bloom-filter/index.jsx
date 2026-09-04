import React, { Suspense, lazy, useState } from 'react';
import { AlertTriangle, Play, Settings, Trash2 } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const PlaygroundPanel = lazy(() => import('./PlaygroundPanel'));
const CollisionPanel = lazy(() => import('./CollisionPanel'));
const TuningPanel = lazy(() => import('./TuningPanel'));
const DeletionFailureLab = lazy(() => import('./DeletionFailureLab'));

const tabs = [
  { id: 'playground', label: '1. Playground', icon: Play, color: 'from-indigo-500 to-violet-500' },
  { id: 'collision', label: '2. False Positive Lab', icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
  { id: 'tuning', label: '3. Tuning Studio', icon: Settings, color: 'from-blue-500 to-cyan-500' },
  { id: 'deletion', label: '4. Deletion Failure', icon: Trash2, color: 'from-rose-500 to-red-500' },
];

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500" />
    </div>
  );
}

export default function BloomFilterAnimation() {
  const [activeTab, setActiveTab] = useState('playground');

  const renderPanel = () => {
    switch (activeTab) {
      case 'playground': return <PlaygroundPanel />;
      case 'collision': return <CollisionPanel />;
      case 'tuning': return <TuningPanel />;
      case 'deletion': return <div className="p-4 md:p-8"><DeletionFailureLab /></div>;
      default: return <PlaygroundPanel />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="overflow-x-auto px-4">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color} scale-105 text-white shadow-lg` : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingPanel />}>{renderPanel()}</Suspense>
        <div className="px-4 pb-8 md:px-8">
          <AssessmentPanel lessonId="bloom-filter" title="Bloom filter check" />
        </div>
      </div>
    </div>
  );
}
