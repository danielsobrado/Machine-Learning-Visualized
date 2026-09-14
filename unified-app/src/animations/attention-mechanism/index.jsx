import React, { Suspense, lazy, useRef, useState } from 'react';
import { Lightbulb, Brain, Calculator, Grid3X3, CheckCircle, Eye, Route } from 'lucide-react';

const AttentionRowLab = lazy(() => import('./AttentionRowLab'));
const IntuitionPanel = lazy(() => import('./IntuitionPanel'));
const QkvPanel = lazy(() => import('./QkvPanel'));
const ScaledDotProductPanel = lazy(() => import('./ScaledDotProductPanel'));
const MultiHeadPanel = lazy(() => import('./MultiHeadPanel'));
const SelfAttentionPanel = lazy(() => import('./SelfAttentionPanel'));
const AttentionPracticePanel = lazy(() => import('./AttentionPracticePanel'));

const tabs = [
    { id: 'row', label: '0. One Attention Row', icon: Route, color: 'from-slate-700 to-slate-950' },
    { id: 'intuition', label: '1. Intuition', icon: Lightbulb, color: 'from-amber-500 to-orange-500' },
    { id: 'qkv', label: '2. Q, K, V', icon: Brain, color: 'from-blue-500 to-cyan-500' },
    { id: 'scaled', label: '3. Scaled Dot-Product', icon: Calculator, color: 'from-purple-500 to-pink-500' },
    { id: 'multihead', label: '4. Multi-Head', icon: Grid3X3, color: 'from-green-500 to-emerald-500' },
    { id: 'self', label: '5. Self-Attention', icon: Eye, color: 'from-indigo-500 to-violet-500' },
    { id: 'practice', label: '6. Interpretation Lab', icon: CheckCircle, color: 'from-rose-500 to-red-500' },
];

function LoadingPanel() {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 motion-reduce:animate-none" /></div>;
}

export default function AttentionMechanismAnimation() {
    const [activeTab, setActiveTab] = useState('row');
    const tabRefs = useRef({});

    const renderPanel = () => {
        const content = {
            row: <AttentionRowLab />,
            intuition: <IntuitionPanel />,
            qkv: <QkvPanel />,
            scaled: <ScaledDotProductPanel />,
            multihead: <MultiHeadPanel />,
            self: <SelfAttentionPanel />,
            practice: <AttentionPracticePanel />,
        }[activeTab] || <AttentionRowLab />;
        return <Suspense fallback={<LoadingPanel />}>{content}</Suspense>;
    };

    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

    const activateTab = (tabId, focus = false) => {
        setActiveTab(tabId);
        if (focus) window.requestAnimationFrame(() => tabRefs.current[tabId]?.focus());
    };

    const handleTabKeyDown = (event, index) => {
        let nextIndex = null;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        activateTab(tabs[nextIndex].id, true);
    };

    return (
        <div className="flex h-full flex-col">
            <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/50 backdrop-blur-sm" aria-label="Attention lesson sections">
                <div className="overflow-x-auto px-4">
                    <div className="flex space-x-1 py-2" role="tablist" aria-label="Attention mechanism lesson">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                ref={(node) => { tabRefs.current[tab.id] = node; }}
                                id={`attention-tab-${tab.id}`}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`attention-panel-${tab.id}`}
                                tabIndex={activeTab === tab.id ? 0 : -1}
                                onClick={() => activateTab(tab.id)}
                                onKeyDown={(event) => handleTabKeyDown(event, index)}
                                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color} scale-105 text-white shadow-lg` : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <tab.icon size={18} />{tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="border-b border-slate-200 bg-slate-100/50">
                <div className="px-4 py-2">
                    <div className="flex items-center gap-2" aria-label="Lesson progress">
                        {tabs.map((tab, index) => (
                            <React.Fragment key={tab.id}>
                                <button
                                    type="button"
                                    aria-label={`Go to ${tab.label}`}
                                    aria-current={activeTab === tab.id ? 'step' : undefined}
                                    onClick={() => activateTab(tab.id)}
                                    className={`h-3 w-3 rounded-full transition-all ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color}` : activeIndex > index ? 'bg-green-500' : 'bg-slate-300'}`}
                                />
                                {index < tabs.length - 1 && <div className={`h-0.5 flex-1 ${activeIndex > index ? 'bg-green-500' : 'bg-slate-300'}`} aria-hidden="true" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div
                id={`attention-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`attention-tab-${activeTab}`}
                className="flex-1 overflow-y-auto"
            >
                {renderPanel()}
            </div>
        </div>
    );
}
