import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function BayesPanel() {
    const [priorA, setPriorA] = useState(0.3); // P(A)
    const [likelihoodBA, setLikelihoodBA] = useState(0.8); // P(B|A)
    const [likelihoodBNotA, setLikelihoodBNotA] = useState(0.1); // P(B|¬A)

    // Calculate P(B) using law of total probability
    const probB = likelihoodBA * priorA + likelihoodBNotA * (1 - priorA);

    // Bayes' Theorem: P(A|B)
    const posteriorAB = probB > 0 ? (likelihoodBA * priorA) / probB : 0;

    const chartData = [
        { name: 'P(A)', value: priorA * 100, color: '#10b981' },
        { name: 'P(A|B)', value: posteriorAB * 100, color: '#06b6d4' }
    ];

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-emerald-600 mb-4">Bayes' Theorem</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Flip conditional probabilities: go from <strong>P(B|A)</strong> to <strong>P(A|B)</strong>.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
                    <p className="text-lg">P(A|B) = P(B|A) × P(A) / P(B)</p>
                    <p className="text-slate-800 mt-2 text-xs">
                        Posterior = Likelihood × Prior / Evidence
                    </p>
                </div>
            </div>

            {/* Interactive Sliders */}
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/50">
                    <h3 className="font-bold text-green-400 mb-3 text-center">Prior</h3>
                    <label className="flex justify-between text-sm mb-3">
                        P(A): <span className="text-green-400 font-mono">{(priorA * 100).toFixed(0)}%</span>
                    </label>
                    <input
                        type="range" min="0" max="1" step="0.01"
                        value={priorA}
                        onChange={(e) => setPriorA(Number(e.target.value))}
                        className="w-full accent-green-400"
                    />
                    <p className="text-xs text-slate-800 mt-2 text-center">
                        Initial belief before seeing evidence B
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-yellow-500/50">
                    <h3 className="font-bold text-yellow-400 mb-3 text-center">Likelihood</h3>
                    <label className="flex justify-between text-sm mb-3">
                        P(B|A): <span className="text-yellow-400 font-mono">{(likelihoodBA * 100).toFixed(0)}%</span>
                    </label>
                    <input
                        type="range" min="0" max="1" step="0.01"
                        value={likelihoodBA}
                        onChange={(e) => setLikelihoodBA(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                    <label className="flex justify-between text-sm mb-3 mt-4">
                        P(B|¬A): <span className="text-yellow-400 font-mono">{(likelihoodBNotA * 100).toFixed(0)}%</span>
                    </label>
                    <input
                        type="range" min="0" max="1" step="0.01"
                        value={likelihoodBNotA}
                        onChange={(e) => setLikelihoodBNotA(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                    <p className="text-xs text-slate-800 mt-2 text-center">
                        How likely is evidence B given A (or ¬A)?
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/50">
                    <h3 className="font-bold text-cyan-600 mb-3 text-center">Posterior</h3>
                    <div className="text-center">
                        <div className="text-5xl font-mono font-bold text-cyan-600 mb-2">
                            {(posteriorAB * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-700">P(A|B)</p>
                    </div>
                    <p className="text-xs text-slate-800 mt-4 text-center">
                        Updated belief after seeing evidence B
                    </p>
                </div>
            </div>

            {/* Visualization */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-5xl mb-8">
                <h3 className="font-bold text-white mb-4 text-center">Prior vs Posterior</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }}
                            labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/50 w-full max-w-5xl">
                <h3 className="font-bold text-white mb-4 text-center">Step-by-Step Calculation</h3>
                <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between items-center p-3 bg-slate-900 rounded">
                        <span className="text-slate-800">1. Prior:</span>
                        <span className="text-green-400">P(A) = {priorA.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900 rounded">
                        <span className="text-slate-800">2. Likelihood:</span>
                        <span className="text-yellow-400">P(B|A) = {likelihoodBA.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900 rounded">
                        <span className="text-slate-800">3. Evidence (Total Prob):</span>
                        <span className="text-purple-600">
                            P(B) = {likelihoodBA.toFixed(3)} × {priorA.toFixed(3)} + {likelihoodBNotA.toFixed(3)} × {(1 - priorA).toFixed(3)} = {probB.toFixed(3)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-900/30 rounded border-2 border-emerald-500">
                        <span className="text-slate-200 font-bold">4. Posterior (Bayes):</span>
                        <span className="text-cyan-600 font-bold">
                            P(A|B) = {likelihoodBA.toFixed(3)} × {priorA.toFixed(3)} / {probB.toFixed(3)} = {posteriorAB.toFixed(3)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
