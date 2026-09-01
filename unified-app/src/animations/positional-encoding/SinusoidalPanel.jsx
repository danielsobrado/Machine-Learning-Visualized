import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SinusoidalPanel() {
    const [position, setPosition] = useState(10);
    const [dimension, setDimension] = useState(64);

    // Generate positional encoding
    const generatePositionalEncoding = (maxPos, d) => {
        const encoding = [];
        for (let pos = 0; pos < maxPos; pos++) {
            const row = [];
            for (let i = 0; i < d; i++) {
                const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / d);
                row.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
            }
            encoding.push(row);
        }
        return encoding;
    };

    const encoding = useMemo(() => generatePositionalEncoding(50, dimension), [dimension]);

    // Prepare heatmap data (simplified - show first 16 dimensions)
    const heatmapData = encoding.slice(0, 30).map((row, pos) => ({
        position: pos,
        ...Object.fromEntries(row.slice(0, 16).map((val, i) => [`d${i}`, val]))
    }));

    // Waveform data for selected position
    const waveformData = encoding[position]?.slice(0, 32).map((val, i) => ({
        dimension: i,
        value: val,
        type: i % 2 === 0 ? 'sin' : 'cos'
    })) || [];

    // Sample waveforms for different dimensions
    const sampleWaveforms = [0, 2, 8, 16].map(dimIdx => ({
        name: `Dim ${dimIdx}`,
        data: encoding.map((row, pos) => ({ pos, value: row[dimIdx] })),
        color: ['#22d3ee', '#a855f7', '#f472b6', '#fbbf24'][dimIdx / 2 % 4]
    }));

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-cyan-600 mb-4">Sinusoidal Encoding</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    The elegant wave-based solution that gives each position a unique fingerprint.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm text-left">
                    <p className="text-cyan-300">PE(pos, 2i) = sin(pos / 10000^(2i/d))</p>
                    <p className="text-purple-300">PE(pos, 2i+1) = cos(pos / 10000^(2i/d))</p>
                </div>
            </div>

            {/* Controls */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <label className="flex justify-between text-sm font-bold mb-3">
                        Position: <span className="text-cyan-600">{position}</span>
                    </label>
                    <input
                        type="range" min="0" max="49" step="1"
                        value={position}
                        onChange={(e) => setPosition(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                    />
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <label className="flex justify-between text-sm font-bold mb-3">
                        Model Dimension: <span className="text-purple-600">{dimension}</span>
                    </label>
                    <input
                        type="range" min="16" max="128" step="16"
                        value={dimension}
                        onChange={(e) => setDimension(Number(e.target.value))}
                        className="w-full accent-purple-400"
                    />
                </div>
            </div>

            {/* Waveform for Selected Position */}
            <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/50 w-full max-w-4xl mb-8">
                <h3 className="font-bold text-white mb-4 text-center">
                    Encoding Vector at Position {position}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={waveformData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dimension" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <YAxis domain={[-1, 1]} stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }}
                            labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Multiple Waveforms Comparison */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-4xl">
                <h3 className="font-bold text-white mb-4 text-center">
                    Different Dimensions = Different Frequencies
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="pos"
                            type="number"
                            domain={[0, 49]}
                            stroke="#94a3b8"
                            tick={{ fill: '#cbd5e1' }}
                            label={{ value: 'Position', position: 'insideBottom', fill: '#cbd5e1' }}
                        />
                        <YAxis domain={[-1, 1]} stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--ds-panel)', border: 'var(--ds-border)', borderRadius: '2px', color: 'var(--ds-ink)' }}
                            labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                        {sampleWaveforms.map(wave => (
                            <Line
                                key={wave.name}
                                data={wave.data}
                                type="monotone"
                                dataKey="value"
                                stroke={wave.color}
                                strokeWidth={2}
                                dot={false}
                                name={wave.name}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-800 mt-4 text-center">
                    Lower dimensions = slower waves (capture global position)
                    <br />
                    Higher dimensions = faster waves (capture local position)
                </p>
            </div>
        </div>
    );
}
