export default function Page() {
  return (
    <main className="page">
      <header className="hero">
        <div className="glyph">𓁢</div>
        <h1>unisphinx</h1>
        <div className="tag">
          post-quantum signatures for the next ethereum
        </div>
      </header>

      <p className="oracle">
        <span className="pulse" />
        the sphinx asks one question: will your signature outlive the curve?
      </p>

      <section>
        <h2>1. the riddle</h2>
        <p>
          every ethereum signature today is an ecdsa signature over secp256k1.
          when a sufficiently large quantum computer arrives, every secp256k1
          key is solvable in minutes. every wallet exposed. every contract
          ownership in question.
        </p>
        <p>
          the migration to post-quantum signatures is not optional. it is
          inevitable. the only question is whether the tooling exists by the
          time it is needed.
        </p>
      </section>

      <section>
        <h2>2. the answer</h2>
        <p>
          <b>sphincs-</b> (sphincs-minus) is a minimal stateless hash-based
          post-quantum signature scheme, optimized for evm-friendly
          deployment. it is the work of vitalik buterin, building on the
          broader sphincs+ research lineage.
        </p>
        <p>it uses only what ethereum already has:</p>
        <ul>
          <li>keccak256 / sha3-256 as the only primitive</li>
          <li>no elliptic curves, no pairings, no exotic assumptions</li>
          <li>signature size: 944 bytes</li>
          <li>private key: 32 bytes</li>
          <li>nist security level 1 (128-bit)</li>
          <li>d=2 hypertree depth, fors+c, wots+c</li>
        </ul>
        <p>
          a python reference implementation and a lean 4 formal verification
          live in this repository. read the source. the cryptography is not
          ours, but the tooling is.
        </p>
      </section>

      <section>
        <h2>3. why unisphinx</h2>
        <p>
          we package sphincs- for builders. a clean repository. a landing
          page. attribution to the cryptographer who wrote it. forthcoming
          documentation, javascript bindings, and a solidity verifier.
        </p>
        <p>
          the sphinx is the keeper at the gate. it knows the riddle before the
          traveller arrives. we are the keeper at the gate of the post-quantum
          age — not the one who solved it, but the one who carries the answer
          forward.
        </p>
      </section>

      <section>
        <h2>4. the token</h2>
        <p>
          a <span className="mono">$UNISPHINX</span> token will be launched on
          ethereum mainnet to fund continued work — solidity verifier
          development, audits, ecosystem integration, and outreach to wallet
          providers. the token does not gate access to the cryptography. the
          cryptography is and will remain free.
        </p>
        <div className="token-card">
          <div className="label">contract address</div>
          <div className="ca pending">tbd — announced on this page at launch</div>
          <div className="label">pool</div>
          <div className="ca pending">tbd — uniswap v4, halv/eth</div>
          <div className="label">supply</div>
          <div className="ca">21,000,000 unisphinx</div>
          <div className="links">
            <a href="#" aria-disabled>uniswap (pending)</a>
            <a href="#" aria-disabled>dexscreener (pending)</a>
            <a href="#" aria-disabled>etherscan (pending)</a>
          </div>
        </div>
      </section>

      <section>
        <h2>5. attribution</h2>
        <p>
          this repository is a public fork of{" "}
          <a href="https://github.com/vbuterin/sphincsminus">
            vbuterin/sphincsminus
          </a>
          . every cryptographic file is the work of vitalik buterin and the
          sphincs- paper authors. unisphinx adds: a rebranded readme, this
          landing, full attribution, and a permissive license for the
          additions.
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
          <cite>vbuterin/sphincsminus, may 2026</cite>
        </blockquote>
      </section>

      <section>
        <h2>6. references</h2>
        <ul>
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
        <p>unisphinx · 2026 · cryptography by vbuterin · tooling by 402proto</p>
        <div className="channels">
          <a href="https://github.com/402proto/unisphinx">github</a>
          <a href="#">twitter (soon)</a>
          <a href="#">telegram (soon)</a>
        </div>
      </footer>
    </main>
  );
}
