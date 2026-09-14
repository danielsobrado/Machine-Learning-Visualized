import React from 'react';
import ConfoundingSimpsonsParadoxAnimation from './index.jsx';
import NonCollapsibilityLab from './NonCollapsibilityLab.jsx';

export default function ConfoundingWithNonCollapsibility() {
  return (
    <>
      <ConfoundingSimpsonsParadoxAnimation />
      <div className="nb-lesson mt-6">
        <NonCollapsibilityLab />
      </div>
    </>
  );
}
