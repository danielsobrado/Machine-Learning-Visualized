import React from 'react';
import { ArrowDownRight, ArrowUpLeft } from 'lucide-react';
import { scaleToPercent } from './initializationModel.js';

const HEALTH_STYLES = {
  stable: 'bg-emerald-500',
  vanishing: 'bg-sky-500',
  exploding: 'bg-rose-500',
};

function formatScale(value) {
  if (value === 0) return '0×';
  if (value < 0.01 || value >= 1000) return `${value.toExponential(2)}×`;
  return `${value.toFixed(3).replace(/\.?0+$/, '')}×`;
}

export default function PropagationScale({ direction, multiplier, series, health }) {
  const isForward = direction === 'forward';
  const Icon = isForward ? ArrowDownRight : ArrowUpLeft;
  const title = isForward ? 'Forward activation scale' : 'Backward gradient scale';
  const subtitle = isForward
    ? 'How the activation second moment compounds with depth.'
    : 'How the gradient second moment compounds while moving back from the loss.';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-700">
            <Icon size={16} />
            {title}
          </div>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-slate-900 px-3 py-2 text-right text-white">
          <div className="text-xs uppercase tracking-wide text-slate-300">Per layer</div>
          <div className="text-xl font-black">{formatScale(multiplier)}</div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {series.map((entry) => (
          <div key={entry.depth}>
            <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>{isForward ? `After layer ${entry.depth}` : `Across ${entry.depth} layer${entry.depth === 1 ? '' : 's'}`}</span>
              <span>{formatScale(entry.scale)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${HEALTH_STYLES[entry.health]}`}
                style={{ width: `${scaleToPercent(entry.scale)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm font-semibold capitalize text-slate-700">
        Final state:{' '}
        <span className={health === 'stable' ? 'text-emerald-700' : health === 'vanishing' ? 'text-sky-700' : 'text-rose-700'}>
          {health}
        </span>
      </div>
    </section>
  );
}
