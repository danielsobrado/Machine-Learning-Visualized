export const CLUSTER_DEFAULTS = {
  eventRate: 0.25,
  clusterCount: 50,
  observationsPerCluster: 20,
  intraclassCorrelation: 0.1,
  confidenceZ: 1.96,
};

export const CLUSTER_LIMITS = {
  eventRate: { min: 0.05, max: 0.95, step: 0.01 },
  clusterCount: { min: 10, max: 200, step: 5 },
  observationsPerCluster: { min: 1, max: 50, step: 1 },
  intraclassCorrelation: { min: 0, max: 0.5, step: 0.01 },
};
