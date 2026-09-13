import React from 'react';
import BeginnerPath from './BeginnerPath.jsx';
import LegacyNeuralNetwork from './index';
import ExpressivityLab from './ExpressivityLab';

export default function EnhancedNeuralNetwork() {
  return (
    <>
      <BeginnerPath />
      <LegacyNeuralNetwork />
      <ExpressivityLab />
    </>
  );
}
