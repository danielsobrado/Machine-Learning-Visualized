import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ContinuousPanel() {
    const [distType, setDistType] = useState('normal');

    // Normal parameters
    const [mu, setMu] = useState(0);
    const [sigma, setSigma] = useState(1);

    // Exponential parameter
    const [lambdaExp, setLambdaExp] = useState(1);

    // Range for shading
    const [rangeA, setRangeA] = useState(-1);
    const [rangeB, setRangeB] = useState(1);

    // Normal PDF
    const normalPDF = (x, mu, sigma) => {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    };

    // Exponential PDF
    const exponentialPDF = (x, lambda) => {
        return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
    };

    const data = useMemo(() => {
        if (distType === 'normal') {
            const xMin = mu - 4 * sigma;
            const xMax = mu + 4 * sigma;
            const step = (xMax - xMin) / 200;
            return Array.from({ length: 201 }, (_, i) => {
                const x = xMin + i * step;
                return {
                    x: x.toFixed(2),
                    pdf: normalPDF(x, mu, sigma),
                    inRange: x >= rangeA && x <= rangeB
                };
            });
        } else {
            const xMax = 5 / lambdaExp;
            const step = xMax / 200;
            return Array.from({ length: 201 }, (_, i) => {
                const x = i * step;
                return {
                    x: x.toFixed(2),
                    pdf: exponentialPDF(x, lambdaExp),
                    inRange: x >= rangeA && x <= rangeB
                };
            });
        }
    }, [distType, mu, sigma, lambdaExp, rangeA, rangeB]);

    // Calculate area under curve (approximate)
    const areaUnderCurve = useMemo(() => {
        const inRangeData = data.filter(d => d.inRange);
        if (inRangeData.length < 2) return 0;
        const dx = parseFloat(inRangeData[1].x) - parseFloat(inRangeData[0].x);
        return inRangeData.reduce((sum, d) => sum + d.pdf * dx, 0);
    }, [data]);

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-purple-600 mb-4">Continuous Distributions</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Distributions for <strong>continuous</strong> outcomes (any real number).
                    <br />
                    PDF (Probability Density Function): P(a &lt; X &lt; b) is the <strong>area under curve</strong>.
                </p>
            </div>

            {/* Distribution Selector */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setDistType('normal')}
                    className={`px-8 py-4 rounded-xl font-bold transition-all ${distType === 'normal'
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-slate-700 text-slate-700 hover:bg-slate-600'
                        }`}
                >
                    Normal (Gaussian)
                </button>
                <button
                    onClick={() => setDistType('exponential')}
                    className={`px-8 py-4 rounded-xl font-bold transition-all ${distType === 'exponential'
                            ? 'bg-pink-600 text-white shadow-lg scale-105'
                            : 'bg-slate-700 text-slate-700 hover:bg-slate-600'
                        }`}
                >
                    Exponential
                </button>
            </div>

            {/* Parameters */}
            {distType === 'normal' && (
                <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/50">
                        <label className="flex justify-between text-sm font-bold mb-3">
                            μ (mean): <span className="text-purple-600">{mu.toFixed(1)}</span>
                        </label>
                        <input
                            type="range" min="-5" max="5" step="0.5"
                            value={mu}
                            onChange={(e) => setMu(Number(e.target.value))}
                            className="w-full accent-purple-400"
                        />
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/50">
                        <label className="flex justify-between text-sm font-bold mb-3">
                            σ (std dev): <span className="text-purple-600">{sigma.toFixed(1)}</span>
                        </label>
                        <input
                            type="range" min="0.5" max="3" step="0.1"
                            value={sigma}
                            onChange={(e) => setSigma(Number(e.target.value))}
                            className="w-full accent-purple-400"
                        />
                    </div>
                </div>
            )}

            {distType === 'exponential' && (
                <div className="bg-slate-800 p-6 rounded-xl border border-pink-500/50 w-full max-w-2xl mb-8">
                    <label className="flex justify-between text-sm font-bold mb-3">
                        λ (rate): <span className="text-pink-600">{lambdaExp.toFixed(1)}</span>
                    </label>
                    <input
                        type="range" min="0.2" max="3" step="0.1"
                        value={lambdaExp}
                        onChange={(e) => setLambdaExp(Number(e.target.value))}
                        className="w-full accent-pink-400"
                    />
                    <p className="text-xs text-slate-800 mt-2">Average wait time = 1/λ = {(1 / lambdaExp).toFixed(2)} units</p>
                </div>
            )}

            {/* Range Selector */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/50">
                    <label className="flex justify-between text-sm font-bold mb-3">
                        a (lower bound): <span className="text-cyan-600">{rangeA.toFixed(1)}</span>
                    </label>
                    <input
                        type="range"
                        min={distType === 'normal' ? mu - 3 * sigma : 0}
                        max={distType === 'normal' ? mu + 3 * sigma : 5 / lambdaExp}
                        step="0.1"
                        value={rangeA}
                        onChange={(e) => setRangeA(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                    />
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/50">
                    <label className="flex justify-between text-sm font-bold mb-3">
                        b (upper bound): <span className="text-cyan-600">{rangeB.toFixed(1)}</span>
                    </label>
                    <input
                        type="range"
                        min={distType === 'normal' ? mu - 3 * sigma : 0}
                        max={distType === 'normal' ? mu + 3 * sigma : 5 / lambdaExp}
                        step="0.1"
                        value={rangeB}
                        onChange={(e) => setRangeB(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                    />
                </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-5xl">
                <h3 className="font-bold text-white mb-4 text-center">
                    {distType === 'normal' && `Normal(μ=${mu.toFixed(1)}, σ=${sigma.toFixed(1)})`}
                    {distType === 'exponential' && `Exponential(λ=${lambdaExp.toFixed(1)})`}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPdf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={distType === 'normal' ? '#a855f7' : '#ec4899'} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={distType === 'normal' ? '#a855f7' : '#ec4899'} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="x" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'x', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} label={{ value: 'f(x)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
                        <Tooltip
                        />
                        <Area type="monotone" dataKey="pdf" stroke={distType === 'normal' ? '#a855f7' : '#ec4899'} fillOpacity={1} fill="url(#colorPdf)" />
                        <ReferenceLine x={rangeA} stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 5" />
                        <ReferenceLine x={rangeB} stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Result */}
                <div className="mt-6 p-4 bg-cyan-900/30 rounded-lg border border-cyan-700">
                    <p className="text-center font-bold text-lg">
                        P({rangeA.toFixed(1)} &lt; X &lt; {rangeB.toFixed(1)}) ≈ {(areaUnderCurve * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-800 mt-2 text-center">
                        This is the <strong>area under the curve</strong> between the blue lines.
                    </p>
                </div>
            </div>
        </div>
    );
}
