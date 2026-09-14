import { useEffect, useRef, useState } from "react";

interface QA {
  q: string;
  a: string;
}

const QUESTIONS: QA[] = [
  {
    q: "Why do I have a different eye colour than my parents?",
    a: "🧬 Everyone carries two instructions for eye colour — one from each parent. Some instructions are loud and some are quiet. Your parents might each be carrying a quiet blue instruction hidden behind their brown eyes, and you got both quiet ones. Surprise! 👀",
  },
  {
    q: "What is a gene or DNA?",
    a: "📖 DNA is like a giant recipe book inside every tiny piece of you. A gene is one recipe in that book — like 'how to make curly hair' or 'what colour to paint the eyes'. You got half your recipe book from each parent! 🥣",
  },
  {
    q: "What does dominant mean?",
    a: "📣 A dominant trait is a STRONG trait — it only needs to show up once to be heard, like a friend shouting. A recessive trait is a HIDDEN trait — it whispers, so you need two whispers together before anyone notices. 🤫",
  },
  {
    q: "Can two brown-eyed parents have a blue-eyed child?",
    a: "✅ Yes! If both parents secretly carry a hidden blue instruction, there's a 1-in-4 chance their child gets both hidden ones and ends up with blue eyes. It's a bit like both parents having a blue marble in their pocket. 🔵",
  },
  {
    q: "Is this how real babies are made?",
    a: "🧪 Not quite! This is a pretend science game. Real people are made from thousands of genes mixing together, plus lots of other things. This lab only shows a few simple ones so the idea is easy to see. 💛",
  },
  {
    q: "Why are my hair and my sister's hair different?",
    a: "🎲 Every time instructions get mixed, it's like shaking dice. Brothers and sisters get different mixes from the same two parents — that's why families look alike but never exactly the same! 👧🧒",
  },
];

export function GeneGuide() {
  const [open, setOpen] = useState(false);
  const [asked, setAsked] = useState<QA[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" });
  }, [open, asked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const remaining = QUESTIONS.filter((q) => !asked.some((a) => a.q === q.q));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="gene-guide-panel"
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground shadow-lg transition hover:scale-105"
      >
        <span aria-hidden>{open ? "✕" : "🧬"}</span>
        <span className="sr-only">
          {open ? "Close Gina the gene guide" : "Ask Gina the gene guide"}
        </span>
      </button>

      {open && (
        <div
          id="gene-guide-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Gina the gene guide"
          className="fixed bottom-24 right-4 z-50 flex max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-border bg-primary/10 p-4">
            <span aria-hidden className="text-3xl">
              🦸‍♀️
            </span>
            <div className="min-w-0">
              <p className="truncate font-display font-bold">Gina the Gene Guide</p>
              <p className="truncate text-xs text-muted-foreground">Ask me anything about DNA!</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            <p className="rounded-2xl rounded-tl-sm bg-secondary p-3">
              Hi! 👋 I'm Gina. Tap a question and I'll explain it the easy way.
            </p>
            {asked.map((qa) => (
              <div key={qa.q} className="space-y-2">
                <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
                  {qa.q}
                </p>
                <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-secondary p-3">
                  {qa.a}
                </p>
              </div>
            ))}
            {remaining.length === 0 && (
              <p className="text-center text-xs text-muted-foreground">
                That's all my questions — press start over to ask again! 🎉
              </p>
            )}
            <div ref={endRef} />
          </div>

          <div className="space-y-2 border-t border-border p-3">
            {remaining.slice(0, 3).map((qa) => (
              <button
                key={qa.q}
                type="button"
                onClick={() => setAsked([...asked, qa])}
                className="block w-full rounded-xl border border-input px-3 py-2 text-left text-xs hover:bg-secondary"
              >
                {qa.q}
              </button>
            ))}
            {asked.length > 0 && (
              <button
                type="button"
                onClick={() => setAsked([])}
                className="w-full rounded-xl bg-secondary px-3 py-2 text-xs font-semibold hover:opacity-90"
              >
                Start over 🔄
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
