import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

export default function ExpectedValuePanel() {
    // Die probabilities (can be adjusted to make it "loaded")
    const [probs, setProbs] = useState([1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]);

    const data = probs.map((p, i) => ({ face: i + 1, prob: p }));

    // Calculate E[X]
    const expectedValue = useMemo(() => {
        return probs.reduce((sum, p, i) => sum + p * (i + 1), 0);
    }, [probs]);

    const adjustProb = (index, delta) => {
        const newProbs = [...probs];
        newProbs[index] = Math.max(0, Math.min(1, newProbs[index] + delta));

        // Normalize
        const sum = newProbs.reduce((a, b) => a + b, 0);
        if (sum > 0) {
            setProbs(newProbs.map(p => p / sum));
        }
    };

    const reset = () => setProbs([1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]);

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-amber-600 mb-4">Expected Value</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    E[X] is the <strong>"balance point"</strong> or weighted average of a distribution.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
                    <p className="text-amber-300">E[X] = Σ x · P(X = x)</p>
                </div>
            </div>

            {/* Balance Beam Visualization */}
            <div className="bg-slate-800 p-6 rounded-xl border border-amber-500/50 w-full max-w-5xl mb-8">
                <h3 className="font-bold text-white mb-4 text-center">Die Roll Distribution</h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="face" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'Die Face', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'Probability', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
                        <Tooltip
                            formatter={(value) => [(value * 100).toFixed(1) + '%', 'P(X)']}
                        />
                        <ReferenceLine x={expectedValue} stroke="#fbbf24" strokeWidth={3} label={{ value: `E[X] = ${expectedValue.toFixed(2)}`, position: 'top', fill: '#fbbf24', fontWeight: 'bold' }} />
                        <Bar dataKey="prob" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>

                {/* Fulcrum */}
                <div className="relative h-16 mt-4">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-slate-700 rounded"></div>
                    <motion.div
                        className="absolute top-2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-yellow-400"
                        animate={{ left: `${((expectedValue - 1) / 5) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        style={{ transform: 'translateX(-50%)' }}
                    />
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-slate-800">
                        Balance Point (Fulcrum)
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-6 gap-4 w-full max-w-5xl mb-8">
                {probs.map((p, i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="text-center mb-2">
                            <div className="text-3xl mb-2">🎲</div>
                            <div className="font-bold text-white">{i + 1}</div>
                        </div>
                        <div className="text-center text-sm text-amber-600 font-mono mb-2">
                            {(p * 100).toFixed(1)}%
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => adjustProb(i, -0.05)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded"
                            >
                                −
                            </button>
                            <button
                                onClick={() => adjustProb(i, 0.05)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 rounded"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={reset}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all"
            >
                Reset to Fair Die
            </button>

            {/* Result */}
            <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 p-6 rounded-xl border-2 border-amber-500 w-full max-w-5xl mt-8">
                <div className="text-center">
                    <h3 className="text-sm uppercase tracking-wider text-amber-300 mb-3">Expected Value</h3>
                    <div className="text-6xl font-mono font-bold text-amber-600 mb-2">
                        {expectedValue.toFixed(3)}
                    </div>
                    <p className="text-slate-700">
                        {Math.abs(expectedValue - 3.5) < 0.01
                            ? '✅ Fair die: E[X] = 3.5'
                            : '⚠️ Loaded die: E[X] ≠ 3.5'}
                    </p>
                </div>
            </div>
        </div>
    );
}
