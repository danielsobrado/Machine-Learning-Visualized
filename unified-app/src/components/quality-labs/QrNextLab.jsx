import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { QR_NEXT_DEFAULTS } from './linearAlgebraNextConstants.js';
import { buildQrStabilityLab } from './linearAlgebraNextModel.js';
import LinearAlgebraMatrix from './LinearAlgebraMatrix.jsx';

export default function QrNextLab() {
  const [nearCollinearExponent, setNearCollinearExponent] = useState(QR_NEXT_DEFAULTS.nearCollinearExponent);
  const lab = useMemo(() => buildQrStabilityLab({ nearCollinearExponent }), [nearCollinearExponent]);
  const ratio = lab.classical.orthogonalityError / Math.max(lab.householder.orthogonalityError, Number.EPSILON);

  return (
    <>
      <Plate
        label="Numerical stability"
        title="QR can be mathematically equivalent and numerically very different"
        note="Push three columns toward collinearity. Classical Gram–Schmidt subtracts nearly equal projections; Householder reflections transform the whole trailing matrix instead."
      >
        <ControlBench label="Near-collinearity">
          <Slider
            label="ε = 10⁻ᵏ"
            value={nearCollinearExponent}
            min={2}
            max={6}
            step={1}
            onChange={setNearCollinearExponent}
            format={(value) => `10^-${value}`}
          />
        </ControlBench>
        <Readouts columns={4} items={[
          { label: 'ε', value: lab.epsilon.toExponential(0), detail: 'column separation scale' },
          { label: 'Classical QᵀQ error', value: lab.classical.orthogonalityError.toExponential(2), detail: 'loss of orthogonality' },
          { label: 'Householder QᵀQ error', value: lab.householder.orthogonalityError.toExponential(2), detail: 'loss of orthogonality' },
          { label: 'Stability ratio', value: `${ratio.toExponential(1)}×`, detail: 'classical / Householder error' },
        ]} />
        <div className="grid gap-6 lg:grid-cols-3">
          <LinearAlgebraMatrix label="Nearly dependent A" matrix={lab.matrix} />
          <LinearAlgebraMatrix label="Classical Q" matrix={lab.classical.Q} />
          <LinearAlgebraMatrix label="Householder Q" matrix={lab.householder.Q} />
        </div>
      </Plate>

      <Plate label="Mechanism" title="Orthogonality is the invariant worth checking">
        <NoteRow>
          <Note title="Classical Gram–Schmidt">Projects each new column against already-computed directions. Near dependence makes cancellation and accumulated roundoff visible in QᵀQ.</Note>
          <Note tone="good" title="Householder QR">Uses norm-preserving reflections and is the standard dense numerical choice when stable QR matters.</Note>
        </NoteRow>
        <Note tone="accent" title="Debugging rule">
          A tiny reconstruction error does not guarantee a good Q. Check QᵀQ ≈ I separately; an unstable basis can still multiply back to something close to A.
        </Note>
      </Plate>
    </>
  );
}
