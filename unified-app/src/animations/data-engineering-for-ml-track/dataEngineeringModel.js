import {
  BASE_EVENT_COUNT,
  ENTITY_COUNT,
  EXPECTED_SCHEMA_VERSION,
  PREDICTION_TIMES,
} from './dataEngineeringConfig.js';

function hash01(value, salt = 0) {
  const x = Math.sin((value + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function transformValue(value, version) {
  if (version === 'v2') return Math.log1p(Math.max(0, value));
  return value / 10;
}

export function generateEvents(scenario) {
  const events = [];
  for (let i = 0; i < BASE_EVENT_COUNT; i += 1) {
    const entityId = `E${(i % ENTITY_COUNT) + 1}`;
    const eventTime = Math.floor(i / ENTITY_COUNT) * 6 + (i % ENTITY_COUNT);
    const isLate = hash01(i, 1) < scenario.lateArrivalRate / 100;
    const delay = isLate ? 8 + Math.floor(hash01(i, 2) * 18) : Math.floor(hash01(i, 3) * 3);
    const schemaVersion = hash01(i, 4) < scenario.schemaDriftRate / 100 ? 2 : EXPECTED_SCHEMA_VERSION;
    const value = 40 + (i % ENTITY_COUNT) * 7 + Math.sin(i / 4) * 12 + Math.floor(hash01(i, 5) * 8);
    const base = {
      eventId: `evt-${i}`,
      entityId,
      eventTime,
      availableAt: eventTime + delay,
      schemaVersion,
      value: Number(value.toFixed(2)),
      duplicate: false,
    };
    events.push(base);
    if (hash01(i, 6) < scenario.duplicateRate / 100) {
      events.push({ ...base, duplicate: true, availableAt: base.availableAt + 1 });
    }
  }
  return events.sort((a, b) => a.availableAt - b.availableAt || a.eventId.localeCompare(b.eventId));
}

export function enforceContracts(events) {
  const seen = new Set();
  const accepted = [];
  let duplicates = 0;
  let schemaRejects = 0;

  for (const event of events) {
    if (seen.has(event.eventId)) {
      duplicates += 1;
      continue;
    }
    seen.add(event.eventId);
    if (event.schemaVersion !== EXPECTED_SCHEMA_VERSION || !Number.isFinite(event.value)) {
      schemaRejects += 1;
      continue;
    }
    accepted.push(event);
  }
  return { accepted, duplicates, schemaRejects };
}

function latestForEntity(events, entityId, predictionTime, pointInTime) {
  return events
    .filter((event) => event.entityId === entityId)
    .filter((event) => event.eventTime <= predictionTime)
    .filter((event) => !pointInTime || event.availableAt <= predictionTime)
    .sort((a, b) => b.eventTime - a.eventTime || b.availableAt - a.availableAt)[0] || null;
}

export function buildJoinRows(events, freshnessSla) {
  const rows = [];
  for (const predictionTime of PREDICTION_TIMES) {
    for (let entity = 1; entity <= ENTITY_COUNT; entity += 1) {
      const entityId = `E${entity}`;
      const safe = latestForEntity(events, entityId, predictionTime, true);
      const hindsight = latestForEntity(events, entityId, predictionTime, false);
      const leaked = Boolean(hindsight && hindsight.availableAt > predictionTime);
      const age = safe ? predictionTime - safe.eventTime : Infinity;
      rows.push({
        entityId,
        predictionTime,
        safe,
        hindsight,
        leaked,
        fresh: Boolean(safe && age <= freshnessSla),
        age,
      });
    }
  }
  return rows;
}

export function computeTrainServeSkew(rows, serveTransform) {
  const comparable = rows.filter((row) => row.safe);
  if (comparable.length === 0) return 0;
  const absoluteDiff = comparable.reduce((total, row) => {
    const train = transformValue(row.safe.value, 'v1');
    const serve = transformValue(row.safe.value, serveTransform);
    return total + Math.abs(train - serve);
  }, 0);
  return absoluteDiff / comparable.length;
}

export function buildDataEngineeringLab(scenario) {
  const rawEvents = generateEvents(scenario);
  const contract = enforceContracts(rawEvents);
  const rows = buildJoinRows(contract.accepted, scenario.freshnessSla);
  const joined = rows.filter((row) => row.safe).length;
  const fresh = rows.filter((row) => row.fresh).length;
  const leakageRows = rows.filter((row) => row.leaked).length;
  const skewMae = computeTrainServeSkew(rows, scenario.serveTransform);
  const sampleRows = rows.filter((row) => row.hindsight || row.safe).slice(-12);

  return {
    rawEvents,
    acceptedEvents: contract.accepted,
    rows,
    sampleRows,
    metrics: {
      rawCount: rawEvents.length,
      acceptedCount: contract.accepted.length,
      duplicates: contract.duplicates,
      schemaRejects: contract.schemaRejects,
      joined,
      missing: rows.length - joined,
      freshnessRate: joined === 0 ? 0 : fresh / joined,
      leakageRows,
      leakageRate: rows.length === 0 ? 0 : leakageRows / rows.length,
      skewMae,
    },
  };
}
