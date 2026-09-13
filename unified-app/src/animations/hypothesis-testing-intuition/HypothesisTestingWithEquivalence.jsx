import React from 'react';
import HypothesisTestingIntuitionAnimation from './index.jsx';
import EquivalenceTestingLab from './EquivalenceTestingLab.jsx';

export default function HypothesisTestingWithEquivalence() {
  return (
    <>
      <HypothesisTestingIntuitionAnimation />
      <div className="nb-lesson mt-6">
        <EquivalenceTestingLab />
      </div>
    </>
  );
}
