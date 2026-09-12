import React, { useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, SlidersHorizontal } from 'lucide-react';
import DecisionSurface from './DecisionSurface.jsx';
import DeploymentPolicyLab from './DeploymentPolicyLab.jsx';
import SeparationRegularizationLab from './SeparationRegularizationLab.jsx';
import {
  PRESETS,
  THRESHOLD_RANGE,
  TRAIN_POINTS,
  VALIDATION_POINTS,
} from './logisticRegressionConstants.js';
import {
  binaryLogLoss,
  boundaryLine,
  brierScore,
  classifyPoint,
  fitPresetModel,
  metricPercent,
  safeRatio,
  scorePoints,
  summarize,
} from './logisticRegressionModel.js';

const DEFAULT_MODEL = fitPresetModel('balanced');

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function coefficientMeaning(feature, value) {
  if (Math.abs(value) < 0.02) return `${feature} has almost no linear effect in the current score.`;
  return `Higher ${feature} ${value > 0 ? 'raises' : 'lowers'} the fitted log-odds when the other feature stays fixed.`;
}

export default function LogisticRegressionWorkbench() {
  const [weightRisk, setWeightRisk] = useState(DEFAULT_MODEL.weightRisk);
  const [weightEngagement, setWeightEngagement] = useState(DEFAULT_MODEL.weightEngagement);
  const [bias, setBias] = useState(DEFAULT_MODEL.bias);
  const [threshold, setThreshold] = useState(DEFAULT_MODEL.threshold);
  const [selectedId, setSelectedId] = useState('J');
  const [fitMetadata, setFitMetadata] = useState(DEFAULT_MODEL);
  const [manualOverride, setManualOverride] = useState(false);

  const currentModel = useMemo(
    () => ({ weightRisk, weightEngagement, bias }),
    [weightRisk, weightEngagement, bias],
  );
  const trainingScores = useMemo(() => scorePoints(TRAIN_POINTS, currentModel), [currentModel]);
  const validationScores = useMemo(() => scorePoints(VALIDATION_POINTS, currentModel), [currentModel]);
  const trainingClassified = useMemo(
    () => trainingScores.map((point) => classifyPoint(point, threshold)),
    [trainingScores, threshold],
  );
  const validationClassified = useMemo(
    () => validationScores.map((point) => classifyPoint(point, threshold)),
    [validationScores, threshold],
  );

  const selected = trainingClassified.find((point) => point.id === selectedId) ?? trainingClassified[0];
  const trainingCounts = summarize(trainingClassified);
  const validationCounts = summarize(validationClassified);
  const accuracy = safeRatio(validationCounts.tp + validationCounts.tn, validationClassified.length);
  const precision = safeRatio(validationCounts.tp, validationCounts.tp + validationCounts.fp);
  const recall = safeRatio(validationCounts.tp, validationCounts.tp + validationCounts.fn);
  const validationLogLoss = binaryLogLoss(validationScores);
  const validationBrier = brierScore(validationScores);
  const boundary = boundaryLine(weightRisk, weightEngagement, bias, threshold);
  const nearThreshold = validationScores.filter((point) => Math.abs(point.probability - threshold) <= 0.08);
  const compressed = validationScores.filter((point) => point.probability > 0.4 && point.probability < 0.6).length;
  const mistakes = validationCounts.fp + validationCounts.fn;

  const applyPreset = (presetId) => {
    const fitted = fitPresetModel(presetId);
    setWeightRisk(fitted.weightRisk);
    setWeightEngagement(fitted.weightEngagement);
    setBias(fitted.bias);
    setThreshold(fitted.threshold);
    setFitMetadata(fitted);
    setManualOverride(false);
  };

  const updateCoefficient = (setter) => (event) => {
    setter(Number(event.target.value));
    setManualOverride(true);
  };

  return (
    <>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Core classifier</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Logistic Regression</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              The coefficients below are learned from the training sample by minimizing Bernoulli log loss with L2 regularization.
              Sigmoid converts the learned logit into a probability-shaped score; the decision threshold is a separate deployment policy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} /> Reset learned fit
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} /> Model + policy controls
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Preset</span>
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {Object.entries(PRESETS).map(([id, preset]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => applyPreset(id)}
                  className="ds-btn flex flex-col items-start rounded border border-[var(--ds-rule)] bg-[var(--ds-panel)] p-3 text-left text-[var(--ds-ink)] transition-all duration-120 hover:border-[var(--ds-accent)] hover:bg-[var(--ds-accent-w)]"
                >
                  {preset.label}
                  <span className="mt-1 block text-xs font-semibold normal-case leading-4 text-[var(--ds-faint)]">{preset.detail}</span>
                </button>
              ))}
            </div>
            <div className={`rounded-lg border p-3 text-xs font-semibold leading-5 ${manualOverride ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-emerald-200 bg-emerald-50 text-emerald-950'}`}>
              {manualOverride
                ? 'Manual coefficient override: probabilities no longer represent the fitted preset.'
                : `Learned with λ=${fitMetadata.lambda}; converged in ${fitMetadata.iterations} Newton iterations.`}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Risk weight: {weightRisk.toFixed(2)}
            <input min="-4" max="4" step="0.05" type="range" value={weightRisk} onChange={updateCoefficient(setWeightRisk)} />
            <span className="text-xs font-semibold text-slate-500">{coefficientMeaning('risk', weightRisk)}</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Engagement weight: {weightEngagement.toFixed(2)}
            <input min="-4" max="4" step="0.05" type="range" value={weightEngagement} onChange={updateCoefficient(setWeightEngagement)} />
            <span className="text-xs font-semibold text-slate-500">{coefficientMeaning('engagement', weightEngagement)}</span>
          </label>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Bias: {bias.toFixed(2)}
              <input min="-3" max="3" step="0.05" type="range" value={bias} onChange={updateCoefficient(setBias)} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Decision threshold: {threshold.toFixed(2)}
              <input
                min={THRESHOLD_RANGE.min}
                max={THRESHOLD_RANGE.max}
                step={THRESHOLD_RANGE.step}
                type="range"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
              />
              <span className="text-xs font-semibold text-slate-500">Moves decisions only; learned probabilities stay fixed.</span>
            </label>
          </div>
        </div>
      </section>

      <DecisionSurface
        scored={trainingClassified}
        selected={selected}
        selectedId={selectedId}
        onSelect={setSelectedId}
        boundary={boundary}
        threshold={threshold}
        weightRisk={weightRisk}
        weightEngagement={weightEngagement}
        bias={bias}
        counts={trainingCounts}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Validation accuracy" value={metricPercent(accuracy)} detail="Hard decisions on rows not used to fit coefficients." />
        <Stat label="Validation precision" value={metricPercent(precision)} detail="Positive predictive value at the current threshold." />
        <Stat label="Validation recall" value={metricPercent(recall)} detail="Fraction of validation positives recovered." />
        <Stat label="Probability quality" value={`log loss ${validationLogLoss.toFixed(3)}`} detail={`Brier score ${validationBrier.toFixed(3)}; both use probabilities before thresholding.`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Predict before running</p>
          <p className="mt-2 text-sm leading-6 text-cyan-950">Raise only the threshold. The fitted probability surface must stay unchanged while fewer validation cases become positive.</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700">
            <AlertTriangle size={14} /> Failure mode
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            {compressed >= 5
              ? 'Many validation probabilities are compressed near 0.5, so the decision policy is sensitive to small threshold changes.'
              : `${mistakes} validation mistakes now; ${nearThreshold.length} validation cases sit within 0.08 of the threshold.`}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Practical rule</p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Fit coefficients on training data, assess probability quality and tune the operating threshold on validation data, then keep final test evidence outside that feedback loop.
          </p>
        </div>
      </section>

      <DeploymentPolicyLab scored={validationScores} threshold={threshold} onThresholdChange={setThreshold} />
      <SeparationRegularizationLab />
    </>
  );
}
