import {
  LINEAR_REGRESSION_COST_LANDSCAPE,
  LINEAR_REGRESSION_INTERACTIVE_PLOT,
} from './linearRegressionConstants.js';

export function interactivePlotBounds(config = LINEAR_REGRESSION_INTERACTIVE_PLOT) {
  const { viewBox, margin } = config;
  return Object.freeze({
    left: margin.left,
    right: viewBox.width - margin.right,
    top: margin.top,
    bottom: viewBox.height - margin.bottom,
  });
}

export function regressionPointFromViewBox(svgX, svgY, config = LINEAR_REGRESSION_INTERACTIVE_PLOT) {
  const bounds = interactivePlotBounds(config);
  if (svgX < bounds.left || svgX > bounds.right || svgY < bounds.top || svgY > bounds.bottom) return null;

  const [xMin, xMax] = config.domain.x;
  const [yMin, yMax] = config.domain.y;
  const xRatio = (svgX - bounds.left) / (bounds.right - bounds.left);
  const yRatio = (svgY - bounds.top) / (bounds.bottom - bounds.top);

  return {
    x: xMin + xRatio * (xMax - xMin),
    y: yMax - yRatio * (yMax - yMin),
  };
}

export function regressionPointToViewBox(point, config = LINEAR_REGRESSION_INTERACTIVE_PLOT) {
  const bounds = interactivePlotBounds(config);
  const [xMin, xMax] = config.domain.x;
  const [yMin, yMax] = config.domain.y;

  return {
    x: bounds.left + ((point.x - xMin) / (xMax - xMin)) * (bounds.right - bounds.left),
    y: bounds.bottom - ((point.y - yMin) / (yMax - yMin)) * (bounds.bottom - bounds.top),
  };
}

export function costParameterFromSurfaceCoordinate(
  coordinate,
  range,
  config = LINEAR_REGRESSION_COST_LANDSCAPE,
) {
  const halfSize = config.surface.size / 2;
  const ratio = (coordinate + halfSize) / config.surface.size;
  return range.min + ratio * (range.max - range.min);
}

export function costLandscapeWorldPosition(
  { slope, intercept, mse },
  config = LINEAR_REGRESSION_COST_LANDSCAPE,
) {
  const halfSize = config.surface.size / 2;
  const slopeRatio = (slope - config.slope.min) / (config.slope.max - config.slope.min);
  const interceptRatio = (intercept - config.intercept.min) / (config.intercept.max - config.intercept.min);

  return {
    x: slopeRatio * config.surface.size - halfSize,
    y: mse / config.surface.heightScale,
    z: -(interceptRatio * config.surface.size - halfSize),
  };
}
