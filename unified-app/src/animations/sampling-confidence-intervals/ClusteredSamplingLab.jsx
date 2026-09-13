import React, { useMemo, useState } from 'react';
import { Formula, Note, Plate, Readouts, Slider, Steps } from '../_shared/notebook';
import { CLUSTER_DEFAULTS, CLUSTER_LIMITS } from './clusteredSamplingConstants.js';
import { buildClusteredSamplingLab } from './clusteredSamplingModel.js';

const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

export default function ClusteredSamplingLab() {
  const [settings, setSettings] = useState(CLUSTER_DEFAULTS);
  const lab = useMemo(() => buildClusteredSamplingLab(settings), [settings]);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  return (
    <Plate label="5 · Independence failure" title="1,000 rows are not always 1,000 independent observations">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <Slider
            label="Event rate"
            value={settings.eventRate}
            {...CLUSTER_LIMITS.eventRate}
            format={(value) => pct(value)}
            onChange={(value) => update('eventRate', value)}
          />
          <Slider
            label="Clusters"
            value={settings.clusterCount}
            {...CLUSTER_LIMITS.clusterCount}
            onChange={(value) => update('clusterCount', value)}
          />
          <Slider
            label="Rows per cluster"
            value={settings.observationsPerCluster}
            {...CLUSTER_LIMITS.observationsPerCluster}
            onChange={(value) => update('observationsPerCluster', value)}
          />
          <Slider
            label="Within-cluster correlation ρ"
            value={settings.intraclassCorrelation}
            {...CLUSTER_LIMITS.intraclassCorrelation}
            format={(value) => value.toFixed(2)}
            onChange={(value) => update('intraclassCorrelation', value)}
          />
        </div>

        <div>
          <Readouts columns={3} items={[
            { label: 'Rows in table', value: lab.totalRows.toLocaleString(), detail: 'what naive code may count as n' },
            { label: 'Design effect', value: lab.designEffect.toFixed(2), detail: '1 + (m−1)ρ' },
            { label: 'Effective n', value: lab.effectiveSampleSize.toFixed(0), detail: `${lab.independentUnits} independent clusters` },
            { label: 'Naive SE', value: pct(lab.naiveSe, 2), detail: 'pretends every row is independent' },
            { label: 'Cluster-aware SE', value: pct(lab.clusterAwareSe, 2), detail: `${lab.standardErrorInflation.toFixed(2)}× larger` },
            { label: 'Effective rows lost', value: lab.lostEffectiveRows.toFixed(0), detail: 'redundancy from within-cluster similarity' },
          ]} />

          <div className="mt-5 space-y-3">
            <IntervalBar label="Naive 95% interval" interval={lab.naiveInterval} center={settings.eventRate} tone="bg-rose-500" />
            <IntervalBar label="Cluster-aware 95% interval" interval={lab.clusterAwareInterval} center={settings.eventRate} tone="bg-emerald-500" />
          </div>
        </div>
      </div>

      <Formula lines={[
        'design effect = 1 + (m − 1)ρ',
        'effective n = total rows / design effect',
        'SE_clustered ≈ SE_naive × √(design effect)',
      ]} />

      <Steps items={[
        {
          title: 'Set ρ = 0',
          pass: settings.intraclassCorrelation === 0,
          body: settings.intraclassCorrelation === 0
            ? 'Rows behave independently, so effective n equals the row count.'
            : 'Positive within-cluster correlation means repeated rows contain overlapping information.',
        },
        {
          title: 'Increase rows per cluster',
          pass: settings.observationsPerCluster >= 20 && settings.intraclassCorrelation > 0,
          body: 'More repeated measurements do add information, but much less than the same number of independent clusters.',
        },
        {
          title: 'Match the analysis unit to the independence unit',
          pass: true,
          body: 'Users, patients, stores, households, classrooms, or time blocks may be the independent units even when the dataset has many more rows.',
        },
      ]} />

      <Note tone="accent" label="Bootstrap warning" title="Resample the independent unit">
        <p>Row-level bootstrap resampling breaks cluster dependence and usually understates uncertainty. If users are independent but each user contributes many rows, resample users and keep each selected user&apos;s rows together.</p>
      </Note>
    </Plate>
  );
}

function IntervalBar({ label, interval, center, tone }) {
  const left = Math.max(0, Math.min(100, interval.low * 100));
  const width = Math.max(0.8, (interval.high - interval.low) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-xs font-bold text-slate-600">
        <span>{label}</span>
        <span>{pct(interval.low)} to {pct(interval.high)}</span>
      </div>
      <div className="relative h-7 overflow-hidden rounded bg-slate-100">
        <div className={`absolute top-2 h-3 rounded ${tone}`} style={{ left: `${left}%`, width: `${width}%` }} />
        <div className="absolute top-0 h-full w-0.5 bg-slate-950" style={{ left: `${center * 100}%` }} />
      </div>
    </div>
  );
}
