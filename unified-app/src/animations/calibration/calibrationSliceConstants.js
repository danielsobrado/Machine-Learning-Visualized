export const CALIBRATION_SLICE_EXAMPLE = Object.freeze({
  title: 'Aggregate calibration can hide broken segments',
  detail: 'Two equally sized deployment segments fail in opposite directions, so their errors cancel when pooled.',
  slices: Object.freeze([
    {
      id: 'segment-a',
      label: 'Segment A',
      short: 'Systematically overconfident',
      bins: Object.freeze([
        { confidence: 0.2, observed: 0.1, count: 25 },
        { confidence: 0.4, observed: 0.25, count: 25 },
        { confidence: 0.6, observed: 0.45, count: 25 },
        { confidence: 0.8, observed: 0.65, count: 25 },
      ]),
    },
    {
      id: 'segment-b',
      label: 'Segment B',
      short: 'Systematically underconfident',
      bins: Object.freeze([
        { confidence: 0.2, observed: 0.3, count: 25 },
        { confidence: 0.4, observed: 0.55, count: 25 },
        { confidence: 0.6, observed: 0.75, count: 25 },
        { confidence: 0.8, observed: 0.95, count: 25 },
      ]),
    },
  ]),
});
