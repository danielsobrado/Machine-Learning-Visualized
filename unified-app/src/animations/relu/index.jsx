import React, { lazy, Suspense, useState } from 'react';
import { Activity, AlertTriangle, FlaskConical, GraduationCap, LineChart, Play } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const AnimationPanel = lazy(() => import('./AnimationPanel'));
const ReluGraphPanel = lazy(() => import('./ReluGraphPanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));
const ReluFailureLab = lazy(() => import('./ReluFailureLab'));
const ActivationComparisonLab = lazy(() => import('./ActivationComparisonLab'));

const TABS = [
  { id: 'animation', label: 'Animation', icon: Play },
  { id: 'graph', label: 'ReLU graph', icon: LineChart },
  { id: 'compare', label: 'Compare activations', icon: Activity },
  { id: 'practice', label: 'Practice', icon: FlaskConical },
  { id: 'failure', label: 'Dying ReLU', icon: AlertTriangle },
  { id: 'assessment', label: 'Assessment', icon: GraduationCap },
];

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-b-blue-600 motion-safe:animate-spin" />
    </div>
  );
}

function focusTab(event, index, setActiveTab) {
  const keyOffsets = { ArrowRight: 1, ArrowLeft: -1 };
  let nextIndex = index;

  if (event.key in keyOffsets) {
    nextIndex = (index + keyOffsets[event.key] + TABS.length) % TABS.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = TABS.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  setActiveTab(TABS[nextIndex].id);
  event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
}

export default function ReluAnimation() {
  const [activeTab, setActiveTab] = useState('animation');

  const renderPanel = () => {
    switch (activeTab) {
      case 'graph': return <ReluGraphPanel />;
      case 'compare': return <ActivationComparisonLab />;
      case 'practice': return <PracticePanel />;
      case 'failure': return <ReluFailureLab />;
      case 'assessment': return <div className="mx-auto max-w-6xl p-4 md:p-6"><AssessmentPanel lessonId="relu" title="Activation functions check" /></div>;
      case 'animation':
      default: return <AnimationPanel />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur" aria-label="Activation lesson views">
        <div className="overflow-x-auto px-4">
          <div className="flex gap-1 py-2" role="tablist" aria-label="Activation lesson views">
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                id={`relu-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`relu-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => focusTab(event, index, setActiveTab)}
                className={`flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-black transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <tab.icon size={17} aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div
        id={`relu-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`relu-tab-${activeTab}`}
        className="flex-1 overflow-auto"
      >
        <Suspense fallback={<LoadingPanel />}>{renderPanel()}</Suspense>
      </div>
    </div>
  );
}
