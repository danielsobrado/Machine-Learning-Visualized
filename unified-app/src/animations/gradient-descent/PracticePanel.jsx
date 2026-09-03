import React, { useState } from 'react';
import { DEFAULT_LEARNING_RATE, DEFAULT_START_WEIGHT, learningRateStatus } from './gradientDescentModel.js';

export default function PracticePanel({
    learningRate: initialLearningRate = DEFAULT_LEARNING_RATE,
    startWeight: initialStartWeight = DEFAULT_START_WEIGHT,
    onParamsChange,
}) {
    const [learningRate, setLearningRate] = useState(initialLearningRate);
    const [startWeight, setStartWeight] = useState(initialStartWeight);

    const handleLearningRateChange = (value) => {
        const nextLearningRate = Number(value);
        setLearningRate(nextLearningRate);
        onParamsChange?.(nextLearningRate, startWeight);
    };

    const handleWeightChange = (value) => {
        const nextStartWeight = Number(value);
        setStartWeight(nextStartWeight);
        onParamsChange?.(learningRate, nextStartWeight);
    };

    const status = learningRateStatus(learningRate);

    return (
        <div className="flex h-full flex-col items-center p-4">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Controls</h2>

            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="gradient-learning-rate" className="font-bold text-gray-700">
                        Learning Rate (alpha):
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            id="gradient-learning-rate"
                            type="range"
                            min="0.01"
                            max="1.0"
                            step="0.01"
                            value={learningRate}
                            onChange={(event) => handleLearningRateChange(event.target.value)}
                            className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
                        />
                        <span className="w-12 text-right font-mono font-bold">{learningRate.toFixed(2)}</span>
                    </div>
                    <p className={`text-sm font-bold ${status.color}`}>{status.text}</p>
                    <p className="text-xs leading-5 text-slate-600">
                        For this exact bowl, 0&lt;alpha&lt;1 converges. The Stability Lab shows why this boundary exists.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="gradient-start-weight" className="font-bold text-gray-700">
                        Starting Weight:
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            id="gradient-start-weight"
                            type="range"
                            min="-5"
                            max="5"
                            step="0.1"
                            value={startWeight}
                            onChange={(event) => handleWeightChange(event.target.value)}
                            className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
                        />
                        <span className="w-12 text-right font-mono font-bold">{startWeight.toFixed(1)}</span>
                    </div>
                </div>

                <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-gray-700">
                    <p><strong>Experiment:</strong></p>
                    <ul className="list-inside list-disc space-y-1">
                        <li>alpha = 0.01: converges, but painfully slowly</li>
                        <li>alpha = 0.50: lands at the minimum in one step</li>
                        <li>alpha = 0.95: oscillates while still converging</li>
                        <li>alpha = 1.00: flips forever without getting closer</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
