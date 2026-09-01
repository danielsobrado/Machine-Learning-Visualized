import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function VariancePanel() {
    const [distType, setDistType] = useState('narrow');

    // Two distributions with same E[X] but different variance
    const distributions = {
        narrow: [
            { x: 8, prob: 0.1 },
            { x: 9, prob: 0.2 },
            { x: 10, prob: 0.4 },
            { x: 11, prob: 0.2 },
            { x: 12, prob: 0.1 }
        ],
        wide: [
            { x: 5, prob: 0.1 },
            { x: 7, prob: 0.15 },
            { x: 10, prob: 0.5 },
            { x: 13, prob: 0.15 },
            { x: 15, prob: 0.1 }
        ]
    };

    const data = distributions[distType];

    const stats = useMemo(() => {
        const mean = data.reduce((sum, d) => sum + d.x * d.prob, 0);
        const variance = data.reduce((sum, d) => sum + Math.pow(d.x - mean, 2) * d.prob, 0);
        const stdDev = Math.sqrt(variance);
        return { mean, variance, stdDev };
    }, [data]);

    // Add deviation info to data
    const dataWithDev = data.map(d => ({
        ...d,
        deviation: Math.abs(d.x - stats.mean)
    }));

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Variance</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Variance measures the <strong>"spread"</strong> or uncertainty around the mean.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
                    <p className="text-orange-300">Var(X) = E[(X - μ)²]</p>
                    <p className="text-slate-800 mt-2 text-xs">σ = √Var(X) (standard deviation)</p>
                </div>
            </div>

            {/* Distribution Selector */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setDistType('narrow')}
                    className={`px-8 py-4 rounded-xl font-bold transition-all ${distType === 'narrow'
                            ? 'bg-green-600 text-white shadow-lg scale-105'
                            : 'bg-slate-700 text-slate-700 hover:bg-slate-600'
                        }`}
                >
                    Low Variance (Narrow)
                </button>
                <button
                    onClick={() => setDistType('wide')}
                    className={`px-8 py-4 rounded-xl font-bold transition-all ${distType === 'wide'
                            ? 'bg-red-600 text-white shadow-lg scale-105'
                            : 'bg-slate-700 text-slate-700 hover:bg-slate-600'
                        }`}
                >
                    High Variance (Wide)
                </button>
            </div>

            {/* Chart */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-5xl mb-8">
                <h3 className="font-bold text-white mb-4 text-center">
                    Distribution (E[X] = {stats.mean.toFixed(1)})
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataWithDev}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="x" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }}
                            formatter={(value, name) => {
                                if (name === 'prob') return [(value * 100).toFixed(1) + '%', 'Probability'];
                                return [value.toFixed(2), 'Deviation from mean'];
                            }}
                        />
                        <Bar dataKey="prob" radius={[8, 8, 0, 0]}>
                            {dataWithDev.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.x === stats.mean ? '#fbbf24' : (distType === 'narrow' ? '#10b981' : '#ef4444')} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Deviation Lines */}
                <div className="mt-6 space-y-2">
                    {dataWithDev.map((d, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-16 text-sm text-slate-800">x = {d.x}</div>
                            <div className="flex-1 bg-slate-900 rounded-full h-6 relative overflow-hidden">
                                <div
                                    className={`h-full ${distType === 'narrow' ? 'bg-green-500' : 'bg-red-500'} transition-all`}
                                    style={{ width: `${(d.deviation / 5) * 100}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                                    |{d.x} - {stats.mean.toFixed(1)}| = {d.deviation.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Comparison */}
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="bg-slate-800 p-6 rounded-xl border border-amber-500/50 text-center">
                    <div className="text-sm text-slate-800 mb-2">Mean (μ)</div>
                    <div className="text-4xl font-mono font-bold text-amber-600">{stats.mean.toFixed(2)}</div>
                    <div className="text-xs text-slate-700 mt-2">Same for both!</div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-orange-500/50 text-center">
                    <div className="text-sm text-slate-800 mb-2">Variance (σ²)</div>
                    <div className="text-4xl font-mono font-bold text-orange-600">{stats.variance.toFixed(2)}</div>
                    <div className="text-xs text-slate-700 mt-2">
                        {distType === 'narrow' ? 'Low (predictable)' : 'High (uncertain)'}
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-red-500/50 text-center">
                    <div className="text-sm text-slate-800 mb-2">Std Dev (σ)</div>
                    <div className="text-4xl font-mono font-bold text-red-400">{stats.stdDev.toFixed(2)}</div>
                    <div className="text-xs text-slate-700 mt-2">√Variance</div>
                </div>
            </div>
        </div>
    );
}
