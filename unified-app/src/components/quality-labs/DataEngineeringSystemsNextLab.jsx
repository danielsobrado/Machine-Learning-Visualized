import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS } from './p1SystemsNextConstants.js';
import {
  buildLateArrivalFeature,
  joinSlowlyChangingDimension,
} from './p1SystemsNextModel.js';

export default function DataEngineeringSystemsNextLab() {
  const [predictionTime, setPredictionTime] = useState(DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.predictionTime);
  const dimension = useMemo(() => joinSlowlyChangingDimension({
    dimensionVersions: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.dimensionVersions,
    eventTime: predictionTime,
    latestAsOf: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.latestAsOf,
  }), [predictionTime]);
  const feature = useMemo(() => buildLateArrivalFeature({
    events: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.events,
    predictionTime,
    featureWindowHours: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.featureWindowHours,
  }), [predictionTime]);

  return (
    <>
      <Plate
        label="Slowly changing dimensions"
        title="Historical training rows need the dimension value that was true then"
        note="The latest customer segment is not automatically the segment that existed at prediction time. Move the prediction timestamp across the SCD boundary."
      >
        <ControlBench label="Historical replay">
          <Slider label="Prediction time" value={predictionTime} min={6} max={14} step={1} onChange={setPredictionTime} format={(value) => `t=${value}`} />
        </ControlBench>
        <Readouts columns={3} items={[
          { label: 'Point-in-time segment', value: dimension.pointInTime.segment, detail: 'SCD Type 2 as-of join' },
          { label: 'Latest segment', value: dimension.latest.segment, detail: `value visible at t=${DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.latestAsOf}` },
          { label: 'Historical leakage', value: dimension.leaked ? 'YES' : 'NO', detail: 'latest value differs from historical truth' },
        ]} />
        <Note tone={dimension.leaked ? 'danger' : 'good'} title={dimension.leaked ? 'Latest-value join rewrites history' : 'Latest and historical values agree at this timestamp'}>
          A feature store must join dimensions by effective time. Using the newest row can silently give old examples information that did not exist when the prediction was made.
        </Note>
      </Plate>

      <Plate
        label="Late-arriving events"
        title="Event time alone is not enough for leakage-safe reconstruction"
        note={`The feature counts events in the previous ${DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.featureWindowHours} hours. A late event may belong to the window by event time but still have been unknown at prediction time.`}
      >
        <Readouts columns={4} items={[
          { label: 'Event-time-only count', value: feature.eventTimeOnlyCount, detail: 'what a naive offline rebuild sees' },
          { label: 'Actually known then', value: feature.pointInTimeCount, detail: 'arrival time ≤ prediction time' },
          { label: 'Late events', value: feature.lateEventCount, detail: feature.lateEventIds.join(', ') || 'none' },
          { label: 'Leakage delta', value: feature.leakageDelta, detail: 'future-known events added offline' },
        ]} />
        <NoteRow>
          <Note tone="accent" title="Online feature">Use only events known by the serving timestamp, even if another event later arrives with an older event time.</Note>
          <Note tone="warn" title="Backfill policy">Late data can update future training snapshots, but the reconstructed historical feature must preserve what was actually knowable at the original decision time.</Note>
        </NoteRow>
      </Plate>
    </>
  );
}
