import React, { useMemo } from 'react';
import { AlertTriangle, Scale, Target } from 'lucide-react';
import {
  PCA_COLORS,
  SCALE_TRAP_POINTS,
  TASK_SIGNAL_POINTS,
} from './pcaConstants.js';
import {
  classMeanGapOnComponent,
  covariance,
  explainedVarianceRatio,
  principalLoadings,
  standardize,
  toScreen,
} from './pcaModel.js';

function LoadingBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
        <span>{label}</span>
        <span className="font-mono">{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

function normalizedLoadings(angle) {
  const absolute = principalLoadings(angle).map(Math.abs);
  const total = absolute[0] + absolute[1];
  return absolute.map((value) => value / total);
}

function LoadingCard({ title, detail, loadings }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <strong className="text-sm text-slate-950">{title}</strong>
      <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
      <div className="mt-4 space-y-3">
        <LoadingBar label="Feature 1 contribution" value={loadings[0]} />
        <LoadingBar label="Feature 2 contribution" value={loadings[1]} />
      </div>
    </div>
  );
}

function TaskSignalPlot({ pca }) {
  return (
    <svg viewBox="0 0 360 220" className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50" aria-label="Two labeled groups separated vertically while PCA chooses the horizontal high-variance direction">
      <line x1="24" y1="110" x2="336" y2="110" stroke={PCA_COLORS.grid} />
      <line x1="180" y1="24" x2="180" y2="196" stroke={PCA_COLORS.grid} />
      <line x1="38" y1="110" x2="322" y2="110" stroke={PCA_COLORS.primary} strokeWidth="4" strokeLinecap="round" />
      {TASK_SIGNAL_POINTS.map((item, index) => {
        const [x, y] = toScreen(item.point, 360, 44);
        const adjustedY = 110 + (y - 180);
        return (
          <circle
            key={`${item.label}-${index}`}
            cx={x}
            cy={adjustedY}
            r="6"
            fill={item.label === 'A' ? PCA_COLORS.labelA : PCA_COLORS.labelB}
          />
        );
      })}
      <text x="286" y="98" fontSize="11" fontWeight="700" fill={PCA_COLORS.primary}>PC1</text>
      <text x="26" y="30" fontSize="11" fontWeight="700" fill={PCA_COLORS.secondary}>{Math.round(explainedVarianceRatio(pca) * 100)}% variance</text>
    </svg>
  );
}

export default function PcaFailureLab() {
  const diagnostics = useMemo(() => {
    const rawScalePca = covariance(SCALE_TRAP_POINTS);
    const standardizedScalePca = covariance(standardize(SCALE_TRAP_POINTS));
    const taskPoints = TASK_SIGNAL_POINTS.map((item) => item.point);
    const taskPca = covariance(taskPoints);

    return {
      rawLoadings: normalizedLoadings(rawScalePca.angle),
      standardizedLoadings: normalizedLoadings(standardizedScalePca.angle),
      taskPca,
      pc1Gap: classMeanGapOnComponent(TASK_SIGNAL_POINTS, taskPca.angle),
      pc2Gap: classMeanGapOnComponent(TASK_SIGNAL_POINTS, taskPca.angle + Math.PI / 2),
    };
  }, []);

  return (
    <section className="space-y-4 rounded-lg border border-rose-200 bg-rose-50/40 p-5">
      <div>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-700">
          <AlertTriangle size={15} /> PCA failure modes
        </p>
        <h3 className="mt-1 text-xl font-black text-slate-950">Variance is not automatically signal</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          PCA is unsupervised and unit-sensitive. It optimizes variance in the feature geometry you give it, so a large measurement scale can dominate the components and a low-variance direction can still carry the information your task needs.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
            <Scale size={15} /> Trap 1 · feature scale chooses the geometry
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            These two features contain the same monotonic pattern, but Feature 2 is measured on a much larger numeric scale. Raw covariance PCA therefore treats that axis as almost the whole story.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <LoadingCard
              title="Raw units"
              detail="Feature 2 numerically dominates the covariance matrix."
              loadings={diagnostics.rawLoadings}
            />
            <LoadingCard
              title="After standardization"
              detail="Equalized scales expose the shared structure instead of the units."
              loadings={diagnostics.standardizedLoadings}
            />
          </div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            Standardizing is not always mandatory. It changes the geometry deliberately. The point is to decide from domain units, not to let centimeters, dollars, bytes, or counts choose PC1 by accident.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
            <Target size={15} /> Trap 2 · high variance can ignore the target
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            The blue and rose groups are perfectly separated vertically, but most variance is horizontal. PCA chooses that horizontal direction without looking at the labels.
          </p>
          <TaskSignalPlot pca={diagnostics.taskPca} />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">PC1 explained</span>
              <strong className="mt-1 block text-xl text-slate-950">{(explainedVarianceRatio(diagnostics.taskPca) * 100).toFixed(1)}%</strong>
            </div>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-rose-700">Class gap on PC1</span>
              <strong className="mt-1 block text-xl text-rose-950">{diagnostics.pc1Gap.toFixed(2)}</strong>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-emerald-700">Class gap on PC2</span>
              <strong className="mt-1 block text-xl text-emerald-950">{diagnostics.pc2Gap.toFixed(2)}</strong>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Keeping only PC1 preserves almost all variance here while erasing the mean separation between the two labels. For supervised work, validate downstream performance instead of equating explained variance with usefulness.
          </p>
        </div>
      </div>
    </section>
  );
}
