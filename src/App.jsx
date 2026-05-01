import { useState, useEffect } from "react";

// ─── FONTS & GLOBAL STYLES ───────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #000; color: #fff; -webkit-font-smoothing: antialiased; }
input::placeholder { color: #3a3a3a; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 2px; }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.fade-in { animation: fadeIn 0.35s ease forwards; }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_WALLET_REPORT = {
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
    { severity: "critical", label: "Stealth dump detected", detail: "Sold 94% of holdings 3 min before public announcement" },
    { severity: "critical", label: "Liquidity removal", detail: "Pulled LP within 48hrs on 17 of 23 tokens launched" },
    { severity: "high",     label: "Multi-wallet coordination", detail: "7 wallets funded from the same CEX withdrawal batch" },
    { severity: "high",     label: "Identity masking", detail: "Username changed 4× in last 30 days to evade reputation" },
    { severity: "medium",   label: "Sniper coordination", detail: "Linked wallets consistently buy <3s after every launch" },
    { severity: "medium",   label: "Wash trading", detail: "Circular transactions detected between wallet cluster" },
  ],
  tokenHistory: [
    { name: "MOONPIG",    symbol: "MOONPIG", date: "Apr 28, 2025", raised: "$340K",  status: "RUGGED", daysLive: 2   },
    { name: "SolAI Agent",symbol: "SOLAI",   date: "Apr 15, 2025", raised: "$890K",  status: "RUGGED", daysLive: 5   },
    { name: "DegenBoss",  symbol: "DBOSS",   date: "Mar 22, 2025", raised: "$120K",  status: "RUGGED", daysLive: 1   },
    { name: "PumpKing",   symbol: "PKING",   date: "Feb 08, 2025", raised: "$560K",  status: "RUGGED", daysLive: 3   },
    { name: "NovaDEX",    symbol: "NOVA",    date: "Jan 12, 2025", raised: "$210K",  status: "ACTIVE", daysLive: 109 },
  ],
  walletCluster: [
    { address: "7xKX...m9Qp", role: "PRIMARY", funded: "Binance CEX",     balance: "12.4 SOL" },
    { address: "3mNp...k7Wq", role: "SNIPER",  funded: "Primary wallet",  balance: "0.8 SOL"  },
    { address: "9rTz...v2Xs", role: "SNIPER",  funded: "Primary wallet",  balance: "1.2 SOL"  },
    { address: "4hLm...n5Yt", role: "DUMP",    funded: "Primary wallet",  balance: "0.1 SOL"  },
    { address: "8wQs...p3Rz", role: "DUMP",    funded: "Primary wallet",  balance: "0.3 SOL"  },
    { address: "2kBv...f8Mn", role: "MIXER",   funded: "Unknown",         balance: "45.2 SOL" },
    { address: "6jCx...h1Pk", role: "MIXER",   funded: "Unknown",         balance: "31.7 SOL" },
  ],
  socialHistory: [
    { date: "Apr 29, 2025", type: "USERNAME", from: "@soldev_official", to: "@devghost_sol" },
    { date: "Apr 12, 2025", type: "BIO",      from: "Building the future of DeFi 🚀", to: "Solana builder | stealth mode" },
    { date: "Mar 30, 2025", type: "USERNAME", from: "@pumpalpha_dev",   to: "@soldev_official" },
    { date: "Mar 01, 2025", type: "USERNAME", from: "@cryptoking_sol",  to: "@pumpalpha_dev" },
  ],
};

const MOCK_TWITTER_REPORT = {
  handle: "@devghost_sol",
  displayName: "DevGhost",
  bio: "Solana builder | stealth mode",
  joined: "Sep 2021",
  followers: "12.4K",
  following: "389",
  tweets: "2,841",
  riskScore: 79,
  riskLevel: "HIGH",
  totalChanges: 9,
  usernameChanges: 4,
  bioChanges: 3,
  displayNameChanges: 2,
  avgDaysBetweenChanges: 11,
  linkedWallets: ["7xKX...m9Qp", "3mNp...k7Wq"],
  timeline: [
    {
      date: "Apr 29, 2025", daysAgo: 2,
      changes: [{ type: "USERNAME", from: "@soldev_official", to: "@devghost_sol", risk: "high" }],
      context: "Changed 3 days before MOONPIG launch — reputation reset pattern",
    },
    {
      date: "Apr 12, 2025", daysAgo: 19,
      changes: [{ type: "BIO", from: "Building the future of DeFi 🚀", to: "Solana builder | stealth mode", risk: "medium" }],
      context: "Bio scrubbed after SOLAI rug — removed project references",
    },
    {
      date: "Mar 30, 2025", daysAgo: 32,
      changes: [{ type: "USERNAME", from: "@pumpalpha_dev", to: "@soldev_official", risk: "high" }],
      context: "New alias adopted after DegenBoss controversy",
    },
    {
      date: "Mar 01, 2025", daysAgo: 59,
      changes: [
        { type: "USERNAME",    from: "@cryptoking_sol", to: "@pumpalpha_dev", risk: "high"   },
        { type: "DISPLAYNAME", from: "CryptoKing SOL",  to: "Pump Alpha Dev", risk: "medium" },
      ],
      context: "Identity overhaul — original @cryptoking_sol had 3 rug complaints",
    },
    {
      date: "Jan 20, 2025", daysAgo: 100,
      changes: [{ type: "BIO", from: "NFT Artist | Solana OG | DMs open", to: "Building the future of DeFi 🚀", risk: "low" }],
      context: "Shifted narrative from NFTs to DeFi ecosystem",
    },
  ],
  flags: [
    { severity: "high",   label: "Rapid username cycling",     detail: "4 username changes in 90 days — exceeds 99th percentile" },
    { severity: "high",   label: "Pre-launch identity reset",  detail: "Username changed within 7 days before 3 separate token launches" },
    { severity: "medium", label: "Bio reputation scrubbing",   detail: "Bio updated to remove project links after each rug event" },
    { severity: "low",    label: "Narrative pivot detected",   detail: "Identity shifted from NFT to DeFi to 'stealth builder'" },
  ],
};

const RECENT_ALERTS = [
  { time: "2m ago",  wallet: "7xKX...m9Qp", event: "Stealth dump — sold 94% pre-announcement", score: 87, level: "CRITICAL" },
  { time: "14m ago", wallet: "3pRt...n4Qz", event: "LP removed — $430K drained from MOONAI",    score: 91, level: "CRITICAL" },
  { time: "1h ago",  wallet: "9mLk...x2Vs", event: "Username changed 3× in 24hrs",              score: 72, level: "HIGH"     },
  { time: "3h ago",  wallet: "4nBw...k8Ym", event: "SOLBOSS launch — 6 linked wallets sniping", score: 65, level: "HIGH"     },
  { time: "5h ago",  wallet: "2zQp...f7Tr", event: "Cluster identified — 9 wallets, same CEX",  score: 58, level: "MEDIUM"   },
];

const FEATURES = [
  { icon: "◈", title: "Wallet Intelligence",   desc: "Deep on-chain analysis — transaction tracing, funding sources, and distribution patterns." },
  { icon: "⚠", title: "Rugpull Detection",     desc: "Identifies stealth dumps, LP removals, sniper coordination before you lose." },
  { icon: "◉", title: "Social Identity Link",  desc: "Connects wallets to Twitter/X identities via OSINT and behavioral matching." },
  { icon: "⟳", title: "Username Tracker",      desc: "Full history of every username, bio, and display name change with risk scoring." },
  { icon: "◌", title: "Wallet Fingerprint",    desc: "Reveals clusters controlled by the same entity via timing and funding paths." },
  { icon: "▲", title: "Risk Scoring",          desc: "Dynamic scores built from combined on-chain and social signals, auto-updated." },
  { icon: "◆", title: "Real-Time Alerts",      desc: "Instant push to Telegram and Discord when suspicious activity is detected." },
  { icon: "⬡", title: "24/7 Autonomous Scan",  desc: "Runs continuously — scanning, correlating, alerting across all layers." },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const C = {
  red:    "#e63030",
  orange: "#f97316",
  yellow: "#eab308",
  green:  "#22c55e",
  bg:     "#000",
  bg1:    "#080808",
  bg2:    "#0f0f0f",
  bg3:    "#161616",
  border: "#1c1c1c",
  muted:  "#444",
  dim:    "#666",
  sub:    "#888",
};

const riskColor = (score) =>
  score >= 80 ? C.red : score >= 60 ? C.orange : score >= 40 ? C.yellow : C.green;

const severityColor = (s) =>
  s === "critical" ? C.red : s === "high" ? C.orange : s === "medium" ? C.yellow : C.green;

const changeColor = (t) =>
  t === "high" ? C.red : t === "medium" ? C.orange : C.muted;

const statusColor = (s) => (s === "RUGGED" ? C.red : C.green);

const roleColor = (r) =>
  ({ PRIMARY: "#fff", SNIPER: C.orange, DUMP: C.red, MIXER: C.sub }[r] || "#fff");

const mono = "'Space Mono', monospace";
const sans = "'DM Sans', sans-serif";
const display = "'Bebas Neue', sans-serif";

// ─── SHARED UI COMPONENTS ────────────────────────────────────────────────────

function Badge({ label, color = C.red, small }) {
  return (
    <span style={{
      fontFamily: mono, fontSize: small ? 9 : 10, color, letterSpacing: 1.5, fontWeight: 700,
      background: color + "1a", padding: small ? "2px 7px" : "3px 10px", border: `1px solid ${color}33`,
    }}>
      {label}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "20px 24px", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: mono, fontSize: 10, color: C.red, letterSpacing: 3, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function RiskGauge({ score, size = 140 }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ * 0.75;
  const color = riskColor(score);
  const cx = size / 2;
  const cy = size * 0.6;
  return (
    <div style={{ position: "relative", width: size, height: size * 0.75 }}>
      <svg width={size} height={size * 0.75} style={{ transform: "rotate(135deg)", display: "block" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg3}      strokeWidth="8" strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}      strokeWidth="8" strokeDasharray={`${filled} ${circ}`}      strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color}88)` }} />
      </svg>
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: size * 0.28, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: mono, fontSize: 8, color: C.muted, letterSpacing: 2, marginTop: 2 }}>RISK</div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ width: 20, height: 20, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.red}`,
      borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
  );
}

// ─── TICKER ──────────────────────────────────────────────────────────────────
function Ticker() {
  const items = [
    "MOONPIG rugged $340K", "7xKX...m9Qp flagged CRITICAL", "SOLAI LP removed $890K",
    "@devghost_sol — 4 username changes", "New cluster: 7 wallets same origin", "DBOSS rug confirmed",
  ];
  const text = items.join("   ◆   ");
  return (
    <div style={{ background: C.red, overflow: "hidden", height: 28, display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 40s linear infinite" }}>
        {[text, text].map((t, i) => (
          <span key={i} style={{ fontFamily: mono, fontSize: 10, color: "#000", fontWeight: 700, letterSpacing: 1.5, paddingRight: 80 }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const navItems = [
    { label: "HOME",    key: "home"    },
    { label: "TWITTER SCANNER", key: "twitter" },
    { label: "ABOUT",   key: "about"   },
  ];
  return (
    <nav style={{
      background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`, padding: "0 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 56, position: "sticky", top: 0, zIndex: 100,
    }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: display, fontSize: 24, color: "#fff", letterSpacing: 2 }}>WHO</span>
        <span style={{ fontFamily: display, fontSize: 24, color: C.red,  letterSpacing: 2, marginTop: 3 }}>DEV</span>
      </button>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setPage(item.key)} style={{
            background: page === item.key ? C.bg3 : "none",
            border: page === item.key ? `1px solid ${C.border}` : "1px solid transparent",
            fontFamily: mono, fontSize: 10, color: page === item.key ? "#fff" : C.dim,
            cursor: "pointer", padding: "6px 14px", letterSpacing: 1.5, transition: "all 0.15s",
          }}>{item.label}</button>
        ))}
        <button onClick={() => setPage("search")} style={{
          background: C.red, border: "none", fontFamily: mono, fontSize: 10,
          color: "#fff", cursor: "pointer", padding: "8px 20px", letterSpacing: 1.5, fontWeight: 700,
          marginLeft: 8, transition: "opacity 0.15s",
        }}>
          SCAN WALLET →
        </button>
      </div>
    </nav>
  );
}

// ─── ONBOARDING MODAL ────────────────────────────────────────────────────────
function OnboardingModal({ onClose }) {
  const steps = [
    { icon: "◈", title: "Paste a wallet or handle", desc: "Input any Solana wallet address or Twitter/X username to begin deep intelligence scan." },
    { icon: "⟳", title: "We trace the full identity", desc: "WHODEV cross-references on-chain transactions, token launches, and social identity history in real-time." },
    { icon: "▲", title: "Get a risk report", desc: "Receive a structured report with a risk score, flagged behaviours, and linked wallet clusters." },
    { icon: "◉", title: "Twitter Scanner", desc: "New: Track every username, bio, and display name change to spot reputation-masking before it's too late." },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div className="fade-in" style={{
        background: C.bg1, border: `1px solid ${C.border}`, maxWidth: 560, width: "100%", padding: "40px",
      }}>
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>WELCOME TO WHODEV</SectionLabel>
          <h2 style={{ fontFamily: display, fontSize: 48, color: "#fff", lineHeight: 1, marginBottom: 12, letterSpacing: -1 }}>
            SOLANA INTELLIGENCE<br /><span style={{ color: C.red }}>PLATFORM</span>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.sub, lineHeight: 1.7 }}>
            WHODEV is an on-chain and social intelligence tool built to unmask anonymous Solana developers, 
            detect rugpull patterns, and track identity changes — before you invest.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              background: C.bg2, padding: "16px 20px", borderLeft: `3px solid ${C.border}`,
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.red}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ fontFamily: display, fontSize: 24, color: C.red, minWidth: 24, marginTop: 2 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: mono, fontSize: 11, color: "#fff", letterSpacing: 1, marginBottom: 4, fontWeight: 700 }}>{s.title}</div>
                <div style={{ fontFamily: sans, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{
            flex: 1, background: C.red, border: "none", fontFamily: display, fontSize: 20,
            color: "#fff", cursor: "pointer", padding: "14px 24px", letterSpacing: 2,
          }}>START SCANNING</button>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${C.border}`, fontFamily: mono, fontSize: 10,
            color: C.dim, cursor: "pointer", padding: "14px 20px", letterSpacing: 1,
          }}>SKIP</button>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────────────────────
function Landing({ setPage }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [stats, setStats] = useState({ wallets: 0, rugs: 0, volume: 0 });

  useEffect(() => {
    const target = { wallets: 48291, rugs: 1847, volume: 142 };
    const dur = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setStats({
        wallets: Math.floor(ease * target.wallets),
        rugs:    Math.floor(ease * target.rugs),
        volume:  Math.floor(ease * target.volume),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div style={{ background: C.bg }}>

      {/* HERO */}
      <div style={{ padding: "80px 40px 60px", maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 7, height: 7, background: C.red, borderRadius: "50%", boxShadow: `0 0 10px ${C.red}`, animation: "pulse 1.2s infinite" }} />
          <span style={{ fontFamily: mono, fontSize: 10, color: C.red, letterSpacing: 3 }}>LIVE MONITORING ACTIVE</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 60, alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: display, fontSize: "clamp(72px, 10vw, 140px)", color: "#fff", lineHeight: 0.92, margin: "0 0 28px", letterSpacing: -2 }}>
              WHO IS<br />
              <span style={{ color: C.red, WebkitTextStroke: "2px " + C.red, WebkitTextFillColor: "transparent" }}>THIS</span><br />
              DEV?
            </h1>
            <p style={{ fontFamily: sans, fontSize: 17, color: C.sub, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>
              The most advanced on-chain intelligence platform for Solana. Expose rugs before they happen. 
              Unmask anonymous developers. Track identity changes in real-time.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setPage("search")} style={{
                background: C.red, border: "none", fontFamily: display, fontSize: 20,
                color: "#fff", cursor: "pointer", padding: "14px 32px", letterSpacing: 2,
              }}>SCAN A WALLET</button>
              <button onClick={() => setPage("twitter")} style={{
                background: "none", border: `1px solid ${C.border}`, fontFamily: display, fontSize: 20,
                color: C.dim, cursor: "pointer", padding: "14px 32px", letterSpacing: 2,
              }}>TWITTER SCANNER</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              { val: stats.wallets.toLocaleString(), label: "WALLETS TRACKED",   color: C.red    },
              { val: stats.rugs.toLocaleString(),    label: "RUGS DETECTED",     color: C.orange },
              { val: `$${stats.volume}M+`,           label: "CAPITAL PROTECTED", color: C.green  },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 2 }}>{s.label}</div>
                <div style={{ fontFamily: display, fontSize: 34, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIVE ALERTS */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 9, color: C.red, letterSpacing: 3, padding: "14px 16px 14px 0", borderRight: `1px solid ${C.border}`, whiteSpace: "nowrap", marginRight: 20 }}>
              LIVE ALERTS
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {RECENT_ALERTS.map((alert, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "56px 120px 1fr 80px",
                  alignItems: "center", gap: 16, padding: "10px 0",
                  borderTop: i > 0 ? `1px solid ${C.bg2}` : "none",
                }}>
                  <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>{alert.time}</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: "#fff" }}>{alert.wallet}</span>
                  <span style={{ fontFamily: sans, fontSize: 13, color: C.sub }}>{alert.event}</span>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Badge label={alert.level}
                      color={alert.level === "CRITICAL" ? C.red : alert.level === "HIGH" ? C.orange : C.yellow}
                      small />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div style={{ padding: "80px 40px", maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <SectionLabel>INTELLIGENCE SUITE</SectionLabel>
            <h2 style={{ fontFamily: display, fontSize: 56, color: "#fff", letterSpacing: -1, lineHeight: 1 }}>8 AGENT SKILLS</h2>
          </div>
          <button onClick={() => setPage("about")} style={{
            background: "none", border: `1px solid ${C.border}`, fontFamily: mono, fontSize: 10,
            color: C.dim, cursor: "pointer", padding: "10px 18px", letterSpacing: 1, marginBottom: 4,
          }}>VIEW PROJECT DOCS →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: hoveredFeature === i ? C.bg2 : C.bg1,
                padding: "24px 20px", cursor: "default", transition: "background 0.2s",
                borderLeft: hoveredFeature === i ? `2px solid ${C.red}` : "2px solid transparent",
              }}>
              <div style={{ fontFamily: display, fontSize: 26, color: hoveredFeature === i ? C.red : C.bg3, marginBottom: 14, transition: "color 0.2s" }}>{f.icon}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: "#fff", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>{f.title.toUpperCase()}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "80px 40px", background: C.bg1 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionLabel>WORKFLOW</SectionLabel>
          <h2 style={{ fontFamily: display, fontSize: 56, color: "#fff", margin: "0 0 48px", letterSpacing: -1 }}>HOW IT WORKS</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border }}>
            {[
              { step: "01", title: "INPUT",     desc: "Paste a wallet address or Twitter/X handle to begin analysis." },
              { step: "02", title: "SCAN",      desc: "WHODEV queries on-chain data and social layers simultaneously." },
              { step: "03", title: "CORRELATE", desc: "AI engine links wallets, identities, and behavioral patterns." },
              { step: "04", title: "REPORT",    desc: "Get a full risk report — score, flags, cluster map, and social trail." },
            ].map((s, i) => (
              <div key={i} style={{ background: C.bg, padding: "32px 28px" }}>
                <div style={{ fontFamily: display, fontSize: 64, color: C.bg3, lineHeight: 1, marginBottom: 12 }}>{s.step}</div>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#fff", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>{s.title}</div>
                <div style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: C.red, padding: "80px 40px", textAlign: "center" }}>
        <SectionLabel>GET STARTED NOW</SectionLabel>
        <h2 style={{ fontFamily: display, fontSize: "clamp(44px, 7vw, 88px)", color: "#000", margin: "0 0 16px", letterSpacing: -1, lineHeight: 1 }}>
          KNOW WHO YOU'RE<br />DEALING WITH
        </h2>
        <p style={{ fontFamily: sans, fontSize: 15, color: "#6b0000", margin: "0 0 36px" }}>
          Scan any Solana wallet or developer in seconds. No login required.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => setPage("search")} style={{
            background: "#000", border: "none", fontFamily: display, fontSize: 22,
            color: "#fff", cursor: "pointer", padding: "14px 44px", letterSpacing: 2,
          }}>SCAN WALLET →</button>
          <button onClick={() => setPage("twitter")} style={{
            background: "none", border: "2px solid #000", fontFamily: display, fontSize: 22,
            color: "#000", cursor: "pointer", padding: "14px 44px", letterSpacing: 2,
          }}>TWITTER SCANNER →</button>
        </div>
      </div>

      <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: display, fontSize: 16, color: C.bg3, letterSpacing: 2 }}>WHODEV.XY</span>
        <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>© 2025 WHODEV — Solana Intelligence Platform</span>
      </footer>
    </div>
  );
}

// ─── WALLET SEARCH PAGE ───────────────────────────────────────────────────────
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
      if (i < steps.length) setTimeout(tick, 420);
      else setTimeout(() => { setReport(MOCK_WALLET_REPORT); setPage("report"); }, 500);
    };
    tick();
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 600 }} className="fade-in">
        <SectionLabel style={{ textAlign: "center" }}>WALLET INTELLIGENCE</SectionLabel>
        <h1 style={{ fontFamily: display, fontSize: 72, color: "#fff", textAlign: "center", margin: "0 0 40px", letterSpacing: -1, lineHeight: 1 }}>
          WHO IS<br /><span style={{ color: C.red }}>THIS DEV?</span>
        </h1>

        {!loading ? (
          <>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && scan()}
                placeholder="Wallet address or @twitter handle..."
                style={{
                  width: "100%", background: C.bg1, border: `1px solid ${C.border}`,
                  padding: "16px 110px 16px 20px", fontFamily: mono, fontSize: 13,
                  color: "#fff", outline: "none", letterSpacing: 0.5,
                }}
              />
              <button onClick={scan} style={{
                position: "absolute", right: 4, top: 4, bottom: 4,
                background: C.red, border: "none", fontFamily: display, fontSize: 17,
                color: "#fff", cursor: "pointer", padding: "0 22px", letterSpacing: 2,
              }}>SCAN</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
              {["7xKXf3aB2mNpQr8vLt4w...", "@devghost_sol", "3pRtN4QzBmVk..."].map(ex => (
                <button key={ex} onClick={() => setQuery(ex)} style={{
                  background: "none", border: `1px solid ${C.border}`, fontFamily: mono,
                  fontSize: 10, color: C.muted, cursor: "pointer", padding: "5px 12px", letterSpacing: 0.5,
                }}>↗ {ex}</button>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28 }}>
              <SectionLabel>RECENT SCANS</SectionLabel>
              {RECENT_ALERTS.slice(0, 3).map((a, i) => (
                <div key={i} onClick={() => { setReport(MOCK_WALLET_REPORT); setPage("report"); }}
                  style={{
                    display: "grid", gridTemplateColumns: "130px 1fr 40px",
                    gap: 16, padding: "12px 0", borderBottom: `1px solid ${C.bg2}`,
                    cursor: "pointer", alignItems: "center", transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <span style={{ fontFamily: mono, fontSize: 11, color: "#fff" }}>{a.wallet}</span>
                  <span style={{ fontFamily: sans, fontSize: 13, color: C.sub }}>{a.event}</span>
                  <span style={{ fontFamily: display, fontSize: 22, color: C.red, textAlign: "right" }}>{a.score}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
              <Spinner />
              <span style={{ fontFamily: display, fontSize: 36, color: C.red, letterSpacing: 2 }}>SCANNING...</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              {steps.map((s, i) => {
                const current = steps.indexOf(step);
                return (
                  <div key={i} style={{
                    fontFamily: mono, fontSize: 11, letterSpacing: 1,
                    color: current > i ? C.green : current === i ? "#fff" : C.bg3,
                    display: "flex", alignItems: "center", gap: 10, transition: "color 0.3s",
                  }}>
                    <span style={{ color: current > i ? C.green : current === i ? C.red : C.bg3, fontSize: 14 }}>
                      {current > i ? "✓" : current === i ? "›" : "○"}
                    </span>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TWITTER SCANNER PAGE ─────────────────────────────────────────────────────
function TwitterScannerPage({ setPage, setTwitterReport }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");

  const steps = [
    "Connecting to social data layer...",
    "Fetching account metadata...",
    "Pulling username change history...",
    "Scanning bio and display name changes...",
    "Cross-referencing wallet addresses...",
    "Computing identity risk score...",
    "Generating report...",
  ];

  const scan = (demo = false) => {
    const q = demo ? "@devghost_sol" : query;
    if (!q.trim()) return;
    if (demo) setQuery(q);
    setLoading(true);
    let i = 0;
    const tick = () => {
      setStep(steps[i]);
      i++;
      if (i < steps.length) setTimeout(tick, 380);
      else setTimeout(() => { setTwitterReport(MOCK_TWITTER_REPORT); setPage("twitter-report"); }, 500);
    };
    tick();
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "48px 40px 40px", maxWidth: 1140, margin: "0 auto" }}>
        <SectionLabel>TWITTER / X IDENTITY SCANNER</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "end" }}>
          <div>
            <h1 style={{ fontFamily: display, fontSize: 64, color: "#fff", margin: "0 0 16px", letterSpacing: -1, lineHeight: 1 }}>
              USERNAME<br /><span style={{ color: C.red }}>TRACKER</span>
            </h1>
            <p style={{ fontFamily: sans, fontSize: 14, color: C.sub, lineHeight: 1.7, maxWidth: 480 }}>
              Every identity change leaves a trail. WHODEV tracks every Twitter/X username, bio, and display name change — 
              with timestamps, risk context, and wallet correlation. Spot reputation masking before it's too late.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              { val: "4.2M+",  label: "HANDLES TRACKED",  color: C.red    },
              { val: "91K",    label: "CHANGES LOGGED",    color: C.orange },
              { val: "99.8%",  label: "CHANGE DETECTION",  color: C.green  },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 2 }}>{s.label}</span>
                <span style={{ fontFamily: display, fontSize: 26, color: s.color }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "40px", maxWidth: 1140, margin: "0 auto" }}>
        {!loading ? (
          <div>
            <div style={{ maxWidth: 640, marginBottom: 32 }}>
              <div style={{ position: "relative", marginBottom: 12 }}>
                <input
                  value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && scan()}
                  placeholder="@twitterhandle or X username..."
                  style={{
                    width: "100%", background: C.bg1, border: `1px solid ${C.border}`,
                    padding: "16px 120px 16px 20px", fontFamily: mono, fontSize: 13,
                    color: "#fff", outline: "none", letterSpacing: 0.5,
                  }}
                />
                <button onClick={() => scan()} style={{
                  position: "absolute", right: 4, top: 4, bottom: 4,
                  background: C.red, border: "none", fontFamily: display, fontSize: 16,
                  color: "#fff", cursor: "pointer", padding: "0 22px", letterSpacing: 2,
                }}>SCAN</button>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => scan(true)} style={{
                  background: C.bg2, border: `1px solid ${C.border}`, fontFamily: mono,
                  fontSize: 10, color: C.orange, cursor: "pointer", padding: "7px 16px", letterSpacing: 1,
                }}>▶ RUN DEMO — @devghost_sol</button>
                <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>See a full example scan with real patterns</span>
              </div>
            </div>

            {/* How it works */}
            <div style={{ marginBottom: 40 }}>
              <SectionLabel>WHAT WE DETECT</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border, maxWidth: 900 }}>
                {[
                  { icon: "⟳", title: "Username Changes",    desc: "Every @handle rename with exact timestamp and frequency risk scoring." },
                  { icon: "◉", title: "Bio Modifications",   desc: "Bio text history — detects project scrubbing after rug events." },
                  { icon: "◆", title: "Display Name Edits",  desc: "Display name trail correlated with on-chain token launch timing." },
                ].map((item, i) => (
                  <div key={i} style={{ background: C.bg1, padding: "24px 20px" }}>
                    <div style={{ fontFamily: display, fontSize: 28, color: C.red, marginBottom: 12 }}>{item.icon}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: "#fff", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent twitter scans */}
            <div>
              <SectionLabel>RECENTLY FLAGGED ACCOUNTS</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 800 }}>
                {[
                  { handle: "@devghost_sol",   changes: 9, lastChange: "2d ago",  risk: 79, level: "HIGH"     },
                  { handle: "@moonlaunch_xyz",  changes: 6, lastChange: "5d ago",  risk: 91, level: "CRITICAL" },
                  { handle: "@sol_alpha_dev",   changes: 4, lastChange: "12d ago", risk: 55, level: "MEDIUM"   },
                  { handle: "@defi_sensei_sol", changes: 3, lastChange: "20d ago", risk: 42, level: "MEDIUM"   },
                ].map((item, i) => (
                  <div key={i}
                    onClick={() => { setTwitterReport(MOCK_TWITTER_REPORT); setPage("twitter-report"); }}
                    style={{
                      display: "grid", gridTemplateColumns: "160px 100px 100px 80px 80px",
                      alignItems: "center", gap: 16, padding: "14px 20px",
                      background: C.bg1, border: `1px solid ${C.border}`,
                      cursor: "pointer", transition: "border-color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.red}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                  >
                    <span style={{ fontFamily: mono, fontSize: 12, color: "#fff" }}>{item.handle}</span>
                    <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>{item.changes} changes</span>
                    <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{item.lastChange}</span>
                    <span style={{ fontFamily: display, fontSize: 22, color: riskColor(item.risk) }}>{item.risk}</span>
                    <div>
                      <Badge label={item.level}
                        color={item.level === "CRITICAL" ? C.red : item.level === "HIGH" ? C.orange : C.yellow}
                        small />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 640, padding: "60px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <Spinner />
              <span style={{ fontFamily: display, fontSize: 34, color: C.red, letterSpacing: 2 }}>SCANNING IDENTITY...</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.muted, letterSpacing: 1, marginBottom: 20 }}>
              TARGET: {query}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {steps.map((s, i) => {
                const current = steps.indexOf(step);
                return (
                  <div key={i} style={{
                    fontFamily: mono, fontSize: 11, letterSpacing: 1,
                    color: current > i ? C.green : current === i ? "#fff" : C.bg3,
                    display: "flex", alignItems: "center", gap: 10, transition: "color 0.3s",
                  }}>
                    <span style={{ color: current > i ? C.green : current === i ? C.red : C.bg3 }}>
                      {current > i ? "✓" : current === i ? "›" : "○"}
                    </span>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TWITTER REPORT PAGE ──────────────────────────────────────────────────────
function TwitterReportPage({ report, setPage }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const tabs = ["timeline", "flags", "linked wallets"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      {/* Report Header */}
      <div style={{ background: C.bg1, borderBottom: `1px solid ${C.border}`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionLabel>TWITTER IDENTITY REPORT</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: display, fontSize: 52, color: "#fff", letterSpacing: -1, lineHeight: 1, marginBottom: 8 }}>
                {report.handle}
              </div>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.sub, marginBottom: 20 }}>
                {report.displayName} · Joined {report.joined}
              </div>
              <div style={{ fontFamily: sans, fontSize: 14, color: C.muted, marginBottom: 20, maxWidth: 500 }}>
                "{report.bio}"
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { label: "FOLLOWERS",    val: report.followers  },
                  { label: "FOLLOWING",    val: report.following  },
                  { label: "TWEETS",       val: report.tweets     },
                  { label: "TOTAL CHANGES",val: report.totalChanges },
                  { label: "AVG DAYS/CHANGE", val: report.avgDaysBetweenChanges + "d" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: mono, fontSize: 8, color: C.muted, letterSpacing: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: mono, fontSize: 14, color: "#fff", marginTop: 3 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <RiskGauge score={report.riskScore} size={150} />
              <Badge label={report.riskLevel}
                color={report.riskLevel === "CRITICAL" ? C.red : report.riskLevel === "HIGH" ? C.orange : C.yellow} />
            </div>
          </div>

          {/* Key stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border, marginTop: 28 }}>
            {[
              { val: report.usernameChanges,    label: "USERNAME CHANGES",      color: C.red    },
              { val: report.bioChanges,          label: "BIO CHANGES",           color: C.orange },
              { val: report.displayNameChanges,  label: "DISPLAY NAME CHANGES",  color: C.yellow },
              { val: report.linkedWallets.length, label: "LINKED WALLETS",       color: C.red    },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg, padding: "18px 24px" }}>
                <div style={{ fontFamily: display, fontSize: 36, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 40px", display: "flex" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: "none", border: "none", fontFamily: mono, fontSize: 10,
              color: activeTab === t ? "#fff" : C.muted, cursor: "pointer",
              padding: "14px 20px", letterSpacing: 1.5,
              borderBottom: activeTab === t ? `2px solid ${C.red}` : "2px solid transparent",
              textTransform: "uppercase",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 40px" }}>

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div className="fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32 }}>
              <div>
                <SectionLabel>IDENTITY CHANGE TIMELINE</SectionLabel>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: C.border }} />
                  {report.timeline.map((event, i) => (
                    <div key={i} style={{ position: "relative", paddingLeft: 28, paddingBottom: 28 }}>
                      <div style={{ position: "absolute", left: -4, top: 5, width: 8, height: 8, background: event.changes.some(c => c.risk === "high") ? C.red : C.orange, borderRadius: "50%", boxShadow: `0 0 6px ${event.changes.some(c => c.risk === "high") ? C.red : C.orange}` }} />
                      <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 10 }}>
                        {event.date} <span style={{ color: C.bg3 }}>— {event.daysAgo}d ago</span>
                      </div>
                      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "16px 20px" }}>
                        {event.changes.map((change, j) => (
                          <div key={j} style={{ marginBottom: j < event.changes.length - 1 ? 14 : 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                              <Badge label={change.type} color={changeColor(change.risk)} small />
                              <Badge label={change.risk.toUpperCase()} color={changeColor(change.risk)} small />
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                              <span style={{ fontFamily: mono, fontSize: 12, color: C.muted, textDecoration: "line-through" }}>{change.from}</span>
                              <span style={{ color: C.red, fontFamily: mono }}>→</span>
                              <span style={{ fontFamily: mono, fontSize: 12, color: "#fff", fontWeight: 700 }}>{change.to}</span>
                            </div>
                          </div>
                        ))}
                        {event.context && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
                              ◈ {event.context}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar summary */}
              <div>
                <SectionLabel>RISK SUMMARY</SectionLabel>
                <Card style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, letterSpacing: 1, marginBottom: 12 }}>CHANGE FREQUENCY</div>
                  <div style={{ fontFamily: display, fontSize: 36, color: C.red, marginBottom: 4 }}>
                    {report.avgDaysBetweenChanges}d
                  </div>
                  <div style={{ fontFamily: sans, fontSize: 12, color: C.muted }}>avg. between identity changes</div>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ fontFamily: mono, fontSize: 10, color: C.orange }}>
                      ⚠ Exceeds 99th percentile of normal users
                    </div>
                  </div>
                </Card>
                <Card>
                  <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, letterSpacing: 1, marginBottom: 14 }}>CHANGE BREAKDOWN</div>
                  {[
                    { label: "Username",     val: report.usernameChanges,   color: C.red    },
                    { label: "Bio",          val: report.bioChanges,        color: C.orange },
                    { label: "Display Name", val: report.displayNameChanges, color: C.yellow },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>{s.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: s.val * 20, height: 4, background: s.color, maxWidth: 80 }} />
                        <span style={{ fontFamily: mono, fontSize: 12, color: s.color }}>{s.val}</span>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* FLAGS TAB */}
        {activeTab === "flags" && (
          <div className="fade-in">
            <SectionLabel>RISK FLAGS DETECTED</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 800 }}>
              {report.flags.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px",
                  background: C.bg1, borderLeft: `3px solid ${severityColor(f.severity)}`,
                }}>
                  <Badge label={f.severity.toUpperCase()} color={severityColor(f.severity)} small />
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 12, color: "#fff", fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
                    <div style={{ fontFamily: sans, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LINKED WALLETS TAB */}
        {activeTab === "linked wallets" && (
          <div className="fade-in">
            <SectionLabel>WALLETS LINKED TO THIS IDENTITY</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 700, marginBottom: 24 }}>
              {report.linkedWallets.map((w, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", background: C.bg1, border: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontFamily: mono, fontSize: 13, color: "#fff" }}>{w}</span>
                  <button onClick={() => setPage("search")} style={{
                    background: "none", border: `1px solid ${C.border}`, fontFamily: mono,
                    fontSize: 9, color: C.dim, cursor: "pointer", padding: "5px 12px", letterSpacing: 1,
                  }}>VIEW REPORT →</button>
                </div>
              ))}
            </div>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, padding: "16px 20px", maxWidth: 700 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.orange, marginBottom: 6 }}>◈ HOW WE LINK WALLETS</div>
              <div style={{ fontFamily: sans, fontSize: 13, color: C.sub, lineHeight: 1.7 }}>
                Wallet-to-Twitter links are detected through on-chain NFT minting with social handles, token launch announcement timing correlation, 
                Bonfida name service records, and behavioral timing patterns between social posts and on-chain activity.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "20px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setPage("twitter")} style={{
            background: "none", border: `1px solid ${C.border}`, fontFamily: mono,
            fontSize: 10, color: C.dim, cursor: "pointer", padding: "10px 20px", letterSpacing: 1,
          }}>← NEW SCAN</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setPage("search"); }} style={{
              background: "none", border: `1px solid ${C.border}`, fontFamily: mono,
              fontSize: 10, color: C.dim, cursor: "pointer", padding: "10px 20px", letterSpacing: 1,
            }}>SCAN LINKED WALLET</button>
            <button style={{
              background: C.red, border: "none", fontFamily: mono,
              fontSize: 10, color: "#fff", cursor: "pointer", padding: "10px 20px", letterSpacing: 1, fontWeight: 700,
            }}>EXPORT REPORT</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WALLET REPORT PAGE ───────────────────────────────────────────────────────
function ReportPage({ report, setPage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["overview", "tokens", "cluster", "social"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      {/* Report Header */}
      <div style={{ background: C.bg1, borderBottom: `1px solid ${C.border}`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionLabel>WALLET INTELLIGENCE REPORT</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start", marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: display, fontSize: 48, color: "#fff", letterSpacing: -1, marginBottom: 6 }}>{report.twitter}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, marginBottom: 20, letterSpacing: 0.5 }}>{report.fullWallet}</div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { label: "FIRST SEEN",  val: report.firstActivity },
                  { label: "LAST ACTIVE", val: report.lastSeen      },
                  { label: "TOKENS",      val: report.totalTokensLaunched },
                  { label: "RUGGED",      val: report.ruggedTokens  },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: mono, fontSize: 8, color: C.muted, letterSpacing: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: mono, fontSize: 13, color: "#fff", marginTop: 3 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <RiskGauge score={report.riskScore} size={150} />
              <Badge label={report.riskLevel} color={riskColor(report.riskScore)} />
            </div>
          </div>

          {/* Key stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border }}>
            {[
              { val: report.linkedWallets,   label: "LINKED WALLETS",   color: C.orange },
              { val: `${report.ruggedTokens}/${report.totalTokensLaunched}`, label: "RUG RATE", color: C.red },
              { val: report.totalVolumeDrained, label: "VOLUME DRAINED", color: C.red    },
              { val: report.flags.length,    label: "ACTIVE FLAGS",      color: C.yellow },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg, padding: "18px 24px" }}>
                <div style={{ fontFamily: display, fontSize: 34, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 40px", display: "flex" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: "none", border: "none", fontFamily: mono, fontSize: 10,
              color: activeTab === t ? "#fff" : C.muted, cursor: "pointer",
              padding: "14px 20px", letterSpacing: 1.5, textTransform: "uppercase",
              borderBottom: activeTab === t ? `2px solid ${C.red}` : "2px solid transparent",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 40px" }}>

        {activeTab === "overview" && (
          <div className="fade-in">
            <SectionLabel>RED FLAGS DETECTED</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 860 }}>
              {report.flags.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 20px",
                  background: C.bg1, borderLeft: `3px solid ${severityColor(f.severity)}`,
                }}>
                  <Badge label={f.severity.toUpperCase()} color={severityColor(f.severity)} small />
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 12, color: "#fff", fontWeight: 700, marginBottom: 5 }}>{f.label}</div>
                    <div style={{ fontFamily: sans, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="fade-in">
            <SectionLabel>TOKEN LAUNCH HISTORY</SectionLabel>
            <div style={{ background: C.border, padding: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px 90px", gap: 16, padding: "10px 20px", background: C.bg1 }}>
                {["TOKEN", "DATE", "RAISED", "DAYS", "STATUS"].map(h => (
                  <div key={h} style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 2 }}>{h}</div>
                ))}
              </div>
              {report.tokenHistory.map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px 90px", gap: 16, padding: "14px 20px", background: C.bg, alignItems: "center", borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 12, color: "#fff" }}>{t.name}</div>
                    <div style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>${t.symbol}</div>
                  </div>
                  <div style={{ fontFamily: sans, fontSize: 12, color: C.muted }}>{t.date}</div>
                  <div style={{ fontFamily: display, fontSize: 20, color: "#fff" }}>{t.raised}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: C.muted }}>{t.daysLive}d</div>
                  <Badge label={t.status} color={statusColor(t.status)} small />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cluster" && (
          <div className="fade-in">
            <SectionLabel>WALLET CLUSTER — {report.walletCluster.length} WALLETS IDENTIFIED</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {report.walletCluster.map((w, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "200px 90px 1fr 120px",
                  gap: 16, padding: "14px 20px", background: C.bg1, alignItems: "center",
                  borderLeft: `3px solid ${w.role === "PRIMARY" ? "#fff" : roleColor(w.role)}`,
                }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: "#fff" }}>{w.address}</span>
                  <Badge label={w.role} color={roleColor(w.role)} small />
                  <span style={{ fontFamily: sans, fontSize: 12, color: C.muted }}>Funded via: {w.funded}</span>
                  <span style={{ fontFamily: display, fontSize: 18, color: "#fff", textAlign: "right" }}>{w.balance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="fade-in">
            <SectionLabel>IDENTITY CHANGE HISTORY</SectionLabel>
            <div style={{ position: "relative", paddingLeft: 20, maxWidth: 700 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: C.border }} />
              {report.socialHistory.map((s, i) => (
                <div key={i} style={{ position: "relative", paddingLeft: 24, paddingBottom: 24 }}>
                  <div style={{ position: "absolute", left: -4, top: 5, width: 8, height: 8, background: s.type === "USERNAME" ? C.red : C.orange, borderRadius: "50%" }} />
                  <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>{s.date}</div>
                  <div style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "14px 18px" }}>
                    <div style={{ marginBottom: 10 }}>
                      <Badge label={s.type + " CHANGED"} color={s.type === "USERNAME" ? C.red : C.orange} small />
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: mono, fontSize: 12, color: C.muted, textDecoration: "line-through" }}>{s.from}</span>
                      <span style={{ color: C.red, fontFamily: mono }}>→</span>
                      <span style={{ fontFamily: mono, fontSize: 12, color: "#fff" }}>{s.to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: "20px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setPage("search")} style={{
            background: "none", border: `1px solid ${C.border}`, fontFamily: mono,
            fontSize: 10, color: C.dim, cursor: "pointer", padding: "10px 20px", letterSpacing: 1,
          }}>← NEW SCAN</button>
          <button style={{
            background: C.red, border: "none", fontFamily: mono,
            fontSize: 10, color: "#fff", cursor: "pointer", padding: "10px 20px", letterSpacing: 1, fontWeight: 700,
          }}>EXPORT REPORT</button>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT / PROJECT DOCS PAGE ────────────────────────────────────────────────
function AboutPage({ setPage }) {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      id: "what",
      title: "What is WHODEV?",
      content: `WHODEV is an open intelligence platform built for the Solana ecosystem. Our goal is to give retail investors the same on-chain visibility that sophisticated funds and experienced traders use internally.

We aggregate data from the Solana blockchain, Helius RPC, DAS API, and social identity layers to build comprehensive risk profiles of anonymous developers and wallets. Every scan produces a structured Risk Report with a quantified score, flagged behaviors, and a cluster map of linked wallets.

The platform is fully automated — no manual curation. Risk scores update continuously as new on-chain activity and social changes are detected.`,
    },
    {
      id: "twitter",
      title: "Twitter Username Tracker — How It Works",
      content: `The Twitter/X Identity Scanner is one of WHODEV's most powerful tools. Anonymous developers frequently change their username to escape reputational damage after a rug or failed project.

Our system:
1. Archives every public username, display name, and bio at regular intervals
2. Detects changes within minutes of them occurring
3. Correlates identity changes with on-chain activity (e.g., username changed 3 days before a new token launch)
4. Scores the frequency and pattern of changes against baseline behavior of legitimate builders

A high-frequency identity changer with linked rug history is flagged as HIGH or CRITICAL risk automatically.`,
    },
    {
      id: "risk",
      title: "How Risk Scores Are Calculated",
      content: `Risk Scores (0–100) are computed by a weighted model across four signal categories:

ON-CHAIN SIGNALS (50%)
— Token launch frequency and survival rate
— LP removal patterns and timing
— Wallet funding source (CEX withdrawal batches, mixers)
— Sniper wallet coordination timing

SOCIAL SIGNALS (25%)
— Username change frequency and timing correlation
— Bio scrubbing patterns post-rug
— Account age vs. activity volume

CLUSTER SIGNALS (15%)
— Number of linked wallets
— Shared funding sources
— Behavioral timing synchronization

REPUTATION SIGNALS (10%)
— Community reports and on-chain dispute records
— Cross-platform mentions in known rug trackers

Scores above 75 are flagged HIGH, above 85 are CRITICAL.`,
    },
    {
      id: "tech",
      title: "Technical Stack",
      content: `WHODEV is built on a real-time data pipeline designed for low-latency identity correlation:

DATA LAYER
— Solana RPC (Helius) for on-chain transaction streaming
— DAS API for compressed NFT and token metadata
— Custom social archival system for Twitter/X identity snapshots
— PostgreSQL + TimescaleDB for time-series identity change storage

INTELLIGENCE LAYER
— Graph-based wallet cluster analysis (custom fingerprinting engine)
— Behavioral timing analysis for sniper/dump wallet detection
— NLP-based bio comparison for scrubbing detection
— Risk model trained on 3,000+ confirmed rug events

FRONTEND
— React + Vite (this interface)
— Fully responsive, dark-mode only
— No cookies, no tracking — privacy-first`,
    },
    {
      id: "roadmap",
      title: "Roadmap",
      content: `Q2 2025 — LAUNCHED
✓ Wallet Intelligence Scanner (demo)
✓ Twitter Username Tracker (demo)
✓ Risk Scoring v1
✓ Wallet Cluster Mapping

Q3 2025 — IN PROGRESS
◈ Telegram & Discord alert bot
◈ Real-time data pipeline (live, not mock)
◈ API access for power users
◈ Watchlist — monitor specific wallets

Q4 2025 — PLANNED
◈ Browser extension for inline risk scores
◈ Pump.fun and Raydium integration
◈ Mobile app
◈ Community report system`,
    },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "60px 40px" }}>
        <SectionLabel>PROJECT DOCUMENTATION</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 60, alignItems: "start" }}>
          <div>
            <h1 style={{ fontFamily: display, fontSize: 64, color: "#fff", letterSpacing: -1, lineHeight: 1, marginBottom: 20 }}>
              ABOUT<br /><span style={{ color: C.red }}>WHODEV</span>
            </h1>
            <p style={{ fontFamily: sans, fontSize: 15, color: C.sub, lineHeight: 1.8, marginBottom: 40, maxWidth: 560 }}>
              WHODEV is an on-chain and social intelligence platform for the Solana ecosystem — built to expose anonymous developers, 
              detect rugpull patterns, and track identity changes in real-time. 
              Built for degens, by people who got rugged.
            </p>

            {/* Accordion */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {sections.map(s => (
                <div key={s.id} style={{ background: C.bg1, border: `1px solid ${C.border}` }}>
                  <button
                    onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
                    style={{
                      width: "100%", background: "none", border: "none", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "18px 24px", textAlign: "left",
                    }}
                  >
                    <span style={{ fontFamily: mono, fontSize: 12, color: "#fff", letterSpacing: 1, fontWeight: 700 }}>{s.title}</span>
                    <span style={{ fontFamily: mono, fontSize: 16, color: openSection === s.id ? C.red : C.muted, transition: "transform 0.2s", transform: openSection === s.id ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openSection === s.id && (
                    <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${C.border}` }} className="fade-in">
                      <div style={{ paddingTop: 16 }}>
                        {s.content.split("\n").map((line, i) => (
                          line.trim() === "" ? <div key={i} style={{ height: 12 }} /> :
                          <div key={i} style={{ fontFamily: line.startsWith("—") || line.startsWith("✓") || line.startsWith("◈") ? mono : sans, fontSize: line.startsWith("—") || line.startsWith("✓") || line.startsWith("◈") ? 11 : 13, color: line === line.toUpperCase() && line.length < 40 ? C.orange : C.sub, lineHeight: 1.8, letterSpacing: line === line.toUpperCase() && line.length < 40 ? 1 : 0 }}>
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 80 }}>
            <Card style={{ marginBottom: 12 }}>
              <SectionLabel>QUICK ACTIONS</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => setPage("search")} style={{
                  background: C.red, border: "none", fontFamily: display, fontSize: 18,
                  color: "#fff", cursor: "pointer", padding: "12px 20px", letterSpacing: 2, textAlign: "left",
                }}>SCAN A WALLET →</button>
                <button onClick={() => setPage("twitter")} style={{
                  background: C.bg2, border: `1px solid ${C.border}`, fontFamily: display, fontSize: 18,
                  color: "#fff", cursor: "pointer", padding: "12px 20px", letterSpacing: 2, textAlign: "left",
                }}>TWITTER SCANNER →</button>
              </div>
            </Card>

            <Card style={{ marginBottom: 12 }}>
              <SectionLabel>PROJECT STATUS</SectionLabel>
              {[
                { label: "Platform",        val: "DEMO",    color: C.orange },
                { label: "Data",            val: "MOCK",    color: C.orange },
                { label: "Risk Engine",     val: "v1.0",    color: C.green  },
                { label: "Twitter Scanner", val: "DEMO",    color: C.orange },
                { label: "Live Alerts",     val: "Q3 2025", color: C.muted  },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>{item.label}</span>
                  <Badge label={item.val} color={item.color} small />
                </div>
              ))}
            </Card>

            <Card>
              <SectionLabel>DISCLAIMER</SectionLabel>
              <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                WHODEV is currently in demo mode. All scan results use mock data for demonstration purposes. 
                Do not make financial decisions based on demo output. 
                Live data pipeline is in development.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [report, setReport] = useState(null);
  const [twitterReport, setTwitterReport] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      <Ticker />
      <Nav page={page} setPage={setPage} />
      {page === "home"           && <Landing setPage={setPage} />}
      {page === "search"         && <SearchPage setPage={setPage} setReport={setReport} />}
      {page === "report"         && report && <ReportPage report={report} setPage={setPage} />}
      {page === "twitter"        && <TwitterScannerPage setPage={setPage} setTwitterReport={setTwitterReport} />}
      {page === "twitter-report" && twitterReport && <TwitterReportPage report={twitterReport} setPage={setPage} />}
      {page === "about"          && <AboutPage setPage={setPage} />}
    </div>
  );
}
