import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DecisionPanel() {
    const [riskTolerance, setRiskTolerance] = useState(0.5); // 0 = risk-averse, 1 = risk-seeking

    // Two investment options
    const safe = { mean: 100, std: 10, color: '#10b981' };
    const risky = { mean: 120, std: 50, color: '#ef4444' };

    // Generate normal distributions
    const generateNormal = (mean, std) => {
        const data = [];
        for (let x = mean - 3 * std; x <= mean + 3 * std; x += std / 5) {
            const pdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
            data.push({ x: x.toFixed(0), safe: 0, risky: 0 });
        }
        return data;
    };

    const safeData = generateNormal(safe.mean, safe.std).map(d => ({
        ...d,
        safe: (1 / (safe.std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((parseFloat(d.x) - safe.mean) / safe.std, 2))
    }));

    const riskyData = generateNormal(risky.mean, risky.std).map(d => ({
        ...d,
        risky: (1 / (risky.std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((parseFloat(d.x) - risky.mean) / risky.std, 2))
    }));

    // Merge data
    const allX = new Set([...safeData.map(d => d.x), ...riskyData.map(d => d.x)]);
    const mergedData = Array.from(allX).sort((a, b) => parseFloat(a) - parseFloat(b)).map(x => {
        const safePoint = safeData.find(d => d.x === x) || { safe: 0 };
        const riskyPoint = riskyData.find(d => d.x === x) || { risky: 0 };
        return { x, safe: safePoint.safe, risky: riskyPoint.risky };
    });

    // Utility function (risk-adjusted value)
    const utility = (mean, std, tolerance) => {
        return mean - (1 - tolerance) * std; // Higher tolerance = less penalty for variance
    };

    const safeUtility = utility(safe.mean, safe.std, riskTolerance);
    const riskyUtility = utility(risky.mean, risky.std, riskTolerance);
    const recommendation = riskyUtility > safeUtility ? 'risky' : 'safe';

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-red-400 mb-4">Decision Making</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Higher E[X] is good, but higher Var(X) means more <strong>risk</strong>.
                    <br />
                    Which investment should you choose?
                </p>
            </div>

            {/* Risk Tolerance Slider */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-4xl mb-8">
                <label className="flex justify-between text-sm font-bold mb-3">
                    Your Risk Tolerance:
                    <span className="text-amber-600">
                        {riskTolerance < 0.3 ? 'Risk-Averse 😰' : riskTolerance < 0.7 ? 'Moderate 😐' : 'Risk-Seeking 😎'}
                    </span>
                </label>
                <input
                    type="range" min="0" max="1" step="0.1"
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(Number(e.target.value))}
                    className="w-full accent-amber-400"
                />
            </div>

            {/* Comparison */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mb-8">
                <div className={`bg-slate-800 p-6 rounded-xl border-2 transition-all ${recommendation === 'safe' ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-slate-700'}`}>
                    <h3 className="font-bold text-green-400 mb-4 text-center text-xl">Safe Investment</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-800">Expected Return:</span>
                            <span className="text-green-400 font-bold">${safe.mean}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-800">Std Deviation:</span>
                            <span className="text-green-400 font-bold">±${safe.std}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-800">Risk-Adjusted Value:</span>
                            <span className="text-green-400 font-bold">${safeUtility.toFixed(1)}</span>
                        </div>
                    </div>
                    {recommendation === 'safe' && (
                        <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-700">
                            <p className="text-sm text-center font-bold">✅ Recommended for you!</p>
                        </div>
                    )}
                </div>

                <div className={`bg-slate-800 p-6 rounded-xl border-2 transition-all ${recommendation === 'risky' ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-slate-700'}`}>
                    <h3 className="font-bold text-red-400 mb-4 text-center text-xl">Risky Investment</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-800">Expected Return:</span>
                            <span className="text-red-400 font-bold">${risky.mean}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-800">Std Deviation:</span>
                            <span className="text-red-400 font-bold">±${risky.std}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-800">Risk-Adjusted Value:</span>
                            <span className="text-red-400 font-bold">${riskyUtility.toFixed(1)}</span>
                        </div>
                    </div>
                    {recommendation === 'risky' && (
                        <div className="mt-4 p-3 bg-red-900/30 rounded-lg border border-red-700">
                            <p className="text-sm text-center font-bold">✅ Recommended for you!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Distribution Comparison */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-5xl">
                <h3 className="font-bold text-white mb-4 text-center">Return Distributions</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mergedData}>
                        <defs>
                            <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorRisky" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="x" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'Return ($)', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }}
                            labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                        <Area type="monotone" dataKey="safe" stroke="#10b981" fillOpacity={1} fill="url(#colorSafe)" name="Safe" />
                        <Area type="monotone" dataKey="risky" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisky)" name="Risky" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
