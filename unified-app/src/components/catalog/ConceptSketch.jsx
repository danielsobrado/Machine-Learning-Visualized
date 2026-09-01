import React from 'react';

function Sketch({ kind }) {
  switch (kind) {
    case 'attention':
      return <><text x="4" y="17">Q</text><text x="4" y="38">K</text><text x="4" y="59">V</text><path d="M18 14H54M18 35H54M18 56H111" /><path d="M54 14L72 25M54 35L72 25M72 25H105" /><rect x="105" y="17" width="34" height="16" /><text className="ua-sketch-note" x="110" y="28">softmax</text><path d="M122 33V56M111 56H137" /></>;
    case 'tree':
      return <><circle cx="72" cy="11" r="4" /><path d="M72 15V23M72 23L38 37M72 23L106 37M38 37V51M38 51L20 63M38 51L55 63M106 37V63" /><circle cx="20" cy="64" r="4" /><circle cx="55" cy="64" r="4" /><circle cx="106" cy="64" r="4" /><text className="ua-sketch-note" x="79" y="13">x₁ &lt; .42</text></>;
    case 'classification-boundary':
      return <><path d="M8 62H138M12 66V7" /><g className="cluster-a"><circle cx="31" cy="43" r="3" /><circle cx="43" cy="51" r="3" /><circle cx="51" cy="38" r="3" /><circle cx="62" cy="48" r="3" /></g><g className="cluster-b"><circle cx="88" cy="24" r="3" /><circle cx="101" cy="34" r="3" /><circle cx="112" cy="19" r="3" /><circle cx="120" cy="29" r="3" /></g><path className="accent-line dash" d="M24 16L124 55" /><text className="ua-sketch-note" x="76" y="61">boundary</text></>;
    case 'distribution':
      return <><path d="M8 61H138M12 65V8" /><path className="accent-soft-fill" d="M15 59C31 58 40 55 49 43C58 29 62 13 72 12C82 13 87 31 96 44C106 56 116 58 134 59V61H15Z" /><path className="accent-stroke" d="M15 59C31 58 40 55 49 43C58 29 62 13 72 12C82 13 87 31 96 44C106 56 116 58 134 59" /><path className="muted-stroke dash" d="M72 9V61" /><text className="ua-sketch-note" x="76" y="13">μ</text></>;
    case 'bayes':
      return <><circle className="accent-soft-fill" cx="58" cy="36" r="24" /><circle className="warm-soft-fill" cx="86" cy="36" r="24" /><path className="accent-stroke" d="M70 15C80 23 84 47 72 57" /><text x="39" y="39">A</text><text x="97" y="39">B</text><text className="ua-sketch-note" x="50" y="69">P(A | B)</text></>;
    case 'roc-pr':
      return <><path d="M10 61H137M13 64V7" /><path className="muted-stroke dash" d="M14 60L132 11" /><path className="accent-stroke" d="M14 60C20 29 38 16 66 11C88 8 111 8 133 8" /><path className="rust-stroke" d="M14 60C32 51 44 36 63 29C82 20 105 17 133 15" /><text className="ua-sketch-note" x="105" y="28">ROC</text><text className="ua-sketch-note" x="78" y="45">PR</text></>;
    case 'calibration':
      return <><path d="M10 61H137M13 64V7" /><path className="muted-stroke dash" d="M14 60L132 9" /><path className="accent-stroke" d="M17 57L35 52L51 46L68 39L83 35L99 24L116 22L132 12" /><g className="accent-fill"><circle cx="35" cy="52" r="2.5" /><circle cx="68" cy="39" r="2.5" /><circle cx="99" cy="24" r="2.5" /><circle cx="132" cy="12" r="2.5" /></g><text className="ua-sketch-note" x="79" y="58">confidence</text></>;
    case 'clustering':
      return <><path d="M8 62H138M12 66V6" /><g className="cluster-a"><circle cx="35" cy="39" r="3" /><circle cx="45" cy="30" r="3" /><circle cx="51" cy="44" r="3" /><circle cx="28" cy="25" r="3" /></g><g className="cluster-b"><circle cx="91" cy="23" r="3" /><circle cx="105" cy="31" r="3" /><circle cx="113" cy="18" r="3" /><circle cx="96" cy="42" r="3" /></g><path className="accent-stroke" d="M35 28L47 40M47 28L35 40" /><path className="rust-stroke" d="M97 24L109 36M109 24L97 36" /></>;
    case 'matrix':
      return <><text x="7" y="39">A</text><path d="M24 8H67M24 26H67M24 44H67M24 62H67M24 8V62M38 8V62M52 8V62M67 8V62" /><path className="accent-stroke" d="M73 35H94M88 30L95 35L88 40" /><path d="M101 12H132M101 29H132M101 46H132M101 63H132M101 12V63M132 12V63" /><circle className="accent-fill" cx="45" cy="35" r="3" /><text className="ua-sketch-note" x="108" y="70">Ax</text></>;
    case 'dag':
      return <><circle cx="24" cy="36" r="9" /><circle cx="72" cy="16" r="9" /><circle cx="72" cy="56" r="9" /><circle cx="120" cy="36" r="9" /><path className="accent-stroke" d="M33 32L62 20M33 40L62 52M81 19L111 32M81 53L111 40M71 25V47" /><path className="accent-fill" d="M58 18L63 20L59 24M58 50L63 52L59 55M107 29L112 32L107 35M107 37L112 40L107 43" /><text x="20" y="39">X</text><text x="68" y="19">Z</text><text x="68" y="59">M</text><text x="116" y="39">Y</text></>;
    case 'neural-network':
      return <><g><circle cx="18" cy="18" r="5" /><circle cx="18" cy="36" r="5" /><circle cx="18" cy="54" r="5" /></g><g><circle cx="70" cy="13" r="5" /><circle cx="70" cy="29" r="5" /><circle cx="70" cy="45" r="5" /><circle cx="70" cy="61" r="5" /></g><g><circle cx="126" cy="25" r="5" /><circle cx="126" cy="47" r="5" /></g><path d="M23 18L65 13M23 18L65 29M23 36L65 29M23 36L65 45M23 54L65 45M23 54L65 61M75 13L121 25M75 29L121 25M75 45L121 47M75 61L121 47" /></>;
    case 'sequence':
      return <><path className="muted-stroke" d="M8 36H136" /><g>{[10, 37, 64, 91, 118].map((x, index) => <g key={x}><rect className={index === 3 ? 'accent-soft-fill' : ''} x={x} y="24" width="18" height="24" /><text x={x + 6} y="40">{index + 1}</text></g>)}</g><path className="accent-stroke" d="M28 18C49 5 78 5 99 18M94 14L100 18L94 21" /><text className="ua-sketch-note" x="43" y="10">context</text></>;
    case 'time-series':
      return <><path d="M8 61H138M12 65V7" /><path className="accent-stroke" d="M15 49L27 42L39 47L51 29L63 35L75 23L87 32L99 19" /><path className="rust-stroke dash" d="M99 19L111 24L123 12L135 17" /><path className="muted-stroke dash" d="M99 8V61" /><text className="ua-sketch-note" x="104" y="68">forecast</text></>;
    case 'rl-loop':
      return <><rect x="8" y="25" width="34" height="22" /><rect x="102" y="25" width="34" height="22" /><text x="14" y="39">agent</text><text x="105" y="39">world</text><path className="accent-stroke" d="M42 30C61 17 83 17 102 30M96 25L103 30L96 33" /><path className="rust-stroke" d="M102 43C82 58 62 58 42 43M48 39L41 43L48 47" /><text className="ua-sketch-note" x="60" y="13">action</text><text className="ua-sketch-note" x="55" y="68">state + reward</text></>;
    case 'diffusion':
      return <><g className="muted-stroke"><circle cx="20" cy="36" r="16" /><circle cx="61" cy="36" r="16" /><circle cx="102" cy="36" r="16" /></g><g className="ink-fill"><circle cx="13" cy="30" r="1" /><circle cx="25" cy="42" r="1" /><circle cx="30" cy="26" r="1" /><circle cx="55" cy="31" r="1" /><circle cx="66" cy="41" r="1" /></g><path className="accent-stroke" d="M35 36H45M40 32L46 36L40 40M76 36H86M81 32L87 36L81 40" /><path className="accent-stroke" d="M94 39C98 26 110 25 116 35C111 44 101 46 94 39Z" /><text className="ua-sketch-note" x="9" y="64">noise</text><text className="ua-sketch-note" x="91" y="64">sample</text></>;
    case 'ranking':
      return <><text className="ua-sketch-note" x="5" y="12">score</text>{[[18, 18, 112], [32, 30, 91], [46, 42, 70], [60, 54, 48]].map(([y, width, score], index) => <g key={y}><text x="6" y={y + 7}>{index + 1}</text><rect className={index === 0 ? 'accent-soft-fill' : ''} x="20" y={y} width={width} height="9" /><text className="ua-sketch-note" x={25 + width} y={y + 7}>{score}</text></g>)}</>;
    case 'retrieval':
      return <><rect x="5" y="25" width="31" height="22" /><text x="10" y="39">query</text><path className="accent-stroke" d="M36 36H58M52 31L59 36L52 41" /><g><rect x="64" y="8" width="31" height="16" /><rect className="accent-soft-fill" x="64" y="28" width="31" height="16" /><rect x="64" y="48" width="31" height="16" /></g><path className="rust-stroke" d="M95 36H116M110 31L117 36L110 41" /><circle cx="129" cy="36" r="10" /><text x="125" y="39">1</text></>;
    case 'embedding-space':
      return <><path d="M8 62H138M12 66V6" /><path className="accent-stroke" d="M21 54L62 23M56 24L63 22L61 30" /><path className="rust-stroke" d="M21 54L105 37M99 34L106 37L100 42" /><g className="cluster-a"><circle cx="57" cy="17" r="3" /><circle cx="68" cy="25" r="3" /><circle cx="75" cy="14" r="3" /></g><g className="cluster-b"><circle cx="103" cy="31" r="3" /><circle cx="115" cy="40" r="3" /><circle cx="121" cy="27" r="3" /></g><text className="ua-sketch-note" x="29" y="68">semantic axes</text></>;
    case 'optimization':
      return <><ellipse className="muted-stroke" cx="76" cy="36" rx="59" ry="26" /><ellipse className="muted-stroke" cx="76" cy="36" rx="39" ry="17" /><ellipse className="muted-stroke" cx="76" cy="36" rx="18" ry="8" /><path className="accent-stroke dash" d="M22 16L40 25L54 29L66 34L76 36" /><circle className="accent-fill" cx="76" cy="36" r="3" /><text className="ua-sketch-note" x="82" y="39">min</text></>;
    case 'regression':
    default:
      return <><path d="M8 62H138M12 66V7" /><path className="accent-line" d="M18 56L130 14" /><circle cx="27" cy="49" r="3" /><circle cx="42" cy="45" r="3" /><circle cx="57" cy="51" r="3" /><circle cx="73" cy="32" r="3" /><circle cx="91" cy="36" r="3" /><circle cx="108" cy="20" r="3" /><circle cx="124" cy="25" r="3" /></>;
  }
}

export default function ConceptSketch({ animation, label }) {
  const kind = animation?.visualSignature || 'regression';
  const title = label || animation?.name || 'Machine learning concept';

  return (
    <svg className={`ua-concept-sketch is-${kind}`} viewBox="0 0 144 72" role="img" aria-label={`${title} concept diagram`}>
      <title>{title}</title>
      <Sketch kind={kind} />
    </svg>
  );
}
