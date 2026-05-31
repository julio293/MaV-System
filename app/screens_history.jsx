/* ══════════════════════════════════════════════════════════════════════════
   Transaction history & passbook
   History (Activity feed + Passbook ledger) · Search · Filters ·
   Transaction detail (refund / pending / failed timelines) ·
   Statements + PDF export · Raise dispute (support escalation)
   ══════════════════════════════════════════════════════════════════════════ */

/* status → colour + icon */
const STATUS = {
  Success:  { color: 'var(--mav-success)', I: Icon.checkCircle },
  Pending:  { color: 'var(--mav-warning)', I: Icon.clock },
  Failed:   { color: 'var(--mav-danger)',  I: Icon.alert },
  Refunded: { color: 'var(--mav-secondary)', I: Icon.refresh },
};
const catOf = (t) => DATA.CATEGORIES[t.tag] || DATA.CATEGORIES.transfers;

/* category-aware transaction row */
const CatRow = ({ t, onClick, divide }) => {
  const credit = t.amount > 0;
  const c = catOf(t);
  const st = STATUS[t.status] || STATUS.Success;
  const flagged = t.status === 'Pending' || t.status === 'Failed';
  return (
    <div className={`txn-item ${divide ? 'txn-divide' : ''}`} onClick={onClick}>
      <div className="cat-dot" style={{ background: `color-mix(in srgb,${c.color} 12%,#fff)`, color: c.color }}>
        {t.cat === 'credit' ? <Icon.receive s={21} /> : <IconBy name={c.icon} s={21} />}
      </div>
      <div className="txn-body">
        <div className="txn-name">{t.name}</div>
        <div className="txn-meta">{c.label} · {t.when.split(',')[1] ? t.when.split(',')[1].trim() : t.when}</div>
      </div>
      <div className="txn-right">
        <div className={`txn-amount ${credit ? 'credit' : 'debit'}`}>{credit ? '+' : '−'}{inr(Math.abs(t.amount))}</div>
        {flagged
          ? <span className="stpill" style={{ background: `color-mix(in srgb,${st.color} 14%,#fff)`, color: st.color, marginTop: 3 }}><st.I s={10} /> {t.status}</span>
          : t.status === 'Refunded'
          ? <span className="stpill" style={{ background: 'color-mix(in srgb,var(--mav-secondary) 12%,#fff)', color: 'var(--mav-secondary)', marginTop: 3 }}><Icon.refresh s={10} /> Refunded</span>
          : <div className="txn-status" style={{ color: 'var(--mav-muted)' }}>{t.when.split(',')[0]}</div>}
      </div>
    </div>
  );
};

/* ── History (Activity + Passbook) ─────────────────────────────────────── */
const History = ({ nav, app }) => {
  const [tab, setTab] = useState('activity'); // activity | passbook
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sheet, setSheet] = useState(false);
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const [period, setPeriod] = useState('This month');
  useEffect(() => { const id = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(id); }, []);

  const filters = [
    { id: 'all', label: 'All' }, { id: 'credit', label: 'Received' }, { id: 'sent', label: 'Sent' },
    { id: 'bill', label: 'Bills' }, { id: 'flagged', label: 'Needs attention' },
  ];
  const matchFilter = (t) => filter === 'all' ? true : filter === 'flagged' ? (t.status === 'Pending' || t.status === 'Failed' || t.status === 'Refunded') : t.cat === filter;
  const ql = q.trim().toLowerCase();
  let list = DATA.TXNS.filter(matchFilter);
  if (ql) list = list.filter((t) => t.name.toLowerCase().includes(ql) || (t.vpa || '').includes(ql) || catOf(t).label.toLowerCase().includes(ql) || String(Math.abs(t.amount)).includes(ql));

  // category spend breakdown (debits)
  const debits = DATA.TXNS.filter((t) => t.amount < 0 && t.status !== 'Failed');
  const byCat = {};
  debits.forEach((t) => { byCat[t.tag] = (byCat[t.tag] || 0) + Math.abs(t.amount); });
  const totalSpend = Object.values(byCat).reduce((a, b) => a + b, 0);
  const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  const groups = {};
  list.forEach((t) => { (groups[t.day] = groups[t.day] || []).push(t); });
  const order = ['Today', 'Yesterday', 'Earlier'];

  const recentSearches = ['Swiggy', 'Priya', 'Electricity', 'Salary'];

  return (
    <div className="screen bg-ios anim-fade">
      <div className="screen-scroll pad-top pad-nav">
        <AppBar title="History" tone="flush"
          right={<button className="iconbtn tinted" onClick={() => nav.go('statements')} aria-label="Statements"><Icon.doc s={20} /></button>} />

        {/* tabs */}
        <div className="htabs">
          <button className={tab === 'activity' ? 'on' : ''} onClick={() => setTab('activity')}><Icon.history s={16} /> Activity</button>
          <button className={tab === 'passbook' ? 'on' : ''} onClick={() => setTab('passbook')}><Icon.doc s={16} /> Passbook</button>
        </div>

        {/* search */}
        <div style={{ padding: '0 16px 10px' }}>
          <div className="input-box" style={{ padding: '11px 14px', background: '#fff' }}>
            <span className="muted"><Icon.search s={19} /></span>
            <input placeholder="Search by name, UPI ID or amount" value={q}
              onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
              onChange={(e) => setQ(e.target.value)} style={{ fontSize: 14.5, fontWeight: 500 }} />
            {q && <button className="iconbtn ghost" style={{ width: 24, height: 24 }} onClick={() => setQ('')}><Icon.close s={16} /></button>}
          </div>
        </div>

        {/* search recents (active search UX) */}
        {focused && !q && (
          <div style={{ padding: '0 16px 12px' }} className="anim-fade">
            <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 8 }}>Recent searches</div>
            <div className="chip-row">
              {recentSearches.map((s) => <button key={s} className="srch-chip" onMouseDown={() => setQ(s)}><Icon.history s={13} /> {s}</button>)}
            </div>
          </div>
        )}

        {tab === 'activity' ? (
          <React.Fragment>
            {/* filter chips */}
            {!focused && (
              <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }}>
                {filters.map((f) => (
                  <button key={f.id} className={`chip ${filter === f.id ? 'sel' : ''}`} style={{ flexShrink: 0 }} onClick={() => setFilter(f.id)}>{f.label}</button>
                ))}
                <button className="chip" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }} onClick={() => setSheet(true)}><Icon.filter s={14} /> More</button>
              </div>
            )}

            {/* month summary + category breakdown */}
            {!loading && !ql && filter === 'all' && (
              <div style={{ padding: '0 16px 12px' }}>
                <div className="card">
                  <div className="spread" style={{ marginBottom: 14 }}>
                    <span className="eyebrow">{period}</span>
                    <span className="section-link" onClick={() => setSheet(true)}>Change</span>
                  </div>
                  <div style={{ display: 'flex', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}><div className="muted" style={{ fontSize: 12 }}>Received</div><div className="num" style={{ fontWeight: 800, fontSize: 18, color: 'var(--mav-success)' }}>+₹94,500</div></div>
                    <div style={{ width: 1, background: 'var(--mav-border)', margin: '0 14px' }} />
                    <div style={{ flex: 1 }}><div className="muted" style={{ fontSize: 12 }}>Spent</div><div className="num" style={{ fontWeight: 800, fontSize: 18 }}>−₹11,615</div></div>
                  </div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Where it went</div>
                  {topCats.slice(0, 4).map(([tag, amt]) => {
                    const c = DATA.CATEGORIES[tag];
                    return (
                      <div className="cat-bar-row" key={tag}>
                        <span className="cat-dot" style={{ width: 32, height: 32, borderRadius: 10, background: `color-mix(in srgb,${c.color} 12%,#fff)`, color: c.color }}><IconBy name={c.icon} s={16} /></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="spread" style={{ marginBottom: 4 }}><span style={{ fontSize: 12.5, fontWeight: 600 }}>{c.label}</span><span className="num" style={{ fontSize: 12.5, fontWeight: 700 }}>{inr(amt)}</span></div>
                          <div className="cat-bar-track"><i style={{ width: Math.round((amt / totalSpend) * 100) + '%', background: c.color }} /></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* feed */}
            {loading ? (
              <div className="list-card" style={{ margin: '0 16px' }}>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</div>
            ) : list.length === 0 ? (
              <div className="empty">
                <div className="empty-ic"><span className="muted">{ql ? <Icon.search s={32} /> : <Icon.history s={32} />}</span></div>
                <div className="empty-title">{ql ? `No results for “${q}”` : 'Nothing here yet'}</div>
                <div className="empty-desc">{ql ? 'Try a name, UPI ID, or amount.' : `No ${filter !== 'all' ? filters.find((f) => f.id === filter).label.toLowerCase() : ''} transactions in this period.`}</div>
                {ql && <button className="btn btn-tonal btn-sm" style={{ marginTop: 14 }} onClick={() => setQ('')}>Clear search</button>}
              </div>
            ) : (
              order.filter((d) => groups[d]).map((day) => (
                <div key={day} style={{ marginBottom: 4 }}>
                  <div className="section-hd" style={{ paddingInline: 20, paddingBottom: 6 }}><span className="eyebrow">{day}</span></div>
                  <div className="list-card" style={{ margin: '0 16px' }}>
                    {groups[day].map((t, i) => <CatRow key={t.id} t={t} divide={i < groups[day].length - 1} onClick={() => nav.go('txn', { id: t.id })} />)}
                  </div>
                </div>
              ))
            )}
          </React.Fragment>
        ) : (
          /* ── PASSBOOK ── */
          <React.Fragment>
            <div style={{ padding: '0 16px 12px' }}>
              <div className="card" style={{ background: 'linear-gradient(135deg,var(--mav-primary),var(--mav-secondary))', color: '#fff' }}>
                <div style={{ fontSize: 12, opacity: .85, fontWeight: 600 }}>{DATA.USER.bank} · Passbook</div>
                <div className="num" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', marginTop: 4 }}>{inr(DATA.USER.balance)}</div>
                <div style={{ fontSize: 12, opacity: .85, marginTop: 2 }}>Available balance</div>
                <button className="btn" style={{ background: 'rgba(255,255,255,.16)', color: '#fff', marginTop: 14 }} onClick={() => nav.go('statements')}>
                  <Icon.download s={17} /> Download statement
                </button>
              </div>
            </div>
            {loading ? (
              <div className="list-card" style={{ margin: '0 16px' }}>{Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)}</div>
            ) : (
              order.filter((d) => groups[d]).map((day) => (
                <div key={day} style={{ marginBottom: 4 }}>
                  <div className="section-hd" style={{ paddingInline: 20, paddingBottom: 6 }}><span className="eyebrow">{day}</span></div>
                  <div className="list-card" style={{ margin: '0 16px' }}>
                    {groups[day].map((t) => {
                      const credit = t.amount > 0;
                      return (
                        <div className="ledger-row" key={t.id} onClick={() => nav.go('txn', { id: t.id })}>
                          <span className="cat-dot" style={{ width: 36, height: 36, borderRadius: 11, background: credit ? 'color-mix(in srgb,var(--mav-success) 12%,#fff)' : 'var(--mav-bg-secondary)', color: credit ? 'var(--mav-success)' : 'var(--mav-fg)' }}>
                            {credit ? <Icon.receive s={17} /> : <Icon.sendUp s={17} />}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.name}</div>
                            <div className="muted" style={{ fontSize: 11.5 }}>{t.when}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="ledger-amt" style={{ color: credit ? 'var(--mav-success)' : 'var(--mav-fg)' }}>{credit ? '+' : '−'}{inr(Math.abs(t.amount))}</div>
                            <div className="ledger-bal num">Bal {inr(t.bal)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </React.Fragment>
        )}
      </div>
      <BottomNav active="history" go={nav.go} />

      {/* filter & sort sheet */}
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Filter & sort">
        <div className="eyebrow" style={{ paddingBottom: 10 }}>Type</div>
        <div className="chip-row" style={{ marginBottom: 20 }}>
          {filters.map((f) => <button key={f.id} className={`chip ${filter === f.id ? 'sel' : ''}`} onClick={() => setFilter(f.id)}>{f.label}</button>)}
        </div>
        <div className="eyebrow" style={{ paddingBottom: 10 }}>Period</div>
        <div className="chip-row" style={{ marginBottom: 20 }}>
          {['This week', 'This month', 'Last 3 months', 'Custom'].map((p) => <button key={p} className={`chip ${period === p ? 'sel' : ''}`} onClick={() => setPeriod(p)}>{p}</button>)}
        </div>
        <div className="eyebrow" style={{ paddingBottom: 10 }}>Sort by</div>
        <div className="chip-row" style={{ marginBottom: 24 }}>
          {['Newest first', 'Highest amount', 'Lowest amount'].map((p, i) => <button key={p} className={`chip ${i === 0 ? 'sel' : ''}`}>{p}</button>)}
        </div>
        <button className="btn btn-primary" onClick={() => setSheet(false)}>Show results</button>
      </Sheet>
    </div>
  );
};

/* ── Transaction detail ────────────────────────────────────────────────── */
const TxnDetail = ({ nav, params, app }) => {
  const t = DATA.TXNS.find((x) => x.id === params.id) || DATA.TXNS[0];
  const credit = t.amount > 0;
  const c = catOf(t);
  const st = STATUS[t.status] || STATUS.Success;
  const refId = 'T2506' + t.id.toUpperCase() + 'XK';

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Transaction details" onBack={nav.back}
        right={<button className="iconbtn tinted" onClick={() => app.toast({ tone: 'success', title: 'Receipt shared' })}><Icon.share s={20} /></button>} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        <div className="card center-col" style={{ gap: 6, padding: '24px 20px' }}>
          <div className="cat-dot" style={{ width: 60, height: 60, borderRadius: 18, background: `color-mix(in srgb,${c.color} 12%,#fff)`, color: c.color }}>
            {t.cat === 'credit' ? <Icon.receive s={26} /> : t.cat === 'bill' ? <Icon.bills s={26} /> : <IconBy name={c.icon} s={26} />}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>{t.name}</div>
          <div className="muted" style={{ fontSize: 13 }}>{t.type}</div>
          <div className="num" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.02em', marginTop: 8, color: credit ? 'var(--mav-success)' : 'var(--mav-fg)' }}>
            {credit ? '+' : '−'}{inr(Math.abs(t.amount))}
          </div>
          <div className="stpill" style={{ background: `color-mix(in srgb,${st.color} 12%,#fff)`, color: st.color, marginTop: 6, padding: '4px 12px', fontSize: 12 }}>
            <st.I s={13} /> {t.status}
          </div>
        </div>

        {/* status timelines */}
        {t.status === 'Pending' && (
          <div className="card-flat" style={{ marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Status</div>
            <div className="tl">
              <div className="tl-step"><span className="tl-dot done"><Icon.check s={13} sw={3} /></span><div className="tl-body"><div className="tl-title">Payment initiated</div><div className="tl-time">{t.when} · {inr(Math.abs(t.amount))} debited</div></div></div>
              <div className="tl-step"><span className="tl-dot cur"><Icon.clock s={13} /></span><div className="tl-body"><div className="tl-title">Awaiting beneficiary bank</div><div className="tl-time">Usually clears in a few minutes</div></div></div>
              <div className="tl-step"><span className="tl-dot wait" /><div className="tl-body"><div className="tl-title" style={{ color: 'var(--mav-muted)' }}>Credited to {t.name.split(' ')[0]}</div></div></div>
            </div>
          </div>
        )}
        {t.status === 'Refunded' && (
          <div className="card-flat" style={{ marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Refund tracking</div>
            <div className="tl">
              <div className="tl-step"><span className="tl-dot done"><Icon.check s={13} sw={3} /></span><div className="tl-body"><div className="tl-title">Payment made</div><div className="tl-time">{inr(Math.abs(t.amount))} · {t.note || 'Order'}</div></div></div>
              <div className="tl-step"><span className="tl-dot done"><Icon.check s={13} sw={3} /></span><div className="tl-body"><div className="tl-title">Refund initiated by merchant</div><div className="tl-time">{t.when}</div></div></div>
              <div className="tl-step"><span className="tl-dot done" style={{ background: 'var(--mav-success)' }}><Icon.check s={13} sw={3} /></span><div className="tl-body"><div className="tl-title">Credited to {DATA.USER.bank}</div><div className="tl-time">{inr(Math.abs(t.amount))} back in your account</div></div></div>
            </div>
          </div>
        )}
        {t.status === 'Failed' && (
          <React.Fragment>
            <div className="alert alert-danger" style={{ marginTop: 12 }}><Icon.info s={18} /><span>{t.note || 'The transaction could not be completed.'} No money was deducted from your account.</span></div>
          </React.Fragment>
        )}

        {/* details */}
        <div className="card-flat" style={{ marginTop: 12 }}>
          <Detail label="Category" value={<span className="stpill" style={{ background: `color-mix(in srgb,${c.color} 12%,#fff)`, color: c.color }}><IconBy name={c.icon} s={11} /> {c.label}</span>} />
          <Detail label="Transaction ID" value={refId} mono />
          <Detail label="UPI reference" value={refId.slice(-12)} mono />
          <Detail label="Date & time" value={t.when} />
          {t.vpa && <Detail label={credit ? 'Received from' : 'Paid to'} value={t.vpa} mono />}
          <Detail label="Paid via" value={DATA.USER.bank} last={!t.note} />
          {t.note && <Detail label="Note" value={t.note} last />}
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button className="btn btn-secondary" onClick={() => app.toast({ tone: 'success', title: 'Receipt downloaded', desc: 'Saved as PDF' })}><Icon.download s={18} /> Receipt</button>
          {!credit && t.cat !== 'bill' && <button className="btn btn-primary" onClick={() => nav.go('amount', { payee: { name: t.name, vpa: t.vpa, known: true } })}><Icon.send s={18} /> Pay again</button>}
          {t.cat === 'bill' && <button className="btn btn-primary" onClick={() => nav.go('bills')}><Icon.refresh s={18} /> Pay again</button>}
          {credit && <button className="btn btn-primary" onClick={() => nav.go('amount', { payee: { name: t.name, vpa: t.vpa, known: true } })}><Icon.send s={18} /> Send money</button>}
        </div>

        {/* dispute / help */}
        <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => nav.go('dispute', { id: t.id })}>
          <Icon.shield s={18} /> Report an issue with this payment
        </button>
      </div>
    </div>
  );
};

const Detail = ({ label, value, mono, last }) => (
  <React.Fragment>
    <div className="spread" style={{ padding: '4px 0' }}>
      <span className="muted" style={{ fontSize: 13.5 }}>{label}</span>
      <span className={mono ? 'num' : ''} style={{ fontSize: 13.5, fontWeight: 600, maxWidth: '62%', textAlign: 'right' }}>{value}</span>
    </div>
    {!last && <div className="divider" style={{ margin: '8px -16px' }} />}
  </React.Fragment>
);

/* ── Statements + PDF export ───────────────────────────────────────────── */
const Statements = ({ nav, app }) => {
  const [sel, setSel] = useState(null); // statement for export sheet
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Statements" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        <div className="sec-banner" style={{ marginBottom: 14 }}>
          <span className="si"><Icon.shieldChk s={18} /></span>
          <span className="st">Official account statements for {DATA.USER.bank}. Accepted for visa, loan &amp; tax filings.</span>
        </div>
        <div className="list-card">
          {DATA.STATEMENTS.map((s) => (
            <div className="stmt-row" key={s.id} onClick={() => setSel(s)}>
              <div className="stmt-ic"><Icon.pdf s={22} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{s.month}{s.current && <span className="badge badge-primary" style={{ marginLeft: 8 }}>Current</span>}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 1 }}>{s.range} · {s.count} transactions</div>
              </div>
              <span className="row-chev"><Icon.download s={18} /></span>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 14 }} onClick={() => app.toast({ tone: 'info', title: 'Custom range', desc: 'Pick start & end dates' })}>
          <Icon.filter s={18} /> Custom date range
        </button>
      </div>

      {/* export sheet */}
      <Sheet open={!!sel} onClose={() => setSel(null)} title={sel ? sel.month : ''}>
        {sel && (
          <React.Fragment>
            <div className="card-flat" style={{ marginBottom: 16 }}>
              <div className="spread" style={{ marginBottom: 8 }}><span className="muted" style={{ fontSize: 13 }}>Money in</span><span className="num" style={{ fontWeight: 700, color: 'var(--mav-success)' }}>+{inr(sel.credit)}</span></div>
              <div className="spread"><span className="muted" style={{ fontSize: 13 }}>Money out</span><span className="num" style={{ fontWeight: 700 }}>−{inr(sel.debit)}</span></div>
            </div>
            <div className="eyebrow" style={{ paddingBottom: 10 }}>Download as</div>
            <div className="stack" style={{ gap: 9, marginBottom: 8 }}>
              <button className="btn btn-primary" onClick={() => { setSel(null); app.toast({ tone: 'success', title: 'Statement downloaded', desc: sel.month + ' · PDF' }); }}><Icon.pdf s={18} /> PDF document</button>
              <button className="btn btn-secondary" onClick={() => { setSel(null); app.toast({ tone: 'success', title: 'Exported', desc: sel.month + ' · Excel (CSV)' }); }}><Icon.doc s={18} /> Excel (CSV)</button>
              <button className="btn btn-ghost" onClick={() => { setSel(null); app.toast({ tone: 'info', title: 'Sent to your email', desc: 'aarav@email.com' }); }}><Icon.mail s={18} /> Email to me</button>
            </div>
          </React.Fragment>
        )}
      </Sheet>
    </div>
  );
};

/* ── Raise dispute (support escalation) ────────────────────────────────── */
const Dispute = ({ nav, params, app }) => {
  const t = DATA.TXNS.find((x) => x.id === params.id) || DATA.TXNS[0];
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const ticket = 'FYD' + Math.floor(100000 + Math.random() * 899999);

  if (done) {
    return (
      <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="Dispute raised" onBack={() => nav.reset('home')} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
          <svg className="check-ring" viewBox="0 0 100 100" fill="none" style={{ width: 84, height: 84 }}>
            <circle cx="50" cy="50" r="44" stroke="var(--mav-success)" strokeWidth="5" />
            <path d="M30 51l13 13 27-29" stroke="var(--mav-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 16 }}>We’re on it</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>
            Your dispute for <b style={{ color: 'var(--mav-fg)' }}>{inr(Math.abs(t.amount))}</b> to {t.name} has been raised. Our team will update you within <b style={{ color: 'var(--mav-fg)' }}>5 working days</b>.
          </p>
          <div className="card-flat" style={{ width: '100%', marginTop: 18, textAlign: 'left' }}>
            <div className="spread"><span className="muted" style={{ fontSize: 13 }}>Ticket no.</span><span className="num" style={{ fontWeight: 700 }}>{ticket}</span></div>
          </div>
          <div className="tl" style={{ width: '100%', marginTop: 18, textAlign: 'left' }}>
            <div className="tl-step"><span className="tl-dot done"><Icon.check s={13} sw={3} /></span><div className="tl-body"><div className="tl-title">Dispute received</div><div className="tl-time">Just now</div></div></div>
            <div className="tl-step"><span className="tl-dot cur"><Icon.headset s={13} /></span><div className="tl-body"><div className="tl-title">Under review by our team</div><div className="tl-time">We may contact your bank</div></div></div>
            <div className="tl-step"><span className="tl-dot wait" /><div className="tl-body"><div className="tl-title" style={{ color: 'var(--mav-muted)' }}>Resolution</div><div className="tl-time">Within 5 working days</div></div></div>
          </div>
        </div>
        <div style={{ padding: '0 20px' }}><button className="btn btn-primary" onClick={() => nav.reset('home')}>Done</button></div>
      </div>
    );
  }

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Report an issue" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 120px' }}>
        {/* txn summary */}
        <div className="row" style={{ background: '#fff', borderRadius: 16, marginBottom: 16 }}>
          <Avatar name={t.name} size={42} />
          <div className="row-body"><div className="row-title">{t.name}</div><div className="row-sub num">{t.when}</div></div>
          <div className="num" style={{ fontWeight: 800 }}>−{inr(Math.abs(t.amount))}</div>
        </div>

        <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 10 }}>What went wrong?</div>
        <div className="stack" style={{ gap: 9 }}>
          {DATA.DISPUTE_REASONS.map((r) => (
            <button key={r.id} className={`reason-row ${reason === r.id ? 'sel' : ''}`} onClick={() => setReason(r.id)}>
              <span className="reason-ic"><IconBy name={r.icon} s={19} /></span>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>{r.label}</span>
              <span className="sim-radio" style={reason === r.id ? { borderColor: 'var(--mav-primary)' } : null}>{reason === r.id && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--mav-primary)' }} />}</span>
            </button>
          ))}
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label className="field-label">Add details (optional)</label>
          <div className="input-box" style={{ alignItems: 'flex-start' }}>
            <textarea rows={3} placeholder="Tell us what happened…" value={note} onChange={(e) => setNote(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'none', resize: 'none', width: '100%', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: 'var(--mav-fg)' }} />
          </div>
        </div>

        <div className="sec-banner" style={{ marginTop: 14 }}>
          <span className="si"><Icon.shieldChk s={18} /></span>
          <span className="st">Disputes are covered by <b>UPI’s grievance redressal</b>. False claims may affect your account.</span>
        </div>
      </div>
      <div className="action-dock on-ios">
        <button className="btn btn-primary" disabled={!reason} onClick={() => { fx.tap(); setDone(true); }}>Submit dispute</button>
      </div>
    </div>
  );
};

window.HistoryScreens = { History, TxnDetail, Statements, Dispute, CatRow };
