import React from 'react';
import LegacyNeuralNetwork from './index';
import ExpressivityLab from './ExpressivityLab';

export default function EnhancedNeuralNetwork() {
  return (
    <>
      <LegacyNeuralNetwork />
      <ExpressivityLab />
    </>
  );
}
