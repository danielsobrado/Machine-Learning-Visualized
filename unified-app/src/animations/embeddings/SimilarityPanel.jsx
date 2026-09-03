import React, { useState } from 'react';

export default function SimilarityPanel() {
  const [angle, setAngle] = useState(45);
  const rad = (angle * Math.PI) / 180;
  const cosineSim = Math.cos(rad);
  const r = 150;
  const v1 = { x: r, y: 0 };
  const v2 = { x: r * Math.cos(rad), y: -r * Math.sin(rad) };

  const getLabel = (sim) => {
    if (sim > 0.9) return 'Strong directional alignment';
    if (sim > 0.5) return 'Moderate directional alignment';
    if (sim > -0.1 && sim < 0.1) return 'Near-orthogonal geometry';
    if (sim < -0.9) return 'Strong opposite direction';
    return 'Weak / negative directional alignment';
  };

  const similarityTone = cosineSim > 0.5 ? 'is-related' : cosineSim < -0.5 ? 'is-opposite' : 'is-neutral';

  return (
    <div className="embeddings-similarity-panel">
      <div className="embeddings-similarity-intro">
        <h2>Similarity Lab</h2>
        <p>
          Cosine similarity measures the angle between embedding vectors. Whether that geometry corresponds to useful semantic similarity depends on how the embedding space was trained and evaluated.
        </p>
      </div>

      <div className="embeddings-similarity-body">
        <div className="embeddings-similarity-figure" aria-label="Two embedding vectors with adjustable angle">
          <svg viewBox="-210 -210 420 420" role="img">
            <defs>
              <marker id="similarity-arrow-a" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--ds-mute)" />
              </marker>
              <marker id="similarity-arrow-b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--ds-accent)" />
              </marker>
              <pattern id="similarity-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--ds-grid)" strokeWidth="0.8" />
              </pattern>
            </defs>

            <rect x="-210" y="-210" width="420" height="420" fill="url(#similarity-grid)" />
            <line x1="-190" y1="0" x2="190" y2="0" stroke="var(--ds-rule)" strokeWidth="1" />
            <line x1="0" y1="-190" x2="0" y2="190" stroke="var(--ds-rule)" strokeWidth="1" />
            <circle cx="0" cy="0" r="5" fill="var(--ds-ink)" />

            <line x1="0" y1="0" x2={v1.x} y2={v1.y} stroke="var(--ds-mute)" strokeWidth="4" markerEnd="url(#similarity-arrow-a)" />
            <text x={v1.x - 18} y={v1.y - 16} fill="var(--ds-mute)" fontWeight="700" textAnchor="middle">Vector A</text>

            <line x1="0" y1="0" x2={v2.x} y2={v2.y} stroke="var(--ds-accent)" strokeWidth="4" markerEnd="url(#similarity-arrow-b)" />
            <text x={v2.x * 1.18} y={v2.y * 1.18} fill="var(--ds-accent)" fontWeight="700" textAnchor="middle">Vector B</text>

            <path d={`M 52 0 A 52 52 0 ${angle > 180 ? 1 : 0} 0 ${52 * Math.cos(-rad)} ${52 * Math.sin(-rad)}`} fill="none" stroke="var(--ds-warm)" strokeWidth="2" strokeDasharray="4 4" />
            <text x="62" y="-18" fill="var(--ds-warm)" fontSize="12" fontWeight="700">{angle} deg</text>
          </svg>
        </div>

        <aside className="embeddings-similarity-readout">
          <label className="embeddings-similarity-control" htmlFor="embedding-angle">
            <span>Angle</span>
            <strong>{angle} deg</strong>
            <input id="embedding-angle" type="range" min="0" max="180" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
          </label>

          <div className={`embeddings-similarity-score ${similarityTone}`}>
            <span>Cosine similarity</span>
            <strong>{cosineSim.toFixed(3)}</strong>
            <em>{getLabel(cosineSim)}</em>
          </div>

          <dl className="embeddings-similarity-scale">
            <div><dt>1.0</dt><dd>Same direction, 0 deg</dd></div>
            <div><dt>0.0</dt><dd>Orthogonal directions, 90 deg</dd></div>
            <div><dt>-1.0</dt><dd>Opposite directions, 180 deg</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-slate-600">These labels describe vector geometry only. They do not by themselves prove synonymy, unrelatedness, or antonymy.</p>
        </aside>
      </div>
    </div>
  );
}
