/* ══════════════════════════════════════════════════════════════════════════
   Amount entry · Pay flow (confirm → PIN → states) · Receipt · Receive · Add
   States: success · failed · pending · reversal/refund
   Trust + fraud cues, large-amount & daily-limit warnings, sound/motion.
   ══════════════════════════════════════════════════════════════════════════ */

const LARGE_AMT = 10000;

/* ── Enter amount ──────────────────────────────────────────────────────── */
const Amount = ({ nav, params, app }) => {
  const [amt, setAmt] = useState('');
  const [note, setNote] = useState('');
  const p = params.payee;
  const u = DATA.USER;
  const n = Number(amt || 0);
  const remainingLimit = u.upiLimit - u.spentToday;
  const overBalance = n > u.balance;
  const overLimit = n > remainingLimit;
  const isLarge = n >= LARGE_AMT && !overBalance && !overLimit;
  const valid = n > 0 && !overBalance && !overLimit;
  const onKey = (k) => { if (amt.replace(/\D/g, '').length >= 7) return; fx.tap(); setAmt((a) => (a === '0' ? k : a + k)); };

  const subtitle = p.self ? 'From ' + p.fromLabel : p.bank ? p.vpa : p.vpa;

  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} title={p.self ? 'Self transfer' : null} />
      {/* payee chip */}
      <div className="center-col" style={{ gap: 8, padding: '0 24px 6px' }}>
        {p.self ? <div className="bank-logo" style={{ width: 52, height: 52, fontSize: 17, background: 'var(--mav-primary)' }}><Icon.refresh s={24} /></div> : <Avatar name={p.name} size={54} />}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16.5, fontWeight: 700 }}>
            {p.self ? 'To ' + p.name : p.name}
            {p.isNew && <span className="vbadge new" style={{ marginLeft: 8 }}><Icon.alert s={11} /> New</span>}
          </div>
          <div className="muted num" style={{ fontSize: 12.5, marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>

      {/* amount */}
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', gap: 10 }}>
        <div className="amount-display">
          <span className="amount-cur">₹</span>
          <span className={`amount-val ${n === 0 ? 'placeholder' : ''}`}>{amt ? Number(amt).toLocaleString('en-IN') : '0'}</span>
        </div>
        <div className="amt-words">{n > 0 ? inrWords(n) : ''}</div>
        {overBalance ? (
          <span className="badge badge-danger"><Icon.alert s={12} /> Exceeds balance of {inr(u.balance)}</span>
        ) : overLimit ? (
          <span className="badge badge-danger"><Icon.alert s={12} /> Over today’s limit · {inr(remainingLimit)} left</span>
        ) : (
          <button className="chip chip-tonal" onClick={() => setAmt(String(Math.min(Math.round(u.balance), remainingLimit)))}>Balance {inr(u.balance)}</button>
        )}
        <div className="chip-row" style={{ justifyContent: 'center' }}>
          {[100, 500, 1000, 2000].map((v) => (<button key={v} className="chip" onClick={() => setAmt(String(v))}>₹{v.toLocaleString('en-IN')}</button>))}
        </div>
      </div>

      {/* warnings */}
      {isLarge && (
        <div style={{ padding: '0 20px 8px' }}>
          <div className="fraud-banner">
            <span className="fi"><Icon.shield s={18} /></span>
            <span className="ft"><b>Large payment.</b> You’re sending {inr(n)}. Double-check you trust {p.name.split(' ')[0]} before you continue.</span>
          </div>
        </div>
      )}
      {overLimit && (
        <div style={{ padding: '0 20px 8px' }}>
          <div className="alert alert-danger"><Icon.alert s={18} /><span>UPI allows up to {inr(u.upiLimit)}/day. You’ve used {inr(u.spentToday)} — only {inr(remainingLimit)} left today.</span></div>
        </div>
      )}

      {/* note */}
      <div style={{ padding: '0 24px 10px' }}>
        <div className="input-box" style={{ padding: '12px 14px', borderRadius: 14 }}>
          <span className="muted"><Icon.share s={18} /></span>
          <input placeholder="Add a note (optional)" value={note} maxLength={50} onChange={(e) => setNote(e.target.value)} style={{ fontSize: 14, fontWeight: 500 }} />
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <Keypad onKey={onKey} onDelete={() => { fx.tap(); setAmt((a) => a.slice(0, -1)); }} />
      </div>
      <div style={{ padding: '6px 20px 0' }}>
        <button className="btn btn-primary" disabled={!valid} onClick={() => nav.go('pay', { payee: p, amount: n, note })}>
          {valid ? <>Continue · {inr(n)}</> : overLimit ? 'Reduce amount' : 'Enter amount'}
        </button>
      </div>
    </div>
  );
};

/* ── Pay flow: confirm → PIN → processing → result ─────────────────────── */
const PayFlow = ({ nav, params, app }) => {
  const { payee, amount, note } = params;
  const [stage, setStage] = useState('review'); // review | pin | processing | success | failed | pending | reversal
  const [pin, setPin] = useState('');
  const [source, setSource] = useState(DATA.SELF_ACCOUNTS[0]);
  const [srcSheet, setSrcSheet] = useState(false);
  const txnId = useRef('T' + Date.now().toString().slice(-10) + 'FY').current;
  // demo triggers
  const outcome = amount === 1 ? 'failed' : amount === 2 ? 'reversal' : amount === 3 ? 'pending' : 'success';
  useEffect(() => { app.setTone(stage === 'processing' ? 'light' : 'dark'); }, [stage]);

  const result = { payee, amount, note, txnId, source: source.name + ' ' + source.acc, when: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) };

  const onKey = (k) => {
    if (pin.length >= 6) return;
    fx.tap();
    const next = pin + k; setPin(next);
    if (next.length === 6) {
      setStage('processing');
      setTimeout(() => {
        setStage(outcome);
        if (outcome === 'success') fx.success(); else if (outcome === 'pending') fx.pending(); else fx.fail();
      }, 1900);
    }
  };

  /* processing */
  if (stage === 'processing') {
    return (
      <div className="screen anim-fade" style={{ background: 'linear-gradient(160deg,var(--mav-primary),var(--mav-secondary))', color: '#fff' }}>
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', gap: 22, textAlign: 'center', padding: 30 }}>
          <div className="spinner lg" />
          <div>
            <div style={{ fontSize: 19, fontWeight: 700 }}>Paying {inr(amount)}</div>
            <div style={{ opacity: .82, fontSize: 14, marginTop: 6 }}>to {payee.name} · Securing with UPI</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: .8, fontSize: 12 }}><Icon.lock s={14} /> Do not close or press back</div>
        </div>
      </div>
    );
  }

  /* result states */
  if (['success', 'failed', 'pending', 'reversal'].includes(stage)) {
    const cfg = {
      success: { tone: 'success', I: Icon.check, ring: true, title: 'Paid to ' + payee.name, color: 'var(--mav-success)' },
      failed: { tone: 'danger', I: Icon.close, title: 'Payment failed', color: 'var(--mav-danger)' },
      pending: { tone: 'warning', I: Icon.clock, title: 'Payment processing', color: 'var(--mav-warning)' },
      reversal: { tone: 'neutral', I: Icon.refresh, title: 'Payment reversed', color: 'var(--mav-fg)' },
    }[stage];

    return (
      <div className="screen bg-white anim-fade" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom,8px))' }}>
        <div className="screen-scroll pad-top" style={{ padding: '54px 24px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="center-col" style={{ gap: 6, textAlign: 'center', position: 'relative', paddingBottom: 40 }}>
            {stage === 'success' && <React.Fragment>
              <div className="reveal-glow" style={{ width: 240, height: 240, left: '50%', top: -20, transform: 'translateX(-50%)' }} />
              <div className="success-burst">{Array.from({ length: 10 }).map((_, i) => <i key={i} style={{ transform: `rotate(${i * 36}deg) translateY(-66px)`, animationDelay: (.35 + i * 0.02) + 's' }} />)}</div>
            </React.Fragment>}
            {cfg.ring ? (
              <svg className="check-ring" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="44" stroke="var(--mav-success)" strokeWidth="5" />
                <path d="M30 51l13 13 27-29" stroke="var(--mav-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: `color-mix(in srgb,${cfg.color} 12%,#fff)`, color: cfg.color, display: 'grid', placeItems: 'center' }}><cfg.I s={46} sw={2.4} /></div>
            )}
            <div className="num amt-pop" style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', marginTop: 14 }}>{inr(amount)}</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{cfg.title}</div>
            <div className="muted" style={{ fontSize: 13.5, maxWidth: 290 }}>
              {stage === 'success' && <>{payee.vpa} · {result.when}</>}
              {stage === 'failed' && 'Your bank declined this. No money left your account.'}
              {stage === 'pending' && 'Your bank is taking a little longer than usual. Hang tight — we’ll update you the moment it clears.'}
              {stage === 'reversal' && 'The amount was debited but the transfer didn’t complete. A refund is on its way.'}
            </div>

            {/* humanized state extras */}
            {stage === 'pending' && (
              <div className="card-flat" style={{ width: '100%', marginTop: 18, textAlign: 'left' }}>
                <div className="tl">
                  <div className="tl-step"><span className="tl-dot done"><Icon.check s={13} sw={3} /></span><div className="tl-body"><div className="tl-title">Payment initiated</div><div className="tl-time">Just now · {inr(amount)} debited</div></div></div>
                  <div className="tl-step"><span className="tl-dot cur"><Icon.clock s={13} /></span><div className="tl-body"><div className="tl-title">Awaiting bank confirmation</div><div className="tl-time">Usually under 2 minutes</div></div></div>
                  <div className="tl-step"><span className="tl-dot wait" /><div className="tl-body"><div className="tl-title" style={{ color: 'var(--mav-muted)' }}>Credited to {payee.name.split(' ')[0]}</div></div></div>
                </div>
              </div>
            )}
            {stage === 'reversal' && (
              <div className="card-flat" style={{ width: '100%', marginTop: 18, textAlign: 'left' }}>
                <div className="tl">
                  <div className="tl-step"><span className="tl-dot done"><Icon.check s={13} sw={3} /></span><div className="tl-body"><div className="tl-title">{inr(amount)} debited</div><div className="tl-time">{result.when}</div></div></div>
                  <div className="tl-step"><span className="tl-dot cur"><Icon.refresh s={13} /></span><div className="tl-body"><div className="tl-title">Refund initiated</div><div className="tl-time">Auto-reversal in progress</div></div></div>
                  <div className="tl-step"><span className="tl-dot wait" /><div className="tl-body"><div className="tl-title" style={{ color: 'var(--mav-muted)' }}>Back in your account</div><div className="tl-time">Expected within 48 hours</div></div></div>
                </div>
              </div>
            )}
            {stage === 'failed' && (
              <div className="alert alert-danger" style={{ marginTop: 16, textAlign: 'left' }}>
                <Icon.info s={18} /><span>Error <b>U30</b> — insufficient funds at issuing bank. Try a smaller amount or another account.</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stage === 'success' && (
            <React.Fragment>
              <button className="btn btn-secondary" onClick={() => nav.go('receipt', { ...result, status: 'success' })}><Icon.share s={18} /> View &amp; share receipt</button>
              <button className="btn btn-primary" onClick={() => nav.reset('home')}>Done</button>
            </React.Fragment>
          )}
          {stage === 'pending' && (
            <React.Fragment>
              <button className="btn btn-secondary" onClick={() => nav.go('receipt', { ...result, status: 'pending' })}>View details</button>
              <button className="btn btn-primary" onClick={() => nav.reset('home')}>Got it</button>
            </React.Fragment>
          )}
          {stage === 'reversal' && (
            <React.Fragment>
              <button className="btn btn-secondary" onClick={() => nav.go('receipt', { ...result, status: 'reversal' })}>View refund status</button>
              <button className="btn btn-primary" onClick={() => nav.reset('home')}>Done</button>
            </React.Fragment>
          )}
          {stage === 'failed' && (
            <React.Fragment>
              <button className="btn btn-secondary" onClick={() => nav.reset('home')}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setPin(''); setStage('pin'); }}>Try again</button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  /* review + PIN sheet */
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Confirm payment" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px' }}>
        <div className="card center-col" style={{ gap: 5, padding: '22px 18px' }}>
          {payee.self ? <div className="bank-logo" style={{ width: 56, height: 56, fontSize: 18, background: 'var(--mav-primary)' }}><Icon.refresh s={26} /></div> : <Avatar name={payee.name} size={56} />}
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>{payee.name}</div>
          <div className="muted num" style={{ fontSize: 12.5 }}>{payee.vpa}</div>
          {payee.verified ? <span className="vbadge ok" style={{ marginTop: 4 }}><Icon.shieldChk s={12} /> Verified merchant</span>
            : payee.isNew ? <span className="vbadge new" style={{ marginTop: 4 }}><Icon.alert s={12} /> First-time payee</span> : null}
          <div className="num" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-.02em', marginTop: 10 }}>{inr(amount)}</div>
          {note && <div className="badge badge-neutral" style={{ marginTop: 4 }}>{note}</div>}
        </div>

        {payee.isNew && (
          <div className="fraud-banner" style={{ marginTop: 12 }}>
            <span className="fi"><Icon.shield s={18} /></span>
            <span className="ft"><b>You’re paying {payee.name} for the first time.</b> Only continue if you know and trust them.</span>
          </div>
        )}

        {/* source selector */}
        <div className="card-flat" style={{ marginTop: 12, padding: 0 }}>
          <div className="source-row" style={{ border: 'none' }} onClick={() => setSrcSheet(true)}>
            <div className="bank-logo" style={{ width: 38, height: 38, fontSize: 13, background: source.color }}>{source.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mav-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Paying from</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1 }}>{source.name} {source.acc}</div>
            </div>
            <span className="chip chip-tonal btn-sm" style={{ padding: '6px 12px' }}>Change</span>
          </div>
        </div>

        <div className="secure-strip" style={{ marginTop: 14 }}><Icon.shieldChk s={14} /> Authorised by your UPI PIN · Protected by Fyscal</div>
      </div>

      <div className="action-dock on-ios">
        <button className="btn btn-primary" onClick={() => { fx.tap(); setStage('pin'); }}>
          <Icon.lock s={18} /> Pay {inr(amount)}
        </button>
      </div>

      {/* PIN sheet */}
      <Sheet open={stage === 'pin'} onClose={() => { setPin(''); setStage('review'); }} title="Enter UPI PIN"
        titleRight={<span className="badge badge-primary"><Icon.shieldChk s={12} /> Secured</span>}>
        <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>{source.name} {source.acc} · Paying {inr(amount)} to {payee.name}</div>
        <div className="center-col"><PinDots value={pin} /></div>
        <div style={{ marginTop: 20 }}><Keypad onKey={onKey} onDelete={() => { fx.tap(); setPin((p) => p.slice(0, -1)); }} /></div>
        <div className="secure-strip"><Icon.lock s={13} /> Never share your UPI PIN with anyone</div>
      </Sheet>

      {/* source picker sheet */}
      <Sheet open={srcSheet} onClose={() => setSrcSheet(false)} title="Pay from">
        <div className="stack" style={{ gap: 10 }}>
          {DATA.SELF_ACCOUNTS.map((a) => (
            <button key={a.id} className={`source-row ${source.id === a.id ? 'sel' : ''}`} onClick={() => { setSource(a); setSrcSheet(false); fx.tap(); }}>
              <div className="bank-logo" style={{ width: 40, height: 40, fontSize: 14, background: a.color }}>{a.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{a.name} {a.acc}</div>
                <div className="source-bal num">Balance {inr(a.balance)}</div>
              </div>
              {source.id === a.id && <span style={{ color: 'var(--mav-primary)' }}><Icon.checkCircle s={22} /></span>}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
};

/* ── Receipt ───────────────────────────────────────────────────────────── */
const Receipt = ({ nav, params, app }) => {
  const { payee, amount, note, txnId, source, when, status = 'success' } = params;
  const cfg = {
    success: { cls: 'ok', I: Icon.checkCircle, label: 'Payment successful', sub: 'Money sent securely' },
    pending: { cls: 'pend', I: Icon.clock, label: 'Payment processing', sub: 'Awaiting bank confirmation' },
    reversal: { cls: 'rev', I: Icon.refresh, label: 'Payment reversed', sub: 'Refund in progress' },
    failed: { cls: 'fail', I: Icon.close, label: 'Payment failed', sub: 'No money was deducted' },
  }[status];

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Receipt" onBack={nav.back}
        right={<button className="iconbtn tinted" onClick={() => { fx.tap(); app.toast({ tone: 'success', title: 'Receipt downloaded', desc: 'Saved as PDF' }); }}><Icon.download s={20} /></button>} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        <div className="receipt">
          <div className={`receipt-head ${cfg.cls}`}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><cfg.I s={40} /></div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{cfg.label}</div>
            <div style={{ fontSize: 12.5, opacity: .9, marginTop: 2 }}>{cfg.sub}</div>
            <div className="num" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12 }}>{inr(amount)}</div>
          </div>
          <div className="receipt-perf" />
          <div className="receipt-body">
            <div className="r-row" style={{ paddingTop: 4 }}><span className="r-label">Paid to</span><span className="r-value">{payee.name}</span></div>
            <div className="r-row"><span className="r-label">{payee.bank ? 'Account' : 'UPI ID'}</span><span className="r-value num">{payee.vpa}</span></div>
            <div className="r-row"><span className="r-label">From</span><span className="r-value">{source}</span></div>
            <div className="r-row"><span className="r-label">Date &amp; time</span><span className="r-value">{when}</span></div>
            <div className="r-row"><span className="r-label">Transaction ID</span><span className="r-value num">{txnId}</span></div>
            <div className="r-row"><span className="r-label">UPI Ref no.</span><span className="r-value num">{txnId.slice(-12)}</span></div>
            {note && <div className="r-row"><span className="r-label">Note</span><span className="r-value">{note}</span></div>}
          </div>
        </div>

        {status === 'reversal' && <div className="alert alert-warning" style={{ marginTop: 14 }}><Icon.refresh s={18} /><span>Refund of {inr(amount)} expected back in {source} within 48 hours. No action needed.</span></div>}
        {status === 'pending' && <div className="alert alert-warning" style={{ marginTop: 14 }}><Icon.clock s={18} /><span>We’ll notify you the moment this clears. You won’t be charged twice.</span></div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={() => app.toast({ tone: 'info', title: 'Reporting an issue', desc: 'Our team will help' })}><Icon.headset s={18} /> Help</button>
          <button className="btn btn-primary" onClick={() => { fx.tap(); app.toast({ tone: 'success', title: 'Receipt shared' }); }}><Icon.share s={18} /> Share</button>
        </div>
        <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => nav.reset('home')}>Back to home</button>
      </div>
    </div>
  );
};

/* ── Share sheet (PhonePe-style) ───────────────────────────────────────── */
const ShareSheet = ({ open, onClose, name, handle, app }) => {
  const opts = [
    { id: 'wa', label: 'WhatsApp', icon: 'sms', bg: '#25d366' },
    { id: 'msg', label: 'Message', icon: 'sms', bg: 'var(--mav-secondary)' },
    { id: 'copy', label: 'Copy link', icon: 'copy', bg: 'var(--mav-fg)' },
    { id: 'save', label: 'Save image', icon: 'download', bg: 'var(--mav-success)' },
    { id: 'more', label: 'More', icon: 'dots', bg: 'var(--mav-muted)' },
  ];
  const onPick = (o) => {
    onClose();
    if (o.id === 'copy') app.toast({ tone: 'success', title: 'Link copied', desc: 'fyscal.me/' + handle.split('@')[0] });
    else if (o.id === 'save') app.toast({ tone: 'success', title: 'QR saved to Photos' });
    else app.toast({ tone: 'success', title: 'Shared via ' + o.label });
  };
  return (
    <Sheet open={open} onClose={onClose} title="Share your QR">
      {/* shareable preview card */}
      <div style={{ borderRadius: 18, padding: 18, background: 'linear-gradient(155deg,var(--mav-primary),var(--mav-secondary))', color: '#fff', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, padding: 6 }}>
          <FakeQR />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, opacity: .85, fontWeight: 600 }}>PAY ME ON FYSCAL</div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.01em', marginTop: 2 }}>{name}</div>
          <div className="num" style={{ fontSize: 12.5, opacity: .9, marginTop: 1 }}>{handle}</div>
        </div>
      </div>
      {/* share options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 8 }}>
        {opts.map((o) => (
          <button key={o.id} onClick={() => { fx.tap(); onPick(o); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
            <span style={{ width: 52, height: 52, borderRadius: 16, background: o.bg, color: '#fff', display: 'grid', placeItems: 'center' }}><IconBy name={o.icon} s={22} /></span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--mav-fg)' }}>{o.label}</span>
          </button>
        ))}
      </div>
      <div className="secure-strip"><Icon.gift s={13} /> Invite friends — you both earn ₹50 on their first payment</div>
    </Sheet>
  );
};

/* ── Receive (my QR) ───────────────────────────────────────────────────── */
const Receive = ({ nav, app }) => {
  const u = DATA.USER;
  const [tab, setTab] = useState('personal');
  const [share, setShare] = useState(false);
  const handle = tab === 'personal' ? u.vpa : 'fyscalstore@fyscal';
  const displayName = tab === 'personal' ? u.name : 'Fyscal Store';
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="My QR code" onBack={nav.back}
        right={<button className="iconbtn tinted" onClick={() => setShare(true)}><Icon.share s={20} /></button>} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        {/* personal / business toggle */}
        <div className="seg" style={{ marginBottom: 16 }}>
          <button className={tab === 'personal' ? 'on' : ''} onClick={() => { setTab('personal'); fx.tap(); }}>Personal</button>
          <button className={tab === 'business' ? 'on' : ''} onClick={() => { setTab('business'); fx.tap(); }}>Business</button>
        </div>

        {/* QR card */}
        <div className="card center-col" style={{ padding: '24px 22px', gap: 2 }}>
          <div style={{ position: 'relative' }}>
            <Avatar name={displayName} size={72} />
            <button className="iconbtn" style={{ position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, background: 'var(--mav-primary)', color: '#fff', border: '3px solid #fff' }} onClick={() => app.toast({ tone: 'info', title: 'Change photo' })}><Icon.camera s={14} /></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
            <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.01em' }}>{displayName}</span>
            <span style={{ color: 'var(--mav-secondary)' }}><Icon.checkCircle s={18} /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span className="muted" style={{ fontSize: 13.5 }}>UPI ID: <b className="num" style={{ color: 'var(--mav-fg)' }}>{handle}</b></span>
            <button onClick={() => { fx.tap(); app.toast({ tone: 'success', title: 'UPI ID copied', desc: handle }); }} style={{ border: 'none', background: 'none', color: 'var(--mav-primary)', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}><Icon.copy s={14} /> Copy</button>
          </div>

          <div style={{ width: 222, height: 222, margin: '20px 0 16px', display: 'grid', placeItems: 'center', background: '#fff', border: '1px solid var(--mav-border)', borderRadius: 16, padding: 14, position: 'relative' }}>
            <FakeQR />
            <div style={{ position: 'absolute', width: 40, height: 40, borderRadius: 10, background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 4px #fff' }}>
              <img src="assets/ft-mark-1080.png" alt="Fyscal" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
            </div>
          </div>

          <p className="muted" style={{ fontSize: 12.5, textAlign: 'center', lineHeight: 1.5, maxWidth: 280 }}>
            Anyone can scan this QR or send money to <b style={{ color: 'var(--mav-fg)' }}>{u.phone.replace('+91 ', '')}</b>. You’ll receive it in your <b style={{ color: 'var(--mav-primary)' }}>linked bank account</b> ({tab === 'personal' ? 'HDFC Bank' : 'ICICI Bank'}).
          </p>

          <button className="btn btn-secondary" style={{ marginTop: 18, color: 'var(--mav-primary)', boxShadow: 'inset 0 0 0 1.5px var(--mav-primary)', width: 'auto', padding: '12px 32px', borderRadius: 9999 }}
            onClick={() => { fx.tap(); setShare(true); }}>
            <Icon.share s={18} /> Share QR
          </button>
        </div>

        <ShareSheet open={share} onClose={() => setShare(false)} name={displayName} handle={handle} app={app} />

        {/* security shield + amount request */}
        <div className="list-card" style={{ marginTop: 14 }}>
          <div className="row" onClick={() => app.toast({ tone: 'info', title: 'Request a specific amount' })}>
            <div className="row-ic" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.rupee s={20} /></div>
            <div className="row-body"><div className="row-title">Request a set amount</div><div className="row-sub">Add an amount to your QR</div></div>
            <span className="row-chev"><Icon.chev s={18} /></span>
          </div>
          <div className="row txn-divide" style={{ borderTop: '1px solid var(--mav-bg-secondary)' }} onClick={() => app.toast({ tone: 'info', title: 'Security Shield', desc: 'Your account is protected' })}>
            <div className="row-ic" style={{ background: 'color-mix(in srgb,var(--mav-success) 12%,#fff)', color: 'var(--mav-success)' }}><Icon.shieldChk s={20} /></div>
            <div className="row-body"><div className="row-title">Fyscal Security Shield</div><div className="row-sub">Your payments are protected</div></div>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FakeQR = () => {
  const cells = []; let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 169; i++) cells.push(rnd() > 0.5);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13,1fr)', width: 176, height: 176, gap: 1 }}>
      {cells.map((on, i) => <div key={i} style={{ background: on ? '#0d0d0d' : 'transparent', borderRadius: 1 }} />)}
    </div>
  );
};

/* ── Add money ─────────────────────────────────────────────────────────── */
const AddMoney = ({ nav, app }) => {
  const [amt, setAmt] = useState('');
  const onKey = (k) => { if (amt.replace(/\D/g, '').length >= 6) return; fx.tap(); setAmt((a) => (a === '0' ? k : a + k)); };
  const n = Number(amt || 0);
  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar title="Add money" onBack={nav.back} />
      <div className="center-col" style={{ padding: '10px 24px 0' }}>
        <div className="eyebrow">Add to Fyscal balance</div>
        <div className="amount-display" style={{ marginTop: 14 }}>
          <span className="amount-cur">₹</span>
          <span className={`amount-val ${n === 0 ? 'placeholder' : ''}`}>{amt ? Number(amt).toLocaleString('en-IN') : '0'}</span>
        </div>
        <div className="amt-words" style={{ marginTop: 8 }}>{n > 0 ? inrWords(n) : ''}</div>
        <div className="chip-row" style={{ justifyContent: 'center', marginTop: 12 }}>
          {[500, 1000, 2000, 5000].map((v) => <button key={v} className="chip" onClick={() => setAmt(String(v))}>₹{v.toLocaleString('en-IN')}</button>)}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 16px 6px' }}>
        <div className="row" style={{ borderRadius: 14, border: '1px solid var(--mav-border)' }}>
          <div className="row-ic"><Icon.bank s={20} /></div>
          <div className="row-body"><div className="row-title">{DATA.USER.bank}</div><div className="row-sub">Default source</div></div>
          <span className="badge badge-primary">Selected</span>
        </div>
      </div>
      <div style={{ padding: '0 16px' }}><Keypad onKey={onKey} onDelete={() => { fx.tap(); setAmt((a) => a.slice(0, -1)); }} /></div>
      <div style={{ padding: '6px 20px 0' }}>
        <button className="btn btn-primary" disabled={n <= 0} onClick={() => { fx.success(); nav.reset('home'); app.toast({ tone: 'success', title: 'Money added', desc: inr(n) + ' added to balance' }); }}>
          {n > 0 ? <>Add {inr(n)}</> : 'Enter amount'}
        </button>
      </div>
    </div>
  );
};

window.PayScreens = { Amount, PayFlow, Receipt, Receive, AddMoney, FakeQR };
