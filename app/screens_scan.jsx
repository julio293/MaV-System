/* ══════════════════════════════════════════════════════════════════════════
   Scan & Pay — camera viewfinder, auto-detect merchant QR
   ══════════════════════════════════════════════════════════════════════════ */
const Scan = ({ nav, app }) => {
  const [detected, setDetected] = useState(false);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setDetected(true), 2200);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    if (detected) {
      const id = setTimeout(() => nav.go('amount', { payee: { name: 'Brew & Co. Coffee', vpa: 'brewco@ybl', phone: '', merchant: true } }), 850);
      return () => clearTimeout(id);
    }
  }, [detected]);

  return (
    <div className="screen anim-fade" style={{ background: '#0d0d12' }}>
      {/* faux camera scene */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 40%, #2a2a38 0%, #0d0d12 80%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: .12, backgroundImage: 'repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 26px),repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 26px)' }} />

      <div className="pad-top" style={{ position: 'relative', zIndex: 2 }}>
        <AppBar title="Scan any QR" onBack={nav.back} tone="flush"
          right={<button className="iconbtn" style={{ color: '#fff' }} onClick={() => setFlash((f) => !f)}>
            {flash ? <Icon.bolt s={20} /> : <Icon.flash s={20} />}</button>} />
        <style>{`.appbar .ab-title{color:#fff}`}</style>
      </div>

      {/* viewfinder */}
      <div className="center-col" style={{ flex: 1, justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div className="scan-frame">
          {/* merchant QR appears */}
          <div style={{ position: 'absolute', inset: 28, display: 'grid', placeItems: 'center', background: '#fff', borderRadius: 8, opacity: detected ? 1 : .25, transition: 'opacity .4s' }}>
            <FakeQR />
          </div>
          {/* corners */}
          <div className="scan-corner" style={{ top: 0, left: 0, borderRight: 'none', borderBottom: 'none', borderTopLeftRadius: 12 }} />
          <div className="scan-corner" style={{ top: 0, right: 0, borderLeft: 'none', borderBottom: 'none', borderTopRightRadius: 12 }} />
          <div className="scan-corner" style={{ bottom: 0, left: 0, borderRight: 'none', borderTop: 'none', borderBottomLeftRadius: 12 }} />
          <div className="scan-corner" style={{ bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none', borderBottomRightRadius: 12 }} />
          {/* scan beam */}
          {!detected && <div style={{ position: 'absolute', left: 6, right: 6, height: 2, background: 'linear-gradient(90deg,transparent,var(--mav-primary),transparent)', boxShadow: '0 0 14px 2px var(--mav-primary)', animation: 'scanBeam 2s ease-in-out infinite' }} />}
        </div>
        <style>{`@keyframes scanBeam{0%{top:8px}50%{top:228px}100%{top:8px}}`}</style>
        <div style={{ color: '#fff', marginTop: 28, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
          {detected ? <><Icon.checkCircle s={18} /> Merchant found — Brew & Co.</> : <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Point at a QR code to pay</>}
        </div>
      </div>

      {/* bottom controls */}
      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px calc(28px + env(safe-area-inset-bottom,8px))', display: 'flex', gap: 10 }}>
        <button className="btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', backdropFilter: 'blur(8px)' }}
          onClick={() => app.toast({ title: 'Gallery', desc: 'Pick a QR image', tone: 'info' })}>
          <Icon.download s={18} /> Upload QR
        </button>
        <button className="btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', backdropFilter: 'blur(8px)' }}
          onClick={() => nav.go('receive')}>
          <Icon.qr s={18} /> My QR
        </button>
      </div>
    </div>
  );
};

window.ScanScreens = { Scan };
