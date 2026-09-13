import React, { useState, Suspense, lazy } from 'react';
import { GraduationCap, Layers, Zap, Database, GitCompare, Gauge } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const FineTuningDecisionLab = lazy(() => import('./FineTuningDecisionLab'));
const ConceptPanel = lazy(() => import('./ConceptPanel'));
const LoRAPanel = lazy(() => import('./LoRAPanel'));
const QLoRAPanel = lazy(() => import('./QLoRAPanel'));
const AlignmentPanel = lazy(() => import('./AlignmentPanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));

const tabs = [
    { id: 'decision', label: '0. Decision Lab', icon: Gauge, color: 'from-slate-700 to-slate-950' },
    { id: 'concept', label: '1. Concept', icon: GraduationCap, color: 'from-purple-500 to-indigo-500' },
    { id: 'lora', label: '2. LoRA', icon: Layers, color: 'from-blue-500 to-cyan-500' },
    { id: 'qlora', label: '3. QLoRA', icon: Zap, color: 'from-amber-500 to-orange-500' },
    { id: 'alignment', label: '4. Alignment', icon: GitCompare, color: 'from-emerald-500 to-teal-500' },
    { id: 'practice', label: '5. Practice Lab', icon: Database, color: 'from-rose-500 to-red-500' },
];

function LoadingPanel() {
    return (
        <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500" />
        </div>
    );
}

export default function FineTuningAnimation() {
    const [activeTab, setActiveTab] = useState('decision');

    const renderPanel = () => {
        switch (activeTab) {
            case 'decision':
                return <Suspense fallback={<LoadingPanel />}><FineTuningDecisionLab /></Suspense>;
            case 'concept':
                return <Suspense fallback={<LoadingPanel />}><ConceptPanel /></Suspense>;
            case 'lora':
                return <Suspense fallback={<LoadingPanel />}><LoRAPanel /></Suspense>;
            case 'qlora':
                return <Suspense fallback={<LoadingPanel />}><QLoRAPanel /></Suspense>;
            case 'alignment':
                return <Suspense fallback={<LoadingPanel />}><AlignmentPanel /></Suspense>;
            case 'practice':
                return <Suspense fallback={<LoadingPanel />}><PracticePanel /></Suspense>;
            default:
                return <Suspense fallback={<LoadingPanel />}><FineTuningDecisionLab /></Suspense>;
        }
    };

    return (
        <div className="flex h-full flex-col">
            <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
                <div className="overflow-x-auto px-4">
                    <div className="flex space-x-1 py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? `bg-gradient-to-r ${tab.color} scale-105 text-white shadow-lg`
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
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
                <div className="p-6">
                    <AssessmentPanel lessonId="fine-tuning" title="Fine-Tuning Methods check" />
                </div>
            </div>
        </div>
    );
}
