import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StationaryPanel() {
    // Initial state distribution (row vector)
    const [distribution, setDistribution] = useState([1, 0, 0]); // Start 100% Sunny
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Transition Matrix P (Weather)
    // S, C, R
    const P = [
        [0.7, 0.2, 0.1], // S -> S, C, R
        [0.3, 0.4, 0.3], // C -> S, C, R
        [0.2, 0.3, 0.5]  // R -> S, C, R
    ];

    const states = ['Sunny', 'Cloudy', 'Rainy'];
    const colors = ['#facc15', '#94a3b8', '#60a5fa'];

    const nextStep = () => {
        // New Dist = Old Dist * P
        const newDist = [0, 0, 0];
        for (let j = 0; j < 3; j++) { // For each target state
            for (let i = 0; i < 3; i++) { // From each source state
                newDist[j] += distribution[i] * P[i][j];
            }
        }
        setDistribution(newDist);
        setStep(s => s + 1);
    };

    const reset = (type) => {
        setStep(0);
        setIsPlaying(false);
        if (type === 'sunny') setDistribution([1, 0, 0]);
        if (type === 'rainy') setDistribution([0, 0, 1]);
        if (type === 'mixed') setDistribution([0.33, 0.33, 0.34]);
    };

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(nextStep, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, distribution]);

    const chartData = states.map((s, i) => ({
        name: s,
        prob: distribution[i],
        color: colors[i]
    }));

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-violet-400 mb-4">Stationary Distribution</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Where does the system end up in the long run?
                    <br />
                    <span className="text-sm text-slate-800">Convergence to Steady State: π = πP</span>
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex gap-2 bg-slate-800 p-2 rounded-xl">
                    <button onClick={() => reset('sunny')} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm font-bold">Start Sunny</button>
                    <button onClick={() => reset('rainy')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold">Start Rainy</button>
                    <button onClick={() => reset('mixed')} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm font-bold">Start Mixed</button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={nextStep}
                        className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold"
                    >
                        Step +1
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-6 py-3 rounded-xl font-bold text-white ${isPlaying ? 'bg-red-600' : 'bg-green-600'}`}
                    >
                        {isPlaying ? 'Pause' : 'Auto Play'}
                    </button>
                </div>
            </div>

            <div className="text-center mb-4 font-mono text-slate-800">
                Time Step: <span className="text-white font-bold text-xl">{step}</span>
            </div>

            {/* Visualization */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-4xl mb-8">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                        <XAxis type="number" domain={[0, 1]} stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} width={80} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }}
                            formatter={(value) => [(value * 100).toFixed(1) + '%', 'Probability']}
                        />
                        <Bar dataKey="prob" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Insight */}
            <div className="bg-gradient-to-r from-violet-900/50 to-indigo-900/50 p-6 rounded-xl border border-violet-500 w-full max-w-4xl">
                <h3 className="font-bold text-violet-300 mb-2">Key Insight</h3>
                <p className="text-slate-700">
          Notice that after many steps (t &gt; 10), the distribution settles to roughly:
                    <br />
                    <strong className="text-yellow-400">Sunny: ~47%</strong>,
                    <strong className="text-slate-800"> Cloudy: ~29%</strong>,
                    <strong className="text-blue-600"> Rainy: ~24%</strong>.
                    <br />
                    This happens <strong>regardless</strong> of where you started! This is the "Stationary Distribution".
                </p>
            </div>
        </div>
    );
}
