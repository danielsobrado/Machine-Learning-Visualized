import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

function Feedback({ selected, correct }) {
  if (!selected) return null;
  const isCorrect = selected === correct;
  const Icon = isCorrect ? CheckCircle2 : XCircle;
  return (
    <p className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
      <Icon size={16} />
      {isCorrect ? 'Matches the simulated update.' : 'Not for these controls.'}
    </p>
  );
}

export default function OptimizerPredictionCheck({ path }) {
  const [movePrediction, setMovePrediction] = useState(null);
  const [lossPrediction, setLossPrediction] = useState(null);
  const answers = useMemo(() => {
    const firstStep = path[1] || path[0];
    const delta = firstStep.theta.map((value, index) => value - path[0].theta[index]);
    const move = `${delta[0] >= 0 ? 'right' : 'left'}-${delta[1] >= 0 ? 'up' : 'down'}`;
    const startLoss = path[0].loss;
    const finalLoss = path.at(-1).loss;
    const lossTrend = finalLoss < startLoss - 0.02 ? 'lower' : finalLoss > startLoss + 0.02 ? 'higher' : 'similar';
    return { move, lossTrend };
  }, [path]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black uppercase tracking-wide text-slate-600">Predict before reading the path</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">Use the current gradient noise and optimizer state to predict the first move and the final objective trend.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">First parameter move</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['right-down', 'right + down'],
              ['right-up', 'right + up'],
              ['left-down', 'left + down'],
              ['left-up', 'left + up'],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setMovePrediction(id)} aria-pressed={movePrediction === id} className={`rounded-lg border px-3 py-2 text-sm font-bold ${movePrediction === id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>{label}</button>
            ))}
          </div>
          <Feedback selected={movePrediction} correct={answers.move} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Final loss</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ['lower', 'lower'],
              ['similar', 'about same'],
              ['higher', 'higher'],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setLossPrediction(id)} aria-pressed={lossPrediction === id} className={`rounded-lg border px-3 py-2 text-sm font-bold ${lossPrediction === id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>{label}</button>
            ))}
          </div>
          <Feedback selected={lossPrediction} correct={answers.lossTrend} />
        </div>
      </div>
    </section>
  );
}
