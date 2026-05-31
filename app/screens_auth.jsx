/* ══════════════════════════════════════════════════════════════════════════
   Auth flow — Onboarding · Login · OTP · Secure PIN
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Onboarding carousel ───────────────────────────────────────────────── */
const Onboarding = ({ nav }) => {
  const [i, setI] = useState(0);
  const slides = [
    { icon: Icon.qr, title: 'Pay anyone, instantly', desc: 'Scan any UPI QR or send to a number, contact, or UPI ID — money moves in seconds.', tint: 'var(--mav-primary)' },
    { icon: Icon.shieldChk, title: 'Bank-grade security', desc: 'Every payment is protected by your UPI PIN and device biometrics. Always.', tint: 'var(--mav-secondary)' },
    { icon: Icon.bills, title: 'Bills & recharges, sorted', desc: 'Electricity, mobile, DTH, broadband — pay them all and never miss a due date.', tint: 'var(--mav-success)' },
  ];
  const s = slides[i];
  const last = i === slides.length - 1;
  return (
    <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom,8px))' }}>
      <div className="spread" style={{ padding: '8px 18px' }}>
        <Brandmark />
        {!last && <button className="btn btn-ghost btn-sm" onClick={() => nav.reset('login')}>Skip</button>}
      </div>
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center', gap: 8 }}>
        <div style={{ width: 168, height: 168, borderRadius: 44, display: 'grid', placeItems: 'center', marginBottom: 28,
          background: `linear-gradient(150deg, ${s.tint}, color-mix(in srgb, ${s.tint} 55%, #fff))`,
          boxShadow: `0 26px 50px -18px ${s.tint}` }}>
          <span style={{ color: '#fff' }}><s.icon s={74} sw={1.5} /></span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>{s.title}</h1>
        <p className="muted" style={{ fontSize: 15, lineHeight: 1.55, maxWidth: 300 }}>{s.desc}</p>
      </div>
      <div className="center-col" style={{ gap: 22, padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {slides.map((_, k) => (
            <div key={k} style={{ height: 7, width: k === i ? 22 : 7, borderRadius: 4, transition: 'all .25s',
              background: k === i ? 'var(--mav-primary)' : 'var(--mav-border)' }} />
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => last ? nav.reset('login') : setI(i + 1)}>
          {last ? 'Get started' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

const Brandmark = ({ light }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src={light ? 'assets/ft-mark-1080.png' : 'assets/ft-mark.png'} alt="Fyscal"
      style={{ width: 32, height: 32, borderRadius: 9, display: 'block', objectFit: 'cover' }} />
    <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.02em', color: light ? '#fff' : 'var(--mav-fg)' }}>fyscal</span>
  </div>
);

/* ── Login — mobile number + Terms & Privacy consent ───────────────────── */
const Login = ({ nav }) => {
  const [num, setNum] = useState('');
  const [agree, setAgree] = useState(false);
  const [doc, setDoc] = useState(null);   // 'terms' | 'privacy' | null
  const [nudge, setNudge] = useState(false);
  const valid = num.replace(/\D/g, '').length === 10;
  const fmt = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    return d.replace(/(\d{5})(\d{0,5})/, (m, a, b) => (b ? a + ' ' + b : a));
  };
  const onContinue = () => {
    if (!agree) { setNudge(true); return; }
    nav.go('permissions', { phone: '+91 ' + num });
  };
  return (
    <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(18px + env(safe-area-inset-bottom,8px))' }}>
      <div style={{ padding: '12px 18px' }}><Brandmark /></div>
      <div style={{ flex: 1, padding: '20px 24px 0' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.2 }}>Enter your<br />mobile number</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 8, marginBottom: 24 }}>We’ll send a 6-digit code to verify it’s you.</p>
        <div className="field">
          <div className="input-box">
            <span className="input-prefix" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              🇮🇳 +91
              <span style={{ width: 1, height: 22, background: 'var(--mav-border)' }} />
            </span>
            <input inputMode="numeric" autoFocus placeholder="00000 00000" value={num}
              onChange={(e) => setNum(fmt(e.target.value))} />
            {valid && <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={20} /></span>}
          </div>
        </div>
        <div className="alert alert-primary" style={{ marginTop: 16 }}>
          <Icon.shield s={18} />
          <span>Your number stays private. Fyscal never shares it with payees.</span>
        </div>
        <div className={`consent ${nudge && !agree ? 'anim-fade' : ''}`} style={{ marginTop: 20 }} onClick={() => { setAgree((a) => !a); setNudge(false); }}>
          <span className={`checkbox ${agree ? 'on' : ''}`} style={nudge && !agree ? { borderColor: 'var(--mav-danger)' } : null}>
            {agree && <Icon.check s={14} sw={3} />}
          </span>
          <span className="consent-text">
            I agree to Fyscal’s <b onClick={(e) => { e.stopPropagation(); setDoc('terms'); }}>Terms of Service</b> and <b onClick={(e) => { e.stopPropagation(); setDoc('privacy'); }}>Privacy Policy</b>, and consent to verification via SMS.
          </span>
        </div>
        {nudge && !agree && <p style={{ color: 'var(--mav-danger)', fontSize: 12, fontWeight: 600, marginTop: 8, paddingLeft: 33 }}>Please accept the terms to continue.</p>}
      </div>
      <div style={{ padding: '0 24px' }}>
        <button className="btn btn-primary" disabled={!valid} onClick={onContinue}>Continue</button>
      </div>

      {/* Terms & Privacy acceptance sheet */}
      <Sheet open={!!doc} onClose={() => setDoc(null)}>
        <div className="seg" style={{ marginBottom: 16 }}>
          <button className={doc === 'terms' ? 'on' : ''} onClick={() => setDoc('terms')}>Terms</button>
          <button className={doc === 'privacy' ? 'on' : ''} onClick={() => setDoc('privacy')}>Privacy</button>
        </div>
        <div className="doc-body" style={{ maxHeight: 280, overflowY: 'auto' }}>
          {doc === 'privacy' ? (
            <React.Fragment>
              <p>We collect only what’s needed to run your account: your number, device, and transaction history.</p>
              <h4>What we store</h4>
              <p>Your verified mobile number, a device binding token, and UPI activity required by NPCI.</p>
              <h4>What we never do</h4>
              <p>We never sell your data, never share your number with payees, and never read messages beyond the verification code.</p>
              <h4>Your controls</h4>
              <p>Revoke permissions, export your data, or close your account anytime from Settings. We comply with the DPDP Act, 2023.</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>By using Fyscal you agree to operate a single UPI identity tied to your verified number and this device.</p>
              <h4>Your responsibilities</h4>
              <p>Keep your app PIN and UPI PIN confidential. You’re responsible for payments authorised with them.</p>
              <h4>Payments</h4>
              <p>Transactions are processed over the NPCI UPI network and are subject to your bank’s limits and the rules of the network.</p>
              <h4>Eligibility</h4>
              <p>You must be 18+ and hold a bank account in India to transact.</p>
            </React.Fragment>
          )}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => { setAgree(true); setNudge(false); setDoc(null); }}>Accept &amp; continue</button>
      </Sheet>
    </div>
  );
};

/* ── OTP verify — auto-read, resend timer, error & timeout edges ───────── */
const Otp = ({ nav, params }) => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  const [t, setT] = useState(30);
  const [reading, setReading] = useState(true);   // SMS auto-read in progress
  const inputRef = useRef(null);

  // resend countdown
  useEffect(() => { const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000); return () => clearInterval(id); }, []);
  // SMS auto-read simulation → fills the code, then verifies
  useEffect(() => {
    const fill = setTimeout(() => { setReading(false); autofill('428913'); }, 2600);
    return () => clearTimeout(fill);
  }, []);
  useEffect(() => { if (!reading && inputRef.current) inputRef.current.focus(); }, [reading]);

  const expired = t === 0;

  const autofill = (full) => {
    let i = 0;
    const tick = setInterval(() => {
      i += 1; setCode(full.slice(0, i));
      if (i >= 6) { clearInterval(tick); setTimeout(() => nav.go('biometric', { phone: params.phone }), 380); }
    }, 90);
  };
  const onChange = (v) => {
    if (expired) return;
    const d = v.replace(/\D/g, '').slice(0, 6);
    setErr(false); setCode(d);
    if (d.length === 6) {
      setTimeout(() => {
        if (d === '000000') setErr(true);
        else nav.go('biometric', { phone: params.phone });
      }, 280);
    }
  };
  const resend = () => { setT(30); setCode(''); setErr(false); setReading(true); setTimeout(() => { setReading(false); autofill('428913'); }, 2600); };

  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <StepBar step={5} total={8} />
      <div style={{ flex: 1, padding: '14px 24px 0' }} onClick={() => !reading && inputRef.current && inputRef.current.focus()}>
        <h1 style={{ fontSize: 25, fontWeight: 800, letterSpacing: '-.02em' }}>Verify your number</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>
          Enter the code sent to <b style={{ color: 'var(--mav-fg)' }}>{params.phone}</b>
        </p>
        <div style={{ position: 'relative', marginTop: 30 }}>
          <input ref={inputRef} inputMode="numeric" value={code} onChange={(e) => onChange(e.target.value)}
            style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }} />
          <div className="slots">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`slot ${err ? 'err' : !reading && code.length === i ? 'focus' : ''} ${i < code.length ? 'filled' : ''}`}>
                {code[i] || ''}
              </div>
            ))}
          </div>
        </div>

        {reading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <span className="autoread"><span className="spinner dark" /> Detecting code from SMS…</span>
          </div>
        )}
        {err && (
          <div className="alert alert-danger" style={{ marginTop: 16 }}>
            <Icon.alert s={18} /><span>That code isn't right. Check your messages and try again.</span>
          </div>
        )}
        {expired && !err && (
          <div className="alert alert-warning" style={{ marginTop: 16 }}>
            <Icon.clock s={18} /><span>Your code has expired. Tap resend to get a fresh one.</span>
          </div>
        )}

        <div className="spread" style={{ marginTop: 20 }}>
          <span className="muted" style={{ fontSize: 13 }}>
            {t > 0 ? <>Resend code in <b className="num" style={{ color: 'var(--mav-fg)' }}>0:{String(t).padStart(2, '0')}</b></> : 'Didn\u2019t get the code?'}
          </span>
          <button className="btn btn-ghost btn-sm" disabled={t > 0} style={{ opacity: t > 0 ? 0.4 : 1 }} onClick={resend}>Resend</button>
        </div>
        <div className="alert alert-primary" style={{ marginTop: 22 }}>
          <Icon.info s={18} /><span>Demo: the code auto-fills from SMS. Type any 6 digits manually, or <b>000000</b> to see the error state.</span>
        </div>
      </div>
    </div>
  );
};

/* ── Set / secure UPI PIN ──────────────────────────────────────────────── */
const SetPin = ({ nav, params, app }) => {
  const [stage, setStage] = useState('set'); // set | confirm
  const [pin, setPin] = useState('');
  const [first, setFirst] = useState('');
  const [err, setErr] = useState(false);
  const onKey = (k) => {
    if (pin.length >= 6) return;
    const next = pin + k; setPin(next); setErr(false);
    if (next.length === 6) {
      setTimeout(() => {
        if (stage === 'set') { setFirst(next); setPin(''); setStage('confirm'); }
        else {
          if (next === first) { app.setAuthed(true); nav.reset('home'); app.toast({ tone: 'success', title: 'You’re all set', desc: 'Welcome to Fyscal, ' + DATA.USER.first }); }
          else { setErr(true); setTimeout(() => { setPin(''); setStage('set'); setFirst(''); }, 700); }
        }
      }, 150);
    }
  };
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <div className="center-col" style={{ flex: 1, padding: '12px 24px 0', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)', display: 'grid', placeItems: 'center', marginBottom: 18 }}>
          <Icon.fingerprint s={30} />
        </div>
        <h1 style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-.02em' }}>
          {stage === 'set' ? 'Create your UPI PIN' : 'Confirm your UPI PIN'}
        </h1>
        <p className="muted" style={{ fontSize: 14.5, marginTop: 8, maxWidth: 280 }}>
          {stage === 'set' ? 'This 6-digit PIN authorises every payment. Don’t share it with anyone.' : 'Enter the same PIN once more to confirm.'}
        </p>
        <div style={{ marginTop: 30 }}><PinDots value={pin} error={err} /></div>
        {err && <p style={{ color: 'var(--mav-danger)', fontSize: 13, fontWeight: 600, marginTop: 14 }}>PINs didn’t match. Let’s try again.</p>}
      </div>
      <div style={{ padding: '0 20px' }}>
        <Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} />
      </div>
    </div>
  );
};

window.AuthScreens = { Onboarding, Login, Otp, SetPin, Brandmark };
