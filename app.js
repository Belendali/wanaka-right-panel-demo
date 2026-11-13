/* Wanaka Studio · right panel demo
 * Every screen is the Figma frame from section "1112" (file PWtgAaGdl6znpuQykrnIbb), exported at 2x.
 * Hotspot rectangles are measured from the Figma nodes (1920×1080 frame space).
 * The chat composer, the Create Game / Create Asset guide and the Use-in-Chat chip are live HTML on top.
 */

const W = 1920, H = 1080;

// ---------- screens ----------
const GROUPS = [
  ['Chat', [['chat-blank', 'New chat'], ['chat', 'Chat'], ['chat-history', 'Chat history']]],
  ['Build & Preview', [['build', 'Build'], ['preview', 'Preview'], ['fullscreen', 'Full screen']]],
  ['Plan mode', [['plan-open', 'Plan open'], ['plan-check', 'Plan check'], ['plan-done', 'Plan done']]],
  ['Scene', [['scene-objects', 'Objects'], ['scene-scenes', 'Scenes'], ['scene-menu', 'Scene menu'], ['object-menu', 'Object menu']]],
  ['Adjust', [['adjust-global', 'Nothing selected'], ['adjust-object', 'Object selected']]],
  ['Tools', [['tools-home', 'Tools home'], ['tools-seasons', 'Seasons'], ['tools-useinchat', 'Use in Chat']]],
  ['Tools · Create', [['create-character', 'Character'], ['create-mywana', 'My Wana'], ['create-mywana-modal', 'Create your Wana'], ['create-3d', '3D'], ['create-2d', '2D & UI'], ['create-audio', 'Audio'], ['create-animation', 'Animation']]],
  ['Tools · Assets', [['assets-store', 'Store'], ['assets-my', 'My assets'], ['assets-project', 'Project files'], ['assets-prefabs', 'Prefabs']]],
  ['Tools · Gameplay', [['gp-actions', 'Actions'], ['gp-equipment', 'Equipment'], ['gp-interface', 'Interface']]],
  ['Tools · World', [['world-pcg', 'Procedural World'], ['world-weather', 'Weather'], ['world-seasons', 'Seasons'], ['world-time', 'Time']]],
  ['Tools · Look & Camera', [['look-style', 'Visual Style'], ['look-vfx', 'VFX'], ['look-camera', 'Camera Sequences']]],
];
const ORDER = GROUPS.flatMap(([, s]) => s.map(([id]) => id));
const LABEL = Object.fromEntries(GROUPS.flatMap(([g, s]) => s.map(([id, l]) => [id, `${g} · ${l}`])));

// ---------- shared hotspots ----------
// The demo opens on a single New Chat. The other chats (Fish Game, Create audio, …) only exist
// after "+" is pressed or a plan is built; until then Build / Chat return to the New Chat.
let hasChats = false;
const CHATS = ['chat', 'build', 'chat-history', 'plan-done'];
const home = (withChats) => () => hasChats ? withChats : 'chat-blank';

// Build / Preview is a mode of the top bar, not a screen: switching it keeps the right panel as it is.
// Each Figma frame was drawn in one mode; when the live mode differs, the left part of the top bar
// is painted from the matching reference frame (build.jpg / preview.jpg — identical everywhere else).
let mode = 'build';
const BAKED = { build: 'build', fullscreen: 'build', 'adjust-global': 'build', 'adjust-object': 'build' };
const NO_BAR = new Set(['plan-open', 'plan-check', 'plan-done', 'create-mywana-modal']); // dimmed modals
const bakedMode = id => BAKED[id] || 'preview';
let lastPanel = 'chat-blank';
const TOP = [
  { r: [60, 9, 100, 26], mode: 'build', label: 'Build' },
  { r: [160, 9, 100, 26], mode: 'preview', label: 'Preview' },
  { r: [1886, 8, 26, 26], go: 'fullscreen', label: 'Hide panel' },
];
const TABS = [
  { r: [1534, 58, 93, 26], go: home('chat'), label: 'Chat tab' },
  { r: [1627, 58, 93, 26], go: 'scene-objects', label: 'Scene tab' },
  { r: [1720, 58, 93, 26], go: 'adjust-global', label: 'Adjust tab' },
  { r: [1813, 58, 93, 26], go: 'tools-home', label: 'Tools tab' },
];
const CHAT_HEAD = [
  { r: [1855, 115, 24, 24], go: () => current === 'chat-blank' ? 'chat' : 'chat-blank', label: 'New chat' },
  { r: [1887, 115, 24, 24], go: 'chat-history', label: 'Chat history' },
];
const BACK = { r: [1532, 98, 230, 40], go: 'tools-home', label: 'Back to Tools', cls: 'flat' };
const BASE = [...TOP, ...TABS];
const useInChat = (y, chip, msg) => ({ r: [1532, y, 376, 38], go: 'tools-useinchat', ctx: chip ? { chip, msg } : null, label: 'Use in Chat' });
const generate = (y, prompt) => ({ r: [1532, y, 376, 38], go: 'chat-blank', ctx: { prefill: prompt }, label: 'Generate' });

// composer: placeholder + send live on these screens
const COMPOSER = new Set(['build', 'preview', 'chat-blank', 'chat', 'chat-history', 'tools-useinchat']);

// ---------- per-screen hotspots ----------
const T = (x, y, h = 56) => [x, y, 120, h];
const HS = {
  'build': [...BASE, ...CHAT_HEAD],
  'preview': [...BASE, ...CHAT_HEAD],
  'fullscreen': [TOP[0], TOP[1], { r: [1886, 8, 26, 26], go: () => lastPanel, label: 'Show panel' }],
  'chat-blank': [...BASE, ...CHAT_HEAD],
  'chat': [...BASE, ...CHAT_HEAD],
  'chat-history': [
    { r: [0, 0, W, H], go: 'chat', cls: 'backdrop' },
    ...BASE,
    { r: [1540, 236, 360, 40], go: 'chat', label: 'Fish Game' },
    { r: [1540, 278, 330, 40], go: 'chat', label: 'Create audio' },
    { r: [1540, 320, 360, 40], go: 'chat', label: 'Create cat character' },
    { r: [1540, 392, 360, 40], go: 'chat', label: 'Jump Jump game' },
    { r: [1540, 434, 360, 40], go: 'chat', label: 'Forest background' },
    { r: [1540, 506, 360, 40], go: 'chat', label: 'Space shooter' },
    { r: [1540, 548, 360, 40], go: 'chat', label: 'Pixel coins' },
  ],
  'scene-objects': [
    ...BASE,
    { r: [1528, 104, 92, 34], go: 'scene-scenes', label: 'Scene switcher' },
    { r: [1532, 320, 376, 32], go: 'adjust-object', label: 'Fisher → Adjust' },
    { r: [1532, 352, 376, 32], go: 'object-menu', label: 'Fishing Rod menu' },
  ],
  'scene-scenes': [
    ...BASE,
    { r: [1528, 104, 92, 34], go: 'scene-objects', label: 'Collapse scenes' },
    { r: [1532, 142, 376, 32], go: 'scene-objects', label: 'Scene 1' },
    { r: [1532, 174, 376, 32], go: 'scene-menu', label: 'Scene 2 menu' },
    { r: [1532, 206, 376, 32], go: 'scene-menu', label: 'Scene 3 menu' },
    { r: [1532, 424, 376, 32], go: 'adjust-object', label: 'Fisher → Adjust' },
    { r: [1532, 456, 376, 32], go: 'object-menu', label: 'Fishing Rod menu' },
  ],
  'scene-menu': [{ r: [0, 0, W, H], go: 'scene-scenes', cls: 'backdrop' }, ...BASE,
    { r: [1594, 206, 192, 136], go: 'scene-scenes', label: 'Menu item' }],
  'object-menu': [{ r: [0, 0, W, H], go: 'scene-objects', cls: 'backdrop' }, ...BASE,
    { r: [1674, 380, 190, 228], go: 'scene-objects', label: 'Menu item' }],
  // Adjust: nothing selected shows global game settings; click the object in the viewport to select it
  // and adjust its own properties; click empty viewport to deselect.
  'adjust-global': [...BASE, { r: [716, 530, 116, 66], go: 'adjust-object', label: 'Select object' }],
  'adjust-object': [
    { r: [12, 56, 1508, 1012], go: 'adjust-global', cls: 'backdrop', label: 'Deselect' },
    ...BASE,
    { r: [656, 476, 304, 176], go: 'adjust-object', cls: 'flat', label: 'Selected object' },
  ],
  'tools-home': [
    ...BASE,
    { r: T(1532, 174), go: 'create-character', label: 'Character' },
    { r: T(1660, 174), go: 'create-mywana', label: 'My Wana' },
    { r: T(1788, 174), go: 'create-3d', label: '3D' },
    { r: T(1532, 238), go: 'create-2d', label: '2D & UI' },
    { r: T(1660, 238), go: 'create-audio', label: 'Audio' },
    { r: T(1788, 238), go: 'create-animation', label: 'Animation' },
    { r: T(1532, 354), go: 'assets-store', label: 'Store' },
    { r: T(1660, 354), go: 'assets-my', label: 'My assets' },
    { r: T(1788, 354), go: 'assets-project', label: 'Project files' },
    { r: T(1532, 418), go: 'assets-prefabs', label: 'Prefabs' },
    { r: T(1532, 534), go: 'gp-actions', label: 'Actions' },
    { r: T(1660, 534), go: 'gp-equipment', label: 'Equipment' },
    { r: T(1788, 534), go: 'gp-interface', label: 'Interface' },
    { r: T(1532, 650, 68), go: 'world-pcg', label: 'Procedural World' },
    { r: T(1660, 650, 68), go: 'world-weather', label: 'Weather' },
    { r: T(1788, 650, 68), go: 'tools-seasons', label: 'Seasons' },
    { r: T(1532, 726), go: 'world-time', label: 'Time' },
    { r: T(1532, 842, 68), go: 'look-style', label: 'Visual Style' },
    { r: T(1660, 842, 68), go: 'look-vfx', label: 'VFX' },
    { r: T(1788, 842, 68), go: 'look-camera', label: 'Camera Sequences' },
  ],
  'tools-seasons': [...BASE, BACK, useInChat(662)],
  'world-seasons': [...BASE, BACK, useInChat(662)],
  'tools-useinchat': [...BASE, ...CHAT_HEAD],
  'create-character': [...BASE, BACK, generate(227, ['Create a ', ['style'], ' character: ', ['description'], '.'])],
  'create-3d': [...BASE, BACK, generate(211, ['Create a 3D ', ['object'], ' in ', ['style'], ' style.'])],
  'create-2d': [...BASE, BACK, generate(227, ['Create a 2D ', ['sprite / background / icon'], ' of ', ['subject'], '.'])],
  'create-audio': [...BASE, BACK, generate(227, ['Create ', ['music / sound effect'], ' for ', ['moment'], '.'])],
  'create-animation': [...BASE, BACK, generate(227, ['Make ', ['object'], ' ', ['walk / jump / spin'], '.'])],
  'create-mywana': [
    ...BASE, BACK,
    { r: [1532, 226, 184, 200], go: 'create-mywana-modal', label: 'Create New Wana' },
    { r: [1778, 264, 114, 37], go: 'create-mywana-modal', label: 'Edit' },
    { r: [1868, 236, 24, 24], go: 'create-mywana', label: 'More', cls: 'flat' },
  ],
  'create-mywana-modal': [
    { r: [0, 0, W, H], go: 'create-mywana', cls: 'backdrop' },
    { r: [510, 181, 1000, 718], go: null, cls: 'backdrop' },
    { r: [1456, 190, 40, 40], go: 'create-mywana', label: 'Close' },
    { r: [1320, 836, 86, 40], go: 'create-mywana', label: 'Cancel' },
    { r: [1416, 836, 70, 40], go: 'create-mywana', label: 'Save' },
  ],
  'assets-store': [...BASE, BACK],
  'assets-my': [...BASE, BACK],
  'assets-project': [...BASE, BACK],
  'assets-prefabs': [...BASE, BACK],
  'gp-actions': [...BASE, BACK, useInChat(678, 'Move & jump · Actions', 'Give the player move & jump: walk, run and jump with a smooth follow camera.')],
  'gp-equipment': [...BASE, BACK, useInChat(606, 'Pick up & equip · Equipment', 'Let the player walk over an item to pick it up and hold it.')],
  'gp-interface': [...BASE, BACK, useInChat(678, 'Gameplay HUD · Interface', 'Add a gameplay HUD: score, health and timer around the screen.')],
  'look-style': [...BASE, BACK],
  'look-vfx': [...BASE, BACK, useInChat(790, 'Weapon fire · VFX', 'Add muzzle flash and sparks each time the player shoots.')],
  'look-camera': [...BASE, BACK, useInChat(662, 'Hero reveal · Camera Sequences', 'Add a hero reveal: the camera circles in and lands behind the player.')],
  'world-pcg': [...BASE, BACK, useInChat(718, 'Forest · Procedural World', 'Generate a forest world: rolling hills covered in mixed woodland.')],
  'world-weather': [...BASE, BACK, useInChat(774, 'Clear · Weather', 'Set the weather to clear: bright blue sky with a few soft clouds.')],
  'world-time': [...BASE, BACK, useInChat(646, 'Morning · Time', 'Set the time of day to morning: low warm sun and long soft shadows.')],
  'plan-open': [{ r: [0, 0, W, H], go: 'plan-check', cls: 'backdrop', label: 'Open the plan' }],
  'plan-check': [
    { r: [0, 0, W, H], go: null, cls: 'backdrop' },
    { r: [1672, 925, 128, 38], go: 'plan-done', label: 'Start building' },
    { r: [1574, 925, 88, 38], go: 'chat-blank', label: 'Cancel' },
    { r: [755, 907, 160, 38], act: 'regen', label: 'Regenerate cover' },
  ],
  'plan-done': [
    { r: [0, 0, W, H], go: 'build', cls: 'backdrop' },
    { r: [1544, 366, 301, 32], go: 'plan-check', label: 'Open plan' },
  ],
};
// Seasons tile on Tools home goes to the Tools · Seasons frame; World · Seasons stays reachable from the list.

// ---------- Create Game / Create Asset prompts (Figma "Guide prompts") ----------
const GUIDE = [
  { key: 'game', title: 'Create Game', icon: 'game', prompts: [
    ['From an idea', ['Make a game where you ', ['action'], ' to ', ['goal'], '.']],
    ['From image or video', ['Make a game from ', ['image / video'], '.']],
    ['Runner', ['Make a runner: dodge ', ['obstacles'], ', collect ', ['items'], '.']],
    ['Platformer', ['Make a platformer: jump to reach ', ['goal'], '.']],
    ['Puzzle', ['Make a puzzle: ', ['match / move'], ' ', ['pieces'], ' to win.']],
    ['Shooter', ['Make a shooter: hit ', ['targets'], ' in time.']],
  ] },
  { key: 'asset', title: 'Create Asset', icon: 'asset', prompts: [
    ['Character', ['Create a ', ['style'], ' character: ', ['description'], '.']],
    ['3D model', ['Create a 3D ', ['object'], ' in ', ['style'], ' style.']],
    ['2D', ['Create a 2D ', ['sprite / background / icon'], ' of ', ['subject'], '.']],
    ['Animation', ['Make ', ['object'], ' ', ['walk / jump / spin'], '.']],
    ['Sound', ['Create ', ['music / sound effect'], ' for ', ['moment'], '.']],
  ] },
];
const ICON = {
  game: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 6.5H9a7 7 0 0 0 0 14h6a7 7 0 0 0 0-14Z" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/><circle cx="14.7" cy="11.5" r="1.5" fill="#fff"/><circle cx="18.3" cy="15.1" r="1.5" fill="#fff"/><path d="M6 13.5h5M12 3.5v3M8.5 11v5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>',
  asset: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12v9.6M20.4 7.2 12.09 12M4.2 7.2 12.51 12" stroke="#fff" stroke-width="1.4"/><path d="M7.85 4.5 4.19 6.65a1.2 1.2 0 0 0-.59 1.04v8.63c0 .42.22.82.59 1.03l3.66 2.15 3.64 2.14c.38.22.84.22 1.22 0l3.64-2.14 3.66-2.15c.37-.21.59-.61.59-1.03V7.69c0-.43-.22-.82-.59-1.04L16.35 4.5l-3.64-2.14a1.2 1.2 0 0 0-1.22 0L7.85 4.5Z" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chev: '<svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 6 8 10 4 6" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="#fff" stroke-opacity=".7" stroke-width=".875" stroke-linecap="round"/></svg>',
};

// ---------- state ----------
const stage = document.getElementById('stage');
const layer = document.getElementById('layer');
const shots = [document.getElementById('shotA'), document.getElementById('shotB')];
let front = 0;
let current = null;
let target = null;       // screen whose image should end up visible
let ctx = null;          // context passed by the hotspot that opened this screen
let guideOpen = null;    // which guide item is expanded on New chat
let draft = null;        // composer content to restore when re-rendering
let timer = null;

const VER = 2;
const src = id => `img/${id}.jpg?v=${VER}`;
const cache = {};
function preload(id) {
  if (!cache[id]) { const im = new Image(); im.decoding = 'async'; im.src = src(id); cache[id] = im; }
  return cache[id];
}

// ---------- layout ----------
function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  stage.style.transform = `translate(${(innerWidth - W * s) / 2}px, ${(innerHeight - H * s) / 2}px) scale(${s})`;
}
addEventListener('resize', fit);

// ---------- navigation ----------
function go(id, nextCtx = null, push = true) {
  if (!HS[id]) id = 'chat-blank';
  if (CHATS.includes(id)) hasChats = true;
  if (id === 'build' || id === 'preview') mode = bakedMode(id);
  if (id !== 'fullscreen' && !NO_BAR.has(id)) lastPanel = id;
  target = id;
  if (id !== current) {
    const im = preload(id);
    const show = () => {
      if (target !== id) return;           // a later click already moved on
      const back = shots[1 - front];
      back.src = im.src;
      back.classList.add('on');
      shots[front].classList.remove('on');
      front = 1 - front;
    };
    im.complete ? show() : im.addEventListener('load', show, { once: true });
  }
  if (id !== 'chat-blank') guideOpen = null;
  if (id !== current) draft = null;
  current = id; ctx = nextCtx;
  if (push && location.hash.slice(1) !== id) history.pushState(null, '', '#' + id);
  render();
  markList();
  clearTimeout(timer);
  if (id === 'plan-open') timer = setTimeout(() => current === 'plan-open' && go('plan-check'), 2600);
  // warm neighbours
  (HS[id] || []).forEach(h => h.go && preload(typeof h.go === 'function' ? h.go() : h.go));
}

addEventListener('popstate', () => go(location.hash.slice(1) || 'chat-blank', null, false));

// ---------- render overlays ----------
function box(el, [x, y, w, h]) {
  Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
  return el;
}

function render() {
  layer.replaceChildren();
  const id = current;

  // live HTML first, hotspots on top only where they do not cover it
  const hs = HS[id] || [];
  hs.filter(h => (h.cls || '').includes('backdrop')).forEach(addHot);

  if (!NO_BAR.has(id) && bakedMode(id) !== mode) {
    const bar = box(document.createElement('div'), [0, 0, 1420, 44]);
    bar.className = 'patch';
    Object.assign(bar.style, { background: `url("${src(mode)}") 0 0 / ${W}px ${H}px no-repeat` });
    layer.appendChild(bar);
  }

  if (id === 'chat-blank') renderGuide();
  if (COMPOSER.has(id)) renderComposer(id);

  hs.filter(h => !(h.cls || '').includes('backdrop')).forEach(addHot);
}

function addHot(h) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'hs ' + (h.cls || '');
  if (h.label) b.setAttribute('aria-label', h.label); else b.tabIndex = -1;
  box(b, h.r);
  b.addEventListener('click', e => {
    e.stopPropagation();
    if (h.act === 'regen') return regen();
    if (h.mode) { mode = h.mode; return render(); }
    const to = typeof h.go === 'function' ? h.go() : h.go;
    if (to) go(to, h.ctx || null); else flash();
  });
  if (h.label && /menu/i.test(h.label)) b.addEventListener('contextmenu', e => { e.preventDefault(); go(h.go); });
  layer.appendChild(b);
}

function renderGuide() {
  layer.appendChild(box(Object.assign(document.createElement('div'), { className: 'patch panel' }), [1588, 504, 264, 126]));
  const g = document.createElement('div');
  g.className = 'guide';
  Object.assign(g.style, { left: '1590px', top: '506px' });
  GUIDE.forEach(item => {
    const it = document.createElement('div');
    it.className = 'gitem' + (guideOpen === item.key ? ' open' : '');
    const head = document.createElement('button');
    head.className = 'ghead';
    head.type = 'button';
    head.setAttribute('aria-expanded', guideOpen === item.key);
    head.innerHTML = `<span>${ICON[item.icon]}${item.title}</span>${ICON.chev}`;
    head.addEventListener('click', () => { guideOpen = guideOpen === item.key ? null : item.key; draft = getDraft(); render(); });
    const list = document.createElement('div');
    list.className = 'gprompts';
    item.prompts.forEach(([label, tpl]) => {
      const p = document.createElement('button');
      p.type = 'button'; p.textContent = label;
      p.addEventListener('click', () => { fillComposer(tpl); });
      list.appendChild(p);
    });
    it.append(head, list);
    g.appendChild(it);
  });
  layer.appendChild(g);
}

let composerEl = null;
function renderComposer(id) {
  const override = id === 'tools-useinchat' && ctx && ctx.chip;
  const top = override ? 948 : 950;
  if (override) {
    layer.appendChild(box(Object.assign(document.createElement('div'), { className: 'patch composer' }), [1538, 910, 364, 104]));
    const chip = document.createElement('div');
    chip.className = 'uchip';
    Object.assign(chip.style, { left: '1544px', top: '916px' });
    chip.innerHTML = `<span></span><button type="button" aria-label="Remove">${ICON.x}</button>`;
    chip.firstChild.textContent = ctx.chip;
    chip.querySelector('button').addEventListener('click', () => { ctx = { ...ctx, chip: null, removed: true }; draft = getDraft(); render(); });
    layer.appendChild(chip);
  } else if (id === 'tools-useinchat' && ctx && ctx.removed) {
    layer.appendChild(box(Object.assign(document.createElement('div'), { className: 'patch composer' }), [1538, 910, 364, 104]));
  } else if (id !== 'tools-useinchat') {
    layer.appendChild(box(Object.assign(document.createElement('div'), { className: 'patch composer' }), [1538, 946, 356, 64]));
  } else {
    // native Seasons frame: keep Figma pixels, only make send work
    composerEl = null;
    addHot({ r: [1866, 1022, 26, 26], go: 'chat', label: 'Send' });
    return;
  }
  const c = document.createElement('div');
  c.className = 'composer';
  c.contentEditable = 'true';
  c.setAttribute('role', 'textbox');
  c.setAttribute('aria-label', 'Chat input');
  c.dataset.placeholder = 'Ask, plan, build anything...';
  box(c, [1544, top, 348, 60]);
  if (override && !draft) draft = textNodes([ctx.msg]);
  if (draft) c.replaceChildren(...draft);
  c.addEventListener('keydown', onComposerKey);
  c.addEventListener('click', e => e.stopPropagation());
  layer.appendChild(c);
  composerEl = c;
  const sendBtn = box(Object.assign(document.createElement('button'), { type: 'button', className: 'hs' }), [1866, 1022, 26, 26]);
  sendBtn.setAttribute('aria-label', 'Send');
  sendBtn.addEventListener('click', e => { e.stopPropagation(); send(); });
  layer.appendChild(sendBtn);
  if (ctx && ctx.prefill && id === 'chat-blank') { fillComposer(ctx.prefill); ctx = null; }
}

function textNodes(parts) {
  return parts.map(p => {
    if (Array.isArray(p)) {
      const s = document.createElement('span');
      s.className = 'fld'; s.textContent = '[' + p[0] + ']';
      return s;
    }
    return document.createTextNode(p);
  });
}
function getDraft() {
  return composerEl ? [...composerEl.childNodes].map(n => n.cloneNode(true)) : null;
}
function fillComposer(tpl) {
  if (!composerEl) return;
  composerEl.replaceChildren(...textNodes(tpl));
  composerEl.focus();
  selectField(0);
}
function selectField(i) {
  const f = composerEl.querySelectorAll('.fld');
  f.forEach(x => x.classList.remove('on'));
  if (!f.length) return placeCaretEnd();
  const el = f[(i + f.length) % f.length];
  el.classList.add('on');
  const r = document.createRange(); r.selectNodeContents(el);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
}
function placeCaretEnd() {
  const r = document.createRange(); r.selectNodeContents(composerEl); r.collapse(false);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
}
function onComposerKey(e) {
  e.stopPropagation();
  if (e.key === 'Tab') {
    const f = [...composerEl.querySelectorAll('.fld')];
    if (!f.length) return;
    e.preventDefault();
    const sel = getSelection();
    const at = f.findIndex(x => x.contains(sel.anchorNode));
    selectField(at + (e.shiftKey ? -1 : 1));
  }
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
}
function send() {
  const text = composerEl ? composerEl.textContent.trim() : 'x';
  if (!text) { composerEl.focus(); return; }
  // sending from a fresh chat runs Plan mode; sending a tool request goes back to the running chat
  go(current === 'tools-useinchat' ? 'chat' : 'plan-open');
}

function regen() {
  const s = box(Object.assign(document.createElement('div'), { className: 'shimmer' }), [119, 118, 795, 758]);
  layer.appendChild(s);
  setTimeout(() => s.remove(), 1200);
}

// show every hotspot briefly when someone clicks a dead spot
let flashT;
function flash() {
  document.body.classList.add('hint');
  clearTimeout(flashT);
  flashT = setTimeout(() => document.body.classList.remove('hint'), 650);
}
stage.addEventListener('click', e => { if (e.target === layer || e.target === stage) flash(); });

// ---------- drawer ----------
const drawer = document.getElementById('drawer');
const navBtn = document.getElementById('navBtn');
const list = document.getElementById('list');
document.getElementById('navCount').textContent = ORDER.length;
GROUPS.forEach(([g, items]) => {
  const h = document.createElement('h3'); h.textContent = g; list.appendChild(h);
  items.forEach(([id, l]) => {
    const a = document.createElement('a'); a.href = '#' + id; a.textContent = l; a.dataset.id = id;
    a.addEventListener('click', e => { e.preventDefault(); go(id); });
    list.appendChild(a);
  });
});
function markList() {
  list.querySelectorAll('a').forEach(a => a.setAttribute('aria-current', a.dataset.id === current));
}
function toggleDrawer(open = drawer.hidden) {
  drawer.hidden = !open; navBtn.setAttribute('aria-expanded', open);
  if (open) list.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'center' });
}
navBtn.addEventListener('click', () => toggleDrawer());
addEventListener('keydown', e => {
  if (e.target.isContentEditable) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const i = ORDER.indexOf(current);
    go(ORDER[(i + (e.key === 'ArrowRight' ? 1 : -1) + ORDER.length) % ORDER.length]);
  } else if (e.key === 's' || e.key === 'S') toggleDrawer();
  else if (e.key === 'h' || e.key === 'H') flash();
  else if (e.key === 'Escape') {
    if (!drawer.hidden) return toggleDrawer(false);
    const up = { 'chat-history': 'chat', 'scene-menu': 'scene-scenes', 'object-menu': 'scene-objects', 'create-mywana-modal': 'create-mywana', 'plan-check': 'chat-blank', 'adjust-object': 'adjust-global' }[current];
    if (up) go(up);
  }
});

// ---------- boot ----------
fit();
go(location.hash.slice(1) || 'chat-blank', null, false);
setTimeout(() => ORDER.forEach(preload), 800);
