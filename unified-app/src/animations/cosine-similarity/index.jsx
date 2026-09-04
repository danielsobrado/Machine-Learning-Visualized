import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, Search, Shield } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { COSINE_DEFAULTS, SEARCH_ITEMS, SEARCH_QUERY, VECTOR_PRESETS } from './cosineConfig';
import { buildCosineLab } from './cosineModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function vectorText(vector) {
  return `[${vector.map((value) => value.toFixed(1)).join(', ')}]`;
}

function Ranking({ title, rows, metric }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-black uppercase tracking-wide text-slate-600">{title}</h4>
      <div className="mt-3 space-y-2">
        {rows.map((row, index) => (
          <div key={row.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span><strong>#{index + 1}</strong> {row.label}</span>
            <span className="font-mono font-bold text-slate-700">{metric === 'cosine' ? row.cosine?.toFixed(3) : metric === 'dot' ? row.dot.toFixed(2) : row.euclidean.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CosineSimilarityAnimation() {
  const [presetId, setPresetId] = useState(COSINE_DEFAULTS.presetId);
  const [scaleA, setScaleA] = useState(COSINE_DEFAULTS.scaleA);
  const [scaleB, setScaleB] = useState(COSINE_DEFAULTS.scaleB);
  const preset = VECTOR_PRESETS.find((item) => item.id === presetId);
  const lab = useMemo(() => buildCosineLab({
    a: preset.a,
    b: preset.b,
    scaleA,
    scaleB,
    query: SEARCH_QUERY,
    items: SEARCH_ITEMS,
  }), [preset, scaleA, scaleB]);

  const undefinedCosine = lab.cosine === null;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Vector geometry</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Cosine Similarity</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Cosine similarity measures direction, not distance or raw magnitude: <strong>A·B / (||A|| ||B||)</strong>.
          That distinction is useful for normalized embeddings, but it can also produce rankings very different from dot product or Euclidean distance.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">
          {VECTOR_PRESETS.map((item) => (
            <button key={item.id} type="button" onClick={() => setPresetId(item.id)} className={`rounded-lg border p-3 text-left ${presetId === item.id ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}>
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block font-mono text-xs text-slate-500">A={vectorText(item.a)} B={vectorText(item.b)}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Scale A: {scaleA.toFixed(1)}×<input type="range" min="0" max="5" step="0.1" value={scaleA} onChange={(event) => setScaleA(Number(event.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Scale B: {scaleB.toFixed(1)}×<input type="range" min="0" max="5" step="0.1" value={scaleB} onChange={(event) => setScaleB(Number(event.target.value))} /></label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Stat label="Dot product" value={lab.dot.toFixed(2)} detail="magnitude-sensitive" />
        <Stat label="||A||" value={lab.normA.toFixed(2)} detail={vectorText(lab.a)} />
        <Stat label="||B||" value={lab.normB.toFixed(2)} detail={vectorText(lab.b)} />
        <Stat label="Cosine" value={undefinedCosine ? 'undefined' : lab.cosine.toFixed(3)} detail="direction similarity" />
        <Stat label="Angle" value={lab.angle === null ? 'undefined' : `${lab.angle.toFixed(1)}°`} detail="between non-zero vectors" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Calculator size={16} /> Normalization identity</h3>
          <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100">
            cos(A,B) = A·B / (||A|| ||B||)<br />
            = normalize(A) · normalize(B)
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            {undefinedCosine ? 'At least one vector has zero norm, so normalization and the angle are undefined.' : `Normalized dot = ${lab.normalizedDot.toFixed(3)}, exactly matching cosine.`}
          </p>
          {!undefinedCosine && scaleA > 0 && scaleB > 0 && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
              Multiply either vector by a positive scalar: the dot product changes, but cosine does not. Magnitude cancels in the denominator.
            </div>
          )}
          {undefinedCosine && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <AlertTriangle className="mr-2 inline" size={16} /> Returning cosine = 0 here would incorrectly imply orthogonality. A zero vector has no direction, so cosine similarity is undefined.
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Search size={16} /> Same vectors, three ranking rules</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">Query vector is <span className="font-mono">[1, 0]</span>. The candidates deliberately separate direction from distance and magnitude.</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <Ranking title="Cosine" rows={lab.cosineRanking} metric="cosine" />
            <Ranking title="Dot product" rows={lab.dotRanking} metric="dot" />
            <Ranking title="Euclidean" rows={lab.euclideanRanking} metric="euclidean" />
          </div>
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950"><strong className="block text-xs uppercase tracking-wide text-cyan-700">Cosine</strong>Prefers the exact same direction even if the vector is far away in raw coordinate space.</div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950"><strong className="block text-xs uppercase tracking-wide text-violet-700">Dot product</strong>Rewards alignment and magnitude. A very long aligned vector can dominate.</div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong className="block text-xs uppercase tracking-wide text-emerald-700">Euclidean</strong>Measures absolute distance. The nearby slight-angle candidate wins the built-in counterexample.</div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
        <Shield className="mr-2 inline" size={16} /> Cosine similarity is a geometry primitive, not a claim that two texts or users are semantically equivalent. The embedding model and training objective determine what those directions mean.
      </section>

      <AssessmentPanel lessonId="cosine-similarity" title="Cosine Similarity check" />
    </div>
  );
}
