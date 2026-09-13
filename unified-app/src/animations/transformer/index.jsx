import React, { useState, Suspense, lazy } from 'react';
import { Building2, Layers, ArrowRightLeft, Zap, GraduationCap, Route } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const GuidedTracePanel = lazy(() => import('./GuidedTracePanel'));
const OverviewPanel = lazy(() => import('./OverviewPanel'));
const EncoderPanel = lazy(() => import('./EncoderPanel'));
const DecoderPanel = lazy(() => import('./DecoderPanel'));
const DataFlowPanel = lazy(() => import('./DataFlowPanel'));
const VariantsPanel = lazy(() => import('./VariantsPanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));

const tabs = [
    { id: 'guided', label: '0. Guided Trace', icon: Route, color: 'from-slate-700 to-slate-950' },
    { id: 'overview', label: '1. Architecture', icon: Building2, color: 'from-amber-500 to-orange-500' },
    { id: 'encoder', label: '2. Encoder', icon: Layers, color: 'from-blue-500 to-cyan-500' },
    { id: 'decoder', label: '3. Decoder', icon: Layers, color: 'from-purple-500 to-pink-500' },
    { id: 'dataflow', label: '4. Data Flow', icon: ArrowRightLeft, color: 'from-green-500 to-emerald-500' },
    { id: 'variants', label: '5. Variants', icon: Zap, color: 'from-indigo-500 to-violet-500' },
    { id: 'practice', label: '6. Practice Lab', icon: GraduationCap, color: 'from-rose-500 to-red-500' },
];

function LoadingPanel() {
    return (
        <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
        </div>
    );
}

export default function TransformerAnimation() {
    const [activeTab, setActiveTab] = useState('guided');

    const renderPanel = () => {
        switch (activeTab) {
            case 'guided':
                return <Suspense fallback={<LoadingPanel />}><GuidedTracePanel /></Suspense>;
            case 'overview':
                return <Suspense fallback={<LoadingPanel />}><OverviewPanel /></Suspense>;
            case 'encoder':
                return <Suspense fallback={<LoadingPanel />}><EncoderPanel /></Suspense>;
            case 'decoder':
                return <Suspense fallback={<LoadingPanel />}><DecoderPanel /></Suspense>;
            case 'dataflow':
                return <Suspense fallback={<LoadingPanel />}><DataFlowPanel /></Suspense>;
            case 'variants':
                return <Suspense fallback={<LoadingPanel />}><VariantsPanel /></Suspense>;
            case 'practice':
                return <Suspense fallback={<LoadingPanel />}><PracticePanel /></Suspense>;
            default:
                return <Suspense fallback={<LoadingPanel />}><GuidedTracePanel /></Suspense>;
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
                <div className="p-4 md:p-6">
                    <AssessmentPanel lessonId="transformer" title="Transformer fundamentals check" />
                </div>
            </div>
        </div>
    );
}
