import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ParentBuilder } from "@/components/ParentBuilder";
import { ResultsPanel } from "@/components/ResultsPanel";
import { DnaMixer } from "@/components/DnaMixer";
import { DisclaimerCard } from "@/components/Disclaimer";
import {
  defaultParent,
  makeRng,
  randomParent,
  simulateChild,
  type ChildResult,
  type Parent,
} from "@/lib/genetics";
import { useLocalState, usePrefersReducedMotion } from "@/lib/persist";
import { sfx } from "@/lib/sound";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "The Lab — Build Two Parents | GeneBlend Studio" },
      {
        name: "description",
        content:
          "Set alleles for two simulated parents, mix their DNA, and explore Punnett squares, probabilities and blood-type inheritance.",
      },
      { property: "og:title", content: "The Lab — Build Two Parents | GeneBlend Studio" },
      {
        property: "og:description",
        content:
          "An interactive genetics lab: choose parent genotypes and watch a simplified inheritance model explain every result.",
      },
    ],
  }),
  component: LabPage,
});

type Phase = "build" | "mixing" | "results";

interface SavedRun {
  id: string;
  label: string;
  at: string;
  p1: Parent;
  p2: Parent;
  seed: number;
}

function LabPage() {
  const reduced = usePrefersReducedMotion();
  const [soundOn, setSoundOn] = useLocalState("gb:sound", false);
  const [p1, setP1] = useLocalState<Parent>("gb:p1", defaultParent("Parent A", 178));
  const [p2, setP2] = useLocalState<Parent>("gb:p2", defaultParent("Parent B", 165));
  const [childName, setChildName] = useLocalState("gb:childName", "Sample 001");
  const [saved, setSaved] = useLocalState<SavedRun[]>("gb:saved", []);
  const [phase, setPhase] = useState<Phase>("build");
  const [child, setChild] = useState<ChildResult | null>(null);
  const [seed, setSeed] = useState(1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const run = useCallback(
    (nextSeed?: number) => {
      const s = nextSeed ?? Math.floor(Math.random() * 1e9);
      setSeed(s);
      setChild(simulateChild(p1, p2, s));
      setPhase(reduced ? "results" : "mixing");
      if (reduced) sfx.reveal(soundOn);
    },
    [p1, p2, reduced, soundOn],
  );

  const finishMix = useCallback(() => {
    setPhase("results");
    sfx.reveal(soundOn);
  }, [soundOn]);

  const reset = () => {
    setP1(defaultParent("Parent A", 178));
    setP2(defaultParent("Parent B", 165));
    setChildName("Sample 001");
    setChild(null);
    setPhase("build");
    setToast("Lab reset to defaults.");
  };

  const save = () => {
    const entry: SavedRun = {
      id: `${Date.now()}`,
      label: childName || "Untitled sample",
      at: new Date().toLocaleString(),
      p1,
      p2,
      seed,
    };
    setSaved([entry, ...saved].slice(0, 12));
    setToast("Saved to this browser.");
  };

  const share = async () => {
    const text = child
      ? `${childName}: ${child.traits
          .slice(0, 4)
          .map((t) => t.phenotype)
          .join(", ")} — simulated in GeneBlend Studio (educational simulation).`
      : "GeneBlend Studio — an educational genetics simulator.";
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "GeneBlend Studio", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setToast("Summary copied to clipboard.");
    } catch {
      setToast("Sharing was cancelled.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold sm:text-4xl">The Lab</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Pick each parent's genotype for every trait, then mix. Every result is explained with a
            Punnett square and a note on how real the model is.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSoundOn(!soundOn);
              sfx.click(!soundOn);
            }}
            aria-pressed={soundOn}
            className="inline-flex min-h-11 items-center rounded-lg border border-input px-3 text-sm hover:bg-secondary"
          >
            Sound: {soundOn ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center rounded-lg border border-input px-3 text-sm hover:bg-secondary"
          >
            Reset
          </button>
        </div>
      </header>

      <DisclaimerCard className="mt-6" />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ParentBuilder
          label="Parent 1"
          accent="primary"
          parent={p1}
          onChange={setP1}
          onRandomize={() => setP1(randomParent(p1.name || "Parent A", makeRng(Date.now())))}
        />
        <ParentBuilder
          label="Parent 2"
          accent="accent"
          parent={p2}
          onChange={setP2}
          onRandomize={() => setP2(randomParent(p2.name || "Parent B", makeRng(Date.now() + 7)))}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            sfx.click(soundOn);
            run();
          }}
          className="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 font-display text-base font-semibold text-primary-foreground hover:opacity-90"
        >
          Mix the DNA
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!child}
          className="inline-flex min-h-12 items-center rounded-xl border border-input px-5 text-sm font-medium hover:bg-secondary disabled:opacity-50"
        >
          Save result
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex min-h-12 items-center rounded-xl border border-input px-5 text-sm font-medium hover:bg-secondary"
        >
          Share
        </button>
      </div>

      <p aria-live="polite" className="mt-3 text-center text-sm text-primary">
        {toast}
      </p>

      <div className="mt-8">
        {phase === "mixing" && (
          <DnaMixer
            onDone={finishMix}
            onSkip={() => setPhase("results")}
            soundOn={soundOn}
            playSound={sfx.mix}
          />
        )}
        {phase === "results" && child && (
          <ResultsPanel
            p1={p1}
            p2={p2}
            child={child}
            childName={childName}
            onChildName={setChildName}
            onRerun={() => {
              sfx.click(soundOn);
              run();
            }}
          />
        )}
        {phase === "build" && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No simulation yet — press <strong className="text-foreground">Mix the DNA</strong> to
            generate one.
          </p>
        )}
      </div>

      {saved.length > 0 && (
        <section aria-labelledby="saved-heading" className="mt-10">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 id="saved-heading" className="truncate text-xl font-bold">
              Saved samples
            </h2>
            <button
              type="button"
              onClick={() => setSaved([])}
              className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-input px-3 text-sm hover:bg-secondary"
            >
              Clear all
            </button>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => (
              <li key={s.id} className="rounded-xl border border-border bg-card p-4">
                <p className="truncate font-semibold">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.at}</p>
                <button
                  type="button"
                  onClick={() => {
                    setP1(s.p1);
                    setP2(s.p2);
                    setChildName(s.label);
                    setChild(simulateChild(s.p1, s.p2, s.seed));
                    setSeed(s.seed);
                    setPhase("results");
                    setToast("Loaded saved sample.");
                  }}
                  className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-input px-3 text-sm hover:bg-secondary"
                >
                  Reload
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
