"use client";

import { useEffect, useState } from "react";

// purely illustrative — "cryptographically relevant quantum computer" projections
// vary by source (NIST, NSA, mosca's theorem). we anchor at a deliberately
// vague 2030-01-01 as a wake-up date, not a prediction. caveat in tooltip.
const TARGET = new Date("2030-01-01T00:00:00Z").getTime();

function fmt(n: number) {
  return n.toString().padStart(2, "0");
}

export default function QuantumEta() {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      const sec = Math.floor(diff / 1000);
      setT({
        d: Math.floor(sec / 86400),
        h: Math.floor((sec % 86400) / 3600),
        m: Math.floor((sec % 3600) / 60),
        s: sec % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) {
    return (
      <div className="eta">
        <div className="eta-label">cryptographically-relevant quantum computer eta</div>
        <div className="eta-clock">— — : — — : — — : — —</div>
      </div>
    );
  }

  return (
    <div className="eta" title="2030-01-01 is a deliberately vague wake-up reference, not a prediction. mosca, nsa, and nist agree the window has begun.">
      <div className="eta-label">cryptographically-relevant quantum computer eta</div>
      <div className="eta-clock">
        <span className="num">{t.d}</span>
        <span className="u">d</span>
        <span className="sep">:</span>
        <span className="num">{fmt(t.h)}</span>
        <span className="u">h</span>
        <span className="sep">:</span>
        <span className="num">{fmt(t.m)}</span>
        <span className="u">m</span>
        <span className="sep">:</span>
        <span className="num">{fmt(t.s)}</span>
        <span className="u">s</span>
      </div>
      <div className="eta-note">every second your wallet still trusts secp256k1</div>
    </div>
  );
}
