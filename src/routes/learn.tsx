import { createFileRoute, Link } from "@tanstack/react-router";
import { REALISM_LABEL, TRAITS } from "@/lib/genetics";
import { PunnettSquare } from "@/components/PunnettSquare";
import { TRAIT_MAP } from "@/lib/genetics";
import { DisclaimerCard } from "@/components/Disclaimer";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "How Inheritance Works — Learn | GeneBlend Studio" },
      {
        name: "description",
        content:
          "Alleles, dominance, Punnett squares and real ABO blood-type inheritance explained in plain language, with the limits of each model.",
      },
      { property: "og:title", content: "How Inheritance Works — Learn | GeneBlend Studio" },
      {
        property: "og:description",
        content:
          "A plain-language guide to genes, alleles, dominance and blood types — plus why most trait predictions are oversimplified.",
      },
    ],
  }),
  component: LearnPage,
});

const LESSONS = [
  {
    title: "Genes, alleles and genotypes",
    body: "A gene is an instruction; an allele is one version of that instruction. You carry two alleles per gene — one from each biological parent. The pair is your genotype (for example Bb), and the visible outcome is your phenotype (brown eyes).",
  },
  {
    title: "Dominant and recessive",
    body: "A dominant allele shows its effect with just one copy. A recessive allele only shows when both copies are recessive. That is why two brown-eyed parents in the simple model can still have a blue-eyed child: both may carry a hidden low-pigment allele.",
  },
  {
    title: "Incomplete dominance and codominance",
    body: "Sometimes neither allele wins. With incomplete dominance the result is a blend — one curl allele plus one straight allele gives wavy hair. With codominance both show fully at once, which is exactly what happens in AB blood.",
  },
  {
    title: "Polygenic traits",
    body: "Height, skin tone, hair colour and eye colour are polygenic: dozens or hundreds of genes each nudge the result, and nutrition and environment matter too. That is why this simulator gives height as a range rather than a number.",
  },
];

function LearnPage() {
  const blood = TRAIT_MAP["blood"]!;
  const hair = TRAIT_MAP["hairTexture"]!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">How inheritance actually works</h1>
      <p className="mt-3 text-muted-foreground">
        Everything the lab does, explained — including where the model stops being true to biology.
      </p>

      <DisclaimerCard className="mt-6" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {LESSONS.map((l) => (
          <article key={l.title} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold">{l.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{l.body}</p>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold">Reading a Punnett square</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          One parent's two alleles run along the top, the other's down the side. Each of the four
          cells is an equally likely combination, so counting cells gives the probabilities.
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Wavy × wavy hair (incomplete dominance)</h3>
            <div className="mt-2">
              <PunnettSquare trait={hair} p1="Cs" p2="Cs" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">AB × O blood (codominance)</h3>
            <div className="mt-2">
              <PunnettSquare trait={blood} p1="AB" p2="OO" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Notice the impossible outcomes: an AB parent and an O parent cannot produce an AB or O
              child in the standard ABO model.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">How realistic is each trait here?</h2>
        <ul className="mt-4 space-y-3">
          {TRAITS.map((t) => (
            <li key={t.id} className="rounded-xl border border-border bg-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <h3 className="truncate font-semibold">{t.name}</h3>
                <span className="shrink-0 rounded bg-secondary px-2 py-0.5 text-xs">
                  {REALISM_LABEL[t.realism]}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 text-center">
        <Link
          to="/lab"
          className="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
        >
          Try it in the lab
        </Link>
      </div>
    </div>
  );
}
