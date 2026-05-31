/* ══════════════════════════════════════════════════════════════════════════
   Send money — hub, methods, contact picker, payee verification.
   Methods: Mobile · UPI ID · Bank transfer · QR · Self transfer
   Routes out to → amount → pay → receipt
   ══════════════════════════════════════════════════════════════════════════ */

/* resolve a typed handle to a payee (simulated VPA lookup) */
function resolvePayee(raw) {
  const v = raw.trim();
  const isVpa = /@/.test(v);
  const known = DATA.KNOWN_MERCHANTS[v.toLowerCase()];
  // not-found triggers for the incorrect-UPI demo
  if (isVpa && /nobank|invalid|xxx/i.test(v)) return { notFound: true };
  if (known) return { name: known.name, vpa: v, verified: true, merchant: true };
  const existing = DATA.PAYEES.find((p) => p.vpa === v.toLowerCase() || p.phone.replace(/\s/g, '') === v.replace(/\s/g, ''));
  if (existing) return { ...existing, known: true };
  // synthesise a "name as per bank" for a new handle
  const handle = isVpa ? v.split('@')[0] : 'user' + v.slice(-4);
  const name = handle.replace(/[._]/g, ' ').replace(/\d+/g, '').trim().split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'New payee';
  return { name: name || 'New payee', vpa: isVpa ? v : v.replace(/\s/g, '') + '@fyscal', phone: isVpa ? '' : v, isNew: true };
}

/* ── Send hub ──────────────────────────────────────────────────────────── */
const Send = ({ nav, app }) => {
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const filtered = DATA.PAYEES.filter((p) =>
    p.name.toLowerCase().includes(ql) || p.vpa.includes(ql) || p.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')));
  const looksLikeVpa = /@/.test(q);
  const looksLikePhone = /^\d[\d\s]{5,}$/.test(q.trim());
  const recents = DATA.PAYEES.filter((p) => p.recent);

  const methods = [
    { id: 'mobile', icon: Icon.phone, label: 'To Mobile', go: () => { setQ(''); document.getElementById('send-q')?.focus(); app.toast({ tone: 'info', title: 'Enter a mobile number' }); } },
    { id: 'upi', icon: Icon.qr, label: 'To UPI ID', go: () => { document.getElementById('send-q')?.focus(); app.toast({ tone: 'info', title: 'Enter a UPI ID', desc: 'like name@bank' }); } },
    { id: 'bank', icon: Icon.bank, label: 'To Bank A/C', go: () => nav.go('bankxfer') },
    { id: 'qr', icon: Icon.scan, label: 'Scan QR', go: () => nav.go('scan') },
    { id: 'self', icon: Icon.refresh, label: 'Self transfer', go: () => nav.go('self') },
  ];

  const startTyped = () => nav.go('verifypayee', { raw: q.trim() });

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Send money" onBack={nav.back}
        right={<button className="iconbtn tinted" onClick={() => nav.go('scan')} aria-label="Scan"><Icon.scan s={20} /></button>} />

      {/* transfer methods */}
      <div className="method-row">
        {methods.map((m) => (
          <button className="method-tile" key={m.id} onClick={() => { fx.tap(); m.go(); }}>
            <span className="mt-ic"><m.icon s={22} /></span>
            <span className="mt-label">{m.label}</span>
          </button>
        ))}
      </div>

      {/* search */}
      <div style={{ padding: '10px 16px 8px' }}>
        <div className="input-box" style={{ padding: '12px 14px' }}>
          <span className="muted"><Icon.search s={20} /></span>
          <input id="send-q" autoFocus placeholder="Name, mobile number or UPI ID" value={q}
            onChange={(e) => setQ(e.target.value)} style={{ fontSize: 15, fontWeight: 500 }} />
          {q && <button className="iconbtn ghost" style={{ width: 24, height: 24 }} onClick={() => setQ('')}><Icon.close s={16} /></button>}
        </div>
      </div>

      <div className="screen-scroll" style={{ paddingBottom: 24 }}>
        {/* pay-to-typed banner */}
        {(looksLikeVpa || looksLikePhone) && (
          <div style={{ padding: '0 16px 8px' }}>
            <div className="row" style={{ borderRadius: 16, border: '1px solid var(--mav-border)', background: '#fff' }} onClick={startTyped}>
              <div className="row-ic" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.send s={20} /></div>
              <div className="row-body"><div className="row-title">Pay {q}</div><div className="row-sub">{looksLikeVpa ? 'UPI ID' : 'Mobile number'} · Verify &amp; pay</div></div>
              <span className="row-chev"><Icon.chev s={18} /></span>
            </div>
          </div>
        )}

        {/* fast-pay recents (ultra-fast repeat) */}
        {q === '' && (
          <React.Fragment>
            <div className="section-hd" style={{ paddingInline: 20, paddingBottom: 4 }}><span className="eyebrow">Pay again</span></div>
            <div className="fastpay">
              {recents.map((p) => (
                <button key={p.id} className="fastpay-item" onClick={() => { fx.tap(); nav.go('amount', { payee: { ...p, known: true } }); }}>
                  <span className="fp-av"><Avatar name={p.name} size={56} /><span className="fp-fast"><Icon.bolt s={10} /></span></span>
                  <span className="fp-name">{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        )}

        {/* contacts list (picker) */}
        {filtered.length === 0 && !looksLikeVpa && !looksLikePhone ? (
          <div className="empty">
            <div className="empty-ic"><span className="muted"><Icon.contacts s={32} /></span></div>
            <div className="empty-title">No matches for “{q}”</div>
            <div className="empty-desc">Try another name, or paste a UPI ID like <b>name@bank</b> to pay someone new.</div>
          </div>
        ) : (
          <React.Fragment>
            <div className="section-hd" style={{ paddingInline: 20, paddingBottom: 6 }}>
              <span className="eyebrow">{q ? 'Results' : 'Contacts on Fyscal'}</span>
              {q === '' && <span className="trust" style={{ color: 'var(--mav-success)' }}><Icon.shieldChk s={13} /> Verified</span>}
            </div>
            <div className="list-card" style={{ margin: '0 16px', borderRadius: 18 }}>
              {filtered.map((p) => (
                <div key={p.id} className="row" onClick={() => { fx.tap(); nav.go('amount', { payee: { ...p, known: true } }); }}>
                  <Avatar name={p.name} size={44} />
                  <div className="row-body"><div className="row-title">{p.name}</div><div className="row-sub">{p.vpa}</div></div>
                  <span className="row-chev"><Icon.chev s={18} /></span>
                </div>
              ))}
            </div>
            <div className="secure-strip" style={{ marginTop: 16 }}><Icon.lock s={13} /> Payments are encrypted &amp; UPI-PIN protected</div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

/* ── Verify payee (resolve VPA/number, fraud cues, incorrect-UPI) ──────── */
const VerifyPayee = ({ nav, params, app }) => {
  const [state, setState] = useState('checking'); // checking | found | notfound
  const [payee, setPayee] = useState(null);
  useEffect(() => {
    const id = setTimeout(() => {
      const r = resolvePayee(params.raw);
      if (r.notFound) { setState('notfound'); fx.fail(); }
      else { setPayee(r); setState('found'); fx.tap(); }
    }, 1300);
    return () => clearTimeout(id);
  }, []);

  if (state === 'checking') {
    return (
      <div className="screen bg-white pad-top anim-in">
        <AppBar onBack={nav.back} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', gap: 18, padding: '0 32px', textAlign: 'center' }}>
          <div className="spinner lg" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Checking this UPI ID…</div>
            <div className="muted num" style={{ fontSize: 14, marginTop: 6 }}>{params.raw}</div>
          </div>
          <div className="secure-strip"><Icon.shieldChk s={14} /> Confirming the name registered with the bank</div>
        </div>
      </div>
    );
  }

  if (state === 'notfound') {
    return (
      <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar onBack={nav.back} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div className="err-ic" style={{ background: 'color-mix(in srgb,var(--mav-danger) 9%,#fff)', color: 'var(--mav-danger)' }}><Icon.alert s={40} /></div>
          <h1 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12 }}>This UPI ID doesn’t exist</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>
            We couldn’t find <b className="num" style={{ color: 'var(--mav-fg)' }}>{params.raw}</b>. Check for typos — UPI IDs look like <b>name@bank</b>.
          </p>
          <div className="stack" style={{ gap: 9, marginTop: 26, width: '100%' }}>
            <button className="btn btn-primary" onClick={() => nav.back()}>Edit and retry</button>
            <button className="btn btn-ghost" onClick={() => nav.reset('home')}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // found → show resolved identity, then continue
  return (
    <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar title="Confirm payee" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px' }}>
        <div className="verify-card">
          <Avatar name={payee.name} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="verify-name">{payee.name}</div>
            <div className="verify-sub num">{payee.vpa}</div>
          </div>
          {payee.verified ? <span className="vbadge ok"><Icon.shieldChk s={12} /> Verified</span>
            : payee.isNew ? <span className="vbadge new"><Icon.alert s={12} /> New</span>
            : <span className="vbadge ok"><Icon.check s={12} sw={3} /> Known</span>}
        </div>
        <div className="card-flat" style={{ marginTop: 12 }}>
          <div className="r-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span className="r-label">Name as per bank</span><span className="r-value">{payee.name}</span>
          </div>
          <div className="r-row"><span className="r-label">UPI ID</span><span className="r-value num">{payee.vpa}</span></div>
        </div>
        {payee.isNew && (
          <div className="fraud-banner" style={{ marginTop: 12 }}>
            <span className="fi"><Icon.shield s={18} /></span>
            <span className="ft"><b>First time paying this person.</b> Confirm the name above matches who you intend to pay. Never pay strangers who pressure you.</span>
          </div>
        )}
        {payee.verified && (
          <div className="sec-banner" style={{ marginTop: 12 }}>
            <span className="si"><Icon.shieldChk s={18} /></span>
            <span className="st">This is a <b>Fyscal-verified merchant</b>. Safe to pay.</span>
          </div>
        )}
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" onClick={() => nav.replace('amount', { payee })}>This is correct — continue</button>
      </div>
    </div>
  );
};

/* ── Bank transfer (account + IFSC) ────────────────────────────────────── */
const BankTransfer = ({ nav, app }) => {
  const [f, setF] = useState({ acc: '', acc2: '', ifsc: '', name: '' });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const accMatch = f.acc && f.acc === f.acc2;
  const ifscOk = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(f.ifsc.toUpperCase());
  const valid = accMatch && ifscOk && f.name.trim().length > 2;
  return (
    <div className="screen bg-white pad-top anim-in">
      <AppBar title="To bank account" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '6px 20px 120px' }}>
        <div className="sec-banner" style={{ marginBottom: 18 }}>
          <span className="si"><Icon.shieldChk s={18} /></span>
          <span className="st">For accounts that aren’t on UPI. Transfers via <b>IMPS</b> are usually instant.</span>
        </div>
        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">Account number</label>
          <div className="input-box"><Icon.bank s={20} sw={1.8} /><input inputMode="numeric" placeholder="Enter account number" value={f.acc} onChange={set('acc')} /></div>
        </div>
        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">Confirm account number</label>
          <div className="input-box" style={f.acc2 && !accMatch ? { borderColor: 'var(--mav-danger)' } : null}>
            <Icon.bank s={20} sw={1.8} /><input inputMode="numeric" placeholder="Re-enter account number" value={f.acc2} onChange={set('acc2')} style={{ WebkitTextSecurity: 'disc' }} />
            {accMatch && <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={20} /></span>}
          </div>
          {f.acc2 && !accMatch && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--mav-danger)' }}>Account numbers don’t match</span>}
        </div>
        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">IFSC code</label>
          <div className="input-box" style={f.ifsc && !ifscOk ? { borderColor: 'var(--mav-danger)' } : null}>
            <Icon.building s={20} sw={1.8} /><input placeholder="e.g. HDFC0000123" value={f.ifsc} onChange={(e) => setF((s) => ({ ...s, ifsc: e.target.value.toUpperCase().slice(0, 11) }))} style={{ textTransform: 'uppercase', letterSpacing: '.04em' }} />
            {ifscOk && <span style={{ color: 'var(--mav-success)' }}><Icon.checkCircle s={20} /></span>}
          </div>
        </div>
        <div className="field">
          <label className="field-label">Beneficiary name</label>
          <div className="input-box"><Icon.user s={20} sw={1.8} /><input placeholder="As per their bank" value={f.name} onChange={set('name')} /></div>
        </div>
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" disabled={!valid}
          onClick={() => nav.go('amount', { payee: { name: f.name.trim(), vpa: f.ifsc.toUpperCase() + ' · ' + f.acc.slice(-4), bank: true, isNew: true } })}>
          Continue
        </button>
      </div>
    </div>
  );
};

/* ── Self transfer (between own accounts) ──────────────────────────────── */
const SelfTransfer = ({ nav, app }) => {
  const A = DATA.SELF_ACCOUNTS;
  const [from, setFrom] = useState(A[0].id);
  const [to, setTo] = useState(A[1] ? A[1].id : A[0].id);
  const fromA = A.find((x) => x.id === from), toA = A.find((x) => x.id === to);
  const swap = () => { setFrom(to); setTo(from); fx.tap(); };

  const AcctCard = ({ a, role }) => (
    <div className="source-row" style={{ borderColor: 'var(--mav-border)' }}>
      <div className="bank-logo" style={{ width: 40, height: 40, fontSize: 14, background: a.color }}>{a.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mav-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{role}</div>
        <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 2 }}>{a.name} {a.acc}</div>
        <div className="source-bal num">Balance {inr(a.balance)}</div>
      </div>
    </div>
  );

  return (
    <div className="screen bg-white pad-top anim-in">
      <AppBar title="Self transfer" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 20px 24px' }}>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 18 }}>Move money between your own linked accounts, instantly and free.</p>
        <div style={{ position: 'relative' }}>
          <AcctCard a={fromA} role="From" />
          <div style={{ height: 12 }} />
          <AcctCard a={toA} role="To" />
          <button onClick={swap} aria-label="Swap"
            style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'var(--mav-primary)', color: '#fff', border: '3px solid #fff', display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: '0 4px 12px -4px var(--mav-primary)' }}>
            <Icon.refresh s={18} />
          </button>
        </div>
        {from === to && <div className="alert alert-warning" style={{ marginTop: 14 }}><Icon.info s={18} /><span>Pick two different accounts to transfer between.</span></div>}
      </div>
      <div className="action-dock">
        <button className="btn btn-primary" disabled={from === to}
          onClick={() => nav.go('amount', { payee: { name: toA.name + ' ' + toA.acc, vpa: toA.vpa, self: true, fromLabel: fromA.name + ' ' + fromA.acc } })}>
          Enter amount
        </button>
      </div>
    </div>
  );
};

window.SendScreens = { Send, VerifyPayee, BankTransfer, SelfTransfer, resolvePayee };
