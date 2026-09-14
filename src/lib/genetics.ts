/**
 * Simplified educational genetics engine.
 *
 * IMPORTANT: These are teaching models. Most human traits are polygenic and
 * influenced by many genes plus environment. Only ABO/Rh blood typing here is
 * modelled close to real single-locus inheritance.
 */

export type InheritanceMode = "dominant" | "incomplete" | "abo" | "hair";

export interface Trait {
  id: string;
  name: string;
  category: "Face" | "Hair & Eyes" | "Fun Lab";
  mode: InheritanceMode;
  /** Ordered most-dominant first. */
  alleles: { symbol: string; name: string }[];
  /** genotype (canonical) -> phenotype label */
  phenotypes: Record<string, string>;
  realism: "close" | "simplified" | "very-simplified";
  note: string;
  /** Kid-friendly one-liner shown everywhere in the lab. */
  kidNote: string;
}

const dom = (
  id: string,
  name: string,
  category: Trait["category"],
  D: string,
  r: string,
  dName: string,
  rName: string,
  domPheno: string,
  recPheno: string,
  realism: Trait["realism"],
  note: string,
  kidNote: string,
): Trait => ({
  id,
  name,
  category,
  mode: "dominant",
  alleles: [
    { symbol: D, name: dName },
    { symbol: r, name: rName },
  ],
  phenotypes: {
    [D + D]: domPheno,
    [D + r]: domPheno,
    [r + r]: recPheno,
  },
  realism,
  note,
  kidNote,
});

export const TRAITS: Trait[] = [
  dom(
    "eyeColor",
    "Eye colour",
    "Hair & Eyes",
    "B",
    "b",
    "brown (strong)",
    "blue (hidden)",
    "Brown eyes",
    "Blue eyes",
    "very-simplified",
    "Real eye colour involves many genes, so green and hazel eyes are missing from this model.",
    "Brown is a strong trait, blue is a hidden one. A child needs two hidden blue instructions to get blue eyes.",
  ),
  {
    id: "hairColor",
    name: "Hair colour",
    category: "Hair & Eyes",
    mode: "hair",
    alleles: [
      { symbol: "K", name: "black (strongest)" },
      { symbol: "N", name: "brown" },
      { symbol: "R", name: "red / ginger" },
      { symbol: "b", name: "blonde (most hidden)" },
    ],
    phenotypes: {
      KK: "Black",
      KN: "Black",
      KR: "Black",
      Kb: "Black",
      NN: "Dark brown",
      NR: "Light brown",
      Nb: "Dark brown",
      RR: "Red / ginger",
      Rb: "Red / ginger",
      bb: "Blonde",
    },
    realism: "very-simplified",
    note: "Hair colour really comes from many genes working together. This five-colour model is a friendly teaching version.",
    kidNote:
      "Think of dark hair colours as louder and light ones as quieter. Black shouts loudest, then brown, then red, and blonde is the quietest of all.",
  },
  {
    id: "hairTexture",
    name: "Hair texture",
    category: "Hair & Eyes",
    mode: "incomplete",
    alleles: [
      { symbol: "C", name: "curly instruction" },
      { symbol: "s", name: "straight instruction" },
    ],
    phenotypes: { CC: "Curly hair", Cs: "Wavy hair", ss: "Straight hair" },
    realism: "simplified",
    note: "A nice example of blending: one curly plus one straight gives wavy hair instead of one winning.",
    kidNote:
      "Here the two instructions share! Curly + straight makes wavy — like mixing two paints instead of picking one.",
  },
  dom(
    "dimples",
    "Cheek dimples",
    "Face",
    "D",
    "d",
    "dimple (strong)",
    "no dimple (hidden)",
    "Dimples",
    "No dimples",
    "simplified",
    "Dimples come from a small difference in a cheek muscle; real inheritance is a bit messier than this.",
    "Dimples are the strong trait — one dimple instruction is enough for those little smile dents.",
  ),
  dom(
    "freckles",
    "Freckles",
    "Face",
    "F",
    "f",
    "freckles (strong)",
    "no freckles (hidden)",
    "Freckles",
    "No freckles",
    "simplified",
    "Freckles are linked to skin-pigment genes and get stronger with sunshine.",
    "Freckles are a strong trait, and sunshine can make them show up even more!",
  ),
  {
    id: "blood",
    name: "Blood type (fun lab)",
    category: "Fun Lab",
    mode: "abo",
    alleles: [
      { symbol: "A", name: "A instruction" },
      { symbol: "B", name: "B instruction" },
      { symbol: "O", name: "O instruction (hidden)" },
    ],
    phenotypes: {
      AA: "Type A",
      AB: "Type AB",
      AO: "Type A",
      BB: "Type B",
      BO: "Type B",
      OO: "Type O",
    },
    realism: "close",
    note: "A and B are both strong and can show up together as AB; O is hidden and needs two copies.",
    kidNote:
      "Blood comes in four flavours: A, B, AB and O. A and B are both strong and can team up as AB. O is shy and only shows when it gets two copies.",
  },
];

/** Colour swatches so young learners can see a trait, not just read it. */
export const PHENOTYPE_SWATCH: Record<string, string> = {
  Black: "#1b1512",
  "Dark brown": "#4a2c17",
  "Light brown": "#a4703a",
  "Red / ginger": "#d1541d",
  Blonde: "#e8c56a",
  "Brown eyes": "#6b4226",
  "Blue eyes": "#4f9bd9",
};

export const TRAIT_MAP: Record<string, Trait> = Object.fromEntries(
  TRAITS.map((t) => [t.id, t]),
);

/** Canonical ordering of a genotype pair, using allele dominance order. */
export function canonical(trait: Trait, a: string, b: string): string {
  const rank = (s: string) => trait.alleles.findIndex((al) => al.symbol === s);
  return rank(a) <= rank(b) ? a + b : b + a;
}

export function genotypesFor(trait: Trait): string[] {
  const out: string[] = [];
  const syms = trait.alleles.map((a) => a.symbol);
  for (let i = 0; i < syms.length; i++) {
    for (let j = i; j < syms.length; j++) {
      out.push(canonical(trait, syms[i]!, syms[j]!));
    }
  }
  return out;
}

export function allelesOf(_trait: Trait, genotype: string): [string, string] {
  return [genotype[0]!, genotype[1]!] as [string, string];
}

/** Falls back to a valid genotype when old saved data uses a removed allele. */
export function safeGenotype(trait: Trait, value: string | undefined): string {
  const all = genotypesFor(trait);
  return value && all.includes(value) ? value : all[0]!;
}

export function phenotypeOf(trait: Trait, genotype: string): string {
  return trait.phenotypes[genotype] ?? "Unknown";
}

export interface Outcome {
  genotype: string;
  phenotype: string;
  probability: number; // 0..1
}

/** Full Punnett cross: returns the 4 cells plus merged probabilities. */
export function cross(trait: Trait, p1: string, p2: string) {
  const [a1, a2] = allelesOf(trait, p1);
  const [b1, b2] = allelesOf(trait, p2);
  const cells: string[][] = [
    [canonical(trait, a1, b1), canonical(trait, a1, b2)],
    [canonical(trait, a2, b1), canonical(trait, a2, b2)],
  ];
  const counts = new Map<string, number>();
  cells.flat().forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1));
  const genotypeOutcomes: Outcome[] = [...counts.entries()]
    .map(([genotype, n]) => ({
      genotype,
      phenotype: phenotypeOf(trait, genotype),
      probability: n / 4,
    }))
    .sort((x, y) => y.probability - x.probability);

  const pheno = new Map<string, number>();
  genotypeOutcomes.forEach((o) =>
    pheno.set(o.phenotype, (pheno.get(o.phenotype) ?? 0) + o.probability),
  );
  const phenotypeOutcomes = [...pheno.entries()]
    .map(([phenotype, probability]) => ({ phenotype, probability }))
    .sort((x, y) => y.probability - x.probability);

  return {
    rowAlleles: [a1, a2] as [string, string],
    colAlleles: [b1, b2] as [string, string],
    cells,
    genotypeOutcomes,
    phenotypeOutcomes,
  };
}

/** Deterministic pseudo-random from a numeric seed (mulberry32). */
export function makeRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickOutcome(outcomes: Outcome[], r: number): Outcome {
  let acc = 0;
  for (const o of outcomes) {
    acc += o.probability;
    if (r <= acc) return o;
  }
  return outcomes[outcomes.length - 1]!;
}

export type ParentTraits = Record<string, string>;

export interface Parent {
  name: string;
  heightCm: number;
  traits: ParentTraits;
}

export interface ChildTraitResult {
  traitId: string;
  genotype: string;
  phenotype: string;
  probability: number;
  outcomes: Outcome[];
}

export interface ChildResult {
  seed: number;
  traits: ChildTraitResult[];
  heightRange: { low: number; mid: number; high: number };
}

/** Mid-parental height estimate (Tanner method), ±8cm typical spread. */
export function heightEstimate(p1: number, p2: number) {
  const mid = Math.round((p1 + p2) / 2);
  return { low: mid - 8, mid, high: mid + 8 };
}

export function simulateChild(p1: Parent, p2: Parent, seed: number): ChildResult {
  const rng = makeRng(seed);
  const traits = TRAITS.map((trait) => {
    const g1 = safeGenotype(trait, p1.traits[trait.id]);
    const g2 = safeGenotype(trait, p2.traits[trait.id]);
    const { genotypeOutcomes } = cross(trait, g1, g2);
    const picked = pickOutcome(genotypeOutcomes, rng());
    return {
      traitId: trait.id,
      genotype: picked.genotype,
      phenotype: picked.phenotype,
      probability: picked.probability,
      outcomes: genotypeOutcomes,
    };
  });
  return {
    seed,
    traits,
    heightRange: heightEstimate(p1.heightCm, p2.heightCm),
  };
}

export function defaultParent(name: string, heightCm: number): Parent {
  return {
    name,
    heightCm,
    traits: Object.fromEntries(
      TRAITS.map((t) => [t.id, genotypesFor(t)[1] ?? genotypesFor(t)[0]!] as [string, string]),
    ),
  };
}

export function randomParent(name: string, rng: () => number): Parent {
  return {
    name,
    heightCm: 150 + Math.floor(rng() * 45),
    traits: Object.fromEntries(
      TRAITS.map((t) => {
        const gs = genotypesFor(t);
        return [t.id, gs[Math.floor(rng() * gs.length)]!] as [string, string];
      }),
    ),
  };
}

export const REALISM_LABEL: Record<Trait["realism"], string> = {
  close: "Very close to real life",
  simplified: "A simple version of real life",
  "very-simplified": "A fun, very simple version",
};
