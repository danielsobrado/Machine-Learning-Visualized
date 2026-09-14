import React from 'react';
import PropensityScoresAnimation from './index.jsx';
import DoublyRobustLab from './DoublyRobustLab.jsx';

export default function PropensityScoresWithDoublyRobust() {
  return (
    <>
      <PropensityScoresAnimation />
      <div className="nb-lesson mt-6">
        <DoublyRobustLab />
      </div>
    </>
  );
}
