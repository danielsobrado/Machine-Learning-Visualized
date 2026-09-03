import React, { Suspense, lazy, useState } from 'react';
import { Lightbulb, Brain, Calculator, Grid3X3, CheckCircle, Eye } from 'lucide-react';

const IntuitionPanel = lazy(() => import('./IntuitionPanel'));
const QkvPanel = lazy(() => import('./QkvPanel'));
const ScaledDotProductPanel = lazy(() => import('./ScaledDotProductPanel'));
const MultiHeadPanel = lazy(() => import('./MultiHeadPanel'));
const SelfAttentionPanel = lazy(() => import('./SelfAttentionPanel'));
const AttentionPracticePanel = lazy(() => import('./AttentionPracticePanel'));

const tabs = [
    { id: 'intuition', label: '1. Intuition', icon: Lightbulb, color: 'from-amber-500 to-orange-500' },
    { id: 'qkv', label: '2. Q, K, V', icon: Brain, color: 'from-blue-500 to-cyan-500' },
    { id: 'scaled', label: '3. Scaled Dot-Product', icon: Calculator, color: 'from-purple-500 to-pink-500' },
    { id: 'multihead', label: '4. Multi-Head', icon: Grid3X3, color: 'from-green-500 to-emerald-500' },
    { id: 'self', label: '5. Self-Attention', icon: Eye, color: 'from-indigo-500 to-violet-500' },
    { id: 'practice', label: '6. Interpretation Lab', icon: CheckCircle, color: 'from-rose-500 to-red-500' },
];

function LoadingPanel() {
    return <div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;
}

export default function AttentionMechanismAnimation() {
    const [activeTab, setActiveTab] = useState('intuition');

    const renderPanel = () => {
        const content = {
            intuition: <IntuitionPanel />,
            qkv: <QkvPanel />,
            scaled: <ScaledDotProductPanel />,
            multihead: <MultiHeadPanel />,
            self: <SelfAttentionPanel />,
            practice: <AttentionPracticePanel />,
        }[activeTab] || <IntuitionPanel />;
        return <Suspense fallback={<LoadingPanel />}>{content}</Suspense>;
    };

    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

    return (
        <div className="flex flex-col h-full">
            <nav className="bg-white/50 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="px-4 overflow-x-auto">
                    <div className="flex space-x-1 py-2">
                        {tabs.map((tab) => (
                            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105` : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                                <tab.icon size={18} />{tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="bg-slate-100/50 border-b border-slate-200">
                <div className="px-4 py-2">
                    <div className="flex items-center gap-2">
                        {tabs.map((tab, index) => (
                            <React.Fragment key={tab.id}>
                                <button type="button" aria-label={`Open ${tab.label}`} onClick={() => setActiveTab(tab.id)} className={`w-3 h-3 rounded-full transition-all ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color}` : activeIndex > index ? 'bg-green-500' : 'bg-slate-300'}`} />
                                {index < tabs.length - 1 && <div className={`flex-1 h-0.5 ${activeIndex > index ? 'bg-green-500' : 'bg-slate-300'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">{renderPanel()}</div>
        </div>
    );
}
