import React, { useMemo, useState } from 'react';
import { RotateCcw, SlidersHorizontal, Target } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import KnnScalingLab from './KnnScalingLab.jsx';
import NaiveBayesDependenceLab from './NaiveBayesDependenceLab';
import SvmMarginLab from './SvmMarginLab.jsx';
import {
  MODELS,
  POINTS,
  classifyKnn,
  classifyNaiveBayes,
  project,
} from './knnNaiveBayesSvmModel.js';
import {
  classifySvm,
  fitLinearSvm,
  svmBoundarySegment,
} from './linearSvmModel.js';
import { SVM_FIT } from './knnNaiveBayesSvmConstants.js';

const COLORS = {
  blue: { fill: '#2563eb', soft: 'bg-blue-50 border-blue-200 text-blue-950' },
  orange: { fill: '#f97316', soft: 'bg-orange-50 border-orange-200 text-orange-950' },
};

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
  const [svmC, setSvmC] = useState(SVM_FIT.defaultC);
  const [queryX, setQueryX] = useState(0.2);
  const [queryY, setQueryY] = useState(0.1);
  const query = { x: queryX, y: queryY };

  const svmFit = useMemo(() => fitLinearSvm(POINTS, svmC), [svmC]);
  const results = useMemo(() => ({
    knn: classifyKnn(query, k),
    naiveBayes: classifyNaiveBayes(query),
    svm: classifySvm(query, svmFit),
  }), [queryX, queryY, k, svmFit]);
  const activeResult = results[model];
  const predictionColor = COLORS[activeResult.prediction];

  const reset = () => {
    setModel('knn');
    setK(3);
    setSvmC(SVM_FIT.defaultC);
    setQueryX(0.2);
    setQueryY(0.1);
  };

  const queryPos = project(query);
  const [svmBoundaryStart, svmBoundaryEnd] = svmBoundarySegment(svmFit, project, 0);
  const [lowerMarginStart, lowerMarginEnd] = svmBoundarySegment(svmFit, project, -1);
  const [upperMarginStart, upperMarginEnd] = svmBoundarySegment(svmFit, project, 1);
  const marginActiveIds = new Set(svmFit.marginActive.map((point) => point.id));

  const scoreCard = model === 'svm'
    ? {
        label: 'Margin distance',
        value: activeResult.marginDistance.toFixed(2),
        detail: 'geometric distance to the fitted boundary; not a probability',
      }
    : model === 'naiveBayes'
      ? {
          label: 'Posterior*',
          value: `${Math.round(activeResult.confidence * 100)}%`,
          detail: 'posterior under the Gaussian independence assumptions',
        }
      : {
          label: 'Vote share',
          value: `${Math.round(activeResult.confidence * 100)}%`,
          detail: `share of the ${k} selected neighbors voting for the winner`,
        };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Classical classifiers</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">kNN, Naive Bayes, and SVM</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              These classifiers make different assumptions about the same feature space. Move the query point and compare local voting, probabilistic likelihoods, and a fitted margin boundary. Then stress-test each family where its assumptions break.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} /> Model controls
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
          {model === 'knn' ? (
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              k neighbors: {k}
              <input min="1" max="7" step="2" type="range" value={k} onChange={(event) => setK(Number(event.target.value))} />
            </label>
          ) : model === 'svm' ? (
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              SVM C: {svmC}
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={svmC} onChange={(event) => setSvmC(Number(event.target.value))}>
                {SVM_FIT.cOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              Gaussian NB estimates class priors plus one mean/variance per feature and class.
            </div>
          )}
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          <strong className="text-slate-950">{MODELS[model].label}:</strong> {MODELS[model].detail}
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Prediction" value={activeResult.prediction} detail={`${MODELS[model].label} output`} />
        <Stat {...scoreCard} />
        <Stat label="Query x" value={queryX.toFixed(1)} detail="scaled feature 1" />
        <Stat label="Query y" value={queryY.toFixed(1)} detail="scaled feature 2" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Target size={16} /> Shared scaled feature space</h3>
          <svg viewBox="0 0 400 300" className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label="Classifier comparison feature space">
            <line x1="36" y1="276" x2="364" y2="276" stroke="#cbd5e1" />
            <line x1="36" y1="36" x2="36" y2="276" stroke="#cbd5e1" />
            {model === 'svm' && (
              <>
                <line x1={lowerMarginStart.cx} y1={lowerMarginStart.cy} x2={lowerMarginEnd.cx} y2={lowerMarginEnd.cy} stroke="#a78bfa" strokeDasharray="3 5" />
                <line x1={upperMarginStart.cx} y1={upperMarginStart.cy} x2={upperMarginEnd.cx} y2={upperMarginEnd.cy} stroke="#a78bfa" strokeDasharray="3 5" />
              </>
            )}
            <line x1={svmBoundaryStart.cx} y1={svmBoundaryStart.cy} x2={svmBoundaryEnd.cx} y2={svmBoundaryEnd.cy} stroke="#64748b" strokeDasharray={model === 'svm' ? undefined : '6 6'} strokeWidth={model === 'svm' ? 3 : 1.5} />
            {POINTS.map((point) => {
              const { cx, cy } = project(point);
              const isNeighbor = model === 'knn' && results.knn.neighbors.slice(0, k).some((neighbor) => neighbor.id === point.id);
              const isMarginActive = model === 'svm' && marginActiveIds.has(point.id);
              return (
                <g key={point.id}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isNeighbor || isMarginActive ? 11 : 8}
                    fill={COLORS[point.label].fill}
                    stroke={isNeighbor || isMarginActive ? '#111827' : '#ffffff'}
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
          {model === 'svm' && <p className="mt-3 text-xs font-semibold text-slate-500">Solid line: fitted decision boundary. Dotted lines: ±1 functional-margin levels. Dark rings mark points currently inside or near the margin.</p>}
        </section>

        <section className={`rounded-lg border p-5 ${predictionColor.soft}`}>
          <h3 className="text-sm font-black uppercase tracking-wide">Why this prediction?</h3>
          {model === 'knn' && (
            <div className="mt-4 space-y-3">
              {results.knn.neighbors.slice(0, k).map((neighbor, index) => (
                <div key={neighbor.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/80 px-3 py-2 text-sm">
                  <strong>{index + 1}. {neighbor.id} votes {neighbor.label}</strong><span>{neighbor.distance.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          {model === 'naiveBayes' && (
            <div className="mt-4 space-y-3">
              {Object.entries(results.naiveBayes.scores).map(([label, score]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-white/80 px-3 py-2 text-sm"><strong>{label} log score</strong><span>{score.toFixed(2)}</span></div>
              ))}
              <p className="text-sm leading-6">Each feature contributes a Gaussian likelihood. The posterior magnitude is only as trustworthy as those likelihood and independence assumptions.</p>
            </div>
          )}
          {model === 'svm' && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-white/80 px-3 py-2 text-sm"><strong>Decision score</strong><span className="ml-3">{results.svm.decisionScore.toFixed(2)}</span></div>
              <div className="rounded-lg bg-white/80 px-3 py-2 text-sm"><strong>Signed margin distance</strong><span className="ml-3">{results.svm.signedMarginDistance.toFixed(2)}</span></div>
              <p className="text-sm leading-6">The sign chooses the class. Distance from the fitted boundary measures geometric decisiveness, but it is not a calibrated class probability.</p>
            </div>
          )}
        </section>
      </div>

      <KnnScalingLab />
      <NaiveBayesDependenceLab />
      <SvmMarginLab c={svmC} fit={svmFit} onCChange={setSvmC} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">kNN boundary</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">Neighborhoods depend on scale, distance metric, relevant dimensions, k, and local class balance. “Nearest” is a modeling choice, not a raw-data fact.</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-700">Naive Bayes boundary</h3>
          <p className="mt-3 text-sm leading-6 text-amber-950">Fast likelihood estimates can rank well while duplicated or correlated evidence makes posterior magnitudes dramatically overconfident.</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">SVM boundary</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">C trades margin regularization against violations. A margin score is not automatically a probability, and nonlinear structure may require a different representation or kernel.</p>
        </div>
      </section>

      <AssessmentPanel lessonId="knn-naive-bayes-svm" title="kNN, Naive Bayes, and SVM check" />
    </div>
  );
}
