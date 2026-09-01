import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function EpsilonPanel() {
    const [epsilon, setEpsilon] = useState(0.2);
    const [history, setHistory] = useState([]); // 'explore' or 'exploit'
    const [isAuto, setIsAuto] = useState(false);

    // Stats
    const exploreCount = history.filter(h => h === 'explore').length;
    const exploitCount = history.filter(h => h === 'exploit').length;

    const data = [
        { name: 'Exploration (Random)', value: exploreCount, color: '#a78bfa' }, // violet-400
        { name: 'Exploitation (Greedy)', value: exploitCount, color: '#34d399' }  // emerald-400
    ];

    const step = () => {
        const rand = Math.random();
        const actionType = rand < epsilon ? 'explore' : 'exploit';
        setHistory(prev => [...prev.slice(-99), actionType]);
    };

    useEffect(() => {
        let interval;
        if (isAuto) {
            interval = setInterval(step, 100);
        }
        return () => clearInterval(interval);
    }, [isAuto, epsilon]);

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-violet-400 mb-4">Epsilon-Greedy Strategy</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    <strong>Exploration</strong>: Trying new things to find better rewards.
                    <br />
                    <strong>Exploitation</strong>: Using what you know to get the best reward.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl items-center">
                {/* Controls */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-6">Epsilon (ε) Control</h3>

                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm text-slate-800">Exploration Rate</label>
                            <span className="text-3xl font-mono font-bold text-violet-400">{epsilon.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.05"
                            value={epsilon}
                            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                            className="w-full accent-violet-400"
                        />
                        <div className="flex justify-between text-xs text-slate-700 mt-2">
                            <span>0.0 (Pure Greedy)</span>
                            <span>1.0 (Pure Random)</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={step}
                            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all"
                        >
                            Take 1 Step
                        </button>
                        <button
                            onClick={() => setIsAuto(!isAuto)}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all text-white ${isAuto ? 'bg-red-600 hover:bg-red-500' : 'bg-violet-600 hover:bg-violet-500'}`}
                        >
                            {isAuto ? 'Stop' : 'Auto Run'}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <button onClick={() => setHistory([])} className="text-xs text-slate-700 hover:text-white underline">
                            Reset Stats
                        </button>
                    </div>
                </div>

                {/* Visualization */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                    <h3 className="font-bold text-white mb-4">Action Distribution</h3>

                    <div className="w-64 h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="text-2xl font-bold text-white">{history.length}</div>
                            <div className="text-xs text-slate-700">Total Steps</div>
                        </div>
                    </div>

                    <div className="w-full mt-6 space-y-2">
                        <div className="flex justify-between items-center bg-slate-900 p-3 rounded border-l-4 border-violet-400">
                            <span className="text-slate-700">Exploration (Random)</span>
                            <span className="font-mono font-bold text-white">{exploreCount}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900 p-3 rounded border-l-4 border-emerald-400">
                            <span className="text-slate-700">Exploitation (Greedy)</span>
                            <span className="font-mono font-bold text-white">{exploitCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
