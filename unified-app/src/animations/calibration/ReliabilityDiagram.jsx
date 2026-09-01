import React from 'react';

const CHART = Object.freeze({
  width: 460,
  height: 330,
  left: 50,
  right: 24,
  top: 28,
  bottom: 50,
});

function xPosition(probability) {
  const plotWidth = CHART.width - CHART.left - CHART.right;
  return CHART.left + probability * plotWidth;
}

function yPosition(probability) {
  const plotHeight = CHART.height - CHART.top - CHART.bottom;
  return CHART.top + (1 - probability) * plotHeight;
}

function linePoints(bins) {
  return bins.map((bin) => `${xPosition(bin.confidence)},${yPosition(bin.observed)}`).join(' ');
}

function Series({ bins, stroke, fill, dashed = false }) {
  return (
    <>
      <polyline
        points={linePoints(bins)}
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeDasharray={dashed ? '7 6' : undefined}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {bins.map((bin, index) => (
        <circle
          key={`${bin.confidence}-${index}`}
          cx={xPosition(bin.confidence)}
          cy={yPosition(bin.observed)}
          r={5 + Math.min(4, bin.count / 12)}
          fill={fill}
          stroke="#ffffff"
          strokeWidth="2.5"
        />
      ))}
    </>
  );
}

export default function ReliabilityDiagram({ referenceBins, rawBins, calibratedBins, methodLabel, showCalibrated }) {
  const plotWidth = CHART.width - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Holdout reliability</p>
          <h3 className="mt-1 text-lg font-black text-slate-950">Reference vs live probabilities</h3>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">{methodLabel}</span>
      </div>

      <svg
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        role="img"
        aria-label="Reliability diagram comparing reference, live raw, and recalibrated probabilities"
        className="mt-4 h-auto w-full"
      >
        <rect x={CHART.left} y={CHART.top} width={plotWidth} height={plotHeight} rx="10" fill="#f8fafc" />
        {[0.25, 0.5, 0.75].map((value) => (
          <g key={value}>
            <line
              x1={xPosition(value)}
              x2={xPosition(value)}
              y1={CHART.top}
              y2={CHART.top + plotHeight}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
            <line
              x1={CHART.left}
              x2={CHART.left + plotWidth}
              y1={yPosition(value)}
              y2={yPosition(value)}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
          </g>
        ))}
        <line
          x1={xPosition(0)}
          y1={yPosition(0)}
          x2={xPosition(1)}
          y2={yPosition(1)}
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
        <Series bins={referenceBins} stroke="#64748b" fill="#94a3b8" dashed />
        <Series bins={rawBins} stroke="#e11d48" fill="#e11d48" />
        {showCalibrated ? <Series bins={calibratedBins} stroke="#0891b2" fill="#0891b2" /> : null}

        {[0, 0.5, 1].map((value) => (
          <g key={`label-${value}`}>
            <text x={xPosition(value)} y={CHART.height - 28} textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">
              {value.toFixed(1)}
            </text>
            <text x={CHART.left - 12} y={yPosition(value) + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
              {value.toFixed(1)}
            </text>
          </g>
        ))}
        <text x={CHART.width / 2} y={CHART.height - 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">
          predicted probability
        </text>
        <text
          x="15"
          y={CHART.height / 2}
          textAnchor="middle"
          transform={`rotate(-90 15 ${CHART.height / 2})`}
          fontSize="12"
          fontWeight="800"
          fill="#475569"
        >
          observed positive rate
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-slate-600">
        <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 bg-slate-500" />reference</span>
        <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 bg-rose-600" />live raw</span>
        {showCalibrated ? <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 bg-cyan-600" />live recalibrated</span> : null}
        <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 border-t-2 border-dashed border-slate-400" />perfect calibration</span>
      </div>
    </section>
  );
}
