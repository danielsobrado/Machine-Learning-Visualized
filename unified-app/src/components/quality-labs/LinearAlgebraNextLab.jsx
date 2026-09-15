import React from 'react';

import { LINEAR_ALGEBRA_NEXT_LESSON_IDS } from './linearAlgebraNextConstants.js';
import FundamentalSubspacesNextLab from './FundamentalSubspacesNextLab.jsx';
import MatrixDecompositionsNextLab from './MatrixDecompositionsNextLab.jsx';
import MatrixMultiplicationNextLab from './MatrixMultiplicationNextLab.jsx';
import QrNextLab from './QrNextLab.jsx';
import SvdNextLab from './SvdNextLab.jsx';

export function hasLinearAlgebraNextLab(lessonId) {
  return LINEAR_ALGEBRA_NEXT_LESSON_IDS.has(lessonId);
}

export default function LinearAlgebraNextLab({ lessonId }) {
  if (!hasLinearAlgebraNextLab(lessonId)) return null;

  let Lab;
  if (lessonId === 'matrix-decompositions') Lab = MatrixDecompositionsNextLab;
  else if (lessonId === 'qr-decomposition') Lab = QrNextLab;
  else if (lessonId === 'svd') Lab = SvdNextLab;
  else if (lessonId === 'fundamental-subspaces') Lab = FundamentalSubspacesNextLab;
  else if (lessonId === 'matrix-multiplication') Lab = MatrixMultiplicationNextLab;
  else return null;

  return (
    <div className="nb-lesson mt-8" data-linear-algebra-next-lab={lessonId}>
      <Lab />
    </div>
  );
}
