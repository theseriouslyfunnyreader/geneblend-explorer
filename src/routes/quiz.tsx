import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Genetics Quiz — GeneBlend Studio" },
      {
        name: "description",
        content:
          "Test your genetics know-how with 6 fun, kid-friendly questions about DNA, genes and traits. Instant feedback and a celebratory score!",
      },
      { property: "og:title", content: "Genetics Quiz — GeneBlend Studio" },
      {
        property: "og:description",
        content:
          "Six fun questions about DNA, strong and hidden traits, and what a genetics simulator can (and can't) tell you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

type Question = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

const QUESTIONS: Question[] = [
  {
    q: "What does a DNA molecule look like?",
    options: ["A flat square ⬛", "A twisted ladder (double helix) 🪜", "A circle ⭕", "A star ⭐"],
    answer: 1,
    why: "DNA looks like a ladder that got twisted round and round — scientists call it a double helix! 🧬",
  },
  {
    q: "What is a 'dominant' (or strong) trait?",
    options: [
      "A trait that shows up even if you only inherit one copy 💪",
      "A trait that never shows up 🙈",
      "A trait you only get from grandparents 👵",
      "A trait caused by eating vegetables 🥦",
    ],
    answer: 0,
    why: "Strong traits only need ONE copy to show up — like a superhero that always wins the spotlight! 🦸",
  },
  {
    q: "Can two brown-eyed parents have a baby with blue eyes?",
    options: [
      "No, never ❌",
      "Yes, if both parents carry a hidden blue-eye gene 🤫",
      "Only if the baby likes blueberries 🫐",
      "Yes, but only on Tuesdays 📅",
    ],
    answer: 1,
    why: "Hidden blue-eye genes can ride along quietly in both parents — and if the baby gets both, surprise: blue eyes! 👀",
  },
  {
    q: "What do we call the coded instructions inside cells that decide things like hair texture and eye colour?",
    options: ["Bones 🦴", "Genes 🧬", "Batteries 🔋", "Vitamins 💊"],
    answer: 1,
    why: "Genes are like tiny recipes in your body's cookbook, telling it how to build you! 📖",
  },
  {
    q: "If both parents pass down a hidden (recessive) gene for straight hair, what hair will the child have?",
    options: ["Straight hair 📏", "Curly hair 🌀", "Spiky hair 🦔", "Multi-coloured hair 🌈"],
    answer: 0,
    why: "With two hidden straight-hair recipes and no strong curly one to override them, straight hair wins! ✨",
  },
  {
    q: "Can an online simulation predict with 100% accuracy what a real human baby will look like?",
    options: [
      "Yes, completely exact 🎯",
      "No — real traits involve many genes and natural variation 🌍",
      "Yes, if you click fast enough ⚡",
      "Only if you guess right 🎲",
    ],
    answer: 1,
    why: "Real humans are way more complicated — thousands of genes plus the environment all join in. Simulators are for learning, not fortune-telling! 🔮",
  },
];

const TITLES: { min: number; title: string; blurb: string }[] = [
  { min: 6, title: "Junior Gene Genius! 🧬🏆", blurb: "A perfect score! You know your alleles like a real scientist." },
  { min: 4, title: "DNA Detective! 🔍", blurb: "Great work — you've got a sharp eye for how traits travel." },
  { min: 2, title: "Curious Chromosome! 🌱", blurb: "Nice exploring! Every scientist starts with great questions." },
  { min: 0, title: "Budding Biologist! 🔬", blurb: "Good try! Pop into the Learn page and come back for a rematch." },
];

function Confetti() {
  const pieces = Array.from({ length: 40 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = (i * 37) % 100;
        const delay = ((i * 13) % 30) / 10;
        const dur = 2.4 + ((i * 7) % 20) / 10;
        const colors = ["#ff4fd8", "#22d3ee", "#a855f7", "#facc15", "#34d399"];
        const c = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute top-[-5%] h-2.5 w-1.5 rounded-sm"
            style={{
              left: `${left}%`,
              background: c,
              animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
              transform: `rotate(${i * 23}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function QuizPage() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = step >= QUESTIONS.length;

  const question = QUESTIONS[Math.min(step, QUESTIONS.length - 1)]!;
  const score = answers.filter((a, i) => a === QUESTIONS[i]!.answer).length;
  const title = TITLES.find((t) => score >= t.min)!;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((prev) => [...prev, i]);
  };

  const next = () => {
    setPicked(null);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setPicked(null);
    setAnswers([]);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="text-center">
        <p className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          6 questions · just for fun
        </p>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
          The <span className="helix-text">Genetics Quiz</span>
        </h1>
      </header>

      {!done ? (
        <section
          aria-live="polite"
          className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {step + 1} of {QUESTIONS.length}
            </span>
            <span>Score: {score} ⭐</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={step + (picked !== null ? 1 : 0)}
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
            aria-label="Quiz progress"
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step + (picked !== null ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <h2 className="mt-6 text-xl font-bold leading-snug sm:text-2xl">{question.q}</h2>

          <ul className="mt-6 grid gap-3">
            {question.options.map((opt, i) => {
              const isCorrect = i === question.answer;
              const isPicked = picked === i;
              let cls = "border-border bg-secondary/40 hover:border-primary hover:bg-secondary";
              if (picked !== null) {
                if (isCorrect) cls = "border-emerald-400 bg-emerald-500/15 text-foreground";
                else if (isPicked) cls = "border-rose-400 bg-rose-500/15";
                else cls = "border-border bg-secondary/30 opacity-60";
              }
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    aria-pressed={isPicked}
                    className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls}`}
                  >
                    <span>{opt}</span>
                    {picked !== null && isCorrect && <span aria-hidden>✅</span>}
                    {picked !== null && isPicked && !isCorrect && <span aria-hidden>❌</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {picked !== null && (
            <div
              className={`mt-5 rounded-xl border p-4 text-sm sm:text-base ${
                picked === question.answer
                  ? "border-emerald-400/50 bg-emerald-500/10"
                  : "border-rose-400/50 bg-rose-500/10"
              }`}
            >
              <p className="font-bold">
                {picked === question.answer ? "Correct! 🎉" : "Not quite — here's the scoop! 💡"}
              </p>
              <p className="mt-1 text-muted-foreground">{question.why}</p>
              <button
                type="button"
                onClick={next}
                autoFocus
                className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-6 font-display font-semibold text-primary-foreground hover:opacity-90"
              >
                {step + 1 === QUESTIONS.length ? "See my results 🏁" : "Next question ➡️"}
              </button>
            </div>
          )}
        </section>
      ) : (
        <section aria-live="polite" className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
          <Confetti />
          <p className="text-5xl" aria-hidden>🏆</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title.title}</h2>
          <p className="mt-2 text-lg">
            You scored <span className="font-bold text-primary">{score}</span> out of{" "}
            {QUESTIONS.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
            {title.blurb}
          </p>

          <ul className="mx-auto mt-8 grid max-w-xl gap-2 text-left">
            {QUESTIONS.map((q, i) => {
              const ok = answers[i] === q.answer;
              return (
                <li
                  key={i}
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    ok ? "border-emerald-400/40 bg-emerald-500/10" : "border-rose-400/40 bg-rose-500/10"
                  }`}
                >
                  <span aria-hidden>{ok ? "✅" : "❌"}</span>{" "}
                  <span className="font-medium">{q.q}</span>
                  {!ok && (
                    <span className="block pl-6 text-muted-foreground">
                      Right answer: {q.options[q.answer]}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-12 items-center rounded-xl bg-primary px-7 font-display font-semibold text-primary-foreground hover:opacity-90"
            >
              Play again 🔁
            </button>
            <Link
              to="/lab"
              className="inline-flex min-h-12 items-center rounded-xl border border-input px-6 font-medium hover:bg-secondary"
            >
              Return to the Lab 🧪
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
