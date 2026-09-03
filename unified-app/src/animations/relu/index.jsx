import React, { lazy, Suspense, useState } from 'react';
import { AlertTriangle, FlaskConical, GraduationCap, LineChart, Play } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const AnimationPanel = lazy(() => import('./AnimationPanel'));
const ReluGraphPanel = lazy(() => import('./ReluGraphPanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));
const ReluFailureLab = lazy(() => import('./ReluFailureLab'));

const TABS = [
  { id: 'animation', label: 'Animation', icon: Play },
  { id: 'graph', label: 'ReLU graph', icon: LineChart },
  { id: 'practice', label: 'Practice', icon: FlaskConical },
  { id: 'failure', label: 'Dying ReLU', icon: AlertTriangle },
  { id: 'assessment', label: 'Assessment', icon: GraduationCap },
];

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-b-blue-600" />
    </div>
  );
}

export default function ReluAnimation() {
  const [activeTab, setActiveTab] = useState('animation');

  const renderPanel = () => {
    switch (activeTab) {
      case 'graph': return <ReluGraphPanel />;
      case 'practice': return <PracticePanel />;
      case 'failure': return <ReluFailureLab />;
      case 'assessment': return <div className="mx-auto max-w-6xl p-4 md:p-6"><AssessmentPanel lessonId="relu" title="ReLU check" /></div>;
      case 'animation':
      default: return <AnimationPanel />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="overflow-x-auto px-4">
          <div className="flex gap-1 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-black transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <tab.icon size={17} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingPanel />}>{renderPanel()}</Suspense>
      </div>
    </div>
  );
}
