let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

/** Short, soft synthesized blip. No-ops when sound is off or unsupported. */
export function blip(enabled: boolean, freq = 440, ms = 120, gain = 0.05) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + ms / 1000);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + ms / 1000 + 0.02);
}

export const sfx = {
  click: (on: boolean) => blip(on, 520, 90),
  mix: (on: boolean) => blip(on, 300, 400, 0.04),
  reveal: (on: boolean) => {
    blip(on, 560, 160);
    setTimeout(() => blip(on, 780, 260), 130);
  },
};
