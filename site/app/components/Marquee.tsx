const ITEMS = [
  "post-quantum",
  "stateless",
  "hash-based",
  "evm-friendly",
  "keccak256",
  "944 bytes",
  "nist L1",
  "no curves",
  "no pairings",
  "formally verified",
  "lean 4",
  "d=2 hypertree",
  "fors+c",
  "wots+c",
];

export default function Marquee() {
  // duplicate so the loop is seamless
  const items = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className="marquee-item">
            <span className="dot" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
