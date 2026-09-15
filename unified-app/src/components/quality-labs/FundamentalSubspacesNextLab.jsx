import React, { useMemo } from 'react';

import { Note, NoteRow, Plate, Readouts, Steps } from '../../animations/_shared/notebook.jsx';
import { SUBSPACES_NEXT_DEFAULTS } from './linearAlgebraNextConstants.js';
import { buildFundamentalSubspaces } from './linearAlgebraNextModel.js';
import LinearAlgebraMatrix from './LinearAlgebraMatrix.jsx';

const formatVector = (vector) => `[${vector.map((value) => Number(value).toFixed(Number.isInteger(value) ? 0 : 2)).join(', ')}]`;
const formatBasis = (basis) => basis.length ? basis.map(formatVector).join(' , ') : '{0 only}';

export default function FundamentalSubspacesNextLab() {
  const lab = useMemo(() => buildFundamentalSubspaces(SUBSPACES_NEXT_DEFAULTS.matrix), []);
  const steps = lab.steps.slice(0, 8).map((body, index) => ({ title: `Row operation ${index + 1}`, body }));

  return (
    <>
      <Plate
        label="Worked row reduction"
        title="One RREF exposes all four fundamental subspaces"
        note="Pivot columns come from the original matrix for Col(A); nonzero rows of RREF span Row(A); free variables generate N(A); repeat on Aᵀ for N(Aᵀ)."
      >
        <Readouts columns={4} items={[
          { label: 'rank(A)', value: lab.rank, detail: 'pivot columns' },
          { label: 'dim Col(A)', value: lab.dimensions.columnSpace, detail: 'rank' },
          { label: 'dim N(A)', value: lab.dimensions.nullSpace, detail: 'n − rank' },
          { label: 'dim N(Aᵀ)', value: lab.dimensions.leftNullSpace, detail: 'm − rank' },
        ]} />
        <div className="grid gap-6 md:grid-cols-2">
          <LinearAlgebraMatrix label="A" matrix={lab.matrix} />
          <LinearAlgebraMatrix label="RREF(A)" matrix={lab.rref} />
        </div>
        <Steps items={steps} />
      </Plate>

      <Plate label="Derived bases" title="The dimensions and bases tell the same rank-nullity story">
        <NoteRow>
          <Note title="Column space">Original pivot columns: {formatBasis(lab.columnBasis)}.</Note>
          <Note title="Row space">Nonzero RREF rows: {formatBasis(lab.rowBasis)}.</Note>
        </NoteRow>
        <NoteRow>
          <Note tone="accent" title="Null space">Free-variable basis: {formatBasis(lab.nullBasis)}. Every vector here maps to zero under A.</Note>
          <Note tone="accent" title="Left null space">N(Aᵀ) basis: {formatBasis(lab.leftNullBasis)}. These vectors are orthogonal to every column of A.</Note>
        </NoteRow>
        <Note tone="good" title="Dimension checks">
          rank + nullity = {lab.rank} + {lab.dimensions.nullSpace} = {lab.matrix[0].length}, while rank + left-nullity = {lab.rank} + {lab.dimensions.leftNullSpace} = {lab.matrix.length}.
        </Note>
      </Plate>
    </>
  );
}
