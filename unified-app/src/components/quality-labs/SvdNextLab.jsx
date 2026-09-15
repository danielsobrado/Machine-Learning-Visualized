import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { SVD_NEXT_DEFAULTS } from './linearAlgebraNextConstants.js';
import { buildSvdApproximation } from './linearAlgebraNextModel.js';
import LinearAlgebraMatrix from './LinearAlgebraMatrix.jsx';

const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function SvdNextLab() {
  const [sigma1, setSigma1] = useState(SVD_NEXT_DEFAULTS.sigma1);
  const [sigma2, setSigma2] = useState(SVD_NEXT_DEFAULTS.sigma2);
  const lab = useMemo(() => buildSvdApproximation({
    ...SVD_NEXT_DEFAULTS,
    sigma1,
    sigma2,
  }), [sigma1, sigma2]);
  const updateSigma1 = (value) => {
    setSigma1(value);
    setSigma2((current) => Math.min(current, value));
  };

  return (
    <>
      <Plate
        label="Low-rank approximation"
        title="Discarding a singular direction gives a measurable reconstruction price"
        note="Keep the singular vectors fixed and change only the singular values. The best rank-1 approximation keeps σ₁ and discards σ₂."
      >
        <ControlBench label="Singular spectrum">
          <Slider label="σ₁" value={sigma1} min={2} max={10} step={0.5} onChange={updateSigma1} format={(value) => value.toFixed(1)} />
          <Slider label="σ₂" value={sigma2} min={0} max={sigma1} step={0.5} onChange={setSigma2} format={(value) => value.toFixed(1)} />
        </ControlBench>
        <Readouts columns={4} items={[
          { label: 'σ₁', value: lab.singularValues[0].toFixed(2), detail: 'kept direction' },
          { label: 'σ₂', value: lab.singularValues[1].toFixed(2), detail: 'discarded direction' },
          { label: 'Rank-1 Frobenius error', value: lab.rank1Error.toFixed(3), detail: 'equals discarded σ₂ here' },
          { label: 'Energy retained', value: pct(lab.energyRetained), detail: 'σ₁² / (σ₁² + σ₂²)' },
        ]} />
        <div className="grid gap-6 md:grid-cols-2">
          <LinearAlgebraMatrix label="Original A" matrix={lab.matrix} />
          <LinearAlgebraMatrix label="Best rank-1 A₁" matrix={lab.rank1} />
        </div>
      </Plate>

      <Plate label="Compression logic" title="Rank choice is a trade-off, not a magic threshold">
        <NoteRow>
          <Note tone="good" title="Small σ₂">Rank 1 preserves most matrix energy and the visual reconstruction changes little.</Note>
          <Note tone="warn" title="Large σ₂">The second direction carries real structure; dropping it saves rank but creates a correspondingly large error.</Note>
        </NoteRow>
        <Note tone="accent" title="Eckart–Young connection">
          For Frobenius or spectral norm, truncating the SVD gives the optimal rank-k approximation. The singular spectrum tells you exactly what information the truncation throws away.
        </Note>
      </Plate>
    </>
  );
}
