import { useState } from "react";
import { PunnettSquare } from "@/components/PunnettSquare";
import { DisclaimerCard } from "@/components/Disclaimer";
import {
  REALISM_LABEL,
  TRAIT_MAP,
  TRAITS,
  genotypesFor,
  phenotypeOf,
  type ChildResult,
  type Parent,
} from "@/lib/genetics";

function pct(p: number) {
  return `${Math.round(p * 100)}%`;
}

export function ResultsPanel({
  p1,
  p2,
  child,
  childName,
  onChildName,
  onRerun,
}: {
  p1: Parent;
  p2: Parent;
  child: ChildResult;
  childName: string;
  onChildName: (v: string) => void;
  onRerun: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="result-heading"
        className="rounded-2xl border border-primary/40 bg-card p-6"
        style={{ boxShadow: "var(--shadow-lab)" }}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <h2 id="result-heading" className="truncate text-xl font-bold">
            Simulated offspring
          </h2>
          <button
            type="button"
            onClick={onRerun}
            className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Run again
          </button>
        </div>

        <div className="mt-4 max-w-xs">
          <label htmlFor="child-name" className="block text-xs text-muted-foreground">
            Name this simulation
          </label>
          <input
            id="child-name"
            value={childName}
            maxLength={24}
            onChange={(e) => onChildName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
          />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {child.traits.map((t) => {
            const trait = TRAIT_MAP[t.traitId]!;
            return (
              <div key={t.traitId} className="rounded-xl border border-border bg-secondary/40 p-3">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {trait.name}
                </dt>
                <dd className="mt-1 font-display text-base font-semibold text-foreground">
                  {t.phenotype}
                </dd>
                <dd className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-background px-1.5 py-0.5 font-mono">{t.genotype}</span>
                  <span>{pct(t.probability)} chance</span>
                </dd>
              </div>
            );
          })}
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Adult height estimate
            </dt>
            <dd className="mt-1 font-display text-base font-semibold">
              {child.heightRange.low}–{child.heightRange.high} cm
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">
              Mid-parent average {child.heightRange.mid} cm; polygenic, so a wide range.
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="details-heading" className="rounded-2xl border border-border bg-card p-6">
        <h2 id="details-heading" className="text-xl font-bold">
          Genetic details &amp; Punnett squares
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Open a trait to see how the alleles combined and how realistic the model is.
        </p>
        <ul className="mt-4 space-y-2">
          {child.traits.map((t) => {
            const trait = TRAIT_MAP[t.traitId]!;
            const g1 = p1.traits[trait.id] ?? genotypesFor(trait)[0]!;
            const g2 = p2.traits[trait.id] ?? genotypesFor(trait)[0]!;
            const isOpen = open === t.traitId;
            return (
              <li key={t.traitId} className="rounded-xl border border-border">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`panel-${t.traitId}`}
                    onClick={() => setOpen(isOpen ? null : t.traitId)}
                    className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-secondary/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{trait.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {g1} × {g2} → {t.genotype} · {t.phenotype}
                      </span>
                    </span>
                    <span aria-hidden className="shrink-0 text-muted-foreground">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={`panel-${t.traitId}`} className="border-t border-border p-4">
                    <div className="grid gap-5 md:grid-cols-2">
                      <PunnettSquare trait={trait} p1={g1} p2={g2} highlight={t.genotype} />
                      <div className="space-y-3 text-sm">
                        <p>
                          <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium">
                            {REALISM_LABEL[trait.realism]}
                          </span>
                        </p>
                        <p className="text-muted-foreground">{trait.note}</p>
                        <div>
                          <p className="font-semibold">Possible outcomes</p>
                          <ul className="mt-1 space-y-1">
                            {t.outcomes.map((o) => (
                              <li key={o.genotype} className="flex items-center gap-2">
                                <span className="w-14 font-mono text-xs">{o.genotype}</span>
                                <span
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: `${o.probability * 120}px` }}
                                  aria-hidden
                                />
                                <span className="text-xs text-muted-foreground">
                                  {pct(o.probability)} · {o.phenotype}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="compare-heading" className="rounded-2xl border border-border bg-card p-6">
        <h2 id="compare-heading" className="text-xl font-bold">
          Side-by-side comparison
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-2 pr-3">Trait</th>
                <th scope="col" className="py-2 pr-3">{p1.name || "Parent 1"}</th>
                <th scope="col" className="py-2 pr-3">{p2.name || "Parent 2"}</th>
                <th scope="col" className="py-2">{childName || "Child"}</th>
              </tr>
            </thead>
            <tbody>
              {TRAITS.map((trait) => {
                const g1 = p1.traits[trait.id] ?? genotypesFor(trait)[0]!;
                const g2 = p2.traits[trait.id] ?? genotypesFor(trait)[0]!;
                const c = child.traits.find((t) => t.traitId === trait.id)!;
                const matches1 = phenotypeOf(trait, g1) === c.phenotype;
                const matches2 = phenotypeOf(trait, g2) === c.phenotype;
                return (
                  <tr key={trait.id} className="border-b border-border/60">
                    <th scope="row" className="py-2 pr-3 font-medium">{trait.name}</th>
                    <td className={`py-2 pr-3 ${matches1 ? "text-primary" : "text-muted-foreground"}`}>
                      {phenotypeOf(trait, g1)}
                      {matches1 && <span className="sr-only"> (matches child)</span>}
                    </td>
                    <td className={`py-2 pr-3 ${matches2 ? "text-primary" : "text-muted-foreground"}`}>
                      {phenotypeOf(trait, g2)}
                      {matches2 && <span className="sr-only"> (matches child)</span>}
                    </td>
                    <td className="py-2 font-semibold">{c.phenotype}</td>
                  </tr>
                );
              })}
              <tr>
                <th scope="row" className="py-2 pr-3 font-medium">Height</th>
                <td className="py-2 pr-3 text-muted-foreground">{p1.heightCm} cm</td>
                <td className="py-2 pr-3 text-muted-foreground">{p2.heightCm} cm</td>
                <td className="py-2 font-semibold">
                  {child.heightRange.low}–{child.heightRange.high} cm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Teal text marks a parent trait that matches this simulated child.
        </p>
      </section>

      <DisclaimerCard />
    </div>
  );
}
