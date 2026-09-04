import React, { lazy, Suspense, useCallback, useState } from 'react';
import { FlaskConical, Gauge, HelpCircle, LineChart, Play } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const GradientDescentPanel = lazy(() => import('./GradientDescentPanel'));
const LossHistoryPanel = lazy(() => import('./LossHistoryPanel'));
const PracticePanel = lazy(() => import('./PracticePanel'));
const GradientDescentStabilityLab = lazy(() => import('./GradientDescentStabilityLab'));

const TABS = Object.freeze([
    { id: 'descent', label: '1. Gradient Descent', icon: Play, color: 'from-blue-500 to-cyan-500' },
    { id: 'history', label: '2. Loss History', icon: LineChart, color: 'from-green-500 to-emerald-500' },
    { id: 'practice', label: '3. Practice Lab', icon: FlaskConical, color: 'from-rose-500 to-red-500' },
    { id: 'stability', label: '4. Stability Lab', icon: Gauge, color: 'from-amber-500 to-orange-500' },
    { id: 'assessment', label: '5. Knowledge Check', icon: HelpCircle, color: 'from-violet-500 to-purple-500' },
]);

function LoadingPanel() {
    return (
        <div className="flex items-center justify-center p-12" role="status" aria-label="Loading lesson panel">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
    );
}

export default function GradientDescentAnimation() {
    const [activeTab, setActiveTab] = useState('descent');
    const [learningRate, setLearningRate] = useState(0.1);
    const [startWeight, setStartWeight] = useState(4);
    const [stepHistory, setStepHistory] = useState([]);

    const handleStepChange = useCallback((iteration, weight, loss) => {
        setStepHistory((previous) => {
            if (iteration === 0) return [{ iteration, weight, loss }];
            if (previous.length === 0 || previous[previous.length - 1].iteration !== iteration) {
                return [...previous, { iteration, weight, loss }];
            }
            return previous;
        });
    }, []);

    const handleParamsChange = useCallback((nextLearningRate, nextStartWeight) => {
        setLearningRate(nextLearningRate);
        setStartWeight(nextStartWeight);
        setStepHistory([]);
    }, []);

    const renderPanel = () => {
        if (activeTab === 'assessment') {
            return <AssessmentPanel lessonId="gradient-descent" title="Gradient Descent check" />;
        }

        return (
            <Suspense fallback={<LoadingPanel />}>
                {activeTab === 'descent' && (
                    <GradientDescentPanel
                        learningRate={learningRate}
                        startWeight={startWeight}
                        onStepChange={handleStepChange}
                    />
                )}
                {activeTab === 'history' && <LossHistoryPanel history={stepHistory} />}
                {activeTab === 'practice' && (
                    <PracticePanel
                        learningRate={learningRate}
                        startWeight={startWeight}
                        onParamsChange={handleParamsChange}
                    />
                )}
                {activeTab === 'stability' && <GradientDescentStabilityLab />}
            </Suspense>
        );
    };

    return (
        <div className="flex h-full flex-col">
            <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm" aria-label="Gradient descent lesson sections">
                <div className="overflow-x-auto px-4">
                    <div className="flex space-x-1 py-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                aria-pressed={activeTab === tab.id}
                                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? `scale-105 bg-gradient-to-r ${tab.color} text-white shadow-lg`
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

            <div className="flex-1 overflow-auto">{renderPanel()}</div>
        </div>
    );
}
