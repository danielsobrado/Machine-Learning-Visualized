import React, { Suspense, lazy, useState } from 'react';
import { AlertTriangle, FlaskConical, LineChart, Play } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { classifySoftmaxSharpness, computeSoftmax, softmaxMetrics } from '../../data/softmaxModel';
import SoftmaxConfidenceLab from './SoftmaxConfidenceLab.jsx';

const SoftmaxAnimationPanel = lazy(() => import('./SoftmaxAnimationPanel'));
const SoftmaxGraphPanel = lazy(() => import('./SoftmaxGraphPanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));

const tabs = [
  { id: 'animation', label: '1. Animation', icon: Play },
  { id: 'graph', label: '2. Softmax Graph', icon: LineChart },
  { id: 'practice', label: '3. Practice Lab', icon: FlaskConical },
  { id: 'failure', label: '4. Confidence Trap', icon: AlertTriangle },
];

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
    </div>
  );
}

export default function SoftmaxAnimation() {
  const [activeTab, setActiveTab] = useState('animation');
  const [logits, setLogits] = useState([2, 1, 0.1]);
  const [temperature, setTemperature] = useState(1);
  const probabilities = computeSoftmax(logits, temperature);
  const metrics = softmaxMetrics(probabilities);
  const sharpness = classifySoftmaxSharpness(probabilities);

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
      default:
        return <Suspense fallback={<LoadingPanel />}><SoftmaxAnimationPanel /></Suspense>;
    }
  };

  return (
    <div className="ua-softmax-stage">
      <nav className="ua-segmented-tabs" aria-label="Softmax views">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
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

      <div className="ua-softmax-panel">{renderPanel()}</div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-6">
        <AssessmentPanel lessonId="softmax" />
      </div>
    </div>
  );
}
