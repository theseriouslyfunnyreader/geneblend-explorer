import { Link } from "@tanstack/react-router";

export function DisclaimerBar() {
  return (
    <div
      role="note"
      className="border-b border-border bg-secondary/60 px-4 py-2 text-center text-xs text-muted-foreground"
    >
      <strong className="font-semibold text-foreground">Educational simulation only.</strong>{" "}
      GeneBlend uses simplified genetics models and cannot predict a real child.{" "}
      <Link to="/learn" className="underline underline-offset-2 hover:text-primary">
        Why it's simplified
      </Link>
    </div>
  );
}

export function DisclaimerCard({ className = "" }: { className?: string }) {
  return (
    <aside
      role="note"
      className={`rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm text-foreground ${className}`}
    >
      <p className="font-display font-semibold text-accent">This is a teaching model</p>
      <p className="mt-1 text-muted-foreground">
        Results come from classroom-level Mendelian rules. Most human traits involve many genes plus
        environment, so nothing here is a medical, ancestry, or parentage prediction. Blood type is
        the one trait modelled close to real biology.
      </p>
    </aside>
  );
}
