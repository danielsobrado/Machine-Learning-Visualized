export function cardSet(definition, intuition, equation, example, whyItMatters, tryIt) {
  return Object.freeze({
    def: Object.freeze({ body: definition }),
    int: Object.freeze({ body: intuition }),
    eqn: Object.freeze({ body: equation }),
    ex: Object.freeze({ body: example }),
    why: Object.freeze({ body: whyItMatters }),
    do: Object.freeze({ body: tryIt }),
  });
}
