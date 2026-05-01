import { useState, useEffect } from "react";

// ─── FONTS & GLOBAL STYLES ───────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Cairo:wght@400;600;700;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #000; color: #fff; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
input::placeholder { color: #3a3a3a; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 2px; }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes followPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(230,48,48,0.6); } 50% { box-shadow: 0 0 0 8px rgba(230,48,48,0); } }
.fade-in { animation: fadeIn 0.35s ease forwards; }
.follow-btn { animation: followPulse 2s infinite; }

/* ── MOBILE RESPONSIVE ── */
@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  .stats-col { flex-direction: row !important; flex-wrap: wrap !important; gap: 8px !important; }
  .stat-card { flex: 1 !important; min-width: 140px !important; }
  .features-grid { grid-template-columns: 1fr !important; }
  .nav-links { display: none !important; }
  .nav-mobile-menu { display: flex !important; }
  .about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  .report-header-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
  .key-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .tabs-row { overflow-x: auto !important; }
  .cluster-row { grid-template-columns: 1fr 80px !important; }
  .cluster-extra { display: none !important; }
  .alert-row { grid-template-columns: 56px 1fr 80px !important; }
  .alert-wallet { display: none !important; }
  .token-row { grid-template-columns: 1fr 1fr !important; }
  .token-extra { display: none !important; }
  .page-pad { padding: 40px 16px !important; }
  .section-pad { padding: 0 16px !important; }
  .hero-pad { padding: 48px 16px 40px !important; }
  .nav-pad { padding: 0 16px !important; }
  .footer-pad { padding: 20px 16px !important; }
  .follow-banner { padding: 20px 16px !important; flex-direction: column !important; gap: 12px !important; }
  .follow-banner-text { text-align: center !important; }
  .modal-pad { padding: 24px 20px !important; }
  .modal-title { font-size: 36px !important; }
  .modal-btns { flex-direction: column !important; }
}
`;

// ─── MOBILE HOOK ──────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

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
  { icon: "◈", titleAr: "استخبارات المحفظة",   titleEn: "Wallet Intelligence",   descAr: "تحليل عميق على السلسلة — تتبع المعاملات، مصادر التمويل، وأنماط التوزيع.", descEn: "Deep on-chain analysis — transaction tracing, funding sources, and distribution patterns." },
  { icon: "⚠", titleAr: "كشف الاحتيال",       titleEn: "Rugpull Detection",     descAr: "يكشف عمليات البيع الخفي وسحب السيولة وتنسيق القناصة قبل خسارتك.", descEn: "Identifies stealth dumps, LP removals, sniper coordination before you lose." },
  { icon: "◉", titleAr: "ربط الهوية الاجتماعية", titleEn: "Social Identity Link",  descAr: "يربط المحافظ بهويات تويتر/X عبر OSINT والمطابقة السلوكية.", descEn: "Connects wallets to Twitter/X identities via OSINT and behavioral matching." },
  { icon: "⟳", titleAr: "تتبع أسماء المستخدمين", titleEn: "Username Tracker",      descAr: "السجل الكامل لكل تغيير في الاسم والسيرة الذاتية مع تقييم المخاطر.", descEn: "Full history of every username, bio, and display name change with risk scoring." },
  { icon: "◌", titleAr: "بصمة المحفظة",       titleEn: "Wallet Fingerprint",    descAr: "يكشف المجموعات التي تسيطر عليها نفس الجهة عبر التوقيت ومسارات التمويل.", descEn: "Reveals clusters controlled by the same entity via timing and funding paths." },
  { icon: "▲", titleAr: "تقييم المخاطر",      titleEn: "Risk Scoring",          descAr: "درجات ديناميكية مبنية على إشارات السلسلة والشبكات الاجتماعية، تُحدَّث تلقائياً.", descEn: "Dynamic scores built from combined on-chain and social signals, auto-updated." },
  { icon: "◆", titleAr: "تنبيهات فورية",      titleEn: "Real-Time Alerts",      descAr: "إرسال فوري إلى تيليغرام وديسكورد عند اكتشاف نشاط مشبوه.", descEn: "Instant push to Telegram and Discord when suspicious activity is detected." },
  { icon: "⬡", titleAr: "مسح مستمر 24/7",    titleEn: "24/7 Autonomous Scan",  descAr: "يعمل باستمرار — يمسح ويربط ويُنبه عبر جميع الطبقات.", descEn: "Runs continuously — scanning, correlating, alerting across all layers." },
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
const arabic = "'Cairo', sans-serif";

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

// ─── FOLLOW BUILDER BANNER ────────────────────────────────────────────────────
function FollowBuilderBanner() {
  return (
    <div className="follow-banner" style={{
      background: `linear-gradient(135deg, #0d0d0d 0%, #1a0000 50%, #0d0d0d 100%)`,
      border: `1px solid ${C.red}44`,
      borderLeft: `4px solid ${C.red}`,
      padding: "20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
    }}>
      <div className="follow-banner-text" style={{ flex: 1 }}>
        <div style={{ fontFamily: arabic, fontSize: 18, color: "#fff", fontWeight: 700, marginBottom: 4, direction: "rtl", textAlign: "right" }}>
          🔔 تابع المطور لآخر التحديثات
        </div>
        <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>
          Follow the builder for the latest updates & features
        </div>
      </div>
      <a
        href="https://x.com/Khloud132"
        target="_blank"
        rel="noopener noreferrer"
        className="follow-btn"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.red,
          border: "none",
          padding: "12px 28px",
          cursor: "pointer",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontFamily: arabic, fontSize: 14, color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>تابع @Khloud132</span>
          <span style={{ fontFamily: mono, fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>FOLLOW BUILDER</span>
        </div>
      </a>
    </div>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { labelAr: "الرئيسية",      labelEn: "HOME",    key: "home"    },
    { labelAr: "فاحص تويتر",   labelEn: "TWITTER", key: "twitter" },
    { labelAr: "حول",           labelEn: "ABOUT",   key: "about"   },
  ];

  return (
    <>
      <nav style={{
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        height: 56, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div className="nav-pad" style={{
          padding: "0 40px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: "100%",
        }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: display, fontSize: 24, color: "#fff", letterSpacing: 2 }}>WHO</span>
            <span style={{ fontFamily: display, fontSize: 24, color: C.red,  letterSpacing: 2, marginTop: 3 }}>DEV</span>
          </button>

          {/* Desktop Nav */}
          <div className="nav-links" style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => setPage(item.key)} style={{
                background: page === item.key ? C.bg3 : "none",
                border: page === item.key ? `1px solid ${C.border}` : "1px solid transparent",
                fontFamily: mono, fontSize: 10, color: page === item.key ? "#fff" : C.dim,
                cursor: "pointer", padding: "6px 14px", letterSpacing: 1.5, transition: "all 0.15s",
              }}>{item.labelEn}</button>
            ))}
            <a
              href="https://x.com/Khloud132"
              target="_blank"
              rel="noopener noreferrer"
              className="follow-btn"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "transparent", border: `1px solid ${C.red}`,
                fontFamily: arabic, fontSize: 12, color: C.red,
                cursor: "pointer", padding: "6px 14px", letterSpacing: 0.5,
                marginLeft: 4, textDecoration: "none", fontWeight: 700,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={C.red}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              تابع المطور
            </a>
            <button onClick={() => setPage("search")} style={{
              background: C.red, border: "none", fontFamily: mono, fontSize: 10,
              color: "#fff", cursor: "pointer", padding: "8px 20px", letterSpacing: 1.5, fontWeight: 700,
              marginLeft: 8, transition: "opacity 0.15s",
            }}>
              SCAN →
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="nav-mobile-menu" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <a
              href="https://x.com/Khloud132"
              target="_blank"
              rel="noopener noreferrer"
              className="follow-btn"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: C.red, border: "none",
                padding: "6px 12px", textDecoration: "none",
                fontFamily: arabic, fontSize: 11, color: "#fff", fontWeight: 700,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              تابع
            </a>
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              style={{ background: "none", border: `1px solid ${C.border}`, color: "#fff", cursor: "pointer", padding: "6px 10px", fontFamily: mono, fontSize: 14 }}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: C.bg1, borderBottom: `1px solid ${C.border}`, padding: "8px 16px" }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => { setPage(item.key); setMobileMenuOpen(false); }} style={{
                display: "block", width: "100%", textAlign: "right",
                background: "none", border: "none", fontFamily: arabic,
                fontSize: 14, color: page === item.key ? "#fff" : C.sub,
                cursor: "pointer", padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
                direction: "rtl",
              }}>
                {item.labelAr} <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>/ {item.labelEn}</span>
              </button>
            ))}
            <button onClick={() => { setPage("search"); setMobileMenuOpen(false); }} style={{
              display: "block", width: "100%", textAlign: "center",
              background: C.red, border: "none", fontFamily: arabic,
              fontSize: 14, color: "#fff", fontWeight: 700,
              cursor: "pointer", padding: "12px 0", marginTop: 8,
            }}>
              افحص محفظة / SCAN WALLET
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── ONBOARDING MODAL ────────────────────────────────────────────────────────
function OnboardingModal({ onClose }) {
  const steps = [
    {
      icon: "◈",
      titleAr: "الصق محفظة أو حساباً",
      titleEn: "Paste a wallet or handle",
      descAr: "أدخل أي عنوان محفظة سولانا أو اسم مستخدم تويتر/X لبدء المسح.",
      descEn: "Input any Solana wallet address or Twitter/X username to begin deep intelligence scan.",
    },
    {
      icon: "⟳",
      titleAr: "نتتبع الهوية كاملة",
      titleEn: "We trace the full identity",
      descAr: "WHODEV يربط المعاملات على السلسلة وإطلاقات التوكن وسجل الهوية الاجتماعية في الوقت الفعلي.",
      descEn: "WHODEV cross-references on-chain transactions, token launches, and social identity history in real-time.",
    },
    {
      icon: "▲",
      titleAr: "احصل على تقرير المخاطر",
      titleEn: "Get a risk report",
      descAr: "تقرير منظم بدرجة المخاطر والسلوكيات المُبلَّغ عنها ومجموعات المحافظ المرتبطة.",
      descEn: "Receive a structured report with a risk score, flagged behaviours, and linked wallet clusters.",
    },
    {
      icon: "◉",
      titleAr: "فاحص تويتر",
      titleEn: "Twitter Scanner",
      descAr: "جديد: تتبع كل تغيير في الاسم والسيرة الذاتية لاكتشاف محاولات إخفاء السمعة مبكراً.",
      descEn: "New: Track every username, bio, and display name change to spot reputation-masking.",
    },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div className="fade-in modal-pad" style={{
        background: C.bg1, border: `1px solid ${C.border}`, maxWidth: 580, width: "100%", padding: "40px",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24, direction: "rtl", textAlign: "right" }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: C.red, letterSpacing: 3, marginBottom: 8 }}>
            ◈ مرحباً بك في WHODEV
          </div>
          <h2 className="modal-title" style={{
            fontFamily: arabic, fontSize: 40, color: "#fff", lineHeight: 1.2,
            marginBottom: 8, fontWeight: 900,
          }}>
            منصة استخبارات<br /><span style={{ color: C.red }}>سولانا</span>
          </h2>
          <p style={{ fontFamily: mono, fontSize: 10, color: C.muted, letterSpacing: 1, marginBottom: 12, direction: "ltr", textAlign: "left" }}>
            SOLANA INTELLIGENCE PLATFORM
          </p>
          <p style={{ fontFamily: arabic, fontSize: 14, color: C.sub, lineHeight: 1.9 }}>
            WHODEV هي أداة استخباراتية متقدمة لكشف هويات مطوري سولانا المجهولين،
            واكتشاف أنماط الاحتيال، وتتبع تغييرات الهوية — قبل أن تستثمر أموالك.
          </p>
          <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.7, marginTop: 6 }}>
            WHODEV unmasks anonymous Solana developers, detects rugpull patterns, and tracks identity changes — before you invest.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: C.bg2, padding: "14px 16px", borderRight: `3px solid ${C.border}`,
              direction: "rtl", transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.red}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ fontFamily: display, fontSize: 22, color: C.red, minWidth: 22, marginTop: 2 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: arabic, fontSize: 13, color: "#fff", marginBottom: 3, fontWeight: 700 }}>{s.titleAr}</div>
                <div style={{ fontFamily: arabic, fontSize: 12, color: C.sub, lineHeight: 1.7 }}>{s.descAr}</div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, marginTop: 4, direction: "ltr", textAlign: "left", lineHeight: 1.5 }}>{s.descEn}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Follow Builder prompt */}
        <a
          href="https://x.com/Khloud132"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#0d0d0d", border: `1px solid ${C.red}66`,
            padding: "12px 16px", marginBottom: 16, textDecoration: "none", gap: 12,
          }}
        >
          <div style={{ direction: "rtl", textAlign: "right" }}>
            <div style={{ fontFamily: arabic, fontSize: 13, color: "#fff", fontWeight: 700 }}>🔔 تابع المطور لآخر التحديثات</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>Follow @Khloud132 on X for updates</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.red, padding: "8px 14px", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span style={{ fontFamily: arabic, fontSize: 13, color: "#fff", fontWeight: 700 }}>تابع</span>
          </div>
        </a>

        {/* Actions */}
        <div className="modal-btns" style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, background: C.red, border: "none", fontFamily: arabic, fontSize: 18,
            color: "#fff", cursor: "pointer", padding: "14px 24px", fontWeight: 700,
          }}>ابدأ المسح الآن</button>
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
      <div className="hero-pad" style={{ padding: "80px 40px 60px", maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 7, height: 7, background: C.red, borderRadius: "50%", boxShadow: `0 0 10px ${C.red}`, animation: "pulse 1.2s infinite" }} />
          <span style={{ fontFamily: mono, fontSize: 10, color: C.red, letterSpacing: 3 }}>LIVE MONITORING ACTIVE</span>
          <span style={{ fontFamily: arabic, fontSize: 11, color: C.muted }}>· المراقبة المباشرة نشطة</span>
        </div>

        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ direction: "rtl", textAlign: "right", marginBottom: 16 }}>
              <div style={{ fontFamily: arabic, fontSize: 13, color: C.muted, marginBottom: 4 }}>من هذا المطور؟</div>
            </div>
            <h1 style={{ fontFamily: display, fontSize: "clamp(64px, 10vw, 140px)", color: "#fff", lineHeight: 0.92, margin: "0 0 16px", letterSpacing: -2 }}>
              WHO IS<br />
              <span style={{ color: C.red, WebkitTextStroke: "2px " + C.red, WebkitTextFillColor: "transparent" }}>THIS</span><br />
              DEV?
            </h1>
            <p style={{ fontFamily: arabic, fontSize: 15, color: "#fff", lineHeight: 1.8, margin: "0 0 4px", direction: "rtl", textAlign: "right" }}>
              أقوى منصة استخباراتية على السلسلة لشبكة سولانا.
              اكشف الاحتيال قبل حدوثه. افضح المطورين المجهولين. تتبع تغييرات الهوية فوراً.
            </p>
            <p style={{ fontFamily: sans, fontSize: 14, color: C.sub, lineHeight: 1.6, margin: "0 0 28px" }}>
              The most advanced on-chain intelligence platform for Solana. Expose rugs before they happen.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setPage("search")} style={{
                background: C.red, border: "none", fontFamily: arabic, fontSize: 16,
                color: "#fff", cursor: "pointer", padding: "14px 28px", fontWeight: 700,
              }}>افحص محفظة</button>
              <button onClick={() => setPage("twitter")} style={{
                background: "none", border: `1px solid ${C.border}`, fontFamily: display, fontSize: 18,
                color: C.dim, cursor: "pointer", padding: "14px 28px", letterSpacing: 1,
              }}>TWITTER SCANNER</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { val: stats.wallets.toLocaleString(), labelAr: "محافظ مُتتبَّعة",   labelEn: "WALLETS TRACKED",   color: C.red    },
              { val: stats.rugs.toLocaleString(),    labelAr: "عمليات احتيال",     labelEn: "RUGS DETECTED",     color: C.orange },
              { val: `$${stats.volume}M+`,           labelAr: "رأس مال محمي",       labelEn: "CAPITAL PROTECTED", color: C.green  },
            ].map(s => (
              <div key={s.labelEn} className="stat-card" style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: arabic, fontSize: 12, color: "#fff", direction: "rtl", fontWeight: 600 }}>{s.labelAr}</div>
                  <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 1 }}>{s.labelEn}</div>
                </div>
                <div style={{ fontFamily: display, fontSize: 32, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOLLOW BUILDER BANNER */}
      <div className="section-pad" style={{ padding: "0 40px", maxWidth: 1140, margin: "0 auto 0" }}>
        <FollowBuilderBanner />
      </div>

      {/* LIVE ALERTS */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0 40px", marginTop: 24 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 9, color: C.red, letterSpacing: 3, padding: "14px 16px 14px 0", borderRight: `1px solid ${C.border}`, whiteSpace: "nowrap", marginRight: 20 }}>
              LIVE ALERTS
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {RECENT_ALERTS.map((alert, i) => (
                <div key={i} className="alert-row" style={{
                  display: "grid", gridTemplateColumns: "56px 120px 1fr 80px",
                  alignItems: "center", gap: 12, padding: "10px 0",
                  borderTop: i > 0 ? `1px solid ${C.bg2}` : "none",
                }}>
                  <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>{alert.time}</span>
                  <span className="alert-wallet" style={{ fontFamily: mono, fontSize: 10, color: "#fff" }}>{alert.wallet}</span>
                  <span style={{ fontFamily: sans, fontSize: 12, color: C.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{alert.event}</span>
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
      <div className="page-pad" style={{ padding: "80px 40px", maxWidth: 1140, margin: "0 auto" }}>
        <SectionLabel>PLATFORM FEATURES</SectionLabel>
        <div style={{ direction: "rtl", textAlign: "right", marginBottom: 32 }}>
          <h2 style={{ fontFamily: arabic, fontSize: 28, color: "#fff", fontWeight: 900, marginBottom: 6 }}>ميزات المنصة</h2>
          <p style={{ fontFamily: arabic, fontSize: 14, color: C.sub }}>أدوات متكاملة لحماية استثماراتك في عالم سولانا</p>
        </div>
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              style={{
                background: hoveredFeature === i ? C.bg2 : C.bg,
                padding: "24px 20px", cursor: "default",
                borderBottom: hoveredFeature === i ? `2px solid ${C.red}` : "2px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={{ fontFamily: display, fontSize: 28, color: C.red, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontFamily: arabic, fontSize: 13, color: "#fff", marginBottom: 3, fontWeight: 700, direction: "rtl", textAlign: "right" }}>{f.titleAr}</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 8 }}>{f.titleEn}</div>
              <div style={{ fontFamily: arabic, fontSize: 12, color: C.sub, lineHeight: 1.7, direction: "rtl", textAlign: "right" }}>{f.descAr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SITE ONBOARDING SECTION */}
      <div style={{ background: C.bg1, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="page-pad" style={{ padding: "60px 40px", maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="hero-grid">
            {/* Arabic */}
            <div style={{ direction: "rtl", textAlign: "right" }}>
              <SectionLabel>◈ عن المنصة</SectionLabel>
              <h3 style={{ fontFamily: arabic, fontSize: 24, color: "#fff", fontWeight: 900, marginBottom: 16, lineHeight: 1.4 }}>
                ما هو <span style={{ color: C.red }}>WHODEV</span>؟
              </h3>
              <p style={{ fontFamily: arabic, fontSize: 14, color: C.sub, lineHeight: 2, marginBottom: 16 }}>
                WHODEV منصة استخباراتية مفتوحة مبنية لنظام سولانا. هدفنا هو منح المستثمرين الأفراد 
                نفس الرؤية على السلسلة التي يستخدمها المحترفون والمتداولون الخبراء.
              </p>
              <p style={{ fontFamily: arabic, fontSize: 14, color: C.sub, lineHeight: 2 }}>
                نجمع البيانات من بلوكتشين سولانا وواجهات برمجية متعددة لبناء ملفات مخاطر شاملة 
                للمطورين المجهولين. كل مسح ينتج تقرير مخاطر منظم بدرجة مُحددة وسلوكيات مُبلَّغ عنها 
                وخريطة لمجموعات المحافظ المرتبطة.
              </p>
            </div>
            {/* English */}
            <div>
              <SectionLabel>◈ ABOUT THE PLATFORM</SectionLabel>
              <h3 style={{ fontFamily: display, fontSize: 28, color: "#fff", letterSpacing: -0.5, marginBottom: 16 }}>
                WHAT IS <span style={{ color: C.red }}>WHODEV</span>?
              </h3>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.sub, lineHeight: 1.8, marginBottom: 16 }}>
                WHODEV is an open intelligence platform built for the Solana ecosystem. Our goal is to give retail
                investors the same on-chain visibility that sophisticated funds and experienced traders use internally.
              </p>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.sub, lineHeight: 1.8 }}>
                Every scan produces a structured Risk Report with a quantified score, flagged behaviors,
                and a cluster map of linked wallets. The platform is fully automated — risk scores update
                continuously as new on-chain activity and social changes are detected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOLLOW BUILDER CTA */}
      <div className="page-pad" style={{ padding: "60px 40px", maxWidth: 1140, margin: "0 auto", textAlign: "center" }}>
        <div style={{ direction: "rtl", textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: arabic, fontSize: 22, color: "#fff", fontWeight: 900, marginBottom: 8 }}>
            ابقَ على اطلاع دائم بآخر التحديثات
          </div>
          <div style={{ fontFamily: sans, fontSize: 14, color: C.sub, marginBottom: 4 }}>
            Stay updated on new features & improvements
          </div>
        </div>
        <a
          href="https://x.com/Khloud132"
          target="_blank"
          rel="noopener noreferrer"
          className="follow-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: C.red, padding: "16px 40px",
            textDecoration: "none", margin: "0 auto",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: arabic, fontSize: 16, color: "#fff", fontWeight: 700, direction: "rtl" }}>تابع @Khloud132</div>
            <div style={{ fontFamily: mono, fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>FOLLOW THE BUILDER ON X</div>
          </div>
        </a>
      </div>

    </div>
  );
}

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
function SearchPage({ setPage, setReport }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = () => {
    if (!query.trim()) { setError("Please enter a wallet address or Twitter handle."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setReport(MOCK_WALLET_REPORT);
      setPage("report");
    }, 2200);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      <div className="page-pad" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <SectionLabel>WALLET INTELLIGENCE</SectionLabel>
          <div style={{ direction: "rtl", textAlign: "right", marginBottom: 16 }}>
            <h2 style={{ fontFamily: arabic, fontSize: 32, color: "#fff", fontWeight: 900, marginBottom: 6 }}>افحص محفظة أو حساباً</h2>
            <p style={{ fontFamily: arabic, fontSize: 14, color: C.sub }}>أدخل عنوان محفظة سولانا أو اسم مستخدم تويتر/X</p>
          </div>
          <h1 style={{ fontFamily: display, fontSize: 48, color: "#fff", letterSpacing: -1, lineHeight: 1, marginBottom: 8 }}>SCAN A WALLET</h1>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.sub, marginBottom: 32 }}>Enter a Solana wallet address or Twitter/X handle.</p>

          <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              placeholder="7xKXf3aB...  or  @devghost_sol"
              style={{
                flex: 1, background: C.bg1, border: `1px solid ${error ? C.red : C.border}`,
                borderRight: "none", fontFamily: mono, fontSize: 13, color: "#fff",
                padding: "14px 20px", outline: "none",
              }}
            />
            <button onClick={handleScan} disabled={loading} style={{
              background: loading ? C.muted : C.red, border: "none", fontFamily: display,
              fontSize: 18, color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              padding: "14px 32px", letterSpacing: 2, display: "flex", alignItems: "center", gap: 8,
              minWidth: 120,
            }}>
              {loading ? <Spinner /> : "SCAN →"}
            </button>
          </div>
          {error && <div style={{ fontFamily: sans, fontSize: 12, color: C.red, marginBottom: 8 }}>{error}</div>}

          {loading && (
            <div className="fade-in" style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "20px 24px", marginTop: 16 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.red, letterSpacing: 2, marginBottom: 12 }}>SCANNING...</div>
              {["Fetching on-chain history", "Mapping wallet cluster", "Cross-referencing social identity", "Calculating risk score"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, background: C.red, borderRadius: "50%", animation: `pulse ${1 + i * 0.3}s infinite` }} />
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.sub }}>{step}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <button onClick={() => setPage("twitter")} style={{
              background: "none", border: `1px solid ${C.border}`, fontFamily: arabic,
              fontSize: 13, color: C.dim, cursor: "pointer", padding: "10px 20px",
            }}>فاحص تويتر →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TWITTER SCANNER PAGE ─────────────────────────────────────────────────────
function TwitterScannerPage({ setPage, setTwitterReport }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = () => {
    if (!query.trim()) { setError("Please enter a Twitter/X handle."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setTwitterReport(MOCK_TWITTER_REPORT);
      setPage("twitter-report");
    }, 2000);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      <div className="page-pad" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <SectionLabel>TWITTER IDENTITY SCANNER</SectionLabel>
          <div style={{ direction: "rtl", textAlign: "right", marginBottom: 16 }}>
            <h2 style={{ fontFamily: arabic, fontSize: 28, color: "#fff", fontWeight: 900, marginBottom: 6 }}>فاحص هوية تويتر</h2>
            <p style={{ fontFamily: arabic, fontSize: 14, color: C.sub }}>أدخل اسم مستخدم تويتر/X للكشف عن تغييرات الهوية</p>
          </div>
          <h1 style={{ fontFamily: display, fontSize: 48, color: "#fff", letterSpacing: -1, lineHeight: 1, marginBottom: 8 }}>TWITTER SCANNER</h1>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.sub, marginBottom: 32 }}>Track username, bio, and display name changes with risk scoring.</p>

          <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              placeholder="@devghost_sol"
              style={{
                flex: 1, background: C.bg1, border: `1px solid ${error ? C.red : C.border}`,
                borderRight: "none", fontFamily: mono, fontSize: 13, color: "#fff",
                padding: "14px 20px", outline: "none",
              }}
            />
            <button onClick={handleScan} disabled={loading} style={{
              background: loading ? C.muted : C.red, border: "none", fontFamily: display,
              fontSize: 18, color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              padding: "14px 32px", letterSpacing: 2, display: "flex", alignItems: "center", gap: 8,
              minWidth: 120,
            }}>
              {loading ? <Spinner /> : "SCAN →"}
            </button>
          </div>
          {error && <div style={{ fontFamily: sans, fontSize: 12, color: C.red, marginBottom: 8 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── TWITTER REPORT PAGE ──────────────────────────────────────────────────────
function TwitterReportPage({ report, setPage }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const tabs = ["timeline", "flags"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      <div style={{ background: C.bg1, borderBottom: `1px solid ${C.border}`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionLabel>TWITTER IDENTITY REPORT</SectionLabel>
          <div className="report-header-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: display, fontSize: 48, color: "#fff", letterSpacing: -1, marginBottom: 4 }}>{report.handle}</div>
              <div style={{ fontFamily: sans, fontSize: 14, color: C.sub, marginBottom: 16 }}>{report.bio}</div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { label: "JOINED",    val: report.joined    },
                  { label: "FOLLOWERS", val: report.followers },
                  { label: "CHANGES",   val: report.totalChanges },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: mono, fontSize: 8, color: C.muted, letterSpacing: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: mono, fontSize: 13, color: "#fff", marginTop: 3 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <RiskGauge score={report.riskScore} size={130} />
              <Badge label={report.riskLevel} color={riskColor(report.riskScore)} />
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-row" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 40px", display: "flex" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: "none", border: "none", fontFamily: mono, fontSize: 10,
              color: activeTab === t ? "#fff" : C.muted, cursor: "pointer",
              padding: "14px 20px", letterSpacing: 1.5, textTransform: "uppercase",
              borderBottom: activeTab === t ? `2px solid ${C.red}` : "2px solid transparent",
              whiteSpace: "nowrap",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 40px" }}>
        {activeTab === "timeline" && (
          <div className="fade-in">
            <SectionLabel>IDENTITY CHANGE TIMELINE</SectionLabel>
            <div style={{ position: "relative", paddingLeft: 20, maxWidth: 700 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: C.border }} />
              {report.timeline.map((entry, i) => (
                <div key={i} style={{ position: "relative", paddingLeft: 24, paddingBottom: 24 }}>
                  <div style={{ position: "absolute", left: -4, top: 5, width: 8, height: 8, background: C.red, borderRadius: "50%" }} />
                  <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, marginBottom: 8 }}>{entry.date} · {entry.daysAgo}d ago</div>
                  <div style={{ background: C.bg1, border: `1px solid ${C.border}`, padding: "14px 18px" }}>
                    {entry.changes.map((c, j) => (
                      <div key={j} style={{ marginBottom: j < entry.changes.length - 1 ? 10 : 0 }}>
                        <Badge label={c.type} color={changeColor(c.risk)} small />
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                          <span style={{ fontFamily: mono, fontSize: 12, color: C.muted, textDecoration: "line-through" }}>{c.from}</span>
                          <span style={{ color: C.red, fontFamily: mono }}>→</span>
                          <span style={{ fontFamily: mono, fontSize: 12, color: "#fff" }}>{c.to}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.bg3}` }}>
                      {entry.context}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "flags" && (
          <div className="fade-in">
            <SectionLabel>RISK FLAGS</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 700 }}>
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

        {activeTab === "wallets" && (
          <div className="fade-in">
            <SectionLabel>WALLETS LINKED TO THIS IDENTITY</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 700 }}>
              {report.linkedWallets.map((w, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", background: C.bg1, border: `1px solid ${C.border}`,
                  flexWrap: "wrap", gap: 8,
                }}>
                  <span style={{ fontFamily: mono, fontSize: 13, color: "#fff" }}>{w}</span>
                  <button onClick={() => setPage("search")} style={{
                    background: "none", border: `1px solid ${C.border}`, fontFamily: mono,
                    fontSize: 9, color: C.dim, cursor: "pointer", padding: "5px 12px", letterSpacing: 1,
                  }}>VIEW REPORT →</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="footer-pad" style={{ borderTop: `1px solid ${C.border}`, padding: "20px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <button onClick={() => setPage("twitter")} style={{
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

// ─── WALLET REPORT PAGE ───────────────────────────────────────────────────────
function ReportPage({ report, setPage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["overview", "tokens", "cluster", "social"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      <div style={{ background: C.bg1, borderBottom: `1px solid ${C.border}`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionLabel>WALLET INTELLIGENCE REPORT</SectionLabel>
          <div className="report-header-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start", marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: display, fontSize: 48, color: "#fff", letterSpacing: -1, marginBottom: 6 }}>{report.twitter}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, marginBottom: 20, letterSpacing: 0.5, wordBreak: "break-all" }}>{report.fullWallet}</div>
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

          <div className="key-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border }}>
            {[
              { val: report.linkedWallets,   label: "LINKED WALLETS",   color: C.orange },
              { val: `${report.ruggedTokens}/${report.totalTokensLaunched}`, label: "RUG RATE", color: C.red },
              { val: report.totalVolumeDrained, label: "VOLUME DRAINED", color: C.red    },
              { val: report.flags.length,    label: "ACTIVE FLAGS",      color: C.yellow },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg, padding: "18px 20px" }}>
                <div style={{ fontFamily: display, fontSize: 30, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs-row" style={{ borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 40px", display: "flex" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: "none", border: "none", fontFamily: mono, fontSize: 10,
              color: activeTab === t ? "#fff" : C.muted, cursor: "pointer",
              padding: "14px 20px", letterSpacing: 1.5, textTransform: "uppercase",
              borderBottom: activeTab === t ? `2px solid ${C.red}` : "2px solid transparent",
              whiteSpace: "nowrap",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 40px" }}>
        {activeTab === "overview" && (
          <div className="fade-in">
            <SectionLabel>RED FLAGS DETECTED</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 860 }}>
              {report.flags.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 20px",
                  background: C.bg1, borderLeft: `3px solid ${severityColor(f.severity)}`,
                  flexWrap: "wrap",
                }}>
                  <Badge label={f.severity.toUpperCase()} color={severityColor(f.severity)} small />
                  <div style={{ flex: 1, minWidth: 200 }}>
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
            <div style={{ background: C.border, padding: 1, overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px 90px", gap: 12, padding: "10px 20px", background: C.bg1, minWidth: 400 }}>
                {["TOKEN", "DATE", "RAISED", "DAYS", "STATUS"].map(h => (
                  <div key={h} style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: 2 }}>{h}</div>
                ))}
              </div>
              {report.tokenHistory.map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px 90px", gap: 12, padding: "14px 20px", background: C.bg, alignItems: "center", borderTop: `1px solid ${C.border}`, minWidth: 400 }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 12, color: "#fff" }}>{t.name}</div>
                    <div style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>${t.symbol}</div>
                  </div>
                  <div style={{ fontFamily: sans, fontSize: 12, color: C.muted }}>{t.date}</div>
                  <div style={{ fontFamily: display, fontSize: 18, color: "#fff" }}>{t.raised}</div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 1, overflowX: "auto" }}>
              {report.walletCluster.map((w, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 90px 120px",
                  gap: 12, padding: "14px 20px", background: C.bg1, alignItems: "center",
                  borderLeft: `3px solid ${w.role === "PRIMARY" ? "#fff" : roleColor(w.role)}`,
                  minWidth: 300,
                }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: "#fff", overflow: "hidden", textOverflow: "ellipsis" }}>{w.address}</span>
                  <Badge label={w.role} color={roleColor(w.role)} small />
                  <span style={{ fontFamily: display, fontSize: 16, color: "#fff", textAlign: "right" }}>{w.balance}</span>
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

      <div className="footer-pad" style={{ borderTop: `1px solid ${C.border}`, padding: "20px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
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

// ─── ABOUT PAGE ────────────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      id: "what",
      titleAr: "ما هو WHODEV؟",
      titleEn: "What is WHODEV?",
      contentAr: `WHODEV منصة استخباراتية مفتوحة مبنية لنظام سولانا. هدفنا هو منح المستثمرين الأفراد نفس الرؤية على السلسلة التي يستخدمها المحترفون.

نجمع البيانات من بلوكتشين سولانا وواجهات برمجية متعددة لبناء ملفات مخاطر شاملة. كل مسح ينتج تقريراً منظماً بدرجة مخاطر وسلوكيات مُبلَّغ عنها وخريطة للمحافظ المرتبطة.`,
      content: `WHODEV is an open intelligence platform built for the Solana ecosystem. Our goal is to give retail investors the same on-chain visibility that sophisticated funds and experienced traders use internally.

We aggregate data from the Solana blockchain, Helius RPC, DAS API, and social identity layers to build comprehensive risk profiles of anonymous developers and wallets.`,
    },
    {
      id: "twitter",
      titleAr: "فاحص تويتر — كيف يعمل؟",
      titleEn: "Twitter Username Tracker — How It Works",
      contentAr: `يُعدّ فاحص هوية تويتر/X أحد أقوى أدوات WHODEV. المطورون المجهولون يغيرون أسماءهم بعد كل عملية احتيال.

نظامنا:
1. يؤرشف كل اسم مستخدم وسيرة ذاتية على فترات منتظمة
2. يكتشف التغييرات في دقائق
3. يربط تغييرات الهوية بالنشاط على السلسلة
4. يُقيِّم تواتر التغييرات ونمطها`,
      content: `The Twitter/X Identity Scanner is one of WHODEV's most powerful tools. Anonymous developers frequently change their username to escape reputational damage after a rug.

Our system archives every public username, display name, and bio at regular intervals and detects changes within minutes of them occurring.`,
    },
    {
      id: "risk",
      titleAr: "كيف تُحسَب درجات المخاطر؟",
      titleEn: "How Risk Scores Are Calculated",
      content: `Risk Scores (0–100) are computed by a weighted model:

ON-CHAIN SIGNALS (50%) — Token launch frequency, LP removal patterns, wallet funding source.
SOCIAL SIGNALS (25%) — Username change frequency, bio scrubbing patterns.
CLUSTER SIGNALS (15%) — Number of linked wallets, shared funding sources.
REPUTATION SIGNALS (10%) — Community reports and cross-platform mentions.

Scores above 75 are flagged HIGH, above 85 are CRITICAL.`,
    },
    {
      id: "roadmap",
      titleAr: "خريطة الطريق",
      titleEn: "Roadmap",
      content: `Q2 2025 — LAUNCHED
✓ Wallet Intelligence Scanner (demo)
✓ Twitter Username Tracker (demo)
✓ Risk Scoring v1

Q3 2025 — IN PROGRESS
◈ Telegram & Discord alert bot
◈ Real-time data pipeline (live)
◈ API access for power users

Q4 2025 — PLANNED
◈ Browser extension
◈ Pump.fun and Raydium integration
◈ Mobile app`,
    },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
      <div className="page-pad" style={{ maxWidth: 1140, margin: "0 auto", padding: "60px 40px" }}>
        <SectionLabel>PROJECT DOCUMENTATION</SectionLabel>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 60, alignItems: "start" }}>
          <div>
            <div style={{ direction: "rtl", textAlign: "right", marginBottom: 12 }}>
              <h1 style={{ fontFamily: arabic, fontSize: 40, color: "#fff", fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
                حول <span style={{ color: C.red }}>WHODEV</span>
              </h1>
            </div>
            <h2 style={{ fontFamily: display, fontSize: 56, color: "#fff", letterSpacing: -1, lineHeight: 1, marginBottom: 20 }}>
              ABOUT<br /><span style={{ color: C.red }}>WHODEV</span>
            </h2>
            <p style={{ fontFamily: arabic, fontSize: 14, color: C.sub, lineHeight: 2, marginBottom: 8, direction: "rtl", textAlign: "right" }}>
              WHODEV منصة استخباراتية للكشف عن مطوري سولانا المجهولين واكتشاف الاحتيال وتتبع تغييرات الهوية.
            </p>
            <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
              Built for degens, by people who got rugged.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {sections.map(s => (
                <div key={s.id} style={{ background: C.bg1, border: `1px solid ${C.border}` }}>
                  <button
                    onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
                    style={{
                      width: "100%", background: "none", border: "none", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "18px 24px",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      {s.titleAr && <div style={{ fontFamily: arabic, fontSize: 13, color: "#fff", fontWeight: 700, direction: "rtl", textAlign: "right", marginBottom: 2 }}>{s.titleAr}</div>}
                      <div style={{ fontFamily: mono, fontSize: 11, color: C.muted, letterSpacing: 0.5 }}>{s.titleEn}</div>
                    </div>
                    <span style={{ fontFamily: mono, fontSize: 16, color: openSection === s.id ? C.red : C.muted, transition: "transform 0.2s", transform: openSection === s.id ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 12 }}>+</span>
                  </button>
                  {openSection === s.id && (
                    <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${C.border}` }} className="fade-in">
                      <div style={{ paddingTop: 16 }}>
                        {s.contentAr && (
                          <div style={{ direction: "rtl", textAlign: "right", marginBottom: 16 }}>
                            {s.contentAr.split("\n").map((line, i) => (
                              line.trim() === "" ? <div key={i} style={{ height: 8 }} /> :
                              <div key={i} style={{ fontFamily: arabic, fontSize: 13, color: C.sub, lineHeight: 1.9 }}>{line}</div>
                            ))}
                          </div>
                        )}
                        {s.content && s.content.split("\n").map((line, i) => (
                          line.trim() === "" ? <div key={i} style={{ height: 8 }} /> :
                          <div key={i} style={{ fontFamily: line.startsWith("—") || line.startsWith("✓") || line.startsWith("◈") ? mono : sans, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "sticky", top: 80 }}>
            <Card style={{ marginBottom: 12 }}>
              <SectionLabel>إجراءات سريعة / QUICK ACTIONS</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => setPage("search")} style={{
                  background: C.red, border: "none", fontFamily: arabic, fontSize: 16,
                  color: "#fff", cursor: "pointer", padding: "12px 20px", fontWeight: 700, textAlign: "right", direction: "rtl",
                }}>افحص محفظة ←</button>
                <button onClick={() => setPage("twitter")} style={{
                  background: C.bg2, border: `1px solid ${C.border}`, fontFamily: display, fontSize: 18,
                  color: "#fff", cursor: "pointer", padding: "12px 20px", letterSpacing: 1, textAlign: "left",
                }}>TWITTER SCANNER →</button>
              </div>
            </Card>

            {/* Follow Builder Card */}
            <a
              href="https://x.com/Khloud132"
              target="_blank"
              rel="noopener noreferrer"
              className="follow-btn"
              style={{
                display: "block", background: "#0d0d0d",
                border: `2px solid ${C.red}`,
                padding: "20px", marginBottom: 12, textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={C.red}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span style={{ fontFamily: mono, fontSize: 9, color: C.red, letterSpacing: 2 }}>FOLLOW THE BUILDER</span>
              </div>
              <div style={{ fontFamily: arabic, fontSize: 16, color: "#fff", fontWeight: 900, direction: "rtl", textAlign: "right", marginBottom: 4 }}>
                تابع المطور @Khloud132
              </div>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>
                For updates, new features & announcements
              </div>
              <div style={{ marginTop: 12, background: C.red, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ fontFamily: arabic, fontSize: 13, color: "#fff", fontWeight: 700 }}>تابع الآن على X</span>
              </div>
            </a>

            <Card style={{ marginBottom: 12 }}>
              <SectionLabel>حالة المشروع / STATUS</SectionLabel>
              {[
                { label: "المنصة / Platform",        val: "DEMO",    color: C.orange },
                { label: "البيانات / Data",            val: "MOCK",    color: C.orange },
                { label: "محرك المخاطر / Risk Engine", val: "v1.0",    color: C.green  },
                { label: "التنبيهات المباشرة",         val: "Q3 2025", color: C.muted  },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: arabic, fontSize: 11, color: C.sub }}>{item.label}</span>
                  <Badge label={item.val} color={item.color} small />
                </div>
              ))}
            </Card>

            <Card>
              <SectionLabel>تنبيه / DISCLAIMER</SectionLabel>
              <p style={{ fontFamily: arabic, fontSize: 12, color: C.muted, lineHeight: 1.9, direction: "rtl", textAlign: "right" }}>
                WHODEV حالياً في وضع العرض التجريبي. جميع نتائج المسح تستخدم بيانات وهمية لأغراض العرض فقط.
                لا تتخذ قرارات مالية بناءً على هذا العرض.
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
