const DOTS = [
  { left: "8%", top: "18%", delay: "0s", dur: "17s", size: 5 },
  { left: "22%", top: "72%", delay: "-3s", dur: "21s", size: 3 },
  { left: "35%", top: "34%", delay: "-7s", dur: "19s", size: 4 },
  { left: "48%", top: "82%", delay: "-11s", dur: "23s", size: 3 },
  { left: "61%", top: "24%", delay: "-5s", dur: "18s", size: 6 },
  { left: "72%", top: "58%", delay: "-9s", dur: "22s", size: 4 },
  { left: "84%", top: "12%", delay: "-13s", dur: "20s", size: 3 },
  { left: "91%", top: "68%", delay: "-2s", dur: "24s", size: 5 },
  { left: "15%", top: "48%", delay: "-15s", dur: "26s", size: 4 },
  { left: "55%", top: "6%", delay: "-8s", dur: "25s", size: 3 },
  { left: "30%", top: "92%", delay: "-6s", dur: "19s", size: 4 },
  { left: "78%", top: "88%", delay: "-12s", dur: "21s", size: 3 },
];

export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-orb ambient-orb-pink" />
      <div className="ambient-orb ambient-orb-cyan" />
      <div className="ambient-orb ambient-orb-purple" />
      <div className="ambient-dots">
        {DOTS.map((d, i) => (
          <span
            key={i}
            className="ambient-dot"
            style={{
              left: d.left,
              top: d.top,
              width: `${d.size}px`,
              height: `${d.size}px`,
              animationDelay: d.delay,
              animationDuration: d.dur,
            }}
          />
        ))}
      </div>
      <div className="ambient-veil" />
    </div>
  );
}
