import { useState, useEffect, useRef } from "react";

/* ── Google Fonts injected via index.html ── */

/* ═══════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════ */
const T = {
  bg:       "#040404",
  surface:  "#0c0c0e",
  card:     "#111114",
  border:   "#1e1e24",
  borderHi: "#2e2e38",
  accent:   "#9945FF",
  accentLo: "#9945FF22",
  green:    "#14F195",
  greenLo:  "#14F19520",
  red:      "#FF4444",
  redLo:    "#FF444420",
  amber:    "#F59E0B",
  amberLo:  "#F59E0B18",
  blue:     "#3B82F6",
  blueLo:   "#3B82F618",
  text:     "#EDEDED",
  muted:    "#6B6B7A",
  faint:    "#2a2a32",

  font:  "'DM Sans', sans-serif",
  mono:  "'Space Mono', monospace",
  disp:  "'Bebas Neue', sans-serif",
  arab:  "'Cairo', sans-serif",

  r:  "10px",
  r2: "16px",
  r3: "24px",

  shadow: "0 4px 32px rgba(0,0,0,.6)",
  glow:   "0 0 24px rgba(153,69,255,.25)",
};

const gStyle = {
  margin: 0, padding: 0, boxSizing: "border-box",
  fontFamily: T.font, background: T.bg, color: T.text,
  minHeight: "100vh",
};

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

/* ═══════════════════════════════════════════
   ICONS
═══════════════════════════════════════════ */
const XIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TgIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const SolIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 397.7 311.7" fill="none">
    <defs>
      <linearGradient id="solG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9945FF"/>
        <stop offset="100%" stopColor="#14F195"/>
      </linearGradient>
    </defs>
    <path fill="url(#solG)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-164.2c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM391.2 0c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8C67 1.4 70.3 0 73.8 0h317.4z"/>
  </svg>
);

const ShieldIcon = ({ size = 16, color = T.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const BellIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const ZapIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const EyeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const ExternalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* ═══════════════════════════════════════════
   BASE COMPONENTS
═══════════════════════════════════════════ */
const BtnPrimary = ({ children, onClick, style = {}, small = false }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:T.font, fontWeight:600,
        fontSize: small ? 13 : 15, padding: small ? "8px 16px" : "13px 28px", borderRadius:T.r,
        border:"none", cursor:"pointer", transition:"all .18s",
        background: hov ? "#b060ff" : T.accent, color:"#fff",
        boxShadow: hov ? T.glow : "none", ...style }}>
      {children}
    </button>
  );
};

const BtnGhost = ({ children, onClick, style = {}, small = false }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:T.font, fontWeight:500,
        fontSize: small ? 13 : 14, padding: small ? "7px 14px" : "11px 22px", borderRadius:T.r,
        border:`1px solid ${hov ? T.borderHi : T.border}`, cursor:"pointer", transition:"all .18s",
        background: hov ? T.faint : "transparent", color: hov ? T.text : T.muted, ...style }}>
      {children}
    </button>
  );
};

const BtnBlue = ({ children, onClick, style = {}, small = false }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:T.font, fontWeight:600,
        fontSize: small ? 13 : 15, padding: small ? "8px 16px" : "13px 28px", borderRadius:T.r,
        border:"none", cursor:"pointer", transition:"all .18s",
        background: hov ? "#2563eb" : T.blue, color:"#fff", ...style }}>
      {children}
    </button>
  );
};

const Tag = ({ children, color = T.accent, bg }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontFamily:T.mono,
    fontSize:11, fontWeight:700, letterSpacing:".05em", textTransform:"uppercase",
    padding:"3px 9px", borderRadius:6,
    background: bg || (color + "22"), color }}>
    {children}
  </span>
);

const Card = ({ children, style = {}, glow = false }) => (
  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:T.r2,
    padding:24, transition:"border .2s",
    boxShadow: glow ? T.glow : T.shadow, ...style }}>
    {children}
  </div>
);

const Divider = () => (
  <div style={{ height:1, background:`linear-gradient(90deg,transparent,${T.border},transparent)`, margin:"0 auto", maxWidth:900 }} />
);

/* ─── Risk Gauge ─── */
const RiskGauge = ({ score = 0 }) => {
  const color = score >= 75 ? T.red : score >= 45 ? T.amber : T.green;
  const label = score >= 75 ? "HIGH RISK" : score >= 45 ? "MEDIUM" : "LOW RISK";
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ position:"relative", width:120, height:60, margin:"0 auto 8px" }}>
        <svg viewBox="0 0 120 60" style={{ width:"100%", overflow:"visible" }}>
          <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke={T.faint} strokeWidth="8" strokeLinecap="round"/>
          <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray="157" strokeDashoffset={157 - (157 * score / 100)} style={{ transition:"stroke-dashoffset 1s ease" }}/>
        </svg>
        <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)",
          fontFamily:T.disp, fontSize:28, color }}>{score}</div>
      </div>
      <Tag color={color}>{label}</Tag>
    </div>
  );
};

/* ─── Ticker ─── */
const Ticker = ({ items }) => {
  const [pos, setPos] = useState(0);
  const doubled = [...items, ...items];
  useEffect(() => {
    const id = setInterval(() => setPos(p => p >= items.length * 200 ? 0 : p + 0.4), 16);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`,
      padding:"10px 0", background:T.surface }}>
      <div style={{ display:"flex", gap:32, transform:`translateX(-${pos}px)`, whiteSpace:"nowrap", willChange:"transform" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:10,
            fontFamily:T.mono, fontSize:12, color:T.muted }}>
            <span style={{ color: item.up ? T.green : T.red, fontSize:10 }}>{item.up ? "▲" : "▼"}</span>
            <span style={{ color:T.text, fontWeight:600 }}>{item.symbol}</span>
            <span style={{ color: item.up ? T.green : T.red }}>{item.change}</span>
            <span style={{ color:T.border, margin:"0 8px" }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Stat Box ─── */
const StatBox = ({ value, suffix = "", label, color = T.green }) => {
  const count = useCountUp(parseInt(value.replace(/\D/g, "")) || 0);
  return (
    <div style={{ textAlign:"center", padding:"24px 16px" }}>
      <div style={{ fontFamily:T.disp, fontSize:48, lineHeight:1, color }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, marginTop:8, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</div>
    </div>
  );
};

/* ─── Step ─── */
const Step = ({ n, title, desc, icon }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", flex:1, padding:16, minWidth:200 }}>
    <div style={{ width:56, height:56, borderRadius:"50%", background:T.accentLo,
      border:`1px solid ${T.accent}44`, display:"flex", alignItems:"center", justifyContent:"center",
      marginBottom:16, fontSize:22 }}>{icon}</div>
    <div style={{ fontFamily:T.mono, fontSize:11, color:T.accent, marginBottom:6, letterSpacing:".12em" }}>STEP {n}</div>
    <div style={{ fontWeight:700, fontSize:17, marginBottom:8 }}>{title}</div>
    <div style={{ color:T.muted, fontSize:14, lineHeight:1.6 }}>{desc}</div>
  </div>
);

/* ═══════════════════════════════════════════
   NAV
═══════════════════════════════════════════ */
const NAV_LINKS = [
  { id:"home", label:"Home" },
  { id:"search", label:"Search" },
  { id:"twitter", label:"Twitter" },
  { id:"alerts", label:"Alerts" },
  { id:"about", label:"About" },
];

const Nav = ({ page, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{ position:"sticky", top:0, zIndex:100,
      background: scrolled ? "rgba(4,4,4,.95)" : "transparent",
      backdropFilter:"blur(12px)", borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
      transition:"all .3s" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>

        {/* Logo */}
        <div onClick={() => { setPage("home"); setMenuOpen(false); }}
          style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <div style={{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg,${T.accent},${T.green})`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <SolIcon size={18} />
          </div>
          <span style={{ fontFamily:T.disp, fontSize:22, letterSpacing:".08em", color:T.text }}>WHODEV</span>
          <Tag color={T.green} bg={T.greenLo}>BETA</Tag>
        </div>

        {/* Desktop links */}
        <div style={{ display:"flex", alignItems:"center", gap:4, "@media(max-width:768px)":{display:"none"} }}
          className="nav-links-desktop">
          {NAV_LINKS.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              style={{ fontFamily:T.font, fontWeight:500, fontSize:14, padding:"6px 14px",
                borderRadius:8, border:"none", cursor:"pointer", transition:"all .15s",
                background: page===l.id ? T.faint : "transparent",
                color: page===l.id ? T.text : T.muted }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:6, fontFamily:T.mono, fontSize:12,
              color:T.muted, textDecoration:"none", padding:"6px 10px", borderRadius:8,
              border:`1px solid ${T.border}`, transition:"all .15s" }}>
            <XIcon size={13} /><span className="hide-xs">@whodevxyz</span>
          </a>
          <BtnPrimary small onClick={() => setPage("search")}>
            <SearchIcon size={14}/> Analyse
          </BtnPrimary>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} className="hamburger"
            style={{ display:"none", background:"none", border:`1px solid ${T.border}`,
              borderRadius:8, padding:8, cursor:"pointer", color:T.muted }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background:T.surface, borderTop:`1px solid ${T.border}`, padding:16,
          display:"flex", flexDirection:"column", gap:4 }} className="nav-mobile">
          {NAV_LINKS.map(l => (
            <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }}
              style={{ fontFamily:T.font, fontWeight:500, fontSize:15, padding:"12px 16px",
                borderRadius:8, border:"none", cursor:"pointer", textAlign:"left",
                background: page===l.id ? T.faint : "transparent",
                color: page===l.id ? T.text : T.muted }}>
              {l.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .nav-links-desktop{display:none!important}
          .hamburger{display:flex!important}
        }
        @media(max-width:480px){ .hide-xs{display:none} }
      `}</style>
    </nav>
  );
};

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
const Footer = ({ setPage }) => (
  <footer style={{ background:T.surface, borderTop:`1px solid ${T.border}`, padding:"48px 20px 28px" }}>
    <div style={{ maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:40, marginBottom:40 }}>
        {/* Brand */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg,${T.accent},${T.green})`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <SolIcon size={15} />
            </div>
            <span style={{ fontFamily:T.disp, fontSize:20, letterSpacing:".08em" }}>WHODEV</span>
          </div>
          <p style={{ color:T.muted, fontSize:13, lineHeight:1.7, maxWidth:240 }}>
            Solana on-chain intelligence. Expose rugs. Unmask anonymous developers.
          </p>
          <p style={{ color:T.muted, fontSize:13, lineHeight:1.7, fontFamily:T.arab, direction:"rtl", marginTop:6 }}>
            استخبارات البلوك‌تشين على سولانا — اكشف عمليات السحب وأسقط أقنعة المطورين المجهولين.
          </p>
        </div>

        {/* Platform */}
        <div>
          <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em", textTransform:"uppercase", marginBottom:14 }}>Platform</div>
          {[["home","Home"],["search","Analyse Address"],["twitter","Twitter Scanner"],["alerts","Telegram Alerts"],["about","About"]].map(([id,label]) => (
            <div key={id} onClick={() => setPage(id)}
              style={{ color:T.muted, fontSize:14, marginBottom:8, cursor:"pointer",
                transition:"color .15s", display:"block" }}
              onMouseEnter={e => e.target.style.color=T.text}
              onMouseLeave={e => e.target.style.color=T.muted}>
              {label}
            </div>
          ))}
        </div>

        {/* Community */}
        <div>
          <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em", textTransform:"uppercase", marginBottom:14 }}>Community</div>
          <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:8, color:T.muted, textDecoration:"none",
              fontSize:14, marginBottom:10, transition:"color .15s" }}
            onMouseEnter={e => e.currentTarget.style.color=T.text}
            onMouseLeave={e => e.currentTarget.style.color=T.muted}>
            <XIcon size={14}/> @whodevxyz
          </a>
          <a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:8, color:T.muted, textDecoration:"none",
              fontSize:14, marginBottom:10, transition:"color .15s" }}
            onMouseEnter={e => e.currentTarget.style.color=T.text}
            onMouseLeave={e => e.currentTarget.style.color=T.muted}>
            <TgIcon size={14}/> @WhoDevBot
          </a>
        </div>

        {/* Builder */}
        <div>
          <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em", textTransform:"uppercase", marginBottom:14 }}>Builder</div>
          <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none",
              padding:"12px 14px", border:`1px solid ${T.border}`, borderRadius:T.r,
              transition:"all .2s", marginBottom:12 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.background=T.accentLo; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background="transparent"; }}>
            <div style={{ width:36, height:36, borderRadius:"50%",
              background:`linear-gradient(135deg,${T.accent},${T.blue})`,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <XIcon size={15} color="#fff"/>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:T.text }}>@Khloud132</div>
              <div style={{ fontSize:12, color:T.muted }}>Builder & Creator</div>
            </div>
          </a>
          {/* Orynth Badge */}
          <a href="https://orynth.dev/projects/whodev" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none",
              padding:"9px 12px", border:`1px solid ${T.border}`, borderRadius:T.r,
              fontSize:12, color:T.muted, transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=T.blue; e.currentTarget.style.color=T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
            <span style={{ fontSize:16 }}>🔷</span>
            <div>
              <div style={{ fontWeight:600, color:"inherit" }}>Verified on Orynth</div>
              <div style={{ fontSize:11 }}>orynth.dev/projects/whodev</div>
            </div>
            <ExternalIcon size={12}/>
          </a>
        </div>
      </div>

      <Divider />
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between",
        gap:12, paddingTop:24 }}>
        <div style={{ fontSize:13, color:T.muted }}>© 2025 WHODEV. Built on Solana.</div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <Tag color={T.green} bg={T.greenLo}><span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block", marginRight:4 }}/>Live</Tag>
          <span style={{ fontFamily:T.mono, fontSize:11, color:T.muted }}>Network: mainnet-beta</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════
   SHARED REPORT LAYOUT
═══════════════════════════════════════════ */
const ReportLayout = ({ title, subtitle, tag, risk, children, actions }) => (
  <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 20px 64px" }}>
    <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-start",
      justifyContent:"space-between", gap:24, marginBottom:32 }}>
      <div>
        {tag && <div style={{ marginBottom:10 }}>{tag}</div>}
        <h1 style={{ fontFamily:T.disp, fontSize:36, letterSpacing:".06em", marginBottom:8 }}>{title}</h1>
        {subtitle && <div style={{ color:T.muted, fontFamily:T.mono, fontSize:13 }}>{subtitle}</div>}
        {actions && <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:16 }}>{actions}</div>}
      </div>
      {risk !== undefined && <RiskGauge score={risk} />}
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
const TICKER_DATA = [
  { symbol:"SOL/USD", change:"+3.2%", up:true }, { symbol:"WIF", change:"-1.8%", up:false },
  { symbol:"BONK", change:"+12.4%", up:true }, { symbol:"JUP", change:"+2.1%", up:true },
  { symbol:"POPCAT", change:"-5.3%", up:false }, { symbol:"MYRO", change:"+8.7%", up:true },
  { symbol:"BOME", change:"-2.1%", up:false }, { symbol:"SLERF", change:"+4.9%", up:true },
];

const HomePage = ({ setPage }) => {
  const [query, setQuery] = useState("");

  return (
    <div>
      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden",
        background:`radial-gradient(ellipse 80% 60% at 50% 0%,${T.accent}18 0%,transparent 70%), ${T.bg}`,
        padding:"80px 20px 60px", textAlign:"center" }}>
        {/* Grid bg */}
        <div style={{ position:"absolute", inset:0, opacity:.04,
          backgroundImage:`linear-gradient(${T.accent} 1px,transparent 1px),linear-gradient(90deg,${T.accent} 1px,transparent 1px)`,
          backgroundSize:"40px 40px", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:780, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:20 }}>
            <Tag color={T.accent}><ZapIcon size={11} color={T.accent}/> Powered by Solana</Tag>
            <Tag color={T.green} bg={T.greenLo}><span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block" }}/> Live</Tag>
          </div>

          <h1 style={{ fontFamily:T.disp, fontSize:"clamp(42px,9vw,86px)", lineHeight:.95,
            letterSpacing:".04em", marginBottom:24,
            background:`linear-gradient(135deg,${T.text} 0%,${T.muted} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            WHO BUILT<br/>THIS TOKEN?
          </h1>

          <p style={{ fontSize:"clamp(15px,3vw,18px)", color:T.muted, lineHeight:1.7,
            maxWidth:560, margin:"0 auto 12px" }}>
            The most advanced on-chain intelligence platform for Solana. Expose rugs before they happen.
          </p>
          <p style={{ fontSize:14, color:T.muted, fontFamily:T.arab, direction:"rtl",
            maxWidth:500, margin:"0 auto 36px" }}>
            اكشف عمليات السحب قبل حدوثها — قم بتحليل محافظ سولانا وتتبع المطورين المجهولين
          </p>

          {/* Search bar */}
          <div style={{ display:"flex", gap:10, maxWidth:600, margin:"0 auto 32px",
            background:T.card, border:`1px solid ${T.border}`, borderRadius:T.r2, padding:8 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"0 12px" }}>
              <SearchIcon size={16} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key==="Enter" && setPage("search")}
                placeholder="Paste wallet address, token, or @twitter…"
                style={{ flex:1, background:"none", border:"none", outline:"none",
                  fontFamily:T.font, fontSize:15, color:T.text }} />
            </div>
            <BtnPrimary onClick={() => setPage("search")}>Analyse <ZapIcon size={14} color="#fff"/></BtnPrimary>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
            <BtnGhost small onClick={() => setPage("alerts")}><TgIcon size={13}/>Telegram Alerts</BtnGhost>
            <BtnGhost small onClick={() => setPage("twitter")}><XIcon size={13}/>Twitter Scanner</BtnGhost>
            <a href="https://orynth.dev/projects/whodev" target="_blank" rel="noopener noreferrer"
              style={{ textDecoration:"none" }}>
              <BtnGhost small><span>🔷</span> Orynth Verified</BtnGhost>
            </a>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <Ticker items={TICKER_DATA} />

      {/* Stats */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
          border:`1px solid ${T.border}`, borderRadius:T.r2, overflow:"hidden", margin:"40px 0" }}>
          {[
            { value:"48200", suffix:"+", label:"Wallets Scanned", color:T.accent },
            { value:"3100", suffix:"+", label:"Rugs Detected", color:T.red },
            { value:"1290", suffix:"+", label:"Dev Identities", color:T.green },
            { value:"99", suffix:"%", label:"Uptime", color:T.blue },
          ].map((s,i) => (
            <div key={i} style={{ borderRight: i<3 ? `1px solid ${T.border}` : "none" }}>
              <StatBox {...s} />
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"20px 20px 60px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <Tag color={T.muted}>How it works</Tag>
          <h2 style={{ fontFamily:T.disp, fontSize:36, marginTop:12, letterSpacing:".06em" }}>THREE STEPS TO THE TRUTH</h2>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:0, position:"relative" }}>
          <Step n={1} icon="🔍" title="Paste Any Address"
            desc="Drop a wallet, token mint, or Twitter handle. We pull everything from on-chain and social layers instantly." />
          <Step n={2} icon="🧠" title="Deep Intelligence"
            desc="Our engine correlates wallet history, dev behaviour, liquidity moves, and social footprint into a risk score." />
          <Step n={3} icon="🚨" title="Get Alerted"
            desc="Set up Telegram alerts for any wallet. Get notified the moment suspicious activity is detected." />
        </div>
      </div>

      <Divider />

      {/* Features grid */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"60px 20px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h2 style={{ fontFamily:T.disp, fontSize:36, letterSpacing:".06em" }}>BUILT FOR SURVIVORS</h2>
          <p style={{ color:T.muted, marginTop:8 }}>Every feature designed to keep you ahead of bad actors.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
          {[
            { icon:"🔗", title:"On-Chain Wallet Forensics", desc:"Complete transaction history, liquidity activity, token launches, and linked wallet clusters.", color:T.accent },
            { icon:"🐦", title:"Twitter Dev Mapper", desc:"Link Twitter accounts to on-chain wallets. Expose anonymous devs hiding behind personas.", color:T.blue },
            { icon:"⚡", title:"Real-Time Rug Detection", desc:"Pattern recognition across 50+ rug indicators. Get warned before the exit happens.", color:T.amber },
            { icon:"📡", title:"Telegram Alerts Bot", desc:"@WhoDevBot delivers instant alerts to your Telegram when watched wallets move.", color:T.green },
            { icon:"🏆", title:"Developer Risk Score", desc:"Each dev gets a composite risk score based on history, behaviour, and associations.", color:T.red },
            { icon:"🌐", title:"Multi-Language", desc:"Full English and Arabic interface. Built for the global Solana community.", color:T.muted },
          ].map((f,i) => (
            <Card key={i} style={{ cursor:"default" }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>{f.title}</div>
              <div style={{ color:T.muted, fontSize:14, lineHeight:1.6 }}>{f.desc}</div>
              <div style={{ height:2, background:`linear-gradient(90deg,${f.color},transparent)`,
                borderRadius:1, marginTop:16 }} />
            </Card>
          ))}
        </div>
      </div>

      {/* Follow Builder */}
      <div style={{ maxWidth:1100, margin:"0 auto 60px", padding:"0 20px" }}>
        <Card glow style={{ background:`linear-gradient(135deg,${T.accentLo},${T.blueLo})`,
          border:`1px solid ${T.accent}44`, textAlign:"center", padding:"40px 24px" }}>
          <div style={{ fontFamily:T.mono, fontSize:11, color:T.accent, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12 }}>
            Follow the Builder
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, flexWrap:"wrap", marginBottom:16 }}>
            <div style={{ width:56, height:56, borderRadius:"50%",
              background:`linear-gradient(135deg,${T.accent},${T.blue})`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <XIcon size={22} color="#fff"/>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontFamily:T.disp, fontSize:28, letterSpacing:".06em" }}>@Khloud132</div>
              <div style={{ color:T.muted, fontSize:14 }}>Building WHODEV — Solana Intelligence</div>
            </div>
          </div>
          <p style={{ color:T.muted, fontSize:14, maxWidth:460, margin:"0 auto 24px", lineHeight:1.7 }}>
            Follow the creator of WHODEV for updates, alpha, and Solana intelligence insights.
          </p>
          <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
            <BtnPrimary><XIcon size={15} color="#fff"/> Follow @Khloud132</BtnPrimary>
          </a>
        </Card>
      </div>

      {/* CTA */}
      <div style={{ textAlign:"center", padding:"60px 20px",
        background:`linear-gradient(180deg,transparent,${T.surface})` }}>
        <h2 style={{ fontFamily:T.disp, fontSize:"clamp(28px,6vw,52px)", letterSpacing:".06em", marginBottom:16 }}>
          STOP GETTING RUGGED
        </h2>
        <p style={{ color:T.muted, maxWidth:440, margin:"0 auto 28px", lineHeight:1.7 }}>
          لا تثق، تحقق — Don't trust. Verify. Start scanning any Solana address for free.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <BtnPrimary onClick={() => setPage("search")}>Start Scanning Free</BtnPrimary>
          <BtnGhost onClick={() => setPage("alerts")}><BellIcon size={14}/> Set Up Alerts</BtnGhost>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SEARCH PAGE
═══════════════════════════════════════════ */
const SearchPage = ({ setPage }) => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("wallet");
  const examples = {
    wallet: ["9xB3Kf7vR2mN4pQ8wL1sD6hJ5yC0uT3eA7iG9kF2o", "3Fs9Qm2xK7rN1pL4vD8hB6yC0wT5eA9iG3kF7oR2"],
    token:  ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "So11111111111111111111111111111111111111112"],
    twitter:["@elonmusk","@SolanaLegend"],
  };
  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"48px 20px 80px" }}>
      <div style={{ marginBottom:32, textAlign:"center" }}>
        <Tag color={T.accent}>Intelligence Engine</Tag>
        <h1 style={{ fontFamily:T.disp, fontSize:40, letterSpacing:".06em", marginTop:10, marginBottom:8 }}>ANALYSE ADDRESS</h1>
        <p style={{ color:T.muted }}>تحليل العنوان — Wallet · Token · Twitter</p>
      </div>

      {/* Mode tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:T.card,
        borderRadius:T.r, padding:4, border:`1px solid ${T.border}` }}>
        {[["wallet","💳 Wallet"],["token","🪙 Token"],["twitter","🐦 Twitter"]].map(([k,l]) => (
          <button key={k} onClick={() => setMode(k)}
            style={{ flex:1, padding:"9px 8px", borderRadius:8, border:"none", cursor:"pointer",
              fontFamily:T.font, fontWeight:600, fontSize:13, transition:"all .15s",
              background: mode===k ? T.accent : "transparent",
              color: mode===k ? "#fff" : T.muted }}>
            {l}
          </button>
        ))}
      </div>

      <Card style={{ marginBottom:20 }}>
        <div style={{ display:"flex", gap:10, alignItems:"center",
          background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.r, padding:12, marginBottom:12 }}>
          <SearchIcon size={18} />
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode==="twitter" ? "Enter @username or Twitter URL…" : "Enter address or contract…"}
            style={{ flex:1, background:"none", border:"none", outline:"none",
              fontFamily:T.mono, fontSize:14, color:T.text }} />
          {input && <button onClick={() => setInput("")}
            style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:18 }}>×</button>}
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
          {examples[mode].map(e => (
            <button key={e} onClick={() => setInput(e)}
              style={{ fontFamily:T.mono, fontSize:11, padding:"5px 10px", borderRadius:6,
                border:`1px solid ${T.border}`, background:"none", color:T.muted, cursor:"pointer",
                maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {e}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <BtnPrimary onClick={() => setPage(mode==="twitter" ? "twitter-report" : "report")} style={{ flex:1, justifyContent:"center" }}>
            <ZapIcon size={15} color="#fff"/> Analyse Now
          </BtnPrimary>
          {mode==="twitter" && (
            <BtnBlue onClick={() => setPage("twitter")}><XIcon size={14} color="#fff"/> Twitter Mode</BtnBlue>
          )}
        </div>
      </Card>

      {/* Recent scans */}
      <div style={{ marginTop:32 }}>
        <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".1em",
          textTransform:"uppercase", marginBottom:12 }}>Recent Activity</div>
        {[
          { addr:"9xB3Kf…F2o", risk:82, type:"wallet", time:"2m ago" },
          { addr:"EPjFWdd…1v", risk:15, type:"token", time:"5m ago" },
          { addr:"@Anon_Dev", risk:67, type:"twitter", time:"11m ago" },
        ].map((r,i) => (
          <div key={i} onClick={() => setPage("report")}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"12px 16px", background:T.card, border:`1px solid ${T.border}`,
              borderRadius:T.r, marginBottom:8, cursor:"pointer", transition:"border .2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor=T.borderHi}
            onMouseLeave={e => e.currentTarget.style.borderColor=T.border}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <Tag color={r.type==="wallet"?T.accent:r.type==="token"?T.green:T.blue} small>
                {r.type}
              </Tag>
              <span style={{ fontFamily:T.mono, fontSize:13 }}>{r.addr}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ color: r.risk>=75?T.red:r.risk>=45?T.amber:T.green,
                fontFamily:T.mono, fontSize:13, fontWeight:700 }}>
                {r.risk}
              </span>
              <span style={{ color:T.muted, fontSize:12 }}>{r.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   WALLET REPORT PAGE
═══════════════════════════════════════════ */
const ReportPage = () => {
  const addr = "9xB3Kf7vR2mN4pQ8wL1sD6hJ5yC0uT3eA7iG9kF2o";
  const txns = [
    { hash:"2aKf…9m", type:"Swap",   token:"SOL→USDC", amount:"1,240 SOL", time:"3m ago",  flag:false },
    { hash:"7bQr…3n", type:"Remove", token:"WIF/SOL",  amount:"88,000 WIF", time:"18m ago", flag:true  },
    { hash:"5cPx…8k", type:"Mint",   token:"ANON",     amount:"1B tokens",  time:"2h ago",  flag:true  },
    { hash:"1dZv…2j", type:"Transfer",token:"USDC",    amount:"$42,000",    time:"6h ago",  flag:false },
    { hash:"4eWm…6i", type:"Swap",   token:"BONK→SOL", amount:"5M BONK",   time:"1d ago",  flag:false },
  ];
  return (
    <ReportLayout
      tag={<Tag color={T.red}>⚠ Flagged Account</Tag>}
      title={addr.slice(0,8)+"…"+addr.slice(-4)}
      subtitle={"Full address: "+addr}
      risk={82}
      actions={[
        <BtnGhost small key="copy"><span>📋</span> Copy</BtnGhost>,
        <a key="sol" href={`https://solscan.io/account/${addr}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
          <BtnGhost small><ExternalIcon size={12}/> Solscan</BtnGhost>
        </a>,
        <BtnPrimary small key="alert"><BellIcon size={13}/> Alert Me</BtnPrimary>,
      ]}>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
        {[
          { label:"SOL Balance",    value:"1,847.32",  color:T.accent },
          { label:"Tokens Held",    value:"24",        color:T.blue   },
          { label:"Total Txns",     value:"3,291",     color:T.text   },
          { label:"Rugs Linked",    value:"4",         color:T.red    },
          { label:"First Activity", value:"Feb 2023",  color:T.muted  },
          { label:"Risk Score",     value:"82 / 100",  color:T.red    },
        ].map((m,i) => (
          <Card key={i} style={{ padding:16 }}>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:"uppercase",
              letterSpacing:".1em", marginBottom:6 }}>{m.label}</div>
            <div style={{ fontWeight:700, fontSize:20, color:m.color, fontFamily:T.mono }}>{m.value}</div>
          </Card>
        ))}
      </div>

      {/* Flags */}
      <Card style={{ marginBottom:24, border:`1px solid ${T.red}44`, background:T.redLo+"80" }}>
        <div style={{ fontFamily:T.mono, fontSize:11, color:T.red, letterSpacing:".12em",
          textTransform:"uppercase", marginBottom:12 }}>Risk Indicators</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:8 }}>
          {["Liquidity removed 3x in 30 days","Minted anonymous token with 0 docs","Linked to 2 known rug wallets","Abnormal token distribution pattern"].map((f,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:T.text }}>
              <span style={{ color:T.red, fontSize:16 }}>⚠</span> {f}
            </div>
          ))}
        </div>
      </Card>

      {/* Transaction history */}
      <Card style={{ marginBottom:24 }}>
        <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em",
          textTransform:"uppercase", marginBottom:16 }}>Transaction History</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:T.mono, fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                {["Hash","Type","Token","Amount","Time","Flag"].map(h => (
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:T.muted,
                    fontWeight:400, fontSize:11, letterSpacing:".08em", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txns.map((t,i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${T.border}22`,
                  background: t.flag ? T.redLo+"44" : "transparent" }}>
                  <td style={{ padding:"10px 12px", color:T.accent }}>{t.hash}</td>
                  <td style={{ padding:"10px 12px" }}>{t.type}</td>
                  <td style={{ padding:"10px 12px", color:T.muted }}>{t.token}</td>
                  <td style={{ padding:"10px 12px", fontWeight:600 }}>{t.amount}</td>
                  <td style={{ padding:"10px 12px", color:T.muted }}>{t.time}</td>
                  <td style={{ padding:"10px 12px" }}>
                    {t.flag ? <Tag color={T.red}>⚠</Tag> : <Tag color={T.green} bg={T.greenLo}>✓</Tag>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Linked wallets */}
      <Card>
        <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em",
          textTransform:"uppercase", marginBottom:12 }}>Linked Wallet Cluster</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {["7pKm…3Rn","2qYf…8Ws","5tBx…1Lv","4rNj…6Pk"].map((w,i) => (
            <span key={i} style={{ fontFamily:T.mono, fontSize:12, padding:"6px 12px",
              background:T.faint, borderRadius:6, color: i<2 ? T.red : T.muted }}>
              {w} {i<2 && "⚠"}
            </span>
          ))}
        </div>
      </Card>
    </ReportLayout>
  );
};

/* ═══════════════════════════════════════════
   TWITTER SCANNER PAGE
═══════════════════════════════════════════ */
const TwitterPage = ({ setPage }) => {
  const [handle, setHandle] = useState("");
  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"48px 20px 80px" }}>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <Tag color={T.blue}>Twitter Intelligence</Tag>
        <h1 style={{ fontFamily:T.disp, fontSize:40, letterSpacing:".06em", marginTop:10, marginBottom:8 }}>
          TWITTER DEV MAPPER
        </h1>
        <p style={{ color:T.muted, maxWidth:500, margin:"0 auto" }}>
          Link Twitter accounts to on-chain Solana wallets. Unmask anonymous developers hiding behind social personas.
        </p>
      </div>

      <Card style={{ marginBottom:32 }}>
        <div style={{ display:"flex", gap:10, background:T.surface,
          border:`1px solid ${T.border}`, borderRadius:T.r, padding:12, marginBottom:16 }}>
          <XIcon size={18} color={T.muted} />
          <input value={handle} onChange={e => setHandle(e.target.value)}
            placeholder="@username, Twitter URL, or bio keyword…"
            style={{ flex:1, background:"none", border:"none", outline:"none",
              fontFamily:T.font, fontSize:15, color:T.text }} />
        </div>
        <BtnBlue onClick={() => setPage("twitter-report")} style={{ width:"100%", justifyContent:"center" }}>
          <XIcon size={15} color="#fff"/> Scan Twitter Profile
        </BtnBlue>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
        {[
          { title:"Wallet Linking", desc:"Match Twitter bios and posts to on-chain addresses" },
          { title:"Identity Graph", desc:"Map social connections to dev clusters and rug history" },
          { title:"Post Analysis", desc:"Flag pump signals, coordinated shilling, deletion patterns" },
          { title:"Cross-Platform", desc:"Link Twitter → Telegram → Discord → on-chain" },
        ].map((f,i) => (
          <Card key={i} style={{ padding:18 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>{f.title}</div>
            <div style={{ color:T.muted, fontSize:13, lineHeight:1.6 }}>{f.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   TWITTER REPORT PAGE
═══════════════════════════════════════════ */
const TwitterReportPage = () => (
  <ReportLayout
    tag={<Tag color={T.blue}><XIcon size={11} color={T.blue}/> Twitter Analysis</Tag>}
    title="@Anon_Dev_Sol"
    subtitle="Scanned: 847 tweets · 3 linked wallets · 12 flagged posts"
    risk={67}
    actions={[
      <a key="tw" href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
        <BtnGhost small><XIcon size={12}/> View Profile</BtnGhost>
      </a>,
      <BtnPrimary small key="w"><EyeIcon size={13}/> Track Wallet</BtnPrimary>,
    ]}>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
      {[
        { label:"Account Age",    value:"8 months", color:T.amber },
        { label:"Followers",      value:"4,291",    color:T.text  },
        { label:"Wallets Linked", value:"3",        color:T.accent},
        { label:"Flagged Tweets", value:"12",       color:T.red   },
      ].map((m,i) => (
        <Card key={i} style={{ padding:16 }}>
          <div style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:"uppercase",
            letterSpacing:".1em", marginBottom:6 }}>{m.label}</div>
          <div style={{ fontWeight:700, fontSize:20, color:m.color, fontFamily:T.mono }}>{m.value}</div>
        </Card>
      ))}
    </div>

    <Card style={{ marginBottom:24 }}>
      <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em",
        textTransform:"uppercase", marginBottom:12 }}>Linked On-Chain Wallets</div>
      {[
        { addr:"9xB3Kf…F2o", risk:82, label:"High Risk", color:T.red },
        { addr:"4mTp…Kn2", risk:34, label:"Low Risk",  color:T.green },
        { addr:"7vQs…Yx8", risk:55, label:"Medium",    color:T.amber },
      ].map((w,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"10px 14px", background:T.surface, borderRadius:T.r, marginBottom:8 }}>
          <span style={{ fontFamily:T.mono, fontSize:13 }}>{w.addr}</span>
          <Tag color={w.color}>{w.label} · {w.risk}</Tag>
        </div>
      ))}
    </Card>

    <Card>
      <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em",
        textTransform:"uppercase", marginBottom:12 }}>Flagged Tweet Patterns</div>
      {["Coordinated pump posts detected (3 wallets, same timeframe)",
        "Account deleted 40+ tweets after token price crashed",
        "Bio contains 3 addresses linked to previous rug projects"].map((f,i) => (
        <div key={i} style={{ display:"flex", gap:10, padding:"10px 0",
          borderBottom: i<2 ? `1px solid ${T.border}22` : "none" }}>
          <span style={{ color:T.amber, fontSize:18, flexShrink:0 }}>⚡</span>
          <span style={{ fontSize:14, lineHeight:1.5 }}>{f}</span>
        </div>
      ))}
    </Card>
  </ReportLayout>
);

/* ═══════════════════════════════════════════
   ALERTS PAGE
═══════════════════════════════════════════ */
const AlertsPage = () => {
  const [wallet, setWallet] = useState("");
  const [watchlist, setWatchlist] = useState([
    { addr:"9xB3Kf…F2o", risk:82, active:true  },
    { addr:"4mTp…Kn2",   risk:34, active:true  },
    { addr:"7vQs…Yx8",   risk:55, active:false },
  ]);
  const [alerts, setAlerts] = useState({ rug:true, liq:true, whale:false, transfer:true, mint:false });
  const toggle = k => setAlerts(a => ({ ...a, [k]:!a[k] }));
  const addWallet = () => {
    if (!wallet.trim()) return;
    setWatchlist(w => [...w, { addr:wallet.slice(0,6)+"…"+wallet.slice(-3), risk:Math.floor(Math.random()*100), active:true }]);
    setWallet("");
  };

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"48px 20px 80px" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <Tag color={T.green}><TgIcon size={11} color={T.green}/> Telegram Alerts</Tag>
        <h1 style={{ fontFamily:T.disp, fontSize:40, letterSpacing:".06em", marginTop:10, marginBottom:8 }}>
          REAL-TIME ALERTS
        </h1>
        <p style={{ color:T.muted, maxWidth:480, margin:"0 auto" }}>
          Get instant Telegram notifications when wallets on your watchlist make suspicious moves.
          <br/><span style={{ fontFamily:T.arab, direction:"rtl", display:"block", marginTop:4 }}>
            احصل على تنبيهات فورية عبر تيليغرام عند رصد نشاط مشبوه
          </span>
        </p>
      </div>

      {/* Setup steps */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:0, background:T.card,
        border:`1px solid ${T.border}`, borderRadius:T.r2, marginBottom:32, overflow:"hidden" }}>
        {[
          { n:1, icon:"🤖", title:"Start the Bot", desc:'Open Telegram and send /start to @WhoDevBot',
            cta:<a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}><BtnBlue small><TgIcon size={13} color="#fff"/>Open @WhoDevBot</BtnBlue></a> },
          { n:2, icon:"🔑", title:"Get Your Key", desc:"The bot will send you a unique API key. Copy it.",
            cta:<BtnGhost small>Copy Key</BtnGhost> },
          { n:3, icon:"✅", title:"Link & Activate", desc:"Paste your key below to activate alerts.",
            cta:<BtnPrimary small><ZapIcon size={13} color="#fff"/>Activate</BtnPrimary> },
        ].map((s,i) => (
          <div key={i} style={{ flex:1, minWidth:200, padding:24,
            borderRight: i<2 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.accent, letterSpacing:".12em",
              textTransform:"uppercase", marginBottom:6 }}>Step {s.n}</div>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>{s.title}</div>
            <div style={{ color:T.muted, fontSize:13, lineHeight:1.6, marginBottom:12 }}>{s.desc}</div>
            {s.cta}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        {/* Alert types */}
        <Card>
          <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em",
            textTransform:"uppercase", marginBottom:16 }}>Alert Types</div>
          {[
            { k:"rug",      label:"Rug Pulls",          desc:"LP removed, dev wallet dumps", color:T.red   },
            { k:"liq",      label:"Liquidity Events",   desc:"Large add/remove events",      color:T.amber },
            { k:"whale",    label:"Whale Movements",    desc:">$100k wallet transfers",      color:T.blue  },
            { k:"transfer", label:"Suspicious Transfers",desc:"Flagged wallet interactions", color:T.accent},
            { k:"mint",     label:"New Token Mints",    desc:"Dev creates new tokens",       color:T.green },
          ].map(a => (
            <div key={a.k} onClick={() => toggle(a.k)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"10px 0", borderBottom:`1px solid ${T.border}22`, cursor:"pointer" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:2, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:a.color, display:"inline-block" }}/>
                  {a.label}
                </div>
                <div style={{ fontSize:12, color:T.muted }}>{a.desc}</div>
              </div>
              <div style={{ width:40, height:22, borderRadius:11, background: alerts[a.k] ? T.accent : T.faint,
                transition:"background .2s", position:"relative", flexShrink:0 }}>
                <div style={{ position:"absolute", top:3, left: alerts[a.k] ? 21 : 3, width:16, height:16,
                  borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
              </div>
            </div>
          ))}
        </Card>

        {/* Watchlist */}
        <Card>
          <div style={{ fontFamily:T.mono, fontSize:11, color:T.muted, letterSpacing:".12em",
            textTransform:"uppercase", marginBottom:16 }}>Watchlist</div>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            <input value={wallet} onChange={e => setWallet(e.target.value)}
              onKeyDown={e => e.key==="Enter" && addWallet()}
              placeholder="Add wallet address…"
              style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.r,
                padding:"8px 12px", fontFamily:T.mono, fontSize:13, color:T.text, outline:"none" }} />
            <BtnPrimary small onClick={addWallet}>+</BtnPrimary>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {watchlist.map((w,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"9px 12px", background:T.surface, borderRadius:T.r,
                border:`1px solid ${w.risk>=75?T.red+"44":T.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%",
                    background: w.active ? T.green : T.faint, flexShrink:0 }}/>
                  <span style={{ fontFamily:T.mono, fontSize:12 }}>{w.addr}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontFamily:T.mono, fontSize:12,
                    color: w.risk>=75?T.red:w.risk>=45?T.amber:T.green }}>{w.risk}</span>
                  <button onClick={() => setWatchlist(wl => wl.filter((_,j) => j!==i))}
                    style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16 }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sample alert */}
      <Card style={{ marginTop:16, border:`1px solid ${T.green}44`, background:T.greenLo }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:T.green,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <TgIcon size={20} color="#000"/>
          </div>
          <div>
            <div style={{ fontFamily:T.mono, fontSize:11, color:T.green, marginBottom:4 }}>
              @WhoDevBot · Just now
            </div>
            <div style={{ fontWeight:700, marginBottom:4 }}>🚨 HIGH RISK ALERT — 9xB3Kf…F2o</div>
            <div style={{ color:T.muted, fontSize:13, lineHeight:1.6 }}>
              Liquidity removed: 88,000 WIF ($12,400) withdrawn from WIF/SOL pool.<br/>
              Risk Score jumped from 55 → 82. Linked to 2 previous rug events.<br/>
              <span style={{ color:T.green }}>Tap to view full report →</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════ */
const AboutPage = () => (
  <div style={{ maxWidth:800, margin:"0 auto", padding:"48px 20px 80px" }}>
    <div style={{ textAlign:"center", marginBottom:48 }}>
      <div style={{ width:72, height:72, borderRadius:T.r2,
        background:`linear-gradient(135deg,${T.accent},${T.green})`,
        display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
        <SolIcon size={36} />
      </div>
      <Tag color={T.accent}>About</Tag>
      <h1 style={{ fontFamily:T.disp, fontSize:40, letterSpacing:".06em", marginTop:10, marginBottom:8 }}>ABOUT WHODEV</h1>
      <p style={{ color:T.muted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
        WHODEV is an on-chain intelligence platform for the Solana ecosystem, built to protect investors and expose bad actors before they strike.
      </p>
    </div>

    <Card style={{ marginBottom:16 }}>
      <div style={{ fontWeight:700, fontSize:18, marginBottom:10 }}>The Mission</div>
      <p style={{ color:T.muted, lineHeight:1.8, marginBottom:10 }}>
        Solana moves fast. Rugs move faster. WHODEV exists to level the playing field — giving retail investors the same intelligence that sophisticated players have always had.
      </p>
      <p style={{ color:T.muted, lineHeight:1.8, fontFamily:T.arab, direction:"rtl" }}>
        سولانا تتحرك بسرعة. عمليات السحب تتحرك بشكل أسرع. وُجد WHODEV لتسوية الفرص — منح المستثمرين الأفراد نفس الاستخبارات التي يمتلكها اللاعبون المتمرسون دائماً.
      </p>
    </Card>

    <Card style={{ marginBottom:16 }}>
      <div style={{ fontWeight:700, fontSize:18, marginBottom:10 }}>Built By</div>
      <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", gap:14, textDecoration:"none",
          padding:"14px 16px", background:T.surface, borderRadius:T.r,
          border:`1px solid ${T.border}`, marginBottom:14, transition:"all .2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; }}>
        <div style={{ width:48, height:48, borderRadius:"50%",
          background:`linear-gradient(135deg,${T.accent},${T.blue})`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <XIcon size={20} color="#fff"/>
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:16 }}>@Khloud132</div>
          <div style={{ color:T.muted, fontSize:13 }}>Builder & Creator — Follow on X for updates</div>
        </div>
        <ExternalIcon size={14} />
      </a>
      <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", gap:14, textDecoration:"none",
          padding:"14px 16px", background:T.surface, borderRadius:T.r,
          border:`1px solid ${T.border}`, transition:"all .2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor=T.blue; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; }}>
        <div style={{ width:48, height:48, borderRadius:"50%", background:T.blue+"33",
          border:`1px solid ${T.blue}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <XIcon size={20} color={T.blue}/>
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:16 }}>@whodevxyz</div>
          <div style={{ color:T.muted, fontSize:13 }}>Official platform account — latest updates & alerts</div>
        </div>
        <ExternalIcon size={14} />
      </a>
    </Card>

    <Card style={{ marginBottom:16 }}>
      <div style={{ fontWeight:700, fontSize:18, marginBottom:14 }}>Verified & Trusted</div>
      <a href="https://orynth.dev/projects/whodev" target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none",
          padding:"14px 16px", background:T.surface, borderRadius:T.r,
          border:`1px solid ${T.border}`, transition:"all .2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor=T.blue; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; }}>
        <span style={{ fontSize:28 }}>🔷</span>
        <div>
          <div style={{ fontWeight:700, fontSize:15 }}>Verified on Orynth</div>
          <div style={{ color:T.muted, fontSize:13 }}>orynth.dev/projects/whodev — independently verified project listing</div>
        </div>
        <ExternalIcon size={14} />
      </a>
    </Card>

    <Card>
      <div style={{ fontWeight:700, fontSize:18, marginBottom:12 }}>Connect</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
        <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
          <BtnGhost><XIcon size={14}/>@whodevxyz</BtnGhost>
        </a>
        <a href="https://t.me/WhoDevBot" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
          <BtnBlue><TgIcon size={14} color="#fff"/>@WhoDevBot</BtnBlue>
        </a>
        <a href="https://x.com/Khloud132" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
          <BtnPrimary><XIcon size={14} color="#fff"/>Follow Builder</BtnPrimary>
        </a>
      </div>
    </Card>
  </div>
);

/* ═══════════════════════════════════════════
   ONBOARDING MODAL
═══════════════════════════════════════════ */
const OnboardingModal = ({ onClose }) => (
  <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex",
    alignItems:"center", justifyContent:"center", padding:20,
    background:"rgba(0,0,0,.8)", backdropFilter:"blur(8px)" }}
    onClick={onClose}>
    <div onClick={e => e.stopPropagation()}
      style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:T.r3,
        maxWidth:460, width:"100%", padding:32, boxShadow:T.shadow }}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ width:56, height:56, borderRadius:T.r2,
          background:`linear-gradient(135deg,${T.accent},${T.green})`,
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
          <ShieldIcon size={26} color="#fff"/>
        </div>
        <h2 style={{ fontFamily:T.disp, fontSize:28, letterSpacing:".06em", marginBottom:6 }}>WELCOME TO WHODEV</h2>
        <p style={{ color:T.muted, fontSize:14, lineHeight:1.6 }}>
          Solana on-chain intelligence. Expose rugs. Unmask devs.
        </p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {[
          ["🔍","Analyse any Solana wallet, token, or Twitter account"],
          ["🚨","Set up Telegram alerts for wallets you're watching"],
          ["🐦","Map Twitter accounts to on-chain identities"],
          ["⚡","Get risk scores before you ape in"],
        ].map(([icon,text],i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
            padding:"10px 14px", background:T.surface, borderRadius:T.r, fontSize:14 }}>
            <span style={{ fontSize:18 }}>{icon}</span> {text}
          </div>
        ))}
      </div>
      <BtnPrimary onClick={onClose} style={{ width:"100%", justifyContent:"center", fontSize:16 }}>
        Start Scanning Free <ZapIcon size={15} color="#fff"/>
      </BtnPrimary>
      <div style={{ textAlign:"center", marginTop:14 }}>
        <a href="https://x.com/whodevxyz" target="_blank" rel="noopener noreferrer"
          style={{ color:T.muted, fontSize:12, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5 }}>
          <XIcon size={11}/> @whodevxyz
        </a>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [onboarding, setOnboarding] = useState(true);

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const renderPage = () => {
    switch(page) {
      case "home":           return <HomePage setPage={changePage} />;
      case "search":         return <SearchPage setPage={changePage} />;
      case "report":         return <ReportPage />;
      case "twitter":        return <TwitterPage setPage={changePage} />;
      case "twitter-report": return <TwitterReportPage />;
      case "alerts":         return <AlertsPage />;
      case "about":          return <AboutPage />;
      default:               return <HomePage setPage={changePage} />;
    }
  };

  return (
    <div style={gStyle}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:${T.borderHi}}
        ::selection{background:${T.accentLo};color:${T.accent}}
        a{color:inherit}
        input::placeholder{color:${T.muted}}
        @media(max-width:600px){
          .hide-mobile{display:none!important}
          table{font-size:12px}
        }
      `}</style>

      {onboarding && <OnboardingModal onClose={() => setOnboarding(false)} />}
      <Nav page={page} setPage={changePage} />
      <main>{renderPage()}</main>
      <Footer setPage={changePage} />
    </div>
  );
}
