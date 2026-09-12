import {
  BASE_EVENT_COUNT,
  ENTITY_COUNT,
  EXPECTED_SCHEMA_VERSION,
  PREDICTION_TIMES,
  SCHEMA_COMPATIBILITY,
  SCHEMA_CONTRACT_VERSION,
  TRAIN_TRANSFORM,
  TRANSFORMS,
} from './dataEngineeringConfig.js';

function hash01(value, salt = 0) {
  const x = Math.sin((value + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function validateRate(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${name} must be between 0 and 100.`);
  }
}

function validateScenario(scenario) {
  if (!scenario || typeof scenario !== 'object') throw new TypeError('scenario must be an object.');
  validateRate(scenario.lateArrivalRate, 'lateArrivalRate');
  validateRate(scenario.duplicateRate, 'duplicateRate');
  validateRate(scenario.schemaDriftRate, 'schemaDriftRate');
  if (!Number.isFinite(scenario.freshnessSla) || scenario.freshnessSla <= 0) {
    throw new RangeError('freshnessSla must be positive.');
  }
  if (!TRANSFORMS.some((transform) => transform.id === scenario.serveTransform)) {
    throw new RangeError(`Unknown serving transform: ${scenario.serveTransform}`);
  }
}

function transformValue(value, version) {
  if (!Number.isFinite(value)) throw new TypeError('feature value must be finite.');
  if (version === 'v1') return value / 10;
  if (version === 'v2') return Math.log1p(Math.max(0, value));
  throw new RangeError(`Unknown transform version: ${version}`);
}

function schemaVersionForEvent(index, driftRate) {
  if (hash01(index, 4) >= driftRate / 100) return EXPECTED_SCHEMA_VERSION;
  return hash01(index, 7) < 0.6 ? 2 : 3;
}

export function generateEvents(scenario) {
  validateScenario(scenario);
  const events = [];
  for (let i = 0; i < BASE_EVENT_COUNT; i += 1) {
    const entityId = `E${(i % ENTITY_COUNT) + 1}`;
    const eventTime = Math.floor(i / ENTITY_COUNT) * 6 + (i % ENTITY_COUNT);
    const isLate = hash01(i, 1) < scenario.lateArrivalRate / 100;
    const delay = isLate ? 8 + Math.floor(hash01(i, 2) * 18) : Math.floor(hash01(i, 3) * 3);
    const schemaVersion = schemaVersionForEvent(i, scenario.schemaDriftRate);
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
  if (!Array.isArray(events)) throw new TypeError('events must be an array.');
  const seen = new Set();
  const accepted = [];
  let duplicates = 0;
  let schemaRejects = 0;
  let compatibleSchemaAccepts = 0;

  for (const event of events) {
    if (!event?.eventId) throw new TypeError('every event must have an eventId.');
    if (seen.has(event.eventId)) {
      duplicates += 1;
      continue;
    }
    seen.add(event.eventId);

    const compatibility = SCHEMA_COMPATIBILITY[event.schemaVersion];
    if (!compatibility || compatibility === 'incompatible' || !Number.isFinite(event.value)) {
      schemaRejects += 1;
      continue;
    }
    if (compatibility === 'compatible') compatibleSchemaAccepts += 1;
    accepted.push(event);
  }
  return { accepted, duplicates, schemaRejects, compatibleSchemaAccepts };
}

function latestForEntity(events, entityId, predictionTime, pointInTime) {
  return events
    .filter((event) => event.entityId === entityId)
    .filter((event) => event.eventTime <= predictionTime)
    .filter((event) => !pointInTime || event.availableAt <= predictionTime)
    .sort((a, b) => b.eventTime - a.eventTime || b.availableAt - a.availableAt)[0] || null;
}

export function buildJoinRows(events, freshnessSla) {
  if (!Array.isArray(events)) throw new TypeError('events must be an array.');
  if (!Number.isFinite(freshnessSla) || freshnessSla <= 0) throw new RangeError('freshnessSla must be positive.');
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
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array.');
  if (!TRANSFORMS.some((transform) => transform.id === serveTransform)) {
    throw new RangeError(`Unknown serving transform: ${serveTransform}`);
  }
  const comparable = rows.filter((row) => row.safe);
  if (comparable.length === 0) return 0;
  const absoluteDiff = comparable.reduce((total, row) => {
    const train = transformValue(row.safe.value, TRAIN_TRANSFORM);
    const serve = transformValue(row.safe.value, serveTransform);
    return total + Math.abs(train - serve);
  }, 0);
  return absoluteDiff / comparable.length;
}

function rowSnapshot(row, source) {
  const event = row[source];
  return `${row.entityId}@${row.predictionTime}:${event ? `${event.eventId}:${event.value}` : 'missing'}`;
}

function stableChecksum(parts) {
  let checksum = 2166136261;
  for (const char of parts.join('|')) {
    checksum ^= char.charCodeAt(0);
    checksum = Math.imul(checksum, 16777619) >>> 0;
  }
  return checksum.toString(16).padStart(8, '0');
}

export function buildBackfillAudit(rows) {
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array.');
  const changedRows = rows.filter((row) => (row.safe?.eventId ?? null) !== (row.hindsight?.eventId ?? null));
  const pointInTimeChecksum = stableChecksum(rows.map((row) => rowSnapshot(row, 'safe')));
  const hindsightChecksum = stableChecksum(rows.map((row) => rowSnapshot(row, 'hindsight')));
  return {
    changedRows: changedRows.length,
    stable: changedRows.length === 0,
    pointInTimeChecksum,
    hindsightChecksum,
  };
}

export function buildDataEngineeringLab(scenario) {
  validateScenario(scenario);
  const rawEvents = generateEvents(scenario);
  const contract = enforceContracts(rawEvents);
  const rows = buildJoinRows(contract.accepted, scenario.freshnessSla);
  const joined = rows.filter((row) => row.safe).length;
  const fresh = rows.filter((row) => row.fresh).length;
  const leakageRows = rows.filter((row) => row.leaked).length;
  const skewMae = computeTrainServeSkew(rows, scenario.serveTransform);
  const sampleRows = rows.filter((row) => row.hindsight || row.safe).slice(-12);
  const backfillAudit = buildBackfillAudit(rows);

  return {
    rawEvents,
    acceptedEvents: contract.accepted,
    rows,
    sampleRows,
    backfillAudit,
    manifest: {
      schemaContract: SCHEMA_CONTRACT_VERSION,
      trainingTransform: TRAIN_TRANSFORM,
      servingTransform: scenario.serveTransform,
      cutoffRule: 'event time and availability time must both precede prediction time',
      datasetChecksum: backfillAudit.pointInTimeChecksum,
    },
    metrics: {
      rawCount: rawEvents.length,
      acceptedCount: contract.accepted.length,
      duplicates: contract.duplicates,
      schemaRejects: contract.schemaRejects,
      compatibleSchemaAccepts: contract.compatibleSchemaAccepts,
      joined,
      missing: rows.length - joined,
      freshnessRate: joined === 0 ? 0 : fresh / joined,
      leakageRows,
      leakageRate: rows.length === 0 ? 0 : leakageRows / rows.length,
      skewMae,
      backfillChangedRows: backfillAudit.changedRows,
    },
  };
}
