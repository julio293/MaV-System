/* ════════════════════════════════════════════════════════════════════════
   refine.js — drop-in "Handmade"-style live design mode.
   Add to any page:  <script src="path/to/refine.js"></script>
   Press  .  to toggle design mode, click any element to refine it
   (padding · radius · colors · type · shadow), double-click text to edit.
   It injects its own UI — the host page needs no markup changes.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__refineLoaded) return; window.__refineLoaded = true;

  const ACCENT = '#352eff', ACCENT2 = '#0053ff';
  const BG = ['transparent','#ffffff','#f7f7f8','#e9eaee','#16171b','#352eff','#0053ff','#7c9dff','#1f9d57','#e23b3b','#ff8400','#fbe9e9','#e9eefb','#eafaf0','#fff6e6','#222'];
  const FG = ['#16171b','#ffffff','#76787f','#352eff','#0053ff','#1f9d57','#e23b3b','#ff8400'];
  const SHADOWS = {none:'none',sm:'0 1px 2px rgba(20,22,40,.06)',md:'0 4px 14px -4px rgba(20,22,40,.12)',lg:'0 16px 40px -12px rgba(20,22,40,.2)',xl:'0 28px 64px -16px rgba(20,22,40,.28)'};
  const RADII = {Sharp:0,Subtle:8,Rounded:16,Pill:26};

  // ── inject styles ──
  const css = `
  #hmx-root{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
  #hmx-root *{box-sizing:border-box}
  .hmx-mono{font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace}
  body.hmx-on [data-hmx-sel]{cursor:default}
  body.hmx-on *:not(#hmx-root):not(#hmx-root *):hover{outline:1.5px dashed ${ACCENT2};outline-offset:2px}
  .hmx-overlay{position:fixed;pointer-events:none;z-index:2147483640;border:2px solid ${ACCENT};border-radius:8px;display:none;box-shadow:0 0 0 4px rgba(53,46,255,.12)}
  .hmx-overlay .t{position:absolute;top:-22px;left:-2px;background:${ACCENT};color:#fff;font:600 10px ui-monospace,monospace;padding:2px 7px;border-radius:5px;white-space:nowrap}
  .hmx-toggle{position:fixed;left:18px;bottom:18px;z-index:2147483646;display:flex;align-items:center;gap:9px;background:#16171b;color:#fff;font-size:12.5px;font-weight:600;padding:10px 15px;border:none;border-radius:999px;cursor:pointer;box-shadow:0 16px 40px -12px rgba(20,22,40,.4)}
  .hmx-toggle .d{width:8px;height:8px;border-radius:50%;background:#5b5b66;transition:.2s}
  .hmx-toggle.on .d{background:#9affc0;box-shadow:0 0 8px #9affc0}
  .hmx-toggle kbd{font:11px ui-monospace,monospace;background:rgba(255,255,255,.16);border-radius:4px;padding:1px 5px}
  .hmx-panel{position:fixed;top:0;right:0;width:300px;height:100vh;background:#fff;border-left:1px solid #e9eaee;z-index:2147483645;overflow-y:auto;transform:translateX(100%);transition:transform .26s cubic-bezier(.2,.8,.2,1);box-shadow:-12px 0 40px -20px rgba(0,0,0,.25)}
  .hmx-panel.show{transform:translateX(0)}
  .hmx-head{padding:15px 16px;border-bottom:1px solid #e9eaee;position:sticky;top:0;background:#fff;z-index:2}
  .hmx-htop{display:flex;align-items:center;gap:8px}
  .hmx-title{font-size:13px;font-weight:700;flex:1;color:#16171b}
  .hmx-tag{font:10px ui-monospace,monospace;background:#f7f7f8;border:1px solid #dfe1e6;border-radius:5px;padding:2px 7px;color:${ACCENT}}
  .hmx-ibtn{width:26px;height:26px;border-radius:7px;border:1px solid #dfe1e6;background:#fff;cursor:pointer;display:grid;place-items:center;color:#76787f;font-size:13px}
  .hmx-ibtn:hover{border-color:#a6a8af}
  .hmx-sub{font-size:12px;color:#76787f;margin-top:6px}
  .hmx-body{padding:4px 16px 26px}
  .hmx-empty{padding:54px 22px;text-align:center;color:#a6a8af;font-size:13px;line-height:1.55}
  .hmx-ctrl{padding:15px 0;border-bottom:1px solid #eef0f3}
  .hmx-ctrl:last-child{border-bottom:none}
  .hmx-lbl{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:600;color:#16171b;margin-bottom:10px}
  .hmx-val{font:500 11px ui-monospace,monospace;color:#76787f}
  .hmx-range{-webkit-appearance:none;width:100%;height:4px;border-radius:3px;background:#dfe1e6;outline:none}
  .hmx-range::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${ACCENT};cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)}
  .hmx-chips{display:flex;gap:6px;flex-wrap:wrap}
  .hmx-ch{font:600 11.5px ui-monospace,monospace;padding:6px 10px;border-radius:8px;border:1px solid #dfe1e6;background:#fff;cursor:pointer;color:#16171b}
  .hmx-ch:hover{border-color:#a6a8af}
  .hmx-ch.on{background:${ACCENT};color:#fff;border-color:${ACCENT}}
  .hmx-pal{display:grid;grid-template-columns:repeat(8,1fr);gap:7px}
  .hmx-pal button{aspect-ratio:1;border-radius:7px;border:1px solid #dfe1e6;cursor:pointer;position:relative;padding:0}
  .hmx-pal button.on::after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 2px #fff,0 0 0 4px ${ACCENT}}
  .hmx-status{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:2147483646;display:flex;align-items:center;gap:9px;background:#16171b;color:#fff;font-size:12.5px;padding:9px 15px;border-radius:999px;box-shadow:0 16px 40px -12px rgba(20,22,40,.4);opacity:0;pointer-events:none;transition:.2s}
  .hmx-status.show{opacity:1}
  .hmx-status .p{width:7px;height:7px;border-radius:50%;background:#9affc0;box-shadow:0 0 8px #9affc0}
  [contenteditable=true]{outline:2px solid ${ACCENT2}!important;outline-offset:2px;cursor:text!important}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  // ── inject UI ──
  const root = document.createElement('div'); root.id = 'hmx-root';
  root.innerHTML = `
    <button class="hmx-toggle" id="hmxToggle"><span class="d"></span>Design mode <kbd>.</kbd></button>
    <div class="hmx-status" id="hmxStatus"><span class="p"></span>Click an element · <kbd>esc</kbd> to exit</div>
    <div class="hmx-overlay" id="hmxOverlay"><span class="t" id="hmxOvTag"></span></div>
    <aside class="hmx-panel" id="hmxPanel">
      <div class="hmx-head">
        <div class="hmx-htop">
          <span class="hmx-title">Inspector</span>
          <span class="hmx-tag" id="hmxTag" style="display:none"></span>
          <button class="hmx-ibtn" id="hmxParent" title="Select parent" style="display:none">↑</button>
        </div>
        <div class="hmx-sub" id="hmxSub">Nothing selected</div>
      </div>
      <div id="hmxContent"><div class="hmx-empty">Click any element on the page to refine its padding, radius, colors, type and shadow.</div></div>
    </aside>`;
  document.body.appendChild(root);

  const $ = id => document.getElementById(id);
  const toggle = $('hmxToggle'), statusEl = $('hmxStatus'), overlay = $('hmxOverlay'), ovTag = $('hmxOvTag'),
        panel = $('hmxPanel'), tagEl = $('hmxTag'), subEl = $('hmxSub'), contentEl = $('hmxContent'), parentBtn = $('hmxParent');

  let on = false, selected = null;
  const original = new WeakMap();
  const px = v => Math.round(parseFloat(v) || 0);

  function inUI(el){ return !el || el === document.body || el === document.documentElement || (el.closest && el.closest('#hmx-root')); }

  function setOn(v){
    on = v;
    document.body.classList.toggle('hmx-on', v);
    toggle.classList.toggle('on', v);
    statusEl.classList.toggle('show', v);
    if (!v) deselect();
  }
  function remember(el){ if (!original.has(el)) original.set(el, el.getAttribute('style') || ''); }

  function tagOf(el){ return el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''); }

  function select(el){
    if (inUI(el)) return;
    selected = el; remember(el);
    const t = tagOf(el); ovTag.textContent = t; tagEl.textContent = t; tagEl.style.display = ''; parentBtn.style.display = '';
    subEl.textContent = 'Editing styles · live';
    panel.classList.add('show');
    position(); build(el);
  }
  function deselect(){ selected = null; overlay.style.display = 'none'; tagEl.style.display = 'none'; parentBtn.style.display = 'none'; subEl.textContent = 'Nothing selected'; panel.classList.remove('show'); }

  function position(){
    if (!selected) { overlay.style.display = 'none'; return; }
    const r = selected.getBoundingClientRect();
    overlay.style.display = 'block';
    overlay.style.top = r.top + 'px'; overlay.style.left = r.left + 'px';
    overlay.style.width = r.width + 'px'; overlay.style.height = r.height + 'px';
    overlay.style.borderRadius = getComputedStyle(selected).borderRadius;
  }
  function apply(prop, val){ if (!selected) return; selected.style[prop] = val; position(); }

  function build(el){
    const cs = getComputedStyle(el);
    const pad = px(cs.paddingTop), rad = px(cs.borderTopLeftRadius), fs = px(cs.fontSize),
          lh = (parseFloat(cs.lineHeight) / (parseFloat(cs.fontSize) || 16)) || 1.4,
          ls = parseFloat(cs.letterSpacing) || 0, fw = cs.fontWeight;
    contentEl.innerHTML = `
      <div class="hmx-body">
        <div class="hmx-ctrl"><div class="hmx-lbl">Padding <span class="hmx-val" id="vP">${pad}px</span></div><input type="range" class="hmx-range" id="cP" min="0" max="64" value="${pad}"></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Radius <span class="hmx-val" id="vR">${rad}px</span></div><input type="range" class="hmx-range" id="cR" min="0" max="60" value="${rad}" style="margin-bottom:10px"><div class="hmx-chips" id="cRc">${Object.entries(RADII).map(([k,v])=>`<button class="hmx-ch" data-r="${v}">${k}</button>`).join('')}</div></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Background</div><div class="hmx-pal" id="pBg">${BG.map(c=>`<button data-c="${c}" style="background:${c==='transparent'?'repeating-conic-gradient(#ddd 0% 25%,#fff 0% 50%) 50%/10px 10px':c}"></button>`).join('')}</div></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Text color</div><div class="hmx-pal" id="pFg">${FG.map(c=>`<button data-c="${c}" style="background:${c}"></button>`).join('')}</div></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Font size <span class="hmx-val" id="vF">${fs}px</span></div><input type="range" class="hmx-range" id="cF" min="9" max="72" value="${fs}"></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Font weight</div><div class="hmx-chips" id="cW">${[400,500,600,700,800].map(w=>`<button class="hmx-ch ${String(fw)===String(w)?'on':''}" data-w="${w}">${w}</button>`).join('')}</div></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Line height <span class="hmx-val" id="vL">${lh.toFixed(2)}</span></div><input type="range" class="hmx-range" id="cL" min="1" max="2.4" step="0.05" value="${lh.toFixed(2)}"></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Letter spacing <span class="hmx-val" id="vLs">${ls.toFixed(1)}px</span></div><input type="range" class="hmx-range" id="cLs" min="-2" max="8" step="0.1" value="${ls}"></div>
        <div class="hmx-ctrl"><div class="hmx-lbl">Shadow</div><div class="hmx-chips" id="cS">${Object.keys(SHADOWS).map(k=>`<button class="hmx-ch" data-s="${k}">${k}</button>`).join('')}</div></div>
        <div class="hmx-ctrl"><button class="hmx-ch" id="cReset" style="width:100%;padding:9px;text-align:center;color:#e23b3b;border-color:#f3c9c9">Reset this element</button></div>
      </div>`;
    $('cP').oninput = e => { apply('padding', e.target.value+'px'); $('vP').textContent = e.target.value+'px'; };
    $('cR').oninput = e => { apply('borderRadius', e.target.value+'px'); $('vR').textContent = e.target.value+'px'; };
    $('cRc').onclick = e => { const b = e.target.closest('[data-r]'); if(!b) return; apply('borderRadius', b.dataset.r+'px'); $('cR').value = b.dataset.r; $('vR').textContent = b.dataset.r+'px'; };
    $('cF').oninput = e => { apply('fontSize', e.target.value+'px'); $('vF').textContent = e.target.value+'px'; };
    $('cL').oninput = e => { apply('lineHeight', e.target.value); $('vL').textContent = parseFloat(e.target.value).toFixed(2); };
    $('cLs').oninput = e => { apply('letterSpacing', e.target.value+'px'); $('vLs').textContent = parseFloat(e.target.value).toFixed(1)+'px'; };
    $('cW').onclick = e => { const b = e.target.closest('[data-w]'); if(!b) return; apply('fontWeight', b.dataset.w); [...e.currentTarget.children].forEach(c=>c.classList.toggle('on',c===b)); };
    $('cS').onclick = e => { const b = e.target.closest('[data-s]'); if(!b) return; apply('boxShadow', SHADOWS[b.dataset.s]); [...e.currentTarget.children].forEach(c=>c.classList.toggle('on',c===b)); };
    $('pBg').onclick = e => { const b = e.target.closest('[data-c]'); if(!b) return; apply('background', b.dataset.c); mark($('pBg'),b); };
    $('pFg').onclick = e => { const b = e.target.closest('[data-c]'); if(!b) return; apply('color', b.dataset.c); mark($('pFg'),b); };
    $('cReset').onclick = () => { const s = original.get(selected); if (s) selected.setAttribute('style', s); else selected.removeAttribute('style'); build(selected); position(); };
  }
  function mark(group, btn){ [...group.children].forEach(c=>c.classList.toggle('on',c===btn)); }

  // ── events ──
  document.addEventListener('click', e => {
    if (!on || inUI(e.target)) return;
    if (e.target.getAttribute('contenteditable') === 'true') return;
    e.preventDefault(); e.stopPropagation(); select(e.target);
  }, true);

  document.addEventListener('dblclick', e => {
    if (!on || inUI(e.target)) return;
    const el = e.target;
    if (el.children.length > 0 || !el.textContent.trim()) return;   // leaf text only
    e.preventDefault();
    remember(el);
    el.setAttribute('contenteditable', 'true'); el.focus();
    const sel = window.getSelection(), range = document.createRange();
    range.selectNodeContents(el); sel.removeAllRanges(); sel.addRange(range);
    const stop = () => { el.removeAttribute('contenteditable'); el.removeEventListener('blur', stop); if (selected === el) position(); };
    el.addEventListener('blur', stop);
  }, true);

  parentBtn.onclick = () => { if (selected && selected.parentElement && !inUI(selected.parentElement)) select(selected.parentElement); };
  toggle.onclick = () => setOn(!on);
  window.addEventListener('scroll', position, true);
  window.addEventListener('resize', position);

  document.addEventListener('keydown', e => {
    const editing = document.activeElement && document.activeElement.getAttribute('contenteditable') === 'true';
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
    if (e.key === '.' && !editing && !typing) { e.preventDefault(); setOn(!on); }
    if (e.key === 'Escape') { if (editing) document.activeElement.blur(); else if (selected) deselect(); else if (on) setOn(false); }
  });
})();
