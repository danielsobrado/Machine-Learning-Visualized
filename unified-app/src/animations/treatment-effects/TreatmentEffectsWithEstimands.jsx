import React from 'react';
import TreatmentEffectsAnimation from './index.jsx';
import EstimandPopulationLab from './EstimandPopulationLab.jsx';

export default function TreatmentEffectsWithEstimands() {
  return (
    <>
      <TreatmentEffectsAnimation />
      <div className="mx-auto max-w-6xl px-4 pb-8 md:px-6">
        <EstimandPopulationLab />
      </div>
    </>
  );
}
