import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrainingPanel() {
    // 4x4 Grid
    // 0=Empty, 1=Hole, 2=Goal
    const grid = [
        [0, 0, 0, 0],
        [0, 1, 0, 1],
        [0, 0, 0, 0],
        [1, 0, 1, 2]
    ];

    const [agentPos, setAgentPos] = useState({ r: 0, c: 0 });
    const [qTable, setQTable] = useState({}); // Key: "r,c", Value: {up, down, left, right}
    const [episode, setEpisode] = useState(0);
    const [stats, setStats] = useState([]); // { episode, reward }
    const [isTraining, setIsTraining] = useState(false);
    const [speed, setSpeed] = useState(50); // ms per step

    // Hyperparameters
    const alpha = 0.5;
    const gamma = 0.9;
    const epsilon = 0.1; // Exploration rate

    const trainingRef = useRef(null);

    // Initialize Q-Table helper
    const getQ = (r, c) => {
        const key = `${r},${c}`;
        if (!qTable[key]) {
            return { up: 0, down: 0, left: 0, right: 0 };
        }
        return qTable[key];
    };

    const step = () => {
        setAgentPos(prev => {
            const { r, c } = prev;
            const currentQ = getQ(r, c);

            // Epsilon-Greedy Policy
            let action;
            if (Math.random() < epsilon) {
                const actions = ['up', 'down', 'left', 'right'];
                action = actions[Math.floor(Math.random() * 4)];
            } else {
                // Greedy
                action = Object.keys(currentQ).reduce((a, b) => currentQ[a] > currentQ[b] ? a : b);
            }

            // Move
            let nextR = r, nextC = c;
            if (action === 'up') nextR = Math.max(0, r - 1);
            if (action === 'down') nextR = Math.min(3, r + 1);
            if (action === 'left') nextC = Math.max(0, c - 1);
            if (action === 'right') nextC = Math.min(3, c + 1);

            // Reward
            const cell = grid[nextR][nextC];
            let reward = -1;
            let done = false;

            if (cell === 1) { reward = -10; done = true; } // Hole
            if (cell === 2) { reward = 10; done = true; } // Goal

            // Update Q-Value
            const nextQ = getQ(nextR, nextC);
            const maxNextQ = Math.max(...Object.values(nextQ));
            const oldVal = currentQ[action];
            const newVal = oldVal + alpha * (reward + gamma * maxNextQ - oldVal);

            // Update Table State
            setQTable(prevTable => ({
                ...prevTable,
                [`${r},${c}`]: { ...currentQ, [action]: newVal }
            }));

            if (done) {
                setEpisode(e => e + 1);
                setStats(s => [...s.slice(-49), { episode: episode + 1, reward }]); // Keep last 50
                return { r: 0, c: 0 }; // Reset
            }

            return { r: nextR, c: nextC };
        });
    };

    useEffect(() => {
        if (isTraining) {
            trainingRef.current = setInterval(step, speed);
        } else {
            clearInterval(trainingRef.current);
        }
        return () => clearInterval(trainingRef.current);
    }, [isTraining, speed, qTable, episode]); // Dependencies matter for closure

    const reset = () => {
        setQTable({});
        setEpisode(0);
        setStats([]);
        setAgentPos({ r: 0, c: 0 });
        setIsTraining(false);
    };

    return (
        <div className="p-8 h-full flex flex-col items-center overflow-y-auto">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Training Loop</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Watch the agent explore and learn from its mistakes in real-time.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl items-start">
                {/* Grid Visualization */}
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-4 gap-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
                        {grid.map((row, r) => (
                            row.map((cell, c) => {
                                const q = getQ(r, c);
                                const maxQ = Math.max(...Object.values(q));
                                const bestAction = Object.keys(q).reduce((a, b) => q[a] > q[b] ? a : b);

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`w-16 h-16 rounded flex items-center justify-center relative ${cell === 1 ? 'bg-slate-950' : cell === 2 ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-slate-700'
                                            }`}
                                        style={{
                                            backgroundColor: cell === 0 ? `rgba(34, 197, 94, ${Math.max(0, maxQ / 10)})` : undefined
                                        }}
                                    >
                                        {cell === 1 && '💀'}
                                        {cell === 2 && '🏆'}

                                        {/* Agent */}
                                        {agentPos.r === r && agentPos.c === c && (
                                            <div className="absolute inset-0 flex items-center justify-center text-3xl z-10 animate-bounce">
                                                🤖
                                            </div>
                                        )}

                                        {/* Policy Arrow */}
                                        {cell === 0 && maxQ !== 0 && (
                                            <div className={`absolute text-white/50 text-xs ${bestAction === 'up' ? 'rotate-0' :
                                                    bestAction === 'right' ? 'rotate-90' :
                                                        bestAction === 'down' ? 'rotate-180' : '-rotate-90'
                                                }`}>
                                                ⬆️
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={() => setIsTraining(!isTraining)}
                            className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg ${isTraining ? 'bg-red-600' : 'bg-green-600'}`}
                        >
                            {isTraining ? 'Pause' : 'Start Training'}
                        </button>
                        <button onClick={reset} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold">
                            Reset
                        </button>
                    </div>

                    <div className="mt-4 w-full max-w-xs">
                        <label className="text-xs text-slate-800">Speed: {speed}ms</label>
                        <input
                            type="range" min="10" max="500" step="10"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="w-full">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
                        <h3 className="font-bold text-white mb-4">Learning Progress</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-900 p-3 rounded">
                                <div className="text-xs text-slate-700">Episodes</div>
                                <div className="text-2xl font-bold text-white">{episode}</div>
                            </div>
                            <div className="bg-slate-900 p-3 rounded">
                                <div className="text-xs text-slate-700">Last Reward</div>
                                <div className={`text-2xl font-bold ${stats[stats.length - 1]?.reward > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {stats[stats.length - 1]?.reward || 0}
                                </div>
                            </div>
                        </div>

                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="episode" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="reward" stroke="#22c55e" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-700">
                            <strong>Observation:</strong> Initially, the agent falls into holes often (Red spikes).
                            As Q-values propagate from the goal, it learns the safe path, and rewards stabilize at +10 (Green line).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
