import React, { useMemo, useState } from 'react';
import { AlertTriangle, Boxes } from 'lucide-react';
import {
  DEFAULT_ECE_BIN_COUNT,
  ECE_BIN_COUNTS,
  ECE_BINNING_ROWS,
} from './calibrationBinningConstants.js';
import {
  calibrationBinsFromRows,
  expectedCalibrationError,
  rowBrierScore,
  rowLogLoss,
} from './calibrationModel.js';

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function CalibrationBinningLab() {
  const [binCount, setBinCount] = useState(DEFAULT_ECE_BIN_COUNT);
  const bins = useMemo(
    () => calibrationBinsFromRows(ECE_BINNING_ROWS, binCount),
    [binCount],
  );
  const coarseEce = useMemo(
    () => expectedCalibrationError(calibrationBinsFromRows(ECE_BINNING_ROWS, 2)),
    [],
  );
  const fineEce = useMemo(
    () => expectedCalibrationError(calibrationBinsFromRows(ECE_BINNING_ROWS, 4)),
    [],
  );
  const ece = expectedCalibrationError(bins);
  const brier = useMemo(() => rowBrierScore(ECE_BINNING_ROWS), []);
  const logLoss = useMemo(() => rowLogLoss(ECE_BINNING_ROWS), []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><Boxes size={15} /> ECE binning experiment</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Same predictions. Different ECE.</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            These 40 raw predictions and labels never change. Only the audit bins change. Coarse bins can cancel opposite local reliability errors and make ECE look artificially excellent.
          </p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-black text-violet-950">
          {binCount} equal-width bins
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {ECE_BIN_COUNTS.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => setBinCount(count)}
            className={`rounded-lg border px-3 py-2 text-sm font-black ${
              count === binCount
                ? 'border-violet-700 bg-violet-800 text-white'
                : 'border-violet-200 bg-white text-violet-900'
            }`}
          >
            {count} bins
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Current ECE" value={percent(ece)} detail={`${bins.length} non-empty bins`} />
        <Metric label="2-bin ECE" value={percent(coarseEce)} detail="opposite local errors cancel" />
        <Metric label="4-bin ECE" value={percent(fineEce)} detail="same predictions, errors exposed" />
        <Metric label="Row-wise Brier" value={brier.toFixed(3)} detail={`log loss ${logLoss.toFixed(3)}; neither uses audit bins`} />
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-slate-100 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Range</th>
              <th className="px-3 py-2">Rows</th>
              <th className="px-3 py-2">Mean probability</th>
              <th className="px-3 py-2">Observed rate</th>
              <th className="px-3 py-2">Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {bins.map((bin) => (
              <tr key={`${bin.lower}-${bin.upper}`}>
                <td className="px-3 py-3 font-mono">[{bin.lower.toFixed(2)}, {bin.upper.toFixed(2)}{bin.upper === 1 ? ']' : ')'}</td>
                <td className="px-3 py-3">{bin.count}</td>
                <td className="px-3 py-3 font-black">{percent(bin.confidence)}</td>
                <td className="px-3 py-3 font-black">{percent(bin.observed)}</td>
                <td className="px-3 py-3 font-black text-rose-700">{percent(Math.abs(bin.confidence - bin.observed))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide"><AlertTriangle size={14} /> Reporting rule</p>
        <p className="mt-2">
          ECE is a diagnostic tied to a binning scheme, not a universal property of the model. Report the binning choice and pair ECE with the reliability diagram plus row-wise proper scoring rules such as Brier score or log loss.
        </p>
      </div>
    </section>
  );
}

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl text-slate-950">{value}</strong>
      <span className="text-xs font-semibold text-slate-500">{detail}</span>
    </div>
  );
}
