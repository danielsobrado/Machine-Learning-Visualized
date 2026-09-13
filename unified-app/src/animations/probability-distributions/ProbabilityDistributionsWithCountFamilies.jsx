import React from 'react';
import ProbabilityDistributionsAnimation from './index.jsx';
import CountFamilyLab from './CountFamilyLab.jsx';

export default function ProbabilityDistributionsWithCountFamilies() {
  return (
    <>
      <ProbabilityDistributionsAnimation />
      <div className="nb-lesson mt-6">
        <CountFamilyLab />
      </div>
    </>
  );
}
