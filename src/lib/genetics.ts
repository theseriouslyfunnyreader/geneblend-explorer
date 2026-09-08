/**
 * Simplified educational genetics engine.
 *
 * IMPORTANT: These are teaching models. Most human traits are polygenic and
 * influenced by many genes plus environment. Only ABO/Rh blood typing here is
 * modelled close to real single-locus inheritance.
 */

export type InheritanceMode = "dominant" | "incomplete" | "abo" | "rh";

export interface Trait {
  id: string;
  name: string;
  category: "Face" | "Hair & Eyes" | "Body" | "Blood" | "Senses";
  mode: InheritanceMode;
  /** Ordered most-dominant first. */
  alleles: { symbol: string; name: string }[];
  /** genotype (canonical) -> phenotype label */
  phenotypes: Record<string, string>;
  realism: "close" | "simplified" | "very-simplified";
  note: string;
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
});

export const TRAITS: Trait[] = [
  dom(
    "eyeColor",
    "Eye colour",
    "Hair & Eyes",
    "B",
    "b",
    "brown-pigment allele",
    "low-pigment allele",
    "Brown eyes",
    "Blue eyes",
    "very-simplified",
    "Real eye colour involves at least 16 genes (OCA2 and HERC2 are the largest contributors). The one-gene model here is a classroom shortcut, which is why green and hazel eyes are missing.",
  ),
  {
    id: "hairTexture",
    name: "Hair texture",
    category: "Hair & Eyes",
    mode: "incomplete",
    alleles: [
      { symbol: "C", name: "curl allele" },
      { symbol: "s", name: "straight allele" },
    ],
    phenotypes: { CC: "Curly hair", Cs: "Wavy hair", ss: "Straight hair" },
    realism: "simplified",
    note: "A genuine example of blended (incomplete dominant) inheritance: one copy of each allele gives wavy hair rather than one parent's texture winning outright.",
  },
  dom(
    "hairColor",
    "Hair colour",
    "Hair & Eyes",
    "H",
    "h",
    "dark-pigment allele",
    "light-pigment allele",
    "Dark hair",
    "Light hair",
    "very-simplified",
    "Hair colour is polygenic; MC1R alone explains most red hair, and pigment often darkens with age. Treat this as a two-outcome teaching toy.",
  ),
  dom(
    "widowsPeak",
    "Widow's peak",
    "Face",
    "W",
    "w",
    "peak allele",
    "straight-hairline allele",
    "Widow's peak",
    "Straight hairline",
    "simplified",
    "Frequently taught as a single dominant gene, though family studies show the hairline is continuous rather than two neat categories.",
  ),
  dom(
    "dimples",
    "Cheek dimples",
    "Face",
    "D",
    "d",
    "dimple allele",
    "no-dimple allele",
    "Dimples",
    "No dimples",
    "simplified",
    "Dimples come from a variation in the zygomaticus major muscle. Inheritance is irregular, so the clean dominant model is an approximation.",
  ),
  dom(
    "cleftChin",
    "Cleft chin",
    "Face",
    "K",
    "k",
    "cleft allele",
    "smooth allele",
    "Cleft chin",
    "Smooth chin",
    "simplified",
    "Strongly heritable but not a tidy on/off switch — chin shape varies continuously.",
  ),
  dom(
    "freckles",
    "Freckles",
    "Face",
    "F",
    "f",
    "freckle allele",
    "no-freckle allele",
    "Freckles",
    "No freckles",
    "simplified",
    "Linked mostly to MC1R variants and strongly modified by sun exposure — an environment-sensitive trait.",
  ),
  dom(
    "earlobes",
    "Earlobes",
    "Face",
    "E",
    "e",
    "free-lobe allele",
    "attached-lobe allele",
    "Free earlobes",
    "Attached earlobes",
    "very-simplified",
    "The classic textbook example — and a known myth. A 2017 genome study found at least 49 regions involved.",
  ),
  dom(
    "tongueRoll",
    "Tongue rolling",
    "Senses",
    "R",
    "r",
    "roller allele",
    "non-roller allele",
    "Can roll tongue",
    "Cannot roll tongue",
    "very-simplified",
    "Identical twins often differ on this, so it cannot be a simple single gene. Included because it is such a common classroom demo.",
  ),
  dom(
    "ptc",
    "PTC bitter tasting",
    "Senses",
    "T",
    "t",
    "taster allele",
    "non-taster allele",
    "Tastes bitter (PTC)",
    "Tastes nothing",
    "close",
    "The TAS2R38 gene really does drive most of this, though tasting is a spectrum rather than yes/no.",
  ),
  dom(
    "hitchhiker",
    "Hitchhiker's thumb",
    "Body",
    "S",
    "s",
    "straight-thumb allele",
    "hitchhiker allele",
    "Straight thumb",
    "Hitchhiker's thumb",
    "simplified",
    "Thumb hyperextension is measured in degrees, so the two-bucket version is a simplification.",
  ),
  {
    id: "blood",
    name: "ABO blood type",
    category: "Blood",
    mode: "abo",
    alleles: [
      { symbol: "A", name: "Iᴬ allele" },
      { symbol: "B", name: "Iᴮ allele" },
      { symbol: "O", name: "i allele" },
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
    note: "Accurate: Iᴬ and Iᴮ are codominant with each other and both dominant over i. An AB parent and an O parent can only have A or B children — never AB or O.",
  },
  {
    id: "rh",
    name: "Rh factor",
    category: "Blood",
    mode: "rh",
    alleles: [
      { symbol: "+", name: "Rh-positive allele" },
      { symbol: "-", name: "Rh-negative allele" },
    ],
    phenotypes: { "++": "Rh positive", "+-": "Rh positive", "--": "Rh negative" },
    realism: "close",
    note: "The RHD gene behaves like a clean dominant: two negative alleles are needed for Rh-negative blood.",
  },
];

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
      out.push(canonical(trait, syms[i], syms[j]));
    }
  }
  return out;
}

export function allelesOf(trait: Trait, genotype: string): [string, string] {
  if (trait.mode === "rh") {
    return [genotype[0], genotype[1]] as [string, string];
  }
  return [genotype[0], genotype[1]] as [string, string];
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
  return outcomes[outcomes.length - 1];
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
    const g1 = p1.traits[trait.id] ?? genotypesFor(trait)[0];
    const g2 = p2.traits[trait.id] ?? genotypesFor(trait)[0];
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
      TRAITS.map((t) => [t.id, genotypesFor(t)[t.mode === "abo" ? 1 : 1] ?? genotypesFor(t)[0]]),
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
        return [t.id, gs[Math.floor(rng() * gs.length)]];
      }),
    ),
  };
}

export const REALISM_LABEL: Record<Trait["realism"], string> = {
  close: "Close to real biology",
  simplified: "Simplified model",
  "very-simplified": "Classroom myth / very simplified",
};
