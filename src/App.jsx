import { useState, useEffect } from "react";

// ─── FONTS & GLOBAL STYLES ────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Cairo:wght@400;600;700;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #000; color: #fff; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
input::placeholder { color: #383838; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }

@keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
@keyframes fadeIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin    { to{transform:rotate(360deg)} }
@keyframes ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(230,48,48,0.55)} 50%{box-shadow:0 0 0 8px rgba(230,48,48,0)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

.fade-in  { animation: fadeIn .35s ease forwards; }
.glow-btn { animation: glow 2.2s infinite; }

/* Hover utilities */
.nav-link:hover    { color:#fff !important; }
.card-hover:hover  { border-color:#2a2a2a !important; background:#0d0d0d !important; }
.feat-hover:hover  { background:#0a0a0a !important; border-color:#2a2a2a !important; }
.link-hover:hover  { color:#fff !important; }

/* ── RESPONSIVE ── */
@media (max-width:900px) {
  .hero-grid      { grid-template-columns:1fr !important; }
  .about-grid     { grid-template-columns:1fr !important; }
  .features-grid  { grid-template-columns:repeat(2,1fr) !important; }
  .tg-grid        { grid-template-columns:1fr !important; gap:32px !important; }
}
@media (max-width:768px) {
  .nav-links        { display:none !important; }
  .nav-mobile-menu  { display:flex !important; }
  .report-hdr       { grid-template-columns:1fr !important; }
  .key-stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
  .tabs-row         { overflow-x:auto !important; }
  .alert-wallet     { display:none !important; }
  .hero-pad         { padding:56px 20px 48px !important; }
  .page-pad         { padding:48px 20px !important; }
  .section-x        { padding-left:20px !important; padding-right:20px !important; }
  .footer-inner     { flex-direction:column !important; gap:32px !important; }
  .footer-top       { flex-direction:column !important; align-items:flex-start !important; gap:24px !important; }
  .follow-banner    { flex-direction:column !important; align-items:flex-start !important; padding:20px !important; gap:16px !important; }
  .modal-inner      { padding:28px 20px !important; }
  .modal-h1         { font-size:38px !important; }
  .modal-btns       { flex-direction:column !important; }
  .tg-preview       { display:none !important; }
}
@media (max-width:500px) {
  .features-grid    { grid-template-columns:1fr !important; }
  .key-stats-grid   { grid-template-columns:1fr 1fr !important; }
}
`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [v, setV] = useState(() => typeof window !== "undefined" ? window.innerWidth <= 768 : false);
  useEffect(() => {
    const h = () => setV(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return v;
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  red:"#e63030", orange:"#f97316", yellow:"#eab308", green:"#22c55e", blue:"#3b82f6", teal:"#14b8a6",
  bg:"#000", bg1:"#070707", bg2:"#0e0e0e", bg3:"#151515", bg4:"#1a1a1a",
  border:"#1e1e1e", border2:"#242424", muted:"#3a3a3a", dim:"#555", sub:"#777", mid:"#999",
};
const riskColor     = s => s >= 80 ? C.red    : s >= 60 ? C.orange  : s >= 40 ? C.yellow : C.green;
const sevColor      = s => s === "critical" ? C.red : s === "high" ? C.orange : s === "medium" ? C.yellow : C.green;
const changeRiskCol = r => r === "high" ? C.red : r === "medium" ? C.orange : C.dim;
const statusCol     = s => s === "RUGGED" ? C.red : C.green;
const roleCol       = r => ({ PRIMARY:"#fff", SNIPER:C.orange, DUMP:C.red, MIXER:C.sub })[r] || "#fff";

const mono    = "'Space Mono', monospace";
const sans    = "'DM Sans', sans-serif";
const display = "'Bebas Neue', sans-serif";
const arabic  = "'Cairo', sans-serif";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_WALLET = {
  wallet:"7xKX...m9Qp", fullWallet:"7xKXf3aB2mNpQr8vLt4wYsZhCdEgFjKm9Qp",
  twitter:"@devghost_sol", riskScore:87, riskLevel:"CRITICAL",
  lastSeen:"2 min ago", firstActivity:"Nov 14, 2023",
  totalTokensLaunched:23, ruggedTokens:19, linkedWallets:7, totalVolumeDrained:"$2.4M",
  flags:[
    { severity:"critical", label:"Stealth dump detected",       detail:"Sold 94% of holdings 3 min before public announcement" },
    { severity:"critical", label:"Liquidity removal",           detail:"Pulled LP within 48hrs on 17 of 23 tokens launched" },
    { severity:"high",     label:"Multi-wallet coordination",   detail:"7 wallets funded from the same CEX withdrawal batch" },
    { severity:"high",     label:"Identity masking",            detail:"Username changed 4× in last 30 days to evade reputation" },
    { severity:"medium",   label:"Sniper coordination",         detail:"Linked wallets consistently buy <3s after every launch" },
    { severity:"medium",   label:"Wash trading",                detail:"Circular transactions detected between wallet cluster" },
  ],
  tokenHistory:[
    { name:"MOONPIG",    symbol:"MOONPIG", date:"Apr 28, 2025", raised:"$340K", status:"RUGGED", daysLive:2   },
    { name:"SolAI Agent",symbol:"SOLAI",   date:"Apr 15, 2025", raised:"$890K", status:"RUGGED", daysLive:5   },
    { name:"DegenBoss",  symbol:"DBOSS",   date:"Mar 22, 2025", raised:"$120K", status:"RUGGED", daysLive:1   },
    { name:"PumpKing",   symbol:"PKING",   date:"Feb 08, 2025", raised:"$560K", status:"RUGGED", daysLive:3   },
    { name:"NovaDEX",    symbol:"NOVA",    date:"Jan 12, 2025", raised:"$210K", status:"ACTIVE", daysLive:109 },
  ],
  walletCluster:[
    { address:"7xKX...m9Qp", role:"PRIMARY", funded:"Binance CEX",    balance:"12.4 SOL" },
    { address:"3mNp...k7Wq", role:"SNIPER",  funded:"Primary wallet", balance:"0.8 SOL"  },
    { address:"9rTz...v2Xs", role:"SNIPER",  funded:"Primary wallet", balance:"1.2 SOL"  },
    { address:"4hLm...n5Yt", role:"DUMP",    funded:"Primary wallet", balance:"0.1 SOL"  },
    { address:"8wQs...p3Rz", role:"DUMP",    funded:"Primary wallet", balance:"0.3 SOL"  },
    { address:"2kBv...f8Mn", role:"MIXER",   funded:"Unknown",        balance:"45.2 SOL" },
    { address:"6jCx...h1Pk", role:"MIXER",   funded:"Unknown",        balance:"31.7 SOL" },
  ],
  socialHistory:[
    { date:"Apr 29, 2025", type:"USERNAME", from:"@soldev_official", to:"@devghost_sol"  },
    { date:"Apr 12, 2025", type:"BIO",      from:"Building the future of DeFi 🚀", to:"Solana builder | stealth mode" },
    { date:"Mar 30, 2025", type:"USERNAME", from:"@pumpalpha_dev", to:"@soldev_official" },
    { date:"Mar 01, 2025", type:"USERNAME", from:"@cryptoking_sol", to:"@pumpalpha_dev"  },
  ],
};

const MOCK_TWITTER = {
  handle:"@devghost_sol", displayName:"DevGhost",
  bio:"Solana builder | stealth mode", joined:"Sep 2021",
  followers:"12.4K", following:"389", tweets:"2,841",
  riskScore:79, riskLevel:"HIGH",
  totalChanges:9, usernameChanges:4, bioChanges:3, displayNameChanges:2, avgDaysBetweenChanges:11,
  linkedWallets:["7xKX...m9Qp","3mNp...k7Wq"],
  timeline:[
    { date:"Apr 29, 2025", daysAgo:2,   changes:[{ type:"USERNAME", from:"@soldev_official", to:"@devghost_sol", risk:"high" }],   context:"Changed 3 days before MOONPIG launch — reputation reset pattern" },
    { date:"Apr 12, 2025", daysAgo:19,  changes:[{ type:"BIO",      from:"Building the future of DeFi 🚀", to:"Solana builder | stealth mode", risk:"medium" }], context:"Bio scrubbed after SOLAI rug — removed project references" },
    { date:"Mar 30, 2025", daysAgo:32,  changes:[{ type:"USERNAME", from:"@pumpalpha_dev", to:"@soldev_official", risk:"high" }], context:"New alias adopted after DegenBoss controversy" },
    { date:"Mar 01, 2025", daysAgo:59,  changes:[{ type:"USERNAME", from:"@cryptoking_sol", to:"@pumpalpha_dev", risk:"high" },{ type:"DISPLAYNAME", from:"CryptoKing SOL", to:"Pump Alpha Dev", risk:"medium" }], context:"Identity overhaul — original @cryptoking_sol had 3 rug complaints" },
    { date:"Jan 20, 2025", daysAgo:100, changes:[{ type:"BIO", from:"NFT Artist | Solana OG | DMs open", to:"Building the future of DeFi 🚀", risk:"low" }], context:"Shifted narrative from NFTs to DeFi ecosystem" },
  ],
  flags:[
    { severity:"high",   label:"Rapid username cycling",    detail:"4 username changes in 90 days — exceeds 99th percentile" },
    { severity:"high",   label:"Pre-launch identity reset", detail:"Username changed within 7 days before 3 separate token launches" },
    { severity:"medium", label:"Bio reputation scrubbing",  detail:"Bio updated to remove project links after each rug event" },
    { severity:"low",    label:"Narrative pivot detected",  detail:"Identity shifted from NFT to DeFi to 'stealth builder'" },
  ],
};

const LIVE_ALERTS = [
  { time:"2m ago",  wallet:"7xKX...m9Qp", event:"Stealth dump — sold 94% pre-announcement", level:"CRITICAL" },
  { time:"14m ago", wallet:"3pRt...n4Qz", event:"LP removed — $430K drained from MOONAI",    level:"CRITICAL" },
  { time:"1h ago",  wallet:"9mLk...x2Vs", event:"Username changed 3× in 24hrs",              level:"HIGH"     },
  { time:"3h ago",  wallet:"4nBw...k8Ym", event:"SOLBOSS launch — 6 linked wallets sniping", level:"HIGH"     },
  { time:"5h ago",  wallet:"2zQp...f7Tr", event:"Cluster identified — 9 wallets, same CEX",  level:"MEDIUM"   },
];

const FEATURES = [
  { icon:"◈", en:"Wallet Intelligence",  ar:"استخبارات المحفظة",     descEn:"Deep on-chain analysis — transaction tracing, funding sources, and distribution patterns." },
  { icon:"⚠", en:"Rugpull Detection",    ar:"كشف الاحتيال",           descEn:"Identifies stealth dumps, LP removals, sniper coordination before you lose." },
  { icon:"◉", en:"Social Identity Link", ar:"ربط الهوية الاجتماعية", descEn:"Connects wallets to Twitter/X identities via OSINT and behavioral matching." },
  { icon:"⟳", en:"Username Tracker",     ar:"تتبع أسماء المستخدمين", descEn:"Full history of every username, bio, and display name change with risk scoring." },
  { icon:"◌", en:"Wallet Fingerprint",   ar:"بصمة المحفظة",           descEn:"Reveals clusters controlled by the same entity via timing and funding paths." },
  { icon:"▲", en:"Risk Scoring",         ar:"تقييم المخاطر",          descEn:"Dynamic scores built from combined on-chain and social signals, auto-updated." },
  { icon:"◆", en:"Real-Time Alerts",     ar:"تنبيهات فورية",          descEn:"Instant push to Telegram and Discord when suspicious activity is detected." },
  { icon:"⬡", en:"24/7 Autonomous Scan", ar:"مسح مستمر 24/7",        descEn:"Runs continuously — scanning, correlating, alerting across all layers." },
];

// ─── ICON COMPONENTS ──────────────────────────────────────────────────────────
function XIcon({ size = 14, fill = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={{ flexShrink:0 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function TgIcon({ size = 14, fill = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={{ flexShrink:0 }}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

// ─── SHARED UI ATOMS ──────────────────────────────────────────────────────────
function Badge({ label, color = C.red, small }) {
  return (
    <span style={{ fontFamily:mono, fontSize:small?9:10, color, letterSpacing:1.5, fontWeight:700,
      background:color+"18", padding:small?"2px 8px":"3px 10px", border:`1px solid ${color}30`, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}
function SectionLabel({ children, color = C.red }) {
  return <div style={{ fontFamily:mono, fontSize:9, color, letterSpacing:3.5, marginBottom:14, textTransform:"uppercase" }}>{children}</div>;
}
function Divider({ style }) {
  return <div style={{ height:1, background:C.border, ...style }} />;
}
function Card({ children, style }) {
  return <div className="card-hover" style={{ background:C.bg1, border:`1px solid ${C.border}`, transition:"all .2s", ...style }}>{children}</div>;
}
function Spinner() {
  return <div style={{ width:18, height:18, border:`2px solid ${C.border}`, borderTop:`2px solid ${C.red}`,
    borderRadius:"50%", animation:"spin .75s linear infinite", flexShrink:0 }} />;
}
function RiskGauge({ score, size = 140 }) {
  const r = 46, circ = 2*Math.PI*r, filled = (score/100)*circ*0.75, color = riskColor(score);
  const cx = size/2, cy = size*.6;
  return (
    <div style={{ position:"relative", width:size, height:size*.75 }}>
      <svg width={size} height={size*.75} style={{ transform:"rotate(135deg)", display:"block" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg3} strokeWidth="7" strokeDasharray={`${circ*.75} ${circ}`} strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7" strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", filter:`drop-shadow(0 0 6px ${color}99)` }}/>
      </svg>
      <div style={{ position:"absolute", top:"28%", left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
        <div style={{ fontFamily:display, fontSize:size*.27, color, lineHeight:1 }}>{score}</div>
        <div style={{ fontFamily:mono, fontSize:8, color:C.muted, letterSpacing:2, marginTop:2 }}>RISK</div>
      </div>
    </div>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["MOONPIG rugged $340K","7xKX...m9Qp flagged CRITICAL","SOLAI LP removed $890K","@devghost_sol — 4 username changes","New cluster: 7 wallets same origin","DBOSS rug confirmed in 24hrs"];
  const text = items.join("   ◆   ");
  return (
    <div style={{ background:C.red, overflow:"hidden", height:26, display:"flex", alignItems:"center" }}>
      <div style={{ display:"flex", whiteSpace:"nowrap", animation:"ticker 45s linear infinite" }}>
        {[text, text].map((t, i) => (
          <span key={i} style={{ fontFamily:mono, fontSize:9.5, color:"#000", fontWeight:700, letterSpacing:1.5, paddingRight:80 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label:"HOME",           key:"home"    },
    { label:"TWITTER SCANNER",key:"twitter" },
    { label:"ALERTS",         key:"alerts"  },
    { label:"ABOUT",          key:"about"   },
  ];
  return (
    <>
      <nav style={{ background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`, height:54, position:"sticky", top:0, zIndex:200 }}>
        <div className="section-x" style={{ padding:"0 40px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"100%", maxWidth:1180, margin:"0 auto" }}>

          {/* Logo */}
          <button onClick={() => { setPage("home"); setMenuOpen(false); }}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"baseline", gap:1, padding:0 }}>
            <span style={{ fontFamily:display, fontSize:22, color:"#fff", letterSpacing:2.5 }}>WHO</span>
            <span style={{ fontFamily:display, fontSize:22, color:C.red, letterSpacing:2.5 }}>DEV</span>
          </button>

          {/* Desktop nav */}
          <div className="nav-links" style={{ display:"flex", alignItems:"center", gap:2 }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => setPage(item.key)} className="nav-link"
                style={{ background:page===item.key ? C.bg3:"none",
                  border:`1px solid ${page===item.key ? C.border2:"transparent"}`,
                  fontFamily:mono, fontSize:9.5, color:page===item.key ? "#fff":C.dim,
                  cursor:"pointer", padding:"6px 14px", letterSpacing:1.8, transition:"all .15s" }}>
                {item.label}
              </button>
            ))}
            <div style={{ width:1, height:20, background:C.border, margin:"0 8px" }} />
            <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:6, background:C.bg3,
                border:`1px solid ${C.border2}`, padding:"6px 13px", textDecoration:"none",
                fontFamily:mono, fontSize:9.5, color:"#ccc", letterSpacing:1 }}>
              <XIcon size={10} fill="#ccc"/><span>@whodevxyz</span>
            </a>
            <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer" className="glow-btn"
              style={{ display:"flex", alignItems:"center", gap:6, background:C.red,
                padding:"6px 13px", textDecoration:"none",
                fontFamily:mono, fontSize:9.5, color:"#fff", letterSpacing:1 }}>
              <XIcon size={10} fill="#fff"/>BUILDER
            </a>
            <button onClick={() => setPage("search")}
              style={{ background:C.red, border:"none", fontFamily:display, fontSize:17,
                color:"#fff", cursor:"pointer", padding:"7px 20px", letterSpacing:2, marginLeft:4 }}>
              SCAN →
            </button>
          </div>

          {/* Mobile */}
          <div className="nav-mobile-menu" style={{ display:"none", alignItems:"center", gap:8 }}>
            <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:5, background:C.bg3,
                border:`1px solid ${C.border}`, padding:"5px 10px", textDecoration:"none",
                fontFamily:mono, fontSize:9, color:"#ccc" }}>
              <XIcon size={9} fill="#ccc"/>@whodevxyz
            </a>
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background:"none", border:`1px solid ${C.border}`, color:"#fff",
                cursor:"pointer", padding:"6px 10px", fontFamily:mono, fontSize:14, lineHeight:1 }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ background:C.bg1, borderBottom:`1px solid ${C.border}` }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => { setPage(item.key); setMenuOpen(false); }}
                style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none",
                  fontFamily:mono, fontSize:10, color:page===item.key?"#fff":C.sub,
                  cursor:"pointer", padding:"12px 20px", borderBottom:`1px solid ${C.border}`, letterSpacing:1.5 }}>
                {item.label}
              </button>
            ))}
            <button onClick={() => { setPage("search"); setMenuOpen(false); }}
              style={{ display:"block", width:"100%", textAlign:"center", background:C.red,
                border:"none", fontFamily:display, fontSize:18, color:"#fff", cursor:"pointer", padding:"14px 20px", letterSpacing:2 }}>
              SCAN A WALLET →
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── ONBOARDING MODAL ─────────────────────────────────────────────────────────
function OnboardingModal({ onClose }) {
  const steps = [
    { icon:"◈", en:"Paste a wallet or handle",    ar:"الصق محفظة أو حساباً",    descEn:"Input any Solana wallet address or Twitter/X username to begin a deep intelligence scan." },
    { icon:"⟳", en:"We trace the full identity",  ar:"نتتبع الهوية كاملة",       descEn:"Cross-references on-chain transactions, token launches, and social identity history in real-time." },
    { icon:"▲", en:"Receive a risk report",        ar:"احصل على تقرير المخاطر",   descEn:"Structured report with a risk score, flagged behaviours, and linked wallet clusters." },
    { icon:"◆", en:"Get Telegram alerts",          ar:"تلقَّ تنبيهات تيليغرام",   descEn:"Subscribe to @WhoDevBot and get instant alerts when tracked wallets take suspicious actions." },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.94)", backdropFilter:"blur(10px)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div className="fade-in modal-inner" style={{ background:C.bg1, border:`1px solid ${C.border}`,
        maxWidth:560, width:"100%", padding:"40px 40px", maxHeight:"90vh", overflowY:"auto" }}>

        <div style={{ marginBottom:24 }}>
          <SectionLabel>WELCOME TO WHODEV</SectionLabel>
          <h2 className="modal-h1" style={{ fontFamily:display, fontSize:50, color:"#fff", lineHeight:.93, marginBottom:8, letterSpacing:-1 }}>
            SOLANA<br/>INTELLIGENCE<br/><span style={{ color:C.red }}>PLATFORM</span>
          </h2>
          <p style={{ fontFamily:arabic, fontSize:13, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:14 }}>منصة استخبارات سولانا</p>
          <p style={{ fontFamily:sans, fontSize:13.5, color:C.sub, lineHeight:1.75 }}>
            WHODEV unmasks anonymous Solana developers, detects rugpull patterns, and tracks identity changes — before you invest.
          </p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:2, marginBottom:20 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", background:C.bg2,
              padding:"14px 18px", borderLeft:`2px solid ${C.border2}`, cursor:"default" }}
              onMouseEnter={e => e.currentTarget.style.borderColor=C.red}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border2}>
              <div style={{ fontFamily:display, fontSize:22, color:C.red, minWidth:22, marginTop:1 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:mono, fontSize:11, color:"#fff", letterSpacing:0.5, marginBottom:2, fontWeight:700 }}>{s.en}</div>
                <div style={{ fontFamily:arabic, fontSize:11, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:6 }}>{s.ar}</div>
                <div style={{ fontFamily:sans, fontSize:12.5, color:C.sub, lineHeight:1.65 }}>{s.descEn}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Telegram CTA */}
        <a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            background:"#0a0f1a", border:`1px solid #2563eb33`, padding:"14px 18px", marginBottom:14, textDecoration:"none", gap:12 }}>
          <div>
            <div style={{ fontFamily:mono, fontSize:10, color:"#93c5fd", letterSpacing:1, marginBottom:3 }}>GET INSTANT ALERTS ON TELEGRAM</div>
            <div style={{ fontFamily:arabic, fontSize:11.5, color:C.dim, direction:"rtl" }}>اشترك في بوت التنبيهات الفورية</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, background:"#2563eb", padding:"9px 16px", flexShrink:0 }}>
            <TgIcon size={13} fill="#fff"/>
            <span style={{ fontFamily:mono, fontSize:9.5, color:"#fff", letterSpacing:1 }}>@WhoDevBot</span>
          </div>
        </a>

        {/* Follow Builder */}
        <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            background:"#0d0000", border:`1px solid ${C.red}30`, padding:"12px 18px", marginBottom:18, textDecoration:"none", gap:12 }}>
          <div>
            <div style={{ fontFamily:mono, fontSize:10, color:"#fff", letterSpacing:1, marginBottom:2 }}>FOLLOW THE BUILDER FOR UPDATES</div>
            <div style={{ fontFamily:arabic, fontSize:11.5, color:C.sub, direction:"rtl" }}>تابع المطور لآخر التحديثات</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, background:C.red, padding:"9px 16px", flexShrink:0 }}>
            <XIcon size={13} fill="#fff"/>
            <span style={{ fontFamily:mono, fontSize:9.5, color:"#fff", letterSpacing:1 }}>@Khloud132</span>
          </div>
        </a>

        <div className="modal-btns" style={{ display:"flex", gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1, background:C.red, border:"none", fontFamily:display, fontSize:20,
              color:"#fff", cursor:"pointer", padding:"14px 24px", letterSpacing:2 }}>START SCANNING</button>
          <button onClick={onClose}
            style={{ background:"none", border:`1px solid ${C.border}`, fontFamily:mono, fontSize:9.5,
              color:C.dim, cursor:"pointer", padding:"14px 20px", letterSpacing:1 }}>SKIP</button>
        </div>
      </div>
    </div>
  );
}

// ─── TELEGRAM ALERTS PAGE ─────────────────────────────────────────────────────
function AlertsPage({ setPage }) {
  const [tgStep, setTgStep] = useState(0); // 0=intro, 1=setup, 2=confirm, 3=done
  const [inputVal, setInputVal] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [watchlist, setWatchlist] = useState(["7xKX...m9Qp", "3pRt...n4Qz"]);

  const alertTypes = [
    { icon:"🔴", label:"Stealth Dumps",         desc:"Instant alert when a tracked wallet sells >70% of holdings",              active:true  },
    { icon:"🟠", label:"LP Removals",            desc:"Alert when liquidity is pulled from a token within 72 hours of launch",   active:true  },
    { icon:"🟡", label:"Cluster Activity",       desc:"Notify when 3+ linked wallets coordinate a buy within a 30s window",    active:true  },
    { icon:"🔵", label:"Username Changes",       desc:"Track every identity change on linked Twitter/X accounts",               active:false },
    { icon:"⚪", label:"New Token Launches",      desc:"Alert when a tracked wallet deploys a new token contract",               active:false },
    { icon:"🟢", label:"Risk Score Updates",     desc:"Notify when a wallet's risk score changes by more than 15 points",       active:false },
  ];

  const exampleAlerts = [
    { time:"12:41 PM", type:"CRITICAL", icon:"🔴", msg:"@devghost_sol sold 94% of MOONPIG holdings 3 min before tweet. Wallet: 7xKX...m9Qp", bot:"@WhoDevBot" },
    { time:"11:07 AM", type:"HIGH",     icon:"🟠", msg:"LP pulled — $430K removed from MOONAI within 2 hours. Dev: 3pRt...n4Qz",            bot:"@WhoDevBot" },
    { time:"9:28 AM",  type:"HIGH",     icon:"🟡", msg:"6 wallets sniped SOLBOSS simultaneously. Cluster origin: Binance CEX batch.",         bot:"@WhoDevBot" },
  ];

  const handleConnect = () => {
    if (!inputVal.trim()) return;
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setTgStep(3); }, 1800);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh" }} className="fade-in">
      <div className="page-pad section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"60px 40px" }}>

        <SectionLabel>REAL-TIME ALERT SYSTEM</SectionLabel>
        <div style={{ marginBottom:40 }}>
          <h1 style={{ fontFamily:display, fontSize:56, color:"#fff", letterSpacing:-1, lineHeight:.95, marginBottom:8 }}>
            TELEGRAM<br/><span style={{ color:"#3b82f6" }}>ALERTS</span>
          </h1>
          <p style={{ fontFamily:sans, fontSize:15, color:C.sub, lineHeight:1.7, maxWidth:560, marginBottom:4 }}>
            Get instant Telegram notifications when tracked wallets execute suspicious on-chain actions, identity changes, or rug patterns.
          </p>
          <p style={{ fontFamily:arabic, fontSize:13, color:C.dim, direction:"rtl", textAlign:"right" }}>
            تلقَّ إشعارات فورية عبر تيليغرام عند اكتشاف نشاط مشبوه
          </p>
        </div>

        <div className="tg-grid" style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:40, alignItems:"start" }}>

          {/* LEFT — Setup flow */}
          <div>
            {/* Step indicator */}
            <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28 }}>
              {["Start Bot","Add Wallet","Confirm","Done"].map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%",
                      background:tgStep >= i ? (tgStep === i ? C.blue : C.bg3) : C.bg2,
                      border:`2px solid ${tgStep >= i ? (tgStep===i?"#3b82f6":C.border2):C.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:mono, fontSize:10, color:tgStep>=i?"#fff":C.dim }}>
                      {tgStep > i ? "✓" : i+1}
                    </div>
                    <div style={{ fontFamily:mono, fontSize:8, color:tgStep===i?"#fff":C.dim, letterSpacing:1, marginTop:4, whiteSpace:"nowrap" }}>{s}</div>
                  </div>
                  {i < 3 && <div style={{ height:2, width:40, background:tgStep>i?C.blue:C.border, margin:"0 4px", marginBottom:18, flexShrink:0 }}/>}
                </div>
              ))}
            </div>

            {/* Step 0 */}
            {tgStep === 0 && (
              <Card style={{ padding:"28px 28px" }} className="fade-in">
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ width:44, height:44, background:"#2563eb22", border:"1px solid #2563eb33", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <TgIcon size={22} fill="#3b82f6"/>
                  </div>
                  <div>
                    <div style={{ fontFamily:mono, fontSize:12, color:"#fff", letterSpacing:0.5, marginBottom:2 }}>STEP 1 — OPEN THE BOT</div>
                    <div style={{ fontFamily:arabic, fontSize:11, color:C.dim }}>افتح البوت في تيليغرام</div>
                  </div>
                </div>
                <p style={{ fontFamily:sans, fontSize:13.5, color:C.sub, lineHeight:1.75, marginBottom:20 }}>
                  Open our Telegram bot <span style={{ color:"#93c5fd", fontFamily:mono }}>@WhoDevBot</span> and send the command{" "}
                  <span style={{ background:C.bg3, padding:"2px 8px", fontFamily:mono, fontSize:12, color:"#fff" }}>/start</span> to begin.
                </p>
                <div style={{ background:C.bg2, border:`1px solid ${C.border}`, padding:"14px 18px", marginBottom:20 }}>
                  <div style={{ fontFamily:mono, fontSize:9, color:C.dim, letterSpacing:2, marginBottom:8 }}>BOT COMMAND</div>
                  <div style={{ fontFamily:mono, fontSize:14, color:"#60a5fa" }}>/start</div>
                </div>
                <p style={{ fontFamily:sans, fontSize:12.5, color:C.dim, lineHeight:1.7, marginBottom:24 }}>
                  The bot will send you a unique <strong style={{ color:"#fff" }}>verification code</strong>. You'll enter it in the next step to link your account.
                </p>
                <div style={{ display:"flex", gap:10 }}>
                  <a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer"
                    style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      background:"#2563eb", padding:"13px 20px", textDecoration:"none" }}>
                    <TgIcon size={16} fill="#fff"/>
                    <span style={{ fontFamily:display, fontSize:18, color:"#fff", letterSpacing:2 }}>OPEN @WhoDevBot</span>
                  </a>
                  <button onClick={() => setTgStep(1)}
                    style={{ background:C.bg3, border:`1px solid ${C.border}`, fontFamily:mono, fontSize:10,
                      color:C.sub, cursor:"pointer", padding:"13px 20px", letterSpacing:1 }}>
                    NEXT →
                  </button>
                </div>
              </Card>
            )}

            {/* Step 1 */}
            {tgStep === 1 && (
              <Card style={{ padding:"28px 28px" }} className="fade-in">
                <div style={{ fontFamily:mono, fontSize:11, color:"#fff", letterSpacing:0.5, marginBottom:6 }}>STEP 2 — ENTER YOUR VERIFICATION CODE</div>
                <div style={{ fontFamily:arabic, fontSize:11, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:20 }}>أدخل رمز التحقق الذي أرسله البوت</div>
                <input value={inputVal} onChange={e => setInputVal(e.target.value)}
                  placeholder="Paste code from @WhoDevBot..."
                  style={{ width:"100%", background:C.bg2, border:`1px solid ${C.border}`,
                    fontFamily:mono, fontSize:13, color:"#fff", padding:"13px 16px", outline:"none", marginBottom:16 }}/>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={handleConnect} disabled={connecting}
                    style={{ flex:1, background:connecting?C.dim:"#2563eb", border:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      fontFamily:display, fontSize:18, color:"#fff", cursor:connecting?"not-allowed":"pointer", padding:"13px 20px", letterSpacing:2 }}>
                    {connecting ? <><Spinner/>LINKING...</> : "LINK ACCOUNT →"}
                  </button>
                  <button onClick={() => setTgStep(0)}
                    style={{ background:"none", border:`1px solid ${C.border}`, fontFamily:mono, fontSize:10, color:C.dim, cursor:"pointer", padding:"13px 16px", letterSpacing:1 }}>← BACK</button>
                </div>
              </Card>
            )}

            {/* Step 2 — not used in demo, skip to 3 after linking */}
            {tgStep === 3 && (
              <Card style={{ padding:"28px 28px", borderColor:"#2563eb33" }} className="fade-in">
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <div style={{ width:36, height:36, background:"#22c55e22", border:"1px solid #22c55e44", display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:display, fontSize:20, color:C.green }}>✓</div>
                  <div style={{ fontFamily:display, fontSize:24, color:C.green, letterSpacing:1 }}>TELEGRAM CONNECTED</div>
                </div>
                <p style={{ fontFamily:sans, fontSize:13.5, color:C.sub, lineHeight:1.75, marginBottom:20 }}>
                  Your account is now linked to <span style={{ color:"#93c5fd", fontFamily:mono }}>@WhoDevBot</span>.
                  You'll receive real-time alerts for any wallet in your watchlist.
                </p>
                <div style={{ fontFamily:arabic, fontSize:13, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:20 }}>
                  تم ربط حسابك — ستتلقى تنبيهات فورية لأي محفظة في قائمتك
                </div>
                <button onClick={() => setPage("search")}
                  style={{ width:"100%", background:C.red, border:"none", fontFamily:display, fontSize:20, color:"#fff", cursor:"pointer", padding:"13px 20px", letterSpacing:2 }}>
                  SCAN YOUR FIRST WALLET →
                </button>
              </Card>
            )}

            {/* Alert type toggles */}
            <div style={{ marginTop:24 }}>
              <div style={{ fontFamily:mono, fontSize:9, color:C.dim, letterSpacing:2.5, marginBottom:12 }}>ALERT TYPES</div>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {alertTypes.map((a, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    background:C.bg1, border:`1px solid ${C.border}`, padding:"12px 16px", gap:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
                      <span style={{ fontSize:14 }}>{a.icon}</span>
                      <div>
                        <div style={{ fontFamily:mono, fontSize:10.5, color:a.active?"#fff":C.sub, letterSpacing:0.5, marginBottom:2 }}>{a.label}</div>
                        <div style={{ fontFamily:sans, fontSize:11.5, color:C.dim, lineHeight:1.5 }}>{a.desc}</div>
                      </div>
                    </div>
                    <div style={{ width:34, height:18, background:a.active?"#2563eb":C.bg3,
                      border:`1px solid ${a.active?"#2563eb":C.border}`, borderRadius:9, position:"relative", flexShrink:0, cursor:"pointer" }}>
                      <div style={{ width:12, height:12, background:a.active?"#fff":C.dim, borderRadius:"50%",
                        position:"absolute", top:2, left:a.active?18:2, transition:"left .2s" }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Watchlist */}
            <div style={{ marginTop:24 }}>
              <div style={{ fontFamily:mono, fontSize:9, color:C.dim, letterSpacing:2.5, marginBottom:12 }}>WATCHLIST ({watchlist.length} wallets)</div>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {watchlist.map((w, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    background:C.bg1, border:`1px solid ${C.border}`, padding:"12px 16px" }}>
                    <span style={{ fontFamily:mono, fontSize:11.5, color:"#fff" }}>{w}</span>
                    <button onClick={() => setWatchlist(prev => prev.filter((_, j) => j !== i))}
                      style={{ background:"none", border:`1px solid ${C.border}`, fontFamily:mono, fontSize:9,
                        color:C.red, cursor:"pointer", padding:"3px 10px", letterSpacing:1 }}>REMOVE</button>
                  </div>
                ))}
                <div style={{ display:"flex", gap:2 }}>
                  <input placeholder="Add wallet to watchlist..."
                    style={{ flex:1, background:C.bg2, border:`1px solid ${C.border}`,
                      fontFamily:mono, fontSize:11, color:"#fff", padding:"10px 14px", outline:"none" }}/>
                  <button onClick={() => {}}
                    style={{ background:C.red, border:"none", fontFamily:mono, fontSize:10,
                      color:"#fff", cursor:"pointer", padding:"10px 16px", letterSpacing:1 }}>ADD +</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Preview pane */}
          <div className="tg-preview" style={{ position:"sticky", top:74 }}>
            <div style={{ fontFamily:mono, fontSize:9, color:C.dim, letterSpacing:2.5, marginBottom:12 }}>EXAMPLE ALERTS</div>
            <div style={{ background:"#0d1117", border:`1px solid #30363d`, borderRadius:4, overflow:"hidden" }}>
              {/* Telegram header mockup */}
              <div style={{ background:"#161b22", padding:"12px 16px", borderBottom:"1px solid #30363d", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, background:"#2563eb", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <TgIcon size={16} fill="#fff"/>
                </div>
                <div>
                  <div style={{ fontFamily:sans, fontSize:13, color:"#e6edf3", fontWeight:600 }}>WhoDevBot</div>
                  <div style={{ fontFamily:sans, fontSize:11, color:"#7d8590" }}>@WhoDevBot · online</div>
                </div>
              </div>
              {/* Messages */}
              <div style={{ padding:"16px 12px", display:"flex", flexDirection:"column", gap:10 }}>
                {exampleAlerts.map((a, i) => (
                  <div key={i} style={{ background:"#1c2128", border:`1px solid ${a.type==="CRITICAL"?"#e63030":"#f9731630"}`,
                    borderRadius:4, padding:"10px 14px", borderLeft:`3px solid ${a.type==="CRITICAL"?C.red:C.orange}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontFamily:mono, fontSize:9, color:a.type==="CRITICAL"?C.red:C.orange, letterSpacing:1.5 }}>
                        {a.icon} {a.type}
                      </span>
                      <span style={{ fontFamily:mono, fontSize:9, color:"#7d8590" }}>{a.time}</span>
                    </div>
                    <div style={{ fontFamily:sans, fontSize:12, color:"#e6edf3", lineHeight:1.65 }}>{a.msg}</div>
                    <div style={{ fontFamily:mono, fontSize:9, color:"#7d8590", marginTop:8 }}>via {a.bot}</div>
                  </div>
                ))}
                {/* Bot typing indicator */}
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:28, height:28, background:"#2563eb", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <TgIcon size={13} fill="#fff"/>
                  </div>
                  <div style={{ background:"#1c2128", padding:"8px 14px", borderRadius:4 }}>
                    <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#7d8590",
                          animation:`pulse ${1+i*0.3}s infinite` }}/>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, marginTop:12 }}>
              {[
                { val:"< 30s", label:"Alert Latency" },
                { val:"24/7", label:"Monitoring" },
                { val:"6", label:"Alert Types" },
                { val:"Free", label:"During Beta" },
              ].map(s => (
                <div key={s.label} style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontFamily:display, fontSize:26, color:"#3b82f6", marginBottom:2 }}>{s.val}</div>
                  <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, letterSpacing:1.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOLLOW BUILDER BANNER ─────────────────────────────────────────────────────
function FollowBanner() {
  return (
    <div className="follow-banner" style={{ background:"linear-gradient(90deg,#0d0000 0%,#130000 50%,#0d0000 100%)",
      borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`,
      borderLeft:`4px solid ${C.red}`,
      padding:"18px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24 }}>
      <div>
        <div style={{ fontFamily:mono, fontSize:10, color:"#fff", letterSpacing:1.5, marginBottom:4 }}>
          🔔 FOLLOW THE BUILDER — GET EARLY ACCESS & UPDATES
        </div>
        <div style={{ fontFamily:arabic, fontSize:12.5, color:C.sub, direction:"rtl" }}>
          تابع المطور للحصول على وصول مبكر وآخر التحديثات
        </div>
      </div>
      <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer" className="glow-btn"
        style={{ display:"flex", alignItems:"center", gap:10, background:C.red,
          padding:"11px 24px", textDecoration:"none", flexShrink:0 }}>
        <XIcon size={14} fill="#fff"/>
        <div>
          <div style={{ fontFamily:mono, fontSize:11, color:"#fff", letterSpacing:1 }}>@Khloud132</div>
          <div style={{ fontFamily:mono, fontSize:8.5, color:"rgba(255,255,255,0.6)", letterSpacing:1 }}>FOLLOW BUILDER</div>
        </div>
      </a>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background:C.bg1, borderTop:`1px solid ${C.border}` }}>
      {/* Orynth + social top row */}
      <div className="section-x footer-top" style={{ maxWidth:1180, margin:"0 auto", padding:"36px 40px",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:24,
        borderBottom:`1px solid ${C.border}` }}>
        <div>
          <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, letterSpacing:2.5, marginBottom:12 }}>FEATURED ON</div>
          <a href="https://orynth.dev/projects/whodev" target="_blank" rel="noopener noreferrer" style={{ display:"inline-block" }}>
            <img src="https://orynth.dev/api/badge/whodev?theme=light&style=default" alt="Featured on Orynth"
              width="200" height="62" style={{ display:"block", maxWidth:"100%", height:"auto" }}/>
          </a>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:8, background:"#0a1020",
              border:"1px solid #2563eb40", padding:"10px 16px", textDecoration:"none" }}>
            <TgIcon size={13} fill="#3b82f6"/>
            <div>
              <div style={{ fontFamily:mono, fontSize:10, color:"#93c5fd", letterSpacing:0.5 }}>@WhoDevBot</div>
              <div style={{ fontFamily:mono, fontSize:8, color:C.dim, letterSpacing:1 }}>TELEGRAM ALERTS</div>
            </div>
          </a>
          <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:8, background:C.bg3,
              border:`1px solid ${C.border2}`, padding:"10px 16px", textDecoration:"none" }}>
            <XIcon size={13} fill="#ccc"/>
            <div>
              <div style={{ fontFamily:mono, fontSize:10, color:"#ccc", letterSpacing:0.5 }}>@whodevxyz</div>
              <div style={{ fontFamily:mono, fontSize:8, color:C.dim, letterSpacing:1 }}>OFFICIAL TWITTER</div>
            </div>
          </a>
          <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer" className="glow-btn"
            style={{ display:"flex", alignItems:"center", gap:8, background:C.red,
              padding:"10px 16px", textDecoration:"none" }}>
            <XIcon size={13} fill="#fff"/>
            <div>
              <div style={{ fontFamily:mono, fontSize:10, color:"#fff", letterSpacing:0.5 }}>@Khloud132</div>
              <div style={{ fontFamily:mono, fontSize:8, color:"rgba(255,255,255,0.65)", letterSpacing:1 }}>BUILDER</div>
            </div>
          </a>
        </div>
      </div>

      {/* Links + copyright */}
      <div className="section-x footer-inner" style={{ maxWidth:1180, margin:"0 auto", padding:"28px 40px",
        display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:32 }}>
        <div>
          <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:10 }}>
            <span style={{ fontFamily:display, fontSize:20, color:"#fff", letterSpacing:2 }}>WHO</span>
            <span style={{ fontFamily:display, fontSize:20, color:C.red, letterSpacing:2 }}>DEV</span>
          </div>
          <p style={{ fontFamily:sans, fontSize:12.5, color:C.dim, lineHeight:1.8, maxWidth:260 }}>
            Solana's on-chain and social intelligence platform. Detect rugs before they happen.
          </p>
          <p style={{ fontFamily:arabic, fontSize:11.5, color:"#444", lineHeight:1.9, direction:"rtl", textAlign:"right", marginTop:4 }}>
            اكشف الاحتيال قبل حدوثه.
          </p>
        </div>
        <div style={{ display:"flex", gap:48, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, letterSpacing:2.5, marginBottom:14 }}>PLATFORM</div>
            {[
              { label:"Scan a Wallet",    key:"search"  },
              { label:"Twitter Scanner",  key:"twitter" },
              { label:"Telegram Alerts",  key:"alerts"  },
              { label:"About",            key:"about"   },
            ].map(l => (
              <button key={l.key} onClick={() => setPage(l.key)} className="link-hover"
                style={{ display:"block", background:"none", border:"none", fontFamily:sans, fontSize:13,
                  color:C.sub, cursor:"pointer", padding:"4px 0", marginBottom:4, textAlign:"left", transition:"color .15s" }}>
                {l.label}
              </button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, letterSpacing:2.5, marginBottom:14 }}>COMMUNITY</div>
            {[
              { label:"@whodevxyz — Official",    href:"https://x.com/whodevxyz" },
              { label:"@Khloud132 — Builder",     href:"https://x.com/Khloud132" },
              { label:"@WhoDevBot — Alerts",      href:"https://t.me/WhoDevBot" },
              { label:"Featured on Orynth",       href:"https://orynth.dev/projects/whodev" },
            ].map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-hover"
                style={{ display:"block", fontFamily:sans, fontSize:13, color:C.sub,
                  textDecoration:"none", padding:"4px 0", marginBottom:4, transition:"color .15s" }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 40px", display:"flex",
        justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <span style={{ fontFamily:mono, fontSize:8.5, color:C.muted, letterSpacing:1 }}>
          © 2025 WHODEV — DEMO MODE. ALL DATA IS SIMULATED.
        </span>
        <span style={{ fontFamily:mono, fontSize:8.5, color:C.muted, letterSpacing:1 }}>
          BUILT BY <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer"
            style={{ color:C.red, textDecoration:"none" }}>@Khloud132</a>
        </span>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ setPage }) {
  const [stats, setStats] = useState({ wallets:0, rugs:0, vol:0 });
  useEffect(() => {
    const tgt = { wallets:48291, rugs:1847, vol:142 }, dur=1800, s=Date.now();
    const tick = () => {
      const p = Math.min((Date.now()-s)/dur, 1), e = 1-Math.pow(1-p,3);
      setStats({ wallets:Math.floor(e*tgt.wallets), rugs:Math.floor(e*tgt.rugs), vol:Math.floor(e*tgt.vol) });
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div style={{ background:C.bg }}>
      {/* HERO */}
      <div className="hero-pad section-x" style={{ padding:"80px 40px 64px", maxWidth:1180, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          <div style={{ width:7, height:7, background:C.red, borderRadius:"50%", boxShadow:`0 0 10px ${C.red}`, animation:"pulse 1.2s infinite" }}/>
          <span style={{ fontFamily:mono, fontSize:9.5, color:C.red, letterSpacing:3 }}>LIVE MONITORING ACTIVE</span>
          <span style={{ fontFamily:arabic, fontSize:10, color:C.dim }}>· المراقبة المباشرة نشطة</span>
        </div>

        <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:56, alignItems:"center" }}>
          <div>
            <h1 style={{ fontFamily:display, fontSize:"clamp(72px, 10vw, 148px)", color:"#fff", lineHeight:.90, margin:"0 0 24px", letterSpacing:-3 }}>
              WHO IS<br/>
              <span style={{ color:C.red, WebkitTextStroke:`2px ${C.red}`, WebkitTextFillColor:"transparent" }}>THIS</span><br/>
              DEV?
            </h1>
            <p style={{ fontFamily:sans, fontSize:16, color:C.sub, lineHeight:1.75, margin:"0 0 6px", maxWidth:480 }}>
              The most advanced on-chain intelligence platform for Solana. Expose rugs before they happen. Unmask anonymous developers.
            </p>
            <p style={{ fontFamily:arabic, fontSize:13, color:C.dim, direction:"rtl", textAlign:"right", margin:"0 0 32px" }}>
              أقوى منصة استخباراتية لشبكة سولانا — اكشف الاحتيال قبل حدوثه.
            </p>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={() => setPage("search")}
                style={{ background:C.red, border:"none", fontFamily:display, fontSize:20, color:"#fff", cursor:"pointer", padding:"13px 32px", letterSpacing:2 }}>
                SCAN A WALLET
              </button>
              <button onClick={() => setPage("twitter")}
                style={{ background:"none", border:`1px solid ${C.border2}`, fontFamily:display, fontSize:20, color:C.dim, cursor:"pointer", padding:"13px 28px", letterSpacing:2 }}>
                TWITTER SCANNER
              </button>
              <button onClick={() => setPage("alerts")}
                style={{ background:"#0a1020", border:"1px solid #2563eb40", display:"flex", alignItems:"center", gap:8,
                  fontFamily:display, fontSize:20, color:"#93c5fd", cursor:"pointer", padding:"13px 24px", letterSpacing:2 }}>
                <TgIcon size={16} fill="#3b82f6"/>ALERTS
              </button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {[
              { val:stats.wallets.toLocaleString(), en:"WALLETS TRACKED",   ar:"محافظ مُتتبَّعة",  color:C.red    },
              { val:stats.rugs.toLocaleString(),    en:"RUGS DETECTED",     ar:"عمليات احتيال",   color:C.orange },
              { val:`$${stats.vol}M+`,              en:"CAPITAL PROTECTED", ar:"رأس مال محمي",    color:C.green  },
            ].map(s => (
              <div key={s.en} style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"18px 22px",
                display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, letterSpacing:2 }}>{s.en}</div>
                  <div style={{ fontFamily:arabic, fontSize:10, color:"#444", direction:"rtl" }}>{s.ar}</div>
                </div>
                <div style={{ fontFamily:display, fontSize:36, color:s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FollowBanner />

      {/* LIVE ALERTS TICKER */}
      <div style={{ borderBottom:`1px solid ${C.border}` }}>
        <div className="section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"0 40px" }}>
          <div style={{ display:"flex", alignItems:"stretch" }}>
            <div style={{ fontFamily:mono, fontSize:8.5, color:C.red, letterSpacing:2.5,
              padding:"0 20px 0 0", borderRight:`1px solid ${C.border}`, marginRight:20,
              display:"flex", alignItems:"center", whiteSpace:"nowrap" }}>LIVE ALERTS</div>
            <div style={{ flex:1 }}>
              {LIVE_ALERTS.map((a, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"60px 1fr 80px",
                  alignItems:"center", gap:16, padding:"10px 0",
                  borderTop:i>0?`1px solid ${C.bg2}`:"none" }}>
                  <span style={{ fontFamily:mono, fontSize:9, color:C.dim }}>{a.time}</span>
                  <span style={{ fontFamily:sans, fontSize:12.5, color:C.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    <span className="alert-wallet" style={{ color:"#fff", fontFamily:mono, fontSize:10, marginRight:12 }}>{a.wallet}</span>
                    {a.event}
                  </span>
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <Badge label={a.level} color={a.level==="CRITICAL"?C.red:a.level==="HIGH"?C.orange:C.yellow} small/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="page-pad section-x" style={{ padding:"80px 40px", maxWidth:1180, margin:"0 auto" }}>
        <SectionLabel>PLATFORM FEATURES</SectionLabel>
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:display, fontSize:44, color:"#fff", letterSpacing:-0.5, marginBottom:4 }}>WHAT WHODEV DETECTS</h2>
          <p style={{ fontFamily:arabic, fontSize:13, color:C.dim, direction:"rtl", textAlign:"right" }}>ما يكشفه WHODEV</p>
        </div>
        <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.border }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-hover" style={{ background:C.bg, padding:"24px 22px", cursor:"default",
              borderBottom:`2px solid transparent`, transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background=C.bg2; e.currentTarget.style.borderColor=C.red; }}
              onMouseLeave={e => { e.currentTarget.style.background=C.bg; e.currentTarget.style.borderColor="transparent"; }}>
              <div style={{ fontFamily:display, fontSize:26, color:C.red, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontFamily:mono, fontSize:10.5, color:"#fff", letterSpacing:0.5, marginBottom:3, fontWeight:700 }}>{f.en}</div>
              <div style={{ fontFamily:arabic, fontSize:10.5, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:10 }}>{f.ar}</div>
              <div style={{ fontFamily:sans, fontSize:12, color:C.sub, lineHeight:1.7 }}>{f.descEn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TELEGRAM CTA SECTION */}
      <div style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, background:C.bg1 }}>
        <div className="page-pad section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"64px 40px" }}>
          <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
            <div>
              <SectionLabel color="#3b82f6">INSTANT NOTIFICATIONS</SectionLabel>
              <h2 style={{ fontFamily:display, fontSize:44, color:"#fff", letterSpacing:-0.5, lineHeight:1, marginBottom:16 }}>
                GET ALERTS ON<br/><span style={{ color:"#3b82f6" }}>TELEGRAM</span>
              </h2>
              <p style={{ fontFamily:sans, fontSize:14, color:C.sub, lineHeight:1.8, marginBottom:8 }}>
                Subscribe to <span style={{ color:"#93c5fd", fontFamily:mono }}>@WhoDevBot</span> and get instant alerts the moment a tracked wallet executes a stealth dump, removes LP, or changes identity.
              </p>
              <p style={{ fontFamily:arabic, fontSize:13, color:C.dim, lineHeight:1.9, direction:"rtl", textAlign:"right", marginBottom:24 }}>
                اشترك في البوت وتلقَّ إشعارات فورية عند اكتشاف أي نشاط مشبوه
              </p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:9, background:"#2563eb", padding:"13px 26px", textDecoration:"none" }}>
                  <TgIcon size={17} fill="#fff"/>
                  <span style={{ fontFamily:display, fontSize:20, color:"#fff", letterSpacing:2 }}>SUBSCRIBE FREE</span>
                </a>
                <button onClick={() => setPage("alerts")}
                  style={{ background:"none", border:`1px solid ${C.border2}`, fontFamily:display, fontSize:20,
                    color:C.dim, cursor:"pointer", padding:"13px 24px", letterSpacing:2 }}>
                  SETUP GUIDE →
                </button>
              </div>
            </div>
            <div>
              {[
                { icon:"⚡", label:"< 30 second", sub:"alert latency" },
                { icon:"🔴", label:"6 alert types", sub:"customizable" },
                { icon:"🔒", label:"Watchlist", sub:"monitor specific wallets" },
                { icon:"🆓", label:"Free", sub:"during beta" },
              ].map(f => (
                <div key={f.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px",
                  background:C.bg2, border:`1px solid ${C.border}`, marginBottom:2 }}>
                  <span style={{ fontSize:20 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontFamily:mono, fontSize:12, color:"#fff", letterSpacing:0.5 }}>{f.label}</div>
                    <div style={{ fontFamily:sans, fontSize:12, color:C.sub }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ORYNTH BADGE */}
      <div style={{ padding:"48px 40px", textAlign:"center" }}>
        <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, letterSpacing:2.5, marginBottom:16 }}>FEATURED ON</div>
        <a href="https://orynth.dev/projects/whodev" target="_blank" rel="noopener noreferrer" style={{ display:"inline-block" }}>
          <img src="https://orynth.dev/api/badge/whodev?theme=light&style=default" alt="Featured on Orynth"
            width="240" height="74" style={{ display:"block", maxWidth:"100%", height:"auto" }}/>
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
    if (!query.trim()) { setError("Enter a wallet address or Twitter handle."); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); setReport(MOCK_WALLET); setPage("report"); }, 2200);
  };
  return (
    <div style={{ background:C.bg, minHeight:"100vh" }} className="fade-in">
      <div className="page-pad section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"80px 40px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <SectionLabel>WALLET INTELLIGENCE</SectionLabel>
          <h1 style={{ fontFamily:display, fontSize:54, color:"#fff", letterSpacing:-1, lineHeight:.95, marginBottom:8 }}>SCAN A WALLET</h1>
          <p style={{ fontFamily:sans, fontSize:14.5, color:C.sub, marginBottom:4 }}>Enter a Solana wallet address or Twitter/X handle.</p>
          <p style={{ fontFamily:arabic, fontSize:12.5, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:28 }}>أدخل عنوان محفظة سولانا أو اسم مستخدم تويتر/X</p>

          <div style={{ display:"flex", marginBottom:8 }}>
            <input type="text" value={query} onChange={e => { setQuery(e.target.value); setError(""); }}
              onKeyDown={e => e.key==="Enter" && handleScan()}
              placeholder="7xKXf3aB...  or  @devghost_sol"
              style={{ flex:1, background:C.bg1, border:`1px solid ${error?C.red:C.border}`, borderRight:"none",
                fontFamily:mono, fontSize:13, color:"#fff", padding:"14px 20px", outline:"none" }}/>
            <button onClick={handleScan} disabled={loading}
              style={{ background:loading?C.dim:C.red, border:"none", fontFamily:display, fontSize:18, color:"#fff",
                cursor:loading?"not-allowed":"pointer", padding:"14px 30px", letterSpacing:2,
                display:"flex", alignItems:"center", gap:8, minWidth:110 }}>
              {loading ? <Spinner/> : "SCAN →"}
            </button>
          </div>
          {error && <div style={{ fontFamily:sans, fontSize:12, color:C.red, marginBottom:10 }}>{error}</div>}

          {loading && (
            <div className="fade-in" style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"22px 24px", marginTop:16 }}>
              <div style={{ fontFamily:mono, fontSize:9, color:C.red, letterSpacing:2.5, marginBottom:14 }}>SCANNING...</div>
              {["Fetching on-chain history","Mapping wallet cluster","Cross-referencing social identity","Calculating risk score"].map((step, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:5, height:5, background:C.red, borderRadius:"50%", animation:`pulse ${1+i*.3}s infinite`, flexShrink:0 }}/>
                  <span style={{ fontFamily:mono, fontSize:10, color:C.sub }}>{step}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:20, padding:"14px 18px", background:C.bg1, border:`1px solid ${C.border}` }}>
            <div style={{ width:5, height:5, background:C.green, borderRadius:"50%", animation:"pulse 1.5s infinite" }}/>
            <span style={{ fontFamily:mono, fontSize:9.5, color:C.dim, letterSpacing:1 }}>DEMO MODE — results use simulated data</span>
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
    if (!query.trim()) { setError("Enter a Twitter/X handle."); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); setTwitterReport(MOCK_TWITTER); setPage("twitter-report"); }, 2000);
  };
  return (
    <div style={{ background:C.bg, minHeight:"100vh" }} className="fade-in">
      <div className="page-pad section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"80px 40px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <SectionLabel>IDENTITY INTELLIGENCE</SectionLabel>
          <h1 style={{ fontFamily:display, fontSize:54, color:"#fff", letterSpacing:-1, lineHeight:.95, marginBottom:8 }}>TWITTER SCANNER</h1>
          <p style={{ fontFamily:sans, fontSize:14.5, color:C.sub, marginBottom:4 }}>Track username, bio, and display name changes with risk scoring.</p>
          <p style={{ fontFamily:arabic, fontSize:12.5, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:28 }}>تتبع تغييرات الاسم والسيرة الذاتية مع تقييم المخاطر</p>

          <div style={{ display:"flex", marginBottom:8 }}>
            <input type="text" value={query} onChange={e => { setQuery(e.target.value); setError(""); }}
              onKeyDown={e => e.key==="Enter" && handleScan()}
              placeholder="@devghost_sol"
              style={{ flex:1, background:C.bg1, border:`1px solid ${error?C.red:C.border}`, borderRight:"none",
                fontFamily:mono, fontSize:13, color:"#fff", padding:"14px 20px", outline:"none" }}/>
            <button onClick={handleScan} disabled={loading}
              style={{ background:loading?C.dim:C.red, border:"none", fontFamily:display, fontSize:18, color:"#fff",
                cursor:loading?"not-allowed":"pointer", padding:"14px 30px", letterSpacing:2,
                display:"flex", alignItems:"center", gap:8, minWidth:110 }}>
              {loading ? <Spinner/> : "SCAN →"}
            </button>
          </div>
          {error && <div style={{ fontFamily:sans, fontSize:12, color:C.red }}>{error}</div>}

          {loading && (
            <div className="fade-in" style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"22px 24px", marginTop:16 }}>
              <div style={{ fontFamily:mono, fontSize:9, color:C.red, letterSpacing:2.5, marginBottom:14 }}>SCANNING IDENTITY...</div>
              {["Fetching identity archive","Detecting change patterns","Correlating with on-chain activity","Scoring risk level"].map((step, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:5, height:5, background:C.red, borderRadius:"50%", animation:`pulse ${1+i*.3}s infinite`, flexShrink:0 }}/>
                  <span style={{ fontFamily:mono, fontSize:10, color:C.sub }}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SHARED REPORT CHROME ─────────────────────────────────────────────────────
function ReportChrome({ tabs, activeTab, setActiveTab, onBack, children, header }) {
  return (
    <div style={{ background:C.bg, minHeight:"100vh" }} className="fade-in">
      <div style={{ background:C.bg1, borderBottom:`1px solid ${C.border}`, padding:"32px 40px" }}>
        <div className="section-x" style={{ maxWidth:1180, margin:"0 auto" }}>{header}</div>
      </div>
      <div className="tabs-row" style={{ borderBottom:`1px solid ${C.border}` }}>
        <div className="section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"0 40px", display:"flex" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ background:"none", border:"none", fontFamily:mono, fontSize:9.5,
                color:activeTab===t?"#fff":C.dim, cursor:"pointer", padding:"13px 18px", letterSpacing:1.8,
                textTransform:"uppercase", borderBottom:activeTab===t?`2px solid ${C.red}`:"2px solid transparent",
                whiteSpace:"nowrap", transition:"color .15s" }}>{t}</button>
          ))}
        </div>
      </div>
      <div className="section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"36px 40px" }}>{children}</div>
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"16px 40px" }}>
        <div className="section-x" style={{ maxWidth:1180, margin:"0 auto", display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
          <button onClick={onBack}
            style={{ background:"none", border:`1px solid ${C.border}`, fontFamily:mono, fontSize:9.5, color:C.dim, cursor:"pointer", padding:"10px 20px", letterSpacing:1 }}>
            ← NEW SCAN
          </button>
          <button style={{ background:C.red, border:"none", fontFamily:mono, fontSize:9.5, color:"#fff", cursor:"pointer", padding:"10px 22px", letterSpacing:1, fontWeight:700 }}>
            EXPORT REPORT
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WALLET REPORT ────────────────────────────────────────────────────────────
function ReportPage({ report, setPage }) {
  const [tab, setTab] = useState("overview");
  const header = (
    <>
      <SectionLabel>WALLET INTELLIGENCE REPORT</SectionLabel>
      <div className="report-hdr" style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"start", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:display, fontSize:44, color:"#fff", letterSpacing:-1, marginBottom:6 }}>{report.twitter}</div>
          <div style={{ fontFamily:mono, fontSize:9.5, color:C.dim, marginBottom:20, letterSpacing:0.5, wordBreak:"break-all" }}>{report.fullWallet}</div>
          <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {[{ l:"FIRST SEEN",v:report.firstActivity },{ l:"LAST ACTIVE",v:report.lastSeen },{ l:"TOKENS",v:report.totalTokensLaunched },{ l:"RUGGED",v:report.ruggedTokens }].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily:mono, fontSize:7.5, color:C.dim, letterSpacing:2 }}>{s.l}</div>
                <div style={{ fontFamily:mono, fontSize:13, color:"#fff", marginTop:3 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <RiskGauge score={report.riskScore} size={150}/>
          <Badge label={report.riskLevel} color={riskColor(report.riskScore)}/>
        </div>
      </div>
      <div className="key-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.border }}>
        {[
          { val:report.linkedWallets,      label:"LINKED WALLETS",    color:C.orange },
          { val:`${report.ruggedTokens}/${report.totalTokensLaunched}`,label:"RUG RATE",color:C.red },
          { val:report.totalVolumeDrained, label:"VOLUME DRAINED",    color:C.red    },
          { val:report.flags.length,       label:"ACTIVE FLAGS",      color:C.yellow },
        ].map(s => (
          <div key={s.label} style={{ background:C.bg, padding:"18px 20px" }}>
            <div style={{ fontFamily:display, fontSize:32, color:s.color }}>{s.val}</div>
            <div style={{ fontFamily:mono, fontSize:8, color:C.dim, letterSpacing:2, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
  return (
    <ReportChrome tabs={["overview","tokens","cluster","social"]} activeTab={tab} setActiveTab={setTab} onBack={() => setPage("search")} header={header}>
      {tab==="overview" && (
        <div className="fade-in" style={{ maxWidth:860 }}>
          <SectionLabel>RED FLAGS DETECTED</SectionLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {report.flags.map((f,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:16, padding:"16px 20px",
                background:C.bg1, borderLeft:`3px solid ${sevColor(f.severity)}`, flexWrap:"wrap" }}>
                <Badge label={f.severity.toUpperCase()} color={sevColor(f.severity)} small/>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontFamily:mono, fontSize:11.5, color:"#fff", fontWeight:700, marginBottom:5 }}>{f.label}</div>
                  <div style={{ fontFamily:sans, fontSize:13, color:C.sub, lineHeight:1.65 }}>{f.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="tokens" && (
        <div className="fade-in">
          <SectionLabel>TOKEN LAUNCH HISTORY</SectionLabel>
          <div style={{ background:C.border, padding:1, overflowX:"auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 70px 90px", gap:12, padding:"10px 20px", background:C.bg1, minWidth:380 }}>
              {["TOKEN","DATE","RAISED","DAYS","STATUS"].map(h => (
                <div key={h} style={{ fontFamily:mono, fontSize:8.5, color:C.dim, letterSpacing:2 }}>{h}</div>
              ))}
            </div>
            {report.tokenHistory.map((t,i) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 70px 90px", gap:12, padding:"14px 20px",
                background:C.bg, alignItems:"center", borderTop:`1px solid ${C.border}`, minWidth:380 }}>
                <div>
                  <div style={{ fontFamily:mono, fontSize:12, color:"#fff" }}>{t.name}</div>
                  <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim }}>${t.symbol}</div>
                </div>
                <div style={{ fontFamily:sans, fontSize:12, color:C.dim }}>{t.date}</div>
                <div style={{ fontFamily:display, fontSize:20, color:"#fff" }}>{t.raised}</div>
                <div style={{ fontFamily:mono, fontSize:11, color:C.dim }}>{t.daysLive}d</div>
                <Badge label={t.status} color={statusCol(t.status)} small/>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="cluster" && (
        <div className="fade-in">
          <SectionLabel>WALLET CLUSTER — {report.walletCluster.length} WALLETS IDENTIFIED</SectionLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
            {report.walletCluster.map((w,i) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 90px 130px", gap:12, padding:"14px 20px",
                background:C.bg1, alignItems:"center", borderLeft:`3px solid ${w.role==="PRIMARY"?"#fff":roleCol(w.role)}` }}>
                <span style={{ fontFamily:mono, fontSize:12, color:"#fff", overflow:"hidden", textOverflow:"ellipsis" }}>{w.address}</span>
                <Badge label={w.role} color={roleCol(w.role)} small/>
                <span style={{ fontFamily:display, fontSize:18, color:"#fff", textAlign:"right" }}>{w.balance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="social" && (
        <div className="fade-in">
          <SectionLabel>IDENTITY CHANGE HISTORY</SectionLabel>
          <div style={{ position:"relative", paddingLeft:20, maxWidth:700 }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:1, background:C.border }}/>
            {report.socialHistory.map((s,i) => (
              <div key={i} style={{ position:"relative", paddingLeft:24, paddingBottom:24 }}>
                <div style={{ position:"absolute", left:-4, top:6, width:8, height:8, background:s.type==="USERNAME"?C.red:C.orange, borderRadius:"50%" }}/>
                <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, marginBottom:8, letterSpacing:1 }}>{s.date}</div>
                <div style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"14px 18px" }}>
                  <div style={{ marginBottom:10 }}><Badge label={s.type+" CHANGED"} color={s.type==="USERNAME"?C.red:C.orange} small/></div>
                  <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontFamily:mono, fontSize:12, color:C.dim, textDecoration:"line-through" }}>{s.from}</span>
                    <span style={{ color:C.red, fontFamily:mono }}>→</span>
                    <span style={{ fontFamily:mono, fontSize:12, color:"#fff" }}>{s.to}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ReportChrome>
  );
}

// ─── TWITTER REPORT ───────────────────────────────────────────────────────────
function TwitterReportPage({ report, setPage }) {
  const [tab, setTab] = useState("timeline");
  const header = (
    <>
      <SectionLabel>TWITTER IDENTITY REPORT</SectionLabel>
      <div className="report-hdr" style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"start", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:display, fontSize:44, color:"#fff", letterSpacing:-1, marginBottom:4 }}>{report.handle}</div>
          <div style={{ fontFamily:sans, fontSize:14, color:C.sub, marginBottom:16 }}>{report.bio}</div>
          <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {[{ l:"JOINED",v:report.joined },{ l:"FOLLOWERS",v:report.followers },{ l:"CHANGES",v:report.totalChanges },{ l:"AVG DAYS",v:report.avgDaysBetweenChanges }].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily:mono, fontSize:7.5, color:C.dim, letterSpacing:2 }}>{s.l}</div>
                <div style={{ fontFamily:mono, fontSize:13, color:"#fff", marginTop:3 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <RiskGauge score={report.riskScore} size={140}/>
          <Badge label={report.riskLevel} color={riskColor(report.riskScore)}/>
        </div>
      </div>
    </>
  );
  return (
    <ReportChrome tabs={["timeline","flags","wallets"]} activeTab={tab} setActiveTab={setTab} onBack={() => setPage("twitter")} header={header}>
      {tab==="timeline" && (
        <div className="fade-in" style={{ maxWidth:700 }}>
          <SectionLabel>IDENTITY CHANGE TIMELINE</SectionLabel>
          <div style={{ position:"relative", paddingLeft:20 }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:1, background:C.border }}/>
            {report.timeline.map((entry,i) => (
              <div key={i} style={{ position:"relative", paddingLeft:24, paddingBottom:24 }}>
                <div style={{ position:"absolute", left:-4, top:6, width:8, height:8, background:C.red, borderRadius:"50%" }}/>
                <div style={{ fontFamily:mono, fontSize:8.5, color:C.dim, marginBottom:8 }}>{entry.date} · {entry.daysAgo}d ago</div>
                <div style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"14px 18px" }}>
                  {entry.changes.map((c,j) => (
                    <div key={j} style={{ marginBottom:j<entry.changes.length-1?10:0 }}>
                      <Badge label={c.type} color={changeRiskCol(c.risk)} small/>
                      <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginTop:8 }}>
                        <span style={{ fontFamily:mono, fontSize:12, color:C.dim, textDecoration:"line-through" }}>{c.from}</span>
                        <span style={{ color:C.red, fontFamily:mono }}>→</span>
                        <span style={{ fontFamily:mono, fontSize:12, color:"#fff" }}>{c.to}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ fontFamily:sans, fontSize:12, color:C.dim, marginTop:10, paddingTop:10, borderTop:`1px solid ${C.bg3}` }}>{entry.context}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="flags" && (
        <div className="fade-in" style={{ maxWidth:700 }}>
          <SectionLabel>RISK FLAGS</SectionLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {report.flags.map((f,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:16, padding:"16px 20px",
                background:C.bg1, borderLeft:`3px solid ${sevColor(f.severity)}`, flexWrap:"wrap" }}>
                <Badge label={f.severity.toUpperCase()} color={sevColor(f.severity)} small/>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontFamily:mono, fontSize:11.5, color:"#fff", fontWeight:700, marginBottom:5 }}>{f.label}</div>
                  <div style={{ fontFamily:sans, fontSize:13, color:C.sub, lineHeight:1.65 }}>{f.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="wallets" && (
        <div className="fade-in" style={{ maxWidth:700 }}>
          <SectionLabel>WALLETS LINKED TO THIS IDENTITY</SectionLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {report.linkedWallets.map((w,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"16px 20px", background:C.bg1, border:`1px solid ${C.border}`, flexWrap:"wrap", gap:8 }}>
                <span style={{ fontFamily:mono, fontSize:13, color:"#fff" }}>{w}</span>
                <button onClick={() => setPage("search")}
                  style={{ background:"none", border:`1px solid ${C.border}`, fontFamily:mono, fontSize:9, color:C.dim, cursor:"pointer", padding:"5px 14px", letterSpacing:1 }}>
                  VIEW REPORT →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ReportChrome>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  const [open, setOpen] = useState(null);
  const sections = [
    { id:"what",    en:"What is WHODEV?",                  ar:"ما هو WHODEV؟",            content:`WHODEV is an open intelligence platform built for the Solana ecosystem. Our goal is to give retail investors the same on-chain visibility that sophisticated funds and experienced traders use internally.\n\nWe aggregate data from the Solana blockchain, Helius RPC, DAS API, and social identity layers to build comprehensive risk profiles of anonymous developers and wallets.\n\nEvery scan produces a structured Risk Report — a quantified risk score, flagged behaviors, and a cluster map of linked wallets. Fully automated, continuously updated.` },
    { id:"twitter", en:"Twitter Username Tracker",          ar:"فاحص تويتر",              content:`The Twitter/X Identity Scanner is one of WHODEV's most powerful tools. Anonymous developers frequently change their username to escape reputational damage after a rug.\n\nOur system archives every public username, display name, and bio at regular intervals, detects changes within minutes, correlates identity changes with on-chain activity, and scores the frequency and pattern of changes against baseline behavior of legitimate builders.` },
    { id:"tg",      en:"Telegram Alert Bot",               ar:"بوت تنبيهات تيليغرام",     content:`WHODEV Telegram Bot (@WhoDevBot) sends real-time alerts directly to your phone the moment a tracked wallet executes suspicious on-chain actions.\n\nAlert types include: stealth dumps, LP removals, sniper coordination, cluster detection, username changes, and risk score updates.\n\nFree during beta. No credit card required.` },
    { id:"risk",    en:"How Risk Scores Are Calculated",   ar:"كيف تُحسَب درجات المخاطر؟", content:`Risk Scores (0–100) are computed by a weighted model across four signal categories:\n\nON-CHAIN SIGNALS (50%)\n— Token launch frequency and survival rate\n— LP removal patterns and timing\n— Wallet funding source (CEX withdrawal batches, mixers)\n\nSOCIAL SIGNALS (25%)\n— Username change frequency and timing correlation\n— Bio scrubbing patterns post-rug\n\nCLUSTER SIGNALS (15%)\n— Number of linked wallets and shared funding\n\nREPUTATION SIGNALS (10%)\n— Community reports and cross-platform mentions` },
    { id:"road",    en:"Roadmap",                          ar:"خريطة الطريق",             content:`Q2 2025 — LAUNCHED\n✓ Wallet Intelligence Scanner (demo)\n✓ Twitter Username Tracker (demo)\n✓ Risk Scoring v1\n\nQ3 2025 — IN PROGRESS\n◈ Live data pipeline (not mock)\n◈ Telegram alert bot (@WhoDevBot)\n◈ API access for power users\n◈ Watchlist — monitor specific wallets\n\nQ4 2025 — PLANNED\n◈ Browser extension for inline risk scores\n◈ Pump.fun + Raydium integration\n◈ Mobile app` },
  ];
  return (
    <div style={{ background:C.bg, minHeight:"100vh" }} className="fade-in">
      <div className="page-pad section-x" style={{ maxWidth:1180, margin:"0 auto", padding:"60px 40px" }}>
        <SectionLabel>PROJECT DOCUMENTATION</SectionLabel>
        <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:56, alignItems:"start" }}>
          <div>
            <h1 style={{ fontFamily:display, fontSize:60, color:"#fff", letterSpacing:-1.5, lineHeight:.93, marginBottom:8 }}>
              ABOUT<br/><span style={{ color:C.red }}>WHODEV</span>
            </h1>
            <p style={{ fontFamily:arabic, fontSize:14, color:C.dim, direction:"rtl", textAlign:"right", marginBottom:8 }}>حول WHODEV</p>
            <p style={{ fontFamily:sans, fontSize:14.5, color:C.sub, lineHeight:1.8, maxWidth:560, marginBottom:40 }}>
              Solana's on-chain and social intelligence platform — built to expose anonymous developers,
              detect rugpull patterns, and track identity changes in real-time.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {sections.map(s => (
                <div key={s.id} style={{ background:C.bg1, border:`1px solid ${C.border}` }}>
                  <button onClick={() => setOpen(open===s.id?null:s.id)}
                    style={{ width:"100%", background:"none", border:"none", cursor:"pointer",
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"18px 24px", textAlign:"left", gap:12 }}>
                    <div>
                      <div style={{ fontFamily:mono, fontSize:11.5, color:"#fff", letterSpacing:0.5, fontWeight:700, marginBottom:2 }}>{s.en}</div>
                      {s.ar && <div style={{ fontFamily:arabic, fontSize:10.5, color:C.dim, direction:"rtl", textAlign:"right" }}>{s.ar}</div>}
                    </div>
                    <span style={{ fontFamily:mono, fontSize:18, color:open===s.id?C.red:C.muted,
                      transform:open===s.id?"rotate(45deg)":"none", transition:"transform .2s", flexShrink:0, display:"block", lineHeight:1 }}>+</span>
                  </button>
                  {open===s.id && (
                    <div style={{ padding:"0 24px 24px", borderTop:`1px solid ${C.border}` }} className="fade-in">
                      <div style={{ paddingTop:16 }}>
                        {s.content.split("\n").map((line, i) => (
                          line.trim()==="" ? <div key={i} style={{ height:10 }}/> :
                          <div key={i} style={{
                            fontFamily: line.startsWith("—")||line.startsWith("✓")||line.startsWith("◈") ? mono : sans,
                            fontSize:12.5, color: (line===line.toUpperCase()&&line.length<40&&line.trim()) ? C.orange : C.sub,
                            lineHeight:1.8, letterSpacing: (line===line.toUpperCase()&&line.length<40&&line.trim()) ? 1 : 0
                          }}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position:"sticky", top:74 }}>
            <div style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"20px 20px", marginBottom:8 }}>
              <SectionLabel>QUICK ACTIONS</SectionLabel>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <button onClick={() => setPage("search")} style={{ background:C.red, border:"none", fontFamily:display, fontSize:18, color:"#fff", cursor:"pointer", padding:"12px 20px", letterSpacing:2, textAlign:"left" }}>SCAN A WALLET →</button>
                <button onClick={() => setPage("twitter")} style={{ background:C.bg2, border:`1px solid ${C.border}`, fontFamily:display, fontSize:18, color:"#fff", cursor:"pointer", padding:"12px 20px", letterSpacing:2, textAlign:"left" }}>TWITTER SCANNER →</button>
                <button onClick={() => setPage("alerts")} style={{ background:"#0a1020", border:"1px solid #2563eb40", fontFamily:display, fontSize:18, color:"#93c5fd", cursor:"pointer", padding:"12px 20px", letterSpacing:2, textAlign:"left", display:"flex", alignItems:"center", gap:8 }}>
                  <TgIcon size={15} fill="#3b82f6"/>ALERTS →
                </button>
              </div>
            </div>

            <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:12, background:C.bg1,
                border:`1px solid ${C.border}`, padding:"14px 18px", marginBottom:8, textDecoration:"none" }}>
              <XIcon size={16} fill="#ccc"/>
              <div>
                <div style={{ fontFamily:mono, fontSize:11, color:"#ccc", letterSpacing:0.5, marginBottom:2 }}>@whodevxyz</div>
                <div style={{ fontFamily:mono, fontSize:8, color:C.dim, letterSpacing:1 }}>OFFICIAL TWITTER</div>
              </div>
            </a>

            <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer" className="glow-btn"
              style={{ display:"flex", alignItems:"center", gap:12, background:"#0d0000",
                border:`2px solid ${C.red}`, padding:"14px 18px", marginBottom:8, textDecoration:"none" }}>
              <XIcon size={16} fill={C.red}/>
              <div>
                <div style={{ fontFamily:mono, fontSize:11, color:"#fff", letterSpacing:0.5, marginBottom:2 }}>@Khloud132</div>
                <div style={{ fontFamily:mono, fontSize:8, color:C.dim, letterSpacing:1 }}>FOLLOW THE BUILDER</div>
              </div>
            </a>

            <a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:12, background:"#0a1020",
                border:"1px solid #2563eb40", padding:"14px 18px", marginBottom:8, textDecoration:"none" }}>
              <TgIcon size={16} fill="#3b82f6"/>
              <div>
                <div style={{ fontFamily:mono, fontSize:11, color:"#93c5fd", letterSpacing:0.5, marginBottom:2 }}>@WhoDevBot</div>
                <div style={{ fontFamily:mono, fontSize:8, color:C.dim, letterSpacing:1 }}>TELEGRAM ALERTS BOT</div>
              </div>
            </a>

            <div style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"18px 20px", marginBottom:8, textAlign:"center" }}>
              <div style={{ fontFamily:mono, fontSize:8, color:C.dim, letterSpacing:2.5, marginBottom:12 }}>FEATURED ON</div>
              <a href="https://orynth.dev/projects/whodev" target="_blank" rel="noopener noreferrer" style={{ display:"inline-block" }}>
                <img src="https://orynth.dev/api/badge/whodev?theme=light&style=default" alt="Featured on Orynth" width="180" height="56" style={{ display:"block", maxWidth:"100%", height:"auto" }}/>
              </a>
            </div>

            <div style={{ background:C.bg1, border:`1px solid ${C.border}`, padding:"18px 20px" }}>
              <SectionLabel>PROJECT STATUS</SectionLabel>
              {[
                { label:"Platform",        val:"DEMO",    color:C.orange },
                { label:"Data",            val:"MOCK",    color:C.orange },
                { label:"Risk Engine",     val:"v1.0",    color:C.green  },
                { label:"Twitter Scanner", val:"DEMO",    color:C.orange },
                { label:"Telegram Alerts", val:"Q3 2025", color:C.blue   },
              ].map(item => (
                <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <span style={{ fontFamily:sans, fontSize:12.5, color:C.sub }}>{item.label}</span>
                  <Badge label={item.val} color={item.color} small/>
                </div>
              ))}
            </div>
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
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)}/>}
      <Ticker/>
      <Nav page={page} setPage={setPage}/>
      <div style={{ flex:1 }}>
        {page==="home"           && <Landing setPage={setPage}/>}
        {page==="search"         && <SearchPage setPage={setPage} setReport={setReport}/>}
        {page==="report"         && report && <ReportPage report={report} setPage={setPage}/>}
        {page==="twitter"        && <TwitterScannerPage setPage={setPage} setTwitterReport={setTwitterReport}/>}
        {page==="twitter-report" && twitterReport && <TwitterReportPage report={twitterReport} setPage={setPage}/>}
        {page==="about"          && <AboutPage setPage={setPage}/>}
        {page==="alerts"         && <AlertsPage setPage={setPage}/>}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}
