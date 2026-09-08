import { createFileRoute, Link } from "@tanstack/react-router";
import { DisclaimerCard } from "@/components/Disclaimer";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ & Genetics Glossary | GeneBlend Studio" },
      {
        name: "description",
        content:
          "Common questions about the GeneBlend genetics simulator, plus a glossary of terms like allele, genotype, phenotype, codominance and polygenic.",
      },
      { property: "og:title", content: "FAQ & Genetics Glossary | GeneBlend Studio" },
      {
        property: "og:description",
        content:
          "Answers about accuracy, privacy and data storage — plus plain-language definitions of key genetics terms.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Can this predict what my future child will look like?",
    a: "No. It is a teaching simulation. Real traits involve many genes, random developmental variation and environment, and this tool has no access to anyone's actual DNA.",
  },
  {
    q: "Why do I get a different child each time with the same parents?",
    a: "Because inheritance is a lottery. Each parent passes one allele of each pair at random, so the same couple has a different probability draw every simulation. The percentages shown stay the same.",
  },
  {
    q: "Is the blood type part accurate?",
    a: "Close to it. ABO inheritance really is one gene with three common alleles, where Iᴬ and Iᴮ are codominant and both dominate i. Rh factor behaves like a clean dominant. Rare exceptions such as the Bombay phenotype are not modelled.",
  },
  {
    q: "Why is eye colour only brown or blue?",
    a: "The one-gene brown/blue model is the classic classroom version and keeps the Punnett squares readable. Real eye colour needs many genes and produces green, hazel and everything between.",
  },
  {
    q: "Where is my data stored?",
    a: "Only in your own browser's local storage on this device. Nothing is uploaded, and clearing your browser data or pressing Reset removes it.",
  },
  {
    q: "Can I use this in a classroom?",
    a: "Yes — it is built for that. Pair it with the Learn page so students also see which traits are genuine single-gene examples and which are myths.",
  },
  {
    q: "Why is there a sound toggle that starts off?",
    a: "Audio never plays until you switch it on, so the simulator stays quiet in shared spaces. Animations also shorten automatically if your device requests reduced motion.",
  },
];

const GLOSSARY = [
  ["Allele", "One version of a gene. You carry two per gene, one from each biological parent."],
  ["Genotype", "The pair of alleles you carry, written like Bb or AO."],
  ["Phenotype", "The observable trait that results from a genotype, such as brown eyes."],
  ["Homozygous", "Both alleles are the same (BB or bb)."],
  ["Heterozygous", "The two alleles differ (Bb) — a carrier of the hidden version."],
  ["Dominant", "An allele whose effect shows with only one copy present."],
  ["Recessive", "An allele whose effect only shows when both copies are recessive."],
  ["Incomplete dominance", "Neither allele dominates, so the phenotype blends — e.g. wavy hair."],
  ["Codominance", "Both alleles are fully expressed at once, as in AB blood."],
  ["Polygenic", "A trait shaped by many genes at once, such as height or skin tone."],
  ["Punnett square", "A grid that lays out every equally likely allele combination from two parents."],
  ["Meiosis", "Cell division that halves the chromosome count, so each parent passes one allele per gene."],
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">FAQ &amp; glossary</h1>
      <DisclaimerCard className="mt-6" />

      <section aria-labelledby="faq-heading" className="mt-8">
        <h2 id="faq-heading" className="text-xl font-bold">
          Frequently asked questions
        </h2>
        <dl className="mt-4 space-y-3">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-xl border border-border bg-card p-5">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="glossary-heading" className="mt-10">
        <h2 id="glossary-heading" className="text-xl font-bold">
          Glossary
        </h2>
        <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
          {GLOSSARY.map(([term, def]) => (
            <div key={term} className="grid gap-1 p-4 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
              <dt className="font-display font-semibold text-primary">{term}</dt>
              <dd className="text-sm text-muted-foreground">{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10 text-center">
        <Link
          to="/lab"
          className="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
        >
          Open the lab
        </Link>
      </div>
    </div>
  );
}
