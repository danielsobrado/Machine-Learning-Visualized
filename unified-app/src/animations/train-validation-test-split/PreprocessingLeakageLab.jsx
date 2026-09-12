import React, { useMemo } from 'react';
import { AlertTriangle, Scale, ShieldCheck } from 'lucide-react';
import { PREPROCESSING_LEAKAGE_DEMO } from './trainValidationTestSplitConstants.js';
import { preprocessingLeakageDemo } from './trainValidationTestSplitModel.js';

const fixed = (value) => value.toFixed(2);

export default function PreprocessingLeakageLab({ holdoutShift, onHoldoutShiftChange }) {
  const demo = useMemo(() => preprocessingLeakageDemo(holdoutShift), [holdoutShift]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700"><Scale size={15} /> Preprocessing boundary experiment</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">The scaler can leak the holdout before the model ever sees a label</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            The training values stay fixed. Move only the holdout distribution. A train-fitted standardizer keeps the same mean and scale; a standardizer fitted on all rows changes because evaluation data has already influenced preprocessing.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">
          holdout shift +{demo.holdoutShift}
        </div>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
        Move only the holdout feature values: +{demo.holdoutShift}
        <input
          min={PREPROCESSING_LEAKAGE_DEMO.shiftMin}
          max={PREPROCESSING_LEAKAGE_DEMO.shiftMax}
          step={PREPROCESSING_LEAKAGE_DEMO.shiftStep}
          type="range"
          value={holdoutShift}
          onChange={(event) => onHoldoutShiftChange(Number(event.target.value))}
        />
      </label>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-800"><ShieldCheck size={14} /> Train-only scaler</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Metric label="fitted mean" value={fixed(demo.trainStats.mean)} />
            <Metric label="fitted std" value={fixed(demo.trainStats.std)} />
            <Metric label="holdout mean z" value={fixed(demo.trainOnlyHoldoutMeanZ)} />
          </div>
          <p className="mt-3 text-sm leading-6 text-emerald-950">The fitted preprocessing parameters do not move when only holdout rows move. That preserves the evaluation boundary.</p>
        </div>

        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-800"><AlertTriangle size={14} /> Leaked all-data scaler</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Metric label="fitted mean" value={fixed(demo.leakedStats.mean)} />
            <Metric label="fitted std" value={fixed(demo.leakedStats.std)} />
            <Metric label="holdout mean z" value={fixed(demo.leakedHoldoutMeanZ)} />
          </div>
          <p className="mt-3 text-sm leading-6 text-rose-950">The holdout changes the scaler itself, making the evaluation distribution look artificially less surprising before model scoring starts.</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        Fit learned preprocessing inside each training split or fold. Apply that frozen transform to validation/test. After model selection is finished, the chosen pipeline may be refit on train + validation before one final untouched test evaluation.
      </p>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/80 bg-white/70 p-3">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-xl text-slate-950">{value}</strong>
    </div>
  );
}
