import React, { useMemo, useState } from 'react';
import { AudioLines, Clock, Film, Grid3X3, Layers, Network, Speech } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { OMNI_DEFAULTS, OMNI_PRESETS } from './omniConfig';
import { buildOmniLab } from './omniModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function formatCount(value) {
  return Math.round(value).toLocaleString();
}

export default function OmniMultimodalArchitecturesAnimation() {
  const [presetId, setPresetId] = useState(OMNI_DEFAULTS.presetId);
  const [fusionQueries, setFusionQueries] = useState(OMNI_DEFAULTS.fusionQueries);
  const [speechFrameMs, setSpeechFrameMs] = useState(OMNI_DEFAULTS.speechFrameMs);
  const [speechCodebooks, setSpeechCodebooks] = useState(OMNI_DEFAULTS.speechCodebooks);
  const preset = OMNI_PRESETS.find((item) => item.id === presetId);
  const lab = useMemo(
    () => buildOmniLab({ preset, fusionQueries, speechFrameMs, speechCodebooks }),
    [preset, fusionQueries, speechFrameMs, speechCodebooks],
  );

  const streams = [
    ['Text', lab.textTokens, Layers],
    ['Image patches', lab.imageTokens, Grid3X3],
    ['Video patches', lab.videoTokens, Film],
    ['Audio frames', lab.audioTokens, AudioLines],
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-fuchsia-700">Multimodal architecture</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Omni models: count the streams before judging the system</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Text, image patches, sampled video frames, and acoustic frames all become model inputs, but their token rates are very different.
          This lab computes token geometry, attention work, time alignment, and speech-codec output exactly from the selected toy architecture.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {OMNI_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPresetId(item.id)}
              className={`rounded-lg border p-3 text-left ${presetId === item.id ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Fusion query tokens: {fusionQueries}
            <input type="range" min="8" max="128" step="8" value={fusionQueries} onChange={(event) => setFusionQueries(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Speech codec frame: {speechFrameMs} ms
            <input type="range" min="10" max="40" step="5" value={speechFrameMs} onChange={(event) => setSpeechFrameMs(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Speech codebooks: {speechCodebooks}
            <input type="range" min="1" max="16" step="1" value={speechCodebooks} onChange={(event) => setSpeechCodebooks(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="Input tokens" value={formatCount(lab.totalInputTokens)} detail="toy unified stream" />
        <Metric label="Video frames" value={formatCount(lab.videoFrames)} detail={`${preset.videoFps || 0} sampled fps`} />
        <Metric label="Speech tokens" value={formatCount(lab.speechTokens)} detail="codec frame × codebooks" />
        <Metric label="Early-fusion pairs" value={formatCount(lab.fusion.earlyFusionPairs)} detail="causal attention score cells" />
        <Metric label="Early / late work" value={`${lab.earlyToLateRatio.toFixed(2)}×`} detail="defined toy fusion layouts" />
      </div>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Layers size={16} /> Modality token ledger</h3>
          <div className="mt-4 space-y-3">
            {streams.map(([label, count, Icon]) => (
              <div key={label} className="grid grid-cols-[150px_1fr_90px] items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-800"><Icon size={15} /> {label}</span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-fuchsia-500" style={{ width: `${lab.totalInputTokens ? Math.max(1, (count / lab.totalInputTokens) * 100) : 0}%` }} />
                </div>
                <span className="text-right font-mono text-xs text-slate-600">{formatCount(count)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Image tokens are <strong>ceil(width / patch) × ceil(height / patch)</strong>. Video multiplies that patch count by sampled frames.
            Audio and speech token counts come from explicit frame rates and codebook counts. None of these counts imply model quality.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Network size={16} /> Fusion work decomposition</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p><strong>Early fusion:</strong> concatenate all modality tokens, then causal self-attention costs {formatCount(lab.fusion.earlyFusionPairs)} score cells.</p>
            <p><strong>Late/bottleneck toy:</strong> per-stream self-attention + {fusionQueries} fusion queries cross-attending to all streams costs {formatCount(lab.fusion.lateFusionPairs)} cells.</p>
            <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-4 font-mono text-sm text-fuchsia-950">
              late = {formatCount(lab.fusion.separatePairs)} stream + {formatCount(lab.fusion.crossAttentionPairs)} cross + {formatCount(lab.fusion.fusionSelfPairs)} fusion-self
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-cyan-700"><Clock size={15} /> Time alignment</strong>
          {lab.alignment.matches.length
            ? <>Nearest audio/video timestamp error: mean {(lab.alignment.meanSeconds * 1000).toFixed(1)} ms, max {(lab.alignment.maxSeconds * 1000).toFixed(1)} ms.</>
            : <>This preset has no simultaneous audio/video stream to align.</>}
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-700"><Film size={15} /> Video explosion</strong>
          Spatial patching happens for every sampled frame. Doubling sampled FPS doubles video tokens before any learned compression.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-700"><Speech size={15} /> Thinker → Talker</strong>
          Speech output is modeled as codec tokens generated from a speech head. The token ledger does not pretend a lower count means better speech.
        </div>
      </section>

      <AssessmentPanel lessonId="omni-multimodal-architectures" title="Omni multimodal architecture check" />
    </div>
  );
}
