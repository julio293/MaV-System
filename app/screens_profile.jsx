/* ══════════════════════════════════════════════════════════════════════════
   Profile · Account · Settings
   Hub → Personal info · UPI IDs · Bank accounts · Security · Linked devices ·
   Notifications · Language · Help center · Raise complaint · Privacy controls
   ══════════════════════════════════════════════════════════════════════════ */

/* shared building blocks */
const SToggle = ({ on, set }) => (
  <button onClick={() => { set(!on); fx.tap(); }} role="switch" aria-checked={on}
    style={{ width: 46, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 3, background: on ? 'var(--mav-primary)' : 'var(--mav-bg-secondary)', transition: 'background .18s', flexShrink: 0 }}>
    <span style={{ display: 'block', width: 22, height: 22, borderRadius: '50%', background: '#fff', transform: on ? 'translateX(18px)' : 'translateX(0)', transition: 'transform .18s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
  </button>
);
const SRow = ({ icon: I, title, sub, onClick, tint = 'var(--mav-primary)', right, divide }) => (
  <div className={`row ${divide ? 'txn-divide' : ''}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="row-ic" style={{ background: `color-mix(in srgb,${tint} 12%,#fff)`, color: tint }}><I s={20} /></div>
    <div className="row-body"><div className="row-title">{title}</div>{sub && <div className="row-sub">{sub}</div>}</div>
    {right !== undefined ? right : <span className="row-chev"><Icon.chev s={18} /></span>}
  </div>
);
const Section = ({ label, children }) => (
  <React.Fragment>
    <div className="section-hd" style={{ paddingInline: 20 }}><span className="eyebrow">{label}</span></div>
    <div className="list-card" style={{ margin: '0 16px 16px' }}>{children}</div>
  </React.Fragment>
);

/* ── Profile hub ───────────────────────────────────────────────────────── */
const Profile = ({ nav, app }) => {
  const u = DATA.USER;
  const [logout, setLogout] = useState(false);
  return (
    <div className="screen bg-ios anim-fade">
      <div className="screen-scroll pad-top pad-nav">
        <AppBar title="Profile" tone="flush" right={<button className="iconbtn tinted" onClick={() => nav.go('settings')} aria-label="Settings"><Icon.cog s={20} /></button>} />

        {/* identity card */}
        <div style={{ padding: '0 16px 14px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => nav.go('editprofile')}>
            <Avatar name={u.name} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{u.name}</div>
              <div className="muted" style={{ fontSize: 13 }}>{u.phone}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12.5, fontWeight: 600, color: 'var(--mav-primary)' }}>
                {u.vpa} <button className="iconbtn ghost" style={{ width: 22, height: 22 }} onClick={(e) => { e.stopPropagation(); app.toast({ tone: 'success', title: 'UPI ID copied' }); }}><Icon.copy s={14} /></button>
              </div>
            </div>
            <span className="row-chev"><Icon.chev s={18} /></span>
          </div>
        </div>

        {/* KYC banner */}
        <div style={{ padding: '0 16px 16px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'color-mix(in srgb,var(--mav-success) 8%,#fff)', cursor: 'pointer' }} onClick={() => nav.go('kyc')}>
            <div className="row-ic" style={{ background: 'color-mix(in srgb,var(--mav-success) 16%,#fff)', color: 'var(--mav-success)' }}><Icon.shieldChk s={20} /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>KYC verified</div><div className="muted" style={{ fontSize: 12.5 }}>Full account · No limits · View details</div></div>
            <span className="row-chev"><Icon.chev s={18} /></span>
          </div>
        </div>

        <Section label="Account">
          <SRow icon={Icon.user} title="Personal information" sub="Name, email, photo" onClick={() => nav.go('editprofile')} divide />
          <SRow icon={Icon.qr} title="My UPI IDs" sub={`${DATA.UPI_IDS.length} IDs · ${u.vpa} primary`} onClick={() => nav.go('upiids')} divide />
          <SRow icon={Icon.bank} title="Bank accounts" sub="2 linked · HDFC default" onClick={() => nav.go('banks')} />
        </Section>

        <Section label="Security">
          <SRow icon={Icon.shield} title="Security & privacy" sub="UPI PIN, biometrics, app lock" onClick={() => nav.go('settings')} divide />
          <SRow icon={Icon.phone} title="Linked devices" sub={`${DATA.DEVICES.length} active sessions`} tint="var(--mav-secondary)" onClick={() => nav.go('devices')} divide />
          <SRow icon={Icon.lock} title="Privacy controls" sub="Data, permissions, account" tint="var(--mav-muted)" onClick={() => nav.go('privacy')} />
        </Section>

        <Section label="Preferences">
          <SRow icon={Icon.bell} title="Notifications" sub="Payments, offers, reminders" tint="var(--mav-warning)" onClick={() => nav.go('notifications')} divide />
          <SRow icon={Icon.eye} title="Appearance" sub="Light, dark or system" tint="var(--mav-secondary)" onClick={() => nav.go('appearance')} divide />
          <SRow icon={Icon.globe} title="Language" sub="English" tint="var(--mav-secondary)" onClick={() => nav.go('language')} divide />
          <SRow icon={Icon.gift} title="Rewards & offers" sub="₹240 earned this month" tint="var(--mav-success)" onClick={() => nav.go('rewards')} />
        </Section>

        <Section label="Support">
          <SRow icon={Icon.headset} title="Help &amp; support" sub="Chat, call, tickets & FAQs" tint="var(--mav-secondary)" onClick={() => nav.go('support')} divide />
          <SRow icon={Icon.alertTri} title="Raise a complaint" sub="Report an issue or fraud" tint="var(--mav-warning)" onClick={() => nav.go('complaint', {})} />
        </Section>

        <div style={{ padding: '0 16px' }}>
          <button className="btn btn-secondary" style={{ color: 'var(--mav-danger)', boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb,var(--mav-danger) 30%,#fff)' }} onClick={() => setLogout(true)}>
            <Icon.logout s={18} /> Log out
          </button>
          <div className="center-col" style={{ marginTop: 18, gap: 6 }}>
            <img src="assets/ft-wordmark-blue.png" alt="Fyscal Technologies" style={{ height: 26, opacity: .9 }} />
            <div className="muted" style={{ textAlign: 'center', fontSize: 11.5 }}>v1.0.0 · Empowering digital finance</div>
          </div>
        </div>
      </div>
      <BottomNav active="profile" go={nav.go} />

      <Dialog open={logout} onClose={() => setLogout(false)} tone="danger" icon={Icon.logout}
        title="Log out of Fyscal?" desc="You’ll need to verify your number again to sign back in. Your saved data stays safe."
        actions={<React.Fragment>
          <button className="btn btn-primary" style={{ background: 'var(--mav-danger)', boxShadow: 'none' }} onClick={() => { setLogout(false); app.setAuthed(false); nav.reset('onboarding'); }}>Log out</button>
          <button className="btn btn-ghost" onClick={() => setLogout(false)}>Stay logged in</button>
        </React.Fragment>} />
    </div>
  );
};

/* ── Personal information ──────────────────────────────────────────────── */
const EditProfile = ({ nav, app }) => {
  const u = DATA.USER;
  const [name, setName] = useState(u.name);
  const [email, setEmail] = useState('aarav@email.com');
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Personal information" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 24px 24px' }}>
        <div className="center-col" style={{ gap: 10, marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <Avatar name={name} size={84} />
            <button className="iconbtn" style={{ position: 'absolute', right: -4, bottom: -4, width: 30, height: 30, background: 'var(--mav-primary)', color: '#fff', border: '3px solid var(--ios-bg)' }} onClick={() => app.toast({ tone: 'info', title: 'Change photo' })}><Icon.camera s={15} /></button>
          </div>
        </div>
        <div className="field" style={{ marginBottom: 14 }}><label className="field-label">Full name</label><div className="input-box"><Icon.user s={18} /><input value={name} onChange={(e) => setName(e.target.value)} /></div></div>
        <div className="field" style={{ marginBottom: 14 }}><label className="field-label">Email</label><div className="input-box"><Icon.mail s={18} /><input value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">Mobile number</label>
          <div className="input-box" style={{ opacity: .7 }}><Icon.phone s={18} /><input value={u.phone} readOnly /><span className="stpill" style={{ background: 'color-mix(in srgb,var(--mav-success) 12%,#fff)', color: 'var(--mav-success)' }}><Icon.check s={10} sw={3} /> Verified</span></div>
        </div>
        <div className="alert alert-primary"><Icon.info s={18} /><span>Your mobile number is tied to your UPI identity and can’t be changed here.</span></div>
      </div>
      <div className="action-dock on-ios">
        <button className="btn btn-primary" onClick={() => { nav.back(); app.toast({ tone: 'success', title: 'Profile updated' }); }}>Save changes</button>
      </div>
    </div>
  );
};

/* ── UPI IDs ───────────────────────────────────────────────────────────── */
const UpiIds = ({ nav, app }) => {
  const [ids, setIds] = useState(DATA.UPI_IDS);
  const [del, setDel] = useState(null);
  const makePrimary = (id) => { setIds((xs) => xs.map((x) => ({ ...x, primary: x.id === id }))); fx.tap(); app.toast({ tone: 'success', title: 'Primary UPI ID updated' }); };
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="My UPI IDs" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 24px' }}>
        <div className="sec-banner" style={{ marginBottom: 14 }}><span className="si"><Icon.qr s={18} /></span><span className="st">Share any of these to get paid. Your <b>primary</b> ID is used by default on your QR.</span></div>
        <div className="list-card">
          {ids.map((u, i) => (
            <div className="row" key={u.id} style={{ cursor: 'default', borderTop: i ? '1px solid var(--mav-bg-secondary)' : 'none' }}>
              <div className="row-ic" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.qr s={20} /></div>
              <div className="row-body">
                <div className="row-title num">{u.vpa} {u.primary && <span className="stpill" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)', marginLeft: 4 }}>Primary</span>}</div>
                <div className="row-sub">{u.bank}</div>
              </div>
              {u.primary
                ? <button className="iconbtn ghost" onClick={() => app.toast({ tone: 'success', title: 'Copied', desc: u.vpa })}><Icon.copy s={18} /></button>
                : <button className="btn btn-tonal btn-sm" style={{ padding: '7px 12px' }} onClick={() => makePrimary(u.id)}>Set primary</button>}
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 14 }} onClick={() => app.toast({ tone: 'info', title: 'Create UPI ID', desc: 'Pick a new @fyscal handle' })}><Icon.add s={18} /> Create new UPI ID</button>
        {ids.length > 1 && <button className="btn btn-ghost" style={{ marginTop: 4, color: 'var(--mav-danger)' }} onClick={() => setDel(ids.find((x) => !x.primary))}>Deactivate a UPI ID</button>}
      </div>
      <Dialog open={!!del} onClose={() => setDel(null)} tone="danger" icon={Icon.alertTri}
        title="Deactivate UPI ID?" desc={del ? `${del.vpa} will stop working immediately. Anyone paying it will see an error.` : ''}
        actions={<React.Fragment>
          <button className="btn btn-primary" style={{ background: 'var(--mav-danger)', boxShadow: 'none' }} onClick={() => { setIds((xs) => xs.filter((x) => x.id !== del.id)); setDel(null); app.toast({ tone: 'success', title: 'UPI ID deactivated' }); }}>Deactivate</button>
          <button className="btn btn-ghost" onClick={() => setDel(null)}>Keep it</button>
        </React.Fragment>} />
    </div>
  );
};

/* ── Bank accounts ─────────────────────────────────────────────────────── */
const BankAccounts = ({ nav, app }) => {
  const [accs, setAccs] = useState(DATA.SELF_ACCOUNTS.map((a, i) => ({ ...a, primary: i === 0 })));
  const [del, setDel] = useState(null);
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Bank accounts" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 24px' }}>
        <div className="stack" style={{ gap: 12 }}>
          {accs.map((a) => (
            <div className="card" key={a.id} style={{ padding: 16 }}>
              <div className="spread" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="bank-logo" style={{ width: 44, height: 44, fontSize: 15, background: a.color }}>{a.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                  <div><div style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</div><div className="muted num" style={{ fontSize: 12.5 }}>{a.acc} · {a.type}</div></div>
                </div>
                {a.primary && <span className="stpill" style={{ background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}>Default</span>}
              </div>
              <div className="spread" style={{ paddingTop: 12, borderTop: '1px solid var(--mav-bg-secondary)' }}>
                <button className="btn btn-ghost btn-sm" style={{ padding: '6px 8px' }} onClick={() => app.toast({ tone: 'info', title: 'Check balance', desc: 'Enter UPI PIN' })}><Icon.eye s={16} /> Balance</button>
                {!a.primary && <button className="btn btn-ghost btn-sm" style={{ padding: '6px 8px' }} onClick={() => { setAccs((xs) => xs.map((x) => ({ ...x, primary: x.id === a.id }))); app.toast({ tone: 'success', title: 'Default account updated' }); }}>Set default</button>}
                <button className="btn btn-ghost btn-sm" style={{ padding: '6px 8px', color: 'var(--mav-danger)' }} onClick={() => setDel(a)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 14 }} onClick={() => nav.go('linkbank')}><Icon.add s={18} /> Add bank account</button>
      </div>
      <Dialog open={!!del} onClose={() => setDel(null)} tone="danger" icon={Icon.bank}
        title="Remove this account?" desc={del ? `${del.name} ${del.acc} will be unlinked from Fyscal. You can add it again anytime.` : ''}
        actions={<React.Fragment>
          <button className="btn btn-primary" style={{ background: 'var(--mav-danger)', boxShadow: 'none' }} onClick={() => { setAccs((xs) => xs.filter((x) => x.id !== del.id)); setDel(null); app.toast({ tone: 'success', title: 'Account removed' }); }}>Remove</button>
          <button className="btn btn-ghost" onClick={() => setDel(null)}>Cancel</button>
        </React.Fragment>} />
    </div>
  );
};

/* ── Security & privacy ────────────────────────────────────────────────── */
const Settings = ({ nav, app }) => {
  const [bio, setBio] = useState(true);
  const [lock, setLock] = useState(true);
  const [hide, setHide] = useState(false);
  const TRow = ({ icon: I, title, sub, on, set, tint = 'var(--mav-primary)', divide }) => (
    <div className={`row ${divide ? 'txn-divide' : ''}`} style={{ cursor: 'default' }}>
      <div className="row-ic" style={{ background: `color-mix(in srgb,${tint} 12%,#fff)`, color: tint }}><I s={20} /></div>
      <div className="row-body"><div className="row-title">{title}</div>{sub && <div className="row-sub">{sub}</div>}</div>
      <SToggle on={on} set={set} />
    </div>
  );
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Security & privacy" onBack={nav.back} />
      <div className="screen-scroll" style={{ paddingBottom: 24 }}>
        <Section label="Authentication">
          <SRow icon={Icon.fingerprint} title="Change UPI PIN" sub="Last changed 3 months ago" onClick={() => nav.go('changepin')} divide />
          <TRow icon={Icon.faceid} title="Biometric unlock" sub="Use Face ID to open Fyscal" on={bio} set={setBio} tint="var(--mav-secondary)" divide />
          <TRow icon={Icon.shield} title="App lock" sub="Require unlock every time" on={lock} set={setLock} />
        </Section>
        <Section label="Privacy">
          <TRow icon={Icon.eyeOff} title="Hide balance by default" sub="Tap to reveal on home" on={hide} set={setHide} tint="var(--mav-muted)" divide />
          <SRow icon={Icon.qr} title="Manage UPI IDs" sub={`${DATA.UPI_IDS.length} active`} onClick={() => nav.go('upiids')} divide />
          <SRow icon={Icon.phone} title="Linked devices" sub={`${DATA.DEVICES.length} sessions`} tint="var(--mav-secondary)" onClick={() => nav.go('devices')} />
        </Section>
        <div style={{ padding: '0 16px' }}>
          <div className="alert alert-primary"><Icon.shieldChk s={18} /><span>Fyscal is RBI-licensed and 256-bit encrypted. Your money and data are always protected.</span></div>
        </div>
      </div>
    </div>
  );
};

/* ── Linked devices / sessions ─────────────────────────────────────────── */
const Devices = ({ nav, app }) => {
  const [list, setList] = useState(DATA.DEVICES);
  const [remove, setRemove] = useState(null);
  const [all, setAll] = useState(false);
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Linked devices" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 24px' }}>
        <div className="sec-banner" style={{ marginBottom: 14 }}><span className="si"><Icon.shieldChk s={18} /></span><span className="st">These devices are signed in to your Fyscal account. Remove any you don’t recognise.</span></div>
        <div className="list-card">
          {list.map((d, i) => (
            <div className="row" key={d.id} style={{ cursor: 'default', borderTop: i ? '1px solid var(--mav-bg-secondary)' : 'none' }}>
              <div className="row-ic" style={{ background: d.current ? 'color-mix(in srgb,var(--mav-success) 12%,#fff)' : 'var(--mav-bg-tertiary)', color: d.current ? 'var(--mav-success)' : 'var(--mav-primary)' }}><Icon.phone s={20} /></div>
              <div className="row-body">
                <div className="row-title">{d.name} {d.current && <span className="stpill" style={{ background: 'color-mix(in srgb,var(--mav-success) 12%,#fff)', color: 'var(--mav-success)', marginLeft: 4 }}>This device</span>}</div>
                <div className="row-sub">{d.os} · {d.loc}</div>
                <div className="row-sub" style={{ color: d.current ? 'var(--mav-success)' : 'var(--mav-muted)' }}>{d.active}</div>
              </div>
              {!d.current && <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px', color: 'var(--mav-danger)' }} onClick={() => setRemove(d)}>Remove</button>}
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 14, color: 'var(--mav-danger)', boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb,var(--mav-danger) 30%,#fff)' }} onClick={() => setAll(true)}>
          <Icon.logout s={18} /> Log out of all other devices
        </button>
      </div>
      <Dialog open={!!remove} onClose={() => setRemove(null)} tone="danger" icon={Icon.phone}
        title="Remove this device?" desc={remove ? `${remove.name} will be signed out of Fyscal immediately.` : ''}
        actions={<React.Fragment>
          <button className="btn btn-primary" style={{ background: 'var(--mav-danger)', boxShadow: 'none' }} onClick={() => { setList((xs) => xs.filter((x) => x.id !== remove.id)); setRemove(null); app.toast({ tone: 'success', title: 'Device removed' }); }}>Remove device</button>
          <button className="btn btn-ghost" onClick={() => setRemove(null)}>Cancel</button>
        </React.Fragment>} />
      <Dialog open={all} onClose={() => setAll(false)} tone="warning" icon={Icon.logout}
        title="Log out everywhere else?" desc="All devices except this one will be signed out. You’ll stay logged in here."
        actions={<React.Fragment>
          <button className="btn btn-primary" onClick={() => { setList((xs) => xs.filter((x) => x.current)); setAll(false); app.toast({ tone: 'success', title: 'Other sessions ended' }); }}>Log out others</button>
          <button className="btn btn-ghost" onClick={() => setAll(false)}>Cancel</button>
        </React.Fragment>} />
    </div>
  );
};

/* ── Notifications ─────────────────────────────────────────────────────── */
const Notifications = ({ nav, app }) => {
  const [s, setS] = useState({ pay: true, request: true, bills: true, autopay: true, offers: false, security: true, tips: false });
  const set = (k) => (v) => setS((x) => ({ ...x, [k]: v }));
  const TRow = ({ icon: I, title, sub, k, tint = 'var(--mav-primary)', divide }) => (
    <div className={`row ${divide ? 'txn-divide' : ''}`} style={{ cursor: 'default' }}>
      <div className="row-ic" style={{ background: `color-mix(in srgb,${tint} 12%,#fff)`, color: tint }}><I s={20} /></div>
      <div className="row-body"><div className="row-title">{title}</div>{sub && <div className="row-sub">{sub}</div>}</div>
      <SToggle on={s[k]} set={set(k)} />
    </div>
  );
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Notifications" onBack={nav.back} />
      <div className="screen-scroll" style={{ paddingBottom: 24 }}>
        <Section label="Money">
          <TRow icon={Icon.receive} title="Payments received" sub="When money comes in" tint="var(--mav-success)" divide />
          <TRow icon={Icon.send} title="Payment requests" k="request" divide />
          <TRow icon={Icon.bills} title="Bill due reminders" sub="3 days before due date" k="bills" tint="var(--mav-warning)" divide />
          <TRow icon={Icon.repeat} title="AutoPay alerts" sub="Before every auto-debit" k="autopay" />
        </Section>
        <Section label="Security">
          <TRow icon={Icon.shieldChk} title="Security alerts" sub="New logins & sensitive changes" k="security" tint="var(--mav-secondary)" />
        </Section>
        <Section label="From Fyscal">
          <TRow icon={Icon.gift} title="Offers & cashback" k="offers" tint="var(--mav-success)" divide />
          <TRow icon={Icon.sparkle} title="Tips & product updates" k="tips" tint="var(--mav-muted)" />
        </Section>
        <div style={{ padding: '0 16px' }}><div className="alert alert-primary"><Icon.info s={18} /><span>Security alerts can’t be turned off — they keep your account safe.</span></div></div>
      </div>
    </div>
  );
};

/* ── Language ──────────────────────────────────────────────────────────── */
const Language = ({ nav, app }) => {
  const [sel, setSel] = useState('en');
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Language" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 24px' }}>
        <div className="muted" style={{ fontSize: 13, padding: '0 4px 12px' }}>Choose your preferred language. Fyscal supports 10 Indian languages.</div>
        <div className="list-card">
          {DATA.LANGUAGES.map((l, i) => (
            <div className="row" key={l.id} style={{ borderTop: i ? '1px solid var(--mav-bg-secondary)' : 'none' }} onClick={() => { setSel(l.id); fx.tap(); }}>
              <div className="row-body"><div className="row-title">{l.native}</div><div className="row-sub">{l.label}</div></div>
              <span className="sim-radio" style={sel === l.id ? { borderColor: 'var(--mav-primary)' } : null}>{sel === l.id && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--mav-primary)' }} />}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="action-dock on-ios">
        <button className="btn btn-primary" onClick={() => { nav.back(); app.toast({ tone: 'success', title: 'Language updated' }); }}>Apply</button>
      </div>
    </div>
  );
};

/* ── Help center ───────────────────────────────────────────────────────── */
const Help = ({ nav, app }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Help center" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '4px 16px 24px' }}>
        <div className="input-box" style={{ padding: '12px 14px', background: '#fff', marginBottom: 16 }}>
          <span className="muted"><Icon.search s={20} /></span>
          <input placeholder="Search help articles" style={{ fontSize: 15, fontWeight: 500 }} />
        </div>

        <div className="section-hd" style={{ paddingInline: 4 }}><span className="eyebrow">Browse topics</span></div>
        <div className="qa-grid" style={{ marginBottom: 18 }}>
          {DATA.HELP_TOPICS.map((t) => (
            <button key={t.id} className="qa-btn" onClick={() => app.toast({ tone: 'info', title: t.label })}>
              <div className="qa-icon tint-primary"><span style={{ color: 'var(--mav-primary)' }}><IconBy name={t.icon} s={22} /></span></div>
              <span className="qa-label">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="section-hd" style={{ paddingInline: 4 }}><span className="eyebrow">Popular questions</span></div>
        <div className="list-card" style={{ marginBottom: 18 }}>
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

        <div className="section-hd" style={{ paddingInline: 4 }}><span className="eyebrow">Still need help?</span></div>
        <div className="list-card">
          <SRow icon={Icon.headset} title="Chat with us" sub="Avg. reply under 2 min · 24×7" tint="var(--mav-primary)" onClick={() => app.toast({ tone: 'info', title: 'Starting chat…' })} divide />
          <SRow icon={Icon.phone} title="Call support" sub="1800 200 1234 · Toll-free" tint="var(--mav-success)" onClick={() => app.toast({ tone: 'info', title: 'Calling support…' })} divide />
          <SRow icon={Icon.alertTri} title="Raise a complaint" sub="Get a tracked ticket" tint="var(--mav-warning)" onClick={() => nav.go('complaint', {})} />
        </div>
      </div>
    </div>
  );
};

/* ── Raise complaint ───────────────────────────────────────────────────── */
const Complaint = ({ nav, app }) => {
  const [cat, setCat] = useState(null);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const ticket = 'FYC' + Math.floor(100000 + Math.random() * 899999);
  if (done) {
    return (
      <div className="screen bg-white pad-top anim-fade" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="Complaint raised" onBack={() => nav.reset('home')} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
          <svg className="check-ring" viewBox="0 0 100 100" fill="none" style={{ width: 84, height: 84 }}>
            <circle cx="50" cy="50" r="44" stroke="var(--mav-success)" strokeWidth="5" />
            <path d="M30 51l13 13 27-29" stroke="var(--mav-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 16 }}>We’ve got it</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>Your complaint is logged. We’ll update you by SMS and in-app within <b style={{ color: 'var(--mav-fg)' }}>48 hours</b>.</p>
          <div className="card-flat" style={{ width: '100%', marginTop: 18, textAlign: 'left' }}>
            <div className="spread"><span className="muted" style={{ fontSize: 13 }}>Ticket no.</span><span className="num" style={{ fontWeight: 700 }}>{ticket}</span></div>
          </div>
        </div>
        <div style={{ padding: '0 20px' }}><button className="btn btn-primary" onClick={() => nav.reset('home')}>Done</button></div>
      </div>
    );
  }
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Raise a complaint" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 120px' }}>
        <div className="eyebrow" style={{ paddingLeft: 4, marginBottom: 10 }}>What’s the issue about?</div>
        <div className="stack" style={{ gap: 9 }}>
          {DATA.COMPLAINT_CATS.map((c) => (
            <button key={c} className={`reason-row ${cat === c ? 'sel' : ''}`} onClick={() => setCat(c)}>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>{c}</span>
              <span className="sim-radio" style={cat === c ? { borderColor: 'var(--mav-primary)' } : null}>{cat === c && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--mav-primary)' }} />}</span>
            </button>
          ))}
        </div>
        <div className="field" style={{ marginTop: 16 }}>
          <label className="field-label">Describe what happened</label>
          <div className="input-box" style={{ alignItems: 'flex-start' }}>
            <textarea rows={3} placeholder="Add details, transaction ID, etc." value={note} onChange={(e) => setNote(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'none', resize: 'none', width: '100%', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: 'var(--mav-fg)' }} />
          </div>
        </div>
        <div className="sec-banner" style={{ marginTop: 14 }}><span className="si"><Icon.shieldChk s={18} /></span><span className="st">Complaints are tracked under <b>RBI’s grievance redressal</b>. You’ll get a ticket number to follow up.</span></div>
      </div>
      <div className="action-dock on-ios">
        <button className="btn btn-primary" disabled={!cat} onClick={() => { fx.tap(); setDone(true); }}>Submit complaint</button>
      </div>
    </div>
  );
};

/* ── Privacy controls ──────────────────────────────────────────────────── */
const Privacy = ({ nav, app }) => {
  const [marketing, setMarketing] = useState(false);
  const [contacts, setContacts] = useState(true);
  const [del, setDel] = useState(false);
  const TRow = ({ icon: I, title, sub, on, set, tint = 'var(--mav-primary)', divide }) => (
    <div className={`row ${divide ? 'txn-divide' : ''}`} style={{ cursor: 'default' }}>
      <div className="row-ic" style={{ background: `color-mix(in srgb,${tint} 12%,#fff)`, color: tint }}><I s={20} /></div>
      <div className="row-body"><div className="row-title">{title}</div>{sub && <div className="row-sub">{sub}</div>}</div>
      <SToggle on={on} set={set} />
    </div>
  );
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Privacy controls" onBack={nav.back} />
      <div className="screen-scroll" style={{ paddingBottom: 24 }}>
        <Section label="Permissions">
          <TRow icon={Icon.contacts} title="Contacts access" sub="Pay friends by name" on={contacts} set={setContacts} divide />
          <SRow icon={Icon.cog} title="App permissions" sub="Camera, SMS, notifications" tint="var(--mav-muted)" onClick={() => app.toast({ tone: 'info', title: 'Opens system settings' })} />
        </Section>
        <Section label="Your data">
          <SRow icon={Icon.download} title="Download my data" sub="Get a copy of your account data" onClick={() => app.toast({ tone: 'success', title: 'Request received', desc: 'We’ll email a link in 24h' })} divide />
          <TRow icon={Icon.gift} title="Personalised offers" sub="Use my activity for offers" on={marketing} set={setMarketing} tint="var(--mav-success)" />
        </Section>
        <Section label="Account">
          <SRow icon={Icon.logout} title="Close account" sub="Permanently delete your Fyscal account" tint="var(--mav-danger)" onClick={() => setDel(true)} />
        </Section>
        <div style={{ padding: '0 16px' }}><div className="alert alert-primary"><Icon.shieldChk s={18} /><span>We follow the <b>DPDP Act, 2023</b>. You’re always in control of your data.</span></div></div>
      </div>
      <Dialog open={del} onClose={() => setDel(false)} tone="danger" icon={Icon.alertTri}
        title="Close your account?" desc="This permanently deletes your Fyscal account, UPI IDs and history. Settle any pending balance first. This can’t be undone."
        actions={<React.Fragment>
          <button className="btn btn-primary" style={{ background: 'var(--mav-danger)', boxShadow: 'none' }} onClick={() => { setDel(false); app.toast({ tone: 'info', title: 'Account closure requested' }); }}>Close account</button>
          <button className="btn btn-ghost" onClick={() => setDel(false)}>Keep my account</button>
        </React.Fragment>} />
    </div>
  );
};

const Appearance = ({ nav, app }) => {
  const cur = (app && app.theme) || 'light';
  const opts = [
    { id: 'light', label: 'Light', sub: 'Bright & crisp', cls: 'light' },
    { id: 'dark', label: 'Dark', sub: 'Premium graphite · OLED-friendly', cls: 'dark' },
    { id: 'system', label: 'System', sub: 'Match your device', cls: 'sys' },
  ];
  return (
    <div className="screen bg-ios pad-top anim-in">
      <AppBar title="Appearance" onBack={nav.back} />
      <div className="screen-scroll" style={{ padding: '8px 16px 24px' }}>
        <div className="muted" style={{ fontSize: 13, padding: '0 4px 12px' }}>Choose how Fyscal looks. Dark mode is designed first — calm, cinematic and easy on the eyes.</div>
        <div className="list-card">
          {opts.map((o, i) => (
            <div className="theme-opt" key={o.id} style={i ? { borderTop: '1px solid var(--mav-border)' } : null} onClick={() => app.setTheme(o.id)}>
              <span className={`theme-prev ${o.cls}`} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{o.label}</div><div className="muted" style={{ fontSize: 12.5 }}>{o.sub}</div></div>
              <span className="sim-radio" style={cur === o.id ? { borderColor: 'var(--mav-primary)' } : null}>{cur === o.id && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--mav-primary)' }} />}</span>
            </div>
          ))}
        </div>
        <div className="alert alert-primary" style={{ marginTop: 16 }}><Icon.sparkle s={18} /><span>Your choice is remembered across the app and applies instantly.</span></div>
      </div>
    </div>
  );
};

/* ── Change UPI PIN — built on shared PinDots + Keypad primitives ──────── */
const ChangeMpin = ({ nav, app }) => {
  const [stage, setStage] = useState('current'); // current | new | confirm | done
  const [pin, setPin] = useState('');
  const [first, setFirst] = useState('');
  const [err, setErr] = useState(false);
  const titles = { current: 'Enter current UPI PIN', new: 'Set a new UPI PIN', confirm: 'Confirm new UPI PIN' };
  const subs = {
    current: 'Verify it’s you before changing your PIN.',
    new: 'Choose a 6-digit PIN you don’t use elsewhere.',
    confirm: 'Re-enter the new PIN to confirm.',
  };
  const onKey = (k) => {
    if (pin.length >= 6) return;
    const next = pin + k; setPin(next); setErr(false);
    if (next.length === 6) setTimeout(() => {
      if (stage === 'current') { setPin(''); setStage('new'); }
      else if (stage === 'new') { setFirst(next); setPin(''); setStage('confirm'); }
      else { if (next === first) { fx.success(); setStage('done'); } else { setErr(true); setTimeout(() => { setPin(''); setStage('new'); setFirst(''); }, 750); } }
    }, 160);
  };

  if (stage === 'done') {
    return (
      <div className="screen bg-ios pad-top anim-fade" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom,8px))' }}>
        <AppBar title="UPI PIN changed" onBack={() => nav.back()} />
        <div className="center-col" style={{ flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
          <svg className="check-ring" viewBox="0 0 100 100" fill="none" style={{ width: 84, height: 84 }}>
            <circle cx="50" cy="50" r="44" stroke="var(--mav-success)" strokeWidth="5" /><path d="M30 51l13 13 27-29" stroke="var(--mav-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 16 }}>UPI PIN updated</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8, maxWidth: 290 }}>Your new PIN is set with {DATA.USER.bank}. Use it to authorise payments.</p>
        </div>
        <div style={{ padding: '0 20px' }}><button className="btn btn-primary" onClick={() => nav.back()}>Done</button></div>
      </div>
    );
  }
  return (
    <div className="screen bg-ios pad-top anim-in" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom,8px))' }}>
      <AppBar onBack={nav.back} />
      <div className="center-col" style={{ flex: 1, justifyContent: 'flex-start', padding: '12px 24px 0', textAlign: 'center' }}>
        <div className="auth-hero" style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--mav-bg-tertiary)', color: 'var(--mav-primary)' }}><Icon.fingerprint s={28} /></div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 14 }}>{titles[stage]}</h1>
        <p className="muted" style={{ fontSize: 14, marginTop: 8, maxWidth: 290, lineHeight: 1.5 }}>{subs[stage]}</p>
        <div style={{ marginTop: 26 }}><PinDots value={pin} error={err} /></div>
        {err && <p style={{ color: 'var(--mav-danger)', fontSize: 13, fontWeight: 700, marginTop: 14 }}>PINs didn’t match — try again.</p>}
        <div className="secure-strip" style={{ marginTop: 'auto' }}><Icon.shieldChk s={14} /> Set securely with {DATA.USER.bank} · Fyscal never sees it</div>
      </div>
      <div style={{ padding: '0 20px' }}><Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} /></div>
    </div>
  );
};

window.ProfileScreens = { Profile, EditProfile, UpiIds, BankAccounts, Settings, Devices, Notifications, Language, Appearance, Help, Complaint, Privacy, ChangeMpin };
