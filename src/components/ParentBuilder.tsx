import {
  TRAITS,
  genotypesFor,
  phenotypeOf,
  type Parent,
  type Trait,
} from "@/lib/genetics";

const CATEGORIES: Trait["category"][] = ["Hair & Eyes", "Face", "Senses", "Body", "Blood"];

export function ParentBuilder({
  parent,
  onChange,
  onRandomize,
  accent,
  label,
}: {
  parent: Parent;
  onChange: (p: Parent) => void;
  onRandomize: () => void;
  accent: "primary" | "accent";
  label: string;
}) {
  const idBase = label.replace(/\s+/g, "-").toLowerCase();
  const ring = accent === "primary" ? "border-primary/50" : "border-accent/50";
  const dot = accent === "primary" ? "bg-primary" : "bg-accent";

  return (
    <section
      aria-labelledby={`${idBase}-heading`}
      className={`rounded-2xl border ${ring} bg-card p-5`}
      style={{ boxShadow: "var(--shadow-lab)" }}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-3 w-3 shrink-0 rounded-full ${dot}`} aria-hidden />
          <h2 id={`${idBase}-heading`} className="truncate text-lg font-bold">
            {label}
          </h2>
        </div>
        <button
          type="button"
          onClick={onRandomize}
          className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-input px-3 text-sm font-medium hover:bg-secondary"
        >
          Randomize
        </button>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idBase}-name`} className="block text-xs font-medium text-muted-foreground">
            Display name
          </label>
          <input
            id={`${idBase}-name`}
            value={parent.name}
            maxLength={24}
            onChange={(e) => onChange({ ...parent, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
            placeholder="Parent name"
          />
        </div>
        <div>
          <label htmlFor={`${idBase}-height`} className="block text-xs font-medium text-muted-foreground">
            Height: {parent.heightCm} cm
          </label>
          <input
            id={`${idBase}-height`}
            type="range"
            min={140}
            max={205}
            value={parent.heightCm}
            onChange={(e) => onChange({ ...parent, heightCm: Number(e.target.value) })}
            className="mt-3 w-full accent-[var(--color-primary)]"
          />
        </div>
      </div>

      {CATEGORIES.map((cat) => (
        <fieldset key={cat} className="mt-5">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {cat}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRAITS.filter((t) => t.category === cat).map((trait) => {
              const id = `${idBase}-${trait.id}`;
              const value = parent.traits[trait.id] ?? genotypesFor(trait)[0]!;
              return (
                <div key={trait.id} className="min-w-0">
                  <label htmlFor={id} className="block text-xs text-muted-foreground">
                    {trait.name}
                  </label>
                  <select
                    id={id}
                    value={value}
                    onChange={(e) =>
                      onChange({
                        ...parent,
                        traits: { ...parent.traits, [trait.id]: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground"
                  >
                    {genotypesFor(trait).map((g) => (
                      <option key={g} value={g}>
                        {phenotypeOf(trait, g)} ({g})
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
    </section>
  );
}
