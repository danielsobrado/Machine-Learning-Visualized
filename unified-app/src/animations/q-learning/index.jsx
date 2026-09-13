import React, { Suspense, lazy, useState } from 'react';
import { AlertTriangle, Calculator, Grid, PlayCircle } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const MaximizationBiasLab = lazy(() => import('./MaximizationBiasLab'));
const TablePanel = lazy(() => import('./TablePanel'));
const AlgorithmPanel = lazy(() => import('./AlgorithmPanel'));
const TrainingPanel = lazy(() => import('./TrainingPanel'));

const tabs = [
  { id: 'bias', label: '0. Max Bias', icon: AlertTriangle },
  { id: 'table', label: '1. The Q-Table', icon: Grid },
  { id: 'algorithm', label: '2. Bellman Update', icon: Calculator },
  { id: 'training', label: '3. Training Loop', icon: PlayCircle },
];

function LoadingPanel() {
  return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500" /></div>;
}

export default function QLearningAnimation() {
  const [activeTab, setActiveTab] = useState('bias');

  const renderPanel = () => {
    const content = {
      bias: <MaximizationBiasLab />,
      table: <TablePanel />,
      algorithm: <AlgorithmPanel />,
      training: <TrainingPanel />,
    }[activeTab] ?? <MaximizationBiasLab />;
    return <Suspense fallback={<LoadingPanel />}>{content}</Suspense>;
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="overflow-x-auto px-4">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
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
        <div className="px-8 pb-8">
          <AssessmentPanel lessonId="q-learning" title="Q-Learning check" />
        </div>
      </div>
    </div>
  );
}
