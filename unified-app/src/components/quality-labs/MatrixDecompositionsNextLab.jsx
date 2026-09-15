import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { DECOMPOSITION_NEXT_DEFAULTS } from './linearAlgebraNextConstants.js';
import { buildDecompositionComparison } from './linearAlgebraNextModel.js';
import LinearAlgebraMatrix from './LinearAlgebraMatrix.jsx';

const METHODS = Object.freeze(['LU', 'QR', 'SVD', 'Cholesky']);
const USES = Object.freeze({
  LU: 'General square-system solves after pivoting.',
  QR: 'Least squares and orthogonal-basis construction.',
  SVD: 'Rank, conditioning, compression, and pseudoinverses.',
  Cholesky: 'Fast solves for symmetric positive-definite matrices.',
});

function factorEntries(method, factors) {
  if (method === 'SVD') return [['U', factors.U], ['Σ', factors.Sigma], ['Vᵀ', factors.Vt]];
  if (method === 'Cholesky') return [['L', factors.L], ['Lᵀ', factors.Lt]];
  return Object.entries(factors);
}

export default function MatrixDecompositionsNextLab() {
  const [offDiagonal, setOffDiagonal] = useState(DECOMPOSITION_NEXT_DEFAULTS.offDiagonal);
  const [method, setMethod] = useState('LU');
  const lab = useMemo(() => buildDecompositionComparison({
    ...DECOMPOSITION_NEXT_DEFAULTS,
    offDiagonal,
  }), [offDiagonal]);

  return (
    <>
      <Plate
        label="Same matrix, four lenses"
        title="A decomposition is useful because of what its factors expose"
        note="Keep the same symmetric positive-definite matrix fixed and compare LU, QR, SVD, and Cholesky numerically rather than treating them as unrelated formulas."
      >
        <ControlBench label="Matrix A = [[4, b], [b, 3]]">
          <Slider label="Off-diagonal b" value={offDiagonal} min={0.5} max={2.8} step={0.1} onChange={setOffDiagonal} format={(value) => value.toFixed(1)} />
          {METHODS.map((name) => (
            <button key={name} type="button" className={`nb-reset ${method === name ? 'is-active' : ''}`} onClick={() => setMethod(name)}>{name}</button>
          ))}
        </ControlBench>
        <Readouts columns={3} items={[
          { label: 'det(A)', value: lab.determinant.toFixed(3), detail: 'positive ⇒ SPD here' },
          { label: `${method} reconstruction error`, value: lab.errors[method].toExponential(2), detail: '‖A − reconstructed A‖F' },
          { label: 'Small singular value', value: lab.factors.SVD.singularValues[1].toFixed(3), detail: 'distance from singularity' },
        ]} />
        <div className="grid gap-6 lg:grid-cols-4">
          <LinearAlgebraMatrix label="Original A" matrix={lab.matrix} />
          {factorEntries(method, lab.factors[method]).map(([label, matrix]) => (
            <LinearAlgebraMatrix key={label} label={label} matrix={matrix} />
          ))}
        </div>
      </Plate>

      <Plate label="Selection rule" title="The factors answer different questions even when reconstruction is exact">
        <NoteRow>
          {METHODS.map((name) => (
            <Note key={name} tone={name === method ? 'accent' : 'neutral'} title={name}>{USES[name]}</Note>
          ))}
        </NoteRow>
        <Note tone="warn" title="Cholesky is not a generic replacement for LU">
          This example deliberately stays SPD so all four methods are legal. If symmetry or positive definiteness fails, the Cholesky option disappears even though LU, QR, or SVD may still be valid.
        </Note>
      </Plate>
    </>
  );
}
