import React, { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  GridHelper,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OPTIMIZERS } from './optimizerConstants.js';
import { loss } from './optimizerModel.js';

const PATH_COLORS = {
  sgd: 0x2563eb,
  momentum: 0xd97706,
  adam: 0x059669,
};

const X_MIN = -5.5;
const X_MAX = 0.5;
const Y_MIN = -0.5;
const Y_MAX = 4;
const HEIGHT_SCALE = 1.15;

function toWorld([x, y], value = loss([x, y])) {
  const compressedHeight = Math.sqrt(Math.max(value, 0)) * HEIGHT_SCALE;
  return {
    x: x + 2.7,
    y: compressedHeight + 0.04,
    z: y - 1.75,
  };
}

function buildSurfaceGeometry() {
  const columns = 74;
  const rows = 58;
  const vertices = [];
  const indices = [];

  for (let row = 0; row <= rows; row += 1) {
    const y = Y_MIN + (row / rows) * (Y_MAX - Y_MIN);
    for (let col = 0; col <= columns; col += 1) {
      const x = X_MIN + (col / columns) * (X_MAX - X_MIN);
      const point = toWorld([x, y]);
      vertices.push(point.x, point.y, point.z);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const a = row * (columns + 1) + col;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makePathLine(path, optimizer, active) {
  const vertices = path.flatMap((point) => {
    const world = toWorld(point.theta, point.loss);
    return [world.x, world.y + (active ? 0.09 : 0.05), world.z];
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  const material = new LineBasicMaterial({
    color: PATH_COLORS[optimizer],
    linewidth: active ? 4 : 2,
    transparent: true,
    opacity: active ? 1 : 0.78,
  });
  return new Line(geometry, material);
}

export default function OptimizerLandscape3D({ paths, activeOptimizer }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 860;
    const height = container.clientHeight || 430;
    const scene = new Scene();
    scene.background = new Color(0xf8fafc);

    const camera = new PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(4.7, 4.25, 6.6);
    camera.lookAt(0, 0.75, 0);

    const renderer = new WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0.75, 0);
    controls.minDistance = 4.2;
    controls.maxDistance = 10;

    const group = new Group();
    scene.add(group);

    const surfaceGeometry = buildSurfaceGeometry();
    const surfaceMaterial = new MeshStandardMaterial({
      color: 0xdbeafe,
      roughness: 0.72,
      metalness: 0.02,
      side: DoubleSide,
      transparent: true,
      opacity: 0.92,
    });
    const surface = new Mesh(surfaceGeometry, surfaceMaterial);
    group.add(surface);

    const grid = new GridHelper(7.5, 10, 0x94a3b8, 0xd6d3d1);
    grid.position.set(-0.1, -0.02, 0.45);
    group.add(grid);

    const pathObjects = Object.entries(paths).map(([optimizer, path]) => {
      const active = optimizer === activeOptimizer;
      const line = makePathLine(path, optimizer, active);
      group.add(line);

      const finalPoint = path[path.length - 1];
      const finalWorld = toWorld(finalPoint.theta, finalPoint.loss);
      const marker = new Mesh(
        new SphereGeometry(active ? 0.11 : 0.075, 20, 20),
        new MeshStandardMaterial({
          color: PATH_COLORS[optimizer],
          emissive: PATH_COLORS[optimizer],
          emissiveIntensity: active ? 0.18 : 0.08,
        }),
      );
      marker.position.set(finalWorld.x, finalWorld.y + 0.14, finalWorld.z);
      group.add(marker);

      return { line, marker };
    });

    const minimumWorld = toWorld([-3, 1]);
    const minimum = new Mesh(
      new SphereGeometry(0.095, 20, 20),
      new MeshStandardMaterial({ color: 0x111827, emissive: 0x111827, emissiveIntensity: 0.12 }),
    );
    minimum.position.set(minimumWorld.x, minimumWorld.y + 0.12, minimumWorld.z);
    group.add(minimum);

    scene.add(new AmbientLight(0xffffff, 0.72));
    const key = new DirectionalLight(0xffffff, 1.1);
    key.position.set(5, 8, 4);
    scene.add(key);
    const fill = new DirectionalLight(0xdbeafe, 0.65);
    fill.position.set(-5, 4, -3);
    scene.add(fill);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const nextWidth = containerRef.current.clientWidth || width;
      const nextHeight = containerRef.current.clientHeight || height;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
      pathObjects.forEach(({ line, marker }) => {
        line.geometry.dispose();
        line.material.dispose();
        marker.geometry.dispose();
        marker.material.dispose();
      });
      minimum.geometry.dispose();
      minimum.material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [paths, activeOptimizer]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">3D optimizer landscape</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Rotate and zoom the same anisotropic quadratic surface. The paths share the current hyperparameters on purpose: compare mechanisms here, not final optimizer quality.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-700">
          {Object.entries(OPTIMIZERS).map(([id, config]) => (
            <span key={id} className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2 py-1">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `#${PATH_COLORS[id].toString(16).padStart(6, '0')}` }} />
              {config.label}
            </span>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="mt-4 h-[340px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:h-[430px]" aria-label="Interactive 3D optimizer loss landscape" />
      <p className="mt-3 text-xs font-semibold text-slate-500">Drag to rotate. Scroll or pinch to zoom.</p>
    </section>
  );
}
