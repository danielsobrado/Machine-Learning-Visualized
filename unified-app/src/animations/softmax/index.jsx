import React, { Suspense, lazy, useRef, useState } from 'react';
import { AlertTriangle, FlaskConical, GitBranch, LineChart, Play } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { classifySoftmaxSharpness, computeSoftmax, softmaxMetrics } from '../../data/softmaxModel';
import SoftmaxConfidenceLab from './SoftmaxConfidenceLab.jsx';
import SoftmaxJacobianLab from './SoftmaxJacobianLab.jsx';

const SoftmaxAnimationPanel = lazy(() => import('./SoftmaxAnimationPanel'));
const SoftmaxGraphPanel = lazy(() => import('./SoftmaxGraphPanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));

const tabs = [
  { id: 'animation', label: '1. Animation', icon: Play },
  { id: 'graph', label: '2. Softmax Graph', icon: LineChart },
  { id: 'practice', label: '3. Practice Lab', icon: FlaskConical },
  { id: 'failure', label: '4. Confidence Trap', icon: AlertTriangle },
  { id: 'jacobian', label: '5. Coupled Gradients', icon: GitBranch },
];

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center p-12" role="status" aria-label="Loading softmax view">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 motion-reduce:animate-none" />
    </div>
  );
}

export default function SoftmaxAnimation() {
  const [activeTab, setActiveTab] = useState('animation');
  const [logits, setLogits] = useState([2, 1, 0.1]);
  const [temperature, setTemperature] = useState(1);
  const tabRefs = useRef({});
  const probabilities = computeSoftmax(logits, temperature);
  const metrics = softmaxMetrics(probabilities);
  const sharpness = classifySoftmaxSharpness(probabilities);

  const selectTab = (id, focus = false) => {
    setActiveTab(id);
    if (focus) requestAnimationFrame(() => tabRefs.current[id]?.focus());
  };

  const handleTabKeyDown = (event, index) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    selectTab(tabs[nextIndex].id, true);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'animation':
        return <Suspense fallback={<LoadingPanel />}><SoftmaxAnimationPanel /></Suspense>;
      case 'graph':
        return <Suspense fallback={<LoadingPanel />}><SoftmaxGraphPanel logits={logits} probabilities={probabilities} isActive /></Suspense>;
      case 'practice':
        return (
          <Suspense fallback={<LoadingPanel />}>
            <PracticePanel
              logits={logits}
              probabilities={probabilities}
              temperature={temperature}
              onLogitsChange={setLogits}
              onTemperatureChange={setTemperature}
            />
          </Suspense>
        );
      case 'failure':
        return <SoftmaxConfidenceLab />;
      case 'jacobian':
        return <SoftmaxJacobianLab />;
      default:
        return <Suspense fallback={<LoadingPanel />}><SoftmaxAnimationPanel /></Suspense>;
    }
  };

  return (
    <div className="ua-softmax-stage">
      <nav className="ua-segmented-tabs" aria-label="Softmax views" role="tablist">
        {tabs.map((tab, index) => (
          <button
            type="button"
            key={tab.id}
            ref={(node) => { tabRefs.current[tab.id] = node; }}
            role="tab"
            id={`softmax-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`softmax-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => selectTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            className={activeTab === tab.id ? 'active' : ''}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="ua-metrics-row" aria-label="Softmax distribution metrics">
        <div>
          <span>τ</span>
          <strong>{temperature.toFixed(2)}</strong>
          <small>temperature</small>
        </div>
        <div>
          <span>max p</span>
          <strong>{(metrics.maxProbability * 100).toFixed(1)}%</strong>
          <small>{sharpness.label} distribution</small>
        </div>
        <div>
          <span>H</span>
          <strong>{metrics.entropy.toFixed(2)}</strong>
          <small>entropy bits</small>
        </div>
        <div>
          <span>Δ</span>
          <strong>{metrics.margin.toFixed(2)}</strong>
          <small>probability margin</small>
        </div>
      </div>

      <p className="mx-auto mt-3 max-w-5xl px-4 text-sm leading-6 text-slate-600">
        These numbers describe the softmax distribution. They do not by themselves prove calibration or correctness.
      </p>

      <div
        className="ua-softmax-panel"
        role="tabpanel"
        id={`softmax-panel-${activeTab}`}
        aria-labelledby={`softmax-tab-${activeTab}`}
      >
        {renderPanel()}
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-6">
        <AssessmentPanel lessonId="softmax" />
      </div>
    </div>
  );
}
