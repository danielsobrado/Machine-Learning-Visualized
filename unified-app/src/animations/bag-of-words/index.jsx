import React, { useState, Suspense, lazy } from 'react';
import { AlertTriangle, BookOpen, Hash, BarChart3, Calculator, Code, GraduationCap } from 'lucide-react';

// Lazy load panels
const IntroPanel = lazy(() => import('./IntroPanel'));
const BowPanel = lazy(() => import('./BowPanel'));
const OrderCollisionLab = lazy(() => import('./OrderCollisionLab'));
const TfIdfPanel = lazy(() => import('./TfIdfPanel'));
const ComparisonPanel = lazy(() => import('./ComparisonPanel'));
const CodePanel = lazy(() => import('./CodePanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));

// Tab configuration
const tabs = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { id: 'bow', label: '2. Bag of Words', icon: Hash, color: 'from-green-500 to-emerald-500' },
    { id: 'collision', label: '3. Order Collision', icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
    { id: 'tfidf', label: '4. TF-IDF', icon: BarChart3, color: 'from-yellow-500 to-amber-500' },
    { id: 'comparison', label: '5. Comparison', icon: Calculator, color: 'from-purple-500 to-pink-500' },
    { id: 'code', label: '6. Python Code', icon: Code, color: 'from-cyan-500 to-teal-500' },
    { id: 'practice', label: '7. Practice Lab', icon: GraduationCap, color: 'from-rose-500 to-red-500' },
];

// Loading fallback
function LoadingPanel() {
    return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );
}

export default function BagOfWordsAnimation() {
    const [activeTab, setActiveTab] = useState('intro');

    const renderPanel = () => {
        switch (activeTab) {
            case 'intro':
                return <Suspense fallback={<LoadingPanel />}><IntroPanel /></Suspense>;
            case 'bow':
                return <Suspense fallback={<LoadingPanel />}><BowPanel /></Suspense>;
            case 'collision':
                return <Suspense fallback={<LoadingPanel />}><OrderCollisionLab /></Suspense>;
            case 'tfidf':
                return <Suspense fallback={<LoadingPanel />}><TfIdfPanel /></Suspense>;
            case 'comparison':
                return <Suspense fallback={<LoadingPanel />}><ComparisonPanel /></Suspense>;
            case 'code':
                return <Suspense fallback={<LoadingPanel />}><CodePanel /></Suspense>;
            case 'practice':
                return <Suspense fallback={<LoadingPanel />}><PracticePanel /></Suspense>;
            default:
                return <Suspense fallback={<LoadingPanel />}><IntroPanel /></Suspense>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Navigation Tabs */}
            <nav className="bg-white/50 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="px-4 overflow-x-auto">
                    <div className="flex space-x-1 py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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

            {/* Panel Content */}
            <div className="flex-1 overflow-auto">
                {renderPanel()}
            </div>
        </div>
    );
}
