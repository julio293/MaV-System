/* ══════════════════════════════════════════════════════════════════════════
   Onboarding + Authentication flow
   Splash → Permissions → SIM detection → Device verification →
   Biometric → MPIN → Email → Referral → All set
   Plus edge states: no-SIM, dual-SIM, blocked device, permission denied.
   Built on the Fyscal/MaV component vocabulary (tokens.css + app.css).
   ══════════════════════════════════════════════════════════════════════════ */

/* small inline brandmark (independent of screens_auth) */
const OnbBrand = ({ light }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src={light ? 'assets/ft-mark-1080.png' : 'assets/ft-mark.png'} alt="Fyscal"
      style={{ width: 32, height: 32, borderRadius: 9, display: 'block', objectFit: 'cover' }} />
    <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.02em', color: light ? '#fff' : 'var(--mav-fg)' }}>fyscal</span>
  </div>
);

/* ── Splash (boot) — super.money-style bold reveal ─────────────────────── */
const Splash = ({ nav, app }) => {
  useEffect(() => {
    const id = setTimeout(() => nav.reset(app && app.authed ? 'home' : 'onboarding'), 2400);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="boot" onClick={() => nav.reset(app && app.authed ? 'home' : 'onboarding')}>
      <span className="boot-aurora" />
      <div className="boot-stage">
        <span className="boot-halo" />
        <span className="boot-ring a" /><span className="boot-ring b" /><span className="boot-ring c" />
        <div className="boot-logo">
          <img src="assets/ft-mark-1080.png" alt="Fyscal" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.boot-ft').style.display = 'block'; }} />
          <span className="boot-ft" style={{ display: 'none', color: 'var(--mav-primary)', fontWeight: 900, fontSize: 46, fontStyle: 'italic', letterSpacing: '-.04em' }}>FT</span>
          <span className="boot-shine" />
        </div>
        <div className="boot-tag">Empowering digital finance</div>
      </div>
      <div className="boot-foot">
        <div className="boot-bar"><i /></div>
        <span className="boot-secure"><Icon.lock s={12} sw={2.2} /> Secured by 256-bit encryption</span>
      </div>
    </div>
  );
};

/* ── Permissions primer + OS-style modal ───────────────────────────────── */
const Permissions = ({ nav, params }) => {
  const [perms, setPerms] = useState({ sms: true, notif: true, contacts: false });
  const [modal, setModal] = useState(null); // 'sms' | 'notif' | null
  const [denied, setDenied] = useState(false);
  const toggle = (k) => setPerms((p) => ({ ...p, [k]: !p[k] }));

  const ITEMS = [
    { k: 'sms', ic: 'sms', tint: 'tint-primary', title: 'SMS', tag: 'Recommended', desc: 'Read the one-time code automatically so you never type it in.' },
    { k: 'notif', ic: 'bell', tint: 'tint-success', title: 'Notifications', tag: 'Recommended', desc: 'Instant alerts for payments, requests, and security events.' },
    { k: 'contacts', ic: 'contacts', tint: 'tint-warning', title: 'Contacts', tag: 'Optional', desc: 'Pay friends by name. We never upload your address book.' },
  ];

  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <StepBar step={2} total={8} />
      <div className="screen-scroll" style={{ padding: '18px 24px 0' }}>
        <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.shieldChk s={42} sw={1.6} /></div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center', marginTop: 12 }}>A few permissions</h1>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.5, textAlign: 'center', marginTop: 7 }}>
          Grant these for the smoothest, safest experience. You stay in control — change them anytime in Settings.
        </p>
        <div className="card-flat" style={{ marginTop: 22, padding: '2px 16px' }}>
          {ITEMS.map((it) => (
            <div className="perm-row" key={it.k}>
              <div className={`perm-ic ${it.tint}`}><IconBy name={it.ic} s={22} /></div>
              <div className="perm-body">
                <div className="spread"><span className="perm-title">{it.title}</span><span className="perm-tag">{it.tag}</span></div>
                <div className="perm-desc">{it.desc}</div>
              </div>
              <Switch on={perms[it.k]} onClick={() => toggle(it.k)} />
            </div>
          ))}
        </div>
        {denied && (
          <div className="alert alert-warning" style={{ marginTop: 16 }}>
            <Icon.alertTri s={18} /><span>Without SMS access you'll enter the code manually — that's fine, it just takes a tap more.</span>
          </div>
        )}
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" onClick={() => perms.sms ? setModal('sms') : nav.go('simdetect', params)}>
          Allow &amp; continue
        </button>
      </div>

      {/* OS-style permission modal */}
      <Dialog open={modal === 'sms'} onClose={() => setModal(null)} tone="primary" icon={Icon.sms}
        title="Allow Fyscal to read SMS?" desc="Used only to auto-fill your verification code. Fyscal never reads your other messages."
        actions={<React.Fragment>
          <button className="btn btn-primary" onClick={() => { setModal(null); nav.go('simdetect', params); }}>Allow</button>
          <button className="btn btn-ghost" onClick={() => { setModal(null); setDenied(true); setPerms((p) => ({ ...p, sms: false })); }}>Don't allow</button>
        </React.Fragment>} />
    </div>
  );
};

/* ── SIM detection (dual-SIM picker · no-SIM recovery) ─────────────────── */
const SimDetect = ({ nav, params }) => {
  const [phase, setPhase] = useState('scanning'); // scanning | choose
  const [sel, setSel] = useState(null);
  const [noSim, setNoSim] = useState(false);
  const SIMS = [
    { id: 1, carrier: 'Airtel', num: '98765 43210', match: true },
    { id: 2, carrier: 'Jio', num: '90042 11876', match: false },
  ];
  useEffect(() => {
    const id = setTimeout(() => setPhase('choose'), 1900);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <StepBar step={3} total={8} />
      {phase === 'scanning' ? (
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div className="radar">
            <span className="radar-ring r1" /><span className="radar-ring r2" /><span className="radar-ring r3" />
            <span className="radar-core"><Icon.sim s={30} /></span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 28 }}>Detecting your SIM…</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 7, maxWidth: 270 }}>Confirming the number matches the SIM in this phone. Keep the app open.</p>
        </div>
      ) : (
        <div className="screen-scroll" style={{ padding: '14px 24px 0' }}>
          <h1 style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-.02em' }}>Choose the SIM to verify</h1>
          <p className="muted" style={{ fontSize: 14.5, marginTop: 7, marginBottom: 18 }}>
            We send <b style={{ color: 'var(--mav-fg)' }}>one</b> encrypted SMS from this SIM to confirm your number. Standard carrier rates may apply.
          </p>
          <div className="stack" style={{ gap: 10 }}>
            {SIMS.map((s) => (
              <button className={`sim-opt ${sel === s.id ? 'sel' : ''}`} key={s.id} onClick={() => setSel(s.id)}>
                <div className="sim-slot">SIM {s.id}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{s.carrier}</span>
                    {s.match && <span className="badge badge-success"><Icon.check s={11} sw={3} />Matches</span>}
                  </div>
                  <div className="num muted" style={{ fontSize: 12.5, marginTop: 2 }}>+91 {s.num}</div>
                </div>
                <span className="sim-radio" />
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ margin: '14px auto 0', display: 'flex' }} onClick={() => setNoSim(true)}>
            No SIM in this phone?
          </button>
        </div>
      )}
      {phase === 'choose' && (
        <div className="action-dock">
          <button className="btn btn-primary" disabled={!sel} onClick={() => nav.go('deviceverify', { ...params, sim: sel })}>
            Verify with SIM {sel || ''}
          </button>
        </div>
      )}

      {/* No-SIM recovery sheet */}
      <Sheet open={noSim} onClose={() => setNoSim(false)} title="No SIM detected">
        <div className="center-col" style={{ textAlign: 'center', padding: '4px 4px 8px' }}>
          <div className="auth-hero" style={{ background: 'color-mix(in srgb,var(--mav-warning) 14%,#fff)', color: '#b35e00', width: 72, height: 72, borderRadius: 22 }}>
            <Icon.sim s={34} />
          </div>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginTop: 12, maxWidth: 290 }}>
            UPI requires an active SIM for the number you're registering. Insert the SIM for <b style={{ color: 'var(--mav-fg)' }}>{params.phone}</b> into this phone, or continue on the device that holds it.
          </p>
        </div>
        <div className="stack" style={{ gap: 9, marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => { setNoSim(false); setPhase('scanning'); setTimeout(() => setPhase('choose'), 1900); }}>I've inserted the SIM — retry</button>
          <button className="btn btn-ghost" onClick={() => setNoSim(false)}>Use a different number</button>
        </div>
      </Sheet>
    </div>
  );
};

/* ── Device verification (animated checklist · blocked-device edge) ─────── */
const DeviceVerify = ({ nav, params }) => {
  const STEPS = ['Reading SIM securely', 'Sending verification SMS', 'Binding device to your number'];
  const [done, setDone] = useState(0);   // index of step currently active
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    if (blocked) return;
    if (done >= STEPS.length) { const id = setTimeout(() => nav.go('otp', { phone: params.phone }), 600); return () => clearTimeout(id); }
    const id = setTimeout(() => setDone((d) => d + 1), 950);
    return () => clearTimeout(id);
  }, [done, blocked]);

  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <StepBar step={4} total={8} />
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 30px' }}>
        <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.phone s={40} /></div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center', marginTop: 12 }}>Verifying your device</h1>
        <p className="muted" style={{ fontSize: 14, textAlign: 'center', marginTop: 7, maxWidth: 280 }}>This keeps your account locked to this phone. Takes just a moment.</p>
        <div className="card-flat" style={{ marginTop: 26, width: '100%', padding: '4px 18px' }}>
          {STEPS.map((label, i) => {
            const state = i < done ? 'done' : i === done ? 'active' : 'pending';
            return (
              <div className={`verify-item ${state === 'pending' ? 'is-pending' : ''}`} key={i}>
                <span className={`verify-dot ${state}`}>{state === 'done' && <Icon.check s={15} sw={3} />}</span>
                <span className="verify-label">{label}</span>
              </div>
            );
          })}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => setBlocked(true)}>Trouble verifying?</button>
      </div>

      {/* Blocked / unsupported device dialog */}
      <Dialog open={blocked} onClose={() => setBlocked(false)} tone="danger" icon={Icon.alertTri}
        title="We couldn't verify this device" desc="This device may be rooted, in an unsupported region, or flagged for security. For your protection we can't continue here."
        actions={<React.Fragment>
          <button className="btn btn-primary" onClick={() => { setBlocked(false); setDone(0); }}>Try again</button>
          <button className="btn btn-ghost" onClick={() => setBlocked(false)}><Icon.headset s={18} /> Contact support</button>
        </React.Fragment>} />
    </div>
  );
};

/* ── Biometric setup ───────────────────────────────────────────────────── */
const Biometric = ({ nav, app }) => {
  const [state, setState] = useState('idle'); // idle | scanning | done
  const enable = () => {
    setState('scanning');
    setTimeout(() => { setState('done'); }, 1300);
    setTimeout(() => { app.toast({ tone: 'success', title: 'Face ID enabled', desc: 'Unlock Fyscal in a glance.' }); nav.go('mpin'); }, 2050);
  };
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <StepBar step={6} total={8} />
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div className={`bio-orb ${state}`}>
          {state === 'done' ? <Icon.check s={52} sw={2.4} /> : <Icon.faceid s={56} sw={1.5} />}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', marginTop: 30 }}>
          {state === 'done' ? 'Face ID is on' : 'Unlock with Face ID'}
        </h1>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>
          {state === 'scanning' ? 'Look at your phone…' : state === 'done' ? 'Securing your account…' : 'Skip the PIN on every open. Your biometrics never leave this device.'}
        </p>
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" disabled={state !== 'idle'} onClick={enable}>
          {state === 'idle' ? <React.Fragment><Icon.faceid s={20} /> Enable Face ID</React.Fragment> : 'Setting up…'}
        </button>
        <button className="btn btn-ghost" disabled={state !== 'idle'} onClick={() => nav.go('mpin')}>Set up later</button>
      </div>
    </div>
  );
};

/* ── MPIN setup (create + confirm, mismatch error) ─────────────────────── */
const Mpin = ({ nav }) => {
  const [stage, setStage] = useState('create'); // create | confirm
  const [pin, setPin] = useState('');
  const [first, setFirst] = useState('');
  const [err, setErr] = useState(false);
  const onKey = (k) => {
    if (pin.length >= 6) return;
    const next = pin + k; setPin(next); setErr(false);
    if (next.length === 6) {
      setTimeout(() => {
        if (stage === 'create') { setFirst(next); setPin(''); setStage('confirm'); }
        else if (next === first) { nav.go('email'); }
        else { setErr(true); setTimeout(() => { setPin(''); setStage('create'); setFirst(''); }, 750); }
      }, 160);
    }
  };
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <StepBar step={7} total={8} />
      <div className="center-col" style={{ flex: 1, justifyContent: 'flex-start', padding: '20px 24px 0', textAlign: 'center' }}>
        <div className="auth-hero" style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}>
          <Icon.lock s={30} />
        </div>
        <h1 style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-.02em', marginTop: 14 }}>
          {stage === 'create' ? 'Create your app PIN' : 'Confirm your app PIN'}
        </h1>
        <p className="muted" style={{ fontSize: 14, marginTop: 8, maxWidth: 290, lineHeight: 1.5 }}>
          {stage === 'create'
            ? 'A 6-digit PIN to open Fyscal. This is separate from the UPI PIN you\u2019ll set when linking a bank.'
            : 'Enter the same 6 digits once more.'}
        </p>
        <div style={{ marginTop: 26 }}><PinDots value={pin} error={err} /></div>
        {err && <p style={{ color: 'var(--mav-danger)', fontSize: 13, fontWeight: 700, marginTop: 14 }}>PINs didn't match — let's start over.</p>}
        <div className="secure-strip" style={{ marginTop: 'auto' }}><Icon.shieldChk s={14} /> Encrypted &amp; stored only on this device</div>
      </div>
      <div style={{ padding: '0 20px' }}>
        <Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} />
      </div>
    </div>
  );
};

/* ── Email optional linking ────────────────────────────────────────────── */
const EmailLink = ({ nav, app }) => {
  const [email, setEmail] = useState('');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} right={<button className="btn btn-ghost btn-sm" onClick={() => nav.go('referral')}>Skip</button>} />
      <StepBar step={8} total={8} />
      <div className="screen-scroll" style={{ padding: '18px 24px 0' }}>
        <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.mail s={40} /></div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center', marginTop: 12 }}>Add an email</h1>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.5, textAlign: 'center', marginTop: 7, marginBottom: 24 }}>
          For payment receipts and account recovery. Optional — you can add it later.
        </p>
        <div className="field">
          <div className="input-box">
            <Icon.mail s={20} sw={1.8} />
            <input type="email" inputMode="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {valid && <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={20} /></span>}
          </div>
        </div>
        <div className="alert alert-primary" style={{ marginTop: 16 }}>
          <Icon.lock s={18} /><span>We'll send a confirmation link. No spam, ever — only receipts and security notices.</span>
        </div>
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" disabled={!valid}
          onClick={() => { app.toast({ tone: 'success', title: 'Verification link sent', desc: email }); nav.go('referral'); }}>
          Add email
        </button>
      </div>
    </div>
  );
};

/* ── Referral code ─────────────────────────────────────────────────────── */
const Referral = ({ nav, app }) => {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const apply = () => {
    if (code.trim().length < 4) return;
    setApplied(true);
    app.toast({ tone: 'success', title: 'Referral applied!', desc: '\u20b950 lands after your first payment.' });
  };
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} right={<button className="btn btn-ghost btn-sm" onClick={() => nav.go('allset')}>Skip</button>} />
      <StepBar step={8} total={8} />
      <div className="screen-scroll" style={{ padding: '18px 24px 0' }}>
        <div className="auth-hero" style={{ background: 'color-mix(in srgb,var(--mav-success) 14%,#fff)', color: 'var(--mav-success)' }}><Icon.gift s={40} /></div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center', marginTop: 12 }}>Got a referral code?</h1>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.5, textAlign: 'center', marginTop: 7, marginBottom: 24 }}>
          Enter a friend's code and you'll both earn <b style={{ color: 'var(--mav-fg)' }}>&#8377;50</b> after your first payment.
        </p>
        {applied ? (
          <div className="card-flat" style={{ display: 'flex', alignItems: 'center', gap: 13, borderColor: 'var(--mav-success)', background: 'color-mix(in srgb,var(--mav-success) 7%,#fff)' }}>
            <div className="perm-ic tint-success" style={{ width: 42, height: 42 }}><Icon.check s={22} sw={2.6} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>Code <span className="num">{code.toUpperCase()}</span> applied</div>
              <div className="perm-desc" style={{ marginTop: 1 }}>&#8377;50 reward unlocked on first payment</div>
            </div>
          </div>
        ) : (
          <div className="field">
            <div className="input-box">
              <Icon.gift s={20} sw={1.8} />
              <input autoFocus placeholder="Enter code" value={code} style={{ textTransform: 'uppercase', letterSpacing: '.06em' }}
                onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10))} />
              <button className="btn btn-tonal btn-sm" disabled={code.trim().length < 4} onClick={apply}>Apply</button>
            </div>
          </div>
        )}
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" onClick={() => nav.go('allset')}>{applied ? 'Continue' : 'Continue'}</button>
      </div>
    </div>
  );
};

/* ── All set — celebratory success ─────────────────────────────────────── */
const AllSet = ({ nav, app }) => {
  return (
    <div className="splash" style={{ justifyContent: 'flex-start' }}>
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 34px', textAlign: 'center', zIndex: 1 }}>
        <div style={{ width: 110, height: 110, borderRadius: 34, background: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto', animation: 'splashRise .55s cubic-bezier(.16,1,.3,1) both' }}>
          <svg className="check-ring" viewBox="0 0 92 92" fill="none" style={{ width: 70, height: 70 }}>
            <circle cx="46" cy="46" r="40" stroke="var(--mav-success)" strokeWidth="6" />
            <path d="M28 47l12 12 24-24" stroke="var(--mav-success)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', color: '#fff', marginTop: 28 }}>You're all set, {DATA.USER.first}!</h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,.85)', marginTop: 10, maxWidth: 300 }}>
          Your account is secured and ready. Link a bank to start paying — it takes under a minute.
        </p>
        <div className="trust-row" style={{ marginTop: 26 }}>
          <span className="trust" style={{ color: 'rgba(255,255,255,.85)' }}><Icon.lock s={14} sw={2.2} />Encrypted</span>
          <span className="trust" style={{ color: 'rgba(255,255,255,.85)' }}><Icon.shieldChk s={14} sw={2.2} />RBI · NPCI</span>
          <span className="trust" style={{ color: 'rgba(255,255,255,.85)' }}><Icon.faceid s={14} sw={2.2} />Face ID on</span>
        </div>
      </div>
      <div style={{ padding: '0 24px calc(28px + env(safe-area-inset-bottom,8px))', width: '100%', zIndex: 1 }}>
        <button className="btn btn-secondary" style={{ background: '#fff', boxShadow: 'none' }}
          onClick={() => { app.setAuthed(true); nav.reset('home'); app.toast({ tone: 'success', title: 'Welcome to Fyscal', desc: 'Let\u2019s link your bank.' }); }}>
          Start using Fyscal
        </button>
      </div>
    </div>
  );
};

window.OnboardScreens = { Splash, Permissions, SimDetect, DeviceVerify, Biometric, Mpin, EmailLink, Referral, AllSet, OnbBrand };
