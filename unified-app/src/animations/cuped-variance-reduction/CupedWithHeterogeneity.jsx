import React from 'react';
import CupedVarianceReductionAnimation from './index.jsx';
import HeterogeneityLab from './HeterogeneityLab.jsx';

export default function CupedWithHeterogeneity() {
  return (
    <>
      <CupedVarianceReductionAnimation />
      <div className="nb-lesson mt-6">
        <HeterogeneityLab />
      </div>
    </>
  );
}
