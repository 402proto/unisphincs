# attribution

unisphincs is a fork-and-rebrand of [vbuterin/sphincsminus](https://github.com/vbuterin/sphincsminus). the cryptographic work is not ours.

## what is upstream

every file at the root of this repository, except `README.md` (which is rebranded), originates from vbuterin/sphincsminus:

- `sphincs_minus.py` — reference python implementation by vitalik buterin
- `SphincsMinus.lean` and the `SphincsMinus/` directory — lean 4 formal verification by vitalik buterin
- `lakefile.lean` / `lake-manifest.json` — lean build configuration
- `test_vector.json` / `verify_test_vector.py` — test vectors
- `SPHINCS- _ Efficient Stateless Post-Quantum Signat.md` — the sphincs- paper (research authors, not vbuterin alone)
- `UPSTREAM_README.md` — the original readme, preserved verbatim

## what is ours

- `README.md` — rebranded for the unisphincs project
- `ATTRIBUTION.md` — this file
- `site/` — landing page (next.js, mit)
- any future `sdk/` or `examples/` — under mit

## research

the underlying scheme is described in:

> SPHINCS-: Efficient Stateless Post-Quantum Signatures.

cite the paper itself when discussing the cryptography, not unisphincs.

## intent

we forked publicly to make the post-quantum tooling more discoverable and to assemble it into a single landing that builders and ethereum researchers can reference. we do not relicense vbuterin's work. if vitalik buterin or any of the original sphincs- authors request changes or attribution adjustments, we will comply immediately.

contact: open an issue on this repository, or reach the team via channels listed at [unisphincs.xyz](https://unisphincs.xyz).
