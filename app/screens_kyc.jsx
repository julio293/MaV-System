/* ══════════════════════════════════════════════════════════════════════════
   Digital KYC verification — trust-first, guided, low-intimidation.
   intro → permission → PAN (enter/capture/OCR) → Aadhaar (enter/OTP) →
   address → liveness/face → processing → success | rejected
   ══════════════════════════════════════════════════════════════════════════ */

const KYC_TOTAL = 5;   // PAN · Aadhaar · Address · Selfie · Done

/* small reusable privacy footer */
const PrivacyNote = ({ text }) => (
  <div className="secure-strip" style={{ marginTop: 'auto' }}>
    <Icon.lock s={13} /> {text || 'Encrypted · Used only for verification · Never shared'}
  </div>
);

const KycFlow = ({ nav, app }) => {
  const [stack, setStack] = useState(['intro']);
  const stage = stack[stack.length - 1];
  const push = (s) => setStack((x) => [...x, s]);
  const set = (s) => setStack((x) => x.slice(0, -1).concat(s));
  const onBack = () => (stack.length > 1 ? setStack((x) => x.slice(0, -1)) : nav.back());

  // collected data
  const [pan, setPan] = useState(DATA.KYC.pan);
  const [address, setAddress] = useState(DATA.KYC.address);
  const [forceReject, setForceReject] = useState(false);

  useEffect(() => { app.setTone(['cam-pan', 'cam-face', 'liveness'].includes(stage) ? 'light' : 'dark'); }, [stage]);

  const STEP = { intro: 1, permission: 1, 'pan-enter': 1, 'cam-pan': 1, upload: 1, 'pan-ocr': 1,
    'aadhaar': 2, 'aadhaar-otp': 2, address: 3, 'face-intro': 4, 'cam-face': 4, liveness: 4, processing: 4, success: 5, rejected: 4 }[stage] || 1;

  /* ── INTRO ── */
  if (stage === 'intro') {
    const items = [
      { ic: 'idcard', t: 'PAN card', d: 'Number or a quick photo' },
      { ic: 'shieldChk', t: 'Aadhaar', d: 'Verified via secure OTP' },
      { ic: 'faceid', t: 'A quick selfie', d: 'Confirms it’s really you' },
    ];
    return (
      <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="Verify your identity" onBack={nav.back} />
        <div className="screen-scroll" style={{ padding: '8px 24px 0' }}>
          <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.idcard s={42} sw={1.5} /></div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center', marginTop: 12 }}>Let’s set up your full account</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, textAlign: 'center', marginTop: 8 }}>
            A one-time check by RBI rules. It takes about <b style={{ color: 'var(--mav-fg)' }}>2 minutes</b> — we’ll guide you the whole way.
          </p>
          <div className="card-flat" style={{ marginTop: 22, padding: '4px 16px' }}>
            {items.map((it, i) => (
              <div className="perm-row" key={i}>
                <div className="perm-ic tint-primary"><IconBy name={it.ic} s={22} /></div>
                <div className="perm-body"><div className="perm-title">{it.t}</div><div className="perm-desc">{it.d}</div></div>
                <span style={{ color: 'var(--mav-muted)' }}><Icon.chev s={18} /></span>
              </div>
            ))}
          </div>
          <div className="sec-banner" style={{ marginTop: 16 }}>
            <span className="si"><Icon.shieldChk s={18} /></span>
            <span className="st"><b>Your data is safe.</b> Encrypted end-to-end, used only to verify you, and never shared with anyone. You can delete it anytime.</span>
          </div>
        </div>
        <div className="action-dock">
          <TrustRow items={[['lock', 'Encrypted'], ['shieldChk', 'RBI · UIDAI'], ['check', 'DPDP 2023']]} />
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => push('pan-enter')}>Start verification</button>
        </div>
      </div>
    );
  }

  /* ── PAN entry (type or scan) ── */
  if (stage === 'pan-enter') {
    return (
      <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="PAN verification" onBack={onBack} />
        <StepBar step={1} total={KYC_TOTAL} />
        <div className="screen-scroll" style={{ padding: '16px 24px 0' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Enter your PAN</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 7, marginBottom: 18 }}>We verify it instantly with the income-tax database. No document upload needed.</p>
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">PAN number</label>
            <div className="input-box">
              <Icon.idcard s={20} sw={1.8} />
              <input placeholder="ABCDE1234F" value={pan.number} maxLength={10}
                onChange={(e) => setPan((p) => ({ ...p, number: e.target.value.toUpperCase().slice(0, 10) }))}
                style={{ textTransform: 'uppercase', letterSpacing: '.08em' }} />
              {/^[A-Z]{5}\d{4}[A-Z]$/.test(pan.number) && <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={20} /></span>}
            </div>
          </div>
          <div className="spread" style={{ gap: 12 }}>
            <div className="divider" style={{ flex: 1 }} /><span className="muted" style={{ fontSize: 12 }}>or</span><div className="divider" style={{ flex: 1 }} />
          </div>
          <button className="btn btn-secondary" style={{ marginTop: 14 }} onClick={() => push('permission')}>
            <Icon.camera s={19} /> Scan PAN card instead
          </button>
          <div className="sec-banner" style={{ marginTop: 16 }}>
            <span className="si"><Icon.lock s={18} /></span>
            <span className="st">We only read your name, PAN and date of birth — nothing else.</span>
          </div>
        </div>
        <div className="action-dock">
          <button className="btn btn-primary" disabled={!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan.number)} onClick={() => { push('upload'); }}>Verify PAN</button>
        </div>
      </div>
    );
  }

  /* ── Camera permission primer ── */
  if (stage === 'permission') {
    return (
      <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar onBack={onBack} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)', width: 84, height: 84, borderRadius: 26 }}><Icon.camera s={40} /></div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 14 }}>Allow camera access</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>
            Fyscal needs your camera to photograph your document and take a quick selfie. Photos are used only for this check.
          </p>
        </div>
        <div className="action-dock">
          <button className="btn btn-primary" onClick={() => set('cam-pan')}>Allow camera</button>
          <button className="btn btn-ghost" onClick={onBack}>Enter details manually</button>
        </div>
      </div>
    );
  }

  /* ── PAN document capture ── */
  if (stage === 'cam-pan') {
    return <DocCapture title="Scan PAN card" hint="Place your PAN inside the frame" kind="pan"
      onBack={onBack} onShot={() => set('upload')} />;
  }

  /* ── Upload progress → OCR ── */
  if (stage === 'upload') {
    return <UploadProgress onBack={onBack} onDone={() => set('pan-ocr')} label="Verifying your PAN" />;
  }

  /* ── OCR review + correction ── */
  if (stage === 'pan-ocr') {
    return <PanOcr pan={pan} setPan={setPan} onBack={onBack} onConfirm={() => push('aadhaar')} onRetry={() => set('permission')} />;
  }

  /* ── Aadhaar ── */
  if (stage === 'aadhaar') {
    return <AadhaarEnter onBack={onBack} onOtp={() => push('aadhaar-otp')} />;
  }
  if (stage === 'aadhaar-otp') {
    return <AadhaarOtp onBack={onBack} onDone={() => { setAddress(DATA.KYC.address); push('address'); }} />;
  }

  /* ── Address validation ── */
  if (stage === 'address') {
    return <AddressValidate address={address} setAddress={setAddress} onBack={onBack} onConfirm={() => push('face-intro')} />;
  }

  /* ── Face / liveness ── */
  if (stage === 'face-intro') {
    return (
      <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="Face verification" onBack={onBack} />
        <StepBar step={4} total={KYC_TOTAL} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)', width: 96, height: 96, borderRadius: 30 }}><Icon.faceid s={48} sw={1.4} /></div>
          <h1 style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-.02em', marginTop: 16 }}>Now, a quick selfie</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 300 }}>
            We’ll match your face to your PAN photo and check you’re really here. Find good light and remove glasses or masks.
          </p>
          <div className="card-flat" style={{ marginTop: 22, width: '100%', textAlign: 'left' }}>
            <div className="perm-row" style={{ padding: '10px 0' }}><div className="perm-ic tint-success"><Icon.check s={18} sw={2.6} /></div><div className="perm-body"><div className="perm-title">Look straight at the camera</div></div></div>
            <div className="perm-row" style={{ padding: '10px 0' }}><div className="perm-ic tint-success"><Icon.check s={18} sw={2.6} /></div><div className="perm-body"><div className="perm-title">Follow the on-screen prompts</div></div></div>
          </div>
        </div>
        <div className="action-dock">
          <button className="btn btn-primary" onClick={() => set('liveness')}><Icon.camera s={19} /> Start face scan</button>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }} onClick={() => { setForceReject(true); set('liveness'); }}>Demo: preview rejected outcome</button>
        </div>
      </div>
    );
  }
  if (stage === 'liveness') {
    return <Liveness result={!forceReject} onBack={onBack} onDone={(ok) => set(ok ? 'processing' : 'rejected')} />;
  }

  /* ── Processing → result ── */
  if (stage === 'processing') {
    return <KycProcessing onDone={() => set('success')} />;
  }
  if (stage === 'success') {
    return <KycSuccess nav={nav} app={app} pan={pan} />;
  }
  if (stage === 'rejected') {
    return <KycRejected onRetry={() => { setForceReject(false); setStack(['face-intro']); }} onSupport={() => app.toast({ tone: 'info', title: 'Support', desc: 'Opening help centre' })} onBack={() => nav.reset('home')} />;
  }
  return null;
};

/* ── Document capture (camera overlay) ─────────────────────────────────── */
const DocCapture = ({ title, hint, onBack, onShot }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => { const id = setTimeout(() => setReady(true), 1400); return () => clearTimeout(id); }, []);
  return (
    <div className="screen anim-fade">
      <div className="kyc-cam" />
      <div className="pad-top" style={{ position: 'relative', zIndex: 2 }}>
        <AppBar title={title} onBack={onBack} tone="flush" />
        <style>{`.appbar .ab-title{color:#fff}`}</style>
      </div>
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div className="doc-frame">
          <div className="doc-fill" style={{ opacity: ready ? .95 : .35, transition: 'opacity .4s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div><div style={{ fontSize: 8, fontWeight: 700, color: '#0a2a8f' }}>INCOME TAX DEPARTMENT</div><div style={{ fontSize: 7, color: '#33415c' }}>GOVT. OF INDIA</div></div>
              <div style={{ width: 30, height: 30, borderRadius: 4, background: 'rgba(53,46,255,.18)' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ width: 40, height: 48, borderRadius: 4, background: 'rgba(53,46,255,.22)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 6, width: '70%', background: 'rgba(20,22,60,.25)', borderRadius: 2, marginBottom: 5 }} />
                <div style={{ height: 6, width: '50%', background: 'rgba(20,22,60,.18)', borderRadius: 2, marginBottom: 5 }} />
                <div style={{ height: 8, width: '60%', background: 'rgba(53,46,255,.4)', borderRadius: 2 }} />
              </div>
            </div>
          </div>
          <div className="doc-corner" style={{ top: -2, left: -2, borderRight: 'none', borderBottom: 'none', borderTopLeftRadius: 14 }} />
          <div className="doc-corner" style={{ top: -2, right: -2, borderLeft: 'none', borderBottom: 'none', borderTopRightRadius: 14 }} />
          <div className="doc-corner" style={{ bottom: -2, left: -2, borderRight: 'none', borderTop: 'none', borderBottomLeftRadius: 14 }} />
          <div className="doc-corner" style={{ bottom: -2, right: -2, borderLeft: 'none', borderTop: 'none', borderBottomRightRadius: 14 }} />
        </div>
        <div className="doc-hint">{ready ? <><Icon.checkCircle s={16} /> Document detected — hold steady</> : <><span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> {hint}</>}</div>
      </div>
      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px calc(28px + env(safe-area-inset-bottom,8px))', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-primary" disabled={!ready} onClick={onShot}><Icon.camera s={19} /> Capture</button>
        <button className="btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', backdropFilter: 'blur(8px)' }} onClick={onShot}>
          <Icon.download s={18} /> Upload from gallery
        </button>
      </div>
    </div>
  );
};

/* ── Upload progress ───────────────────────────────────────────────────── */
const UploadProgress = ({ onBack, onDone, label }) => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct((p) => {
      if (p >= 100) { clearInterval(id); setTimeout(onDone, 500); return 100; }
      return Math.min(100, p + Math.round(8 + Math.random() * 14));
    }), 220);
    return () => clearInterval(id);
  }, []);
  const done = pct >= 100;
  return (
    <div className="screen bg-white pad-top anim-in">
      <AppBar onBack={onBack} />
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 36px', textAlign: 'center' }}>
        <div className="auth-hero" style={{ background: done ? 'color-mix(in srgb,var(--mav-success) 12%,#fff)' : 'var(--mav-bg-tertiary)', color: done ? 'var(--mav-success)' : 'var(--mav-primary)', width: 76, height: 76, borderRadius: 24 }}>
          {done ? <Icon.checkCircle s={38} /> : <Icon.idcard s={36} />}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', marginTop: 16 }}>{done ? 'Verified' : label}</h1>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 7 }}>{done ? 'Reading your details…' : 'Securely checking the income-tax database'}</p>
        <div style={{ width: '100%', marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="uprog"><i style={{ width: pct + '%' }} /></div>
          <span className="num" style={{ fontSize: 13, fontWeight: 700, color: 'var(--mav-muted)', minWidth: 36 }}>{pct}%</span>
        </div>
        <PrivacyNote />
      </div>
    </div>
  );
};

/* ── PAN OCR review + correction ───────────────────────────────────────── */
const PanOcr = ({ pan, setPan, onBack, onConfirm, onRetry }) => {
  const [edit, setEdit] = useState(null);
  const Field = ({ k, label, flag }) => (
    <div className={`ocr-field ${edit === k ? 'editing' : flag ? 'flag' : ''}`} style={{ marginBottom: 10 }} onClick={() => setEdit(k)}>
      <div className="ocr-label">{label} {flag && edit !== k ? <span className="ocr-scanned" style={{ color: '#b35e00', background: 'color-mix(in srgb,var(--mav-warning) 14%,#fff)' }}>CHECK THIS</span> : <span className="ocr-scanned">SCANNED</span>}</div>
      {edit === k
        ? <input className="ocr-val" autoFocus value={pan[k]} onChange={(e) => setPan((p) => ({ ...p, [k]: e.target.value }))} onBlur={() => setEdit(null)} />
        : <div className="ocr-val">{pan[k]}</div>}
    </div>
  );
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar title="Confirm your details" onBack={onBack} />
      <StepBar step={1} total={KYC_TOTAL} />
      <div className="screen-scroll" style={{ padding: '14px 24px 0' }}>
        <div className="doc-thumb" style={{ marginBottom: 16 }}>
          <div className="dt-chip">PAN · scanned</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#0a2a8f' }}>INCOME TAX DEPARTMENT</div>
          <div style={{ height: 7, width: '55%', background: 'rgba(53,46,255,.4)', borderRadius: 2 }} />
        </div>
        <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginBottom: 16 }}>
          We read these from your PAN. <b style={{ color: 'var(--mav-fg)' }}>Tap any field to fix it</b> before we continue.
        </p>
        <Field k="name" label="Name" />
        <Field k="number" label="PAN number" />
        <Field k="dob" label="Date of birth" flag />
        <div className="sec-banner" style={{ marginTop: 6 }}>
          <span className="si"><Icon.info s={18} /></span>
          <span className="st">Make sure these exactly match your PAN. Mismatches can delay verification.</span>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ margin: '14px auto 0', display: 'flex' }} onClick={onRetry}>
          <Icon.rotate s={16} /> Couldn’t read it? Rescan
        </button>
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" onClick={onConfirm}>Looks correct — continue</button>
      </div>
    </div>
  );
};

/* ── Aadhaar entry ─────────────────────────────────────────────────────── */
const AadhaarEnter = ({ onBack, onOtp }) => {
  const [num, setNum] = useState('');
  const fmt = (v) => v.replace(/\D/g, '').slice(0, 12).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  const valid = num.replace(/\D/g, '').length === 12;
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar title="Aadhaar verification" onBack={onBack} />
      <StepBar step={2} total={KYC_TOTAL} />
      <div className="screen-scroll" style={{ padding: '16px 24px 0' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Enter your Aadhaar</h1>
        <p className="muted" style={{ fontSize: 14, marginTop: 7, marginBottom: 18 }}>We’ll send an OTP to your Aadhaar-linked mobile. Verified instantly via UIDAI — no document needed.</p>
        <div className="field">
          <label className="field-label">Aadhaar number</label>
          <div className="input-box">
            <Icon.shieldChk s={20} sw={1.8} />
            <input inputMode="numeric" placeholder="0000 0000 0000" value={num} onChange={(e) => setNum(fmt(e.target.value))} style={{ letterSpacing: '.06em' }} />
            {valid && <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={20} /></span>}
          </div>
        </div>
        <div className="sec-banner" style={{ marginTop: 16 }}>
          <span className="si"><Icon.lock s={18} /></span>
          <span className="st">Fyscal uses <b>UIDAI’s secure OTP</b>. We never store your full Aadhaar number — only a masked reference.</span>
        </div>
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" disabled={!valid} onClick={onOtp}>Send OTP</button>
      </div>
    </div>
  );
};

const AadhaarOtp = ({ onBack, onDone }) => {
  const [code, setCode] = useState('');
  const ref = useRef(null);
  useEffect(() => { ref.current && ref.current.focus(); }, []);
  const onChange = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 6); setCode(d);
    if (d.length === 6) setTimeout(onDone, 300);
  };
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar title="Aadhaar OTP" onBack={onBack} />
      <StepBar step={2} total={KYC_TOTAL} />
      <div style={{ flex: 1, padding: '14px 24px 0' }} onClick={() => ref.current && ref.current.focus()}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Enter UIDAI OTP</h1>
        <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>Sent to your Aadhaar-linked number ending <b style={{ color: 'var(--mav-fg)' }}>•••• 10</b></p>
        <div style={{ position: 'relative', marginTop: 28 }}>
          <input ref={ref} inputMode="numeric" value={code} onChange={(e) => onChange(e.target.value)} style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }} />
          <div className="slots">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`slot ${code.length === i ? 'focus' : ''} ${i < code.length ? 'filled' : ''}`}>{code[i] || ''}</div>
            ))}
          </div>
        </div>
        <div className="alert alert-primary" style={{ marginTop: 22 }}><Icon.info s={18} /><span>Demo: type any 6 digits to continue.</span></div>
      </div>
    </div>
  );
};

/* ── Address validation ────────────────────────────────────────────────── */
const AddressValidate = ({ address, setAddress, onBack, onConfirm }) => {
  const [edit, setEdit] = useState(false);
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar title="Address" onBack={onBack} />
      <StepBar step={3} total={KYC_TOTAL} />
      <div className="screen-scroll" style={{ padding: '14px 24px 0' }}>
        <div className="center-col" style={{ gap: 8, marginBottom: 18 }}>
          <div className="auth-hero" style={{ background: 'color-mix(in srgb,var(--mav-success) 12%,#fff)', color: 'var(--mav-success)', width: 64, height: 64, borderRadius: 20 }}><Icon.location s={30} /></div>
          <h1 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center' }}>Confirm your address</h1>
          <p className="muted" style={{ fontSize: 14, textAlign: 'center', maxWidth: 290 }}>Fetched from your Aadhaar record. Check it’s current.</p>
        </div>
        <div className="card-flat">
          <div className="spread" style={{ marginBottom: 10 }}>
            <span className="ocr-scanned">FROM AADHAAR</span>
            <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px' }} onClick={() => setEdit((e) => !e)}>{edit ? 'Done' : 'Edit'}</button>
          </div>
          {edit ? (
            <div className="stack" style={{ gap: 8 }}>
              {[['line1', 'Address line 1'], ['line2', 'Address line 2'], ['city', 'City'], ['state', 'State'], ['pin', 'PIN code']].map(([k, l]) => (
                <div className="input-box" key={k} style={{ padding: '10px 12px' }}>
                  <input placeholder={l} value={address[k]} onChange={(e) => setAddress((a) => ({ ...a, [k]: e.target.value }))} style={{ fontSize: 14 }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>
              {address.line1}<br />{address.line2}<br />{address.city}, {address.state}<br /><span className="num">{address.pin}</span>
            </div>
          )}
        </div>
        <div className="sec-banner" style={{ marginTop: 14 }}>
          <span className="si"><Icon.shieldChk s={18} /></span>
          <span className="st">Used only to satisfy RBI address-proof rules.</span>
        </div>
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" onClick={onConfirm}>Confirm address</button>
      </div>
    </div>
  );
};

/* ── Liveness / face scan ──────────────────────────────────────────────── */
const Liveness = ({ onBack, onDone, result = true }) => {
  const prompts = ['Position your face in the oval', 'Blink slowly', 'Turn your head left', 'Now smile 🙂', 'Hold still…'];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('scan'); // scan | done
  useEffect(() => {
    if (step >= prompts.length) { setPhase('done'); if (result) fx.success(); else fx.fail(); const id = setTimeout(() => onDone(result), 700); return () => clearTimeout(id); }
    const id = setTimeout(() => setStep((s) => s + 1), step === 0 ? 1200 : 1000);
    return () => clearTimeout(id);
  }, [step]);
  const progress = Math.min(1, step / prompts.length);
  const C = 2 * Math.PI * 138;

  return (
    <div className="screen anim-fade">
      <div className="kyc-cam" />
      <div className="pad-top" style={{ position: 'relative', zIndex: 2 }}>
        <AppBar title="Face verification" onBack={onBack} tone="flush" />
        <style>{`.appbar .ab-title{color:#fff}`}</style>
      </div>
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div className="face-wrap">
          <svg className="face-ring" viewBox="0 0 222 282">
            <ellipse cx="111" cy="141" rx="98" ry="127" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="5" />
            <ellipse cx="111" cy="141" rx="98" ry="127" fill="none" stroke={phase === 'done' ? 'var(--mav-success)' : 'var(--mav-primary)'} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - progress)} transform="rotate(-90 111 141)" style={{ transition: 'stroke-dashoffset .5s ease' }} />
          </svg>
          <div className={`face-oval ${phase === 'done' ? 'done' : 'scanning'}`}>
            <span style={{ color: 'rgba(255,255,255,.5)' }}>{phase === 'done' ? <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={64} /></span> : <Icon.user s={88} />}</span>
          </div>
          <div className="live-chip">
            {phase === 'done' ? <><span style={{ color: 'var(--mav-success)' }}><Icon.check s={15} sw={3} /></span> Liveness confirmed</> : <><span className="spinner dark" style={{ width: 14, height: 14, borderWidth: 2 }} /> {prompts[Math.min(step, prompts.length - 1)]}</>}
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,.7)', marginTop: 40, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Icon.shieldChk s={14} /> Liveness check · anti-spoofing active</div>
      </div>
    </div>
  );
};

/* ── Processing checklist ──────────────────────────────────────────────── */
const KycProcessing = ({ onDone }) => {
  const STEPS = ['Matching face with PAN photo', 'Validating Aadhaar with UIDAI', 'Cross-checking your details'];
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= STEPS.length) { const id = setTimeout(onDone, 600); return () => clearTimeout(id); }
    const id = setTimeout(() => setDone((d) => d + 1), 950); return () => clearTimeout(id);
  }, [done]);
  return (
    <div className="screen bg-white pad-top anim-in">
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 30px' }}>
        <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.shieldChk s={42} sw={1.5} /></div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center', marginTop: 12 }}>Verifying you</h1>
        <p className="muted" style={{ fontSize: 14, textAlign: 'center', marginTop: 7 }}>Almost there — this takes a few seconds.</p>
        <div className="card-flat" style={{ marginTop: 24, width: '100%', padding: '4px 18px' }}>
          {STEPS.map((label, i) => {
            const st = i < done ? 'done' : i === done ? 'active' : 'pending';
            return (
              <div className={`verify-item ${st === 'pending' ? 'is-pending' : ''}`} key={i}>
                <span className={`verify-dot ${st}`}>{st === 'done' && <Icon.check s={15} sw={3} />}</span>
                <span className="verify-label">{label}</span>
              </div>
            );
          })}
        </div>
        <PrivacyNote text="Bank-grade encryption · Powered by NPCI & UIDAI" />
      </div>
    </div>
  );
};

/* ── Success ───────────────────────────────────────────────────────────── */
const KycSuccess = ({ nav, app, pan }) => (
  <div className="splash" style={{ justifyContent: 'flex-start' }}>
    <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center', zIndex: 1 }}>
      <div style={{ width: 104, height: 104, borderRadius: 32, background: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto', animation: 'splashRise .5s cubic-bezier(.16,1,.3,1) both' }}>
        <svg className="check-ring" viewBox="0 0 92 92" fill="none" style={{ width: 66, height: 66 }}>
          <circle cx="46" cy="46" r="40" stroke="var(--mav-success)" strokeWidth="6" />
          <path d="M28 47l12 12 24-24" stroke="var(--mav-success)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', color: '#fff', marginTop: 24 }}>You’re verified!</h1>
      <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.85)', marginTop: 9, lineHeight: 1.5, maxWidth: 290 }}>
        Welcome aboard, {pan.name.split(' ')[0].charAt(0) + pan.name.split(' ')[0].slice(1).toLowerCase()}. Your full account is active — no payment limits, all features unlocked.
      </p>
      <div style={{ background: 'rgba(255,255,255,.14)', borderRadius: 16, padding: '14px 18px', marginTop: 22, width: '100%', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center' }}><Icon.shieldChk s={20} /></div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>KYC STATUS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Full KYC · Verified</div>
        </div>
        <span className="badge badge-success" style={{ background: 'rgba(255,255,255,.9)' }}><Icon.check s={12} sw={3} /> Active</span>
      </div>
    </div>
    <div style={{ padding: '0 24px calc(28px + env(safe-area-inset-bottom,8px))', width: '100%', zIndex: 1 }}>
      <button className="btn btn-secondary" style={{ background: '#fff', boxShadow: 'none' }}
        onClick={() => { nav.reset('home'); app.toast({ tone: 'success', title: 'KYC complete', desc: 'Your account is fully active' }); }}>
        Continue
      </button>
    </div>
  </div>
);

/* ── Rejected handling ─────────────────────────────────────────────────── */
const KycRejected = ({ onRetry, onSupport, onBack }) => (
  <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
    <AppBar onBack={onBack} />
    <div className="screen-scroll" style={{ padding: '0 28px' }}>
      <div className="center-col" style={{ paddingTop: 26, textAlign: 'center' }}>
        <div className="err-ic" style={{ background: 'color-mix(in srgb,var(--mav-warning) 14%,#fff)', color: '#b35e00' }}><Icon.alertTri s={40} /></div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12 }}>We couldn’t verify you</h1>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 300 }}>
          The selfie didn’t clearly match your document. This happens — usually it’s lighting or a blurry photo.
        </p>
      </div>
      <div className="card-flat" style={{ marginTop: 18, textAlign: 'left' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Tips for next time</div>
        {['Use bright, even lighting', 'Remove glasses, masks or caps', 'Hold the phone at eye level', 'Make sure the document photo is sharp'].map((t, i) => (
          <div className="perm-row" key={i} style={{ padding: '8px 0' }}>
            <div className="perm-ic tint-primary" style={{ width: 32, height: 32, borderRadius: 10 }}><Icon.check s={15} sw={2.6} /></div>
            <div className="perm-body"><div className="perm-title" style={{ fontSize: 13.5 }}>{t}</div></div>
          </div>
        ))}
      </div>
    </div>
    <div className="action-dock">
      <button className="btn btn-primary" onClick={onRetry}><Icon.rotate s={18} /> Try again</button>
      <button className="btn btn-ghost" onClick={onSupport}><Icon.headset s={18} /> Talk to support</button>
    </div>
  </div>
);

window.KycScreens = { KycFlow };
