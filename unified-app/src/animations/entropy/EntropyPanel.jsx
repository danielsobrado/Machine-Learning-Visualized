import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function EntropyPanel() {
    // 3 Symbols: A, B, C
    const [probs, setProbs] = useState([0.33, 0.33, 0.34]);

    // Normalize helper
    const updateProb = (index, val) => {
        const newProbs = [...probs];
        newProbs[index] = parseFloat(val);

        // Simple normalization: Adjust others proportionally
        const sumOthers = newProbs.reduce((a, b, i) => i === index ? a : a + b, 0);
        const targetSum = 1 - newProbs[index];

        if (sumOthers === 0) {
            // Edge case
            newProbs.forEach((_, i) => {
                if (i !== index) newProbs[i] = targetSum / (newProbs.length - 1);
            });
        } else {
            newProbs.forEach((p, i) => {
                if (i !== index) newProbs[i] = p * (targetSum / sumOthers);
            });
        }

        setProbs(newProbs);
    };

    // Calculate Entropy: H(X) = - sum p(x) log2 p(x)
    const entropy = probs.reduce((sum, p) => {
        if (p === 0) return sum;
        return sum - p * Math.log2(p);
    }, 0);

    const data = [
        { name: 'A', prob: probs[0] },
        { name: 'B', prob: probs[1] },
        { name: 'C', prob: probs[2] }
    ];

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-rose-400 mb-4">Entropy (Average Surprise)</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Entropy measures how <strong>unpredictable</strong> a system is.
                    <br />
                    Maximum Entropy happens when everything is equally likely (Uniform).
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl items-start">
                {/* Controls */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-6">Distribution Control</h3>

                    <div className="space-y-6">
                        {probs.map((p, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-sm text-slate-300">P({String.fromCharCode(65 + i)})</label>
                                    <span className="font-mono font-bold text-rose-400">{(p * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="0.99" step="0.01"
                                    value={p}
                                    onChange={(e) => updateProb(i, e.target.value)}
                                    className="w-full accent-rose-400"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => setProbs([0.33, 0.33, 0.34])}
                            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold"
                        >
                            Uniform (Max H)
                        </button>
                        <button
                            onClick={() => setProbs([0.98, 0.01, 0.01])}
                            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold"
                        >
                            Certain (Min H)
                        </button>
                    </div>
                </div>

                {/* Visualization */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                    <h3 className="font-bold text-white mb-4">Probability Distribution</h3>

                    <div className="w-full h-48 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis domain={[0, 1]} stroke="#94a3b8" />
                                <Tooltip cursor={{ fill: 'var(--ds-paper-2)' }} contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }} />
                                <Bar dataKey="prob" fill="#fb7185" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fillOpacity={0.6 + (entry.prob * 0.4)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full bg-slate-900 p-6 rounded-xl border border-rose-500/30 text-center">
                        <div className="text-sm text-slate-300 uppercase tracking-wider mb-2">System Entropy</div>
                        <div className="text-5xl font-mono font-bold text-white mb-2">
                            {entropy.toFixed(2)} <span className="text-lg text-slate-300">bits</span>
                        </div>
                        <div className="text-xs text-slate-300">
                            H(X) = - Σ p(x) log<sub>2</sub> p(x)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
