"use client";

import { useEffect, useRef, useState } from "react";

type Line = { prompt?: string; text: string };
type Script = { title: string; lines: Line[] };

const SCRIPTS: Script[] = [
  {
    title: "sphincs- · keygen · sign · verify",
    lines: [
      { prompt: "$", text: "python sphincs_minus.py keygen" },
      { text: "private key: 0xafaa19c33b21c4a7e0b1f7a51c8a02d8d3..." },
      { text: "public  key: 0x1000000004ce21ab95d2e8e0f8..." },
      { text: "" },
      { prompt: "$", text: 'python sphincs_minus.py sign 0x<priv> "hello, post-quantum" /tmp/sig.bin' },
      { text: "signature written to /tmp/sig.bin (944 bytes)" },
      { text: "" },
      { prompt: "$", text: 'python sphincs_minus.py verify 0x<pub> "hello, post-quantum" /tmp/sig.bin' },
      { text: "VERIFIED" },
    ],
  },
  {
    title: "tampering test",
    lines: [
      { prompt: "$", text: 'python sphincs_minus.py verify 0x<pub> "tampered" /tmp/sig.bin' },
      { text: "INVALID" },
      { text: "" },
      { prompt: "$", text: "wc -c /tmp/sig.bin" },
      { text: "     944 /tmp/sig.bin" },
      { text: "" },
      { prompt: "$", text: "xxd /tmp/sig.bin | head -1" },
      { text: "00000000: 5e3a 70b1 c4a2 f719 38d4 6e1f 80c0 a9e3  ^:p.....8.n....." },
    ],
  },
  {
    title: "lean 4 · formal verification",
    lines: [
      { prompt: "$", text: "lake build Examples.SphincsMinus.CLI" },
      { text: "building SphincsMinus" },
      { text: "  ✓ Hash.lean" },
      { text: "  ✓ FORS.lean" },
      { text: "  ✓ WOTS.lean" },
      { text: "  ✓ Hypertree.lean" },
      { text: "  ✓ Verify.lean" },
      { text: "" },
      { text: "all theorems checked. 0 sorry. 0 admit." },
    ],
  },
  {
    title: "benchmark vs ecdsa",
    lines: [
      { prompt: "$", text: "python benchmark.py --compare ecdsa" },
      { text: "" },
      { text: "scheme       keygen      sign     verify   sig-size  quantum" },
      { text: "----------  --------  --------  --------  --------  --------" },
      { text: "ecdsa        0.05 ms   0.08 ms   0.12 ms     65 B   broken" },
      { text: "sphincs-     2.10 ms  49.40 ms   1.30 ms    944 B   secure" },
      { text: "" },
      { text: "verdict: ~15x slower sign, post-quantum secure." },
    ],
  },
  {
    title: "kat · known-answer tests",
    lines: [
      { prompt: "$", text: "python verify_test_vector.py" },
      { text: "loading test_vector.json ..." },
      { text: "  [1/8] keygen seed=0x0001...   ok" },
      { text: "  [2/8] sign  msg=0xdead...    ok" },
      { text: "  [3/8] verify positive case   ok" },
      { text: "  [4/8] verify negative case   ok" },
      { text: "  [5/8] fors  branch=2         ok" },
      { text: "  [6/8] wots  depth=2          ok" },
      { text: "  [7/8] hypertree d=2          ok" },
      { text: "  [8/8] aggregate kat hash     ok" },
      { text: "" },
      { text: "all 8 kat passed." },
    ],
  },
];

const TYPE_PROMPT = 22;
const TYPE_OUTPUT = 9;
const LINE_PAUSE_PROMPT = 350;
const LINE_PAUSE_OUTPUT = 120;
const SCRIPT_END_PAUSE = 2400;

export default function Terminal() {
  const [scriptIdx, setScriptIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [scriptFade, setScriptFade] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // auto-start after a short delay so the page settles first
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    const script = SCRIPTS[scriptIdx];
    if (lineIdx >= script.lines.length) {
      // script finished — fade, clear, advance
      const t1 = setTimeout(() => setScriptFade(true), SCRIPT_END_PAUSE);
      const t2 = setTimeout(() => {
        setScriptIdx((s) => (s + 1) % SCRIPTS.length);
        setLineIdx(0);
        setCharIdx(0);
        setScriptFade(false);
      }, SCRIPT_END_PAUSE + 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const cur = script.lines[lineIdx];
    const full = (cur.prompt ? cur.prompt + " " : "") + cur.text;
    if (charIdx < full.length) {
      const speed = cur.prompt ? TYPE_PROMPT : TYPE_OUTPUT;
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const pause = cur.prompt ? LINE_PAUSE_PROMPT : LINE_PAUSE_OUTPUT;
      const t = setTimeout(() => {
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, pause);
      return () => clearTimeout(t);
    }
  }, [started, scriptIdx, lineIdx, charIdx]);

  const script = SCRIPTS[scriptIdx];
  const visibleLines = script.lines.slice(0, lineIdx + 1);

  return (
    <div className="terminal" ref={containerRef}>
      <div className="terminal-bar">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="terminal-title">{script.title}</span>
        <span className="terminal-counter">
          {String(scriptIdx + 1).padStart(2, "0")} / {String(SCRIPTS.length).padStart(2, "0")}
        </span>
      </div>
      <div className={`terminal-body ${scriptFade ? "fading" : ""}`}>
        {visibleLines.map((l, i) => {
          const isCurrent = i === lineIdx;
          const full = (l.prompt ? l.prompt + " " : "") + l.text;
          const visible = isCurrent ? full.slice(0, charIdx) : full;
          const status =
            !l.prompt && (l.text === "VERIFIED" || l.text === "INVALID")
              ? l.text.toLowerCase()
              : "";
          return (
            <div key={i} className={`tline ${status}`}>
              {l.prompt && (
                <span className="prompt">
                  {visible.slice(0, Math.min(l.prompt.length, visible.length))}
                </span>
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
