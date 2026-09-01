import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemPanel() {
    const [useNormalization, setUseNormalization] = useState(false);
    const [numLayers, setNumLayers] = useState(5);

    // Simulate activation distributions through layers
    const generateActivations = (normalized) => {
        const layers = [];
        let mean = 0;
        let std = 1;

        for (let layer = 0; layer < numLayers; layer++) {
            const activations = [];

            // Generate distribution
            for (let x = -5; x <= 5; x += 0.2) {
                const value = Math.exp(-Math.pow(x - mean, 2) / (2 * std * std)) / (std * Math.sqrt(2 * Math.PI));
                activations.push({ x, value, layer });
            }

            layers.push({
                layer,
                data: activations,
                mean: mean.toFixed(2),
                std: std.toFixed(2)
            });

            // Without normalization: drift and explode
            if (!normalized) {
                mean += 0.5; // Shift
                std *= 1.3; // Explode
            }
            // With normalization: stay stable
            else {
                mean = 0;
                std = 1;
            }
        }

        return layers;
    };

    const layers = useMemo(() => generateActivations(useNormalization), [useNormalization, numLayers]);

    const getLayerColor = (layer) => {
        const colors = ['#22d3ee', '#a855f7', '#f472b6', '#fbbf24', '#4ade80'];
        return colors[layer % colors.length];
    };

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-violet-400 mb-4">The Problem</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Deep networks suffer from <strong>Internal Covariate Shift</strong>.
                    <br />
                    Without normalization, activations drift and gradients become unstable.
                </p>
            </div>

            {/* Controls */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-white text-lg">Normalization</h3>
                            <p className="text-sm text-slate-800">Toggle to see the difference</p>
                        </div>
                        <button
                            onClick={() => setUseNormalization(!useNormalization)}
                            className={`relative w-20 h-10 rounded-full transition-colors ${useNormalization ? 'bg-violet-500' : 'bg-slate-600'
                                }`}
                        >
                            <motion.div
                                className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg"
                                animate={{ x: useNormalization ? 40 : 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <label className="flex justify-between text-sm font-bold mb-3">
                        Network Depth: <span className="text-violet-400">{numLayers} layers</span>
                    </label>
                    <input
                        type="range" min="3" max="10" step="1"
                        value={numLayers}
                        onChange={(e) => setNumLayers(Number(e.target.value))}
                        className="w-full accent-violet-400"
                    />
                </div>
            </div>

            {/* Status Alert */}
            <AnimatePresence mode="wait">
                {!useNormalization ? (
                    <motion.div
                        key="problem"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-900/30 border-2 border-red-500 p-4 rounded-lg w-full max-w-4xl mb-8"
                    >
                        <p className="text-red-300 font-bold text-center">
                            ⚠️ Problem: Activations are drifting and exploding!
                            <br />
                            <span className="text-sm">Gradients will vanish or explode during backprop.</span>
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="solution"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-900/30 border-2 border-green-500 p-4 rounded-lg w-full max-w-4xl mb-8"
                    >
                        <p className="text-green-300 font-bold text-center">
                            ✅ Solution: Activations are normalized!
                            <br />
                            <span className="text-sm">Mean = 0, Std = 1 at every layer. Stable training.</span>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Visualization */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-5xl">
                <h3 className="font-bold text-white mb-4 text-center">
                    Activation Distributions Across Layers
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            domain={[-5, 5]}
                            stroke="#94a3b8"
                            tick={{ fill: '#cbd5e1' }}
                            label={{ value: 'Activation Value', position: 'insideBottom', fill: '#cbd5e1' }}
                        />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <Tooltip
                        />
                        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                        {layers.map((layer, idx) => (
                            <Area
                                key={idx}
                                data={layer.data}
                                type="monotone"
                                dataKey="value"
                                stroke={getLayerColor(idx)}
                                fill={getLayerColor(idx)}
                                fillOpacity={0.3}
                                strokeWidth={2}
                                name={`Layer ${idx + 1}`}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>

                {/* Layer Stats */}
                <div className="grid grid-cols-5 gap-2 mt-6">
                    {layers.map((layer, idx) => (
                        <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-600 text-center">
                            <div className="text-xs text-slate-800 mb-1">Layer {idx + 1}</div>
                            <div className="text-sm font-mono">
                                <span className="text-white">μ: {layer.mean}</span>
                                <br />
                                <span className="text-slate-700">σ: {layer.std}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
