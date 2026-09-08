import { createFileRoute, Link } from "@tanstack/react-router";
import { DisclaimerCard } from "@/components/Disclaimer";
import { PunnettSquare } from "@/components/PunnettSquare";
import { TRAIT_MAP, TRAITS } from "@/lib/genetics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeneBlend Studio — Interactive Genetics Simulator" },
      {
        name: "description",
        content:
          "Build two simulated parents, mix their DNA and see how alleles, dominance and blood types combine. A free, accessible educational genetics simulator.",
      },
      { property: "og:title", content: "GeneBlend Studio — Interactive Genetics Simulator" },
      {
        property: "og:description",
        content:
          "An educational simulation of Mendelian inheritance: Punnett squares, probabilities and accurate ABO blood-type rules.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    n: "01",
    t: "Build two parents",
    d: "Pick a genotype for every trait, or hit Randomize and let the lab deal the alleles.",
  },
  {
    n: "02",
    t: "Mix the DNA",
    d: "Watch meiosis and recombination play out — or skip straight to the answer at any time.",
  },
  {
    n: "03",
    t: "Read the science",
    d: "Every trait comes with a Punnett square, the odds, and an honest note on how real the model is.",
  },
];

function Landing() {
  const blood = TRAIT_MAP["blood"]!;

  return (
    <div>
      <section className="relative overflow-hidden lab-grid">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
          style={{ animation: "pulse-glow 6s ease-in-out infinite" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
          <p className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Educational simulation
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
            See how traits <span className="helix-text">pass down</span> — one allele at a time
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            GeneBlend Studio is an interactive genetics lab for students, teachers and the curious.
            Set two parents, mix their DNA, and get a full Mendelian explanation of every result —
            including blood-type inheritance modelled the way it really works.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/lab"
              className="inline-flex min-h-12 items-center rounded-xl bg-primary px-7 font-display text-base font-semibold text-primary-foreground hover:opacity-90"
            >
              Enter the lab
            </Link>
            <Link
              to="/learn"
              className="inline-flex min-h-12 items-center rounded-xl border border-input px-6 text-base font-medium hover:bg-secondary"
            >
              Learn the basics
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No account, no data leaves your device, no real DNA involved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-mono text-sm text-primary">{s.n}</span>
              <h3 className="mt-2 text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Blood type, done properly</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              ABO inheritance is one of the few human traits that genuinely follows a single-gene
              model. Iᴬ and Iᴮ are codominant and both dominate i — so an AB parent with an O partner
              can only have type A or type B children, never AB or O.
            </p>
            <Link
              to="/learn"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
            >
              See the full explanation
            </Link>
          </div>
          <PunnettSquare trait={blood} p1="AB" p2="OO" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">{TRAITS.length} traits in the lab</h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {TRAITS.map((t) => (
            <li
              key={t.id}
              className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground"
            >
              {t.name}
            </li>
          ))}
        </ul>
        <DisclaimerCard className="mt-8" />
      </section>
    </div>
  );
}
