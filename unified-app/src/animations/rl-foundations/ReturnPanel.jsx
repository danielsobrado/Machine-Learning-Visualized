import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ReturnPanel() {
    const [gamma, setGamma] = useState(0.9);

    // Scenario:
    // t=0: Action
    // t=1: Reward 0 (Empty)
    // t=2: Reward 0 (Empty)
    // t=3: Reward 0 (Empty)
    // t=4: Reward +100 (Goal)
    const rewards = [0, 0, 0, 100];

    // Calculate Discounted Return G_t
    // G_0 = R_1 + yR_2 + y^2R_3 + ...

    const data = rewards.map((r, i) => {
        const discount = Math.pow(gamma, i);
        const presentValue = r * discount;
        return {
            step: `t+${i + 1}`,
            reward: r,
            discount: discount.toFixed(2),
            presentValue: presentValue
        };
    });

    const totalReturn = data.reduce((sum, d) => sum + d.presentValue, 0);

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-teal-600 mb-4">Discounted Return (G<sub>t</sub>)</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Rewards in the future are worth less than rewards now.
                    <br />
                    <span className="font-mono bg-slate-800 px-2 py-1 rounded text-teal-300">
                        G<sub>t</sub> = R<sub>t+1</sub> + γR<sub>t+2</sub> + γ²R<sub>t+3</sub> + ...
                    </span>
                </p>
            </div>

            {/* Gamma Slider */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-4xl mb-8">
                <div className="flex justify-between items-end mb-4">
                    <label className="font-bold text-white">Discount Factor (γ)</label>
                    <span className="text-3xl font-mono font-bold text-teal-600">{gamma}</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.05"
                    value={gamma}
                    onChange={(e) => setGamma(parseFloat(e.target.value))}
                    className="w-full accent-teal-400"
                />
                <div className="flex justify-between text-xs text-slate-700 mt-2">
                    <span>0.0 (Myopic / Short-sighted)</span>
                    <span>1.0 (Far-sighted)</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
                {/* Visualization */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 text-center">Present Value of Future Rewards</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="step" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <Tooltip
                                cursor={{ fill: '#334155' }}
                            />
                            <Bar dataKey="presentValue" name="Present Value" fill="#2dd4bf" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fillOpacity={0.5 + (entry.discount * 0.5)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-xs text-slate-700 mt-2">
                        Goal (+100) is 4 steps away.
                    </p>
                </div>

                {/* Math Breakdown */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                    <h3 className="font-bold text-white mb-6 text-center">Calculation</h3>

                    <div className="space-y-4 font-mono text-sm">
                        {data.map((d, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-slate-700 pb-2">
                                <span className="text-slate-800">Step {i + 1} (Reward {d.reward}):</span>
                                <span>
                                    {d.reward} × {gamma}^{i} = <span className="text-teal-600 font-bold">{d.presentValue.toFixed(1)}</span>
                                </span>
                            </div>
                        ))}

                        <div className="pt-4 text-center">
                            <div className="text-slate-800 mb-1">Total Discounted Return</div>
                            <div className="text-4xl font-bold text-white">{totalReturn.toFixed(1)}</div>
                        </div>
                    </div>

                    <div className="mt-6 bg-teal-900/20 border border-teal-500/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-700">
                            {gamma < 0.5 ? (
                                "With low Gamma, the agent barely cares about the goal because it's too far away! It focuses only on immediate rewards."
                            ) : (
                                "With high Gamma, the agent values the distant goal almost as much as an immediate reward. It is willing to wait."
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
