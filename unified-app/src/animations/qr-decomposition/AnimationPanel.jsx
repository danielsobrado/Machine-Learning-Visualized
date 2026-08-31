import React, { useEffect, useRef, useState } from 'react';
import { CanvasTexture, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Sprite, SpriteMaterial, WebGLRenderer } from 'three';
import gsap from 'gsap';
import { QR_EXAMPLE } from './qrExample.js';

// Example: Simple 2x2 matrix for QR decomposition
// A = [[3, 1], [0, 2]]
// Q (orthonormal), R (upper triangular)
const { matrixA, matrixQ, matrixR, columnCellIndices } = QR_EXAMPLE;

const COLORS = {
    matrixA: 0xed7d31,
    matrixQ: 0x5b9bd5,
    matrixR: 0x70ad47,
    bg: 0xffffff
};

const STEPS = [
    { id: 'show-a', title: 'Original Matrix A', desc: 'A is a 2×2 matrix to decompose' },
    { id: 'gram-schmidt-1', title: 'Gram-Schmidt Step 1', desc: 'Normalize first column: q₁ = a₁ / ||a₁||' },
    { id: 'gram-schmidt-2', title: 'Gram-Schmidt Step 2', desc: 'Orthogonalize: a₂ - (a₂·q₁)q₁, then normalize' },
    { id: 'show-q', title: 'Matrix Q (Orthonormal)', desc: 'Q has orthonormal columns: Q^T Q = I' },
    { id: 'show-r', title: 'Matrix R (Upper Triangular)', desc: 'R is upper triangular with Q^T A = R' },
    { id: 'decomp', title: 'QR Decomposition', desc: 'A = QR (product of orthogonal and upper triangular)' },
];

export default function AnimationPanel() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const [step, setStep] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [explanation, setExplanation] = useState(`${STEPS[0].title}\n${STEPS[0].desc}`);
    const objectsRef = useRef({ cellsA: [], cellsQ: [], cellsR: [], labels: [] });

    useEffect(() => {
        if (!containerRef.current) return;

        objectsRef.current = { cellsA: [], cellsQ: [], cellsR: [], labels: [] };
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

        const cellSize = 40;
        const gap = 4;

        const createCell = (value, x, y, color, visible = true) => {
            const group = new Group();
            const geometry = new PlaneGeometry(cellSize, cellSize);
            const material = new MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
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
            ctx.font = 'bold 50px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value.toString(), 64, 64);

            const texture = new CanvasTexture(canvas);
            const labelMaterial = new SpriteMaterial({ map: texture, transparent: true });
            const label = new Sprite(labelMaterial);
            label.scale.set(30, 30, 1);
            group.add(label);

            group.position.set(x, y, 0);
            group.visible = visible;
            group.userData = { value, mesh, canvas, texture };
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

        // Matrix A (2x2)
        const aX = -30; const aY = 100;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const cell = createCell(matrixA[i][j], aX + j * (cellSize + gap), aY - i * (cellSize + gap), COLORS.matrixA, false);
                objectsRef.current.cellsA.push(cell);
            }
        }
        const labelA = createLabel('A', aX + 22, aY + 50);
        objectsRef.current.labels.push(labelA);

        // Matrix Q (2x2)
        const qX = -150; const qY = 0;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const cell = createCell(matrixQ[i][j], qX + j * (cellSize + gap), qY - i * (cellSize + gap), COLORS.matrixQ, false);
                objectsRef.current.cellsQ.push(cell);
            }
        }
        const labelQ = createLabel('Q', qX + 22, qY + 60);
        objectsRef.current.labels.push(labelQ);

        // Matrix R (2x2)
        const rX = 20; const rY = 0;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const cell = createCell(matrixR[i][j], rX + j * (cellSize + gap), rY - i * (cellSize + gap), COLORS.matrixR, false);
                objectsRef.current.cellsR.push(cell);
            }
        }
        const labelR = createLabel('R', rX + 22, rY + 60);
        objectsRef.current.labels.push(labelR);

        const multLabel = createLabel('×', qX + 100, qY, 28);
        const equalsLabel = createLabel('=', aX - 40, aY - 20, 32);
        objectsRef.current.labels.push(multLabel, equalsLabel);

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
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.1, ease: 'back.out' });
                });
                objs.labels[0].visible = true;
                break;
            case 2: // Gram-Schmidt 1
                columnCellIndices[0].map((index) => objs.cellsA[index]).forEach(cell => {
                    gsap.to(cell.scale, { x: 1.2, y: 1.2, duration: 0.3 });
                });
                setTimeout(() => columnCellIndices[0].map((index) => objs.cellsA[index]).forEach(cell => gsap.to(cell.scale, { x: 1, y: 1, duration: 0.3 })), 1000);
                break;
            case 3: // Gram-Schmidt 2
                columnCellIndices[1].map((index) => objs.cellsA[index]).forEach(cell => {
                    gsap.to(cell.scale, { x: 1.2, y: 1.2, duration: 0.3 });
                });
                setTimeout(() => columnCellIndices[1].map((index) => objs.cellsA[index]).forEach(cell => gsap.to(cell.scale, { x: 1, y: 1, duration: 0.3 })), 1000);
                break;
            case 4: // Show Q
                objs.labels[1].visible = true;
                objs.cellsQ.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.08, ease: 'back.out' });
                });
                objs.labels[3].visible = true;
                break;
            case 5: // Show R
                objs.labels[2].visible = true;
                objs.cellsR.forEach((cell, i) => {
                    cell.visible = true;
                    cell.scale.set(0.01, 0.01, 0.01);
                    gsap.to(cell.scale, { x: 1, y: 1, z: 1, duration: 0.4, delay: i * 0.08, ease: 'back.out' });
                });
                objs.labels[4].visible = true;
                break;
            case 6: // Decomposition
                [...objs.cellsQ, ...objs.cellsR].forEach(cell => {
                    gsap.to(cell.userData.mesh.material, { opacity: 0.3, duration: 0.2, yoyo: true, repeat: 2 });
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
            await new Promise(r => setTimeout(r, 1600));
        }
        setExplanation('Complete! QR = orthonormal Q × upper triangular R');
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
            for (let i = 2; i <= targetStep; i++) animateStep(i);
            setStep(targetStep);
            setExplanation(`${STEPS[targetStep - 1].title}\n${STEPS[targetStep - 1].desc}`);
        }, 100);
    };

    const reset = () => {
        if (isPlaying) return;
        const objs = objectsRef.current;
        [...objs.cellsA, ...objs.cellsQ, ...objs.cellsR].forEach(cell => {
            if (cell) { cell.visible = false; cell.scale.set(1, 1, 1); if (cell.userData.mesh) cell.userData.mesh.material.opacity = 0.8; }
        });
        objs.labels.forEach(label => { if (label) label.visible = false; });
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
                <button onClick={prevStep} disabled={isPlaying || step <= 1} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm">← Prev</button>
                <div className="px-3 py-1 bg-gray-200 rounded-lg font-mono text-gray-700 min-w-[80px] text-center text-sm">{step} / {STEPS.length}</div>
                <button onClick={nextStep} disabled={isPlaying || step >= STEPS.length} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm">Next →</button>
            </div>
            <div className="flex gap-2 mt-2">
                <button onClick={playAnimation} disabled={isPlaying || step >= STEPS.length} className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm">{isPlaying ? 'Playing...' : '▶ Play'}</button>
                <button onClick={reset} disabled={isPlaying} className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm">↺ Reset</button>
            </div>
            <div className="mt-2 p-2 bg-green-100 rounded-lg w-full text-center border border-green-300">
                <p className="text-xs font-medium">A = QR | Q^T Q = I | R upper triangular</p>
            </div>
        </div>
    );
}
