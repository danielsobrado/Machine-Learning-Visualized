import React from 'react';
import { AlertTriangle, CheckCircle2, Gauge, ShieldAlert } from 'lucide-react';
import { formatParameters } from './calibrationRecalibration.js';

function MetricCard({ label, reference, raw, calibrated, formatter }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="block text-[10px] font-black uppercase tracking-wide text-slate-400">Reference</span>
          <strong className="mt-1 block text-lg text-slate-800">{formatter(reference)}</strong>
        </div>
        <div>
          <span className="block text-[10px] font-black uppercase tracking-wide text-rose-500">Live raw</span>
          <strong className="mt-1 block text-lg text-rose-700">{formatter(raw)}</strong>
        </div>
        <div>
          <span className="block text-[10px] font-black uppercase tracking-wide text-cyan-600">After</span>
          <strong className="mt-1 block text-lg text-cyan-800">{formatter(calibrated)}</strong>
        </div>
      </div>
    </div>
  );
}

function DiagnosticBanner({ diagnostic }) {
  const config = {
    stable: {
      icon: CheckCircle2,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
      eyebrow: 'Stable enough',
    },
    'calibration-drift': {
      icon: Gauge,
      className: 'border-amber-200 bg-amber-50 text-amber-950',
      eyebrow: 'Recalibration candidate',
    },
    'model-drift': {
      icon: ShieldAlert,
      className: 'border-rose-200 bg-rose-50 text-rose-950',
      eyebrow: 'Do not hide this with calibration',
    },
  }[diagnostic.severity];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-4 ${config.className}`}>
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide"><Icon size={15} /> {config.eyebrow}</p>
      <strong className="mt-2 block text-base">{diagnostic.title}</strong>
      <p className="mt-1 text-sm leading-6">{diagnostic.detail}</p>
    </div>
  );
}

export default function CalibrationDiagnostics({ referenceMetrics, rawMetrics, calibratedMetrics, diagnostic, method, parameters }) {
  const percent = (value) => `${(value * 100).toFixed(1)}%`;
  const decimal = (value) => value.toFixed(3);

  return (
    <section className="space-y-4">
      <DiagnosticBanner diagnostic={diagnostic} />

      <div className="grid gap-3 md:grid-cols-2">
        <MetricCard
          label="ECE ↓"
          reference={referenceMetrics.ece}
          raw={rawMetrics.ece}
          calibrated={calibratedMetrics.ece}
          formatter={percent}
        />
        <MetricCard
          label="Brier score ↓"
          reference={referenceMetrics.brier}
          raw={rawMetrics.brier}
          calibrated={calibratedMetrics.brier}
          formatter={decimal}
        />
        <MetricCard
          label="Log loss ↓"
          reference={referenceMetrics.logLoss}
          raw={rawMetrics.logLoss}
          calibrated={calibratedMetrics.logLoss}
          formatter={decimal}
        />
        <MetricCard
          label="Grouped AUC ↑"
          reference={referenceMetrics.auc}
          raw={rawMetrics.auc}
          calibrated={calibratedMetrics.auc}
          formatter={decimal}
        />
        <MetricCard
          label="Observed base rate"
          reference={referenceMetrics.baseRate}
          raw={rawMetrics.baseRate}
          calibrated={calibratedMetrics.baseRate}
          formatter={percent}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Fitted mapping</p>
        <strong className="mt-1 block font-mono text-sm text-slate-950">{formatParameters(method, parameters)}</strong>
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
          This mapping is fitted on a separate labeled calibration sample. Every metric above is then computed on a different live holdout sample.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800">
          <AlertTriangle size={14} /> Metric trap
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-950">
          ECE depends on binning and can look better after aggressive post-processing. Check a proper scoring rule and discrimination too; a lower ECE cannot repair lost ranking.
        </p>
      </div>
    </section>
  );
}
