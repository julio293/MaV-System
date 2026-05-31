/* ══════════════════════════════════════════════════════════════════════════
   Customer support & dispute management
   Support hub · AI chat (Fy) + human handoff · Ticket tracking & lifecycle ·
   Call scheduling · Smart help suggestions. Reassuring, transparent.
   ══════════════════════════════════════════════════════════════════════════ */

const TKT_STATUS = {
  'in-progress': { c: 'var(--mav-warning)', label: 'In progress' },
  escalated: { c: 'var(--mav-secondary)', label: 'Escalated' },
  resolved: { c: 'var(--mav-success)', label: 'Resolved' },
  open: { c: 'var(--mav-primary)', label: 'Open' },
};

/* ── Support hub ───────────────────────────────────────────────────────── */
const Support = ({ nav, app }) => {
  const [open, setOpen] = useState(null);
  const flagged = DATA.TXNS.find((t) => t.status === 'Failed' || t.status === 'Pending');
  const openTickets = DATA.TICKETS.filter((t) => t.status !== 'resolved').length;

  const Tile = ({ icon: I, label, sub, tint, onClick, badge }) => (
    <button className="card" style={{ flex: 1, textAlign: 'left', padding: 14, cursor: 'pointer', position: 'relative' }} onClick={onClick}>
      <div className="qa-icon" style={{ width: 42, height: 42, background: `color-mix(in srgb,${tint} 12%,#fff)`, color: tint }}><I s={22} /></div>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 10 }}>{label}</div>
      <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{sub}</div>
      {badge ? <span className="badge badge-primary" style={{ position: 'absolute', top: 12, right: 12 }}>{badge}</span> : null}
    </button>
  );

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Help & support" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        {/* reassuring header */}
        <div className="card" style={{ background: 'linear-gradient(135deg,var(--mav-primary),var(--mav-secondary))', color: '#fff', marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em' }}>Hi {DATA.USER.first}, we’ve got you 💙</div>
          <div style={{ fontSize: 13.5, opacity: .9, lineHeight: 1.5, marginTop: 6 }}>Most payment issues sort themselves out within 48 hours — and your money is always protected. Tell us what’s wrong.</div>
        </div>

        {/* search */}
        <div className="input-box" style={{ padding: '12px 14px', background: '#fff', marginBottom: 14 }}>
          <span className="muted"><Icon.search s={20} /></span>
          <input placeholder="Describe your issue or search help" style={{ fontSize: 15, fontWeight: 500 }} onFocus={() => nav.go('chat', {})} />
        </div>

        {/* smart suggestion */}
        {flagged && (
          <div className="card" style={{ marginBottom: 14, borderLeft: 'none' }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Need help with this?</div>
            <div className="row" style={{ padding: 0, background: 'none' }}>
              <div className="cat-dot" style={{ background: `color-mix(in srgb,${flagged.status === 'Failed' ? 'var(--mav-danger)' : 'var(--mav-warning)'} 12%,#fff)`, color: flagged.status === 'Failed' ? 'var(--mav-danger)' : 'var(--mav-warning)' }}>
                {flagged.status === 'Failed' ? <Icon.alert s={20} /> : <Icon.clock s={20} />}
              </div>
              <div className="row-body"><div className="row-title">{flagged.status} · {flagged.name}</div><div className="row-sub">{inr(Math.abs(flagged.amount))} · {flagged.when.split(',')[0]}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => nav.go('txn', { id: flagged.id })}>View details</button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => nav.go('chat', { topic: flagged.status === 'Failed' ? 'failed' : 'pending' })}>Get help</button>
            </div>
          </div>
        )}

        {/* quick actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <Tile icon={Icon.sms} label="Chat with Fy" sub="AI · instant" tint="var(--mav-primary)" onClick={() => nav.go('chat', {})} />
          <Tile icon={Icon.calendar} label="Schedule a call" sub="Pick a time" tint="var(--mav-success)" onClick={() => nav.go('callschedule', {})} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Tile icon={Icon.doc} label="Track tickets" sub={openTickets + ' open'} tint="var(--mav-secondary)" onClick={() => nav.go('tickets')} badge={openTickets || null} />
          <Tile icon={Icon.alertTri} label="Raise dispute" sub="Report an issue" tint="var(--mav-warning)" onClick={() => nav.go('complaint', {})} />
        </div>

        {/* browse topics */}
        <div className="section-hd" style={{ paddingInline: 4 }}><span className="eyebrow">Browse topics</span></div>
        <div className="qa-grid" style={{ marginBottom: 18 }}>
          {DATA.HELP_TOPICS.map((t) => (
            <button key={t.id} className="qa-btn" onClick={() => nav.go('chat', {})}>
              <div className="qa-icon tint-primary"><span style={{ color: 'var(--mav-primary)' }}><IconBy name={t.icon} s={22} /></span></div>
              <span className="qa-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="section-hd" style={{ paddingInline: 4 }}><span className="eyebrow">Popular questions</span></div>
        <div className="list-card">
          {DATA.HELP_FAQS.map((f, i) => (
            <div key={i} style={{ borderTop: i ? '1px solid var(--mav-bg-secondary)' : 'none' }}>
              <div className="row" onClick={() => setOpen(open === i ? null : i)}>
                <div className="row-body"><div className="row-title" style={{ fontSize: 14 }}>{f.q}</div></div>
                <span className="row-chev" style={{ transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}><Icon.chev s={18} /></span>
              </div>
              {open === i && <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.55, padding: '0 16px 14px' }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── AI chat assistant (Fy) + human handoff ────────────────────────────── */
const ChatSupport = ({ nav, params, app }) => {
  const SCRIPT = {
    greet: { ai: 'Hi ' + DATA.USER.first + ' 👋 I’m Fy, your support assistant. I can sort most things out in seconds. What’s going on?', replies: ['A payment failed', 'Money debited, not received', 'Cashback missing', 'Talk to a human'] },
    failed: { ai: 'I’ve got you — a failed payment is almost always auto-reversed by your bank within 48 hours, and you’re never double-charged. I can see your ₹800 to Vikram Nair failed today. Want me to track it?', replies: ['Track this issue', 'Raise a dispute', 'Talk to a human'] },
    pending: { ai: 'No worries — “pending” means your bank is still confirming. It usually clears within minutes, and we’ll notify you. Nothing’s lost. Want me to keep an eye on it?', replies: ['Track this issue', 'Raise a dispute', 'Talk to a human'] },
    debited: { ai: 'Take a breath — when money is debited but not received, it’s auto-reversed to your account, typically within 48 hours. I can raise a tracked ticket so you can follow it.', replies: ['Track this issue', 'Raise a dispute', 'Talk to a human'] },
    cashback: { ai: 'Good news — cashback can take up to 24 hours to land. I can see ₹35 from your Swiggy payment is pending and on track to credit 🎉', replies: ['Anything else', 'Talk to a human'] },
    track: { ai: 'Here’s your ticket — FYD482190. Status: under review, auto-reversal initiated by your bank. You’ll get an update within 48 hours.', action: 'ticket' },
    dispute: { ai: 'Sure — let’s raise a formal dispute. I’ll take you to a quick form; you’ll get a tracked ticket number at the end.', action: 'dispute' },
    anything: { ai: 'Happy to help with anything else!', replies: ['A payment failed', 'Cashback missing', 'Talk to a human'] },
  };
  const startKey = params.topic === 'failed' ? 'failed' : params.topic === 'pending' ? 'pending' : 'greet';

  const [msgs, setMsgs] = useState([{ who: 'ai', text: SCRIPT[startKey].ai }]);
  const [replies, setReplies] = useState(SCRIPT[startKey].replies || []);
  const [typing, setTyping] = useState(false);
  const [human, setHuman] = useState(false);
  const [text, setText] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs, typing, replies]);

  const aiSay = (key) => {
    const node = SCRIPT[key]; if (!node) return;
    setReplies([]); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { who: 'ai', text: node.ai }]);
      if (node.replies) setReplies(node.replies);
      if (node.action === 'ticket') setTimeout(() => setMsgs((m) => [...m, { who: 'action', text: 'View ticket FYD482190', go: () => nav.go('ticket', { id: 'FYD482190' }) }]), 400);
      if (node.action === 'dispute') setTimeout(() => nav.go('complaint', {}), 900);
    }, 1100);
  };

  const handoff = () => {
    setReplies([]); setMsgs((m) => [...m, { who: 'sys', text: 'Connecting you to a support specialist…' }]); setTyping(true);
    setTimeout(() => {
      setTyping(false); setHuman(true);
      setMsgs((m) => [...m, { who: 'sys', text: 'Neha from Fyscal Support joined' }, { who: 'agent', text: 'Hi ' + DATA.USER.first + ', I’m Neha. I’ve read your chat with Fy — I’ll personally make sure this is resolved. Could you confirm the amount you’re worried about?' }]);
    }, 2200);
  };

  const onReply = (r) => {
    setMsgs((m) => [...m, { who: 'me', text: r }]);
    const map = { 'A payment failed': 'failed', 'Money debited, not received': 'debited', 'Cashback missing': 'cashback', 'Track this issue': 'track', 'Raise a dispute': 'dispute', 'Anything else': 'anything' };
    if (r === 'Talk to a human') { handoff(); return; }
    aiSay(map[r] || 'anything');
  };

  const send = () => {
    if (!text.trim()) return;
    const t = text.trim(); setText(''); setMsgs((m) => [...m, { who: 'me', text: t }]);
    if (human) { setTyping(true); setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: 'agent', text: 'Thanks — I’ve noted that. I’m raising a priority ticket for you now and will keep you posted here and over SMS.' }]); }, 1600); }
    else { setTyping(true); setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: 'ai', text: 'Got it. Let me point you to the fastest fix — or I can connect you to a specialist.' }]); setReplies(['A payment failed', 'Talk to a human']); }, 1300); }
  };

  return (
    <div className="screen bg-ios pad-top anim-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <AppBar title={human ? 'Neha · Support' : 'Fy · AI Assistant'} sub={human ? 'Typically replies in a minute' : 'AI · usually instant'} onBack={nav.back}
        right={<button className="iconbtn tinted" onClick={() => nav.go('tickets')} aria-label="Tickets"><Icon.doc s={20} /></button>} />
      {human && <div className="chat-agent"><span className="agent-dot" /><div style={{ fontSize: 12.5, fontWeight: 600 }}>You’re now chatting with a human specialist</div></div>}

      <div className="chat-scroll" ref={scrollRef}>
        {!human && <div className="bubble sys" style={{ marginBottom: 2 }}><Icon.shieldChk s={12} style={{ verticalAlign: 'middle' }} /> Secure chat · Fyscal Support</div>}
        {msgs.map((m, i) => (
          m.who === 'sys' ? <div className="bubble sys" key={i}>{m.text}</div>
          : m.who === 'action' ? <button className="qreply" key={i} style={{ alignSelf: 'flex-start' }} onClick={m.go}>{m.text} →</button>
          : <div className={`bubble ${m.who === 'me' ? 'me' : 'ai'}`} key={i} style={m.who === 'agent' ? { borderLeft: '3px solid var(--mav-success)' } : null}>{m.text}</div>
        ))}
        {typing && <div className="bubble ai"><span className="typing"><i /><i /><i /></span></div>}
      </div>

      {replies.length > 0 && !typing && (
        <div className="qreply-row">
          {replies.map((r) => <button key={r} className="qreply" onClick={() => onReply(r)}>{r}</button>)}
        </div>
      )}
      <div className="chat-input">
        <input placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button className="iconbtn" style={{ background: 'var(--mav-primary)', color: '#fff', width: 40, height: 40, flexShrink: 0 }} onClick={send} aria-label="Send"><Icon.sendUp s={20} /></button>
      </div>
    </div>
  );
};

/* ── Ticket tracking list ──────────────────────────────────────────────── */
const Tickets = ({ nav, app }) => {
  const list = DATA.TICKETS;
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Your tickets" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 24px' }}>
        {list.length === 0 ? (
          <div className="empty" style={{ marginTop: 40 }}>
            <div className="empty-ic"><Icon.doc s={30} /></div>
            <div className="empty-title">No tickets yet</div>
            <div className="empty-desc">When you raise an issue, you can track its progress here.</div>
          </div>
        ) : (
          <div className="stack" style={{ gap: 12 }}>
            {list.map((t) => {
              const st = TKT_STATUS[t.status];
              return (
                <div className="card" key={t.id} style={{ cursor: 'pointer', padding: 16 }} onClick={() => nav.go('ticket', { id: t.id })}>
                  <div className="spread" style={{ marginBottom: 8 }}>
                    <span className="num muted" style={{ fontSize: 12, fontWeight: 700 }}>#{t.id}</span>
                    <span className="stpill" style={{ background: `color-mix(in srgb,${st.c} 12%,#fff)`, color: st.c, padding: '3px 10px' }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{t.subject}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{t.ref} · Raised {t.created}</div>
                  <div className="divider" style={{ margin: '12px 0' }} />
                  <div className="spread"><span className="muted" style={{ fontSize: 12.5 }}>{t.updated}</span><span className="section-link">Track →</span></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Ticket detail — lifecycle + escalation ────────────────────────────── */
const TicketDetail = ({ nav, params, app }) => {
  const base = DATA.TICKETS.find((t) => t.id === params.id) || DATA.TICKETS[0];
  const [status, setStatus] = useState(base.status);
  const [step, setStep] = useState(base.step);
  const [esc, setEsc] = useState(false);
  const st = TKT_STATUS[status];
  const resolved = status === 'resolved';

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Ticket details" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        {/* summary */}
        <div className="card">
          <div className="spread" style={{ marginBottom: 8 }}>
            <span className="num muted" style={{ fontSize: 12.5, fontWeight: 700 }}>#{base.id}</span>
            <span className="stpill" style={{ background: `color-mix(in srgb,${st.c} 12%,#fff)`, color: st.c, padding: '3px 10px' }}>{st.label}</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{base.subject}</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>{base.ref} · {base.category}</div>
        </div>

        {/* reassurance */}
        {!resolved && (
          <div className="alert alert-primary" style={{ marginTop: 12 }}>
            <Icon.shieldChk s={18} /><span>Your money is safe while we sort this out. {status === 'escalated' ? 'Your bank’s team is now on it.' : 'Most cases resolve within 48 hours.'}</span>
          </div>
        )}

        {/* lifecycle */}
        <div className="card-flat" style={{ marginTop: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Resolution tracking</div>
          <div className="tl">
            {DATA.TICKET_LIFECYCLE.map((label, i) => {
              const cls = i < step ? 'done' : i === step ? 'cur' : 'wait';
              const times = ['Today, 3:10 PM', 'Today, 3:12 PM', status === 'escalated' ? 'Escalated' : 'In progress', resolved ? 'Done' : 'Expected within 48h'];
              return (
                <div className="tl-step" key={i}>
                  <span className={`tl-dot ${cls}`}>{i < step ? <Icon.check s={13} sw={3} /> : i === step ? <Icon.clock s={13} /> : null}</span>
                  <div className="tl-body"><div className="tl-title" style={i > step ? { color: 'var(--mav-muted)' } : null}>{label}</div><div className="tl-time">{i <= step ? times[i] : times[3]}</div></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* latest update */}
        <div className="card-flat" style={{ marginTop: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Latest update</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{base.updated}</div>
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button className="btn btn-secondary" onClick={() => nav.go('chat', {})}><Icon.sms s={18} /> Chat</button>
          {!resolved && status !== 'escalated' && <button className="btn btn-primary" onClick={() => setEsc(true)}><Icon.alertTri s={18} /> Escalate</button>}
          {resolved && <button className="btn btn-primary" onClick={() => app.toast({ tone: 'success', title: 'Glad we could help!' })}><Icon.check s={18} /> Mark resolved</button>}
        </div>
        {status === 'escalated' && <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => nav.go('callschedule', {})}><Icon.calendar s={18} /> Schedule a call back</button>}
      </div>

      <Dialog open={esc} onClose={() => setEsc(false)} tone="warning" icon={Icon.alertTri}
        title="Escalate this ticket?" desc="We’ll fast-track it to a senior specialist and your bank’s team. You’ll get priority updates."
        actions={<React.Fragment>
          <button className="btn btn-primary" onClick={() => { setEsc(false); setStatus('escalated'); setStep(2); app.toast({ tone: 'success', title: 'Ticket escalated', desc: 'Priority support assigned' }); }}>Escalate now</button>
          <button className="btn btn-ghost" onClick={() => setEsc(false)}>Keep waiting</button>
        </React.Fragment>} />
    </div>
  );
};

/* ── Call scheduling ───────────────────────────────────────────────────── */
const CallSchedule = ({ nav, app }) => {
  const [slot, setSlot] = useState(null);
  const [topic, setTopic] = useState(null);
  const [done, setDone] = useState(false);
  const topics = ['A failed or stuck payment', 'Unauthorised transaction', 'KYC or account help', 'Something else'];

  if (done) {
    return (
      <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="Call scheduled" onBack={() => nav.reset('home')} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
          <svg className="check-ring" viewBox="0 0 100 100" fill="none" style={{ width: 84, height: 84 }}>
            <circle cx="50" cy="50" r="44" stroke="var(--mav-success)" strokeWidth="5" />
            <path d="M30 51l13 13 27-29" stroke="var(--mav-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 16 }}>You’re booked in</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>A Fyscal specialist will call you <b style={{ color: 'var(--mav-fg)' }}>{slot}</b> on {DATA.USER.phone}. No need to wait on hold.</p>
          <div className="card-flat" style={{ width: '100%', marginTop: 18, textAlign: 'left' }}>
            <div className="spread"><span className="muted" style={{ fontSize: 13 }}>Reference</span><span className="num" style={{ fontWeight: 700 }}>CALL{Math.floor(10000 + Math.random() * 89999)}</span></div>
          </div>
        </div>
        <div style={{ padding: '0 20px' }}><button className="btn btn-primary" onClick={() => nav.reset('home')}>Done</button></div>
      </div>
    );
  }

  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Schedule a call" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 120px' }}>
        <div className="sec-banner" style={{ marginBottom: 16 }}><span className="si"><Icon.headset s={18} /></span><span className="st">We’ll call <b>you</b> — no hold music, no queues. Pick a time that works.</span></div>
        <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 10 }}>What’s it about?</div>
        <div className="stack" style={{ gap: 9, marginBottom: 18 }}>
          {topics.map((t) => (
            <button key={t} className={`reason-row ${topic === t ? 'sel' : ''}`} onClick={() => setTopic(t)}>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>{t}</span>
              <span className="sim-radio" style={topic === t ? { borderColor: 'var(--mav-primary)' } : null}>{topic === t && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--mav-primary)' }} />}</span>
            </button>
          ))}
        </div>
        <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 10 }}>Pick a slot</div>
        <div className="chip-row">
          {DATA.CALL_SLOTS.map((s) => <button key={s} className={`chip ${slot === s ? 'sel' : ''}`} onClick={() => setSlot(s)}>{s}</button>)}
        </div>
      </div>
      <div className="action-dock on-ios">
        <button className="btn btn-primary" disabled={!slot || !topic} onClick={() => { fx.tap(); setDone(true); }}>Confirm call back</button>
      </div>
    </div>
  );
};

window.SupportScreens = { Support, ChatSupport, Tickets, TicketDetail, CallSchedule };
