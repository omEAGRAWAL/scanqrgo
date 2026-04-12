import React, { useState, useEffect, useRef } from "react";

/* ──────────────────────────────────────────────
   Inline styles as a design system (no Tailwind)
────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  :root {
    --primary:        #232F3E;
    --primary-light:  #37475A;
    --orange:         #FF9900;
    --orange-dark:    #E68A00;
    --orange-glow:    rgba(255,153,0,0.25);
    --accent:         #146EB4;
    --success:        #1AAD72;
    --danger:         #C7511F;
    --text:           #0F1111;
    --text-muted:     #5A6270;
    --bg:             #FFFFFF;
    --bg-light:       #F4F6FA;
    --border:         #D5D9E0;
    --glass:          rgba(255,255,255,0.06);
    --radius-sm:      6px;
    --radius-md:      12px;
    --radius-lg:      20px;
    --shadow-sm:      0 2px 8px rgba(0,0,0,0.08);
    --shadow-md:      0 8px 32px rgba(0,0,0,0.12);
    --shadow-lg:      0 20px 60px rgba(0,0,0,0.18);
    --transition:     0.3s cubic-bezier(0.4,0,0.2,1);
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--text);
    background: var(--bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-light); }
  ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 99px; }

  /* ── Header ── */
  .lp-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(35,47,62,0.96);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 14px 0;
    transition: var(--transition);
  }
  .lp-header.scrolled {
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
    padding: 10px 0;
  }
  .lp-nav { max-width:1180px; margin:0 auto; padding:0 24px; display:flex; align-items:center; justify-content:space-between; }
  .lp-logo { font-size:26px; font-weight:900; color:#fff; letter-spacing:-1px; }
  .lp-logo span { color:var(--orange); }
  .lp-nav-links { display:flex; gap:8px; align-items:center; }
  .lp-nav-link {
    color:rgba(255,255,255,0.75); font-size:14px; font-weight:500;
    text-decoration:none; padding:8px 14px; border-radius:var(--radius-sm);
    transition:var(--transition);
  }
  .lp-nav-link:hover { color:#fff; background:rgba(255,255,255,0.08); }
  .lp-nav-cta {
    background:var(--orange); color:var(--primary); font-weight:700;
    font-size:14px; padding:10px 22px; border-radius:var(--radius-sm);
    text-decoration:none; transition:var(--transition);
    box-shadow: 0 4px 12px var(--orange-glow);
  }
  .lp-nav-cta:hover { background:var(--orange-dark); transform:translateY(-1px); box-shadow:0 6px 18px var(--orange-glow); }

  /* ── Hero ── */
  .lp-hero {
    position:relative; overflow:hidden;
    background: linear-gradient(135deg, #1a2535 0%, #2f4563 50%, #1f3350 100%);
    padding: 110px 24px 100px;
    text-align:center;
  }
  .lp-hero::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,153,0,0.15) 0%, transparent 70%);
    pointer-events:none;
  }
  .lp-hero-orb {
    position:absolute; border-radius:50%;
    filter:blur(80px); pointer-events:none;
  }
  .lp-hero-orb-1 { width:500px; height:500px; background:rgba(255,153,0,0.08); top:-100px; left:-100px; }
  .lp-hero-orb-2 { width:400px; height:400px; background:rgba(20,110,180,0.1); bottom:-80px; right:-60px; }

  .lp-hero-inner { position:relative; z-index:2; max-width:820px; margin:0 auto; }
  .lp-hero-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,153,0,0.15); border:1px solid rgba(255,153,0,0.35);
    color:#FFB830; font-size:13px; font-weight:600;
    padding:6px 16px; border-radius:99px; margin-bottom:28px;
    animation: fadeInDown 0.6s ease both;
  }
  .lp-hero-badge-dot { width:7px; height:7px; background:var(--orange); border-radius:50%; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.5; transform:scale(1.4); } }
  @keyframes fadeInDown { from{ opacity:0; transform:translateY(-20px); } to{ opacity:1; transform:translateY(0); } }
  @keyframes fadeInUp   { from{ opacity:0; transform:translateY(30px);  } to{ opacity:1; transform:translateY(0); } }
  @keyframes fadeIn     { from{ opacity:0; } to{ opacity:1; } }

  .lp-h1 {
    font-size:clamp(36px,6vw,62px); font-weight:900; color:#fff;
    line-height:1.12; letter-spacing:-2px; margin-bottom:24px;
    animation: fadeInUp 0.7s 0.1s ease both;
  }
  .lp-h1 .hl { color:var(--orange); }

  .lp-hero-sub {
    font-size:clamp(16px,2vw,20px); color:rgba(255,255,255,0.75);
    max-width:620px; margin:0 auto 40px; font-weight:400;
    animation: fadeInUp 0.7s 0.2s ease both;
  }

  .lp-trust-badges {
    display:flex; justify-content:center; align-items:center; gap:32px;
    flex-wrap:wrap; margin-bottom:44px;
    animation: fadeInUp 0.7s 0.3s ease both;
  }
  .lp-badge {
    display:flex; align-items:center; gap:8px;
    color:rgba(255,255,255,0.85); font-size:13px; font-weight:500;
  }
  .lp-badge svg { color:var(--orange); flex-shrink:0; }

  .lp-cta-group { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; animation: fadeInUp 0.7s 0.4s ease both; }
  .lp-btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:15px 34px; border-radius:var(--radius-sm);
    font-weight:700; font-size:16px; text-decoration:none;
    transition:var(--transition); cursor:pointer; border:none; font-family:inherit;
  }
  .lp-btn-primary {
    background:var(--orange); color:var(--primary);
    box-shadow:0 6px 20px var(--orange-glow);
  }
  .lp-btn-primary:hover { background:var(--orange-dark); transform:translateY(-2px); box-shadow:0 10px 28px var(--orange-glow); }
  .lp-btn-secondary {
    background:rgba(255,255,255,0.08); color:#fff;
    border:1.5px solid rgba(255,255,255,0.25);
    backdrop-filter:blur(8px);
  }
  .lp-btn-secondary:hover { background:rgba(255,255,255,0.14); transform:translateY(-2px); }

  /* ── Stats row ── */
  .lp-stats-row {
    background:var(--primary); padding:0;
    border-bottom:1px solid rgba(255,255,255,0.06);
  }
  .lp-stats-inner {
    max-width:1180px; margin:0 auto; padding:0 24px;
    display:grid; grid-template-columns:repeat(4,1fr);
  }
  .lp-stat {
    padding:36px 24px; text-align:center;
    border-right:1px solid rgba(255,255,255,0.08);
  }
  .lp-stat:last-child { border-right:none; }
  .lp-stat-num { font-size:36px; font-weight:900; color:var(--orange); letter-spacing:-1px; }
  .lp-stat-label { font-size:13px; color:rgba(255,255,255,0.6); margin-top:4px; font-weight:500; }

  /* ── Section base ── */
  .lp-section { padding:100px 24px; }
  .lp-container { max-width:1180px; margin:0 auto; }
  .lp-section-tag {
    display:inline-block; background:rgba(255,153,0,0.12); color:var(--orange);
    font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
    padding:5px 14px; border-radius:99px; margin-bottom:16px;
    border:1px solid rgba(255,153,0,0.25);
  }
  .lp-section-title { font-size:clamp(28px,4vw,42px); font-weight:800; letter-spacing:-1px; margin-bottom:16px; line-height:1.2; }
  .lp-section-sub { color:var(--text-muted); font-size:18px; max-width:620px; }
  .lp-section-header { margin-bottom:64px; }
  .lp-section-header.center { text-align:center; }
  .lp-section-header.center .lp-section-sub { margin:0 auto; }

  /* ── Problem section ── */
  .lp-problem { background: var(--bg-light); }
  .lp-problem-grid {
    display:grid; grid-template-columns:repeat(3,1fr); gap:24px;
  }
  .lp-problem-card {
    background:#fff; border:1.5px solid var(--border);
    border-radius:var(--radius-md); padding:32px;
    transition:var(--transition); position:relative; overflow:hidden;
  }
  .lp-problem-card::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, rgba(255,153,0,0.04), transparent);
    opacity:0; transition:var(--transition);
  }
  .lp-problem-card:hover { border-color:var(--orange); box-shadow: 0 8px 32px rgba(255,153,0,0.12); transform:translateY(-4px); }
  .lp-problem-card:hover::before { opacity:1; }
  .lp-problem-icon { font-size:36px; margin-bottom:18px; }
  .lp-problem-card h3 { font-size:18px; font-weight:700; margin-bottom:10px; }
  .lp-problem-card p { font-size:14px; color:var(--text-muted); line-height:1.7; }

  /* ── Talk CTA strip ── */
  .lp-talk-strip {
    background:#fff; border-top:1px solid var(--border); border-bottom:1px solid var(--border);
    padding:60px 24px; text-align:center;
  }
  .lp-talk-strip h3 { font-size:28px; font-weight:800; margin-bottom:10px; letter-spacing:-0.5px; }
  .lp-talk-strip p { color:var(--text-muted); font-size:16px; margin-bottom:28px; }
  .lp-btn-outline {
    background:transparent; color:var(--primary); border:2px solid var(--primary);
    padding:14px 32px; font-weight:700; font-size:15px; border-radius:var(--radius-sm);
    cursor:pointer; transition:var(--transition); text-decoration:none; display:inline-flex; align-items:center; gap:8px; font-family:inherit;
  }
  .lp-btn-outline:hover { background:var(--primary); color:#fff; transform:translateY(-2px); }

  /* ── How it works ── */
  .lp-how { background:#fff; }
  .lp-how-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:0; position:relative; }
  .lp-how-grid::before {
    content:''; position:absolute; top:36px; left:10%; right:10%; height:2px;
    background: linear-gradient(90deg, var(--orange), rgba(255,153,0,0.2));
    z-index:0;
  }
  .lp-how-step { text-align:center; position:relative; z-index:1; padding:0 16px; }
  .lp-step-num {
    width:72px; height:72px; border-radius:50%;
    background: linear-gradient(135deg, var(--orange), #FFBA50);
    color:#fff; font-size:26px; font-weight:900;
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 24px;
    box-shadow:0 8px 24px var(--orange-glow);
    transition:var(--transition);
  }
  .lp-how-step:hover .lp-step-num { transform:scale(1.1); box-shadow:0 12px 32px var(--orange-glow); }
  .lp-how-step h4 { font-size:16px; font-weight:700; margin-bottom:10px; }
  .lp-how-step p { font-size:13px; color:var(--text-muted); line-height:1.7; }

  /* QR visual */
  .lp-qr-visual {
    margin-top:72px; background:var(--bg-light); border-radius:var(--radius-lg);
    padding:52px; display:flex; gap:60px; align-items:center; justify-content:center;
    flex-wrap:wrap; border:1px solid var(--border);
  }
  .lp-qr-box {
    width:160px; height:160px; background:#fff; border-radius:var(--radius-md);
    border:2px solid var(--border); display:flex; align-items:center; justify-content:center;
    flex-direction:column; gap:8px; color:var(--text-muted); font-size:13px; text-align:center;
    font-weight:500; box-shadow:var(--shadow-md);
  }
  .lp-qr-box svg { color:var(--orange); }
  .lp-qr-flow { }
  .lp-qr-flow h4 { font-size:20px; font-weight:800; margin-bottom:20px; letter-spacing:-0.5px; }
  .lp-qr-flow-step {
    display:flex; align-items:center; gap:14px;
    font-size:15px; margin-bottom:14px; color:var(--text);
  }
  .lp-qr-arrow {
    width:28px; height:28px; border-radius:50%; background:var(--orange);
    color:#fff; display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; flex-shrink:0;
  }

  /* ── Social proof ── */
  .lp-proof { background:var(--bg-light); }
  .lp-testimonial-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
  .lp-testimonial {
    background:#fff; border:1.5px solid var(--border); border-radius:var(--radius-md);
    padding:32px; transition:var(--transition);
  }
  .lp-testimonial:hover { border-color:var(--orange); box-shadow:var(--shadow-md); transform:translateY(-4px); }
  .lp-stars { color:var(--orange); font-size:18px; margin-bottom:14px; letter-spacing:2px; }
  .lp-testimonial-text { font-size:14px; line-height:1.8; color:var(--text); margin-bottom:24px; font-style:italic; }
  .lp-author { display:flex; align-items:center; gap:14px; }
  .lp-avatar {
    width:48px; height:48px; border-radius:50%;
    background: linear-gradient(135deg, var(--orange), #FFBA50);
    color:#fff; font-weight:800; font-size:16px;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .lp-author-name { font-weight:700; font-size:15px; margin-bottom:2px; }
  .lp-author-role { font-size:13px; color:var(--text-muted); }

  /* ── Compliance ── */
  .lp-compliance { background:#fff; }
  .lp-compliance-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:32px; }
  .lp-compliance-item { text-align:center; padding:32px 20px; border-radius:var(--radius-md); transition:var(--transition); }
  .lp-compliance-item:hover { background:var(--bg-light); }
  .lp-compliance-icon { font-size:48px; margin-bottom:16px; }
  .lp-compliance-item h5 { font-size:16px; font-weight:700; margin-bottom:10px; }
  .lp-compliance-item p { font-size:13px; color:var(--text-muted); line-height:1.7; }

  /* ── Contact form ── */
  .lp-contact { background: linear-gradient(160deg, #f4f6fa 0%, #eef2f9 100%); }
  .lp-form-card {
    max-width:580px; margin:0 auto;
    background:#fff; border-radius:var(--radius-lg);
    padding:48px; box-shadow:var(--shadow-lg);
    border:1px solid var(--border);
  }
  .lp-form-group { margin-bottom:22px; }
  .lp-form-label { display:block; font-weight:600; font-size:13px; margin-bottom:8px; color:var(--text); }
  .lp-form-input, .lp-form-textarea {
    width:100%; padding:13px 16px; border:1.5px solid var(--border);
    border-radius:var(--radius-sm); font-size:15px; font-family:inherit;
    color:var(--text); background:#fff; transition:var(--transition); outline:none;
  }
  .lp-form-input:focus, .lp-form-textarea:focus { border-color:var(--orange); box-shadow:0 0 0 4px rgba(255,153,0,0.12); }
  .lp-form-textarea { resize:vertical; min-height:110px; }
  .lp-form-submit {
    width:100%; padding:16px; background:var(--orange); color:var(--primary);
    font-weight:800; font-size:16px; border:none; border-radius:var(--radius-sm);
    cursor:pointer; transition:var(--transition); display:flex; align-items:center; justify-content:center; gap:10px;
    font-family:inherit; box-shadow:0 6px 20px var(--orange-glow);
  }
  .lp-form-submit:hover:not(:disabled) { background:var(--orange-dark); transform:translateY(-2px); box-shadow:0 10px 28px var(--orange-glow); }
  .lp-form-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .lp-form-msg {
    padding:14px 16px; border-radius:var(--radius-sm); margin-bottom:20px;
    font-weight:600; font-size:14px; display:none;
  }
  .lp-form-msg.success { background:#DCFCE7; color:#15803D; border:1px solid #BBF7D0; display:block; }
  .lp-form-msg.error   { background:#FEE2E2; color:#991B1B; border:1px solid #FECACA; display:block; }

  /* ── Final CTA ── */
  .lp-final-cta {
    padding:110px 24px; text-align:center;
    background: linear-gradient(135deg, var(--primary) 0%, #2d4a6e 100%);
    position:relative; overflow:hidden;
  }
  .lp-final-cta::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,153,0,0.12), transparent);
    pointer-events:none;
  }
  .lp-final-cta-inner { position:relative; z-index:2; }
  .lp-final-cta h2 { font-size:clamp(28px,5vw,48px); font-weight:900; color:#fff; margin-bottom:16px; letter-spacing:-1.5px; }
  .lp-final-cta p { font-size:18px; color:rgba(255,255,255,0.75); margin-bottom:44px; }

  /* ── Footer ── */
  .lp-footer { background:var(--primary); padding:48px 24px; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
  .lp-footer-links { display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:24px; }
  .lp-footer-link {
    color:rgba(255,255,255,0.55); font-size:13px; font-weight:500;
    text-decoration:none; padding:6px 12px; border-radius:var(--radius-sm);
    transition:var(--transition);
  }
  .lp-footer-link:hover { color:#fff; background:rgba(255,255,255,0.08); }
  .lp-footer-disclaimer { font-size:12px; color:rgba(255,255,255,0.35); line-height:1.8; max-width:600px; margin:0 auto; }

  /* ── Loading spinner ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .lp-spinner {
    width:18px; height:18px; border:2.5px solid rgba(35,47,62,0.3);
    border-top-color:var(--primary); border-radius:50%;
    animation: spin 0.6s linear infinite;
  }

  /* ── Reveal animation ── */
  .lp-reveal { opacity:0; transform:translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .lp-reveal.visible { opacity:1; transform:translateY(0); }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .lp-problem-grid { grid-template-columns: repeat(2,1fr); }
    .lp-how-grid { grid-template-columns: repeat(3,1fr); gap:32px; }
    .lp-how-grid::before { display:none; }
    .lp-compliance-grid { grid-template-columns: repeat(2,1fr); }
    .lp-stats-inner { grid-template-columns: repeat(2,1fr); }
    .lp-stat { border-right:none; border-bottom:1px solid rgba(255,255,255,0.08); }
    .lp-stat:nth-child(odd) { border-right:1px solid rgba(255,255,255,0.08); }
    .lp-stat:last-child,:nth-child(3) { border-bottom:none; }
  }
  @media (max-width: 768px) {
    .lp-nav-links .lp-nav-link { display:none; }
    .lp-problem-grid, .lp-how-grid, .lp-testimonial-grid, .lp-compliance-grid { grid-template-columns:1fr; }
    .lp-stats-inner { grid-template-columns:repeat(2,1fr); }
    .lp-qr-visual { flex-direction:column; padding:32px; gap:32px; }
    .lp-form-card { padding:28px 20px; }
    .lp-section { padding:72px 24px; }
  }
  @media (max-width: 480px) {
    .lp-stats-inner { grid-template-columns:1fr; }
    .lp-btn { padding:13px 22px; font-size:15px; }
  }
`;

/* ─────────────────────────────────────────── */

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = "", style = {}, tag = "div", delay = 0 }) {
  const ref = useReveal();
  const Tag = tag;
  return (
    <Tag ref={ref} className={`lp-reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

/* ─────────────── Sub-components ─────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`lp-header${scrolled ? " scrolled" : ""}`}>
      <nav className="lp-nav">
        <div className="lp-logo">reviu<span>.store</span></div>
        <div className="lp-nav-links">
          <a href="#how-it-works" className="lp-nav-link">How It Works</a>
          <a href="#testimonials" className="lp-nav-link">Reviews</a>
          <a href="#compliance" className="lp-nav-link">Compliance</a>
          <a href="#contact" className="lp-nav-cta">Start Free Trial</a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-orb lp-hero-orb-1" />
      <div className="lp-hero-orb lp-hero-orb-2" />
      <div className="lp-hero-inner">
        <div className="lp-hero-badge">
          <span className="lp-hero-badge-dot" />
          100% Amazon TOS Compliant
        </div>

        <h1 className="lp-h1">
          Stop Losing Money to<br />
          Competitors With Better <span className="hl">Reviews</span>
        </h1>

        <p className="lp-hero-sub">
          Smart QR-based review system for Amazon &amp; Shopify sellers. Build trust,
          increase conversions, protect your ratings.
        </p>

        <div className="lp-trust-badges">
          {[
            { icon: "✅", label: "Amazon TOS Compliant" },
            { icon: "🔒", label: "Data Secure" },
            { icon: "🇮🇳", label: "Built for India" },
            { icon: "⚡", label: "Setup in Minutes" },
          ].map((b) => (
            <div key={b.label} className="lp-badge">
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>

        <div className="lp-cta-group">
          <a href="#contact" className="lp-btn lp-btn-primary">
            Start Free Trial →
          </a>
          <a href="#how-it-works" className="lp-btn lp-btn-secondary">
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

function StatsRow() {
  const stats = [
    { num: "500+", label: "Active Sellers" },
    { num: "12K+", label: "Reviews Collected" },
    { num: "4.8★", label: "Avg Rating Improved" },
    { num: "100%", label: "TOS Compliant" },
  ];
  return (
    <div className="lp-stats-row">
      <div className="lp-stats-inner">
        {stats.map((s) => (
          <div key={s.label} className="lp-stat">
            <div className="lp-stat-num">{s.num}</div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemSection() {
  const problems = [
    { icon: "📉", title: "No Reviews = No Trust", desc: "New products without reviews struggle to gain buyer confidence. Customers choose competitors with proven track records." },
    { icon: "⚠️", title: "Bad Reviews Kill Rankings", desc: "A single negative review can damage your product's visibility and conversion rate. Prevention is better than recovery." },
    { icon: "💸", title: "Low Ratings = Lower Sales", desc: "Every rating point matters. Products with higher ratings consistently outperform competitors in conversions and revenue." },
    { icon: "📊", title: "Missing Customer Insights", desc: "Without systematic feedback collection, you're guessing what customers want. Data-driven improvements drive growth." },
    { icon: "🎯", title: "High Ad Costs", desc: "Lower ratings mean higher acquisition costs. Better reviews naturally improve your organic ranking and reduce ACOS." },
    { icon: "🚫", title: "Listing Vulnerability", desc: "Low ratings risk suppression. Protect your hard-earned rankings with consistent positive review flow." },
  ];
  return (
    <section className="lp-section lp-problem">
      <div className="lp-container">
        <RevealSection className="lp-section-header center">
          <span className="lp-section-tag">The Problem</span>
          <h2 className="lp-section-title">Every Day Without Action Is Costing You</h2>
          <p className="lp-section-sub">
            Reviews aren't just social proof — they're the foundation of Amazon success.
          </p>
        </RevealSection>
        <div className="lp-problem-grid">
          {problems.map((p, i) => (
            <RevealSection key={p.title} delay={i * 60}>
              <div className="lp-problem-card">
                <div className="lp-problem-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TalkCTAStrip() {
  return (
    <div className="lp-talk-strip">
      <div className="lp-container">
        <RevealSection>
          <h3>Want to Discuss Your Specific Situation?</h3>
          <p>Every seller's review challenge is unique. Let's talk about yours.</p>
          <a href="#contact" className="lp-btn lp-btn-primary">Talk to Us &rarr;</a>
        </RevealSection>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, title: "Build Custom Forms", desc: "Create branded feedback forms with your messaging. Add warranty extensions, free offers, or exclusive benefits." },
    { n: 2, title: "Generate QR Codes", desc: "Each product gets a unique QR code. Print on business cards, inserts, or packaging. Professional and trackable." },
    { n: 3, title: "Place in Product Box", desc: "Include QR business card with custom messaging — extend warranty, claim free gift, or share feedback." },
    { n: 4, title: "Collect Smart Data", desc: "Track every scan. Capture customer sentiment, product feedback, and improvement suggestions automatically." },
    { n: 5, title: "Route Reviews Intelligently", desc: "Happy → Amazon review page. Unhappy → Private feedback to you. Protect your rating automatically." },
  ];

  return (
    <section className="lp-section lp-how" id="how-it-works">
      <div className="lp-container">
        <RevealSection className="lp-section-header center">
          <span className="lp-section-tag">How It Works</span>
          <h2 className="lp-section-title">Simple. Compliant. Effective.</h2>
          <p className="lp-section-sub">Smart QR-based review collection designed for Indian sellers.</p>
        </RevealSection>

        <div className="lp-how-grid">
          {steps.map((s, i) => (
            <RevealSection key={s.n} className="lp-how-step" delay={i * 80}>
              <div className="lp-step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </RevealSection>
          ))}
        </div>

        <RevealSection>
          <div className="lp-qr-visual">
            <div className="lp-qr-box">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h1v1h-1zM17 14h1v1h-1zM20 14h1v1h-1zM14 17h1v1h-1zM17 17h1v1h-1zM20 17h1v1h-1zM14 20h1v1h-1zM17 20h1v1h-1zM20 20h1v1h-1z"/>
              </svg>
              <span>Your QR</span>
            </div>
            <div className="lp-qr-flow">
              <h4>The Review Journey</h4>
              {[
                "Customer scans QR code",
                "Opens custom feedback form",
                "Rates their experience (1–5 ★)",
                "Positive → Amazon review page",
                "Negative → Private feedback to you",
              ].map((step, i) => (
                <div key={i} className="lp-qr-flow-step">
                  <div className="lp-qr-arrow">{i + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      text: "\"The QR code approach works perfectly for Indian sellers. We include it in every package with a warranty extension offer. Our review rate increased significantly without violating Amazon TOS.\"",
      initials: "RK", name: "Rahul K.", role: "Electronics Seller, Mumbai",
    },
    {
      text: "\"We prevented 12 negative reviews in 2 months by catching unhappy customers early. The private feedback feature is gold. Our rating stayed protected while we improved our product.\"",
      initials: "PM", name: "Priya M.", role: "Home & Kitchen Seller, Bangalore",
    },
    {
      text: "\"Simple to set up, professional QR cards, and the data insights help us improve our products. The support team understands Amazon India sellers' challenges like no one else.\"",
      initials: "AJ", name: "Arjun J.", role: "Fashion Accessories, Delhi",
    },
  ];

  return (
    <section className="lp-section lp-proof" id="testimonials">
      <div className="lp-container">
        <RevealSection className="lp-section-header center">
          <span className="lp-section-tag">Testimonials</span>
          <h2 className="lp-section-title">Trusted by Growing Amazon Sellers</h2>
          <p className="lp-section-sub">Real sellers building sustainable review systems.</p>
        </RevealSection>
        <div className="lp-testimonial-grid">
          {items.map((t, i) => (
            <RevealSection key={t.name} delay={i * 80}>
              <div className="lp-testimonial">
                <div className="lp-stars">★★★★★</div>
                <p className="lp-testimonial-text">{t.text}</p>
                <div className="lp-author">
                  <div className="lp-avatar">{t.initials}</div>
                  <div>
                    <div className="lp-author-name">{t.name}</div>
                    <div className="lp-author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compliance() {
  const items = [
    { icon: "✅", title: "Amazon TOS Compliant", desc: "No incentivized reviews. No manipulation. Only honest feedback from verified purchases following Amazon guidelines." },
    { icon: "🔒", title: "Data Privacy", desc: "Your customer data is encrypted and secure. We never share or sell information. GDPR and Indian privacy laws compliant." },
    { icon: "🛡️", title: "Transparent Process", desc: "Every step is traceable. No black-box tactics. You control all messaging and customer interactions." },
    { icon: "🇮🇳", title: "Built for India", desc: "Designed specifically for Indian Amazon & Shopify sellers. Local support, Indian payment options, regional language coming soon." },
  ];

  return (
    <section className="lp-section lp-compliance" id="compliance">
      <div className="lp-container">
        <RevealSection className="lp-section-header center">
          <span className="lp-section-tag">Trust & Safety</span>
          <h2 className="lp-section-title">100% Compliant. Built for Trust.</h2>
          <p className="lp-section-sub">We follow Amazon's guidelines strictly. Your account safety is our priority.</p>
        </RevealSection>
        <div className="lp-compliance-grid">
          {items.map((item, i) => (
            <RevealSection key={item.title} delay={i * 80}>
              <div className="lp-compliance-item">
                <div className="lp-compliance-icon">{item.icon}</div>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", number: "", message: "" });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.number) {
      setStatus("error"); setMsg("Please fill in all required fields."); return;
    }
    setStatus("loading");
    try {
      const res = await fetch("https://scanqrgo.onrender.com/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setMsg("Thank you! We'll contact you within 24 hours to set up your account. 🎉");
        setForm({ name: "", email: "", number: "", message: "" });
        setTimeout(() => setStatus(null), 6000);
      } else throw new Error();
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again or WhatsApp us directly.");
    }
  };

  return (
    <section className="lp-section lp-contact" id="contact">
      <div className="lp-container">
        <RevealSection className="lp-section-header center">
          <span className="lp-section-tag">Get Started</span>
          <h2 className="lp-section-title">Ready to Build Your Review System?</h2>
          <p className="lp-section-sub">Start protecting your ratings and growing your business today.</p>
        </RevealSection>

        <RevealSection delay={100}>
          <div className="lp-form-card">
            {status === "success" && <div className="lp-form-msg success">{msg}</div>}
            {status === "error"   && <div className="lp-form-msg error">{msg}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {[
                { id: "name",    label: "Full Name *",         type: "text",  placeholder: "Your full name" },
                { id: "email",   label: "Email Address *",     type: "email", placeholder: "you@example.com" },
                { id: "number",  label: "WhatsApp Number *",   type: "tel",   placeholder: "+91 98765 43210" },
              ].map((f) => (
                <div key={f.id} className="lp-form-group">
                  <label className="lp-form-label" htmlFor={f.id}>{f.label}</label>
                  <input
                    id={f.id} name={f.id} type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.id]}
                    onChange={handleChange}
                    className="lp-form-input"
                    required={f.label.includes("*")}
                  />
                </div>
              ))}

              <div className="lp-form-group">
                <label className="lp-form-label" htmlFor="message">Tell us about your business</label>
                <textarea
                  id="message" name="message"
                  placeholder="What products do you sell? How many orders per month? Any specific challenges with reviews?"
                  value={form.message}
                  onChange={handleChange}
                  className="lp-form-textarea"
                />
              </div>

              <button
                type="submit"
                className="lp-form-submit"
                disabled={status === "loading"}
                id="lp-submit-btn"
              >
                {status === "loading" ? (
                  <><div className="lp-spinner" /> Submitting…</>
                ) : (
                  <>Start Free Trial →</>
                )}
              </button>
            </form>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="lp-final-cta">
      <div className="lp-final-cta-inner lp-container">
        <RevealSection>
          <h2>Stop Losing to Better-Reviewed Competitors</h2>
          <p>Join Indian sellers building sustainable review systems. 100% Amazon TOS compliant.</p>
          <div className="lp-cta-group">
            <a href="#contact" className="lp-btn lp-btn-primary">Start Free Trial →</a>
            <a href="#how-it-works" className="lp-btn lp-btn-secondary">Learn More</a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-links">
          {["Privacy Policy", "Terms of Service", "Amazon TOS Compliance", "Contact"].map((l) => (
            <a key={l} href="#" className="lp-footer-link">{l}</a>
          ))}
        </div>
        <div className="lp-footer-disclaimer">
          © 2026 Reviu.store. All rights reserved.<br />
          Built in India for Amazon &amp; Shopify sellers. Results vary by product, category, and execution.<br />
          We help collect honest feedback — review outcomes depend on product quality and customer experience.
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── Main Export ─────────────── */

export default function LandingPage() {
  return (
    <>
      <style>{CSS}</style>
      <Header />
      <Hero />
      <StatsRow />
      <ProblemSection />
      <TalkCTAStrip />
      <HowItWorks />
      <Testimonials />
      <Compliance />
      <ContactForm />
      <FinalCTA />
      <Footer />
    </>
  );
}
