import React, { useState, Suspense, lazy } from 'react';
import { AlertTriangle, BookOpen, Scissors, Puzzle, FlaskConical } from 'lucide-react';

const ConceptPanel = lazy(() => import('./ConceptPanel'));
const BPEPanel = lazy(() => import('./BPEPanel'));
const WordPiecePanel = lazy(() => import('./WordPiecePanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));
const BoundaryFailureLab = lazy(() => import('./BoundaryFailureLab'));

const tabs = [
    { id: 'concept', label: '1. What is Tokenization?', icon: BookOpen, color: 'from-indigo-500 to-violet-500' },
    { id: 'bpe', label: '2. BPE Algorithm', icon: Scissors, color: 'from-blue-500 to-cyan-500' },
    { id: 'wordpiece', label: '3. WordPiece', icon: Puzzle, color: 'from-green-500 to-emerald-500' },
    { id: 'practice', label: '4. Practice Lab', icon: FlaskConical, color: 'from-rose-500 to-red-500' },
    { id: 'failure', label: '5. Boundary Traps', icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
];

function LoadingPanel() {
    return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );
}

export default function TokenizationAnimation() {
    const [activeTab, setActiveTab] = useState('concept');

    const renderPanel = () => {
        switch (activeTab) {
            case 'concept': return <Suspense fallback={<LoadingPanel />}><ConceptPanel /></Suspense>;
            case 'bpe': return <Suspense fallback={<LoadingPanel />}><BPEPanel /></Suspense>;
            case 'wordpiece': return <Suspense fallback={<LoadingPanel />}><WordPiecePanel /></Suspense>;
            case 'practice': return <Suspense fallback={<LoadingPanel />}><PracticePanel /></Suspense>;
            case 'failure': return <Suspense fallback={<LoadingPanel />}><BoundaryFailureLab /></Suspense>;
            default: return <Suspense fallback={<LoadingPanel />}><ConceptPanel /></Suspense>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <nav className="bg-white/50 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="px-4 overflow-x-auto">
                    <div className="flex space-x-1 py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                aria-pressed={activeTab === tab.id}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
            <div className="flex-1 overflow-auto">{renderPanel()}</div>
        </div>
    );
}
