import React, { useMemo, useState } from 'react';
import { RotateCcw, SlidersHorizontal, Target } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import NaiveBayesDependenceLab from './NaiveBayesDependenceLab';
import {
  MODELS,
  POINTS,
  classifyKnn,
  classifyNaiveBayes,
  classifySvm,
  project,
  svmBoundarySegment,
} from './knnNaiveBayesSvmModel';

const COLORS = {
  blue: { fill: '#2563eb', soft: 'bg-blue-50 border-blue-200 text-blue-950', text: 'text-blue-700' },
  orange: { fill: '#f97316', soft: 'bg-orange-50 border-orange-200 text-orange-950', text: 'text-orange-700' },
};

const CONFIDENCE_DETAILS = Object.freeze({
  knn: 'share of the k neighbors voting for the winner',
  naiveBayes: 'posterior under the Naive Bayes assumptions',
  svm: 'teaching-scale normalized margin, not a probability',
});

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function KnnNaiveBayesSvmAnimation() {
  const [model, setModel] = useState('knn');
  const [k, setK] = useState(3);
  const [queryX, setQueryX] = useState(0.2);
  const [queryY, setQueryY] = useState(0.1);
  const query = { x: queryX, y: queryY };

  const results = useMemo(() => ({
    knn: classifyKnn(query, k),
    naiveBayes: classifyNaiveBayes(query),
    svm: classifySvm(query),
  }), [queryX, queryY, k]);
  const activeResult = results[model];
  const predictionColor = COLORS[activeResult.prediction];

  const reset = () => {
    setModel('knn');
    setK(3);
    setQueryX(0.2);
    setQueryY(0.1);
  };

  const queryPos = project(query);
  const [svmBoundaryStart, svmBoundaryEnd] = svmBoundarySegment();

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Classical classifiers</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">kNN, Naive Bayes, and SVM</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              These classifiers make different assumptions about the same scaled feature space. Move the query point and
              compare local voting, probabilistic likelihoods, and margin-based separation. Then stress-test the
              assumptions instead of trusting the clean demo alone.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Model controls
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Classifier</span>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(MODELS).map(([id, config]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setModel(id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-black transition ${model === id ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Query x: {queryX.toFixed(1)}
            <input min="-2.8" max="2.8" step="0.1" type="range" value={queryX} onChange={(event) => setQueryX(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Query y: {queryY.toFixed(1)}
            <input min="-2.1" max="2.1" step="0.1" type="range" value={queryY} onChange={(event) => setQueryY(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            k neighbors: {k}
            <input min="1" max="7" step="2" type="range" value={k} onChange={(event) => setK(Number(event.target.value))} />
          </label>
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          <strong className="text-slate-950">{MODELS[model].label}:</strong> {MODELS[model].detail}
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Prediction" value={activeResult.prediction} detail={`${MODELS[model].label} output`} />
        <Stat label="Confidence" value={`${Math.round(activeResult.confidence * 100)}%`} detail={CONFIDENCE_DETAILS[model]} />
        <Stat label="Query x" value={queryX.toFixed(1)} detail="scaled feature 1" />
        <Stat label="Query y" value={queryY.toFixed(1)} detail="scaled feature 2" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Target size={16} />
            Shared scaled feature space
          </h3>
          <svg viewBox="0 0 400 300" className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label="Classifier comparison feature space">
            <line x1="36" y1="276" x2="364" y2="276" stroke="#cbd5e1" />
            <line x1="36" y1="36" x2="36" y2="276" stroke="#cbd5e1" />
            <line x1={svmBoundaryStart.cx} y1={svmBoundaryStart.cy} x2={svmBoundaryEnd.cx} y2={svmBoundaryEnd.cy} stroke="#64748b" strokeDasharray="6 6" />
            {POINTS.map((point) => {
              const { cx, cy } = project(point);
              const isNeighbor = model === 'knn' && results.knn.neighbors.slice(0, k).some((neighbor) => neighbor.id === point.id);
              return (
                <g key={point.id}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isNeighbor ? 11 : 8}
                    fill={COLORS[point.label].fill}
                    stroke={isNeighbor ? '#111827' : '#ffffff'}
                    strokeWidth="3"
                  />
                  <text x={cx + 12} y={cy + 4} className="fill-slate-700 text-xs font-black">{point.id}</text>
                </g>
              );
            })}
            <circle cx={queryPos.cx} cy={queryPos.cy} r="13" fill={predictionColor.fill} stroke="#111827" strokeWidth="4" />
            <text x={queryPos.cx + 16} y={queryPos.cy + 5} className="fill-slate-950 text-xs font-black">query</text>
            <text x="200" y="292" textAnchor="middle" className="fill-slate-600 text-xs font-bold">scaled feature x</text>
            <text x="14" y="150" textAnchor="middle" transform="rotate(-90 14 150)" className="fill-slate-600 text-xs font-bold">scaled feature y</text>
          </svg>
        </section>

        <section className={`rounded-lg border p-5 ${predictionColor.soft}`}>
          <h3 className="text-sm font-black uppercase tracking-wide">Why this prediction?</h3>
          {model === 'knn' && (
            <div className="mt-4 space-y-3">
              {results.knn.neighbors.slice(0, k).map((neighbor, index) => (
                <div key={neighbor.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/80 px-3 py-2 text-sm">
                  <strong>{index + 1}. {neighbor.id} votes {neighbor.label}</strong>
                  <span>{neighbor.distance.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          {model === 'naiveBayes' && (
            <div className="mt-4 space-y-3">
              {Object.entries(results.naiveBayes.scores).map(([label, score]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-white/80 px-3 py-2 text-sm">
                  <strong>{label} log score</strong>
                  <span>{score.toFixed(2)}</span>
                </div>
              ))}
              <p className="text-sm leading-6">
                Each feature contributes a Gaussian likelihood; the class prior and feature likelihoods combine in log
                space. The reported posterior is only as trustworthy as those modeling assumptions.
              </p>
            </div>
          )}
          {model === 'svm' && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-white/80 px-3 py-2 text-sm">
                <strong>Margin score</strong>
                <span className="ml-3">{results.svm.marginScore.toFixed(2)}</span>
              </div>
              <p className="text-sm leading-6">The dashed boundary is a teaching SVM margin line. Points farther from the boundary are more decisive.</p>
            </div>
          )}
        </section>
      </div>

      <NaiveBayesDependenceLab />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">Problem solved</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">
            These methods give strong classical baselines: nearest-neighbor memory, simple probabilistic assumptions,
            and margin-based linear separation.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-700">Mistake to avoid</h3>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            kNN and SVM are sensitive to feature scale. Naive Bayes can double-count correlated evidence and become
            dramatically overconfident even when the duplicated features add zero information.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Understanding check</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            If you copy one informative feature five times, should your evidence become five times stronger? Predict the
            Naive Bayes confidence first, then use the failure lab to check.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="knn-naive-bayes-svm" title="kNN, Naive Bayes, and SVM check" />
    </div>
  );
}
