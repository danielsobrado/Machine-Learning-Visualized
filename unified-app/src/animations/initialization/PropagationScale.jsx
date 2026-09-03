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

export default function PropagationScale({ direction, series, health }) {
  const isForward = direction === 'forward';
  const Icon = isForward ? ArrowDownRight : ArrowUpLeft;
  const title = isForward ? 'Forward activation scale' : 'Backward gradient scale';
  const subtitle = isForward
    ? 'Each row uses that layer’s actual fan-in, fan-out, activation state, and initializer variance.'
    : 'Backward rows follow the real layer shapes in reverse rather than repeating one rectangular multiplier.';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-2">
        <Icon size={16} className="mt-0.5 shrink-0 text-slate-700" />
        <div>
          <div className="text-sm font-black uppercase tracking-wide text-slate-700">{title}</div>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {series.map((entry) => (
          <div key={`${direction}-${entry.layerNumber}`}>
            <div className="mb-1 grid gap-1 text-sm font-semibold text-slate-700 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-3">
              <span>Layer {entry.layerNumber}: {entry.fanIn} → {entry.fanOut}</span>
              <span className="font-mono text-xs text-slate-500">gain {formatScale(entry.gain)}</span>
              <span className="font-mono">{formatScale(entry.scale)}</span>
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
