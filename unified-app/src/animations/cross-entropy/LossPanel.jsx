import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function LossPanel() {
    // True Distribution P (Fixed for simplicity: Dog, Cat, Bird)
    const [p] = useState([0.0, 1.0, 0.0]); // It IS a Cat (One-Hot Encoded)

    // Predicted Distribution Q (Editable)
    const [q, setQ] = useState([0.33, 0.33, 0.34]);

    // Normalize helper
    const updateQ = (index, val) => {
        const newQ = [...q];
        newQ[index] = parseFloat(val);

        // Normalize others
        const sumOthers = newQ.reduce((a, b, i) => i === index ? a : a + b, 0);
        const targetSum = 1 - newQ[index];

        if (sumOthers === 0) {
            newQ.forEach((_, i) => { if (i !== index) newQ[i] = targetSum / (newQ.length - 1); });
        } else {
            newQ.forEach((val, i) => { if (i !== index) newQ[i] = val * (targetSum / sumOthers); });
        }
        setQ(newQ);
    };

    // Cross-Entropy: H(P, Q) = - sum P(x) log2 Q(x)
    // Since P is one-hot [0, 1, 0], this simplifies to -log2(Q_cat)
    const crossEntropy = p.reduce((sum, val, i) => {
        if (val === 0) return sum;
        return sum - val * Math.log2(q[i] || 1e-10); // Avoid log(0)
    }, 0);

    const data = [
        { name: 'Dog', p: p[0], q: q[0] },
        { name: 'Cat', p: p[1], q: q[1] },
        { name: 'Bird', p: p[2], q: q[2] }
    ];

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Cross-Entropy Loss</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    How much "surprise" is there when we use our model Q to predict the true labels P?
                    <br />
                    <strong>Goal:</strong> Minimize Cross-Entropy by making Q match P.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl items-start">
                {/* Controls */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-6">Model Prediction (Q)</h3>

                    <div className="space-y-6">
                        {q.map((val, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-sm text-slate-800">
                                        P({data[i].name}) {p[i] === 1 && <span className="text-green-400 font-bold">(TRUE LABEL)</span>}
                                    </label>
                                    <span className="font-mono font-bold text-orange-600">{(val * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range" min="0.01" max="0.99" step="0.01"
                                    value={val}
                                    onChange={(e) => updateQ(i, e.target.value)}
                                    className="w-full accent-orange-400"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-slate-900 rounded-lg text-sm text-slate-700">
                        <p className="mb-2"><strong>Formula:</strong> H(P, Q) = - Σ P(x) log Q(x)</p>
                        <p>Since the True Label is "Cat" (P=1), the loss depends ONLY on your confidence in "Cat".</p>
                    </div>
                </div>

                {/* Visualization */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                    <h3 className="font-bold text-white mb-4">True (Green) vs Predicted (Orange)</h3>

                    <div className="w-full h-64 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis domain={[0, 1]} stroke="#94a3b8" />
                                <Tooltip cursor={{ fill: 'var(--ds-paper-2)' }} />
                                <Bar dataKey="p" name="True (P)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="q" name="Predicted (Q)" fill="#fb923c" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full bg-slate-900 p-6 rounded-xl border border-orange-500/30 text-center">
                        <div className="text-sm text-slate-800 uppercase tracking-wider mb-2">Cross-Entropy Loss</div>
                        <div className={`text-5xl font-mono font-bold mb-2 transition-colors ${crossEntropy < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
                            {crossEntropy.toFixed(3)} <span className="text-lg text-slate-700">bits</span>
                        </div>
                        <div className="text-xs text-slate-700">
                            Lower is Better. 0 is Perfect.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
