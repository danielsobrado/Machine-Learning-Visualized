import React from 'react';
import { Link } from 'react-router-dom';

const NODE_W = 168;
const NODE_H = 58;
const COL_GAP = 62;
const ROW_GAP = 20;
const PAD_X = 4;
const PAD_Y = 18;

// Walk prerequisite edges backwards so off-path ancestors join the drawing.
function collectAncestors(seedIds, animationById, levels) {
  const included = new Set(seedIds);
  let frontier = seedIds;
  for (let level = 0; level < levels; level += 1) {
    const next = [];
    frontier.forEach((id) => {
      (animationById.get(id)?.prerequisites || []).forEach((prereqId) => {
        if (!animationById.has(prereqId) || included.has(prereqId)) return;
        included.add(prereqId);
        next.push(prereqId);
      });
    });
    if (!next.length) break;
    frontier = next;
  }
  return included;
}

// Longest-path layering: a lesson sits one column right of its deepest prerequisite.
function layerNodes(ids, edgesByTarget) {
  const depth = new Map();
  const visiting = new Set();

  const resolve = (id) => {
    if (depth.has(id)) return depth.get(id);
    if (visiting.has(id)) return 0; // defensive: data cycles must not hang the render
    visiting.add(id);
    const sources = edgesByTarget.get(id) || [];
    const value = sources.length ? Math.max(...sources.map((source) => resolve(source) + 1)) : 0;
    visiting.delete(id);
    depth.set(id, value);
    return value;
  };

  ids.forEach(resolve);
  return depth;
}

export function buildPrerequisiteGraph({
  pathIds,
  animationById,
  completedLessons,
  showPrerequisites,
  showCompleted,
}) {
  const seed = pathIds.filter((id) => animationById.has(id));
  const included = showPrerequisites ? collectAncestors(seed, animationById, 2) : new Set(seed);
  const visible = [...included].filter((id) => showCompleted || !completedLessons.has(id));
  const visibleSet = new Set(visible);

  const edges = [];
  const edgesByTarget = new Map();
  visible.forEach((id) => {
    (animationById.get(id)?.prerequisites || []).forEach((prereqId) => {
      if (!visibleSet.has(prereqId) || prereqId === id) return;
      edges.push({ from: prereqId, to: id });
      edgesByTarget.set(id, [...(edgesByTarget.get(id) || []), prereqId]);
    });
  });

  const depth = layerNodes(visible, edgesByTarget);
  const orderOnPath = new Map(pathIds.map((id, index) => [id, index]));
  const columns = new Map();
  visible
    .slice()
    .sort((a, b) => (orderOnPath.get(a) ?? 999) - (orderOnPath.get(b) ?? 999) || a.localeCompare(b))
    .forEach((id) => {
      const column = depth.get(id) || 0;
      columns.set(column, [...(columns.get(column) || []), id]);
    });

  const position = new Map();
  [...columns.keys()].sort((a, b) => a - b).forEach((column) => {
    columns.get(column).forEach((id, row) => {
      position.set(id, {
        x: PAD_X + column * (NODE_W + COL_GAP),
        y: PAD_Y + row * (NODE_H + ROW_GAP),
        column,
        row,
      });
    });
  });

  const rows = Math.max(1, ...[...columns.values()].map((ids) => ids.length));
  const cols = columns.size || 1;

  return {
    nodes: visible.map((id) => ({ id, ...position.get(id) })),
    edges,
    width: PAD_X * 2 + cols * NODE_W + (cols - 1) * COL_GAP,
    height: PAD_Y * 2 + rows * NODE_H + (rows - 1) * ROW_GAP,
  };
}

// Orthogonal connector drawn marker-to-marker, turning in the gutter left of the target
// column so edges into the same column share a bus. Node backgrounds occlude any run
// that passes behind an intermediate lesson, which reads as depth rather than a collision.
const ANCHOR_Y = 8;

function edgePath(from, to) {
  const x1 = from.x + NODE_W;
  const y1 = from.y + ANCHOR_Y;
  const x2 = to.x - 6;
  const y2 = to.y + ANCHOR_Y;
  if (Math.abs(y1 - y2) < 1) return `M${x1} ${y1}H${x2}`;
  const gutter = Math.max(x1 + 12, x2 - COL_GAP / 2);
  return `M${x1} ${y1}H${gutter}V${y2}H${x2}`;
}

export default function PrerequisiteMap({
  pathIds,
  animationById,
  completedLessons,
  nextId,
  showPrerequisites,
  showCompleted,
}) {
  const graph = React.useMemo(
    () => buildPrerequisiteGraph({ pathIds, animationById, completedLessons, showPrerequisites, showCompleted }),
    [pathIds, animationById, completedLessons, showPrerequisites, showCompleted],
  );
  const positionById = React.useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph],
  );

  if (!graph.nodes.length) {
    return <p className="ua-map-empty">Every lesson on this route is complete. Turn “show completed” back on to see it.</p>;
  }

  return (
    <div className="ua-prereq-map" role="group" aria-label="Prerequisite graph">
      <div className="ua-prereq-canvas" style={{ width: graph.width, height: graph.height }}>
        <svg className="ua-prereq-edges" width={graph.width} height={graph.height} aria-hidden="true">
          {graph.edges.map((edge) => {
            const from = positionById.get(edge.from);
            const to = positionById.get(edge.to);
            if (!from || !to) return null;
            return (
              <path
                key={`${edge.from}->${edge.to}`}
                className={completedLessons.has(edge.from) ? 'is-met' : ''}
                d={edgePath(from, to)}
              />
            );
          })}
        </svg>
        {graph.nodes.map((node) => {
          const animation = animationById.get(node.id);
          const isComplete = completedLessons.has(node.id);
          const onPath = pathIds.includes(node.id);
          return (
            <Link
              key={node.id}
              to={`/animation/${node.id}`}
              className={[
                'ua-prereq-node',
                isComplete ? 'is-complete' : '',
                node.id === nextId ? 'is-next' : '',
                onPath ? '' : 'is-support',
              ].filter(Boolean).join(' ')}
              style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
            >
              <span className="ua-prereq-mark" aria-hidden="true" />
              <strong>{animation?.name || node.id}</strong>
              <small>{isComplete ? 'complete' : animation?.categoryName}</small>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
