import { useEffect, useRef, useState } from "react";

interface QA {
  q: string;
  a: string;
}

const QUESTIONS: QA[] = [
  {
    q: "What is DNA and what does it look like?",
    a: "🧬 DNA is like a giant recipe book tucked inside every tiny piece of you! It looks like a twisty ladder — scientists call it a double helix. 🪜 Each gene is one recipe in the book, like 'how to make curly hair' or 'what colour to paint the eyes'. You got half your recipe book from mom and half from dad! 📖",
  },
  {
    q: "Why do I look like my mom or dad?",
    a: "👨‍👩‍👧 Because your recipe book is half theirs! When you were made, mom and dad each handed over half of their recipes, and yours got shuffled together like mixing two decks of cards 🃏. That's why you might have dad's smile, mom's eyes, or a little mix of both! 💛",
  },
  {
    q: "Can two brown-eyed parents have a blue-eyed kid?",
    a: "👀 Yes, surprise! Brown is a LOUD trait — it shouts over quiet blue. Your parents might each be carrying a secret quiet blue instruction hidden behind their brown eyes. If you happened to get both quiet ones… blue eyes! 🔵 It's like both parents hiding a blue marble in their pocket — 1-in-4 chance it becomes yours! 🎲",
  },
  {
    q: "What is a 'strong' vs 'hidden' trait (dominant and recessive)?",
    a: "📣 A STRONG trait (scientists say 'dominant') only needs to show up once to be heard — like a friend shouting. A HIDDEN trait (that's 'recessive') whispers 🤫, so you need two whispers together before anyone notices. Shout beats whisper every time — that's why some traits love to show off! 💪",
  },
  {
    q: "Where did my red hair or curly hair come from if my parents don't have it?",
    a: "🦰 Secret recipes! Red hair is a whisper trait — it can hide quietly inside your parents' recipe books without showing. If you got TWO whisper copies, one from each parent, the red hair finally gets its moment to shine! ✨ Same with curls — sometimes a surprise trait skips a generation and pops up in you! 🌀",
  },
  {
    q: "Why do siblings look different from each other?",
    a: "🎲 Every time recipes get mixed, it's like rolling dice — mom and dad each shuffle a different half for every kid! That's why you and your sister or brother got different mixes from the very same two parents. Families look alike, but never exactly the same — that's what makes you, YOU! 👧🧒",
  },
  {
    q: "What are freckles and dimples, and how do we get them?",
    a: "☀️ Freckles are little dots of extra colour that show up when your skin meets sunshine — and there's a STRONG trait that makes them more likely! 😊 Dimples are tiny dents in your cheeks made by the way your smile muscles are built. Both are recipes you inherited — so if mom or dad has them, you might too! ✨",
  },
  {
    q: "Can this simulator tell me what my real future baby will look like?",
    a: "🔮 Not quite! This is a pretend science lab — a fun game that shows how traits MIGHT mix. Real people are made from thousands of genes (plus lots of other things!), way more than this lab can show. Think of it as practising with toy dice — the real thing is even more amazing! 💛",
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
