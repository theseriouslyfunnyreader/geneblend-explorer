import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/persist";

const STEPS = [
  "Collecting parent allele pairs…",
  "Separating chromosomes (meiosis)…",
  "Recombining one allele from each parent…",
  "Reading the resulting genotype…",
];

export function DnaMixer({
  onDone,
  onSkip,
  soundOn,
  playSound,
}: {
  onDone: () => void;
  onSkip: () => void;
  soundOn: boolean;
  playSound: (on: boolean) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    playSound(soundOn);
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 700));
    const finish = setTimeout(onDone, STEPS.length * 700 + 300);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center"
      style={{ boxShadow: "var(--shadow-lab)" }}
    >
      <div className="mx-auto flex h-40 max-w-md items-center justify-center gap-1">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex h-full w-4 flex-col justify-center gap-1">
            <span
              className="block h-2 rounded-full bg-primary"
              style={{ animation: `strand-left 700ms ease-out ${i * 45}ms both` }}
            />
            <span
              className="block h-8 origin-center rounded-full bg-accent/70"
              style={{ animation: `rung-pop 500ms ease-out ${300 + i * 45}ms both` }}
            />
            <span
              className="block h-2 rounded-full bg-chart-3"
              style={{ animation: `strand-right 700ms ease-out ${i * 45}ms both` }}
            />
          </div>
        ))}
      </div>

      <p aria-live="polite" className="mt-6 font-display text-lg text-foreground">
        {STEPS[Math.min(step, STEPS.length - 1)]}
      </p>
      <div className="mx-auto mt-4 h-1.5 w-64 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-secondary"
      >
        Skip animation
      </button>
    </div>
  );
}
