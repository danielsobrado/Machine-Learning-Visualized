import React, { useEffect, useRef, useState } from 'react';
import { CanvasTexture, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Sprite, SpriteMaterial, WebGLRenderer } from 'three';
import gsap from 'gsap';

// Example from the image: X = [2, 1, 3], W = [1, -1, 1, -5], b = -1
// W·X = 1*2 + (-1)*1 + 1*3 + (-5) = 2 - 1 + 3 - 5 = -1
// z = W·X + b = -1 + (-1) = -2 (but image shows 1, let's recalculate)
// Actually: dot product of W[1,-1,1] with X[2,1,3] = 1*2 + (-1)*1 + 1*3 = 2-1+3 = 4
// Then add bias -5: 4 + (-5) = -1
// ReLU(-1) = 0

const inputX = [2, 1, 3];
const weights = [1, -1, 1];
const bias = -5;
const dotProduct = 4;  // 1*2 + (-1)*1 + 1*3
const zValue = -1;     // 4 + (-5)
const reluOutput = 0;  // max(0, -1)

const COLORS = {
  input: 0x5b9bd5,      // Blue
  weights: 0x70ad47,    // Green
  bias: 0x7030a0,       // Purple
  output: 0xed7d31,     // Orange
  relu: 0xffc000,       // Yellow/Gold
  bg: 0xffffff
};

const STEPS = [
  { 
    id: 'show-inputs',
    title: 'Input Vector X',
    desc: 'The input vector X contains our input values: [2, 1, 3]'
  },
  { 
    id: 'show-weights',
    title: 'Weight Vector W',
    desc: 'The weight vector W contains learned parameters: [1, -1, 1]'
  },
  { 
    id: 'show-bias',
    title: 'Bias b',
    desc: 'The bias term b = -5'
  },
  { 
    id: 'dot-product',
    title: 'Dot Product W·X',
    desc: '(1×2) + (-1×1) + (1×3) = 2 - 1 + 3 = 4'
  },
  { 
    id: 'add-bias',
    title: 'Add Bias: z = W·X + b',
    desc: 'z = 4 + (-5) = -1'
  },
  { 
    id: 'apply-relu',
    title: 'Apply ReLU: φ(z)',
    desc: 'ReLU(-1) = max(0, -1) = 0'
  },
];

export default function AnimationPanel({ onStepChange }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const objectsRef = useRef({});
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState(`${STEPS[0].title}\n${STEPS[0].desc}`);

  // Notify parent of step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step, zValue, reluOutput);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 400;

    const scene = new Scene();
    scene.background = new Color(COLORS.bg);
    sceneRef.current = scene;

    const camera = new OrthographicCamera(
      width / -2, width / 2, height / 2, height / -2, 0.1, 1000
    );
    camera.position.z = 100;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const cellSize = 40;
    const gap = 4;

    const createCell = (value, x, y, color, visible = true) => {
      const group = new Group();
      
      const geometry = new PlaneGeometry(cellSize, cellSize);
      const material = new MeshBasicMaterial({ 
        color, 
        transparent: true, 
        opacity: 0.8 
      });
      const mesh = new Mesh(geometry, material);
      group.add(mesh);

      const border = new LineSegments(
        new EdgesGeometry(geometry),
        new LineBasicMaterial({ color: 0x333333, linewidth: 2 })
      );
      group.add(border);

      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.font = 'bold 56px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), 64, 64);

      const texture = new CanvasTexture(canvas);
      const labelMaterial = new SpriteMaterial({ map: texture, transparent: true });
      const label = new Sprite(labelMaterial);
      label.scale.set(32, 32, 1);
      group.add(label);

      group.position.set(x, y, 0);
      group.visible = visible;
      group.userData = { value, mesh, canvas, texture };
      scene.add(group);
      return group;
    };

    const createLabel = (text, x, y, size = 36) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.font = `bold ${size * 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64);

      const texture = new CanvasTexture(canvas);
      const material = new SpriteMaterial({ map: texture });
      const sprite = new Sprite(material);
      sprite.scale.set(160, 40, 1);
      sprite.position.set(x, y, 0);
      sprite.visible = false;
      scene.add(sprite);
      return sprite;
    };

    // Layout positions
    const topY = 120;
    const midY = 20;
    const bottomY = -80;

    // Input X (vertical)
    const xCells = [];
    const xStartX = -180;
    for (let i = 0; i < inputX.length; i++) {
      const cell = createCell(inputX[i], xStartX, topY - i * (cellSize + gap), COLORS.input, false);
      xCells.push(cell);
    }
    const xLabel = createLabel('X', xStartX, topY + 50);

    // Weights W (horizontal)
    const wCells = [];
    const wStartX = -80;
    for (let i = 0; i < weights.length; i++) {
      const cell = createCell(weights[i], wStartX + i * (cellSize + gap), topY - 22, COLORS.weights, false);
      wCells.push(cell);
    }
    const wLabel = createLabel('W', wStartX + 44, topY + 50);

    // Bias
    const biasCell = createCell(bias, wStartX + 3 * (cellSize + gap), topY - 22, COLORS.bias, false);
    const biasLabel = createLabel('b', wStartX + 3 * (cellSize + gap), topY + 50);

    // Dot product result
    const dotResultCell = createCell('4', 60, midY, COLORS.output, false);
    const dotLabel = createLabel('W·X', 60, midY + 50);

    // Z result (after bias)
    const zCell = createCell('-1', 140, midY, COLORS.output, false);
    const zLabel = createLabel('z', 140, midY + 50);

    // ReLU output
    const reluCell = createCell('0', 220, midY, COLORS.relu, false);
    const reluLabel = createLabel('φ(z)', 220, midY + 50);

    // Operators
    const multLabel = createLabel('·', -20, topY - 22, 48);
    const plusLabel = createLabel('+', 100, midY, 48);
    const arrowLabel = createLabel('→', 180, midY, 36);
    const reluFuncLabel = createLabel('ReLU', 180, midY - 40, 24);

    objectsRef.current = {
      xCells, wCells, biasCell, dotResultCell, zCell, reluCell,
      xLabel, wLabel, biasLabel, dotLabel, zLabel, reluLabel,
      multLabel, plusLabel, arrowLabel, reluFuncLabel
    };

    // Begin with a useful figure instead of an empty canvas.
    xCells.forEach(cell => { cell.visible = true; });
    xLabel.visible = true;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const animateStep = (stepIndex) => {
    const objs = objectsRef.current;
    
    switch(stepIndex) {
      case 1: // Show inputs
        objs.xLabel.visible = true;
        objs.xCells.forEach((cell, i) => {
          cell.visible = true;
          cell.scale.set(0.01, 0.01, 0.01);
          gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.15, ease: 'back.out' });
        });
        break;
      case 2: // Show weights
        objs.wLabel.visible = true;
        objs.multLabel.visible = true;
        objs.wCells.forEach((cell, i) => {
          cell.visible = true;
          cell.scale.set(0.01, 0.01, 0.01);
          gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.15, ease: 'back.out' });
        });
        break;
      case 3: // Show bias
        objs.biasLabel.visible = true;
        objs.biasCell.visible = true;
        objs.biasCell.scale.set(0.01, 0.01, 0.01);
        gsap.to(objs.biasCell.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'back.out' });
        break;
      case 4: // Dot product
        // Highlight X and W
        objs.xCells.forEach((cell, i) => {
          gsap.to(cell.scale, { x: 1.2, y: 1.2, duration: 0.3, delay: i * 0.1 });
          gsap.to(cell.scale, { x: 1, y: 1, duration: 0.3, delay: 0.5 + i * 0.1 });
        });
        objs.wCells.forEach((cell, i) => {
          gsap.to(cell.scale, { x: 1.2, y: 1.2, duration: 0.3, delay: i * 0.1 });
          gsap.to(cell.scale, { x: 1, y: 1, duration: 0.3, delay: 0.5 + i * 0.1 });
        });
        objs.dotLabel.visible = true;
        objs.dotResultCell.visible = true;
        objs.dotResultCell.scale.set(0.01, 0.01, 0.01);
        gsap.to(objs.dotResultCell.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.8, ease: 'back.out' });
        break;
      case 5: // Add bias
        objs.plusLabel.visible = true;
        gsap.to(objs.biasCell.scale, { x: 1.2, y: 1.2, duration: 0.3 });
        gsap.to(objs.biasCell.scale, { x: 1, y: 1, duration: 0.3, delay: 0.4 });
        objs.zLabel.visible = true;
        objs.zCell.visible = true;
        objs.zCell.scale.set(0.01, 0.01, 0.01);
        gsap.to(objs.zCell.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.6, ease: 'back.out' });
        break;
      case 6: // Apply ReLU
        objs.arrowLabel.visible = true;
        objs.reluFuncLabel.visible = true;
        objs.reluLabel.visible = true;
        objs.reluCell.visible = true;
        objs.reluCell.scale.set(0.01, 0.01, 0.01);
        gsap.to(objs.reluCell.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.3, ease: 'back.out' });
        // Flash the z cell to show it's negative
        gsap.to(objs.zCell.userData.mesh.material, { 
          opacity: 0.3, duration: 0.2, yoyo: true, repeat: 3 
        });
        break;
    }
  };

  const playAnimation = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    for (let i = step; i < STEPS.length; i++) {
      setStep(i + 1);
      setExplanation(`${STEPS[i].title}\n${STEPS[i].desc}`);
      animateStep(i + 1);
      await new Promise(r => setTimeout(r, 1800));
    }

    setExplanation('Complete! ReLU outputs 0 for negative inputs, preserving positive values.');
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (isPlaying || step >= STEPS.length) return;
    const newStep = step + 1;
    setStep(newStep);
    setExplanation(`${STEPS[newStep - 1].title}\n${STEPS[newStep - 1].desc}`);
    animateStep(newStep);
  };

  const prevStep = () => {
    if (isPlaying || step <= 1) return;
    // Reset and replay up to previous step
    reset();
    const targetStep = step - 1;
    setTimeout(() => {
      for (let i = 2; i <= targetStep; i++) {
        animateStep(i);
      }
      setStep(targetStep);
      setExplanation(`${STEPS[targetStep - 1].title}\n${STEPS[targetStep - 1].desc}`);
    }, 100);
  };

  const reset = () => {
    if (isPlaying) return;
    const objs = objectsRef.current;
    
    // Hide all elements
    [...objs.xCells, ...objs.wCells, objs.biasCell, objs.dotResultCell, objs.zCell, objs.reluCell].forEach(cell => {
      if (cell) {
        cell.visible = false;
        cell.scale.set(1, 1, 1);
      }
    });
    
    [objs.xLabel, objs.wLabel, objs.biasLabel, objs.dotLabel, objs.zLabel, objs.reluLabel,
     objs.multLabel, objs.plusLabel, objs.arrowLabel, objs.reluFuncLabel].forEach(label => {
      if (label) label.visible = false;
    });

    objs.xCells.forEach(cell => { cell.visible = true; });
    if (objs.xLabel) objs.xLabel.visible = true;
    setStep(1);
    setExplanation(`${STEPS[0].title}\n${STEPS[0].desc}`);
  };

  return (
    <div className="flex flex-col items-center p-3">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Animation Demo</h2>
      
      <div ref={containerRef} className="w-full rounded-lg overflow-hidden shadow-lg bg-white" />
      
      <div className="mt-2 p-2 bg-white rounded-lg w-full text-center shadow">
        <p className="text-gray-800 whitespace-pre-line text-sm">{explanation}</p>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={prevStep}
          disabled={isPlaying || step <= 1}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm"
        >
          ← Prev
        </button>
        
        <div className="px-3 py-1 bg-gray-200 rounded-lg font-mono text-gray-700 min-w-[80px] text-center text-sm">
          {step} / {STEPS.length}
        </div>
        
        <button
          onClick={nextStep}
          disabled={isPlaying || step >= STEPS.length}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm"
        >
          Next →
        </button>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={playAnimation}
          disabled={isPlaying || step >= STEPS.length}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm"
        >
          {isPlaying ? 'Playing...' : '▶ Play'}
        </button>
        <button
          onClick={reset}
          disabled={isPlaying}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
