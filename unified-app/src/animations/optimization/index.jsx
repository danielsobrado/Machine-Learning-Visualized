import React, { useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import DescentPanel from './DescentPanel';
import LandscapePanel from './LandscapePanel';
import OptimizationBoundaryLab from './OptimizationBoundaryLab.jsx';
import { Tabs } from '../../_design-system/ui';

const TABS = [
  { id: 'descent', label: '1. Gradient Descent' },
  { id: 'landscape', label: '2. Loss Geometry' },
  { id: 'boundary', label: '3. What Optimization Owns' },
];

export default function OptimizationAnimation() {
  const [activeTab, setActiveTab] = useState('descent');

  const renderContent = () => {
    switch (activeTab) {
      case 'descent': return <DescentPanel />;
      case 'landscape': return <LandscapePanel />;
      case 'boundary': return <OptimizationBoundaryLab />;
      default: return null;
    }
  };

  return (
    <div className="text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-300">Optimization fundamentals</p>
          <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">Objective, geometry, gradient, step.</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
            This lesson is about the problem being optimized and the geometry of that problem. Momentum, Adam, AdamW, and optimizer-state mechanics live in the separate Optimizers lesson.
          </p>
        </section>

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        <div className="min-h-[600px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70 shadow-2xl backdrop-blur-sm">
          {renderContent()}
        </div>
        <AssessmentPanel lessonId="optimization" title="Optimization check" />
      </div>
    </div>
  );
}
