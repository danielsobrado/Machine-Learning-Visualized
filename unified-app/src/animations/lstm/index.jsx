import React, { Suspense, lazy, useState } from 'react';
import { BookOpen, Microscope, PlayCircle, Repeat } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import LstmNumericFlowLab from './LstmNumericFlowLab.jsx';

const ConceptPanel = lazy(() => import('./ConceptPanel'));
const AnatomyPanel = lazy(() => import('./AnatomyPanel'));
const SequencePanel = lazy(() => import('./SequencePanel'));

const tabs = [
  { id: 'concept', label: '1. Concept', icon: BookOpen },
  { id: 'anatomy', label: '2. Anatomy', icon: Microscope },
  { id: 'flow', label: '3. Numerical Flow', icon: PlayCircle },
  { id: 'sequence', label: '4. Sequence View', icon: Repeat },
];

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500" />
    </div>
  );
}

export default function LstmAnimation() {
  const [activeTab, setActiveTab] = useState('concept');

  const renderPanel = () => {
    switch (activeTab) {
      case 'concept':
        return <Suspense fallback={<LoadingPanel />}><ConceptPanel /></Suspense>;
      case 'anatomy':
        return <Suspense fallback={<LoadingPanel />}><AnatomyPanel /></Suspense>;
      case 'flow':
        return <LstmNumericFlowLab />;
      case 'sequence':
        return <Suspense fallback={<LoadingPanel />}><SequencePanel /></Suspense>;
      default:
        return <Suspense fallback={<LoadingPanel />}><ConceptPanel /></Suspense>;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur" aria-label="LSTM views">
        <div className="overflow-x-auto px-4">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-auto">
        {renderPanel()}
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
          <AssessmentPanel lessonId="lstm" />
        </div>
      </div>
    </div>
  );
}
