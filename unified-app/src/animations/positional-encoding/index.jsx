import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, Braces, Grid3X3, Waves } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';

const SENTENCES = [
  ['the', 'model', 'reads', 'tokens', 'left', 'to', 'right'],
  ['dog', 'bites', 'man'],
  ['man', 'bites', 'dog'],
];

const ENCODING_TYPES = [
  { id: 'sinusoidal', label: 'Sinusoidal absolute' },
  { id: 'learned', label: 'Learned absolute (toy lookup)' },
  { id: 'none', label: 'No explicit position signal' },
];

const DIMENSIONS = [16, 32, 64, 128];
const VISIBLE_DIMENSIONS = 16;
const VECTOR_SLICE_DIMENSIONS = 12;
const MAX_PROBE_POSITION = 64;

function positionalValue(type, position, dimIndex, dimension) {
  if (type === 'none') return 0;
  if (type === 'learned') {
    const seed = (position + 1) * 97 + (dimIndex + 3) * 53;
    return Math.sin(seed) * 0.65 + Math.cos(seed * 0.37) * 0.35;
  }
  const angle = position / Math.pow(10000, (2 * Math.floor(dimIndex / 2)) / dimension);
  return dimIndex % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
}

function cosineSimilarity(left, right) {
  const dot = left.reduce((sum, value, index) => sum + value * right[index], 0);
  const leftNorm = Math.sqrt(left.reduce((sum, value) => sum + value * value, 0));
  const rightNorm = Math.sqrt(right.reduce((sum, value) => sum + value * value, 0));
  if (leftNorm === 0 || rightNorm === 0) return 0;
  return dot / (leftNorm * rightNorm);
}

function colorFor(value) {
  const normalized = (value + 1) / 2;
  const blue = Math.round(220 - normalized * 120);
  const green = Math.round(130 + normalized * 80);
  const red = Math.round(80 + normalized * 150);
  return `rgb(${red}, ${green}, ${blue})`;
}

function ControlButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'border-cyan-800 bg-cyan-700 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-400'
      }`}
    >
      {children}
    </button>
  );
}

function Metric({ label, value, helper }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

function extensionDescription(encodingType) {
  if (encodingType === 'sinusoidal') {
    return {
      value: 'Formula defined',
      helper: 'The sinusoidal function can be evaluated at unseen positions; model quality beyond training is not guaranteed.',
    };
  }
  if (encodingType === 'learned') {
    return {
      value: 'Lookup bounded',
      helper: 'A learned absolute table needs a row or another strategy for positions outside its configured range.',
    };
  }
  return {
    value: 'No signal',
    helper: 'There is no explicit position representation to extend.',
  };
}

export default function PositionalEncodingAnimation() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [encodingType, setEncodingType] = useState('sinusoidal');
  const [dimension, setDimension] = useState(64);
  const [selectedPosition, setSelectedPosition] = useState(3);
  const [probePosition, setProbePosition] = useState(32);

  const tokens = SENTENCES[sentenceIndex];

  const encodingRows = useMemo(
    () =>
      tokens.map((token, position) => ({
        token,
        position,
        values: Array.from({ length: VISIBLE_DIMENSIONS }, (_, dimIndex) =>
          positionalValue(encodingType, position, dimIndex, dimension),
        ),
      })),
    [dimension, encodingType, tokens],
  );

  const selectedValues = useMemo(
    () =>
      Array.from({ length: VECTOR_SLICE_DIMENSIONS }, (_, dimIndex) =>
        positionalValue(encodingType, selectedPosition, dimIndex, dimension),
      ),
    [dimension, encodingType, selectedPosition],
  );

  const similarity = useMemo(() => {
    const current = Array.from({ length: dimension }, (_, dimIndex) =>
      positionalValue(encodingType, selectedPosition, dimIndex, dimension),
    );
    const probe = Array.from({ length: dimension }, (_, dimIndex) =>
      positionalValue(encodingType, probePosition, dimIndex, dimension),
    );
    return cosineSimilarity(current, probe);
  }, [dimension, encodingType, probePosition, selectedPosition]);

  const extension = extensionDescription(encodingType);
  const explicitSignal = encodingType === 'none' ? 'Absent' : 'Present';

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-700">
                <Waves size={17} />
                Additive absolute position signals
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">Positional encoding</h1>
              <p className="mt-2 max-w-3xl text-slate-700">
                Plain unmasked self-attention is permutation-equivariant: reordering input tokens reorders the outputs in
                the same way unless position information is supplied. Additive absolute encodings attach a position-dependent
                vector to each token representation before attention.
              </p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
              <div className="font-bold">Scope</div>
              <div>Absolute additive encodings, not RoPE.</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            A causal mask does introduce index-dependent visibility, so decoder-only attention is not fully permutation-equivariant.
            The mask controls <strong>which positions are visible</strong>; an explicit position mechanism supplies a representation
            of <strong>where tokens are</strong>. Do not treat those as the same mechanism.
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <Grid3X3 size={18} />
              Controls
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Sentence</div>
                <div className="space-y-2">
                  {SENTENCES.map((sentence, index) => (
                    <ControlButton
                      key={sentence.join('-')}
                      active={sentenceIndex === index}
                      onClick={() => {
                        setSentenceIndex(index);
                        setSelectedPosition(Math.min(selectedPosition, sentence.length - 1));
                      }}
                    >
                      {sentence.join(' ')}
                    </ControlButton>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Position signal</div>
                <div className="grid grid-cols-1 gap-2">
                  {ENCODING_TYPES.map((type) => (
                    <ControlButton key={type.id} active={encodingType === type.id} onClick={() => setEncodingType(type.id)}>
                      {type.label}
                    </ControlButton>
                  ))}
                </div>
                {encodingType === 'learned' && (
                  <p className="mt-2 text-xs text-slate-500">
                    The displayed lookup rows are deterministic toy values standing in for parameters that would be learned during training.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Model dimension</div>
                <div className="grid grid-cols-2 gap-2">
                  {DIMENSIONS.map((dim) => (
                    <ControlButton key={dim} active={dimension === dim} onClick={() => setDimension(dim)}>
                      {dim}
                    </ControlButton>
                  ))}
                </div>
              </div>

              <label className="block">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Probe position</span>
                  <span>{probePosition}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={MAX_PROBE_POSITION}
                  step="1"
                  value={probePosition}
                  onChange={(event) => setProbePosition(Number(event.target.value))}
                  className="w-full accent-cyan-700"
                />
              </label>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Metric
                label="Explicit position signal"
                value={explicitSignal}
                helper={encodingType === 'none' ? 'This toy unmasked-attention setup has no position vector.' : 'Each position receives a distinct vector.'}
              />
              <Metric label="Probe similarity" value={similarity.toFixed(2)} helper={`Position ${selectedPosition} compared with position ${probePosition}.`} />
              <Metric label="Outside trained positions" value={extension.value} helper={extension.helper} />
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Token plus absolute position</h2>
                  <p className="text-sm text-slate-600">
                    Click a token to inspect its position vector. The heatmap shows the first {VISIBLE_DIMENSIONS} position dimensions.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  token embedding <ArrowRight size={14} /> token + absolute position
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {encodingRows.map((row) => (
                  <button
                    key={`${row.token}-${row.position}`}
                    type="button"
                    onClick={() => setSelectedPosition(row.position)}
                    className={`grid w-full gap-3 rounded-lg border p-3 text-left transition md:grid-cols-[110px_1fr] ${
                      selectedPosition === row.position
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-slate-200 bg-white hover:border-cyan-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-950">{row.token}</div>
                      <div className="text-xs text-slate-500">position {row.position}</div>
                    </div>
                    <div className="grid grid-cols-8 gap-1 md:grid-cols-[repeat(16,minmax(0,1fr))]">
                      {row.values.map((value, dimIndex) => (
                        <div
                          key={dimIndex}
                          className="h-7 rounded-sm border border-white"
                          style={{ backgroundColor: colorFor(value) }}
                          title={`dim ${dimIndex}: ${value.toFixed(2)}`}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-950">
                  <AlertCircle size={17} />
                  Predict before running
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  In the unmasked setup modeled here, reorder the same token set with no position signal. Attention has no
                  explicit coordinate telling it that one occurrence is position 0 and another is position 2.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-950">
                  <Braces size={17} />
                  Sinusoidal formula
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Even dimensions use sine and odd dimensions use cosine at different frequencies, giving every position
                  a deterministic multi-scale coordinate. The function extends past training positions, but learned behavior may not.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Related mechanism</h3>
                <p className="mt-2 text-sm text-slate-700">
                  RoPE does not add this vector to the token embedding. It rotates query and key dimension pairs before
                  attention scoring so position enters the QK geometry instead.
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Selected vector slice</h2>
              <div className="mt-4 grid gap-2 md:grid-cols-12">
                {selectedValues.map((value, index) => (
                  <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-center">
                    <div className="text-xs font-semibold text-slate-500">d{index}</div>
                    <div className="text-sm font-bold text-slate-900">{value.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </section>

        <AssessmentPanel lessonId="positional-encoding" />
      </div>
    </div>
  );
}
