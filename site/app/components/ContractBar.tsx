"use client";

import { useState } from "react";

const CA = "0x7a1EFc8b1ef04322cFB0CCB115336017d6c95feA";

const UNISWAP_URL = `https://app.uniswap.org/swap?chain=ethereum&outputCurrency=${CA}`;
const ETHERSCAN_URL = `https://etherscan.io/token/${CA}`;
const DEXSCREENER_URL = `https://dexscreener.com/ethereum/${CA}`;

export default function ContractBar() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // fall back to a temporary input
      const tmp = document.createElement("input");
      tmp.value = CA;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="ca-bar">
      <div className="ca-bar-head">
        <span className="ca-bar-label">$UNISPHINCS on Ethereum</span>
        <span className="ca-bar-net">Ethereum mainnet</span>
      </div>
      <button
        className="ca-bar-addr"
        onClick={handleCopy}
        aria-label="Copy contract address"
        title="Click to copy"
      >
        <code>{CA}</code>
        <span className={`ca-bar-copy ${copied ? "ok" : ""}`}>
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
      <div className="ca-bar-actions">
        <a
          href={UNISWAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ca-bar-btn ca-bar-btn-primary"
        >
          Buy on Uniswap
        </a>
        <a
          href={DEXSCREENER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ca-bar-btn"
        >
          Chart
        </a>
        <a
          href={ETHERSCAN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ca-bar-btn"
        >
          Etherscan
        </a>
      </div>
    </div>
  );
}
