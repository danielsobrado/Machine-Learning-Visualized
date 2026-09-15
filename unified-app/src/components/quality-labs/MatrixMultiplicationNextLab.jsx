import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { MULTIPLICATION_NEXT_DEFAULTS } from './linearAlgebraNextConstants.js';
import { buildRectangularMap, matrixProductShape } from './linearAlgebraNextModel.js';
import LinearAlgebraMatrix from './LinearAlgebraMatrix.jsx';

const formatVector = (vector) => `[${vector.map((value) => Number(value).toFixed(2)).join(', ')}]`;

export default function MatrixMultiplicationNextLab() {
  const [vector, setVector] = useState([...MULTIPLICATION_NEXT_DEFAULTS.vector]);
  const lab = useMemo(() => buildRectangularMap({
    matrix: MULTIPLICATION_NEXT_DEFAULTS.matrix,
    vector,
  }), [vector]);
  const compatible = matrixProductShape(2, 3, 3, 4);
  const incompatible = matrixProductShape(2, 3, 2, 4);
  const update = (index, value) => setVector((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));

  return (
    <>
      <Plate
        label="Rectangular linear map"
        title="A 2×3 matrix maps R³ inputs into R² outputs"
        note="Read Ax two ways at once: each output is a row dot-product, and the full output is a weighted sum of A's columns."
      >
        <ControlBench label="Input vector x">
          {vector.map((value, index) => (
            <Slider key={index} label={`x${index + 1}`} value={value} min={-3} max={3} step={0.25} onChange={(next) => update(index, next)} format={(next) => next.toFixed(2)} />
          ))}
        </ControlBench>
        <Readouts columns={3} items={[
          { label: 'Input space', value: `R${lab.inputDimension}`, detail: `${lab.inputDimension} matrix columns` },
          { label: 'Output space', value: `R${lab.outputDimension}`, detail: `${lab.outputDimension} matrix rows` },
          { label: 'Ax', value: formatVector(lab.output), detail: 'row-dot and column-sum views agree' },
        ]} />
        <div className="grid gap-6 md:grid-cols-2">
          <LinearAlgebraMatrix label="A" matrix={lab.matrix} />
          <LinearAlgebraMatrix label="x as a column" matrix={vector.map((value) => [value])} />
        </div>
      </Plate>

      <Plate label="Two equivalent views" title="Rows measure; columns build">
        <NoteRow>
          {lab.rowDots.map((item, index) => (
            <Note key={index} title={`Row ${index + 1} · x = ${item.value.toFixed(2)}`}>{formatVector(item.row)} dotted with {formatVector(vector)}.</Note>
          ))}
        </NoteRow>
        <NoteRow>
          {lab.contributions.map((item) => (
            <Note key={item.inputIndex} title={`x${item.inputIndex + 1} × column ${item.inputIndex + 1}`}>
              {item.scalar.toFixed(2)} × {formatVector(item.column)} = {formatVector(item.contribution)}.
            </Note>
          ))}
        </NoteRow>
        <Note tone="accent" title={`Column contributions sum to ${formatVector(lab.contributionSum)}`}>
          This is the geometric view of matrix-vector multiplication: input coordinates choose how much of each output-space column direction to add.
        </Note>
      </Plate>

      <Plate label="Shape reasoning" title="The inner dimensions contract; the outer dimensions survive">
        <NoteRow>
          <Note tone="good" title="(2×3)(3×4) → 2×4">Compatible because the shared dimension is {compatible.contractedDimension}.</Note>
          <Note tone="danger" title="(2×3)(2×4) is invalid">The left matrix has 3 columns but the right matrix has 2 rows, so there is no shared coordinate dimension to contract.</Note>
        </NoteRow>
        <Note tone="neutral" title="Do not memorize only the shape rule">
          The contracted dimension is the coordinate space being summed over. That is why matrix multiplication represents composition of linear maps rather than arbitrary table arithmetic.
        </Note>
      </Plate>
    </>
  );
}
