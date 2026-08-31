import React, { useEffect, useRef, useState } from 'react';
import { CanvasTexture, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Sprite, SpriteMaterial, WebGLRenderer } from 'three';
import gsap from 'gsap';
import { SVD_EXAMPLE } from './svdExample.js';

// Example: A (3x2) = U (3x3) × Σ (3x2) × V^T (2x2)
// Values are precomputed for display; real applications should use a numerical SVD.
const { matrixA, matrixU, matrixSigma, matrixVT } = SVD_EXAMPLE;

// A = U Σ V^T

const COLORS = {
    matrixA: 0xed7d31,    // Orange
    matrixU: 0x5b9bd5,    // Blue
    matrixSigma: 0x7030a0, // Purple
    matrixVT: 0x70ad47,   // Green
    highlight: 0xffc000,
    text: 0x333333,
    bg: 0xffffff
};

const STEPS = [
    { id: 'show-a', title: 'Original Matrix A', desc: 'A is a 3×2 matrix we want to decompose' },
    { id: 'intro-svd', title: 'SVD Formula', desc: 'A = U Σ V^T (Singular Value Decomposition)' },
    { id: 'show-u', title: 'Matrix U', desc: 'U (3×3): Left singular vectors (orthonormal columns)' },
    { id: 'show-sigma', title: 'Matrix Σ', desc: 'Σ (3×2): Diagonal matrix of singular values (σ₁ ≥ σ₂ ≥ 0)' },
    { id: 'show-vt', title: 'Matrix V^T', desc: 'V^T (2×2): Right singular vectors transposed' },
    { id: 'highlight-u', title: 'U Properties', desc: 'U^T U = I (orthonormal: columns are unit vectors, perpendicular)' },
    { id: 'highlight-sigma', title: 'Singular Values', desc: 'σ₁ = 6.71, σ₂ = 2.24 (ordered: σ₁ ≥ σ₂)' },
    { id: 'highlight-vt', title: 'V^T Properties', desc: 'V V^T = I (orthonormal vectors)' },
    { id: 'reconstruct', title: 'Reconstruction', desc: 'Multiply U × Σ × V^T to get back A' },
];

export default function AnimationPanel() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const [step, setStep] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [explanation, setExplanation] = useState(`${STEPS[0].title}\n${STEPS[0].desc}`);
    const objectsRef = useRef({ cellsA: [], cellsU: [], cellsSigma: [], cellsVT: [], labels: [] });

    useEffect(() => {
        if (!containerRef.current) return;

        objectsRef.current = { cellsA: [], cellsU: [], cellsSigma: [], cellsVT: [], labels: [] };

        const width = containerRef.current.clientWidth;
        const height = 450;

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

        const cellSize = 36;
        const gap = 3;

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
            ctx.font = value.toString().length > 4 ? 'bold 40px Arial' : 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value.toString(), 64, 64);

            const texture = new CanvasTexture(canvas);
            const labelMaterial = new SpriteMaterial({ map: texture, transparent: true });
            const label = new Sprite(labelMaterial);
            label.scale.set(28, 28, 1);
            group.add(label);

            group.position.set(x, y, 0);
            group.visible = visible;
            group.userData = { value, originalColor: color, mesh, label, canvas, texture };
            scene.add(group);
            return group;
        };

        const createLabel = (text, x, y, size = 32) => {
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
            sprite.scale.set(text.length * size / 2, size, 1);
            sprite.position.set(x, y, 0);
            sprite.visible = false;
            scene.add(sprite);
            return sprite;
        };

        // Layout positions
        const topY = 150;
        const aY = topY;
        const uY = 50;
        const sigmaY = 50;
        const vtY = 50;

        // Matrix A (3x2) - centered at top
        const aX = -50;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const val = matrixA[i][j].toFixed(0);
                const cell = createCell(
                    val,
                    aX + j * (cellSize + gap),
                    aY - i * (cellSize + gap),
                    COLORS.matrixA,
                    false
                );
                objectsRef.current.cellsA.push(cell);
            }
        }
        const labelA = createLabel('A', aX + 20, aY + 50);
        objectsRef.current.labels.push(labelA);

        // Matrix U (3x3)
        const uX = -220;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const val = matrixU[i][j].toFixed(2);
                const cell = createCell(
                    val,
                    uX + j * (cellSize + gap),
                    uY - i * (cellSize + gap),
                    COLORS.matrixU,
                    false
                );
                objectsRef.current.cellsU.push(cell);
            }
        }
        const labelU = createLabel('U', uX + 60, uY + 70);
        objectsRef.current.labels.push(labelU);

        // Matrix Σ (3x2)
        const sigmaX = -60;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const val = matrixSigma[i][j].toFixed(2);
                const cell = createCell(
                    val,
                    sigmaX + j * (cellSize + gap),
                    sigmaY - i * (cellSize + gap),
                    COLORS.matrixSigma,
                    false
                );
                objectsRef.current.cellsSigma.push(cell);
            }
        }
        const labelSigma = createLabel('Σ', sigmaX + 20, sigmaY + 70);
        objectsRef.current.labels.push(labelSigma);

        // Matrix VT (2x2)
        const vtX = 60;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const val = matrixVT[i][j].toFixed(2);
                const cell = createCell(
                    val,
                    vtX + j * (cellSize + gap),
                    vtY - i * (cellSize + gap),
                    COLORS.matrixVT,
                    false
                );
                objectsRef.current.cellsVT.push(cell);
            }
        }
        const labelVT = createLabel('V^T', vtX + 20, vtY + 70);
        objectsRef.current.labels.push(labelVT);

        // Operators
        const multLabel1 = createLabel('×', uX + 130, uY, 28);
        const multLabel2 = createLabel('×', sigmaX + 50, sigmaY, 28);
        const equalsLabel = createLabel('=', aX - 70, aY - 40, 32);
        objectsRef.current.labels.push(multLabel1, multLabel2, equalsLabel);

        // Begin with a useful figure instead of an empty canvas.
        objectsRef.current.cellsA.forEach(cell => { cell.visible = true; });
        objectsRef.current.labels[0].visible = true;

        rendererRef.current = renderer;

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
            case 1: // Show A
                objs.cellsA.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.08, ease: 'back.out' });
                });
                objs.labels[0].visible = true; // Label A
                break;
            case 2: // Intro SVD formula
                // Show equation layout
                break;
            case 3: // Show U
                objs.labels[1].visible = true; // Label U
                objs.cellsU.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.05, ease: 'back.out' });
                });
                objs.labels[4].visible = true; // mult1
                break;
            case 4: // Show Sigma
                objs.labels[2].visible = true; // Label Σ
                objs.cellsSigma.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.08, ease: 'back.out' });
                });
                objs.labels[5].visible = true; // mult2
                break;
            case 5: // Show VT
                objs.labels[3].visible = true; // Label V^T
                objs.cellsVT.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.08, ease: 'back.out' });
                });
                objs.labels[6].visible = true; // equals
                break;
            case 6: // Highlight U
                objs.cellsU.forEach((cell, i) => {
                    gsap.to(cell.scale, { x: 1.15, y: 1.15, duration: 0.3, delay: i * 0.05 });
                    gsap.to(cell.userData.mesh.material, { opacity: 1, duration: 0.3 });
                });
                setTimeout(() => {
                    objs.cellsU.forEach(cell => {
                        gsap.to(cell.scale, { x: 1, y: 1, duration: 0.3 });
                        gsap.to(cell.userData.mesh.material, { opacity: 0.8, duration: 0.3 });
                    });
                }, 1200);
                break;
            case 7: // Highlight Sigma
                objs.cellsSigma.forEach((cell, i) => {
                    if (cell.userData.value !== '0.00') {
                        gsap.to(cell.scale, { x: 1.2, y: 1.2, duration: 0.3, delay: i * 0.1 });
                        gsap.to(cell.userData.mesh.material, { opacity: 1, duration: 0.3 });
                    }
                });
                setTimeout(() => {
                    objs.cellsSigma.forEach(cell => {
                        gsap.to(cell.scale, { x: 1, y: 1, duration: 0.3 });
                        gsap.to(cell.userData.mesh.material, { opacity: 0.8, duration: 0.3 });
                    });
                }, 1200);
                break;
            case 8: // Highlight VT
                objs.cellsVT.forEach((cell, i) => {
                    gsap.to(cell.scale, { x: 1.15, y: 1.15, duration: 0.3, delay: i * 0.08 });
                    gsap.to(cell.userData.mesh.material, { opacity: 1, duration: 0.3 });
                });
                setTimeout(() => {
                    objs.cellsVT.forEach(cell => {
                        gsap.to(cell.scale, { x: 1, y: 1, duration: 0.3 });
                        gsap.to(cell.userData.mesh.material, { opacity: 0.8, duration: 0.3 });
                    });
                }, 1200);
                break;
            case 9: // Reconstruct
                // Flash all matrices
                [...objs.cellsU, ...objs.cellsSigma, ...objs.cellsVT].forEach(cell => {
                    gsap.to(cell.userData.mesh.material, {
                        opacity: 0.3, duration: 0.2, yoyo: true, repeat: 2
                    });
                });
                objs.cellsA.forEach(cell => {
                    gsap.to(cell.userData.mesh.material, {
                        opacity: 0.5, duration: 0.2, yoyo: true, repeat: 3
                    });
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

        setExplanation('Complete! SVD decomposes A into orthogonal matrices (U, V^T) and singular values (Σ).');
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

        [...objs.cellsA, ...objs.cellsU, ...objs.cellsSigma, ...objs.cellsVT].forEach(cell => {
            if (cell) {
                cell.visible = false;
                cell.scale.set(1, 1, 1);
                if (cell.userData.mesh) {
                    cell.userData.mesh.material.opacity = 0.8;
                }
            }
        });

        objs.labels.forEach(label => {
            if (label) label.visible = false;
        });

        objs.cellsA.forEach(cell => { cell.visible = true; });
        if (objs.labels[0]) objs.labels[0].visible = true;
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

            {/* Formula Reference */}
            <div className="mt-2 p-2 bg-blue-100 rounded-lg w-full text-center border border-blue-300">
                <p className="text-xs font-medium">
                    A = UΣV^T | U^TU = I, V^TV = I | Σ diagonal: σ₁ ≥ σ₂ ≥ ... ≥ 0
                </p>
            </div>
        </div>
    );
}
