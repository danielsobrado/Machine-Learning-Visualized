import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LINEAR_REGRESSION_COST_LANDSCAPE } from './linearRegressionConstants.js';
import {
  costLandscapeWorldPosition,
  costParameterFromSurfaceCoordinate,
} from './linearRegressionGeometry.js';
import {
  LINEAR_REGRESSION_DEMO_DATA,
  calculateMSE,
  calculateOLS,
} from './linearRegressionModel.js';

const SURFACE_COLOR = 0x6366f1;
const WIREFRAME_COLOR = 0x4338ca;
const MARKER_COLOR = 0xef4444;
const MARKER_EMISSIVE = 0x991b1b;
const BACKGROUND_COLOR = 0xf8fafc;

export default function CostPanel() {
  const containerRef = useRef(null);
  const markerRef = useRef(null);
  const renderRef = useRef(null);
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const optimum = useMemo(() => calculateOLS(LINEAR_REGRESSION_DEMO_DATA), []);
  const currentMSE = useMemo(
    () => calculateMSE(LINEAR_REGRESSION_DEMO_DATA, { slope, intercept }),
    [slope, intercept],
  );
  const optimumMSE = useMemo(
    () => calculateMSE(LINEAR_REGRESSION_DEMO_DATA, optimum),
    [optimum],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const { camera: cameraConfig, surface: surfaceConfig } = LINEAR_REGRESSION_COST_LANDSCAPE;
    const scene = new Scene();
    scene.background = new Color(BACKGROUND_COLOR);

    const camera = new PerspectiveCamera(cameraConfig.fov, 1, cameraConfig.near, cameraConfig.far);
    camera.position.set(...cameraConfig.position);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.setAttribute('aria-label', 'Three-dimensional mean squared error surface. Drag to rotate the view.');
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;

    scene.add(new AmbientLight(0xffffff, 0.6));
    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const geometry = new PlaneGeometry(
      surfaceConfig.size,
      surfaceConfig.size,
      surfaceConfig.segments,
      surfaceConfig.segments,
    );
    const positions = geometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const planeX = positions.getX(index);
      const planeY = positions.getY(index);
      const model = {
        slope: costParameterFromSurfaceCoordinate(planeX, LINEAR_REGRESSION_COST_LANDSCAPE.slope),
        intercept: costParameterFromSurfaceCoordinate(planeY, LINEAR_REGRESSION_COST_LANDSCAPE.intercept),
      };
      positions.setZ(index, calculateMSE(LINEAR_REGRESSION_DEMO_DATA, model) / surfaceConfig.heightScale);
    }
    geometry.computeVertexNormals();
    geometry.rotateX(-Math.PI / 2);

    const surfaceMaterial = new MeshStandardMaterial({
      color: SURFACE_COLOR,
      roughness: 0.4,
      metalness: 0.2,
      side: DoubleSide,
    });
    scene.add(new Mesh(geometry, surfaceMaterial));

    const wireframeMaterial = new MeshBasicMaterial({
      color: WIREFRAME_COLOR,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    scene.add(new Mesh(geometry, wireframeMaterial));

    const markerGeometry = new SphereGeometry(0.2, 24, 24);
    const markerMaterial = new MeshStandardMaterial({ color: MARKER_COLOR, emissive: MARKER_EMISSIVE });
    const marker = new Mesh(markerGeometry, markerMaterial);
    markerRef.current = marker;
    scene.add(marker);

    const render = () => renderer.render(scene, camera);
    renderRef.current = render;
    controls.addEventListener('change', render);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      render();
    };

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    if (resizeObserver) resizeObserver.observe(container);
    else window.addEventListener('resize', resize);
    resize();

    return () => {
      renderRef.current = null;
      markerRef.current = null;
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', resize);
      controls.removeEventListener('change', render);
      controls.dispose();
      geometry.dispose();
      surfaceMaterial.dispose();
      wireframeMaterial.dispose();
      markerGeometry.dispose();
      markerMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const position = costLandscapeWorldPosition({ slope, intercept, mse: currentMSE });
    marker.position.set(position.x, position.y, position.z);
    renderRef.current?.();
  }, [currentMSE, intercept, slope]);

  const jumpToMinimum = () => {
    setSlope(optimum.slope);
    setIntercept(optimum.intercept);
  };

  const config = LINEAR_REGRESSION_COST_LANDSCAPE;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Optimization geometry</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Every slope and intercept has a cost</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          For this dataset, mean squared error forms a convex surface over slope and intercept. Move the red marker, then drag the 3D view. The OLS solution is the lowest point of this surface.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.55fr_1.45fr]">
        <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <label className="flex justify-between gap-4 text-sm font-bold text-slate-700">
              Slope (m)
              <span className="font-mono text-indigo-700">{slope.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={config.slope.min}
              max={config.slope.max}
              step={config.slope.step}
              value={slope}
              onChange={(event) => setSlope(Number(event.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
            />
          </div>

          <div>
            <label className="flex justify-between gap-4 text-sm font-bold text-slate-700">
              Intercept (b)
              <span className="font-mono text-indigo-700">{intercept.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={config.intercept.min}
              max={config.intercept.max}
              step={config.intercept.step}
              value={intercept}
              onChange={(event) => setIntercept(Number(event.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-black uppercase text-slate-500">Current MSE</p>
              <strong className="mt-1 block font-mono text-xl text-slate-950">{currentMSE.toFixed(3)}</strong>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-black uppercase text-emerald-700">Minimum MSE</p>
              <strong className="mt-1 block font-mono text-xl text-emerald-950">{optimumMSE.toFixed(3)}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={jumpToMinimum}
            className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-black text-white"
          >
            Jump to OLS minimum
          </button>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <strong className="text-slate-950">Read the surface:</strong> left/right changes slope, depth changes intercept, and height is MSE. Lower is better.
          </div>
        </aside>

        <section className="overflow-hidden rounded-xl border border-slate-300 bg-slate-50 shadow-inner">
          <div ref={containerRef} className="relative h-[360px] w-full sm:h-[440px] xl:h-[520px]">
            <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              Drag to rotate · red dot = current parameters
            </div>
          </div>
        </section>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-950">
        <p className="text-xs font-black uppercase tracking-wide">Why this bowl matters</p>
        <p className="mt-2 text-sm leading-6">
          With ordinary linear regression and squared error, this parameter surface has one global minimum when the design is identifiable. Gradient-based optimization is therefore searching a well-behaved objective here—not a landscape full of local minima.
        </p>
      </div>
    </div>
  );
}
