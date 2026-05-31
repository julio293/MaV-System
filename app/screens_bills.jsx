/* ══════════════════════════════════════════════════════════════════════════
   Bill payments — reminder-led hub, saved billers, categories,
   provider search, auto-fetch, AutoPay setup. Plus mobile recharge.
   ══════════════════════════════════════════════════════════════════════════ */

const billFg = (tint) =>
  tint === 'tint-success' ? 'var(--mav-success)' : tint === 'tint-warning' ? 'var(--mav-warning)' :
  tint === 'tint-neutral' ? 'var(--mav-fg)' : 'var(--mav-primary)';

/* ── Bills hub ─────────────────────────────────────────────────────────── */
const Bills = ({ nav, app }) => {
  const [remind, setRemind] = useState(true);
  const saved = DATA.SAVED_BILLERS;
  const reminders = saved.filter((b) => b.status === 'overdue' || (b.status === 'due' && b.daysLeft <= 3));

  return (
    <div className="screen bg-ios anim-fade">
      <div className="screen-scroll pad-top pad-nav">
        <AppBar title="Recharge & Bills" tone="flush"
          right={<button className="iconbtn tinted" onClick={() => nav.go('autopay', {})} aria-label="AutoPay"><Icon.repeat s={20} /></button>} />

        {/* smart reminders */}
        {reminders.length > 0 && (
          <div style={{ padding: '0 16px 4px' }}>
            <div className="section-hd" style={{ paddingInline: 4 }}>
              <span className="section-title">Reminders</span>
              <span className="badge badge-danger">{reminders.length} need action</span>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              {reminders.map((b) => {
                const overdue = b.status === 'overdue';
                return (
                  <div className={`remind-card ${overdue ? 'overdue' : 'due'}`} key={b.id}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="spread" style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center' }}><IconBy name={b.icon} s={20} /></div>
                          <div><div style={{ fontWeight: 700, fontSize: 14.5 }}>{b.provider}</div><div style={{ fontSize: 12, opacity: .9 }}>{b.nick} · {b.consumerId}</div></div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,.22)', padding: '4px 9px', borderRadius: 9999 }}>
                          {overdue ? `${Math.abs(b.daysLeft)}d overdue` : `Due in ${b.daysLeft}d`}
                        </span>
                      </div>
                      <div className="spread" style={{ alignItems: 'flex-end' }}>
                        <div><div style={{ fontSize: 11.5, opacity: .9 }}>{overdue ? 'Pay now to avoid late fees' : 'Due ' + b.due}</div><div className="num" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', marginTop: 2 }}>{inr(b.amount)}</div></div>
                        <button className="btn btn-sm" style={{ background: '#fff', color: overdue ? 'var(--mav-danger)' : '#e7820a', boxShadow: 'none', width: 'auto', padding: '10px 20px' }}
                          onClick={() => nav.go('biller', { savedId: b.id })}>Pay now</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* saved billers */}
        <div className="section-hd" style={{ paddingInline: 20, paddingTop: 16 }}>
          <span className="section-title">Saved billers</span>
          <span className="section-link" onClick={() => nav.go('autopay', {})}>Manage</span>
        </div>
        {saved.length === 0 ? (
          <div style={{ padding: '0 16px' }}>
            <div className="card-flat empty" style={{ padding: '28px 20px' }}>
              <div className="empty-ic"><Icon.bills s={30} /></div>
              <div className="empty-title">No billers saved yet</div>
              <div className="empty-desc">Add a biller once and pay in two taps every month — we’ll even remind you before it’s due.</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '0 16px' }}>
            <div className="list-card">
              {saved.map((b) => {
                const st = b.status === 'overdue' ? { c: 'var(--mav-danger)', t: 'Overdue' } : b.status === 'autopay' ? { c: 'var(--mav-primary)', t: 'AutoPay on' } : b.status === 'paid' ? { c: 'var(--mav-success)', t: 'Paid' } : { c: 'var(--mav-warning)', t: 'Due ' + b.due };
                return (
                  <div className="saved-row" key={b.id} onClick={() => nav.go('biller', { savedId: b.id })}>
                    <div className="cat-dot" style={{ background: `color-mix(in srgb,${billFg(b.tint)} 12%,#fff)`, color: billFg(b.tint) }}><IconBy name={b.icon} s={20} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{b.nick || b.provider}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{b.provider} · {b.consumerId}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {b.status === 'paid'
                        ? <span className="stpill" style={{ background: 'color-mix(in srgb,var(--mav-success) 12%,#fff)', color: 'var(--mav-success)' }}><Icon.check s={10} sw={3} /> Paid</span>
                        : b.status === 'autopay'
                        ? <span className="stpill" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.repeat s={10} /> AutoPay</span>
                        : <React.Fragment><div className="num" style={{ fontWeight: 800, fontSize: 14 }}>{inr(b.amount)}</div><div className="stpill" style={{ color: st.c, marginTop: 2, padding: 0 }}>{st.t}</div></React.Fragment>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* categories */}
        <div className="section-hd" style={{ paddingInline: 20, paddingTop: 16 }}><span className="section-title">Pay a new bill</span></div>
        <div style={{ padding: '0 16px' }}>
          <div className="card" style={{ padding: '18px 8px' }}>
            <div className="qa-grid" style={{ rowGap: 18 }}>
              {DATA.BILL_CATEGORIES.map((c) => (
                <button key={c.id} className="qa-btn" onClick={() => c.id === 'mobile' ? nav.go('recharge') : nav.go('billcat', { id: c.id })}>
                  <div className={`qa-icon ${c.tint}`}><span style={{ color: billFg(c.tint) }}><IconBy name={c.icon} s={24} /></span></div>
                  <span className="qa-label">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* mobile recharge + reminders toggle */}
        <div style={{ padding: '16px 16px 0' }}>
          <button className="row" style={{ width: '100%', background: '#fff', borderRadius: 16, marginBottom: 12 }} onClick={() => nav.go('recharge')}>
            <div className="row-ic" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.phone s={20} /></div>
            <div className="row-body" style={{ textAlign: 'left' }}><div className="row-title">Mobile recharge</div><div className="row-sub">Prepaid plans & top-ups</div></div>
            <span className="row-chev"><Icon.chev s={18} /></span>
          </button>
          <div className="row" style={{ background: '#fff', borderRadius: 16 }}>
            <div className="row-ic" style={{ background: 'color-mix(in srgb,var(--mav-warning) 14%,#fff)', color: 'var(--mav-warning)' }}><Icon.bell s={20} /></div>
            <div className="row-body"><div className="row-title">Due-date reminders</div><div className="row-sub">Alerts 3 days before every bill</div></div>
            <Switch on={remind} onClick={() => { setRemind((r) => !r); fx.tap(); }} />
          </div>
        </div>
      </div>
      <BottomNav active="bills" go={nav.go} />
    </div>
  );
};

/* ── Category → provider search ────────────────────────────────────────── */
const BillCategory = ({ nav, params, app }) => {
  const cat = DATA.BILL_CATEGORIES.find((c) => c.id === params.id) || DATA.BILL_CATEGORIES[0];
  const all = DATA.PROVIDERS[cat.id] || [];
  const [q, setQ] = useState('');
  const list = all.filter((p) => p.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title={cat.label} sub="Choose your provider" onBack={nav.back} />
      <div style={{ padding: '4px 16px 10px' }}>
        <div className="input-box" style={{ padding: '12px 14px', background: '#fff' }}>
          <span className="muted"><Icon.search s={20} /></span>
          <input autoFocus placeholder={`Search ${cat.label.toLowerCase()} providers`} value={q} onChange={(e) => setQ(e.target.value)} style={{ fontSize: 15, fontWeight: 500 }} />
          {q && <button className="iconbtn ghost" style={{ width: 24, height: 24 }} onClick={() => setQ('')}><Icon.close s={16} /></button>}
        </div>
      </div>
      <div className="screen-scroll" style={{ paddingBottom: 24 }}>
        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-ic"><span className="muted"><Icon.search s={30} /></span></div>
            <div className="empty-title">No provider found</div>
            <div className="empty-desc">We couldn’t find “{q}”. Try the full biller name, or request to add it.</div>
            <button className="btn btn-tonal btn-sm" style={{ marginTop: 14 }} onClick={() => app.toast({ tone: 'info', title: 'Request sent', desc: 'We’ll add it soon' })}>Request “{q}”</button>
          </div>
        ) : (
          <React.Fragment>
            <div className="section-hd" style={{ paddingInline: 20 }}><span className="eyebrow">{q ? 'Results' : 'Popular providers'}</span></div>
            <div className="list-card" style={{ margin: '0 16px' }}>
              {list.map((p, i) => (
                <div key={p} className={`row ${i < list.length - 1 ? 'txn-divide' : ''}`} onClick={() => nav.go('biller', { id: cat.id, provider: p })}>
                  <div className="cat-dot" style={{ background: `color-mix(in srgb,${billFg(cat.tint)} 12%,#fff)`, color: billFg(cat.tint) }}><IconBy name={cat.icon} s={20} /></div>
                  <div className="row-body"><div className="row-title">{p}</div></div>
                  <span className="row-chev"><Icon.chev s={18} /></span>
                </div>
              ))}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

/* ── Biller detail — auto-fetch, due/overdue, pay, autopay ─────────────── */
const Biller = ({ nav, params, app }) => {
  const saved = params.savedId ? DATA.SAVED_BILLERS.find((b) => b.id === params.savedId) : null;
  const cat = DATA.BILL_CATEGORIES.find((c) => c.id === (saved ? saved.category : params.id)) || DATA.BILL_CATEGORIES[0];
  const provider = saved ? saved.provider : (params.provider || cat.label);
  const [cid, setCid] = useState(saved ? saved.consumerId.replace(/[•]/g, '') + '209' : '');
  const [stage, setStage] = useState(saved ? 'fetch' : 'enter'); // enter | fetch | bill | paid
  const amount = saved ? saved.amount : 1840;
  const overdue = saved && saved.status === 'overdue';
  const alreadyPaid = saved && saved.status === 'paid';

  useEffect(() => {
    if (stage === 'fetch') { const id = setTimeout(() => setStage(alreadyPaid ? 'paid' : 'bill'), 1400); return () => clearTimeout(id); }
  }, [stage]);

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title={cat.label} sub={provider} onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 16px' }}>
        {/* consumer id */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="field">
            <label className="field-label">{cat.id === 'creditcard' ? 'Card number' : cat.id === 'fastag' ? 'Vehicle number' : 'Consumer ID'}</label>
            <div className="input-box">
              <IconBy name={cat.icon} s={18} />
              <input placeholder="Enter your ID" value={cid} readOnly={stage !== 'enter'} onChange={(e) => setCid(e.target.value)} style={{ fontWeight: 600 }} />
              {stage !== 'enter' && <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={20} /></span>}
            </div>
          </div>
          {stage === 'enter' && (
            <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: 12 }} disabled={cid.trim().length < 4} onClick={() => setStage('fetch')}>
              <Icon.refresh s={16} /> Fetch bill
            </button>
          )}
        </div>

        {stage === 'fetch' && (
          <div className="card center-col" style={{ gap: 14, padding: '34px 20px' }}>
            <span className="spinner dark" /><div className="muted" style={{ fontSize: 13.5 }}>Fetching your latest bill…</div>
          </div>
        )}

        {stage === 'paid' && (
          <div className="card center-col anim-fade" style={{ gap: 8, padding: '30px 20px', textAlign: 'center' }}>
            <div className="auth-hero" style={{ width: 60, height: 60, borderRadius: 18, background: 'color-mix(in srgb,var(--mav-success) 12%,#fff)', color: 'var(--mav-success)' }}><Icon.checkCircle s={30} /></div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>You’re all caught up</div>
            <div className="muted" style={{ fontSize: 13.5 }}>No dues for {provider}. {saved && saved.balance != null ? `Balance ${inr(saved.balance)}.` : ''}</div>
          </div>
        )}

        {stage === 'bill' && (
          <div className="anim-fade">
            {overdue && <div className="alert alert-danger" style={{ marginBottom: 12 }}><Icon.alertTri s={18} /><span><b>Bill overdue by {Math.abs(saved.daysLeft)} days.</b> Pay now to avoid a late fee and service interruption.</span></div>}
            <div className="card">
              <div className="spread" style={{ marginBottom: 14 }}>
                <div><div className="muted" style={{ fontSize: 12.5 }}>Consumer</div><div style={{ fontWeight: 700, fontSize: 15 }}>{DATA.USER.name}</div></div>
                <span className="stpill" style={overdue ? { background: 'color-mix(in srgb,var(--mav-danger) 12%,#fff)', color: 'var(--mav-danger)', padding: '4px 10px' } : { background: 'color-mix(in srgb,var(--mav-warning) 14%,#fff)', color: '#b35e00', padding: '4px 10px' }}>
                  <Icon.calendar s={11} /> {overdue ? 'Overdue ' + saved.due : 'Due ' + (saved ? saved.due : '30 Jun')}
                </span>
              </div>
              <div className="divider" style={{ margin: '0 -18px 14px' }} />
              <div className="spread"><span className="muted" style={{ fontSize: 13.5 }}>Bill amount</span><span className="num" style={{ fontSize: 24, fontWeight: 800 }}>{inr(amount)}</span></div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Billing period: 1 – 30 Jun 2026</div>
            </div>

            {/* autopay nudge */}
            <button className="row" style={{ width: '100%', background: '#fff', borderRadius: 16, marginTop: 12 }} onClick={() => nav.go('autopay', { provider, cat: cat.id })}>
              <div className="row-ic" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.repeat s={20} /></div>
              <div className="row-body" style={{ textAlign: 'left' }}><div className="row-title">Set up AutoPay</div><div className="row-sub">Never miss this bill again</div></div>
              <span className="row-chev"><Icon.chev s={18} /></span>
            </button>
            <div className="alert alert-success" style={{ marginTop: 12 }}><Icon.gift s={18} /><span>Pay now to earn <b>₹15 cashback</b>.</span></div>
          </div>
        )}
      </div>
      {stage === 'bill' && (
        <div className="action-dock on-ios">
          <button className="btn btn-primary" onClick={() => nav.go('pay', { payee: { name: provider, vpa: cat.id + '@billdesk', merchant: true }, amount, note: cat.label + ' bill' })}>Pay {inr(amount)}</button>
        </div>
      )}
    </div>
  );
};

/* ── AutoPay setup ─────────────────────────────────────────────────────── */
const AutoPay = ({ nav, params, app }) => {
  const [done, setDone] = useState(false);
  const [maxAmt, setMaxAmt] = useState('3000');
  const [when, setWhen] = useState('due');
  const [src, setSrc] = useState(DATA.SELF_ACCOUNTS[0]);
  const [srcSheet, setSrcSheet] = useState(false);
  const provider = params.provider || 'BESCOM Electricity';

  if (done) {
    return (
      <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="AutoPay" onBack={() => nav.reset('bills')} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
          <svg className="check-ring" viewBox="0 0 100 100" fill="none" style={{ width: 84, height: 84 }}>
            <circle cx="50" cy="50" r="44" stroke="var(--mav-success)" strokeWidth="5" />
            <path d="M30 51l13 13 27-29" stroke="var(--mav-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 16 }}>AutoPay is on</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>
            We’ll auto-pay <b style={{ color: 'var(--mav-fg)' }}>{provider}</b> up to {inr(Number(maxAmt))} on the due date from {src.name} {src.acc}. We’ll always notify you first.
          </p>
          <div className="card-flat" style={{ width: '100%', marginTop: 18, textAlign: 'left' }}>
            <div className="spread"><span className="muted" style={{ fontSize: 13 }}>You can cancel anytime</span><Icon.shieldChk s={16} /></div>
          </div>
        </div>
        <div style={{ padding: '0 20px' }}><button className="btn btn-primary" onClick={() => { nav.reset('bills'); app.toast({ tone: 'success', title: 'AutoPay enabled', desc: provider }); }}>Done</button></div>
      </div>
    );
  }

  return (
    <div className="screen bg-white pad-top anim-in" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar title="Set up AutoPay" sub={provider} onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 24px 0' }}>
        <div className="center-col" style={{ marginBottom: 18 }}>
          <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)', width: 64, height: 64, borderRadius: 20 }}><Icon.repeat s={30} /></div>
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label className="field-label">Auto-pay up to</label>
          <div className="input-box"><span className="input-prefix">₹</span><input inputMode="numeric" value={maxAmt} onChange={(e) => setMaxAmt(e.target.value.replace(/\D/g, '').slice(0, 6))} /></div>
          <span className="muted" style={{ fontSize: 12 }}>Bills above this amount will ask for your approval.</span>
        </div>
        <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>When to pay</label>
        <div className="seg" style={{ marginBottom: 18 }}>
          <button className={when === 'due' ? 'on' : ''} onClick={() => setWhen('due')}>On due date</button>
          <button className={when === 'gen' ? 'on' : ''} onClick={() => setWhen('gen')}>On bill generation</button>
        </div>
        <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>Pay from</label>
        <button className="source-row" style={{ width: '100%' }} onClick={() => setSrcSheet(true)}>
          <div className="bank-logo" style={{ width: 38, height: 38, fontSize: 13, background: src.color }}>{src.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
          <div style={{ flex: 1, textAlign: 'left' }}><div style={{ fontSize: 14, fontWeight: 700 }}>{src.name} {src.acc}</div><div className="source-bal num">Balance {inr(src.balance)}</div></div>
          <span className="chip chip-tonal" style={{ padding: '6px 12px' }}>Change</span>
        </button>
        <div className="sec-banner" style={{ marginTop: 16 }}>
          <span className="si"><Icon.shieldChk s={18} /></span>
          <span className="st">Secured by the <b>UPI AutoPay</b> mandate. You approve the limit once; cancel anytime. We notify you before every debit.</span>
        </div>
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" disabled={!maxAmt} onClick={() => { fx.tap(); setDone(true); }}>Enable AutoPay</button>
      </div>

      <Sheet open={srcSheet} onClose={() => setSrcSheet(false)} title="Pay from">
        <div className="stack" style={{ gap: 10 }}>
          {DATA.SELF_ACCOUNTS.map((a) => (
            <button key={a.id} className={`source-row ${src.id === a.id ? 'sel' : ''}`} onClick={() => { setSrc(a); setSrcSheet(false); fx.tap(); }}>
              <div className="bank-logo" style={{ width: 40, height: 40, fontSize: 14, background: a.color }}>{a.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
              <div style={{ flex: 1, textAlign: 'left' }}><div style={{ fontSize: 14.5, fontWeight: 700 }}>{a.name} {a.acc}</div><div className="source-bal num">Balance {inr(a.balance)}</div></div>
              {src.id === a.id && <span style={{ color: 'var(--mav-primary)' }}><Icon.checkCircle s={22} /></span>}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
};

/* ── Mobile recharge ───────────────────────────────────────────────────── */
const Recharge = ({ nav, params, app }) => {
  const [num, setNum] = useState('98201 11223');
  const [op] = useState({ name: 'Airtel', circle: 'Karnataka', tint: '#e40000' });
  const [sel, setSel] = useState(null);
  const valid = num.replace(/\D/g, '').length === 10;

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Mobile recharge" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 16px' }}>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="input-box" style={{ marginBottom: valid ? 12 : 0 }}>
            <span className="input-prefix">+91</span>
            <input inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value)} />
            <button className="iconbtn ghost" style={{ width: 30, height: 30 }}><Icon.contacts s={20} /></button>
          </div>
          {valid && (
            <div className="row" style={{ padding: '10px 0 0', background: 'none' }}>
              <div className="row-ic" style={{ background: '#fde8e8', color: op.tint }}><Icon.phone s={20} /></div>
              <div className="row-body"><div className="row-title">{op.name} · Prepaid</div><div className="row-sub">{op.circle}</div></div>
              <span className="badge badge-success"><Icon.check s={12} sw={3} /> Detected</span>
            </div>
          )}
        </div>

        <div className="section-hd"><span className="section-title">Popular plans</span><span className="section-link" onClick={() => app.toast({ title: 'All plans', tone: 'info' })}>Browse all</span></div>
        <div className="stack" style={{ gap: 10 }}>
          {DATA.RECHARGE_PLANS.map((pl) => (
            <button key={pl.id} className="card" style={{ textAlign: 'left', border: sel === pl.id ? '2px solid var(--mav-primary)' : '2px solid transparent', cursor: 'pointer', padding: 16 }} onClick={() => setSel(pl.id)}>
              <div className="spread">
                <div className="num" style={{ fontSize: 20, fontWeight: 800 }}>₹{pl.price}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {pl.tag && <span className="badge badge-primary">{pl.tag}</span>}
                  <div className={sel === pl.id ? '' : 'muted'} style={{ color: sel === pl.id ? 'var(--mav-primary)' : undefined }}>
                    {sel === pl.id ? <Icon.checkCircle s={22} /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--mav-border)' }} />}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                <Spec label="Data" val={pl.data} /><Spec label="Validity" val={pl.validity} />
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 8 }}>{pl.extra}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="action-dock on-ios">
        <button className="btn btn-primary" disabled={!sel || !valid} onClick={() => {
          const pl = DATA.RECHARGE_PLANS.find((x) => x.id === sel);
          nav.go('pay', { payee: { name: op.name + ' · ' + num, vpa: 'airtel@billdesk', merchant: true }, amount: pl.price, note: pl.validity + ' plan' });
        }}>{sel ? <>Recharge ₹{DATA.RECHARGE_PLANS.find((x) => x.id === sel).price}</> : 'Select a plan'}</button>
      </div>
    </div>
  );
};
const Spec = ({ label, val }) => (
  <div><div className="muted" style={{ fontSize: 11 }}>{label}</div><div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 1 }}>{val}</div></div>
);

window.BillScreens = { Bills, BillCategory, Biller, AutoPay, Recharge };
