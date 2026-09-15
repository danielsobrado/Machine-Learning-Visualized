import React, { useMemo, useState } from 'react';
import { Compass, Grid3X3, RotateCcw, Sigma, Target } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BASE_KEY_PAIR,
  BASE_QUERY_PAIR,
  MAX_POSITION,
  ROPE_BASES,
  ROTARY_DIMENSIONS,
} from './ropeConstants.js';
import { buildRoPEStats } from './ropeModel.js';

const toDegrees = (radians) => ((radians * 180) / Math.PI) % 360;
const formatAngle = (radians) => `${toDegrees(radians).toFixed(1)} deg`;

function ControlButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'border-violet-800 bg-violet-700 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-violet-400'
      }`}
    >
      {children}
    </button>
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

function VectorPlot({ vector, color, label }) {
  const size = 120;
  const center = size / 2;
  const endX = center + vector[0] * 42;
  const endY = center - vector[1] * 42;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-28 w-full" role="img" aria-label={label}>
        <circle cx={center} cy={center} r="42" fill="white" stroke="#cbd5e1" />
        <line x1="18" y1={center} x2="102" y2={center} stroke="#e2e8f0" />
        <line x1={center} y1="18" x2={center} y2="102" stroke="#e2e8f0" />
        <line x1={center} y1={center} x2={endX} y2={endY} stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx={endX} cy={endY} r="5" fill={color} />
      </svg>
      <div className="text-center text-sm font-semibold text-slate-700">{label}</div>
    </div>
  );
}

export default function RoPEAnimation() {
  const [queryPosition, setQueryPosition] = useState(8);
  const [keyPosition, setKeyPosition] = useState(3);
  const [rotaryDimension, setRotaryDimension] = useState(64);
  const [base, setBase] = useState(10000);
  const [pairIndex, setPairIndex] = useState(0);

  const stats = useMemo(
    () =>
      buildRoPEStats({
        queryPosition,
        keyPosition,
        rotaryDimension,
        base,
        pairIndex,
      }),
    [base, keyPosition, pairIndex, queryPosition, rotaryDimension],
  );

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-violet-700">
                <RotateCcw size={17} />
                Rotary position embeddings
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">RoPE</h1>
              <p className="mt-2 max-w-3xl text-slate-700">
                RoPE rotates 2D pairs inside each attention head's query and key vectors after the learned Q/K projections.
                Their dot-product contribution can then be written using the relative offset m - n rather than separate
                absolute phases.
              </p>
            </div>
            <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-950">
              <div className="font-bold">Per-pair identity</div>
              <div>Q at m meets K at n through their relative phase.</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            This visualizer isolates one rotary pair. A real attention logit sums contributions across all head dimensions;
            implementations may rotate the full head dimension or only a configured subset.
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <Grid3X3 size={18} />
              Controls
            </div>

            <div className="mt-5 space-y-5">
              <label className="block">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Query position m</span>
                  <span>{queryPosition}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={MAX_POSITION}
                  step="1"
                  value={queryPosition}
                  onChange={(event) => setQueryPosition(Number(event.target.value))}
                  className="w-full accent-violet-700"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Key position n</span>
                  <span>{keyPosition}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={MAX_POSITION}
                  step="1"
                  value={keyPosition}
                  onChange={(event) => setKeyPosition(Number(event.target.value))}
                  className="w-full accent-fuchsia-700"
                />
              </label>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Rotary dimension per head</div>
                <div className="grid grid-cols-3 gap-2">
                  {ROTARY_DIMENSIONS.map((dimension) => (
                    <ControlButton
                      key={dimension}
                      active={rotaryDimension === dimension}
                      onClick={() => {
                        setRotaryDimension(dimension);
                        setPairIndex((current) => Math.min(current, dimension / 2 - 1));
                      }}
                    >
                      {dimension}
                    </ControlButton>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  This is the width over which rotary frequencies are defined, not the transformer's full hidden size.
                </p>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">RoPE base</div>
                <div className="grid grid-cols-1 gap-2">
                  {ROPE_BASES.map((nextBase) => (
                    <ControlButton key={nextBase} active={base === nextBase} onClick={() => setBase(nextBase)}>
                      {nextBase}
                    </ControlButton>
                  ))}
                </div>
              </div>

              <label className="block">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Dimension pair</span>
                  <span>{pairIndex}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(7, rotaryDimension / 2 - 1)}
                  step="1"
                  value={pairIndex}
                  onChange={(event) => setPairIndex(Number(event.target.value))}
                  className="w-full accent-slate-900"
                />
              </label>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Metric icon={Compass} label="Relative distance" value={stats.relativeDistance} helper="The selected pair depends on m - n through its relative phase." />
              <Metric icon={RotateCcw} label="Pair frequency theta" value={stats.theta.toExponential(2)} helper="Later pairs use smaller inverse frequencies and rotate more slowly." />
              <Metric icon={Target} label="Pair score" value={stats.directPairScore.toFixed(3)} helper={`This pair changed by ${stats.scoreShift.toFixed(3)} from its unrotated dot product.`} />
              <Metric icon={Sigma} label="Identity error" value={Math.abs(stats.directPairScore - stats.relativePairScore).toExponential(1)} helper="Direct rotation and the relative-position form should agree." />
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Rotation in one Q/K dimension pair</h2>
                  <p className="text-sm text-slate-600">
                    The selected pair uses angle = position × theta. Values are not rotated by standard RoPE.
                  </p>
                </div>
                <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  q angle {formatAngle(stats.queryAngle)} | k angle {formatAngle(stats.keyAngle)}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <VectorPlot vector={BASE_QUERY_PAIR} color="#64748b" label="Projected query pair" />
                <VectorPlot vector={stats.rotatedQuery} color="#7c3aed" label={`Rotated Q at m=${queryPosition}`} />
                <VectorPlot vector={stats.rotatedKey} color="#c026d3" label={`Rotated K at n=${keyPosition}`} />
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Multi-frequency schedule</h2>
              <p className="text-sm text-slate-600">
                Each 2D pair receives a different inverse frequency. Their attention-logit contributions are summed with
                the other head dimensions, giving the head access to multiple positional scales.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="py-2">Pair</th>
                      <th className="py-2">Theta</th>
                      <th className="py-2">Q angle</th>
                      <th className="py-2">K angle</th>
                      <th className="py-2">Relative angle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.rows.map((row) => (
                      <tr key={row.pair} className={`border-b border-slate-100 ${row.pair === pairIndex ? 'bg-violet-50' : ''}`}>
                        <td className="py-2 font-semibold text-slate-900">{row.pair}</td>
                        <td className="py-2 font-mono text-slate-700">{row.theta.toExponential(2)}</td>
                        <td className="py-2">{formatAngle(row.queryAngle)}</td>
                        <td className="py-2">{formatAngle(row.keyAngle)}</td>
                        <td className="py-2 font-semibold text-violet-700">{formatAngle(row.relativeAngle)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Predict before running</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Move Q and K by the same positional offset while keeping their projected content pairs fixed. Their
                  absolute phases change, but the RoPE contribution to the dot product stays the same because m - n is unchanged.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">What RoPE changes</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Standard RoPE rotates Q and K before attention scoring. It does not rotate V, replace the causal mask,
                  or add an absolute position vector to the residual stream.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Long-context caution</h3>
                <p className="mt-2 text-sm text-slate-700">
                  The rotation formula is defined at arbitrary positions, but using much longer contexts than training can
                  degrade behavior. Practical systems often change the base or apply a RoPE scaling strategy.
                </p>
              </div>
            </section>
          </main>
        </section>

        <AssessmentPanel lessonId="rope" />
      </div>
    </div>
  );
}
