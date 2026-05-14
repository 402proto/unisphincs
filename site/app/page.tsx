function SphinxMark() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="unisphinx mark"
    >
      <defs>
        <linearGradient id="pinkGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4DA1" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>
      </defs>
      {/* nemes headdress wings (signature striped headcloth) */}
      <path
        d="M40 70 Q40 50 70 45 L100 40 L130 45 Q160 50 160 70 L160 100 L150 110 L150 78 Q140 70 130 68 L100 64 L70 68 Q60 70 50 78 L50 110 L40 100 Z"
        fill="url(#pinkGrad)"
      />
      {/* nemes stripes */}
      <line x1="55" y1="75" x2="55" y2="105" stroke="#0d0717" strokeWidth="2" opacity="0.4" />
      <line x1="68" y1="71" x2="68" y2="108" stroke="#0d0717" strokeWidth="2" opacity="0.4" />
      <line x1="132" y1="71" x2="132" y2="108" stroke="#0d0717" strokeWidth="2" opacity="0.4" />
      <line x1="145" y1="75" x2="145" y2="105" stroke="#0d0717" strokeWidth="2" opacity="0.4" />
      {/* face (front) */}
      <path
        d="M75 70 Q75 60 100 58 Q125 60 125 70 L125 115 Q125 130 100 132 Q75 130 75 115 Z"
        fill="url(#pinkGrad)"
      />
      {/* uraeus (cobra) on forehead */}
      <path
        d="M97 50 Q100 42 103 50 Q100 55 97 50 Z"
        fill="url(#pinkGrad)"
      />
      <circle cx="100" cy="48" r="1.5" fill="#0d0717" />
      {/* eyes */}
      <ellipse cx="90" cy="88" rx="3.5" ry="2.5" fill="#0d0717" />
      <ellipse cx="110" cy="88" rx="3.5" ry="2.5" fill="#0d0717" />
      {/* eyeliner extending outward (egyptian style) */}
      <path d="M82 88 Q78 89 76 91" stroke="#0d0717" strokeWidth="1.5" fill="none" />
      <path d="M118 88 Q122 89 124 91" stroke="#0d0717" strokeWidth="1.5" fill="none" />
      {/* nose/lips suggestion */}
      <path d="M100 102 L100 110" stroke="#0d0717" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M93 118 Q100 121 107 118" stroke="#0d0717" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* false beard (osird-like) */}
      <path
        d="M93 130 L97 145 L103 145 L107 130 Z"
        fill="url(#pinkGrad)"
        opacity="0.85"
      />
      {/* body (couchant lion) silhouette */}
      <path
        d="M50 135 Q60 130 80 132 L100 135 L120 132 Q140 130 150 135 L160 150 Q165 158 160 165 L40 165 Q35 158 40 150 Z"
        fill="url(#pinkGrad)"
        opacity="0.95"
      />
      {/* paws hint */}
      <rect x="50" y="160" width="14" height="8" rx="2" fill="url(#pinkGrad)" />
      <rect x="136" y="160" width="14" height="8" rx="2" fill="url(#pinkGrad)" />
    </svg>
  );
}

export default function Page() {
  return (
    <main className="page">
      <header className="hero">
        <div className="logo-mark">
          <SphinxMark />
        </div>
        <h1>unisphinx</h1>
        <div className="tag">
          post-quantum signatures for the next ethereum. uniswap-ready toolkit
          around sphincs-.
        </div>
        <div className="cta-row">
          <a className="btn btn-primary" href="#token">
            buy $unisphinx
          </a>
          <a className="btn" href="https://github.com/402proto/unisphinx">
            github
          </a>
          <a className="btn" href="https://github.com/vbuterin/sphincsminus">
            upstream
          </a>
        </div>
        <p className="oracle">
          <span className="pulse" />
          the sphinx asks one question: will your signature outlive the curve?
        </p>
      </header>

      <section>
        <span className="section-tag">01 · the riddle</span>
        <h2>every ethereum key is broken in 2030</h2>
        <p>
          every ethereum signature today is an <b>ecdsa</b> signature over the{" "}
          <b>secp256k1</b> curve. when a sufficiently large quantum computer
          arrives, every secp256k1 key is solvable in minutes. every wallet
          exposed. every contract ownership in question.
        </p>
        <p>
          the migration to post-quantum signatures is not optional. it is
          inevitable. the only question is whether the tooling exists by the
          time it is needed.
        </p>
      </section>

      <section>
        <span className="section-tag">02 · the answer</span>
        <h2>sphincs-: minimal, stateless, evm-friendly</h2>
        <p>
          <b>sphincs-</b> (sphincs-minus) is a minimal stateless hash-based
          post-quantum signature scheme, designed by vitalik buterin and
          optimized for evm-friendly deployment.
        </p>

        <div className="spec-grid">
          <div className="spec-item">
            <div className="label">signature</div>
            <div className="value">944 bytes</div>
          </div>
          <div className="spec-item">
            <div className="label">private key</div>
            <div className="value">32 bytes</div>
          </div>
          <div className="spec-item">
            <div className="label">primitive</div>
            <div className="value">keccak256</div>
          </div>
          <div className="spec-item">
            <div className="label">security</div>
            <div className="value">nist L1</div>
          </div>
          <div className="spec-item">
            <div className="label">hypertree</div>
            <div className="value">d=2</div>
          </div>
          <div className="spec-item">
            <div className="label">curves used</div>
            <div className="value">zero</div>
          </div>
        </div>

        <ul className="feature-list">
          <li>no elliptic curves, no pairings, no exotic assumptions</li>
          <li>only ethereum-native hash primitives</li>
          <li>python reference + lean 4 formal verification</li>
          <li>known-answer test vectors included</li>
        </ul>

        <p>
          a python reference implementation and a lean 4 formal verification
          live in this repository. read the source. the cryptography is not
          ours — but the tooling will be.
        </p>
      </section>

      <section>
        <span className="section-tag">03 · why unisphinx</span>
        <h2>we package the work for builders</h2>
        <p>
          we forked sphincs- and wrapped it in everything a builder needs to
          ship: clean repository, attribution, landing page, and forthcoming
          javascript bindings and a solidity verifier contract.
        </p>
        <p>
          the sphinx is the keeper at the gate. it knows the riddle before the
          traveller arrives. we are the keeper at the gate of the post-quantum
          age — not the one who solved it, but the one who carries the answer
          forward.
        </p>
      </section>

      <section id="token">
        <span className="section-tag">04 · the token</span>
        <h2>$unisphinx funds the tooling</h2>
        <p>
          a <b>$UNISPHINX</b> token launches on ethereum mainnet to fund
          continued work: solidity verifier development, security audits,
          ecosystem integration, and outreach to wallet providers. the token
          does not gate access to the cryptography. the cryptography is and
          will remain free.
        </p>

        <div className="card pink token-card">
          <div className="label">contract address</div>
          <div className="ca pending">tbd — announced on this page at launch</div>
          <div className="label">pool</div>
          <div className="ca pending">tbd — uniswap v4, unisphinx/eth</div>
          <div className="label">total supply</div>
          <div className="ca">21,000,000 $UNISPHINX</div>
          <div className="links">
            <a href="#" aria-disabled>uniswap (pending)</a>
            <a href="#" aria-disabled>dexscreener (pending)</a>
            <a href="#" aria-disabled>etherscan (pending)</a>
          </div>
        </div>
      </section>

      <section>
        <span className="section-tag">05 · attribution</span>
        <h2>credit where credit is due</h2>
        <p>
          this repository is a public fork of{" "}
          <a href="https://github.com/vbuterin/sphincsminus">
            vbuterin/sphincsminus
          </a>
          . every cryptographic file is the work of vitalik buterin and the
          sphincs- paper authors. unisphinx adds: a rebranded readme, this
          landing, full attribution, and a permissive license for the
          additions only.
        </p>
        <p>
          if vitalik buterin or any of the original authors request changes,
          we comply immediately. see{" "}
          <a href="https://github.com/402proto/unisphinx/blob/main/ATTRIBUTION.md">
            ATTRIBUTION.md
          </a>{" "}
          in the repo.
        </p>
        <blockquote>
          a minimal post-quantum stateless hash-based signature scheme
          optimized for evm-friendly deployment.
          <cite>— vbuterin/sphincsminus, may 2026</cite>
        </blockquote>
      </section>

      <section>
        <span className="section-tag">06 · references</span>
        <h2>read the source</h2>
        <ul className="feature-list">
          <li>
            <a href="https://github.com/vbuterin/sphincsminus">
              vbuterin/sphincsminus
            </a>{" "}
            — reference implementation (python + lean 4)
          </li>
          <li>
            sphincs-: efficient stateless post-quantum signatures (research
            paper, included in repo)
          </li>
          <li>
            <a href="https://github.com/402proto/unisphinx">
              402proto/unisphinx
            </a>{" "}
            — this fork
          </li>
          <li>
            <a href="https://csrc.nist.gov/projects/post-quantum-cryptography">
              nist pqc programme
            </a>{" "}
            — the broader post-quantum migration context
          </li>
        </ul>
      </section>

      <footer>
        <p>unisphinx · cryptography by vbuterin · tooling by 402proto · 2026</p>
        <div className="channels">
          <a href="https://github.com/402proto/unisphinx">github</a>
          <a href="#">twitter (soon)</a>
          <a href="#">telegram (soon)</a>
        </div>
      </footer>
    </main>
  );
}
