import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;700&display=swap');
`;

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_REPORT = {
  wallet: "7xKX...m9Qp",
  fullWallet: "7xKXf3aB2mNpQr8vLt4wYsZhCdEgFjKm9Qp",
  twitter: "@devghost_sol",
  riskScore: 87,
  riskLevel: "CRITICAL",
  lastSeen: "2 min ago",
  firstActivity: "Nov 14, 2023",
  totalTokensLaunched: 23,
  ruggedTokens: 19,
  linkedWallets: 7,
  totalVolumeDrained: "$2.4M",
  flags: [
    { severity: "critical", label: "Stealth dump detected", detail: "Sold 94% of holdings 3min before announcement" },
    { severity: "critical", label: "Liquidity removal", detail: "Pulled LP within 48hrs on 17/23 tokens" },
    { severity: "high", label: "Multi-wallet coordination", detail: "7 wallets funded from same CEX withdrawal" },
    { severity: "high", label: "Identity masking", detail: "Username changed 4x in last 30 days" },
    { severity: "medium", label: "Sniper coordination", detail: "Wallets consistently buy <3s after launch" },
    { severity: "medium", label: "Wash trading", detail: "Circular transactions detected between cluster" },
  ],
  tokenHistory: [
    { name: "MOONPIG", symbol: "MOONPIG", date: "Apr 28, 2025", raised: "$340K", status: "RUGGED", daysLive: 2 },
    { name: "SolAI Agent", symbol: "SOLAI", date: "Apr 15, 2025", raised: "$890K", status: "RUGGED", daysLive: 5 },
    { name: "DegenBoss", symbol: "DBOSS", date: "Mar 22, 2025", raised: "$120K", status: "RUGGED", daysLive: 1 },
    { name: "PumpKing", symbol: "PKING", date: "Feb 08, 2025", raised: "$560K", status: "RUGGED", daysLive: 3 },
    { name: "NovaDEX", symbol: "NOVA", date: "Jan 12, 2025", raised: "$210K", status: "ACTIVE", daysLive: 109 },
  ],
  walletCluster: [
    { address: "7xKX...m9Qp", role: "PRIMARY", funded: "Binance CEX", balance: "12.4 SOL" },
    { address: "3mNp...k7Wq", role: "SNIPER", funded: "Primary wallet", balance: "0.8 SOL" },
    { address: "9rTz...v2Xs", role: "SNIPER", funded: "Primary wallet", balance: "1.2 SOL" },
    { address: "4hLm...n5Yt", role: "DUMP", funded: "Primary wallet", balance: "0.1 SOL" },
    { address: "8wQs...p3Rz", role: "DUMP", funded: "Primary wallet", balance: "0.3 SOL" },
    { address: "2kBv...f8Mn", role: "MIXER", funded: "Unknown", balance: "45.2 SOL" },
    { address: "6jCx...h1Pk", role: "MIXER", funded: "Unknown", balance: "31.7 SOL" },
  ],
  socialHistory: [
    { date: "Apr 29, 2025", type: "USERNAME", from: "@soldev_official", to: "@devghost_sol" },
    { date: "Apr 12, 2025", type: "BIO", from: "Building the future of DeFi 🚀", to: "Solana builder | stealth mode" },
    { date: "Mar 30, 2025", type: "USERNAME", from: "@pumpalpha_dev", to: "@soldev_official" },
    { date: "Mar 01, 2025", type: "USERNAME", from: "@cryptoking_sol", to: "@pumpalpha_dev" },
  ],
};

const FEATURES = [
  { icon: "◈", title: "Wallet Intelligence", desc: "Deep on-chain analysis. Transaction tracing, funding sources, token distribution — every move exposed." },
  { icon: "⚠", title: "Rugpull Detection", desc: "Identifies stealth dumps, LP removals, sniper coordination and hidden multi-wallet schemes before you lose." },
  { icon: "◉", title: "Social Identity Link", desc: "Connects wallets to Twitter/X identities using OSINT, metadata correlation, and behavioral matching." },
  { icon: "⟳", title: "Identity Monitoring", desc: "Tracks every username, bio, and display name change in real-time. Reputation masking caught instantly." },
  { icon: "◌", title: "Multi-Wallet Fingerprint", desc: "Reveals wallet clusters controlled by the same entity through timing, funding paths, and behavior patterns." },
  { icon: "▲", title: "Risk Scoring", desc: "Dynamic Risk Scores built from combined on-chain and social signals. Auto-updated as new data appears." },
  { icon: "◆", title: "Real-Time Alerts", desc: "Instant push to Telegram and Discord when suspicious activity or critical risk events are detected." },
  { icon: "⬡", title: "24/7 Autonomous Scan", desc: "Runs continuously — scanning, correlating, alerting — across on-chain and social layers without interruption." },
];

const RECENT_ALERTS = [
  { time: "2m ago", wallet: "7xKX...m9Qp", event: "Stealth dump detected — sold 94% pre-announcement", score: 87, level: "CRITICAL" },
  { time: "14m ago", wallet: "3pRt...n4Qz", event: "LP removed — $430K drained from MOONAI pool", score: 91, level: "CRITICAL" },
  { time: "1h ago", wallet: "9mLk...x2Vs", event: "Username changed 3x in 24hrs — identity masking", score: 72, level: "HIGH" },
  { time: "3h ago", wallet: "4nBw...k8Ym", event: "New token launch: SOLBOSS — 6 linked wallets sniping", score: 65, level: "HIGH" },
  { time: "5h ago", wallet: "2zQp...f7Tr", event: "Wallet cluster identified — 9 wallets, same CEX origin", score: 58, level: "MEDIUM" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function RiskGauge({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ * 0.75;
  const color = score >= 80 ? "#ff2020" : score >= 60 ? "#ff8c00" : score >= 40 ? "#ffd700" : "#22c55e";

  return (
    <div style={{ position: "relative", width: 160, height: 120 }}>
      <svg width="160" height="120" style={{ transform: "rotate(135deg)" }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="#222" strokeWidth="10" strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#666", letterSpacing: 2 }}>RISK SCORE</div>
      </div>
    </div>
  );
}

function Ticker() {
  const items = ["MOONPIG rugged $340K", "7xKX...m9Qp flagged CRITICAL", "SOLAI LP removed $890K", "Identity mask detected @devghost_sol", "New cluster: 7 wallets same origin"];
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOffset(p => p - 1), 30);
    return () => clearInterval(id);
  }, []);

  const full = items.join("   ◆   ");

  return (
    <div style={{ background: "#ff2020", padding: "6px 0", overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", whiteSpace: "nowrap", transform: `translateX(${offset % 800}px)`, transition: "none" }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#000", fontWeight: 700, letterSpacing: 1, paddingRight: 80 }}>
            {full}
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav({ page, setPage }) {
  return (
    <nav style={{ background: "#000", borderBottom: "1px solid #1a1a1a", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#fff", letterSpacing: 2, transform: "rotate(-2deg)", display: "inline-block" }}>WHO</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#fff", letterSpacing: 2, transform: "rotate(-2deg)", display: "inline-block", marginTop: 4 }}>DEV</span>
      </button>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Features", "Alerts"].map(l => (
          <button key={l} onClick={() => setPage("home")} style={{ background: "none", border: "none", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#666", cursor: "pointer", letterSpacing: 1 }}>{l.toUpperCase()}</button>
        ))}
        <button onClick={() => setPage("search")} style={{ background: "#ff2020", border: "none", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#fff", cursor: "pointer", padding: "8px 20px", letterSpacing: 1, fontWeight: 700 }}>
          SCAN →
        </button>
      </div>
    </nav>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function Landing({ setPage }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [counted, setCounted] = useState(false);
  const [stats, setStats] = useState({ wallets: 0, rugs: 0, volume: 0 });

  useEffect(() => {
    if (counted) return;
    setCounted(true);
    let frame = 0;
    const target = { wallets: 48291, rugs: 1847, volume: 142 };
    const dur = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setStats({
        wallets: Math.floor(ease * target.wallets),
        rugs: Math.floor(ease * target.rugs),
        volume: Math.floor(ease * target.volume),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* HERO */}
      <div style={{ padding: "100px 32px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, background: "#ff2020", borderRadius: "50%", marginTop: 6, boxShadow: "0 0 12px #ff2020", animation: "pulse 1s infinite" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ff2020", letterSpacing: 3 }}>LIVE MONITORING ACTIVE</span>
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(72px, 12vw, 160px)", color: "#fff", lineHeight: 0.9, margin: "0 0 24px", letterSpacing: -2 }}>
          WHO IS<br />
          <span style={{ color: "#ff2020", WebkitTextStroke: "2px #ff2020", WebkitTextFillColor: "transparent" }}>THIS</span><br />
          DEV?
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "end" }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#888", lineHeight: 1.6, margin: "0 0 32px" }}>
              Solana's most advanced on-chain intelligence platform. Expose rugs before they happen. Unmask anonymous developers. Protect your capital.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setPage("search")} style={{ background: "#ff2020", border: "none", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", cursor: "pointer", padding: "14px 32px", letterSpacing: 2 }}>
                SCAN A WALLET
              </button>
              <button onClick={() => setPage("search")} style={{ background: "none", border: "1px solid #333", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#666", cursor: "pointer", padding: "14px 32px", letterSpacing: 2 }}>
                VIEW DEMO
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#111" }}>
            {[
              { val: stats.wallets.toLocaleString(), label: "WALLETS TRACKED" },
              { val: stats.rugs.toLocaleString(), label: "RUGS DETECTED" },
              { val: `$${stats.volume}M+`, label: "CAPITAL PROTECTED" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0a0a0a", padding: "20px 16px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#ff2020" }}>{s.val}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#444", letterSpacing: 1.5, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIVE ALERTS STRIP */}
      <div style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111", padding: "0 32px", maxWidth: 1100, margin: "0 auto 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 0 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ff2020", letterSpacing: 2, padding: "12px 0" }}>LIVE ALERTS</span>
          <div style={{ width: 1, height: 40, background: "#1a1a1a" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {RECENT_ALERTS.map((alert, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderTop: i > 0 ? "1px solid #0d0d0d" : "none" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#444", minWidth: 60 }}>{alert.time}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#fff", minWidth: 110 }}>{alert.wallet}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", flex: 1 }}>{alert.event}</span>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#000", padding: "3px 8px", letterSpacing: 1, fontWeight: 700,
                background: alert.level === "CRITICAL" ? "#ff2020" : alert.level === "HIGH" ? "#ff8c00" : "#ffd700"
              }}>{alert.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES GRID */}
      <div style={{ padding: "0 32px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ff2020", letterSpacing: 3, marginBottom: 16 }}>INTELLIGENCE SUITE</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#fff", margin: 0, letterSpacing: -1 }}>12 AGENT SKILLS</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#111" }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: hoveredFeature === i ? "#0d0d0d" : "#000",
                padding: "28px 24px",
                cursor: "default",
                transition: "background 0.2s",
                borderLeft: hoveredFeature === i ? "2px solid #ff2020" : "2px solid transparent",
              }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: hoveredFeature === i ? "#ff2020" : "#333", marginBottom: 12, transition: "color 0.2s" }}>{f.icon}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#fff", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>{f.title.toUpperCase()}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ borderTop: "1px solid #111", padding: "80px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ff2020", letterSpacing: 3, marginBottom: 16 }}>WORKFLOW</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#fff", margin: "0 0 60px", letterSpacing: -1 }}>HOW IT WORKS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
          {[
            { step: "01", title: "INPUT", desc: "Paste a wallet address or Twitter/X handle to begin analysis" },
            { step: "02", title: "SCAN", desc: "WHODEV queries on-chain data and social layers simultaneously" },
            { step: "03", title: "CORRELATE", desc: "AI engine links wallets, identities, and behavioral patterns" },
            { step: "04", title: "REPORT", desc: "Receive a full risk report with score, flags, and cluster map" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "0 32px 0 0", borderRight: i < 3 ? "1px solid #111" : "none" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, color: "#111", lineHeight: 1, marginBottom: 8 }}>{s.step}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#fff", letterSpacing: 1, marginBottom: 12, fontWeight: 700 }}>{s.title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#ff2020", padding: "80px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 96px)", color: "#000", margin: "0 0 16px", letterSpacing: -1 }}>KNOW WHO YOU'RE DEALING WITH</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#700", margin: "0 0 40px" }}>Scan any Solana wallet or developer in seconds.</p>
        <button onClick={() => setPage("search")} style={{ background: "#000", border: "none", fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff", cursor: "pointer", padding: "16px 48px", letterSpacing: 2 }}>
          START SCANNING →
        </button>
      </div>

      <div style={{ background: "#000", borderTop: "1px solid #111", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#333", letterSpacing: 2 }}>WHODEV.XY</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#333" }}>© 2025 WHODEV — Solana Intelligence Platform</span>
      </div>
    </div>
  );
}

function SearchPage({ setPage, setReport }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");

  const steps = [
    "Connecting to Solana RPC...",
    "Fetching transaction history...",
    "Scanning token launch activity...",
    "Correlating social identities...",
    "Running multi-wallet fingerprint...",
    "Computing risk score...",
    "Building report...",
  ];

  const scan = () => {
    if (!query.trim()) return;
    setLoading(true);
    let i = 0;
    const tick = () => {
      setStep(steps[i]);
      i++;
      if (i < steps.length) setTimeout(tick, 400);
      else setTimeout(() => { setReport(MOCK_REPORT); setPage("report"); }, 500);
    };
    tick();
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ff2020", letterSpacing: 3, marginBottom: 24, textAlign: "center" }}>DEVELOPER INTELLIGENCE</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, color: "#fff", textAlign: "center", margin: "0 0 48px", letterSpacing: -1 }}>
          WHO IS<br /><span style={{ color: "#ff2020" }}>THIS DEV?</span>
        </h1>

        {!loading ? (
          <>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && scan()}
                placeholder="Wallet address or @twitter handle..."
                style={{
                  width: "100%",
                  background: "#0a0a0a",
                  border: "1px solid #222",
                  padding: "18px 24px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14,
                  color: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                  letterSpacing: 0.5,
                }}
              />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", paddingRight: 4 }}>
                <button onClick={scan} style={{
                  background: "#ff2020", border: "none", fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 18, color: "#fff", cursor: "pointer", padding: "12px 28px", letterSpacing: 2, height: "calc(100% - 8px)"
                }}>SCAN</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["7xKXf3aB2mNpQr8vLt4w...", "@devghost_sol", "3pRtN4QzBmVk..."].map(ex => (
                <button key={ex} onClick={() => setQuery(ex)} style={{
                  background: "none", border: "1px solid #1a1a1a", fontFamily: "'Space Mono', monospace",
                  fontSize: 11, color: "#444", cursor: "pointer", padding: "6px 12px", letterSpacing: 0.5
                }}>↗ {ex}</button>
              ))}
            </div>
            <div style={{ marginTop: 48, borderTop: "1px solid #0d0d0d", paddingTop: 32 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#333", letterSpacing: 2, marginBottom: 16 }}>RECENT SCANS</div>
              {RECENT_ALERTS.slice(0, 3).map((a, i) => (
                <div key={i} onClick={() => { setReport(MOCK_REPORT); setPage("report"); }}
                  style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid #0a0a0a", cursor: "pointer", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#fff", minWidth: 120 }}>{a.wallet}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555", flex: 1 }}>{a.event}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#ff2020" }}>{a.score}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#ff2020", marginBottom: 32 }}>SCANNING...</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              {steps.map((s, i) => (
                <div key={i} style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1,
                  color: steps.indexOf(step) > i ? "#ff2020" : steps.indexOf(step) === i ? "#fff" : "#222",
                  transition: "color 0.3s",
                }}>
                  {steps.indexOf(step) > i ? "✓" : steps.indexOf(step) === i ? "›" : "○"} {s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportPage({ report, setPage }) {
  const [activeTab, setActiveTab] = useState("overview");

  const severityColor = s => s === "critical" ? "#ff2020" : s === "high" ? "#ff8c00" : "#ffd700";
  const statusColor = s => s === "RUGGED" ? "#ff2020" : "#22c55e";
  const roleColor = r => ({ PRIMARY: "#fff", SNIPER: "#ff8c00", DUMP: "#ff2020", MIXER: "#888" }[r] || "#fff");

  const tabs = ["overview", "tokens", "cluster", "social"];

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Report Header */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #111", padding: "32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ff2020", letterSpacing: 3, marginBottom: 12 }}>INTELLIGENCE REPORT</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#fff", letterSpacing: -1 }}>{report.twitter}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", marginTop: 4, letterSpacing: 0.5 }}>{report.fullWallet}</div>
              <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
                {[
                  { label: "FIRST SEEN", val: report.firstActivity },
                  { label: "LAST ACTIVE", val: report.lastSeen },
                  { label: "TOKENS", val: report.totalTokensLaunched },
                  { label: "RUGGED", val: report.ruggedTokens },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#444", letterSpacing: 1.5 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#fff", marginTop: 2 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <RiskGauge score={report.riskScore} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#ff2020", letterSpacing: 2 }}>
                {report.riskLevel}
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#111", marginTop: 32 }}>
            {[
              { val: report.linkedWallets, label: "LINKED WALLETS", color: "#ff8c00" },
              { val: report.ruggedTokens + "/" + report.totalTokensLaunched, label: "RUG RATE", color: "#ff2020" },
              { val: report.totalVolumeDrained, label: "VOLUME DRAINED", color: "#ff2020" },
              { val: report.flags.length, label: "ACTIVE FLAGS", color: "#ffd700" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0a0a0a", padding: "20px 24px" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#444", letterSpacing: 1.5, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #111", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: "none", border: "none", fontFamily: "'Space Mono', monospace",
              fontSize: 11, color: activeTab === t ? "#fff" : "#444", cursor: "pointer",
              padding: "16px 24px", letterSpacing: 1.5,
              borderBottom: activeTab === t ? "2px solid #ff2020" : "2px solid transparent",
            }}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>

        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Red Flags */}
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ff2020", letterSpacing: 2, marginBottom: 16 }}>RED FLAGS DETECTED</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#0d0d0d" }}>
                {report.flags.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 20px", background: "#000", borderLeft: `3px solid ${severityColor(f.severity)}` }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: severityColor(f.severity), padding: "3px 8px", background: `${severityColor(f.severity)}15`, minWidth: 68, textAlign: "center" }}>
                      {f.severity.toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#fff", fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555" }}>{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "tokens" && (
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ff2020", letterSpacing: 2, marginBottom: 16 }}>TOKEN LAUNCH HISTORY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, padding: "10px 16px" }}>
                {["TOKEN", "DATE", "RAISED", "DAYS LIVE", "STATUS"].map(h => (
                  <div key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#444", letterSpacing: 1.5 }}>{h}</div>
                ))}
              </div>
              {report.tokenHistory.map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, padding: "16px", background: "#0a0a0a", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#fff" }}>{t.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#444" }}>${t.symbol}</div>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#666" }}>{t.date}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#fff" }}>{t.raised}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#666" }}>{t.daysLive}d</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: statusColor(t.status), background: `${statusColor(t.status)}15`, padding: "4px 10px", textAlign: "center" }}>
                    {t.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cluster" && (
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ff2020", letterSpacing: 2, marginBottom: 16 }}>WALLET CLUSTER — {report.walletCluster.length} WALLETS IDENTIFIED</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {report.walletCluster.map((w, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr", gap: 16, padding: "16px", background: "#0a0a0a", alignItems: "center", borderLeft: w.role === "PRIMARY" ? "3px solid #fff" : `3px solid ${roleColor(w.role)}` }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#fff" }}>{w.address}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: roleColor(w.role), background: `${roleColor(w.role)}15`, padding: "4px 10px", textAlign: "center" }}>
                    {w.role}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555" }}>Funded via: {w.funded}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#fff", textAlign: "right" }}>{w.balance}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ff2020", letterSpacing: 2, marginBottom: 16 }}>IDENTITY CHANGE HISTORY</div>
            <div style={{ position: "relative", paddingLeft: 24 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "#1a1a1a" }} />
              {report.socialHistory.map((s, i) => (
                <div key={i} style={{ position: "relative", paddingLeft: 24, paddingBottom: 32 }}>
                  <div style={{ position: "absolute", left: -4, top: 4, width: 8, height: 8, background: "#ff2020", borderRadius: "50%" }} />
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#444", marginBottom: 8 }}>{s.date}</div>
                  <div style={{ background: "#0a0a0a", padding: "16px 20px" }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ff2020", letterSpacing: 1.5, marginBottom: 10 }}>{s.type} CHANGED</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#555", textDecoration: "line-through" }}>{s.from}</span>
                      <span style={{ color: "#ff2020" }}>→</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#fff" }}>{s.to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #111", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
        <button onClick={() => setPage("search")} style={{ background: "none", border: "1px solid #222", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#666", cursor: "pointer", padding: "10px 20px", letterSpacing: 1 }}>
          ← NEW SCAN
        </button>
        <button style={{ background: "#ff2020", border: "none", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#fff", cursor: "pointer", padding: "10px 20px", letterSpacing: 1, fontWeight: 700 }}>
          EXPORT REPORT
        </button>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #000; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      input::placeholder { color: #333; }
      ::-webkit-scrollbar { width: 4px; } 
      ::-webkit-scrollbar-track { background: #000; }
      ::-webkit-scrollbar-thumb { background: #222; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      <Ticker />
      <Nav page={page} setPage={setPage} />
      {page === "home" && <Landing setPage={setPage} />}
      {page === "search" && <SearchPage setPage={setPage} setReport={setReport} />}
      {page === "report" && report && <ReportPage report={report} setPage={setPage} />}
    </div>
  );
}
