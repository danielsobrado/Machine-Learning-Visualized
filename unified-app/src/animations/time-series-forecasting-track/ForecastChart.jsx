import React, { useMemo } from 'react';

const VIEWBOX = { width: 920, height: 320 };
const MARGIN = { top: 22, right: 24, bottom: 42, left: 58 };
const Y_PADDING = 0.08;

function buildPath(points, xScale, yScale) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xScale(point.index).toFixed(2)} ${yScale(point.value).toFixed(2)}`)
    .join(' ');
}

export default function ForecastChart({ series, origin, forecast, modelLabel }) {
  const chart = useMemo(() => {
    const values = [...series, ...forecast].map((point) => point.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const span = Math.max(1, rawMax - rawMin);
    const minY = rawMin - span * Y_PADDING;
    const maxY = rawMax + span * Y_PADDING;
    const plotWidth = VIEWBOX.width - MARGIN.left - MARGIN.right;
    const plotHeight = VIEWBOX.height - MARGIN.top - MARGIN.bottom;
    const maxIndex = series.length - 1;
    const xScale = (index) => MARGIN.left + (index / maxIndex) * plotWidth;
    const yScale = (value) => MARGIN.top + ((maxY - value) / (maxY - minY)) * plotHeight;
    const forecastWithAnchor = [series[origin - 1], ...forecast];

    return {
      minY,
      maxY,
      plotHeight,
      splitX: xScale(origin - 0.5),
      actualPath: buildPath(series, xScale, yScale),
      forecastPath: buildPath(forecastWithAnchor, xScale, yScale),
      xScale,
      yScale,
    };
  }, [forecast, origin, series]);

  const xTicks = [0, Math.floor(origin / 2), origin, series.length - 1];
  const yTicks = [chart.minY, (chart.minY + chart.maxY) / 2, chart.maxY];

  return (
    <figure className="mt-4" aria-label={`Observed series and ${modelLabel} forecast`}>
      <svg
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        className="w-full min-w-[640px]"
        role="img"
        aria-labelledby="forecast-chart-title forecast-chart-desc"
      >
        <title id="forecast-chart-title">Chronological holdout forecast</title>
        <desc id="forecast-chart-desc">
          The black line is the observed series. The orange line starts at the forecast origin and shows the selected model over the untouched holdout window.
        </desc>

        <g className="text-slate-100 fill-current">
          <rect
            x={chart.splitX}
            y={MARGIN.top}
            width={VIEWBOX.width - MARGIN.right - chart.splitX}
            height={chart.plotHeight}
          />
        </g>

        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              x2={VIEWBOX.width - MARGIN.right}
              y1={chart.yScale(tick)}
              y2={chart.yScale(tick)}
              className="stroke-slate-200"
              strokeWidth="1"
            />
            <text
              x={MARGIN.left - 10}
              y={chart.yScale(tick) + 4}
              textAnchor="end"
              className="fill-slate-500 text-[11px]"
            >
              {tick.toFixed(0)}
            </text>
          </g>
        ))}

        {xTicks.map((tick) => (
          <text
            key={tick}
            x={chart.xScale(tick)}
            y={VIEWBOX.height - 14}
            textAnchor="middle"
            className="fill-slate-500 text-[11px]"
          >
            t={tick}
          </text>
        ))}

        <line
          x1={chart.splitX}
          x2={chart.splitX}
          y1={MARGIN.top}
          y2={VIEWBOX.height - MARGIN.bottom}
          className="stroke-slate-500"
          strokeDasharray="5 5"
          strokeWidth="1.5"
        />
        <text
          x={chart.splitX + 8}
          y={MARGIN.top + 14}
          className="fill-slate-600 text-[11px] font-medium"
        >
          forecast origin
        </text>

        <path
          d={chart.actualPath}
          fill="none"
          className="stroke-slate-900"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={chart.forecastPath}
          fill="none"
          className="stroke-orange-500"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
        <span><b className="text-slate-900">Observed</b> — all values, including the holdout revealed only for scoring</span>
        <span><b className="text-orange-600">{modelLabel}</b> — prediction made from data left of the split</span>
      </figcaption>
    </figure>
  );
}
