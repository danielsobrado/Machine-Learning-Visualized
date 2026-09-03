import React, { useEffect, useRef, useState } from 'react';
import {
    BufferGeometry,
    CircleGeometry,
    Color,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three';
import gsap from 'gsap';
import { LOSS_SCENE } from './gradientDescentConstants.js';
import {
    DEFAULT_LEARNING_RATE,
    DEFAULT_START_WEIGHT,
    loss,
    lossWorldY,
    nextWeight,
} from './gradientDescentModel.js';

const COLORS = {
    curve: 0x7030a0,
    ball: 0x5b9bd5,
    bg: 0xffffff,
};

export default function GradientDescentPanel({
    learningRate = DEFAULT_LEARNING_RATE,
    startWeight = DEFAULT_START_WEIGHT,
    onStepChange,
}) {
    const containerRef = useRef(null);
    const objectsRef = useRef({});
    const runGenerationRef = useRef(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentWeight, setCurrentWeight] = useState(startWeight ?? DEFAULT_START_WEIGHT);
    const [iteration, setIteration] = useState(0);

    const updateBallPosition = (weight) => {
        const { ball } = objectsRef.current;
        if (!ball || weight == null) return;
        ball.position.set(weight * LOSS_SCENE.xScale, lossWorldY(weight), 0);
    };

    useEffect(() => {
        const nextStartWeight = startWeight ?? DEFAULT_START_WEIGHT;
        setCurrentWeight(nextStartWeight);
        setIteration(0);
        updateBallPosition(nextStartWeight);
    }, [startWeight]);

    useEffect(() => {
        if (onStepChange && currentWeight != null) {
            onStepChange(iteration, currentWeight, loss(currentWeight));
        }
    }, [iteration, currentWeight, onStepChange]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const height = 400;
        const scene = new Scene();
        scene.background = new Color(COLORS.bg);

        const camera = new OrthographicCamera(-1, 1, height / 2, height / -2, 0.1, 1000);
        camera.position.z = 100;

        const renderer = new WebGLRenderer({ antialias: true });
        container.appendChild(renderer.domElement);

        const curvePoints = [];
        for (let weight = -LOSS_SCENE.weightRange; weight <= LOSS_SCENE.weightRange; weight += 0.1) {
            curvePoints.push(new Vector3(
                weight * LOSS_SCENE.xScale,
                lossWorldY(weight),
                0,
            ));
        }

        const curveGeometry = new BufferGeometry().setFromPoints(curvePoints);
        const curveMaterial = new LineBasicMaterial({ color: COLORS.curve });
        scene.add(new Line(curveGeometry, curveMaterial));

        const ballGeometry = new CircleGeometry(8, 32);
        const ballMaterial = new MeshBasicMaterial({ color: COLORS.ball });
        const ball = new Mesh(ballGeometry, ballMaterial);
        scene.add(ball);
        objectsRef.current = { ball };
        updateBallPosition(startWeight ?? DEFAULT_START_WEIGHT);

        const resize = () => {
            const width = Math.max(320, container.clientWidth);
            const halfWidth = Math.max(
                width / 2,
                LOSS_SCENE.weightRange * LOSS_SCENE.xScale + 20,
            );
            camera.left = -halfWidth;
            camera.right = halfWidth;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };
        resize();

        const observer = new ResizeObserver(resize);
        observer.observe(container);

        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            runGenerationRef.current += 1;
            observer.disconnect();
            cancelAnimationFrame(animationId);
            curveGeometry.dispose();
            curveMaterial.dispose();
            ballGeometry.dispose();
            ballMaterial.dispose();
            renderer.dispose();
            objectsRef.current = {};
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    const runGradientDescent = async () => {
        if (isRunning) return;
        const generation = runGenerationRef.current + 1;
        runGenerationRef.current = generation;
        setIsRunning(true);

        let weight = startWeight ?? DEFAULT_START_WEIGHT;
        setCurrentWeight(weight);
        setIteration(0);
        updateBallPosition(weight);

        const maxIterations = 50;
        const convergenceThreshold = 0.01;

        try {
            for (let index = 0; index < maxIterations; index += 1) {
                if (runGenerationRef.current !== generation) break;

                const next = nextWeight(weight, learningRate);
                const { ball } = objectsRef.current;
                if (!ball) break;

                await new Promise((resolve) => {
                    gsap.to(ball.position, {
                        x: next * LOSS_SCENE.xScale,
                        y: lossWorldY(next),
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: resolve,
                    });
                });

                if (runGenerationRef.current !== generation) break;

                weight = next;
                setCurrentWeight(weight);
                setIteration(index + 1);

                if (Math.abs(weight) < convergenceThreshold || Math.abs(weight) > 10) break;
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
        } finally {
            if (runGenerationRef.current === generation) {
                setIsRunning(false);
            }
        }
    };

    const reset = () => {
        if (isRunning) return;
        runGenerationRef.current += 1;
        const nextStartWeight = startWeight ?? DEFAULT_START_WEIGHT;
        setCurrentWeight(nextStartWeight);
        setIteration(0);
        updateBallPosition(nextStartWeight);
    };

    return (
        <div className="flex flex-col items-center p-3">
            <h2 className="mb-2 text-xl font-bold text-gray-800">Loss Bowl</h2>
            <p className="mb-3 max-w-2xl text-center text-sm leading-6 text-slate-600">
                Lower on the chart means lower loss. The minimum at w=0 is visually the bottom of the bowl.
            </p>

            <div ref={containerRef} className="w-full overflow-hidden rounded-lg bg-white shadow-lg" />

            <div className="mt-2 w-full rounded-lg bg-white p-2 text-center shadow">
                <p className="text-sm text-gray-800">
                    Iteration: <span className="font-bold">{iteration}</span> |
                    Weight: <span className="font-bold text-blue-600">{(currentWeight ?? 0).toFixed(3)}</span> |
                    Loss: <span className="font-bold text-purple-600">{loss(currentWeight ?? 0).toFixed(3)}</span>
                </p>
            </div>

            <div className="mt-2 flex gap-2">
                <button
                    type="button"
                    onClick={runGradientDescent}
                    disabled={isRunning}
                    className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                    type="button"
                    onClick={reset}
                    disabled={isRunning}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
