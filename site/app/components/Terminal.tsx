"use client";

import { useEffect, useRef, useState } from "react";

type Line = { prompt?: string; text: string; delay?: number };

const SCRIPT: Line[] = [
  { prompt: "$", text: "python sphincs_minus.py keygen", delay: 60 },
  { text: "private key: 0xafaa19c33b21c4a7e0b1f7a51c8a02d8d3...", delay: 14 },
  { text: "public  key: 0x1000000004ce21ab95d2e8e0f8...", delay: 14 },
  { text: "" },
  { prompt: "$", text: 'python sphincs_minus.py sign 0x<priv> "hello, post-quantum" /tmp/sig.bin', delay: 22 },
  { text: "signature written to /tmp/sig.bin (944 bytes)", delay: 14 },
  { text: "" },
  { prompt: "$", text: 'python sphincs_minus.py verify 0x<pub> "hello, post-quantum" /tmp/sig.bin', delay: 22 },
  { text: "VERIFIED", delay: 14 },
  { text: "" },
  { prompt: "$", text: 'python sphincs_minus.py verify 0x<pub> "tampered" /tmp/sig.bin', delay: 22 },
  { text: "INVALID", delay: 14 },
  { text: "" },
  { prompt: "$", text: "_", delay: 0 },
];

export default function Terminal() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // start typing only when visible (IntersectionObserver)
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setLineIdx(0);
          setCharIdx(0);
          setDone(false);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!startedRef.current || done) return;
    if (lineIdx >= SCRIPT.length) {
      setDone(true);
      return;
    }
    const cur = SCRIPT[lineIdx];
    const full = (cur.prompt ? cur.prompt + " " : "") + cur.text;
    if (charIdx < full.length) {
      const speed = cur.delay ?? 12;
      const t = setTimeout(() => setCharIdx(charIdx + 1), speed);
      return () => clearTimeout(t);
    } else {
      // pause between lines
      const t = setTimeout(() => {
        setLineIdx(lineIdx + 1);
        setCharIdx(0);
      }, cur.delay === 0 ? 100000 : 280);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, done]);

  return (
    <div className="terminal" ref={containerRef}>
      <div className="terminal-bar">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="terminal-title">sphincs-minus · keygen · sign · verify</span>
      </div>
      <div className="terminal-body">
        {SCRIPT.slice(0, lineIdx + 1).map((l, i) => {
          const isCurrent = i === lineIdx;
          const full = (l.prompt ? l.prompt + " " : "") + l.text;
          const visible = isCurrent ? full.slice(0, charIdx) : full;
          const isResult =
            !l.prompt && (l.text === "VERIFIED" || l.text === "INVALID");
          return (
            <div key={i} className={`tline ${isResult ? l.text.toLowerCase() : ""}`}>
              {l.prompt && (
                <span className="prompt">{visible.slice(0, l.prompt.length)}</span>
              )}
              <span>{visible.slice(l.prompt ? l.prompt.length : 0)}</span>
              {isCurrent && charIdx < full.length && <span className="caret">▍</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
