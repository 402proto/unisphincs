# unisphinx

post-quantum signatures for the next ethereum.

## what

uniswap-ready toolkit around **sphincs-** — a minimal stateless hash-based post-quantum signature scheme, optimized for evm-friendly deployment. the protocol that survives the quantum age.

based on vitalik buterin's reference implementation (`vbuterin/sphincsminus`) and the sphincs- paper. we package it for builders: clean repo, landing, docs, examples, and an emerging js sdk.

## why

every ethereum signature today (ecdsa over secp256k1) is broken by a sufficiently large quantum computer. when that day arrives, every account is exposed. sphincs- is one of the candidates to replace the curve — small enough to deploy, formally verifiable, and built around keccak.

before the day comes, the tooling must exist. unisphinx is the tooling.

## quick start

```bash
# reference python implementation (vbuterin)
python sphincs_minus.py keygen
python sphincs_minus.py sign 0x<priv> "hello" /tmp/sig.bin
python sphincs_minus.py verify 0x<pub> "hello" /tmp/sig.bin
```

| signature size | 944 bytes |
| key size | 32 bytes (private), variable (public) |
| security level | nist level 1 (128-bit) |
| hash primitive | keccak256 / sha3-256 |
| hypertree depth | d=2 |

## structure

```
sphincs_minus.py         — reference python implementation (upstream)
SphincsMinus.lean        — formal verification in lean 4 (upstream)
SPHINCS-_paper.md        — original research paper (upstream)
test_vector.json         — known-answer test vectors (upstream)
verify_test_vector.py    — test runner (upstream)
UPSTREAM_README.md       — original readme from vbuterin/sphincsminus
site/                    — unisphinx landing (added)
ATTRIBUTION.md           — credits and provenance (added)
```

## attribution

every line of code in this repo (except `site/`) is the work of vitalik buterin and the sphincs- paper authors. unisphinx is a rebrand-and-deploy effort that does not claim authorship of the cryptography. see [`ATTRIBUTION.md`](./ATTRIBUTION.md) for the full provenance.

upstream: [vbuterin/sphincsminus](https://github.com/vbuterin/sphincsminus)
paper: included as [SPHINCS- _ Efficient Stateless Post-Quantum Signat.md](./SPHINCS-%20_%20Efficient%20Stateless%20Post-Quantum%20Signat.md)

## token

a $unisphinx token will be launched on ethereum mainnet to fund continued tooling, audits, and ecosystem integrations. contract address and uniswap pool will be announced on the [landing page](https://unisphinx.xyz) and via attached channels.

## license

mit for additions under `site/` and any future `sdk/`. upstream content under `sphincs_minus.py`, `SphincsMinus.lean`, and related files remains under whatever license vbuterin attaches to the upstream repo. see [`ATTRIBUTION.md`](./ATTRIBUTION.md).
