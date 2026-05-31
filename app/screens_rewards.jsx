/* ══════════════════════════════════════════════════════════════════════════
   Rewards & cashback ecosystem
   Hub (coins · streak · scratch cards · cashback feed · offers · referral) ·
   Scratch-card reveal (canvas scratch + delight motion) · Referrals
   ══════════════════════════════════════════════════════════════════════════ */

const rwFg = (tint) =>
  tint === 'tint-success' ? 'var(--mav-success)' : tint === 'tint-warning' ? 'var(--mav-warning)' :
  tint === 'tint-neutral' ? 'var(--mav-fg)' : 'var(--mav-primary)';

/* ── Rewards hub ───────────────────────────────────────────────────────── */
const Rewards = ({ nav, app }) => {
  const R = DATA.REWARDS;
  const [cards, setCards] = useState(R.scratchCards);
  const newCount = cards.filter((c) => c.state === 'new').length;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="screen bg-ios anim-fade">
      <div className="screen-scroll pad-top pad-nav">
        <AppBar title="Rewards" onBack={nav.back}
          right={<button className="iconbtn tinted" onClick={() => nav.go('referrals')} aria-label="Refer"><Icon.gift s={20} /></button>} />

        {/* coins hero */}
        <div style={{ padding: '0 16px 14px' }}>
          <div className="coins-hero">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="spread">
                <div>
                  <div style={{ fontSize: 12.5, opacity: .85, fontWeight: 600 }}>Fyscal Coins</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Icon.coin s={26} />
                    <span className="num" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.02em' }}>{R.coins.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button className="btn btn-sm" style={{ background: '#fff', color: 'var(--mav-primary)', boxShadow: 'none', width: 'auto', padding: '10px 18px' }} onClick={() => app.toast({ tone: 'info', title: 'Redeem coins', desc: 'Use coins for bill discounts' })}>Redeem</button>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 18 }}>
                <div><div style={{ fontSize: 11, opacity: .8 }}>Cashback this month</div><div className="num" style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>₹{R.cashbackMonth}</div></div>
                <div style={{ width: 1, background: 'rgba(255,255,255,.25)' }} />
                <div><div style={{ fontSize: 11, opacity: .8 }}>Coins = ₹{Math.round(R.coins / 100)}</div><div className="num" style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>100 = ₹1</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* gamified — daily streak */}
        <div style={{ padding: '0 16px 14px' }}>
          <div className="card">
            <div className="spread" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--mav-warning)' }}><Icon.flame s={20} /></span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{R.streak}-day streak</span>
              </div>
              <span className="muted" style={{ fontSize: 12 }}>Pay daily to keep it alive</span>
            </div>
            <div className="streak-row">
              {days.map((d, i) => (
                <div key={i} className={`streak-pip ${i < R.streak ? 'on' : 'off'}`}>
                  {i < R.streak ? <Icon.flame s={15} /> : <Icon.coin s={15} />}<span>{d}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-tonal btn-block" style={{ marginTop: 14 }} onClick={() => { fx.success(); app.toast({ tone: 'success', title: 'Daily reward claimed!', desc: '+10 coins' }); }}>
              <Icon.gift s={18} /> Claim today’s 10 coins
            </button>
          </div>
        </div>

        {/* scratch cards */}
        <div className="section-hd" style={{ paddingInline: 20 }}>
          <span className="section-title">Scratch cards</span>
          {newCount > 0 && <span className="badge badge-primary">{newCount} new</span>}
        </div>
        {cards.length === 0 ? (
          <div style={{ padding: '0 16px' }}>
            <div className="card-flat empty" style={{ padding: '28px 20px' }}>
              <div className="empty-ic"><Icon.gift s={30} /></div>
              <div className="empty-title">No scratch cards yet</div>
              <div className="empty-desc">Pay with Fyscal to earn scratch cards and win cashback or coins.</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {cards.map((c) => (
                <button key={c.id} className={`scratch-tile ${c.state === 'expired' ? 'expired' : ''}`}
                  onClick={() => c.state === 'new' ? nav.go('scratch', { id: c.id }) : c.state === 'expired' ? app.toast({ tone: 'info', title: 'Card expired', desc: 'This one slipped away' }) : null}>
                  {c.state === 'new' ? (
                    <div className="scratch-foil shine">
                      <Icon.gift s={26} /><span style={{ fontSize: 10.5, fontWeight: 700 }}>Tap to scratch</span>
                    </div>
                  ) : (
                    <div className="scratch-revealed">
                      {c.state === 'expired'
                        ? <><span className="muted"><Icon.clock s={22} /></span><span style={{ fontSize: 10, fontWeight: 700, color: 'var(--mav-muted)' }}>Expired</span></>
                        : <><span style={{ color: c.reward.type === 'coins' ? 'var(--mav-warning)' : 'var(--mav-success)' }}>{c.reward.type === 'coins' ? <Icon.coin s={22} /> : <Icon.rupee s={22} />}</span>
                          <span className="num" style={{ fontSize: 16, fontWeight: 800 }}>{c.reward.type === 'coins' ? c.reward.value : '₹' + c.reward.value}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--mav-muted)' }}>{c.reward.type === 'coins' ? 'COINS' : 'CASHBACK'}</span></>}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* cashback feed */}
        <div className="section-hd" style={{ paddingInline: 20, paddingTop: 18 }}><span className="section-title">Cashback feed</span></div>
        <div style={{ padding: '0 16px' }}>
          <div className="list-card">
            {R.cashbackFeed.map((f, i) => (
              <div className={`txn-item ${i < R.cashbackFeed.length - 1 ? 'txn-divide' : ''}`} key={f.id}>
                <div className="cat-dot" style={{ background: `color-mix(in srgb,${rwFg(f.tint)} 12%,#fff)`, color: rwFg(f.tint) }}><IconBy name={f.icon} s={20} /></div>
                <div className="txn-body"><div className="txn-name">{f.brand}</div><div className="txn-meta">{f.desc}</div></div>
                <div className="txn-right">
                  <div className="txn-amount credit">+₹{f.amount}</div>
                  <div className="txn-status" style={{ color: f.status === 'pending' ? 'var(--mav-warning)' : 'var(--mav-success)' }}>{f.status === 'pending' ? 'Pending' : 'Credited'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* referral */}
        <div style={{ padding: '16px 16px 0' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(120deg,var(--mav-bg-tertiary),#fff)', cursor: 'pointer' }} onClick={() => nav.go('referrals')}>
            <div className="qa-icon tint-success" style={{ width: 46, height: 46 }}><span style={{ color: 'var(--mav-success)' }}><Icon.gift s={22} /></span></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 700 }}>Refer & earn ₹50</div><div className="muted" style={{ fontSize: 12.5 }}>For every friend who joins & pays</div></div>
            <span className="row-chev"><Icon.chev s={18} /></span>
          </div>
        </div>

        {/* offer discovery */}
        <div className="section-hd" style={{ paddingInline: 20, paddingTop: 18 }}>
          <span className="section-title">Offers for you</span>
          <span className="section-link" onClick={() => app.toast({ tone: 'info', title: 'All offers' })}>See all</span>
        </div>
        <div className="hscroll">
          {DATA.OFFERS.map((o) => (
            <div className="offer-card" key={o.id} style={{ background: o.grad }} onClick={() => app.toast({ tone: 'info', title: o.brand, desc: o.title })}>
              <div style={{ position: 'relative', zIndex: 1 }}><div className="offer-brand">{o.brand}</div><div className="offer-title">{o.title}</div></div>
              <div className="offer-sub" style={{ position: 'relative', zIndex: 1 }}>{o.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="profile" go={nav.go} />
    </div>
  );
};

/* ── Scratch-card reveal (canvas scratch + delight) ────────────────────── */
const ScratchReveal = ({ nav, params, app }) => {
  const card = DATA.REWARDS.scratchCards.find((c) => c.id === params.id) || DATA.REWARDS.scratchCards[0];
  const reward = card.reward || { type: 'cashback', value: 20 };
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const scratching = useRef(false);
  const isCoins = reward.type === 'coins';

  const reveal = () => {
    if (revealed) return;
    setRevealed(true); fx.success();
    const cv = canvasRef.current;
    if (cv) cv.style.transition = 'opacity .5s'; if (cv) cv.style.opacity = '0';
  };

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const w = cv.width = cv.offsetWidth * 2, h = cv.height = cv.offsetHeight * 2;
    ctx.scale(2, 2);
    const W = cv.offsetWidth, H = cv.offsetHeight;
    // silver foil
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#9aa0c8'); g.addColorStop(.5, '#c2c7e6'); g.addColorStop(1, '#8a90b8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center'; ctx.letterSpacing = '2px';
    ctx.fillText('SCRATCH TO REVEAL', W / 2, H / 2 + 30);
    ctx.font = '600 11px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.45)';
    ctx.fillText('fyscal rewards', W / 2, H / 2 + 50);

    let erased = 0;
    const pt = (e) => {
      const r = cv.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      return { cx, cy };
    };
    const scratch = (e) => {
      if (!scratching.current) return;
      const { cx, cy } = pt(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
      erased += 1;
      if (erased > 22) { reveal(); cleanup(); }
    };
    const down = (e) => { scratching.current = true; scratch(e); };
    const up = () => { scratching.current = false; };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', scratch);
    window.addEventListener('pointerup', up);
    const cleanup = () => { cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', scratch); window.removeEventListener('pointerup', up); };
    return cleanup;
  }, []);

  return (
    <div className="screen anim-fade" style={{ background: 'linear-gradient(165deg, #211f48 0%, #2a2580 55%, #14122f 100%)' }}>
      <div className="pad-top">
        <AppBar onBack={nav.back} tone="flush" right={<span style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, opacity: .8 }}>{card.from}</span>} />
        <style>{`.appbar .ab-title{color:#fff}`}</style>
      </div>
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 36px' }}>
        <div className="reveal-stage" style={{ width: 250, height: 250 }}>
          {/* reward underneath */}
          <div className="card center-col reward-pop" style={{ width: '100%', height: '100%', borderRadius: 24, gap: 6, justifyContent: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: 22, display: 'grid', placeItems: 'center', background: isCoins ? 'color-mix(in srgb,var(--mav-warning) 14%,#fff)' : 'color-mix(in srgb,var(--mav-success) 14%,#fff)', color: isCoins ? 'var(--mav-warning)' : 'var(--mav-success)' }}>
              {isCoins ? <Icon.coin s={38} /> : <Icon.rupee s={38} />}
            </div>
            <div className="num" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.02em', marginTop: 6 }}>{isCoins ? reward.value : '₹' + reward.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--mav-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{isCoins ? 'Coins won' : 'Cashback won'}</div>
          </div>
          {/* scratch foil canvas on top */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 24, cursor: 'grab', touchAction: 'none' }} />
          {/* calm glow on reveal */}
          {revealed && <div className="reveal-glow" />}
        </div>
        <div style={{ color: '#fff', marginTop: 28, textAlign: 'center', minHeight: 24 }}>
          {revealed
            ? <div className="reward-pop" style={{ fontSize: 16, fontWeight: 700 }}>Added to your rewards</div>
            : <div style={{ fontSize: 14, opacity: .85 }}>Scratch the card to reveal your reward</div>}
        </div>
      </div>
      <div style={{ padding: '0 24px calc(28px + env(safe-area-inset-bottom,8px))' }}>
        {revealed
          ? <button className="btn btn-secondary" style={{ background: '#fff', boxShadow: 'none' }} onClick={() => { nav.back(); app.toast({ tone: 'success', title: isCoins ? '+' + reward.value + ' coins added' : '₹' + reward.value + ' cashback credited' }); }}>
              {isCoins ? 'Add to my coins' : 'Add to balance'}
            </button>
          : <button className="btn" style={{ background: 'rgba(255,255,255,.16)', color: '#fff', backdropFilter: 'blur(8px)' }} onClick={reveal}>Reveal instantly</button>}
      </div>
    </div>
  );
};

/* ── Referrals ─────────────────────────────────────────────────────────── */
const Referrals = ({ nav, app }) => {
  const r = DATA.REWARDS.referral;
  const steps = [
    { icon: 'share', t: 'Share your code', d: 'Send it to friends on WhatsApp or anywhere' },
    { icon: 'add', t: 'They join Fyscal', d: 'Sign up and complete a first payment' },
    { icon: 'gift', t: 'You both earn ₹50', d: 'Credited to your balance instantly' },
  ];
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Refer & earn" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        {/* hero */}
        <div className="coins-hero" style={{ background: 'radial-gradient(130% 100% at 20% 0%, #2bd47e, #0fa968 60%, #0a7a4b)', textAlign: 'center' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}><Icon.gift s={32} /></div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Give ₹50, get ₹50</div>
            <div style={{ fontSize: 13.5, opacity: .9, marginTop: 6 }}>For every friend who joins and makes their first payment</div>
          </div>
        </div>

        {/* code */}
        <div className="card" style={{ marginTop: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Your referral code</div>
          <div className="spread">
            <span className="num" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '.06em', color: 'var(--mav-primary)' }}>{r.code}</span>
            <button className="btn btn-tonal btn-sm" onClick={() => app.toast({ tone: 'success', title: 'Code copied', desc: r.code })}><Icon.copy s={16} /> Copy</button>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => app.toast({ tone: 'success', title: 'Sharing…', desc: 'Invite link ready' })}><Icon.share s={18} /> Share invite</button>
        </div>

        {/* stats */}
        <div className="card" style={{ marginTop: 12, display: 'flex' }}>
          {[['Invited', r.invited], ['Joined', r.joined], ['Earned', '₹' + r.earned]].map(([l, v], i) => (
            <React.Fragment key={l}>
              {i > 0 && <div style={{ width: 1, background: 'var(--mav-border)', margin: '0 6px' }} />}
              <div style={{ flex: 1, textAlign: 'center' }}><div className="num" style={{ fontSize: 20, fontWeight: 800 }}>{v}</div><div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{l}</div></div>
            </React.Fragment>
          ))}
        </div>

        {/* how it works */}
        <div className="section-hd" style={{ paddingInline: 4, paddingTop: 16 }}><span className="eyebrow">How it works</span></div>
        <div className="card-flat">
          {steps.map((s, i) => (
            <div className="perm-row" key={i} style={{ borderTop: i ? '1px solid var(--mav-bg-secondary)' : 'none' }}>
              <div className="perm-ic tint-success"><IconBy name={s.icon} s={20} /></div>
              <div className="perm-body"><div className="perm-title">{s.t}</div><div className="perm-desc">{s.d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.RewardScreens = { Rewards, ScratchReveal, Referrals };
