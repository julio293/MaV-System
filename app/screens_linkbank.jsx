/* ══════════════════════════════════════════════════════════════════════════
   Bank linking + UPI setup — a self-contained wizard.
   search → SIM verify → fetching → account select → debit card → UPI PIN → done
   Plus error recovery: network, timeout, SMS failure, no accounts, unsupported.
   ══════════════════════════════════════════════════════════════════════════ */

/* bank monogram */
const BankLogo = ({ bank, size = 46 }) => {
  const sig = bank.name.split(' ').filter((w) => !['bank', 'of', 'the'].includes(w.toLowerCase()));
  const label = sig.length >= 2 ? (sig[0][0] + sig[1][0]) : sig[0].slice(0, 2);
  return <div className="bank-logo" style={{ width: size, height: size, fontSize: size * 0.36, background: bank.color }}>{label.toUpperCase()}</div>;
};

/* reusable full-panel error state */
const ErrorState = ({ icon: I = Icon.alertTri, tone = 'danger', title, desc, primaryLabel, onPrimary, secondaryLabel, onSecondary }) => {
  const bg = tone === 'warning' ? 'color-mix(in srgb,var(--mav-warning) 14%,#fff)' : 'color-mix(in srgb,var(--mav-danger) 9%,#fff)';
  const fg = tone === 'warning' ? '#b35e00' : 'var(--mav-danger)';
  return (
    <div className="center-col anim-fade" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
      <div className="err-ic" style={{ background: bg, color: fg }}><I s={40} /></div>
      <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12 }}>{title}</h1>
      <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>{desc}</p>
      <div className="stack" style={{ gap: 9, marginTop: 26, width: '100%' }}>
        <button className="btn btn-primary" onClick={onPrimary}>{primaryLabel}</button>
        {secondaryLabel && <button className="btn btn-ghost" onClick={onSecondary}>{secondaryLabel}</button>}
      </div>
    </div>
  );
};

const LinkBank = ({ nav, app }) => {
  const [stack, setStack] = useState(['search']);
  const stage = stack[stack.length - 1];
  const push = (s) => setStack((x) => [...x, s]);
  const pop = () => setStack((x) => (x.length > 1 ? x.slice(0, -1) : x));
  const onBack = () => (stack.length > 1 && stage !== 'success' ? pop() : nav.back());

  const [bank, setBank] = useState(null);
  const [query, setQuery] = useState('');
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [unsupported, setUnsupported] = useState(null);
  const [sel, setSel] = useState(['a1']);          // selected account ids
  const [sim, setSim] = useState(1);
  const [error, setError] = useState(null);          // {kind}
  const [card, setCard] = useState({ last6: '', exp: '' });
  const [cardErr, setCardErr] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => { const id = setTimeout(() => setLoadingBanks(false), 850); return () => clearTimeout(id); }, []);

  const STEP = { search: 1, sim: 2, fetching: 2, accounts: 3, card: 4, pin: 4, success: 4 }[stage];

  const chooseBank = (b) => { if (b.unsupported) { setUnsupported(b); return; } setBank(b); push('sim'); };

  /* ── fetching accounts animation ── */
  const Fetching = () => {
    const STEPS = ['Securely connecting to ' + bank.name, 'Confirming your mobile number', 'Fetching your linked accounts'];
    const [done, setDone] = useState(0);
    useEffect(() => {
      if (done >= STEPS.length) { const id = setTimeout(() => push('accounts'), 550); return () => clearTimeout(id); }
      const id = setTimeout(() => setDone((d) => d + 1), 900);
      return () => clearTimeout(id);
    }, [done]);
    return (
      <div className="screen-scroll" style={{ padding: '24px 24px 0' }}>
        <div className="center-col">
          <svg className="prog-ring" viewBox="0 0 96 96" fill="none">
            <circle className="bg" cx="48" cy="48" r="42" strokeWidth="7" />
            <circle className="fg" cx="48" cy="48" r="42" strokeWidth="7" strokeDasharray="264"
              strokeDashoffset={264 - (264 * Math.min(done, STEPS.length)) / STEPS.length} transform="rotate(-90 48 48)" />
          </svg>
          <h1 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', marginTop: 20, textAlign: 'center' }}>Setting up {bank.name}</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 7, textAlign: 'center', maxWidth: 260 }}>This is encrypted end-to-end. Please don't close the app.</p>
        </div>
        <div className="card-flat" style={{ marginTop: 24, padding: '4px 18px' }}>
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
        <button className="btn btn-ghost btn-sm" style={{ margin: '16px auto 0', display: 'flex' }} onClick={() => setError({ kind: 'timeout' })}>Trouble connecting?</button>
      </div>
    );
  };

  /* ── UPI PIN setup ── */
  const PinSetup = () => {
    const [phase, setPhase] = useState('set');
    const [pin, setPin] = useState('');
    const [first, setFirst] = useState('');
    const [err, setErr] = useState(false);
    const onKey = (k) => {
      if (pin.length >= 6) return;
      const next = pin + k; setPin(next); setErr(false);
      if (next.length === 6) setTimeout(() => {
        if (phase === 'set') { setFirst(next); setPin(''); setPhase('confirm'); }
        else if (next === first) push('success');
        else { setErr(true); setTimeout(() => { setPin(''); setPhase('set'); setFirst(''); }, 750); }
      }, 160);
    };
    return (
      <div className="screen bg-white" style={{ position: 'static', flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 'calc(16px + env(safe-area-inset-bottom,8px))' }}>
        <div className="center-col" style={{ flex: 1, justifyContent: 'flex-start', padding: '14px 24px 0', textAlign: 'center' }}>
          <div className="auth-hero" style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.lock s={28} /></div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12 }}>{phase === 'set' ? 'Set your UPI PIN' : 'Confirm your UPI PIN'}</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 8, maxWidth: 290, lineHeight: 1.5 }}>
            {phase === 'set' ? 'A 6-digit PIN set with ' + bank.name + ' that authorises every payment. Never share it.' : 'Enter the same 6 digits to confirm.'}
          </p>
          <div style={{ marginTop: 24 }}><PinDots value={pin} error={err} /></div>
          {err && <p style={{ color: 'var(--mav-danger)', fontSize: 13, fontWeight: 700, marginTop: 14 }}>PINs didn't match — try again.</p>}
          <div className="secure-strip" style={{ marginTop: 'auto' }}><Icon.shieldChk s={14} /> Set directly with your bank · Fyscal never stores it</div>
        </div>
        <div style={{ padding: '0 20px' }}><Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} /></div>
      </div>
    );
  };

  /* ── render error overlay ── */
  if (error) {
    const E = {
      timeout: { icon: Icon.clock, tone: 'warning', title: 'This is taking too long', desc: 'We couldn\u2019t reach ' + (bank ? bank.name : 'your bank') + ' in time. It\u2019s usually a slow connection — let\u2019s try once more.', primaryLabel: 'Retry', onPrimary: () => { setError(null); setStack((x) => x.slice(0, -1).concat('fetching')); }, secondaryLabel: 'I\u2019ll do this later', onSecondary: () => nav.back() },
      network: { icon: Icon.wifi, title: 'No internet connection', desc: 'Check your Wi-Fi or mobile data and try again. Your progress is saved.', primaryLabel: 'Retry', onPrimary: () => setError(null), secondaryLabel: 'Cancel', onSecondary: () => nav.back() },
      sms: { icon: Icon.sms, title: 'Couldn\u2019t verify by SMS', desc: 'The verification SMS didn\u2019t go through. Make sure the SIM for your registered number is active and has balance.', primaryLabel: 'Try again', onPrimary: () => setError(null), secondaryLabel: 'Use a different number', onSecondary: () => nav.reset('login') },
      noacct: { icon: Icon.search, title: 'No accounts found', desc: 'We couldn\u2019t find a bank account linked to your number at ' + (bank ? bank.name : 'this bank') + '. The mobile number on your bank records may be different.', primaryLabel: 'Try another bank', onPrimary: () => { setError(null); setStack(['search']); }, secondaryLabel: 'Get help', onSecondary: () => app.toast({ tone: 'info', title: 'Support', desc: 'Opening help centre' }) },
    }[error.kind];
    return (
      <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar onBack={() => setError(null)} />
        <ErrorState {...E} />
      </div>
    );
  }

  /* ── PIN stage (own keypad layout) ── */
  if (stage === 'pin') {
    return (
      <div className="screen bg-white pad-top anim-in" style={{ display: 'flex', flexDirection: 'column' }}>
        <AppBar onBack={onBack} />
        <StepBar step={STEP} total={4} />
        <PinSetup />
      </div>
    );
  }

  /* ── Success stage ── */
  if (stage === 'success') {
    const acctList = DATA.FOUND_ACCOUNTS.filter((a) => sel.includes(a.id));
    return (
      <div className="splash" style={{ justifyContent: 'flex-start' }}>
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center', zIndex: 1 }}>
          <div style={{ width: 104, height: 104, borderRadius: 32, background: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto', animation: 'splashRise .5s cubic-bezier(.16,1,.3,1) both' }}>
            <svg className="check-ring" viewBox="0 0 92 92" fill="none" style={{ width: 66, height: 66 }}>
              <circle cx="46" cy="46" r="40" stroke="var(--mav-success)" strokeWidth="6" />
              <path d="M28 47l12 12 24-24" stroke="var(--mav-success)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', color: '#fff', marginTop: 24 }}>Bank linked!</h1>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.85)', marginTop: 9, lineHeight: 1.5, maxWidth: 290 }}>
            {bank.name} · {acctList.length} account{acctList.length > 1 ? 's' : ''} linked. You're ready to pay anyone, instantly.
          </p>
          <div style={{ background: 'rgba(255,255,255,.14)', borderRadius: 16, padding: '14px 18px', marginTop: 22, width: '100%', display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center' }}><Icon.qr s={20} /></div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>YOUR UPI ID</div>
              <div className="num" style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{DATA.USER.vpa}</div>
            </div>
            <Icon.copy s={18} />
          </div>
        </div>
        <div style={{ padding: '0 24px calc(28px + env(safe-area-inset-bottom,8px))', width: '100%', zIndex: 1 }}>
          <button className="btn btn-secondary" style={{ background: '#fff', boxShadow: 'none' }}
            onClick={() => { nav.reset('home'); app.toast({ tone: 'success', title: 'Bank linked', desc: bank.name + ' is ready to use' }); }}>
            Start paying
          </button>
        </div>
      </div>
    );
  }

  /* ── Wizard chrome for search/sim/fetching/accounts/card ── */
  const titles = { search: 'Add bank account', sim: 'Verify your number', fetching: 'Linking your bank', accounts: 'Choose account', card: 'Verify debit card' };

  return (
    <div className="screen bg-ios pad-top anim-in" style={{ paddingBottom: 0 }}>
      <AppBar title={titles[stage]} onBack={onBack} />
      <StepBar step={STEP} total={4} />

      {/* ── SEARCH ── */}
      {stage === 'search' && (
        <div className="screen-scroll" style={{ padding: '14px 16px 24px' }}>
          <div className="sec-banner" style={{ marginBottom: 16 }}>
            <span className="si"><Icon.shieldChk s={20} /></span>
            <span className="st">Fyscal links your account over <b>NPCI's secure UPI network</b>. We never see or store your bank password or card PIN.</span>
          </div>
          <div className="search-box">
            <Icon.search s={20} sw={1.8} />
            <input autoFocus placeholder="Search for your bank" value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && <button className="iconbtn ghost" style={{ width: 24, height: 24 }} onClick={() => setQuery('')}><Icon.close s={16} /></button>}
          </div>

          {loadingBanks ? (
            <div style={{ marginTop: 22 }}>
              <div className="sk" style={{ width: 120, height: 12, marginBottom: 18 }} />
              <div className="bank-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div className="center-col" style={{ gap: 8 }} key={i}>
                    <div className="sk" style={{ width: 46, height: 46, borderRadius: '50%' }} />
                    <div className="sk" style={{ width: 44, height: 9 }} />
                  </div>
                ))}
              </div>
            </div>
          ) : (() => {
            const q = query.trim().toLowerCase();
            const matches = DATA.BANK_DIR.filter((b) => b.name.toLowerCase().includes(q));
            if (q && matches.length === 0) {
              return (
                <div className="empty" style={{ marginTop: 24 }}>
                  <div className="empty-ic"><Icon.search s={30} /></div>
                  <div className="empty-title">No banks found</div>
                  <div className="empty-desc">We couldn't find "{query}". Try the full bank name.</div>
                  <button className="btn btn-tonal btn-sm" style={{ marginTop: 14 }} onClick={() => app.toast({ tone: 'info', title: 'Request sent', desc: 'We\u2019ll notify you when it\u2019s supported' })}>Request this bank</button>
                </div>
              );
            }
            return (
              <React.Fragment>
                {!q && (
                  <div style={{ marginTop: 20 }}>
                    <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 14 }}>Popular banks</div>
                    <div className="bank-grid">
                      {DATA.BANK_DIR.filter((b) => b.popular).map((b) => (
                        <button className="bank-tile" key={b.id} onClick={() => chooseBank(b)}>
                          <BankLogo bank={b} />
                          <span className="bank-tile-label">{b.name.replace(' Bank', '')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 22 }}>
                  <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 4 }}>{q ? 'Results' : 'All banks'}</div>
                  <div>
                    {matches.map((b) => (
                      <div className="bank-row" key={b.id} onClick={() => chooseBank(b)}>
                        <BankLogo bank={b} size={42} />
                        <span className="bank-name" style={{ flex: 1 }}>{b.name}</span>
                        {b.unsupported ? <span className="badge badge-neutral">Soon</span> : <span className="row-chev"><Icon.chev s={18} /></span>}
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })()}
        </div>
      )}

      {/* ── SIM VERIFY ── */}
      {stage === 'sim' && (
        <div className="screen-scroll" style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <BankLogo bank={bank} size={44} />
            <div><div style={{ fontSize: 16, fontWeight: 700 }}>{bank.name}</div><div className="muted" style={{ fontSize: 12.5 }}>Linking to {DATA.USER.phone}</div></div>
          </div>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: 16 }}>
            Your bank needs to confirm this is your phone. We'll send <b style={{ color: 'var(--mav-fg)' }}>one</b> secure SMS — choose the SIM with your registered number.
          </p>
          <div className="stack" style={{ gap: 10 }}>
            {[{ id: 1, carrier: 'Airtel', num: '98765 43210', match: true }, { id: 2, carrier: 'Jio', num: '90042 11876' }].map((s) => (
              <button className={`sim-opt ${sim === s.id ? 'sel' : ''}`} key={s.id} onClick={() => setSim(s.id)}>
                <div className="sim-slot">SIM {s.id}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontSize: 15, fontWeight: 700 }}>{s.carrier}</span>{s.match && <span className="badge badge-success"><Icon.check s={11} sw={3} />Registered</span>}</div>
                  <div className="num muted" style={{ fontSize: 12.5, marginTop: 2 }}>+91 {s.num}</div>
                </div>
                <span className="sim-radio" />
              </button>
            ))}
          </div>
          <div className="sec-banner" style={{ marginTop: 16 }}>
            <span className="si"><Icon.lock s={18} /></span>
            <span className="st">A one-time SMS charge (~₹1.50) may apply from your carrier. Nothing else is sent.</span>
          </div>
          <div className="action-dock on-ios" style={{ position: 'static', padding: '20px 0 0', background: 'none' }}>
            <button className="btn btn-primary" onClick={() => push('fetching')}>Verify securely</button>
            <button className="btn btn-ghost btn-sm" style={{ margin: '8px auto 0', display: 'flex' }} onClick={() => setError({ kind: 'sms' })}>SMS not working?</button>
          </div>
        </div>
      )}

      {/* ── FETCHING ── */}
      {stage === 'fetching' && <Fetching />}

      {/* ── ACCOUNTS ── */}
      {stage === 'accounts' && (
        <div className="screen-scroll" style={{ padding: '14px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <BankLogo bank={bank} size={40} />
            <div style={{ fontSize: 15, fontWeight: 700 }}>{bank.name}</div>
            <span className="badge badge-success" style={{ marginLeft: 'auto' }}><Icon.check s={11} sw={3} />Verified</span>
          </div>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.5, margin: '10px 0 18px' }}>
            We found <b style={{ color: 'var(--mav-fg)' }}>{DATA.FOUND_ACCOUNTS.length} accounts</b> linked to your number. Pick the ones to use with UPI — you can add more anytime.
          </p>
          <div className="stack" style={{ gap: 10 }}>
            {DATA.FOUND_ACCOUNTS.map((a) => {
              const on = sel.includes(a.id);
              return (
                <button className={`acct-row ${on ? 'sel' : ''}`} key={a.id}
                  onClick={() => setSel((xs) => on ? xs.filter((i) => i !== a.id) : [...xs, a.id])}>
                  <div className="row-ic" style={{ background: on ? '#fff' : '#eef0f5', color: on ? 'var(--mav-primary)' : 'var(--mav-fg)' }}><Icon.bank s={20} /></div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontSize: 14.5, fontWeight: 700 }}>{a.type}</span>{a.primary && <span className="badge badge-primary">Primary</span>}</div>
                    <div className="num muted" style={{ fontSize: 13, marginTop: 2 }}>{a.acc}</div>
                  </div>
                  <span className="acct-check">{on && <Icon.check s={15} sw={3} />}</span>
                </button>
              );
            })}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ margin: '14px auto 0', display: 'flex' }} onClick={() => setError({ kind: 'noacct' })}>Don't see your account?</button>
          <div className="action-dock on-ios" style={{ position: 'static', padding: '18px 0 0', background: 'none' }}>
            <button className="btn btn-primary" disabled={sel.length === 0} onClick={() => push('card')}>Continue with {sel.length} account{sel.length !== 1 ? 's' : ''}</button>
          </div>
        </div>
      )}

      {/* ── DEBIT CARD ── */}
      {stage === 'card' && (
        <div className="screen-scroll" style={{ padding: '16px 24px 24px' }}>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: 16 }}>
            To set a UPI PIN, {bank.name} asks for your debit card's <b style={{ color: 'var(--mav-fg)' }}>last 6 digits</b> and expiry. This goes straight to your bank — <b style={{ color: 'var(--mav-fg)' }}>Fyscal can't see it</b>.
          </p>
          <div className="cardv">
            <div className="card-strip" />
            <div className="field" style={{ marginBottom: 14 }}>
              <label className="field-label">Last 6 digits of debit card</label>
              <div className="input-box" style={cardErr ? { borderColor: 'var(--mav-danger)' } : null}>
                <Icon.card s={20} sw={1.8} />
                <input inputMode="numeric" placeholder="••• ••• " value={card.last6}
                  onChange={(e) => { setCardErr(false); setCard((c) => ({ ...c, last6: e.target.value.replace(/\D/g, '').slice(0, 6) })); }} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Expiry (MM / YY)</label>
              <div className="input-box">
                <Icon.clock s={20} sw={1.8} />
                <input inputMode="numeric" placeholder="MM / YY" value={card.exp}
                  onChange={(e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); setCard((c) => ({ ...c, exp: d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d })); }} />
              </div>
            </div>
          </div>
          {cardErr && <div className="alert alert-danger" style={{ marginTop: 14 }}><Icon.alert s={18} /><span>That card couldn't be verified. Check the digits and expiry, then try again.</span></div>}
          <div className="sec-banner" style={{ marginTop: 14 }}>
            <span className="si"><Icon.lock s={18} /></span>
            <span className="st">Encrypted by your bank's secure servers. We never store card details.</span>
          </div>
          <div className="action-dock on-ios" style={{ position: 'static', padding: '20px 0 0', background: 'none' }}>
            <button className="btn btn-primary" disabled={card.last6.length < 6 || card.exp.replace(/\D/g, '').length < 4 || verifying}
              onClick={() => {
                if (card.last6.startsWith('0000')) { setCardErr(true); return; }
                setVerifying(true);
                setTimeout(() => { setVerifying(false); push('pin'); app.toast({ tone: 'success', title: 'Card verified', desc: 'Now set your UPI PIN' }); }, 1100);
              }}>
              {verifying ? <><span className="spinner" /> Verifying…</> : 'Verify card'}
            </button>
            <p className="muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 12 }}>Demo: any 6 digits work · start with <b>0000</b> to see the error.</p>
          </div>
        </div>
      )}

      {/* unsupported bank sheet */}
      <Sheet open={!!unsupported} onClose={() => setUnsupported(null)} title="Not supported yet">
        <div className="center-col" style={{ textAlign: 'center', padding: '4px 4px 8px' }}>
          {unsupported && <BankLogo bank={unsupported} size={64} />}
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginTop: 14, maxWidth: 290 }}>
            <b style={{ color: 'var(--mav-fg)' }}>{unsupported && unsupported.name}</b> isn't on the UPI network through Fyscal yet. We're adding banks every month — we'll let you know the moment it's ready.
          </p>
        </div>
        <div className="stack" style={{ gap: 9, marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => { app.toast({ tone: 'success', title: 'We\u2019ll notify you', desc: unsupported.name + ' coming soon' }); setUnsupported(null); }}>Notify me when ready</button>
          <button className="btn btn-ghost" onClick={() => setUnsupported(null)}>Choose another bank</button>
        </div>
      </Sheet>
    </div>
  );
};

window.LinkBankScreens = { LinkBank };
