import React, { useMemo } from 'react';
import { GaugeCircle } from 'lucide-react';
import { CALIBRATION_ROWS } from './classificationMetricsConstants.js';
import {
  brierScore,
  confusionMatrix,
  expectedCalibrationError,
  logLoss,
  metricsFromCounts,
} from './classificationMetricsModel.js';

function pct(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function ProbabilityCard({ title, scoreKey, tone }) {
  const counts = useMemo(() => confusionMatrix(CALIBRATION_ROWS, 0.5, scoreKey), [scoreKey]);
  const metrics = useMemo(() => metricsFromCounts(counts), [counts]);
  const brier = useMemo(() => brierScore(CALIBRATION_ROWS, scoreKey), [scoreKey]);
  const loss = useMemo(() => logLoss(CALIBRATION_ROWS, scoreKey), [scoreKey]);
  const ece = useMemo(() => expectedCalibrationError(CALIBRATION_ROWS, scoreKey), [scoreKey]);

  return (
    <div className={`rounded-lg border p-5 ${tone}`}>
      <h4 className="text-lg font-black">{title}</h4>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><span className="block text-xs font-black uppercase opacity-60">Accuracy</span><strong>{pct(metrics.accuracy)}</strong></div>
        <div><span className="block text-xs font-black uppercase opacity-60">F1</span><strong>{pct(metrics.f1)}</strong></div>
        <div><span className="block text-xs font-black uppercase opacity-60">Brier</span><strong>{brier.toFixed(3)}</strong></div>
        <div><span className="block text-xs font-black uppercase opacity-60">Log loss</span><strong>{loss.toFixed(3)}</strong></div>
        <div><span className="block text-xs font-black uppercase opacity-60">ECE</span><strong>{pct(ece)}</strong></div>
        <div><span className="block text-xs font-black uppercase opacity-60">Confusion</span><strong>{counts.tp}/{counts.fp}/{counts.fn}/{counts.tn}</strong></div>
      </div>
    </div>
  );
}

export default function CalibrationBridgeLab() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700"><GaugeCircle size={15} /> Probability-quality bridge</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">The same confusion matrix can hide very different probability quality.</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
        Both systems make exactly the same class decisions at threshold 0.50. One assigns probabilities near the observed event rates; the other makes the same mistakes with extreme confidence. Accuracy, precision, recall and F1 cannot tell them apart.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ProbabilityCard title="Moderate, calibrated-looking scores" scoreKey="calibrated" tone="border-emerald-200 bg-emerald-50 text-emerald-950" />
        <ProbabilityCard title="Same labels, overconfident scores" scoreKey="overconfident" tone="border-rose-200 bg-rose-50 text-rose-950" />
      </div>

      <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
        <strong>Metric boundary:</strong> confusion-matrix metrics evaluate hard decisions after a threshold. If downstream logic consumes the numerical probability itself—pricing, ranking, risk, expected value, triage—also evaluate probability quality with calibration diagnostics and proper scoring rules such as Brier score or log loss.
      </div>
    </section>
  );
}
