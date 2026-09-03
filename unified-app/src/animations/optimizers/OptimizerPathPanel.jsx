import React from 'react';
import { Activity, TrendingDown } from 'lucide-react';
import { gradientNoiseScale, l2Norm, loss, lossColor, project } from './optimizerModel.js';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function buildContourCells() {
  const cells = [];
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 11; col += 1) {
      const x = -5.5 + col * 0.55;
      const y = -0.2 + row * 0.65;
      cells.push({ x: 60 + col * 42, y: 62 + row * 38, color: lossColor(loss([x, y])) });
    }
  }
  return cells;
}

const CONTOUR_CELLS = buildContourCells();

export default function OptimizerPathPanel({ path, batchSize }) {
  const finalPoint = path.at(-1);
  const bestPoint = path.reduce((best, point) => (point.loss < best.loss ? point : best), path[0]);
  const startLoss = path[0].loss;
  const improvement = 1 - (finalPoint.loss / startLoss);
  const lastUpdateNorm = l2Norm(finalPoint.update);
  const recentSteps = path.slice(1).slice(-8);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Final loss" value={finalPoint.loss.toFixed(4)} detail={`started at ${startLoss.toFixed(3)}`} />
        <Stat label="Best loss" value={bestPoint.loss.toFixed(4)} detail={`step ${bestPoint.step}`} />
        <Stat label="Improvement" value={`${Math.round(improvement * 100)}%`} detail="training objective only" />
        <Stat label="Noise scale" value={gradientNoiseScale(batchSize).toFixed(3)} detail="falls as 1/√batch" />
        <Stat label="Last update norm" value={lastUpdateNorm.toFixed(4)} detail="parameter movement" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <TrendingDown size={16} />
            Selected optimizer path
          </h3>
          <svg viewBox="0 0 540 360" className="mt-4 h-auto w-full rounded-xl border border-slate-200 bg-slate-50" role="img" aria-label="Selected optimizer path on an anisotropic quadratic loss surface">
            {CONTOUR_CELLS.map((cell) => (
              <rect key={`${cell.x}-${cell.y}`} x={cell.x} y={cell.y} width="42" height="38" fill={cell.color} opacity="0.8" />
            ))}
            <path
              d={path.map((point, index) => {
                const { cx, cy } = project(point.theta);
                return `${index === 0 ? 'M' : 'L'} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {path.map((point, index) => {
              const { cx, cy } = project(point.theta);
              return <circle key={point.step} cx={cx} cy={cy} r={index === path.length - 1 ? 7 : 4} fill={index === path.length - 1 ? '#0f172a' : '#2563eb'} />;
            })}
            <circle cx={project([-3, 1]).cx} cy={project([-3, 1]).cy} r="8" fill="#059669" />
            <text x={project([-3, 1]).cx + 12} y={project([-3, 1]).cy + 4} className="fill-slate-700 text-xs font-bold">minimum</text>
          </svg>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Activity size={16} />
            Recent update ledger
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Gradient norm and update norm are different diagnostics once optimizer state rescales the raw gradient.</p>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-3 py-2">Step</th><th className="px-3 py-2">||g||₂</th><th className="px-3 py-2">||Δθ||₂</th><th className="px-3 py-2">Loss</th></tr>
              </thead>
              <tbody>
                {recentSteps.map((point) => (
                  <tr key={point.step} className="border-t border-slate-200">
                    <td className="px-3 py-2 font-black">{point.step}</td>
                    <td className="px-3 py-2 font-mono">{l2Norm(point.grad).toFixed(3)}</td>
                    <td className="px-3 py-2 font-mono">{l2Norm(point.update).toFixed(3)}</td>
                    <td className="px-3 py-2 font-mono">{point.loss.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
