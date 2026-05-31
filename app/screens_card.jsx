/* ══════════════════════════════════════════════════════════════════════════
   UPI-powered Card ecosystem — inherits the app's LIGHT design system.
   Surfaces, spacing, type, rows, toggles & motion all shared with the app;
   only the card ART (FCard) stays a premium dark object (Apple-Wallet model).
   ══════════════════════════════════════════════════════════════════════════ */

const cardVariant = (id) => DATA.CARD.variants.find((v) => v.id === id) || DATA.CARD.variants[0];

/* the card object (stays a dark premium object on light surfaces) */
const FCard = ({ v, frozen, holder, number, expiry, style }) => (
  <div className="fcard" style={{ background: v.bg, color: v.ink, '--sheen': v.sheen, ...style }}>
    <div className="sheen" />
    <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="spread">
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-.01em', display: 'flex', alignItems: 'center', gap: 7 }}>
          <img src={v.ink === '#fff' ? 'assets/ft-mark-1080.png' : 'assets/ft-mark-black.png'} alt="" style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} /> fyscal
        </span>
        <span style={{ opacity: .85 }}><Icon.nfc s={22} /></span>
      </div>
      <div className="chip" />
      <div>
        <div className="card-num">•••• •••• •••• {number}</div>
        <div className="spread" style={{ marginTop: 10, alignItems: 'flex-end' }}>
          <div>
            <span className="card-meta">{holder}</span>
            <div className="card-meta" style={{ marginTop: 5, opacity: .62, fontSize: 8.5 }}>{(DATA.CARD.bank || 'Federal Bank')} · powered by UPI</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="card-meta">{expiry}</span>
            <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '.04em', marginTop: 4, opacity: .9 }}>{DATA.CARD.network || 'RuPay'}</div>
          </div>
        </div>
      </div>
    </div>
    {frozen && <div className="frost"><Icon.snow s={30} /><span style={{ fontSize: 12, fontWeight: 700 }}>Frozen</span></div>}
  </div>
);

/* light quick-control tile (inherits qa-btn / tinted-tile vocabulary) */
const CtrlTile = ({ icon: I, label, tint = 'var(--mav-primary)', active, onClick }) => (
  <button className="card" style={{ flex: 1, padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none', background: active ? 'var(--mav-bg-tertiary)' : '#fff' }} onClick={onClick}>
    <span style={{ width: 42, height: 42, borderRadius: 13, display: 'grid', placeItems: 'center', background: `color-mix(in srgb,${tint} 12%,#fff)`, color: tint }}><I s={21} /></span>
    <span style={{ fontSize: 11.5, fontWeight: 700 }}>{label}</span>
  </button>
);

/* ── Card landing (light, app-native) ──────────────────────────────────── */
const CardLanding = ({ nav, app }) => {
  const C = DATA.CARD;
  const [frozen, setFrozen] = useState(C.frozen);
  const v = cardVariant(C.variant);
  if (!C.issued) return <CardIssuanceIntro nav={nav} />;
  const pct = C.spentMonth / C.spendLimit;
  const avail = C.spendLimit - C.spentMonth;
  const circ = 2 * Math.PI * 52;

  return (
    <div className="screen bg-ios anim-in">
      <div className="screen-scroll pad-top" style={{ paddingBottom: 28 }}>
        <AppBar title="My Card" onBack={nav.back}
          right={<button className="iconbtn tinted" onClick={() => nav.go('cardcontrols')} aria-label="Controls"><Icon.cog s={20} /></button>} />

        {/* hero card carousel */}
        <div className="card-carousel">
          <div className="cc-slide"><FCard v={v} frozen={frozen} holder={C.holder} number={C.number} expiry={C.expiry} /></div>
          <div className="cc-slide"><FCard v={cardVariant('lime')} holder={C.holder} number="7730" expiry="09/29" /></div>
          <button className="apply-card light" onClick={() => nav.go('cardissue')}>
            <span className="ac-plus"><Icon.add s={28} /></span>
            <span style={{ fontWeight: 700, fontSize: 14.5 }}>Apply for a new card</span>
            <span style={{ fontSize: 12, color: 'var(--mav-muted)' }}>Virtual · ready in 60s</span>
          </button>
        </div>
        <div className="card-dots light"><i className="on" /><i /><i /></div>

        {/* quick controls */}
        <div style={{ padding: '16px 16px 0', display: 'flex', gap: 10 }}>
          <CtrlTile icon={frozen ? Icon.lock : Icon.snow} label={frozen ? 'Unfreeze' : 'Freeze'} active={frozen} tint="var(--mav-secondary)"
            onClick={() => { setFrozen((f) => !f); fx.tap(); DATA.CARD.frozen = !frozen; app.toast({ tone: frozen ? 'success' : 'info', title: frozen ? 'Card unfrozen' : 'Card frozen', desc: frozen ? 'Ready to pay' : 'All payments paused' }); }} />
          <CtrlTile icon={Icon.nfc} label="Tap to pay" onClick={() => nav.go('taptopay')} />
          <CtrlTile icon={Icon.sparkle} label="Style" tint="var(--mav-success)" onClick={() => nav.go('cardstyle')} />
          <CtrlTile icon={Icon.shield} label="Controls" tint="var(--mav-muted)" onClick={() => nav.go('cardcontrols')} />
        </div>

        {/* spend ring */}
        <div style={{ padding: '16px 16px 0' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg className="spend-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" stroke="var(--mav-bg-secondary)" />
              <circle cx="60" cy="60" r="52" stroke="var(--mav-primary)" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset .6s' }} />
            </svg>
            <div style={{ flex: 1 }}>
              <div className="eyebrow">This month</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', marginTop: 2 }}>{inr(C.spentMonth)}</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{inr(avail)} of {inr(C.spendLimit)} left</div>
            </div>
          </div>
        </div>

        {/* rewards vault preview */}
        <div style={{ padding: '16px 16px 0' }}>
          <div className="section-hd" style={{ paddingInline: 4 }}><span className="section-title">Reward vault</span><span className="section-link" onClick={() => nav.go('vault')}>Open</span></div>
          <div className="list-card">
            <div className="row" onClick={() => nav.go('vault')}>
              <div className="row-ic" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.gift s={20} /></div>
              <div className="row-body"><div className="row-title">3 rewards waiting</div><div className="row-sub">1 unlocked · 1 mystery drop</div></div>
              <span className="row-chev"><Icon.chev s={18} /></span>
            </div>
          </div>
        </div>

        {/* card activity */}
        <div style={{ padding: '16px 16px 0' }}>
          <div className="section-hd" style={{ paddingInline: 4 }}><span className="section-title">Card activity</span><span className="section-link" onClick={() => nav.go('history')}>All</span></div>
          <div className="list-card">
            {C.txns.map((t, i) => (
              <div className={`txn-item ${i < C.txns.length - 1 ? 'txn-divide' : ''}`} key={t.id}>
                <div className="cat-dot" style={{ background: t.credit ? 'color-mix(in srgb,var(--mav-success) 12%,#fff)' : 'var(--mav-bg-secondary)', color: t.credit ? 'var(--mav-success)' : 'var(--mav-fg)' }}><IconBy name={t.icon} s={20} /></div>
                <div className="txn-body"><div className="txn-name">{t.name}</div><div className="txn-meta">{t.cat} · {t.when}</div></div>
                <div className={`txn-amount ${t.credit ? 'credit' : 'debit'}`}>{t.credit ? '+' : '−'}{inr(Math.abs(t.amount))}</div>
              </div>
            ))}
          </div>
        </div>

        {/* subscriptions */}
        <div style={{ padding: '16px 16px 0' }}>
          <div className="section-hd" style={{ paddingInline: 4 }}><span className="section-title">Subscriptions on this card</span></div>
          <div className="list-card">
            {C.subscriptions.map((s, i) => (
              <div className={`txn-item ${i < C.subscriptions.length - 1 ? 'txn-divide' : ''}`} key={s.id}>
                <div className={`txn-icon ${s.tint === 'tint-success' ? 'av-credit' : s.tint === 'tint-warning' ? 'av-bill' : 'av-debit'}`}><IconBy name={s.icon} s={20} /></div>
                <div className="txn-body"><div className="txn-name">{s.name}</div><div className="txn-meta">{s.cycle}</div></div>
                <div className="num" style={{ fontWeight: 700, fontSize: 14 }}>{inr(s.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Issuance intro (light, dark card art) ─────────────────────────────── */
const CardIssuanceIntro = ({ nav }) => (
  <div className="screen bg-ios pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
    <AppBar onBack={nav.back} />
    <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
      <div style={{ width: '80%' }}><FCard v={cardVariant('graphite')} holder="YOUR NAME" number="••••" expiry="••/••" /></div>
      <h1 style={{ fontSize: 25, fontWeight: 800, letterSpacing: '-.02em', marginTop: 28 }}>The Fyscal Card</h1>
      <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 300 }}>UPI-native. Tap to pay anywhere. Rewards on every spend. Yours in 60 seconds — no plastic required.</p>
    </div>
    <div style={{ padding: '0 24px' }}><button className="btn btn-primary" onClick={() => nav.go('cardissue')}>Get my card</button></div>
  </div>
);

/* ── Issuance flow (light; minting/ready stay cinematic) ───────────────── */
const CardIssuance = ({ nav, app }) => {
  const [stage, setStage] = useState('eligible');
  const [variant, setVariant] = useState('graphite');
  const v = cardVariant(variant);
  useEffect(() => {
    if (stage === 'eligible') { const id = setTimeout(() => setStage('customize'), 1500); return () => clearTimeout(id); }
    if (stage === 'minting') { const id = setTimeout(() => { setStage('ready'); fx.success(); }, 2100); return () => clearTimeout(id); }
  }, [stage]);

  if (stage === 'eligible') {
    return (
      <div className="screen bg-ios pad-top anim-in">
        <AppBar onBack={nav.back} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)', width: 84, height: 84, borderRadius: 26 }}><Icon.shieldChk s={40} /></div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 18 }}>Checking your eligibility…</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>Your KYC is verified — this is instant.</p>
          <div className="spinner dark" style={{ marginTop: 22 }} />
        </div>
      </div>
    );
  }
  if (stage === 'customize') {
    return (
      <div className="screen bg-ios pad-top anim-in">
        <div className="screen-scroll" style={{ paddingBottom: 110 }}>
          <AppBar title="Choose your card" onBack={nav.back} />
          <div style={{ padding: '4px 20px 0' }}><FCard v={v} holder={DATA.USER.name.toUpperCase()} number="4291" expiry="09/29" /></div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '20px 20px 6px', scrollSnapType: 'x mandatory' }}>
            {DATA.CARD.variants.map((vr) => (
              <button key={vr.id} className={`variant light ${variant === vr.id ? 'sel' : ''}`} onClick={() => { setVariant(vr.id); fx.tap(); }}>
                <div className="vc" style={{ background: vr.bg }}><div className="sheen" style={{ '--sheen': vr.sheen }} /></div>
                <div className="vname">{vr.name}</div><div className="vsub">{vr.sub} · {vr.tier}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="action-dock on-ios"><button className="btn btn-primary" onClick={() => setStage('minting')}>Create my card</button></div>
      </div>
    );
  }
  if (stage === 'minting') {
    return (
      <div className="screen bg-ios">
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{ width: 200, opacity: .55 }}><FCard v={v} holder={DATA.USER.name.toUpperCase()} number="4291" expiry="09/29" /></div>
          <div className="spinner dark" style={{ marginTop: 30 }} />
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', marginTop: 20 }}>Minting your card…</h1>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 7 }}>Generating a secure virtual card</p>
        </div>
      </div>
    );
  }
  // ready — iconic moment (subtle glow on light)
  return (
    <div className="screen bg-ios anim-fade">
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center', position: 'relative' }}>
        <div className="reveal-glow" style={{ width: 300, height: 300, top: '26%', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ width: '84%', position: 'relative', zIndex: 1 }} className="reward-pop"><FCard v={v} holder={DATA.USER.name.toUpperCase()} number="4291" expiry="09/29" /></div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', marginTop: 28, position: 'relative', zIndex: 1 }}>Your card is ready</h1>
        <p className="muted" style={{ fontSize: 14.5, marginTop: 8, position: 'relative', zIndex: 1, maxWidth: 290 }}>Add it to Apple Pay &amp; start tapping. Your physical {v.name} card ships in 3–5 days.</p>
      </div>
      <div style={{ padding: '0 24px calc(28px + env(safe-area-inset-bottom,8px))', position: 'relative', zIndex: 1 }}>
        <button className="btn btn-primary" onClick={() => { DATA.CARD.issued = true; DATA.CARD.variant = variant; nav.reset('card'); app.toast({ tone: 'success', title: 'Card activated' }); }}>Start using my card</button>
      </div>
    </div>
  );
};

/* ── Card controls (light, shared Switch primitive) ────────────────────── */
const CardControls = ({ nav, app }) => {
  const C = DATA.CARD;
  const [frozen, setFrozen] = useState(C.frozen);
  const [ctrl, setCtrl] = useState(C.controls);
  const set = (k) => { setCtrl((c) => ({ ...c, [k]: !c[k] })); fx.tap(); };
  const Crow = ({ icon: I, title, sub, k, tint = 'var(--mav-primary)', divide }) => (
    <div className={`row ${divide ? 'txn-divide' : ''}`} style={{ cursor: 'default' }}>
      <div className="row-ic" style={{ background: `color-mix(in srgb,${tint} 12%,#fff)`, color: tint }}><I s={20} /></div>
      <div className="row-body"><div className="row-title">{title}</div>{sub && <div className="row-sub">{sub}</div>}</div>
      <Switch on={ctrl[k]} onClick={() => set(k)} />
    </div>
  );
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Card controls" onBack={nav.back} />
      <div className="screen-scroll" style={{ paddingBottom: 28 }}>
        <div style={{ padding: '4px 16px 0' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="row-ic" style={{ width: 48, height: 48, background: frozen ? 'var(--mav-bg-tertiary)' : 'var(--mav-bg-secondary)', color: frozen ? 'var(--mav-primary)' : 'var(--mav-fg)' }}><Icon.snow s={24} /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{frozen ? 'Card is frozen' : 'Freeze card'}</div><div className="muted" style={{ fontSize: 12.5 }}>{frozen ? 'All payments are paused' : 'Instantly pause all payments'}</div></div>
            <Switch on={frozen} onClick={() => { setFrozen((f) => !f); fx.tap(); DATA.CARD.frozen = !frozen; }} />
          </div>
        </div>
        <div className="section-hd" style={{ paddingInline: 20, paddingTop: 18 }}><span className="eyebrow">Where it works</span></div>
        <div className="list-card" style={{ margin: '0 16px' }}>
          <Crow icon={Icon.globe} title="Online payments" sub="E-commerce & in-app" k="online" />
          <Crow icon={Icon.nfc} title="Contactless / Tap" sub="NFC tap-to-pay" k="contactless" tint="var(--mav-secondary)" divide />
          <Crow icon={Icon.bank} title="ATM withdrawals" k="atm" divide />
          <Crow icon={Icon.globe} title="International" sub="Use abroad" k="intl" tint="var(--mav-muted)" divide />
        </div>
        <div className="section-hd" style={{ paddingInline: 20, paddingTop: 18 }}><span className="eyebrow">Limits & security</span></div>
        <div className="list-card" style={{ margin: '0 16px' }}>
          <div className="row"><div className="row-ic"><Icon.rupee s={20} /></div><div className="row-body"><div className="row-title">Monthly limit</div><div className="row-sub">{inr(C.spendLimit)}</div></div><span className="row-chev"><Icon.chev s={18} /></span></div>
          <div className="row txn-divide" onClick={() => app.toast({ tone: 'info', title: 'View card details', desc: 'Enter UPI PIN' })}><div className="row-ic"><Icon.eye s={20} /></div><div className="row-body"><div className="row-title">View card details</div><div className="row-sub">Number, CVV, expiry</div></div><span className="row-chev"><Icon.chev s={18} /></span></div>
          <div className="row txn-divide" onClick={() => nav.go('dispute', { id: 't1' })}><div className="row-ic" style={{ background: 'color-mix(in srgb,var(--mav-danger) 10%,#fff)', color: 'var(--mav-danger)' }}><Icon.alertTri s={20} /></div><div className="row-body"><div className="row-title">Report fraud</div><div className="row-sub">Block & raise a dispute</div></div><span className="row-chev"><Icon.chev s={18} /></span></div>
        </div>
      </div>
    </div>
  );
};

/* ── Tap to pay (light) ────────────────────────────────────────────────── */
const TapToPay = ({ nav, app }) => {
  const [stage, setStage] = useState('ready');
  useEffect(() => {
    if (stage === 'paying') { const id = setTimeout(() => { setStage('done'); fx.success(); }, 1800); return () => clearTimeout(id); }
    if (stage === 'done') { const id = setTimeout(() => nav.back(), 1800); return () => clearTimeout(id); }
  }, [stage]);
  return (
    <div className="screen bg-ios pad-top anim-fade">
      <AppBar title="Tap to pay" onBack={nav.back} />
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        {stage === 'done' ? (
          <React.Fragment>
            <div className="reveal-glow" style={{ width: 200, height: 200 }} />
            <svg className="check-ring" viewBox="0 0 100 100" fill="none" style={{ width: 92, height: 92, position: 'relative', zIndex: 1 }}>
              <circle cx="50" cy="50" r="44" stroke="var(--mav-success)" strokeWidth="5" /><path d="M30 51l13 13 27-29" stroke="var(--mav-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="num" style={{ fontSize: 30, fontWeight: 800, marginTop: 18 }}>{inr(420)}</h1>
            <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>Paid to Blue Tokai Coffee</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="nfc-stage" onClick={() => stage === 'ready' && setStage('paying')}>
              <span className="nfc-ring" /><span className="nfc-ring b" /><span className="nfc-ring c" />
              <div className="nfc-core"><Icon.nfc s={40} /></div>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 30 }}>{stage === 'paying' ? 'Hold near the reader…' : 'Ready to tap'}</h1>
            <p className="muted" style={{ fontSize: 14, marginTop: 8, maxWidth: 280 }}>{stage === 'paying' ? 'Keep your phone steady' : 'Hold your phone near any contactless terminal to pay with your Fyscal card.'}</p>
            {stage === 'ready' && <button className="btn btn-secondary" style={{ marginTop: 24, width: 'auto', padding: '12px 28px' }} onClick={() => setStage('paying')}>Simulate a tap</button>}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

/* ── Personalize (light) ───────────────────────────────────────────────── */
const CardStyle = ({ nav, app }) => {
  const [sel, setSel] = useState(DATA.CARD.variant);
  const v = cardVariant(sel);
  return (
    <div className="screen bg-ios pad-top anim-in">
      <div className="screen-scroll" style={{ paddingBottom: 110 }}>
        <AppBar title="Personalize" onBack={nav.back} />
        <div style={{ padding: '4px 20px 0' }}><FCard v={v} holder={DATA.USER.name.toUpperCase()} number={DATA.CARD.number} expiry={DATA.CARD.expiry} /></div>
        <div style={{ padding: '20px 16px 0' }}>
          <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 12 }}>Card finishes</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {DATA.CARD.variants.map((vr) => (
              <button key={vr.id} className={`variant light ${sel === vr.id ? 'sel' : ''}`} style={{ width: '100%' }} onClick={() => { setSel(vr.id); fx.tap(); }}>
                <div className="vc" style={{ background: vr.bg }}><div className="sheen" style={{ '--sheen': vr.sheen }} /></div>
                <div className="vname">{vr.name} {vr.tier !== 'Core' && <span style={{ color: 'var(--mav-primary)', fontSize: 10 }}>· {vr.tier}</span>}</div><div className="vsub">{vr.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="action-dock on-ios"><button className="btn btn-primary" onClick={() => { DATA.CARD.variant = sel; nav.back(); app.toast({ tone: 'success', title: 'Card style updated' }); }}>Apply finish</button></div>
    </div>
  );
};

/* ── Reward vault (light) ──────────────────────────────────────────────── */
const Vault = ({ nav, app }) => (
  <div className="screen bg-ios pad-top anim-in">
    <div className="screen-scroll" style={{ paddingBottom: 28 }}>
      <AppBar title="Reward vault" onBack={nav.back} />
      <div style={{ padding: '4px 20px 0', textAlign: 'center' }}>
        <div className="muted" style={{ fontSize: 13 }}>Unlocked this quarter</div>
        <div className="num" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', marginTop: 2 }}>₹2,040</div>
      </div>
      <div style={{ padding: '18px 16px 0' }} className="stack">
        {DATA.CARD.vault.map((r) => (
          <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 13, opacity: r.state === 'locked' ? .6 : 1, cursor: 'pointer' }}
            onClick={() => r.state === 'mystery' ? app.toast({ tone: 'info', title: 'Mystery drop', desc: 'Reveal on your next spend' }) : r.state === 'open' ? app.toast({ tone: 'success', title: r.brand, desc: r.title }) : app.toast({ tone: 'info', title: 'Locked', desc: r.tier })}>
            <div className="row-ic" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}>{r.state === 'locked' ? <Icon.lock s={22} /> : r.state === 'mystery' ? <Icon.sparkle s={22} /> : <Icon.gift s={22} />}</div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div><div className="muted" style={{ fontSize: 12 }}>{r.brand} · {r.tier}</div></div>
            <span className="stpill" style={{ background: r.state === 'open' ? 'color-mix(in srgb,var(--mav-success) 14%,#fff)' : 'var(--mav-bg-secondary)', color: r.state === 'open' ? 'var(--mav-success)' : 'var(--mav-muted)' }}>{r.state === 'open' ? 'Claim' : r.state === 'mystery' ? 'Mystery' : 'Locked'}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 16px 0' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'linear-gradient(120deg,var(--mav-bg-tertiary),#fff)' }}>
          <div className="row-ic" style={{ background: 'linear-gradient(135deg,#caa07a,#7d5638)', color: '#fff' }}><Icon.trophy s={22} /></div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>Fyscal Elite</div><div className="muted" style={{ fontSize: 12 }}>Lounge access · 2% cashback · concierge</div></div>
          <button className="btn btn-tonal btn-sm" onClick={() => app.toast({ tone: 'info', title: 'Fyscal Elite', desc: 'Upgrade coming soon' })}>Upgrade</button>
        </div>
      </div>
    </div>
  </div>
);

window.CardScreens = { CardLanding, CardIssuance, CardControls, TapToPay, CardStyle, Vault, FCard };
