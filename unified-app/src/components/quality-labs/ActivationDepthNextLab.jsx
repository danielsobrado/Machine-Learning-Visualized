import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { ACTIVATION_CHAIN_DEFAULTS, ACTIVATION_FAMILY_DEFAULTS } from './neuralCnnNextConstants.js';
import { activationFamilyPoint, buildActivationChainComparison } from './neuralCnnNextModel.js';

const formatGradient = (value) => (Math.abs(value) < 0.001 ? value.toExponential(2) : value.toFixed(4));

function GradientProblemsNextLab() {
  const [depth, setDepth] = useState(ACTIVATION_CHAIN_DEFAULTS.depth);
  const rows = useMemo(() => buildActivationChainComparison({ depth }), [depth]);

  return (
    <>
      <Plate
        label="Activation gradient presets"
        title="The same depth can be healthy, vanishing, or completely dead"
        note="Hold network depth fixed and compare the product of local activation derivatives."
      >
        <ControlBench>
          <Slider label="Chain depth" value={depth} min={2} max={24} step={1} onChange={setDepth} format={(value) => `${value} layers`} />
        </ControlBench>
        <Readouts columns={5} items={rows.map((row) => ({
          label: row.label,
          value: formatGradient(row.finalGradient),
          detail: `local slope ${row.localDerivative.toFixed(4)}`,
        }))} />
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-3 py-2">Preset</th><th className="px-3 py-2">z</th><th className="px-3 py-2">local derivative</th><th className="px-3 py-2">gradient after depth</th><th className="px-3 py-2">diagnosis</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-3 py-2 font-black">{row.label}</td>
                  <td className="px-3 py-2 font-mono">{row.z}</td>
                  <td className="px-3 py-2 font-mono">{row.localDerivative.toFixed(5)}</td>
                  <td className="px-3 py-2 font-mono">{formatGradient(row.finalGradient)}</td>
                  <td className="px-3 py-2">{row.finalGradient === 0 ? 'dead path' : row.finalGradient < 0.01 ? 'vanishing' : 'gradient survives'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Plate>
      <Plate label="Diagnosis" title="Activation choice changes the chain rule before clipping ever runs">
        <NoteRow>
          <Note title="Saturation">Sigmoid and tanh can have non-zero local derivatives that still multiply into an unusably small global gradient.</Note>
          <Note title="Dead ReLU">A negative ReLU contributes an exact zero local derivative, cutting the path rather than merely shrinking it.</Note>
        </NoteRow>
        <Note tone="accent" title="GELU is not immunity">A smoother nonlinearity can preserve more gradient around its transition region, but depth still multiplies local Jacobians. Initialization, residual paths, and normalization still matter.</Note>
      </Plate>
    </>
  );
}

function LeakyReluNextLab() {
  const [x, setX] = useState(ACTIVATION_FAMILY_DEFAULTS.x);
  const [preluSlope, setPreluSlope] = useState(ACTIVATION_FAMILY_DEFAULTS.preluSlope);
  const point = useMemo(() => activationFamilyPoint({ ...ACTIVATION_FAMILY_DEFAULTS, x, preluSlope }), [preluSlope, x]);
  const items = [
    ['ReLU', point.relu],
    ['Leaky ReLU', point.leakyRelu],
    ['PReLU', point.prelu],
    ['ELU', point.elu],
  ];

  return (
    <>
      <Plate label="Negative branch families" title="Fixed leak, learned leak, and smooth saturation are different design choices">
        <ControlBench>
          <Slider label="Input x" value={x} min={-4} max={2} step={0.1} onChange={setX} format={(value) => value.toFixed(1)} />
          <Slider label="PReLU learned slope" value={preluSlope} min={0} max={0.6} step={0.05} onChange={setPreluSlope} format={(value) => value.toFixed(2)} />
        </ControlBench>
        <Readouts columns={4} items={items.map(([label, result]) => ({
          label,
          value: result.value.toFixed(3),
          detail: `dy/dx = ${result.derivative.toFixed(3)}`,
        }))} />
      </Plate>
      <Plate label="Trade-off" title="Preserving a gradient does not make the activations equivalent">
        <NoteRow>
          <Note title="Leaky ReLU">Uses a fixed negative slope. It is cheap and guarantees a non-zero negative-side gradient.</Note>
          <Note title="PReLU">Learns that slope from data, adding flexibility and a small number of parameters.</Note>
          <Note title="ELU">Uses a smooth negative branch that saturates toward −α instead of remaining linear.</Note>
        </NoteRow>
      </Plate>
    </>
  );
}

export default function ActivationDepthNextLab({ lessonId }) {
  if (lessonId === 'gradient-problems') return <GradientProblemsNextLab />;
  if (lessonId === 'leaky-relu') return <LeakyReluNextLab />;
  return null;
}
