import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DiscretePanel() {
    const [distType, setDistType] = useState('binomial');

    // Binomial parameters
    const [n, setN] = useState(10);
    const [p, setP] = useState(0.5);

    // Poisson parameter
    const [lambda, setLambda] = useState(5);

    // Factorial helper
    const factorial = (num) => {
        if (num <= 1) return 1;
        return num * factorial(num - 1);
    };

    // Binomial coefficient
    const binomialCoeff = (n, k) => {
        return factorial(n) / (factorial(k) * factorial(n - k));
    };

    // Binomial PMF
    const binomialPMF = (k, n, p) => {
        return binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    };

    // Poisson PMF
    const poissonPMF = (k, lambda) => {
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    };

    const data = useMemo(() => {
        if (distType === 'binomial') {
            return Array.from({ length: n + 1 }, (_, k) => ({
                k,
                prob: binomialPMF(k, n, p)
            }));
        } else {
            const maxK = Math.min(20, lambda * 3);
            return Array.from({ length: maxK }, (_, k) => ({
                k,
                prob: poissonPMF(k, lambda)
            }));
        }
    }, [distType, n, p, lambda]);

    const maxProb = Math.max(...data.map(d => d.prob));

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-indigo-600 mb-4">Discrete Distributions</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Distributions for <strong>countable</strong> outcomes (0, 1, 2, 3, ...).
                    <br />
                    PMF (Probability Mass Function): P(X = k) is the bar height.
                </p>
            </div>

            {/* Distribution Selector */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setDistType('binomial')}
                    className={`px-8 py-4 rounded-xl font-bold transition-all ${distType === 'binomial'
                            ? 'bg-indigo-600 text-white shadow-lg scale-105'
                            : 'bg-slate-700 text-slate-700 hover:bg-slate-600'
                        }`}
                >
                    Binomial
                </button>
                <button
                    onClick={() => setDistType('poisson')}
                    className={`px-8 py-4 rounded-xl font-bold transition-all ${distType === 'poisson'
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-slate-700 text-slate-700 hover:bg-slate-600'
                        }`}
                >
                    Poisson
                </button>
            </div>

            {/* Parameters */}
            {distType === 'binomial' && (
                <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-indigo-500/50">
                        <label className="flex justify-between text-sm font-bold mb-3">
                            n (trials): <span className="text-indigo-600">{n}</span>
                        </label>
                        <input
                            type="range" min="1" max="20" step="1"
                            value={n}
                            onChange={(e) => setN(Number(e.target.value))}
                            className="w-full accent-indigo-400"
                        />
                        <p className="text-xs text-slate-800 mt-2">Number of coin flips</p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-indigo-500/50">
                        <label className="flex justify-between text-sm font-bold mb-3">
                            p (success prob): <span className="text-indigo-600">{p.toFixed(2)}</span>
                        </label>
                        <input
                            type="range" min="0" max="1" step="0.05"
                            value={p}
                            onChange={(e) => setP(Number(e.target.value))}
                            className="w-full accent-indigo-400"
                        />
                        <p className="text-xs text-slate-800 mt-2">Probability of heads</p>
                    </div>
                </div>
            )}

            {distType === 'poisson' && (
                <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/50 w-full max-w-2xl mb-8">
                    <label className="flex justify-between text-sm font-bold mb-3">
                        λ (lambda - rate): <span className="text-purple-600">{lambda.toFixed(1)}</span>
                    </label>
                    <input
                        type="range" min="0.5" max="15" step="0.5"
                        value={lambda}
                        onChange={(e) => setLambda(Number(e.target.value))}
                        className="w-full accent-purple-400"
                    />
                    <p className="text-xs text-slate-800 mt-2">Average events per interval (e.g., emails per hour)</p>
                </div>
            )}

            {/* Chart */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-5xl">
                <h3 className="font-bold text-white mb-4 text-center">
                    {distType === 'binomial' && `Binomial(n=${n}, p=${p.toFixed(2)})`}
                    {distType === 'poisson' && `Poisson(λ=${lambda.toFixed(1)})`}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="k" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'k (outcome)', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'P(X = k)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }}
                            labelStyle={{ color: '#e2e8f0' }}
                            formatter={(value) => [(value * 100).toFixed(2) + '%', 'Probability']}
                        />
                        <Bar dataKey="prob" radius={[8, 8, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.prob === maxProb ? '#fbbf24' : (distType === 'binomial' ? '#6366f1' : '#a855f7')} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Example */}
                <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <p className="text-slate-700 text-center">
                        {distType === 'binomial' && (
                            <>
                                <strong>Example:</strong> Flip {n} coins with P(Heads) = {p.toFixed(2)}.
                                <br />
                                Most likely outcome: <span className="text-yellow-400 font-bold">{data.findIndex(d => d.prob === maxProb)} heads</span> with probability {(maxProb * 100).toFixed(1)}%
                            </>
                        )}
                        {distType === 'poisson' && (
                            <>
                                <strong>Example:</strong> Average {lambda.toFixed(1)} customers per hour.
                                <br />
                                Most likely: <span className="text-yellow-400 font-bold">{data.findIndex(d => d.prob === maxProb)} customers</span> with probability {(maxProb * 100).toFixed(1)}%
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
