import React, { useEffect, useRef, useState } from 'react';
import { CanvasTexture, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Sprite, SpriteMaterial, WebGLRenderer } from 'three';
import gsap from 'gsap';

// Softmax Logic
// z = [2.0, 1.0, 0.1]
// e^z = [7.389, 2.718, 1.105]
// sum = 11.212
// p = [0.659, 0.242, 0.099]

const logits = [2.0, 1.0, 0.1];
const exponentials = logits.map(z => Math.exp(z));
const sumExp = exponentials.reduce((a, b) => a + b, 0);
const probabilities = exponentials.map(e => e / sumExp);

const COLORS = {
    logit: 0x5b9bd5,      // Blue
    exp: 0x70ad47,        // Green
    sum: 0x7030a0,        // Purple
    prob: 0xed7d31,       // Orange
    bg: 0xffffff
};

const STEPS = [
    {
        id: 'show-logits',
        title: 'Input Logits (z)',
        desc: 'The raw scores (logits) from the previous layer: [2.0, 1.0, 0.1]'
    },
    {
        id: 'calc-exp',
        title: 'Exponentiation (e^z)',
        desc: 'Apply exponential function to each logit to make them positive.\ne^2.0 ≈ 7.39, e^1.0 ≈ 2.72, e^0.1 ≈ 1.11'
    },
    {
        id: 'calc-sum',
        title: 'Sum of Exponentials (Σ)',
        desc: 'Sum all exponential values: 7.39 + 2.72 + 1.11 ≈ 11.21'
    },
    {
        id: 'normalize',
        title: 'Normalization (e^z / Σ)',
        desc: 'Divide each exponential by the sum to get probabilities.\n7.39/11.21 ≈ 0.66'
    },
    {
        id: 'result',
        title: 'Resulting Probabilities',
        desc: 'Final probabilities sum to 1.0: [0.66, 0.24, 0.10]'
    },
];

export default function SoftmaxAnimationPanel({ onStepChange }) {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const objectsRef = useRef({});
    const [step, setStep] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [explanation, setExplanation] = useState(`${STEPS[0].title}\n${STEPS[0].desc}`);

    useEffect(() => {
        if (onStepChange) {
            onStepChange(step, logits, probabilities);
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

        const cellSize = 50;
        const gap = 10;

        const createCell = (value, x, y, color, labelText, visible = true) => {
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
            canvas.width = 256;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(typeof value === 'number' ? value.toFixed(2) : value, 128, 64);

            const texture = new CanvasTexture(canvas);
            const valMaterial = new SpriteMaterial({ map: texture, transparent: true });
            const valSprite = new Sprite(valMaterial);
            valSprite.scale.set(cellSize * 1.5, cellSize * 0.75, 1);
            group.add(valSprite);

            if (labelText) {
                const lblCanvas = document.createElement('canvas');
                lblCanvas.width = 256;
                lblCanvas.height = 64;
                const lblCtx = lblCanvas.getContext('2d');
                lblCtx.fillStyle = '#333';
                lblCtx.font = 'bold 32px Arial';
                lblCtx.textAlign = 'center';
                lblCtx.textBaseline = 'middle';
                lblCtx.fillText(labelText, 128, 32);

                const lblTexture = new CanvasTexture(lblCanvas);
                const lblMaterial = new SpriteMaterial({ map: lblTexture, transparent: true });
                const lblSprite = new Sprite(lblMaterial);
                lblSprite.scale.set(cellSize * 1.5, cellSize * 0.4, 1);
                lblSprite.position.y = cellSize * 0.8;
                group.add(lblSprite);
            }

            group.position.set(x, y, 0);
            group.visible = visible;
            group.userData = { value, mesh };
            scene.add(group);
            return group;
        };

        const createArrow = (x, y, rotation = 0) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#333';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('→', 64, 64);

            const texture = new CanvasTexture(canvas);
            const material = new SpriteMaterial({ map: texture });
            const sprite = new Sprite(material);
            sprite.scale.set(40, 40, 1);
            sprite.position.set(x, y, 0);
            sprite.material.rotation = rotation;
            sprite.visible = false;
            scene.add(sprite);
            return sprite;
        };

        const createMathSymbol = (symbol, x, y) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#333';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, 64, 64);

            const texture = new CanvasTexture(canvas);
            const material = new SpriteMaterial({ map: texture });
            const sprite = new Sprite(material);
            sprite.scale.set(40, 40, 1);
            sprite.position.set(x, y, 0);
            sprite.visible = false;
            scene.add(sprite);
            return sprite;
        };

        // Layout
        const startX = -200;
        const startY = 100;
        const stepX = 150;

        // 1. Logits Column
        const logitCells = logits.map((val, i) =>
            createCell(val, startX, startY - i * (cellSize + gap + 20), COLORS.logit, i === 0 ? 'z' : '', false)
        );

        // 2. Exponentials Column
        const expCells = exponentials.map((val, i) =>
            createCell(val, startX + stepX, startY - i * (cellSize + gap + 20), COLORS.exp, i === 0 ? 'e^z' : '', false)
        );

        // Arrows 1 -> 2
        const arrows1 = logits.map((_, i) =>
            createArrow(startX + stepX / 2, startY - i * (cellSize + gap + 20))
        );

        // 3. Sum Cell (Bottom Center)
        const sumCell = createCell(sumExp, startX + stepX * 1.5, startY - 3 * (cellSize + gap + 20), COLORS.sum, 'Σ', false);

        // Plus symbols
        const plusSymbols = [
            createMathSymbol('+', startX + stepX, startY - 0.5 * (cellSize + gap + 20)),
            createMathSymbol('+', startX + stepX, startY - 1.5 * (cellSize + gap + 20))
        ];

        // Arrow to sum
        const arrowToSum = createArrow(startX + stepX, startY - 2.5 * (cellSize + gap + 20), -Math.PI / 2);

        // 4. Probabilities Column
        const probCells = probabilities.map((val, i) =>
            createCell(val, startX + stepX * 2.5, startY - i * (cellSize + gap + 20), COLORS.prob, i === 0 ? 'p' : '', false)
        );

        // Arrows 2 -> 4 (Division)
        const arrows2 = exponentials.map((_, i) =>
            createArrow(startX + stepX * 1.75, startY - i * (cellSize + gap + 20))
        );

        // Division symbols
        const divSymbols = exponentials.map((_, i) =>
            createMathSymbol('/', startX + stepX * 1.75, startY - i * (cellSize + gap + 20) + 20)
        );


        objectsRef.current = {
            logitCells, expCells, sumCell, probCells,
            arrows1, arrows2, arrowToSum, plusSymbols, divSymbols
        };

        // Begin with a useful figure instead of an empty canvas.
        logitCells.forEach(cell => { cell.visible = true; });

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

        switch (stepIndex) {
            case 1: // Show Logits
                objs.logitCells.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: i * 0.1, ease: 'back.out' });
                });
                break;
            case 2: // Calc Exponentials
                objs.arrows1.forEach(a => a.visible = true);
                objs.expCells.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: i * 0.1, ease: 'back.out' });
                });
                break;
            case 3: // Calc Sum
                objs.plusSymbols.forEach(s => s.visible = true);
                objs.arrowToSum.visible = true;
                objs.sumCell.visible = true;
                objs.sumCell.scale.set(0.01, 0.01, 0.01);

                // Animate exp cells moving/copying to sum? Just highlight them
                objs.expCells.forEach(cell => {
                    gsap.to(cell.scale, { x: 1.2, y: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
                });

                gsap.to(objs.sumCell.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.5, ease: 'back.out' });
                break;
            case 4: // Normalize
                objs.arrows2.forEach(a => a.visible = true);
                objs.divSymbols.forEach(s => s.visible = true);

                // Highlight sum and exp
                gsap.to(objs.sumCell.scale, { x: 1.2, y: 1.2, duration: 0.2, yoyo: true, repeat: 1 });

                objs.probCells.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.5 + i * 0.1, ease: 'back.out' });
                });
                break;
            case 5: // Result
                // Highlight probabilities
                objs.probCells.forEach((cell, i) => {
                    gsap.to(cell.scale, { x: 1.2, y: 1.2, duration: 0.3, yoyo: true, repeat: 1, delay: i * 0.1 });
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
            await new Promise(r => setTimeout(r, 2000));
        }

        setExplanation('Complete! Softmax converts logits to probabilities.');
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

        // Hide all
        Object.values(objs).flat().forEach(obj => {
            if (obj) obj.visible = false;
        });

        objs.logitCells.forEach(cell => { cell.visible = true; });
        setStep(1);
        setExplanation(`${STEPS[0].title}\n${STEPS[0].desc}`);
    };

    return (
        <div className="flex flex-col items-center p-3">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Softmax Animation</h2>

            <div ref={containerRef} className="w-full rounded-lg overflow-hidden shadow-lg bg-white" />

            <div className="mt-2 p-2 bg-white rounded-lg w-full text-center shadow h-20 flex items-center justify-center">
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
