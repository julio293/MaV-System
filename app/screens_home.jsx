/* ══════════════════════════════════════════════════════════════════════════
   Home dashboard — modular, personalized, adaptive.
   States: default · new (empty) · power (heavy) · loggedout
   Modules: balance carousel · smart suggestions · transfers · bills ·
            finance products · rewards · offers · recent activity · insights
   Plus the Notification Center screen.
   ══════════════════════════════════════════════════════════════════════════ */

const tintFg = (tint) =>
  tint === 'tint-success' ? 'var(--mav-success)' :
  tint === 'tint-warning' ? '#b35e00' :
  tint === 'tint-neutral' ? 'var(--mav-fg)' : 'var(--mav-primary)';

/* ── Transaction row (shared) ──────────────────────────────────────────── */
const TxnRow = ({ t, onClick, divide = true }) => {
  const credit = t.amount > 0;
  const av = t.cat === 'credit' ? 'av-credit' : t.cat === 'bill' ? 'av-bill' : 'av-debit';
  const statusColor = t.status === 'Success' ? 'var(--mav-muted)' : t.status === 'Pending' ? 'var(--mav-warning)' : 'var(--mav-danger)';
  return (
    <div className={`txn-item ${divide ? 'txn-divide' : ''}`} onClick={onClick}>
      <div className={`txn-icon ${av}`}>
        {t.cat === 'bill' ? <Icon.bills s={20} /> : credit ? <Icon.receive s={20} /> : <Avatar name={t.name} size={44} />}
      </div>
      <div className="txn-body">
        <div className="txn-name">{t.name}</div>
        <div className="txn-meta">{t.type} · {t.when.split(',')[0]}</div>
      </div>
      <div className="txn-right">
        <div className={`txn-amount ${credit ? 'credit' : 'debit'}`}>{credit ? '+' : '−'}{inr(Math.abs(t.amount))}</div>
        <div className="txn-status" style={{ color: statusColor }}>{t.status}</div>
      </div>
    </div>
  );
};

/* ── Balance carousel (swipeable bank cards) ───────────────────────────── */
const BalanceCarousel = ({ banks, hidden, setHidden, nav, app }) => {
  const [idx, setIdx] = useState(0);
  const onScroll = (e) => { const w = e.target.clientWidth - 32; setIdx(Math.round(e.target.scrollLeft / w)); };
  return (
    <div>
      <div onScroll={onScroll} style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '0 16px', scrollbarWidth: 'none' }}>
        {banks.map((b) => {
          const { whole, dec } = inrParts(b.balance);
          return (
            <div key={b.id} className="balance-card" style={{ flex: '0 0 calc(100% - 32px)', scrollSnapAlign: 'center' }}>
              <div className="bal-row">
                <div>
                  <div className="bal-label">{b.name} · {b.acc}{b.primary ? ' · Primary' : ''}</div>
                  <div className="bal-amount">{hidden ? '₹ ••••••' : <>₹{whole}<span className="dec">.{dec}</span></>}</div>
                  <button className="vpa-chip" style={{ marginTop: 8 }} onClick={() => app.toast({ tone: 'info', title: 'UPI ID copied', desc: DATA.USER.vpa })}>
                    <Icon.qr s={13} /> {DATA.USER.vpa} <Icon.copy s={12} />
                  </button>
                </div>
                <button type="button" className="iconbtn" style={{ color: '#fff', position: 'relative', zIndex: 3 }} onClick={(e) => { e.stopPropagation(); fx.tap(); setHidden((h) => !h); }} aria-label="Toggle balance">
                  {hidden ? <Icon.eyeOff s={20} /> : <Icon.eye s={20} />}
                </button>
              </div>
              <div className="bal-actions">
                <button className="bal-btn" onClick={() => nav.go('addmoney')}><Icon.add s={18} sw={2.2} />Add</button>
                <button className="bal-btn" onClick={() => nav.go('send')}><Icon.sendUp s={18} />Send</button>
                <button className="bal-btn" onClick={() => nav.go('receive')}><Icon.qr s={18} />Receive</button>
                <button className="bal-btn" onClick={() => app.toast({ tone: 'info', title: 'Check balance', desc: 'Enter UPI PIN to refresh' })}><Icon.refresh s={18} />Balance</button>
              </div>
            </div>
          );
        })}
      </div>
      {banks.length > 1 && <div className="bdots">{banks.map((_, i) => <i key={i} className={i === idx ? 'on' : ''} />)}</div>}
    </div>
  );
};

/* ── Quick-action tile ─────────────────────────────────────────────────── */
const QA = ({ icon: I, label, tint, onClick }) => (
  <button className="qa-btn" onClick={onClick}>
    <div className={`qa-icon ${tint}`}><span style={{ color: tintFg(tint) }}><I s={24} /></span></div>
    <span className="qa-label">{label}</span>
  </button>
);

/* ── Section header ────────────────────────────────────────────────────── */
const SecHd = ({ title, link, onLink, pad = 16 }) => (
  <div className="section-hd" style={{ paddingInline: pad }}>
    <span className="section-title">{title}</span>
    {link && <span className="section-link" onClick={onLink}>{link}</span>}
  </div>
);

/* ── Home ──────────────────────────────────────────────────────────────── */
const Home = ({ nav, app }) => {
  const [hidden, setHidden] = useState(false);
  const [state, setState] = useState('default');   // default | new | power | loggedout
  const u = DATA.USER;
  const recent = DATA.PAYEES.filter((p) => p.recent);
  const isNew = state === 'new';
  const isPower = state === 'power';
  const lockedOut = state === 'loggedout';
  const banks = isPower ? DATA.BANKS : [DATA.BANKS[0]];
  const txns = isPower ? DATA.TXNS : DATA.TXNS.slice(0, 4);
  const unread = DATA.NOTIFS.filter((n) => n.unread).length;

  let mi = 0;                                   // module index → stagger delay
  const mod = () => ({ animationDelay: (mi++ * 55) + 'ms' });

  return (
    <div className="screen bg-ios anim-fade">
      <div className={`screen-scroll pad-top pad-nav ${lockedOut ? 'locked-blur' : ''}`}>

        {/* greeting */}
        <div className="appbar" style={{ paddingTop: 4 }}>
          <div style={{ flex: 1 }}>
            <div className="ab-sub">{isNew ? 'Welcome to Fyscal' : 'Good morning'}</div>
            <div className="ab-title" style={{ fontSize: 19 }}>{u.name} 👋</div>
          </div>
          <button className="iconbtn tinted bell-wrap" onClick={() => nav.go('notif')} aria-label="Notifications">
            <Icon.bell s={20} />{unread > 0 && !isNew && <span className="bell-dot" />}
          </button>
          <button className="iconbtn" onClick={() => nav.go('profile')}><Avatar name={u.name} size={38} /></button>
        </div>

        {/* ── Balance / link-bank ── */}
        {isNew ? (
          <div className="mod" style={{ ...mod(), padding: '4px 16px 0' }}>
            <div className="link-card">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="vpa-chip" style={{ display: 'inline-flex' }}><Icon.qr s={13} /> {u.vpa}</div>
                <h2 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', marginTop: 14 }}>Link a bank to start paying</h2>
                <p style={{ fontSize: 13.5, opacity: .88, marginTop: 6, lineHeight: 1.5 }}>It takes under a minute and is secured by your UPI PIN.</p>
                <button className="btn btn-secondary" style={{ background: '#fff', boxShadow: 'none', marginTop: 16 }} onClick={() => nav.go('linkbank')}>
                  <Icon.bank s={18} /> Add bank account
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mod" style={{ ...mod(), paddingTop: 4 }}>
            <div className="wallet-stack">
              {!isNew && (
                <button className="ws-cards" onClick={() => nav.go('card')} aria-label="Open wallet">
                  <span className="wc-label">2 cards <Icon.chev s={15} /></span>
                  <span className="wc-brand"><img src="assets/ft-mark-1080.png" alt="" style={{ width: 16, height: 16, borderRadius: 5, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} /> <Icon.nfc s={15} /></span>
                </button>
              )}
              <div className="ws-front">
                <BalanceCarousel banks={banks} hidden={hidden} setHidden={setHidden} nav={nav} app={app} />
              </div>
            </div>
          </div>
        )}

        {/* ── Smart suggestions (personalized recommendation module) ── */}
        {!isNew && (
          <div className="mod" style={{ ...mod(), marginTop: 14 }}>
            <SecHd title="For you" />
            <div className="hscroll">
              {DATA.SUGGESTIONS.map((s) => (
                <div className="sug-card" key={s.id}>
                  <div className="sug-top">
                    <div className={`sug-ic ${s.tint}`} style={{ color: tintFg(s.tint) }}><IconBy name={s.icon} s={20} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="sug-title">{s.title}</div>
                      <div className="sug-sub">{s.sub}</div>
                    </div>
                  </div>
                  <button className="btn btn-tonal btn-sm btn-block" style={{ color: s.accent, background: 'color-mix(in srgb,' + s.accent + ' 10%,#fff)' }}
                    onClick={() => nav.go(s.kind === 'recharge' ? 'recharge' : s.kind === 'bill' ? 'biller' : 'send', s.kind === 'bill' ? { id: 'b-elec' } : {})}>
                    {s.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Money transfers ── */}
        <div className="mod" style={{ ...mod(), padding: '14px 12px 0' }}>
          <SecHd title="Send money" pad={4} />
          <div className="qa-grid">
            <QA icon={Icon.phone} label="To Mobile" tint="tint-primary" onClick={() => nav.go('send')} />
            <QA icon={Icon.bank} label="To Account" tint="tint-primary" onClick={() => nav.go('send')} />
            <QA icon={Icon.qr} label="To UPI ID" tint="tint-primary" onClick={() => nav.go('send')} />
            <QA icon={Icon.refresh} label="To Self" tint="tint-primary" onClick={() => nav.go('send')} />
          </div>
        </div>

        {/* ── Recent people ── */}
        {!isNew ? (
          <div className="mod" style={{ ...mod(), padding: '14px 4px 0' }}>
            <SecHd title="People" link="See all" onLink={() => nav.go('send')} />
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '4px 16px 8px' }}>
              <button className="center-col" style={{ gap: 7, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }} onClick={() => nav.go('send')}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', border: '1.5px dashed var(--mav-primary)', color: 'var(--mav-primary)', display: 'grid', placeItems: 'center' }}><Icon.add s={22} /></div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--mav-muted)' }}>New</span>
              </button>
              {recent.map((p) => (
                <button key={p.id} className="center-col" style={{ gap: 7, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, width: 58 }} onClick={() => nav.go('amount', { payee: p })}>
                  <Avatar name={p.name} size={54} />
                  <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 58 }}>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Recharge & bills ── */}
        <div className="mod" style={{ ...mod(), padding: '6px 12px 0' }}>
          <SecHd title="Recharge & bills" link="All" onLink={() => nav.go('bills')} pad={4} />
          <div className="qa-grid">
            <QA icon={Icon.phone} label="Recharge" tint="tint-primary" onClick={() => nav.go('recharge')} />
            <QA icon={Icon.bolt} label="Electricity" tint="tint-warning" onClick={() => nav.go('biller', { id: 'b-elec' })} />
            <QA icon={Icon.tv} label="DTH" tint="tint-primary" onClick={() => nav.go('bills')} />
            <QA icon={Icon.wifi} label="Broadband" tint="tint-primary" onClick={() => nav.go('bills')} />
          </div>
        </div>

        {/* ── Finance products ── */}
        <div className="mod" style={{ ...mod(), padding: '14px 16px 0' }}>
          <SecHd title="Explore Fyscal" pad={4} />
          <div className="fin-grid">
            {DATA.FINANCE.map((f) => (
              <div className="fin-card" key={f.id} onClick={() => f.id === 'f-rewards' ? nav.go('rewards') : f.id === 'f-credit' ? nav.go('card') : app.toast({ tone: 'info', title: f.label, desc: 'Opening ' + f.label })}>
                <div className={`fin-ic ${f.tint}`} style={{ color: tintFg(f.tint) }}><IconBy name={f.icon} s={21} /></div>
                <div style={{ minWidth: 0 }}>
                  <div className="fin-label">{f.label}</div>
                  <div className="fin-value">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rewards strip ── */}
        {!isNew && (
          <div className="mod" style={{ ...mod(), padding: '14px 16px 0' }}>
            <div className="rewards-strip" onClick={() => nav.go('rewards')}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,.18)', display: 'grid', placeItems: 'center', flexShrink: 0, zIndex: 1 }}><Icon.gift s={24} /></div>
              <div style={{ flex: 1, zIndex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-.01em' }}>{u.rewards.toLocaleString('en-IN')} reward points</div>
                <div style={{ fontSize: 12.5, opacity: .9, marginTop: 1 }}>{u.scratchCards} scratch cards to open</div>
              </div>
              <span style={{ zIndex: 1, opacity: .9 }}><Icon.chev s={20} /></span>
            </div>
          </div>
        )}

        {/* ── Offers ── */}
        <div className="mod" style={{ ...mod(), marginTop: 14 }}>
          <SecHd title="Offers for you" link="See all" onLink={() => app.toast({ tone: 'info', title: 'Offers', desc: 'All offers' })} />
          <div className="hscroll">
            {DATA.OFFERS.map((o) => (
              <div className="offer-card" key={o.id} style={{ background: o.grad }} onClick={() => app.toast({ tone: 'info', title: o.brand, desc: o.title })}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="offer-brand">{o.brand}</div>
                  <div className="offer-title">{o.title}</div>
                </div>
                <div className="offer-sub" style={{ position: 'relative', zIndex: 1 }}>{o.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Spending insight (adaptive — hidden for new user) ── */}
        {!isNew && (
          <div className="mod" style={{ ...mod(), padding: '16px 16px 0' }}>
            <div className="card">
              <div className="spread" style={{ marginBottom: 14 }}>
                <div>
                  <div className="eyebrow">{isPower ? 'This month\u2019s spend' : 'This week\u2019s spend'}</div>
                  <div className="num" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 4 }}>{isPower ? '₹1,24,380' : '₹8,815'}</div>
                </div>
                <span className="badge badge-success"><Icon.check s={12} sw={3} /> 12% less</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 54 }}>
                {[40, 62, 30, 78, 95, 48, 22].map((h, k) => (
                  <div key={k} style={{ flex: 1, height: h + '%', borderRadius: '5px 5px 0 0', background: k === 4 ? 'var(--mav-primary)' : 'var(--mav-border)' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {['M','T','W','T','F','S','S'].map((d, k) => (
                  <span key={k} style={{ fontSize: 10, fontWeight: 600, color: k === 4 ? 'var(--mav-primary)' : 'var(--mav-muted)', flex: 1, textAlign: 'center' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Recent activity (empty state for new user) ── */}
        <div className="mod" style={{ ...mod(), padding: '16px 16px 0' }}>
          <SecHd title="Recent activity" link={isNew ? null : 'See all'} onLink={() => nav.go('history')} pad={4} />
          {isNew ? (
            <div className="card-flat empty">
              <div className="empty-ic"><Icon.history s={32} /></div>
              <div className="empty-title">No transactions yet</div>
              <div className="empty-desc">Once you make your first payment, it’ll show up here. Try scanning a QR to begin.</div>
              <button className="btn btn-tonal btn-sm" style={{ marginTop: 14 }} onClick={() => nav.go('scan')}><Icon.scan s={16} /> Scan & Pay</button>
            </div>
          ) : (
            <div className="list-card">
              {txns.map((t, i) => (
                <TxnRow key={t.id} t={t} divide={i < txns.length - 1} onClick={() => nav.go('txn', { id: t.id })} />
              ))}
            </div>
          )}
        </div>

        <div className="secure-strip" style={{ marginTop: 18 }}><Icon.shieldChk s={14} /> Secured by Fyscal · 100% safe payments</div>
      </div>

      {/* ── Logged-out lockout overlay ── */}
      {lockedOut && (
        <div className="lockout">
          <div className="auth-hero" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)', width: 72, height: 72, borderRadius: 22 }}><Icon.lock s={34} /></div>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', marginTop: 14 }}>You’ve been logged out</h2>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, marginTop: 7, maxWidth: 260 }}>For your security we locked your session. Log back in to see your balance and activity.</p>
          <button className="btn btn-primary" style={{ marginTop: 20, width: 220 }} onClick={() => { setState('default'); app.toast({ tone: 'success', title: 'Welcome back, ' + u.first }); }}>
            <Icon.faceid s={20} /> Unlock with Face ID
          </button>
          <button className="btn btn-ghost" style={{ marginTop: 4, width: 220 }} onClick={() => nav.reset('login')}>Use mobile number</button>
        </div>
      )}

      <BottomNav active="home" go={nav.go} />
    </div>
  );
};

/* ── Notification Center ───────────────────────────────────────────────── */
const SwipeNotif = ({ n, onRead, onDelete, onOpen }) => {
  const [dx, setDx] = useState(0);
  const start = useRef(null);
  const moved = useRef(false);
  const onDown = (e) => { start.current = (e.touches ? e.touches[0].clientX : e.clientX); moved.current = false; };
  const onMove = (e) => {
    if (start.current == null) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - start.current;
    if (x < 0) { setDx(Math.max(x, -152)); if (Math.abs(x) > 6) moved.current = true; }
  };
  const onUp = () => { if (start.current == null) return; setDx((d) => (d < -76 ? -152 : 0)); start.current = null; };
  return (
    <div className="notif-swipe">
      <div className="notif-swipe-actions">
        {n.unread && <button className="a-read" onClick={() => { setDx(0); onRead(n.id); }}><Icon.check s={18} sw={2.6} />Read</button>}
        <button className="a-del" onClick={() => onDelete(n.id)}><Icon.close s={18} sw={2.4} />Dismiss</button>
      </div>
      <div className={`notif-card ${n.unread ? 'unread' : ''}`} style={{ transform: `translateX(${dx}px)` }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        onClick={() => { if (moved.current || dx !== 0) { setDx(0); return; } onOpen(n); }}>
        {n.priority === 'high' && <span className="nc-accent" style={{ background: n.cat === 'security' ? 'var(--mav-primary)' : 'var(--mav-warning)' }} />}
        <div className={`notif-ic ${n.tint}`} style={{ color: tintFg(n.tint) }}><IconBy name={n.icon} s={21} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="spread" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {n.priority === 'high' && <span className="notif-prio">{n.cat === 'security' ? 'Security' : 'Action needed'}</span>}
              <span className="notif-title">{n.title}</span>
            </div>
            <span className="notif-time">{n.time}</span>
          </div>
          <div className="notif-body">{n.body}</div>
          {n.verified && <div className="notif-verified" style={{ marginTop: 6 }}><Icon.shieldChk s={11} /> Verified by Fyscal</div>}
          {n.action && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="notif-act-btn" onClick={(e) => { e.stopPropagation(); onOpen(n, true); }}>{n.action.label} <Icon.chev s={13} /></button>
              {n.dismiss && <button className="notif-act-btn ghost" onClick={(e) => { e.stopPropagation(); onRead(n.id); }}>{n.dismiss}</button>}
            </div>
          )}
        </div>
        {n.unread && <span className="notif-unread-dot" />}
      </div>
    </div>
  );
};

const NotificationCenter = ({ nav, app }) => {
  const [items, setItems] = useState(DATA.NOTIFS);
  const [filter, setFilter] = useState('all');
  const groups = ['Today', 'Earlier'];
  const markAll = () => { setItems((xs) => xs.map((n) => ({ ...n, unread: false }))); app.toast({ tone: 'info', title: 'All caught up', desc: 'Marked as read' }); };
  const read = (id) => setItems((xs) => xs.map((x) => x.id === id ? { ...x, unread: false } : x));
  const del = (id) => setItems((xs) => xs.filter((x) => x.id !== id));
  const open = (n, viaAction) => {
    read(n.id);
    const t = viaAction && n.action ? n.action : n.link;
    if (t && t.screen) nav.go(t.screen, t.params || {});
    else if (n.link && n.link.screen) nav.go(n.link.screen, n.link.params || {});
  };
  const unread = items.filter((n) => n.unread).length;
  const visible = items.filter((n) => filter === 'all' || n.cat === filter);

  return (
    <div className="screen bg-ios anim-in">
      <div className="appbar pad-top" style={{ paddingTop: 60 }}>
        <button className="iconbtn ghost" onClick={nav.back} aria-label="Back"><Icon.back s={24} /></button>
        <div style={{ flex: 1 }}><div className="ab-title">Notifications</div>{unread > 0 && <div className="ab-sub">{unread} unread</div>}</div>
        {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all read</button>}
      </div>

      {/* priority filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', overflowX: 'auto' }}>
        {DATA.NOTIF_FILTERS.map((f) => {
          const c = f.id === 'all' ? items.length : items.filter((n) => n.cat === f.id).length;
          return <button key={f.id} className={`chip ${filter === f.id ? 'sel' : ''}`} style={{ flexShrink: 0 }} onClick={() => setFilter(f.id)}>{f.label}{c > 0 && f.id !== 'all' ? ` · ${c}` : ''}</button>;
        })}
      </div>

      <div className="screen-scroll" style={{ padding: '0 16px 24px' }}>
        {visible.length === 0 ? (
          <div className="empty" style={{ marginTop: 40 }}>
            <div className="empty-ic"><Icon.bell s={32} /></div>
            <div className="empty-title">You’re all caught up</div>
            <div className="empty-desc">{filter === 'all' ? 'New payments, requests, and alerts will appear here.' : 'No notifications in this category.'}</div>
          </div>
        ) : groups.map((g) => {
          const list = visible.filter((n) => n.group === g);
          if (!list.length) return null;
          return (
            <div key={g}>
              <div className="notif-group-label">{g}</div>
              <div className="stack" style={{ gap: 10, marginBottom: 16 }}>
                {list.map((n) => (
                  <SwipeNotif key={n.id} n={n} onRead={read} onDelete={del} onOpen={open} />
                ))}
              </div>
            </div>
          );
        })}
        {visible.length > 0 && <div className="secure-strip"><Icon.shieldChk s={13} /> Fyscal never asks for your PIN or OTP in notifications</div>}
      </div>
    </div>
  );
};

window.HomeScreens = { Home, TxnRow, NotificationCenter };
