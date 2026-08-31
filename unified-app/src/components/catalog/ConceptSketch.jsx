import React from 'react';

function sketchKind(animation) {
  const text = `${animation?.id || ''} ${animation?.categoryId || ''}`;
  if (/attention|transformer|llm|nlp|token|bert|gpt|rag/.test(text)) return 'attention';
  if (/tree|forest|ensemble|causal|dag|branch/.test(text)) return 'tree';
  if (/cluster|k-means|pca|embedding|vector|matrix|linear-algebra/.test(text)) return 'spatial';
  if (/gradient|optim|loss|training|diffusion|sampling/.test(text)) return 'descent';
  if (/neural|cnn|network|relu|perceptron/.test(text)) return 'network';
  return 'regression';
}

export default function ConceptSketch({ animation, label }) {
  const kind = sketchKind(animation);
  const title = label || animation?.name || 'Machine learning concept';

  return (
    <svg className={`ua-concept-sketch is-${kind}`} viewBox="0 0 144 72" role="img" aria-label={`${title} concept diagram`}>
      {kind === 'attention' && <><text x="4" y="17">Q</text><text x="4" y="38">K</text><text x="4" y="59">V</text><path d="M18 14H54M18 35H54M18 56H111" /><path d="M54 14L72 25M54 35L72 25M72 25H105" /><rect x="105" y="17" width="34" height="16" /><text className="ua-sketch-note" x="110" y="28">softmax</text><path d="M122 33V56M111 56H137" /></>}
      {kind === 'tree' && <><circle cx="72" cy="11" r="4" /><path d="M72 15V23M72 23L38 37M72 23L106 37M38 37V51M38 51L20 63M38 51L55 63M106 37V63" /><circle cx="20" cy="64" r="4" /><circle cx="55" cy="64" r="4" /><circle cx="106" cy="64" r="4" /><text className="ua-sketch-note" x="79" y="13">x₁ &lt; .42</text></>}
      {kind === 'spatial' && <><path d="M8 62H138M12 66V6" /><g className="cluster-a"><circle cx="35" cy="39" r="3" /><circle cx="45" cy="30" r="3" /><circle cx="51" cy="44" r="3" /><circle cx="28" cy="25" r="3" /></g><g className="cluster-b"><circle cx="91" cy="23" r="3" /><circle cx="105" cy="31" r="3" /><circle cx="113" cy="18" r="3" /><circle cx="96" cy="42" r="3" /></g><path className="accent-line" d="M18 56L126 10" /></>}
      {kind === 'descent' && <><path d="M8 62H138M12 66V7" /><path className="curve" d="M15 12C28 17 37 40 55 48S91 57 132 58" /><path className="accent-line steps" d="M25 23L42 38L60 45L78 52L101 55" /><circle className="accent-fill" cx="101" cy="55" r="4" /><text className="ua-sketch-note" x="15" y="10">loss</text></>}
      {kind === 'network' && <><g><circle cx="18" cy="18" r="5" /><circle cx="18" cy="36" r="5" /><circle cx="18" cy="54" r="5" /></g><g><circle cx="70" cy="13" r="5" /><circle cx="70" cy="29" r="5" /><circle cx="70" cy="45" r="5" /><circle cx="70" cy="61" r="5" /></g><g><circle cx="126" cy="25" r="5" /><circle cx="126" cy="47" r="5" /></g><path d="M23 18L65 13M23 18L65 29M23 36L65 29M23 36L65 45M23 54L65 45M23 54L65 61M75 13L121 25M75 29L121 25M75 45L121 47M75 61L121 47" /></>}
      {kind === 'regression' && <><path d="M8 62H138M12 66V7" /><path className="accent-line" d="M18 56L130 14" /><circle cx="27" cy="49" r="3" /><circle cx="42" cy="45" r="3" /><circle cx="57" cy="51" r="3" /><circle cx="73" cy="32" r="3" /><circle cx="91" cy="36" r="3" /><circle cx="108" cy="20" r="3" /><circle cx="124" cy="25" r="3" /></>}
    </svg>
  );
}
