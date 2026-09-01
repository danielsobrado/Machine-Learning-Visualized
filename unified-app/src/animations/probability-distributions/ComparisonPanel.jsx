import React, { useState } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ComparisonPanel() {
    const [clickedDiscrete, setClickedDiscrete] = useState(null);
    const [clickedContinuous, setClickedContinuous] = useState(null);

    // Simple discrete data (Binomial n=5, p=0.5)
    const discreteData = [
        { k: 0, prob: 0.03125 },
        { k: 1, prob: 0.15625 },
        { k: 2, prob: 0.3125 },
        { k: 3, prob: 0.3125 },
        { k: 4, prob: 0.15625 },
        { k: 5, prob: 0.03125 }
    ];

    // Simple continuous data (Normal μ=0, σ=1)
    const continuousData = Array.from({ length: 100 }, (_, i) => {
        const x = (i - 50) / 10;
        const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
        return { x: x.toFixed(2), pdf };
    });

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-pink-600 mb-4">PMF vs PDF</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    The critical difference between discrete and continuous distributions.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
                {/* Discrete (PMF) */}
                <div className="bg-slate-800 p-6 rounded-xl border-2 border-indigo-500/50">
                    <h3 className="font-bold text-indigo-600 mb-4 text-center text-xl">
                        Discrete: PMF (Probability Mass Function)
                    </h3>
                    <p className="text-sm text-slate-700 mb-4 text-center">
                        Click on a bar to see its exact probability!
                    </p>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={discreteData} onClick={(e) => e && e.activePayload && setClickedDiscrete(e.activePayload[0].payload)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="k" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <Tooltip
                                formatter={(value) => [(value * 100).toFixed(2) + '%', 'P(X = k)']}
                            />
                            <Bar dataKey="prob" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>

                    {clickedDiscrete && (
                        <div className="mt-4 p-4 bg-indigo-900/30 rounded-lg border border-indigo-700">
                            <p className="text-center font-bold">
                                P(X = {clickedDiscrete.k}) = {(clickedDiscrete.prob * 100).toFixed(2)}%
                            </p>
                            <p className="text-xs text-slate-800 mt-2 text-center">
                                ✅ For discrete: P(X = k) is the <strong>bar height</strong>
                            </p>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2 text-sm">Key Properties:</h4>
                        <ul className="text-xs text-slate-700 space-y-1">
                            <li>✓ P(X = k) is a valid probability (0 to 1)</li>
                            <li>✓ Sum of all bars = 1</li>
                            <li>✓ Can ask: "What's P(X = 3)?"</li>
                        </ul>
                    </div>
                </div>

                {/* Continuous (PDF) */}
                <div className="bg-slate-800 p-6 rounded-xl border-2 border-purple-500/50">
                    <h3 className="font-bold text-purple-600 mb-4 text-center text-xl">
                        Continuous: PDF (Probability Density Function)
                    </h3>
                    <p className="text-sm text-slate-700 mb-4 text-center">
                        Click on the curve to see why P(X = x) = 0!
                    </p>

                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={continuousData} onClick={(e) => e && e.activePayload && setClickedContinuous(e.activePayload[0].payload)}>
                            <defs>
                                <linearGradient id="colorPdf2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="x" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <Tooltip
                                formatter={(value) => [value.toFixed(4), 'f(x)']}
                            />
                            <Area type="monotone" dataKey="pdf" stroke="#a855f7" fillOpacity={1} fill="url(#colorPdf2)" />
                        </AreaChart>
                    </ResponsiveContainer>

                    {clickedContinuous && (
                        <div className="mt-4 p-4 bg-red-900/30 rounded-lg border border-red-700">
                            <p className="text-center font-bold">
                                P(X = {clickedContinuous.x}) = 0
                            </p>
                            <p className="text-xs text-slate-800 mt-2 text-center">
                                ⚠️ For continuous: P(X = exact value) is always ZERO!
                                <br />
                                Must use intervals: P(a &lt; X &lt; b) = area under curve
                            </p>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2 text-sm">Key Properties:</h4>
                        <ul className="text-xs text-slate-700 space-y-1">
                            <li>✓ f(x) is NOT a probability (can be &gt; 1!)</li>
                            <li>✓ Total area under curve = 1</li>
                            <li>✓ Must ask: "What's P(a &lt; X &lt; b)?" (area)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-8 rounded-xl border-2 border-pink-500 w-full max-w-6xl mt-8">
                <h3 className="font-bold text-white mb-4 text-center text-2xl">The Key Difference</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h4 className="font-bold text-indigo-600 mb-2">Discrete (PMF)</h4>
                        <p className="text-sm text-slate-700">
                            "What's the probability of <strong>exactly</strong> k?"
                            <br />
                            <span className="text-indigo-600 font-mono">P(X = k)</span> = bar height
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="text-6xl mb-4">📈</div>
                        <h4 className="font-bold text-purple-600 mb-2">Continuous (PDF)</h4>
                        <p className="text-sm text-slate-700">
                            "What's the probability <strong>between</strong> a and b?"
                            <br />
                            <span className="text-purple-600 font-mono">P(a &lt; X &lt; b)</span> = area under curve
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
