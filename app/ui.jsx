/* ══════════════════════════════════════════════════════════════════════════
   UI primitives — device shell, status bar, app bar, nav, sheet, toast,
   keypad, skeleton, money formatting.
   ══════════════════════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef, useCallback } = React;

/* ── Money ─────────────────────────────────────────────────────────────── */
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const inrParts = (n) => {
  const fixed = Number(n).toFixed(2);
  const [whole, dec] = fixed.split('.');
  return { whole: Number(whole).toLocaleString('en-IN'), dec };
};

/* ── Status bar ────────────────────────────────────────────────────────── */
const StatusBar = ({ tone = 'dark' }) => (
  <div className={`status ${tone}`}>
    <span className="status-time">9:41</span>
    <div className="status-icons">
      <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="5" y="2.5" width="3" height="9.5" rx="1"/><rect x="10" y="1" width="3" height="11" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none" strokeWidth="0"><path d="M8.5 3.2c2 0 3.8.8 5.1 2.1l1.3-1.3A9 9 0 008.5 1.4 9 9 0 002.1 4l1.3 1.3A7.2 7.2 0 018.5 3.2z" fill="currentColor"/><path d="M8.5 6.4c1.1 0 2.1.45 2.8 1.2L8.5 10.6 5.7 7.6A4 4 0 018.5 6.4z" fill="currentColor"/></svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="3" stroke="currentColor" strokeWidth="1" opacity=".4"/><rect x="3" y="3" width="16" height="6" rx="1.5" fill="currentColor"/><path d="M23.5 4v4a2 2 0 000-4z" fill="currentColor" opacity=".5"/></svg>
    </div>
  </div>
);

/* ── App bar ───────────────────────────────────────────────────────────── */
const AppBar = ({ title, sub, onBack, right, tone }) => (
  <div className="appbar" style={tone === 'flush' ? { paddingTop: 6 } : null}>
    {onBack && (
      <button className="iconbtn ghost" onClick={onBack} aria-label="Back"><Icon.back s={24} /></button>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      {title && <div className="ab-title" style={{ paddingLeft: onBack ? 0 : 4 }}>{title}</div>}
      {sub && <div className="ab-sub" style={{ paddingLeft: onBack ? 0 : 4 }}>{sub}</div>}
    </div>
    {right}
  </div>
);

/* ── Bottom nav with center scan FAB ───────────────────────────────────── */
const BottomNav = ({ active, go }) => {
  const Tab = ({ id, label, icon: I, iconFill: IF }) => {
    const on = active === id;
    return (
      <button className={`nav-item ${on ? 'active' : ''}`} onClick={() => go(id)}>
        <span style={{ color: on ? 'var(--mav-primary)' : 'var(--mav-muted)' }}>
          {on && IF ? <IF s={23} /> : <I s={23} />}
        </span>
        <span className="nav-label">{label}</span>
      </button>
    );
  };
  return (
    <div className="bottom-nav">
      <Tab id="home" label="Home" icon={Icon.home} iconFill={Icon.homeFill} />
      <Tab id="history" label="History" icon={Icon.history} />
      <div className="nav-scan-wrap">
        <button className="nav-scan" onClick={() => go('scan')} aria-label="Scan QR"><Icon.scan s={26} fill="none" /><span style={{ position:'absolute', color:'#fff' }} /></button>
      </div>
      <Tab id="bills" label="Bills" icon={Icon.bills} />
      <Tab id="profile" label="Profile" icon={Icon.user} iconFill={Icon.userFill} />
    </div>
  );
};
/* recolor scan icon white */
const _scanFix = `.nav-scan svg{color:#fff}`;

/* ── Bottom sheet ──────────────────────────────────────────────────────── */
const Sheet = ({ open, onClose, title, children, titleRight }) => {
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        {(title || titleRight) && (
          <div className="spread" style={{ marginBottom: 16, paddingInline: 2 }}>
            <span className="sheet-title">{title}</span>
            {titleRight}
          </div>
        )}
        {children}
      </div>
    </React.Fragment>
  );
};

/* ── Dialog ────────────────────────────────────────────────────────────── */
const Dialog = ({ open, onClose, tone = 'primary', icon: I, title, desc, actions }) => {
  if (!open) return null;
  const bg = {
    primary: 'var(--mav-bg-tertiary)', danger: 'color-mix(in srgb,var(--mav-danger) 10%,#fff)',
    warning: 'color-mix(in srgb,var(--mav-warning) 14%,#fff)', success: 'color-mix(in srgb,var(--mav-success) 12%,#fff)',
  }[tone];
  const fg = { primary: 'var(--mav-primary)', danger: 'var(--mav-danger)', warning: 'var(--mav-warning)', success: 'var(--mav-success)' }[tone];
  return (
    <React.Fragment>
      <div className="scrim" onClick={onClose} />
      <div className="dialog">
        {I && <div className="dialog-icon" style={{ background: bg, color: fg }}><I s={28} /></div>}
        <div className="dialog-title">{title}</div>
        {desc && <div className="dialog-desc">{desc}</div>}
        <div className="stack" style={{ gap: 8, marginTop: 20 }}>{actions}</div>
      </div>
    </React.Fragment>
  );
};

/* ── Toast host ────────────────────────────────────────────────────────── */
const ToastHost = ({ toasts }) => (
  <div className="toast-wrap">
    {toasts.map((t) => {
      const map = {
        success: { bg: 'color-mix(in srgb,var(--mav-success) 14%,#fff)', fg: 'var(--mav-success)', I: Icon.check },
        info: { bg: 'var(--mav-bg-tertiary)', fg: 'var(--mav-primary)', I: Icon.info },
        danger: { bg: 'color-mix(in srgb,var(--mav-danger) 10%,#fff)', fg: 'var(--mav-danger)', I: Icon.alert },
      }[t.tone || 'info'];
      return (
        <div className="toast" key={t.id}>
          <div className="toast-ic" style={{ background: map.bg, color: map.fg }}><map.I s={17} sw={2.4} /></div>
          <div style={{ flex: 1 }}>
            <div className="toast-title">{t.title}</div>
            {t.desc && <div className="toast-desc">{t.desc}</div>}
          </div>
        </div>
      );
    })}
  </div>
);

/* toast hook */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((cur) => [...cur, { ...t, id }]);
    setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), t.duration || 2400);
  }, []);
  return { toasts, push };
}

/* ── Numeric keypad ────────────────────────────────────────────────────── */
const Keypad = ({ onKey, onDelete, fnLabel, onFn }) => (
  <div className="keypad">
    {[1,2,3,4,5,6,7,8,9].map((n) => (
      <button key={n} className="key" onClick={() => onKey(String(n))}>{n}</button>
    ))}
    {fnLabel
      ? <button className="key fn" onClick={onFn}>{fnLabel}</button>
      : <span />}
    <button className="key" onClick={() => onKey('0')}>0</button>
    <button className="key" onClick={onDelete} aria-label="Delete">
      <span style={{ display:'inline-flex', color:'var(--mav-fg)' }}><Icon.back s={22} sw={2} /></span>
    </button>
  </div>
);

/* ── PIN slots ─────────────────────────────────────────────────────────── */
const PinDots = ({ length = 6, value, error }) => (
  <div className="slots">
    {Array.from({ length }).map((_, i) => (
      <div key={i} className={`slot dot ${value.length === i ? 'focus' : ''} ${i < value.length ? 'filled' : ''} ${error ? 'err' : ''}`} />
    ))}
  </div>
);

/* ── Skeleton txn row ──────────────────────────────────────────────────── */
const SkeletonRow = () => (
  <div className="txn-item txn-divide" style={{ pointerEvents: 'none' }}>
    <div className="sk" style={{ width: 44, height: 44, borderRadius: 13 }} />
    <div className="txn-body stack" style={{ gap: 7 }}>
      <div className="sk" style={{ width: '55%', height: 12 }} />
      <div className="sk" style={{ width: '35%', height: 10 }} />
    </div>
    <div className="sk" style={{ width: 56, height: 14 }} />
  </div>
);

/* ── Avatar from initials ──────────────────────────────────────────────── */
const palettes = ['#352eff','#0053ff','#629c28','#ff8400','#7c4dff','#0098a6','#d6336c','#1b6ec2'];
const Avatar = ({ name, size = 44, src }) => {
  const initials = (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  let h = 0; for (const c of (name || '')) h = (h * 31 + c.charCodeAt(0)) % palettes.length;
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: palettes[h] }}>
      {initials}
    </div>
  );
};

/* ── Step progress bar ─────────────────────────────────────────────────── */
const StepBar = ({ step, total }) => (
  <div className="stepbar" aria-label={`Step ${step} of ${total}`}>
    {Array.from({ length: total }).map((_, i) => (
      <i key={i} className={i + 1 < step ? 'done' : i + 1 === step ? 'cur' : ''} />
    ))}
  </div>
);

/* ── Trust badge row ───────────────────────────────────────────────────── */
const TrustRow = ({ items }) => (
  <div className="trust-row">
    {(items || [['lock', '256-bit encrypted'], ['shieldChk', 'RBI · NPCI'], ['check', 'DPDP compliant']]).map(([ic, label], i) => {
      const I = Icon[ic] || Icon.check;
      return (<span className="trust" key={i}><I s={14} sw={2.2} />{label}</span>);
    })}
  </div>
);

/* ── Toggle switch ─────────────────────────────────────────────────────── */
const Switch = ({ on, onClick }) => (
  <button className={`switch ${on ? 'on' : ''}`} onClick={onClick} role="switch" aria-checked={on} aria-label="Toggle" />
);

/* ── Sound + haptic feedback ───────────────────────────────────────────── */
let _actx = null;
const fx = {
  beep(freqs, dur = 0.16, type = 'sine', gain = 0.06) {
    try {
      _actx = _actx || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = _actx; if (ctx.state === 'suspended') ctx.resume();
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = f;
        const t0 = ctx.currentTime + i * dur * 0.9;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + dur);
      });
    } catch (e) {}
  },
  success() { this.beep([784, 1047], 0.18, 'sine', 0.07); this.haptic([12, 40, 18]); },
  fail() { this.beep([220, 165], 0.22, 'triangle', 0.06); this.haptic([60, 30, 60]); },
  pending() { this.beep([523], 0.14, 'sine', 0.05); this.haptic(20); },
  tap() { this.haptic(8); },
  haptic(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} },
};
window.fx = fx;

Object.assign(window, {
  inr, inrParts, StatusBar, AppBar, BottomNav, Sheet, Dialog, ToastHost, useToasts,
  Keypad, PinDots, SkeletonRow, Avatar, StepBar, TrustRow, Switch,
});

/* inject tiny fix for scan icon color */
const _st = document.createElement('style'); _st.textContent = _scanFix; document.head.appendChild(_st);
