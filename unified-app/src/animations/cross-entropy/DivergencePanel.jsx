import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DivergencePanel() {
    // Two Gaussian Distributions
    // P (True): Mean 0, Std 1
    // Q (Approx): Mean M, Std S
    const [meanQ, setMeanQ] = useState(0.5);
    const [stdQ, setStdQ] = useState(1.5);

    // Generate data points
    const generateData = () => {
        const data = [];
        let klSum = 0;

        for (let x = -4; x <= 4; x += 0.1) {
            // P(x) - Standard Normal
            const p = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);

            // Q(x) - Normal(meanQ, stdQ)
            const q = (1 / (stdQ * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - meanQ) / stdQ, 2));

            // KL Contribution: p(x) * log(p(x)/q(x))
            // Avoid division by zero or log(0)
            const safeQ = Math.max(q, 1e-10);
            const safeP = Math.max(p, 1e-10);
            const klContrib = safeP * Math.log2(safeP / safeQ);

            klSum += klContrib * 0.1; // Integrate

            data.push({ x: x.toFixed(1), p, q });
        }
        return { data, kl: Math.max(0, klSum) }; // KL is always non-negative
    };

    const { data, kl } = generateData();

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-amber-600 mb-4">KL Divergence (Relative Entropy)</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Measures the "distance" between two probability distributions.
                    <br />
                    <strong>D<sub>KL</sub>(P || Q)</strong>: How many <em>extra</em> bits do we need if we use Q to encode P?
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl items-start">
                {/* Controls */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-6">Approximation Q (Orange)</h3>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="font-bold text-white">Mean (μ)</label>
                                <span className="font-mono font-bold text-amber-600">{meanQ.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="-3" max="3" step="0.1"
                                value={meanQ}
                                onChange={(e) => setMeanQ(parseFloat(e.target.value))}
                                className="w-full accent-amber-400"
                            />
                            <p className="text-xs text-slate-800 mt-1">Shift the center</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="font-bold text-white">Std Dev (σ)</label>
                                <span className="font-mono font-bold text-amber-600">{stdQ.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="0.5" max="3" step="0.1"
                                value={stdQ}
                                onChange={(e) => setStdQ(parseFloat(e.target.value))}
                                className="w-full accent-amber-400"
                            />
                            <p className="text-xs text-slate-800 mt-1">Change the width</p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => { setMeanQ(0); setStdQ(1); }}
                            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Match P (KL = 0)
                        </button>
                    </div>
                </div>

                {/* Visualization */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                    <h3 className="font-bold text-white mb-4">P (Green) vs Q (Orange)</h3>

                    <div className="w-full h-64 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="x" stroke="#94a3b8" />
                                <YAxis hide />
                                <Tooltip />
                                <Area type="monotone" dataKey="p" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} strokeWidth={2} name="True P" />
                                <Area type="monotone" dataKey="q" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.3} strokeWidth={2} name="Approx Q" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full bg-slate-900 p-6 rounded-xl border border-amber-500/30 text-center">
                        <div className="text-sm text-slate-800 uppercase tracking-wider mb-2">KL Divergence</div>
                        <div className={`text-5xl font-mono font-bold mb-2 transition-colors ${kl < 0.1 ? 'text-green-400' : 'text-amber-400'}`}>
                            {kl.toFixed(3)} <span className="text-lg text-slate-700">bits</span>
                        </div>
                        <div className="text-xs text-slate-700">
                            D<sub>KL</sub> = 0 only when P = Q.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
