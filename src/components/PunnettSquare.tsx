import { cross, phenotypeOf, type Trait } from "@/lib/genetics";

export function PunnettSquare({
  trait,
  p1,
  p2,
  highlight,
}: {
  trait: Trait;
  p1: string;
  p2: string;
  highlight?: string;
}) {
  const { rowAlleles, colAlleles, cells } = cross(trait, p1, p2);

  return (
    <figure className="w-full">
      <table className="w-full table-fixed border-separate border-spacing-1 text-center text-sm">
        <caption className="sr-only">
          Punnett square for {trait.name}: parent one {p1} crossed with parent two {p2}
        </caption>
        <thead>
          <tr>
            <th className="w-1/3 p-1 text-xs font-normal text-muted-foreground">
              <span aria-hidden>×</span>
              <span className="sr-only">Alleles</span>
            </th>
            {colAlleles.map((a, i) => (
              <th
                key={i}
                scope="col"
                className="rounded-md bg-secondary p-2 font-mono text-sm text-foreground"
              >
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowAlleles.map((rowA, r) => (
            <tr key={r}>
              <th
                scope="row"
                className="rounded-md bg-secondary p-2 font-mono text-sm text-foreground"
              >
                {rowA}
              </th>
              {cells[r]!.map((g, c) => {
                const isHit = highlight === g;
                return (
                  <td
                    key={c}
                    className={`rounded-md border p-2 font-mono transition-colors ${
                      isHit
                        ? "border-primary bg-primary/20 text-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <span className="block text-base">{g}</span>
                    <span className="block text-[10px] font-sans leading-tight">
                      {phenotypeOf(trait, g)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        Each cell is an equally likely allele combination. Highlighted cell = this child's outcome.
      </figcaption>
    </figure>
  );
}
