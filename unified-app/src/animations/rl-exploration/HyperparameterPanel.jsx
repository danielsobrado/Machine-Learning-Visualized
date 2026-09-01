import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HyperparameterPanel() {
    const [alpha, setAlpha] = useState(0.1); // Learning Rate
    const [gamma, setGamma] = useState(0.9); // Discount Factor

    // Simulate training curves based on params
    // High Alpha -> Fast initial learning but unstable (noisy)
    // Low Alpha -> Slow stable learning
    // Low Gamma -> Myopic (might not find long path)

    const generateData = () => {
        const data = [];
        let currentReward = -100;

        for (let i = 0; i < 50; i++) {
            // Simulation logic
            const noise = (Math.random() - 0.5) * (alpha * 50); // Alpha adds noise/instability
            const improvement = alpha * 10 * (gamma); // Gamma helps long term planning

            currentReward += improvement + noise;
            currentReward = Math.min(10, currentReward); // Cap at max reward

            data.push({
                episode: i,
                reward: currentReward
            });
        }
        return data;
    };

    const data = generateData();

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-fuchsia-600 mb-4">Hyperparameter Tuning</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    The "Dark Art" of RL. Finding the right numbers to make it work.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl">
                {/* Controls */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-8">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="font-bold text-white">Learning Rate (α)</label>
                            <span className="text-2xl font-mono font-bold text-fuchsia-600">{alpha}</span>
                        </div>
                        <input
                            type="range" min="0.01" max="1.0" step="0.01"
                            value={alpha}
                            onChange={(e) => setAlpha(parseFloat(e.target.value))}
                            className="w-full accent-fuchsia-400"
                        />
                        <p className="text-xs text-slate-800 mt-2">
                            How fast we update values. Too high = Unstable. Too low = Slow.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="font-bold text-white">Discount Factor (γ)</label>
                            <span className="text-2xl font-mono font-bold text-indigo-600">{gamma}</span>
                        </div>
                        <input
                            type="range" min="0.1" max="0.99" step="0.01"
                            value={gamma}
                            onChange={(e) => setGamma(parseFloat(e.target.value))}
                            className="w-full accent-indigo-400"
                        />
                        <p className="text-xs text-slate-800 mt-2">
                            How much we care about the future.
                        </p>
                    </div>
                </div>

                {/* Graph */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Projected Learning Curve</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="episode" stroke="#94a3b8" />
                                <YAxis domain={[-100, 20]} stroke="#94a3b8" />
                                <Tooltip />
                                <Line type="monotone" dataKey="reward" stroke="#e879f9" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-slate-900 rounded text-sm text-slate-700">
                        {alpha > 0.8 ? (
                            <span className="text-red-400">⚠️ Unstable! The curve is jittery because the agent overreacts to every new experience.</span>
                        ) : alpha < 0.05 ? (
                            <span className="text-yellow-400">⚠️ Too Slow! The agent takes forever to reach optimal performance.</span>
                        ) : (
                            <span className="text-green-400">✅ Balanced. Good learning speed and stability.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
