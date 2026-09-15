import React, { useMemo, useState } from 'react';
import { Activity, GitMerge, Layers, Route, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  DEFAULT_WRITE_STRENGTHS,
  FEATURE_LABELS,
  INITIAL_STREAM,
  RESIDUAL_WRITES,
} from './residualStreamConstants.js';
import {
  buildResidualLedger,
  normalizationPlacement,
} from './residualStreamModel.js';

const COMPONENTS = [INITIAL_STREAM, ...RESIDUAL_WRITES];
const NORMALIZATION_MODES = [
  { id: 'pre', label: 'Pre-norm' },
  { id: 'post', label: 'Post-norm' },
];

function Bar({ value, color }) {
  const width = `${Math.min(50, Math.abs(value) * 25)}%`;
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-xs font-semibold text-slate-500">{value.toFixed(2)}</div>
      <div className="relative h-3 flex-1 rounded-full bg-slate-100">
        <div
          className={`absolute top-0 h-3 rounded-full ${value >= 0 ? 'left-1/2' : 'right-1/2'}`}
          style={{ width, backgroundColor: color }}
        />
        <div className="absolute left-1/2 top-[-2px] h-5 w-px bg-slate-300" />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon size={16} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

function VectorCard({ title, vector, color = '#1d4ed8' }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-bold text-slate-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {vector.map((value, index) => (
          <div key={FEATURE_LABELS[index]}>
            <div className="mb-1 text-xs font-semibold text-slate-500">{FEATURE_LABELS[index]}</div>
            <Bar value={value} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'border-blue-800 bg-blue-700 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
      }`}
    >
      {children}
    </button>
  );
}

export default function ResidualStreamAnimation() {
  const [strengths, setStrengths] = useState({ ...DEFAULT_WRITE_STRENGTHS });
  const [selectedStep, setSelectedStep] = useState(2);
  const [normalizationMode, setNormalizationMode] = useState('pre');

  const ledger = useMemo(() => buildResidualLedger(strengths), [strengths]);
  const normalization = useMemo(() => normalizationPlacement(normalizationMode), [normalizationMode]);
  const selected = ledger.writes[selectedStep];

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                <GitMerge size={17} />
                Transformer layer flow
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">Residual stream</h1>
              <p className="mt-2 max-w-3xl text-slate-700">
                Attention and MLP sublayers write updates into the current token representation through residual addition.
                Normalization changes where a sublayer reads from or where its sum is normalized; it is not unit-length
                normalization of the residual stream after every write.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950">
              <div className="font-bold">Residual rule</div>
              <div>x next = x + sublayer write</div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <SlidersHorizontal size={18} />
              Contribution strengths
            </div>
            <div className="mt-5 space-y-4">
              {COMPONENTS.map((component) => (
                <label key={component.id} className="block">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                    <span>{component.label}</span>
                    <span>{strengths[component.id].toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={strengths[component.id]}
                    onChange={(event) =>
                      setStrengths((current) => ({
                        ...current,
                        [component.id]: Number(event.target.value),
                      }))
                    }
                    className="w-full accent-blue-700"
                  />
                </label>
              ))}
            </div>
          </aside>

          <main className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Metric icon={Activity} label="Final magnitude" value={ledger.finalMagnitude.toFixed(2)} helper="Magnitude of the accumulated residual vector." />
              <Metric icon={Route} label="Write load" value={ledger.totalWriteMagnitude.toFixed(2)} helper="Sum of attention and MLP write magnitudes." />
              <Metric icon={Layers} label="Dominant feature" value={ledger.dominantFeature} helper="Largest final toy feature dimension." />
              <Metric icon={GitMerge} label="Update rule" value="add" helper="Writes are added to the running representation." />
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Residual contribution ledger</h2>
              <p className="text-sm text-slate-600">
                The embedding initializes the stream. Every later row is a sublayer write added to the state above it.
              </p>
              <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3">
                <div className="font-bold text-teal-950">{ledger.initial.label}</div>
                <div className="mt-2 grid gap-2 md:grid-cols-4">
                  {FEATURE_LABELS.map((feature, index) => (
                    <div key={feature} className="rounded-md bg-white p-2">
                      <div className="mb-1 text-xs font-semibold text-slate-500">{feature}</div>
                      <Bar value={ledger.initial.value[index]} color={ledger.initial.color} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {ledger.writes.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setSelectedStep(index)}
                    className={`grid w-full gap-3 rounded-lg border p-3 text-left md:grid-cols-[160px_1fr] ${
                      selectedStep === index ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-950">{step.label}</div>
                      <div className="text-xs text-slate-500">write magnitude {step.magnitude.toFixed(2)}</div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-4">
                      {FEATURE_LABELS.map((feature, featureIndex) => (
                        <div key={feature} className="rounded-md bg-slate-50 p-2">
                          <div className="mb-1 text-xs font-semibold text-slate-500">{feature}</div>
                          <Bar value={step.after[featureIndex]} color={step.color} />
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <VectorCard title="Before" vector={selected.before} color="#64748b" />
              <VectorCard title={`Write: ${selected.label}`} vector={selected.write} color={selected.color} />
              <VectorCard title="After = before + write" vector={selected.after} />
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Where normalization actually sits</h2>
                  <p className="mt-1 max-w-3xl text-sm text-slate-600">
                    This isolated toy sublayer compares normalization placement. LayerNorm standardizes features for one
                    token; it does not normalize the residual vector to Euclidean length 1.
                  </p>
                </div>
                <div className="flex gap-2">
                  {NORMALIZATION_MODES.map((mode) => (
                    <ModeButton key={mode.id} active={normalizationMode === mode.id} onClick={() => setNormalizationMode(mode.id)}>
                      {mode.label}
                    </ModeButton>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="font-mono text-base font-bold text-slate-950">{normalization.equation}</div>
                <div className="mt-2 text-sm text-slate-700">
                  {normalizationMode === 'pre'
                    ? 'The sublayer reads LN(x), but the skip path carries x directly to the addition.'
                    : 'The sublayer reads x, the residual sum is formed, and LayerNorm is applied afterward.'}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <VectorCard title="Residual input x" vector={normalization.input} color="#64748b" />
                <VectorCard title={normalizationMode === 'pre' ? 'Sublayer input LN(x)' : 'Sublayer input x'} vector={normalization.sublayerInput} color="#7c3aed" />
                <VectorCard title="Sublayer write F(·)" vector={normalization.write} color="#db2777" />
                <VectorCard title="Block output y" vector={normalization.output} color="#1d4ed8" />
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Predict before running</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Increase an early write. Later updates still add on top of the changed state because the residual stream
                  carries previous information forward.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Failure mode</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Large or badly scaled writes can destabilize a deep stack. Normalization placement, initialization, and
                  residual scaling affect optimization without changing the basic additive skip connection.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Mistake to avoid</h3>
                <p className="mt-2 text-sm text-slate-700">
                  The residual stream is not a separate memory bank, and LayerNorm is not an L2 projection to the unit
                  sphere. Those are different operations with different geometry.
                </p>
              </div>
            </section>
          </main>
        </section>

        <AssessmentPanel lessonId="residual-stream" />
      </div>
    </div>
  );
}
