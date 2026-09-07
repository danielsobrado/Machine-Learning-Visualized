import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters, QWEN_SOURCE, QWEN_REPO, qsaRead, gatedUpdate, hashNgram, expertBudget, trainingSteps, taskCost } from '../../data/qwenNext';
import './qwen.css';

const fmt = n => Number(n.toFixed(2));
function Track({ label, value, max, unit = '' }) {
  return <div className="qw-track"><span>{label}</span><div><i style={{ width: `${Math.min(100, value / max * 100)}%` }} /></div><strong>{fmt(value)}{unit}</strong></div>;
}
function Experiment({ chapter, values }) {
  if (chapter.id === 'qwen-hybrid-qsa') {
    const ranked = [5, 1, 7, 3, 0, 6, 2, 4];
    const selected = ranked.slice(0, values.budget);
    const read = qsaRead(32, 4, values.budget);
    return <><div className="qw-flow"><span>Running state (DeltaNet)</span><span>+ selected detail (QSA)</span><span>→ next representation</span></div><div className="qw-blocks">{Array.from({ length: 8 }, (_, i) => <div key={i} className={selected.includes(i) ? 'selected' : ''}><strong>Block {i}</strong><small>T{i * 4}–T{i * 4 + 3}</small><span>{selected.includes(i) ? 'Read' : 'Skip'}</span></div>)}</div><p>Fixed relevance order: 5 → 1 → 7 → 3 → 0 → 6 → 2 → 4. All 32 positions precede this toy query.</p><Track label="Dense token reads" value={32} max={32} /><Track label="Selected token reads" value={read} max={32} /><p><strong>{read / 32 * 100}%</strong> of dense reads. All eight blocks still exist in this toy cache.</p></>;
  }
  if (chapter.id === 'qwen-gated-residual') {
    const result = gatedUpdate([2, 4], [values.read, 0.25], values.write);
    return <><div className="qw-flow"><span>x = [2, 4]</span><span>→ read [{fmt(2 * values.read)}, 1]</span><span>→ identity F</span><span>→ scale by {values.write}</span><span>→ add x</span></div><Track label="First output coordinate" value={result[0]} max={8} /><Track label="Second output coordinate" value={result[1]} max={8} /><p>Output: <strong>[{result.map(fmt).join(', ')}]</strong>. The second read gate remains 0.25; the write scalar controls both update coordinates.</p></>;
  }
  if (chapter.id === 'qwen-ngram-embedding') {
    const row = hashNgram([1, values.token], values.buckets);
    const collision = hashNgram([1, values.token + values.buckets], values.buckets);
    return <><div className="qw-flow"><span>IDs [1, {values.token}]</span><span>→ (31 + {values.token}) mod {values.buckets}</span><span>→ row {row}</span><span>→ learned vector</span></div><div className="qw-blocks">{Array.from({ length: values.buckets }, (_, i) => <div className={i === row ? 'selected' : ''} key={i}><strong>Row {i}</strong><small>{i === row ? 'Lookup' : 'Stored'}</small></div>)}</div><p>[1, {values.token + values.buckets}] also hashes to row <strong>{collision}</strong>. This is an intentional collision example. Table contents would be learned; addresses are calculated.</p></>;
  }
  if (chapter.id === 'qwen-multimodal-moe') {
    const budget = expertBudget(512, values.active);
    return <><div className="qw-flow"><span>Text / visual representations</span><span>→ router → chosen experts</span><span>+ shared path → merge</span></div><div className="qw-experts" aria-label={`${budget.active} highlighted out of 512 stored expert slots`}>{Array.from({ length: 512 }, (_, i) => <i key={i} className={i < budget.active ? 'selected' : ''} />)}</div><p><strong>{budget.active} / 512 = {fmt(budget.fraction * 100)}%</strong> routed selection. Orange marks active slots, arranged first for visibility rather than showing learned router scores. The shared path is additional and not drawn in this grid.</p><Track label="Stored routed slots" value={512} max={512} /><Track label="Active routed slots" value={values.active} max={512} /></>;
  }
  if (chapter.id === 'qwen-training-recipe') {
    const constant = trainingSteps(1024, values.batch);
    const warm = trainingSteps(512, values.batch / 4) + trainingSteps(512, values.batch);
    return <><div className="qw-flow"><span>Fixed budget: 1,024 tokens</span><span>→ batch / accumulate</span><span>→ optimizer updates</span></div><Track label="Constant target batch" value={constant} max={40} unit=" updates" /><Track label="Toy two-phase batch warmup" value={warm} max={40} unit=" updates" /><p>Warmup illustration: first 512 tokens at batch {values.batch / 4}, then 512 at batch {values.batch}. Neither bar predicts training quality or total FLOPs.</p></>;
  }
  const low = taskCost(2, values.success);
  return <><div className="qw-flow"><span>Attempt → verify</span><span>Success: finish</span><span>Failure: retry</span></div><Track label="Low: 2 s per attempt" value={low} max={20} unit=" s expected" /><Track label="xhigh: 5 s, p = 1" value={5} max={20} unit=" s expected" /><p><strong>{Math.abs(low - 5) < 1e-9 ? 'Tie' : low < 5 ? 'Low is faster in this toy' : 'xhigh is faster in this toy'}</strong>. Break-even is p = 2 / 5 = 0.4. These invented numbers assume independent, unlimited retries.</p></>;
}

export function QwenCompanion({ chapter, sectionId }) {
  if (sectionId === 'glossary') return <div className="qw-course"><h2>Words to know</h2><dl className="qw-terms">{chapter.terms.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl><p>Apply these terms to the worked example, then explain it without looking at the definitions.</p></div>;
  if (sectionId === 'concept-map') return <div className="qw-course"><h2>Connect the mechanism</h2><p>{chapter.objective}</p><div className="qw-concept-map">{chapter.sections.map(([title, body], i) => <article key={title}><span className="qw-eyebrow">{i + 1} · {i === 0 ? 'Start here' : 'Then ask'}</span><h3>{title}</h3><p>{body}</p>{i < chapter.sections.length - 1 && <span aria-hidden="true">↓</span>}</article>)}</div><h3>Connect it to the whole system</h3><nav className="qw-nav" aria-label="Related Qwen chapters">{chapters.filter(c => c.id !== chapter.id).map(c => <Link key={c.id} to={`/animation/${c.id}`}>{c.title}<small>{c.short}</small></Link>)}</nav><p><strong>Explain the connection:</strong> Which chapter changes training, which changes stored capacity, and which gives a serving-time control?</p></div>;
  return null;
}

export default function QwenChapter({ chapterId }) {
  const chapter = chapters.find(c => c.id === chapterId);
  const index = chapters.indexOf(chapter);
  const defaults = () => Object.fromEntries(chapter.controls.map(c => [c.id, c.value]));
  const [values, setValues] = useState(defaults);
  return <div className="qw-course">
    <header className="qw-intro"><span className="qw-eyebrow">Qwen Flash-Next · Chapter {index + 1} of 6 · {chapter.minutes} minutes</span><h2>{chapter.short}</h2><p>{chapter.analogy}</p><p><strong>By the end:</strong> {chapter.objective}</p></header>
    <nav className="qw-nav" aria-label="Qwen chapter navigation">{chapters.map((c, i) => <Link key={c.id} aria-current={c.id === chapterId ? 'page' : undefined} to={`/animation/${c.id}`}><span>{i + 1}. {c.title}</span></Link>)}</nav>
    <aside className="qw-source"><strong>Published architecture · verified September 7, 2026</strong><p>{chapter.fact}</p><a href={QWEN_SOURCE} target="_blank" rel="noreferrer">Official model card ↗</a> · <a href={QWEN_REPO} target="_blank" rel="noreferrer">Official repository ↗</a></aside>
    <div className="qw-reading">{chapter.sections.map(([title, text], i) => <section key={title}><span className="qw-eyebrow">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></section>)}</div>
    <section className="qw-panel"><h3>Work one example by hand</h3><code className="qw-formula">{chapter.formula}</code><p>{chapter.worked}</p></section>
    <section className="qw-panel qw-lab" aria-label="Interactive experiment"><div className="qw-toolbar"><h3>Predict, then experiment</h3><button type="button" onClick={() => setValues(defaults())}>Reset experiment</button></div><p>{chapter.experiment}</p><div className="qw-controls">{chapter.controls.map(control => <label key={control.id} htmlFor={`${chapter.id}-${control.id}`}><span>{control.label}: <strong>{values[control.id]}</strong></span><input id={`${chapter.id}-${control.id}`} type="range" min={control.min} max={control.max} step={control.step} value={values[control.id]} onChange={e => setValues(v => ({ ...v, [control.id]: Number(e.target.value) }))} /></label>)}</div><div className="qw-results" aria-live="polite"><Experiment chapter={chapter} values={values} /></div><p className="qw-caption">Teaching simulation · simplified mechanics · no model execution or measured performance</p></section>
    <aside className="qw-source"><h3>A mistake to avoid</h3><p>{chapter.trap}</p></aside>
    <section className="qw-practice"><h3>Practice before revealing the answer</h3><p>Write a prediction and one sentence explaining why. Use the solution to check the reasoning, not just the number.</p>{chapter.exercises.map(([title, prompt, solution], i) => <article key={title}><h4>{i + 1}. {title}</h4><p>{prompt}</p><details><summary>Reveal worked solution</summary><p>{solution}</p></details></article>)}</section>
    {chapterId === 'qwen-reasoning-control' && <section className="qw-panel"><h3>Read the request shape</h3><p>The official card places effort at the request’s top level and thinking options inside chat template arguments for its compatible serving example. This illustrative fragment makes no network request.</p><pre>{JSON.stringify({ model: 'Qwen/Qwen3.8-Flash-Next', messages: [{ role: 'user', content: 'Check this solution and explain any error.' }], reasoning_effort: 'medium', extra_body: { chat_template_kwargs: { enable_thinking: true, preserve_thinking: true } } }, null, 2)}</pre><p>Qwen Cloud uses a different placement for thinking flags; follow the model card and serving documentation.</p></section>}
    <section className="qw-panel"><h3>Test what you can explain</h3><p>Answer six core questions, then implement two small algorithms with executable tests. The lesson check also contains 94 optional numerical drills in four skill families for extra practice. Revisit any step you cannot explain without the page.</p><div className="qw-actions"><Link to={`/animation/${chapterId}/questions`}>Open lesson check →</Link><Link to={`/animation/${chapterId}/code`}>Open coding exercises →</Link></div></section>
    <footer className="qw-actions">{index > 0 && <Link to={`/animation/${chapters[index - 1].id}`}>← {chapters[index - 1].title}</Link>}{index < chapters.length - 1 && <Link to={`/animation/${chapters[index + 1].id}`}>Next: {chapters[index + 1].title} →</Link>}</footer>
  </div>;
}
