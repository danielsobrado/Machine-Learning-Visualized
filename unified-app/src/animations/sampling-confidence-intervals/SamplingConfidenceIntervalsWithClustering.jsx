import React from 'react';
import CoreSamplingConfidenceIntervals from './index.jsx';
import ClusteredSamplingLab from './ClusteredSamplingLab.jsx';

export default function SamplingConfidenceIntervalsWithClustering() {
  return (
    <>
      <CoreSamplingConfidenceIntervals />
      <div className="nb-lesson mt-6">
        <ClusteredSamplingLab />
      </div>
    </>
  );
}
