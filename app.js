// ============================================================
//  AUPROMPTKIT — APP LOGIC
//  Australian Banking BA Toolkit
// ============================================================

/* ── State ─────────────────────────────── */
const state = {
  cat: 'all',
  q: '',
  view: 'grid',
  sort: 'default',
  favs: new Set(),
  custom: [],
  openId: null,
  editingId: null,
  activeTags: new Set(), // New: Track multiple active tags
  usage: {},    // id → { count, lastUsed }
  ratings: {},  // id → 1-5
  theme: 'dark', // default
  collapsedGroups: new Set(), // New: track IDs of collapsed sidebar groups
  history: []   // New: Recent activity for Stats 2.0
};

/* ── Storage ────────────────────────────── */
function loadStorage() {
  try {
    const f = localStorage.getItem('aupk_favs');
    if (f) state.favs = new Set(JSON.parse(f));
    const c = localStorage.getItem('aupk_custom');
    if (c) state.custom = JSON.parse(c);
    const u = localStorage.getItem('aupk_usage');
    if (u) state.usage = JSON.parse(u);
    const r = localStorage.getItem('aupk_ratings');
    if (r) state.ratings = JSON.parse(r);
    const v = localStorage.getItem('aupk_view');
    if (v) state.view = v;
    const s = localStorage.getItem('aupk_sort');
    if (s) state.sort = s;
    const sc = localStorage.getItem('aupk_sidebar_collapsed');
    if (sc === 'true') collapseSidebar(true, false);

    const cg = localStorage.getItem('aupk_collapsed_groups');
    if (cg) state.collapsedGroups = new Set(JSON.parse(cg));
    
    const h = localStorage.getItem('aupk_history');
    if (h) state.history = JSON.parse(h);
    
    let t = localStorage.getItem('aupk_theme');
    if (!t) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        t = 'light';
      } else {
        t = 'dark';
      }
    }
    state.theme = t;
    applyTheme();
  } catch(e) {}
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = document.getElementById('darkModeToggle');
  if (btn) {
    btn.innerHTML = `<i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}" id="themeIcon"></i>`;
    lucide.createIcons();
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('aupk_theme', state.theme);
  applyTheme();
}

function saveFavs()    { localStorage.setItem('aupk_favs',    JSON.stringify([...state.favs])); }
function saveUsage()   { localStorage.setItem('aupk_usage',   JSON.stringify(state.usage)); }
function saveRatings() { localStorage.setItem('aupk_ratings', JSON.stringify(state.ratings)); }
function saveCustom_s(){ localStorage.setItem('aupk_custom',  JSON.stringify(state.custom)); }
function saveGroups()  { localStorage.setItem('aupk_collapsed_groups', JSON.stringify([...state.collapsedGroups])); }
function saveHistory() { localStorage.setItem('aupk_history', JSON.stringify(state.history)); }

/* ── Helpers ────────────────────────────── */
function allPrompts() { return [...PROMPTS, ...state.custom]; }

function trackUsage(id) {
  if (!state.usage[id]) state.usage[id] = { count: 0, lastUsed: 0 };
  state.usage[id].count++;
  state.usage[id].lastUsed = Date.now();
  saveUsage();

  // Add to Recent Activity
  state.history.unshift({ id, time: Date.now() });
  if (state.history.length > 10) state.history.pop();
  saveHistory();
}

function filtered() {
  const q = state.q.toLowerCase();
  let items = allPrompts().filter(p => {
    // 1. Category Filter
    if (state.cat === 'favourites') {
      if (!state.favs.has(p.id)) return false;
    } else if (state.cat === 'recent') {
      if (!(state.usage[p.id] && state.usage[p.id].lastUsed > 0)) return false;
    } else if (state.cat !== 'all') {
      if (p.category !== state.cat) return false;
    }
    
    // 2. Multi-tag FILTERING (Strict AND logic)
    // MUST be in p.tags array to match activeTags
    if (state.activeTags.size > 0) {
      if (!p.tags || p.tags.length === 0) return false;
      const pTagsLower = p.tags.map(t => t.toLowerCase());
      for (const t of state.activeTags) {
        if (!pTagsLower.includes(t.toLowerCase())) return false;
      }
    }

    // 3. Text Search (Independent of tags)
    if (!q) return true;
    const lowTitle = p.title.toLowerCase();
    const lowWhen = p.when.toLowerCase();
    const lowPrompt = p.prompt.toLowerCase();
    return lowTitle.includes(q) || lowWhen.includes(q) || lowPrompt.includes(q);
  });

  if (state.sort === 'az') {
    items = items.sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sort === 'za') {
    items = items.sort((a, b) => b.title.localeCompare(a.title));
  } else if (state.sort === 'used') {
    items = items.sort((a, b) => ((state.usage[b.id]||{}).count||0) - ((state.usage[a.id]||{}).count||0));
  } else if (state.sort === 'recent') {
    items = items.sort((a, b) => ((state.usage[b.id]||{}).lastUsed||0) - ((state.usage[a.id]||{}).lastUsed||0));
  }

  return items;
}

function copyAsJira(id) {
  const p = allPrompts().find(x => x.id === id);
  if (!p) return;
  const text = `{code:title=${p.title}}\n${p.prompt}\n{code}`;
  navigator.clipboard.writeText(text);
  showToast('Copied for Jira');
}

function copyAsConfluence(id) {
  const p = allPrompts().find(x => x.id === id);
  if (!p) return;
  const text = `|| Prompt Title || ${p.title} ||\n| Context | ${p.when} |\n| Template | {code}${p.prompt}{code} |`;
  navigator.clipboard.writeText(text);
  showToast('Copied for Confluence');
}

function openFill(id) {
  const p = allPrompts().find(x => x.id === id);
  if (!p) return;
  const placeholders = getPlaceholders(p.prompt);
  const container = document.getElementById('fillInputs');
  container.innerHTML = placeholders.map(ph => `
    <div class="fill-field">
      <label class="fill-label">${ph.replace(/[\[\]]/g, '').replace(/_/g, ' ')}</label>
      <input type="text" class="fill-input" data-ph="${ph}" placeholder="Enter ${ph.toLowerCase()}...">
    </div>
  `).join('');

  const updatePreview = () => {
    let preview = p.prompt;
    container.querySelectorAll('.fill-input').forEach(input => {
      const val = input.value.trim();
      const ph = input.dataset.ph;
      if (val) {
        // Regex to replace all occurrences of this placeholder
        preview = preview.split(ph).join('<mark class="filled">' + escHtml(val) + '</mark>');
      } else {
        preview = preview.split(ph).join('<mark class="placeholder">' + ph + '</mark>');
      }
    });
    document.getElementById('fillPreview').innerHTML = preview;
  };

  container.querySelectorAll('.fill-input').forEach(input => {
    input.oninput = updatePreview;
  });

  updatePreview();
  document.getElementById('fillOverlay').classList.add('open');
  
  const genBtn = document.getElementById('fillGemini');
  genBtn.onclick = () => {
    let finalPrompt = p.prompt;
    container.querySelectorAll('.fill-input').forEach(input => {
      const val = input.value.trim();
      if (val) finalPrompt = finalPrompt.split(input.dataset.ph).join(val);
    });
    const url = 'https://gemini.google.com/app?q=' + encodeURIComponent(finalPrompt.substring(0, 2000));
    window.open(url, '_blank');
  };
}

function catLabel(id) {
  const c = CATEGORIES.find(x => x.id === id);
  return c ? c.label : id;
}
function chipClass(cat) { return `cat-chip chip-${cat}`; }

function escHtml(s) {
  return String(s||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ── Sidebar ────────────────────────────── */
function renderSidebar() {
  const all = allPrompts();
  const counts = {};
  CATEGORIES.forEach(c => {
    if (c.id === 'all') counts[c.id] = all.length;
    else if (c.id === 'favourites') counts[c.id] = state.favs.size;
    else if (c.id === 'recent') counts[c.id] = Object.keys(state.usage).filter(id => state.usage[id].lastUsed > 0).length;
    else counts[c.id] = all.filter(p => p.category === c.id).length;
  });

  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = GROUPS.map(group => {
    const items = CATEGORIES.filter(c => (c.groupId || 'core') === group.id);
    if (items.length === 0) return '';
    const isCollapsed = state.collapsedGroups.has(group.id);
    return `<div class="nav-section ${isCollapsed ? 'collapsed' : ''}" data-group="${group.id}">
      <div class="nav-section-label">
        <span class="group-toggle">${isCollapsed ? '<i data-lucide="chevron-right" style="width:10px;height:10px"></i>' : '<i data-lucide="chevron-down" style="width:10px;height:10px"></i>'}</span> <i data-lucide="${group.icon}" class="nav-icon" style="width:14px;height:14px;margin-right:4px"></i> ${group.label}
      </div>
      <div class="nav-section-items">
        ${items.map(c => `
          <div class="nav-item ${state.cat === c.id ? 'active' : ''}" data-cat="${c.id}">
            <i data-lucide="${c.icon}" class="nav-icon" style="width:16px;height:16px"></i>
            <span class="nav-label">${c.label}</span>
            ${(counts[c.id]||0) > 0 ? `<span class="nav-count">${counts[c.id]}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>`;
  }).join('');

  nav.querySelectorAll('.nav-section-label').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = el.closest('.nav-section');
      const gid = parent.dataset.group;
      if (state.collapsedGroups.has(gid)) {
        state.collapsedGroups.delete(gid);
      } else {
        state.collapsedGroups.add(gid);
      }
      saveGroups();
      renderSidebar();
    });
  });

  nav.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => {
      state.cat = el.dataset.cat;
      state.q = '';
      state.activeTags.clear();
      document.getElementById('searchInp').value = '';
      document.getElementById('searchClear').style.display = 'none';
      render();
    });
  });

  // Populate category select in add modal
  const sel = document.getElementById('cCategory');
  const prev = sel.value;
  sel.innerHTML = '<option value="">Select a category…</option>' +
    CATEGORIES
      .filter(c => c.id !== 'all' && c.id !== 'favourites' && c.id !== 'recent')
      .map(c => `<option value="${c.id}" ${prev===c.id?'selected':''}>${c.icon} ${c.label}</option>`)
      .join('');
}

/* ── Quick Filters ──────────────────────── */
function renderQuickFilters() {
  const container = document.getElementById('quickFilters');
  if (!container) return;
  
  // Show a subset of primary categories for quick access
  const quickList = ['all', 'favourites', 'recent', 'us_ui', 'us_bff', 'us_backend', 'feature_breakdown', 'requirements', 'api'];
  
  container.innerHTML = quickList.map(id => {
    const c = CATEGORIES.find(cat => cat.id === id);
    if (!c) return '';
    const isActive = state.cat === c.id ? 'active' : '';
    return `<button class="quick-pill ${isActive}" data-cat="${c.id}"><i data-lucide="${c.icon}" style="width:14px;height:14px;vertical-align:middle;margin-right:4px"></i> ${c.label}</button>`;
  }).join('');

  container.querySelectorAll('.quick-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.cat = btn.dataset.cat;
      state.q = '';
      document.getElementById('searchInp').value = '';
      document.getElementById('searchClear').style.display = 'none';
      render();
    });
  });
}

/* ── Tag Strip ──────────────────────────── */
function renderTagStrip() {
  const items = filtered();
  const map = {};
  items.forEach(p => (p.tags||[]).forEach(t => map[t] = (map[t]||0) + 1));
  const top = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,14).map(e=>e[0]);

  const strip = document.getElementById('tagStrip');
  if (top.length === 0) { strip.style.display = 'none'; return; }
  strip.style.display = 'flex';
  strip.innerHTML = top.map(t =>
    `<button class="tag-pill ${state.activeTags.has(t)?'active':''}" data-tag="${escHtml(t)}">${escHtml(t)}</button>`
  ).join('');

  strip.querySelectorAll('.tag-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if (state.activeTags.has(tag)) {
        state.activeTags.delete(tag);
      } else {
        state.activeTags.add(tag);
      }
      render();
    });
  });
}

/* ── Placeholder highlighting ───────────── */
function highlightPlaceholders(text) {
  const escaped = escHtml(text);
  return escaped.replace(/\[([^\]]+)\]/g, '<mark class="placeholder">[$1]</mark>');
}

function countPlaceholders(text) {
  const matches = text.match(/\[[^\]]+\]/g);
  return matches ? [...new Set(matches)].length : 0;
}

/* ── Grid ───────────────────────────────── */
function renderGrid() {
  const items = filtered();
  const grid  = document.getElementById('promptGrid');
  const empty = document.getElementById('emptyState');

  const cat = CATEGORIES.find(c => c.id === state.cat);
  document.getElementById('pageTitle').textContent = cat ? cat.label : 'All Prompts';
  document.getElementById('pageCount').textContent =
    `${items.length} prompt${items.length !== 1 ? 's' : ''}`;

  if (items.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'flex';
    return;
  }
  grid.style.display = 'grid';
  empty.style.display = 'none';

  if (state.view === 'list') grid.classList.add('list-view');
  else grid.classList.remove('list-view');

  grid.innerHTML = items.map(p => {
    const isFav  = state.favs.has(p.id);
    const useCnt = (state.usage[p.id]||{}).count||0;
    const rating = state.ratings[p.id] || 0;
    const isCustom = !!p.isCustom;
    const starsHtml = rating > 0 ? `<span class="card-rating">${'★'.repeat(rating)}</span>` : '';
    const useHtml   = useCnt >= 3 ? `<span class="card-use-badge" title="${useCnt} copies"><i data-lucide="flame" style="width: 10px; height: 10px; margin-right: 2px;"></i> ${useCnt}</span>` : '';
    const editDelHtml = isCustom ? `
      <button class="card-edit-btn" data-id="${p.id}" title="Edit"><i data-lucide="edit-2" style="width:14px;height:14px"></i></button>
      <button class="card-del-btn"  data-id="${p.id}" title="Delete"><i data-lucide="trash-2" style="width:14px;height:14px"></i></button>` : '';
    
    // Everyone gets a duplicate and refine button
    const dupHtml = `<button class="card-dup-btn" data-id="${p.id}" title="Duplicate to Custom Templates"><i data-lucide="copy" style="width:14px;height:14px"></i></button>`;
    const refineHtml = `<button class="card-refine-btn" data-id="${p.id}" title="AI Refine Prompt"><i data-lucide="sparkles" style="width:14px;height:14px"></i></button>`;

    if (state.view === 'list') {
      return `<div class="card" data-id="${p.id}">
        <div class="card-top">
          <span class="${chipClass(p.category)}">${escHtml(catLabel(p.category))}</span>
          <button class="fav-btn ${isFav?'on':''}" data-id="${p.id}">${isFav?'★':'☆'}</button>
        </div>
        <div class="card-main">
          <div class="card-title">${escHtml(p.title)} ${starsHtml} ${useHtml}</div>
          <div class="card-when">${escHtml(p.when)}</div>
        </div>
        <div class="card-foot">
          ${editDelHtml}
          ${dupHtml}
          ${refineHtml}
          <button class="copy-btn" data-prompt="${encodeURIComponent(p.prompt)}" data-id="${p.id}">Copy</button>
        </div>
      </div>`;
    }
    return `<div class="card" data-id="${p.id}">
      <div class="card-top">
        <span class="${chipClass(p.category)}">${escHtml(catLabel(p.category))}</span>
        <div style="display:flex;gap:4px;align-items:center">
          ${editDelHtml}
          ${dupHtml}
          ${refineHtml}
          <button class="fav-btn ${isFav?'on':''}" data-id="${p.id}">${isFav?'★':'☆'}</button>
        </div>
      </div>
      <div class="card-title">${escHtml(p.title)}</div>
      <div class="card-when">${escHtml(p.when)}</div>
      <div class="card-foot">
        <div class="card-tags">
          ${starsHtml}${useHtml}
          ${(p.tags||[]).slice(0,3).map(t=>`<span class="ctag">${escHtml(t)}</span>`).join('')}
        </div>
        <button class="copy-btn" data-id="${p.id}">Copy</button>
      </div>
    </div>`;
  }).join('');

  lucide.createIcons(); // Initialize Lucide icons after grid render

  // Events
  grid.querySelectorAll('.card').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.fav-btn') || e.target.closest('.copy-btn') ||
          e.target.closest('.card-edit-btn') || e.target.closest('.card-del-btn') || 
          e.target.closest('.card-dup-btn') || e.target.closest('.card-refine-btn')) return;
      openDetail(el.dataset.id);
    });
  });
  grid.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); toggleFav(btn.dataset.id); });
  });
  grid.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const p = allPrompts().find(x => x.id === id);
      if (!p) return;
      trackUsage(id);
      copyText(p.prompt, btn, 'Copy', 'Copied!');
    });
  });
  grid.querySelectorAll('.card-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openEdit(btn.dataset.id); });
  });
  grid.querySelectorAll('.card-del-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); deleteCustomPrompt(btn.dataset.id); });
  });
  grid.querySelectorAll('.card-dup-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); duplicatePrompt(btn.dataset.id); });
  });
  grid.querySelectorAll('.card-refine-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); refinePrompt(btn.dataset.id, btn); });
  });
}

/* ── Render ─────────────────────────────── */
function render() {
  renderSidebar();
  renderQuickFilters();
  renderTagStrip();
  renderGrid();
}

/* ── Favourites ─────────────────────────── */
function toggleFav(id) {
  state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
  saveFavs();
  render();
  if (state.openId === id) syncDetailFavBtn();
}

function syncDetailFavBtn() {
  const btn = document.getElementById('detailFav');
  if (!btn) return;
  const on = state.favs.has(state.openId);
  btn.innerHTML = on 
    ? '<i data-lucide="star" style="width:16px;height:16px;fill:currentColor"></i> <span>Unfavourite</span>' 
    : '<i data-lucide="star" style="width:16px;height:16px"></i> <span>Favourite</span>';
  btn.classList.toggle('on', on);
  lucide.createIcons();
}

/* ── Star Rating ─────────────────────────── */
function renderStars(id) {
  const el = document.getElementById('detailStars');
  if (!el) return;
  const current = state.ratings[id] || 0;
  el.innerHTML = [1,2,3,4,5].map(n =>
    `<button class="star-btn ${n <= current ? 'on' : ''}" data-n="${n}" title="Rate ${n} star${n>1?'s':''}"><i data-lucide="star" style="width:16px;height:16px;${n <= current ? 'fill:currentColor' : ''}"></i></button>`
  ).join('');
  el.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = parseInt(btn.dataset.n);
      state.ratings[id] = (state.ratings[id] === n) ? 0 : n;
      saveRatings();
      renderStars(id);
      render();
    });
    btn.addEventListener('mouseenter', () => {
      const n = parseInt(btn.dataset.n);
      el.querySelectorAll('.star-btn').forEach((b, i) => b.classList.toggle('hover', i < n));
    });
    btn.addEventListener('mouseleave', () => {
      el.querySelectorAll('.star-btn').forEach(b => b.classList.remove('hover'));
    });
  });
  lucide.createIcons();
}

/* ── Detail Modal ───────────────────────── */
function openDetail(id) {
  const p = allPrompts().find(x => x.id === id);
  if (!p) return;
  state.openId = id;
  history.replaceState(null, '', '#' + id);

  document.getElementById('detailChip').className = chipClass(p.category);
  document.getElementById('detailChip').textContent = catLabel(p.category);
  document.getElementById('detailTitle').textContent = p.title;
  document.getElementById('detailWhen').textContent = p.when;
  document.getElementById('detailPrompt').innerHTML = highlightPlaceholders(p.prompt);

  const phCount = countPlaceholders(p.prompt);
  const phEl = document.getElementById('placeholderCount');
  const fillBtn = document.getElementById('detailFill');
  if (phCount > 0) {
    phEl.textContent = `${phCount} variable${phCount > 1?'s':''} to fill in`;
    phEl.style.display = 'inline';
    if (fillBtn) fillBtn.style.display = 'inline-flex';
  } else {
    phEl.style.display = 'none';
    if (fillBtn) fillBtn.style.display = 'none';
  }

  const tipsSection = document.getElementById('tipsSection');
  const tipsList    = document.getElementById('detailTips');
  if (p.tips && p.tips.length) {
    tipsList.innerHTML = p.tips.map(t => `
      <li>
        <i data-lucide="arrow-right" style="width:14px;height:14px;color:var(--accent-lt);flex-shrink:0;margin-top:3px"></i>
        <span>${escHtml(t)}</span>
      </li>
    `).join('');
    tipsSection.style.display = '';
  } else {
    tipsSection.style.display = 'none';
  }

  renderStars(id);
  syncDetailFavBtn();

  const geminiBtn = document.getElementById('detailGemini');
  const geminiUrl  = 'https://gemini.google.com/app?q=' + encodeURIComponent(p.prompt.substring(0, 2000));
  geminiBtn.onclick = () => { trackUsage(id); window.open(geminiUrl, '_blank'); };

  const jiraBtn = document.getElementById('copyJira');
  if (jiraBtn) jiraBtn.onclick = () => copyAsJira(id);
  const confBtn = document.getElementById('copyConfluence');
  if (confBtn) confBtn.onclick = () => copyAsConfluence(id);

  if (fillBtn) fillBtn.onclick = () => openFill(id);

  document.getElementById('detailOverlay').classList.add('open');
  lucide.createIcons();
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('open');
  state.openId = null;
  history.replaceState(null, '', window.location.pathname);
}

/* ── AI Refiner ────────────────────────── */
let lastRefineId = null;
let generatedRefineMaster = "";

function openRefine(id) {
  const p = allPrompts().find(x => x.id === id);
  if (!p) return;
  
  lastRefineId = id;
  const original = p.prompt;
  
  const updateRefineUI = (tone = 'analytical') => {
    const metaPrompt = `Act as a world-class Prompt Engineer and Senior Business Analyst specializing in the Australian Banking domain. 

I want to refine the following prompt to be more precise, professional, and effective for high-stakes banking requirements.

### ORIGINAL PROMPT:
${original}

### REFINEMENT REQUIREMENTS:
1. **Domain Precision:** Ensure terminology aligns with APRA (CPS 234, 230, etc.), ASIC, and NPPA standards.
2. **Structural Clarity:** Use clear headings, markdown formatting, and structured instructions.
3. **Constraint Management:** Add necessary constraints for security, privacy (Privacy Act 1988), and accessibility (WCAG 2.1).
4. **Tone:** ${tone.toUpperCase()}. Focus on being ${tone === 'formal' ? 'extremely professional for regulators' : tone === 'precise' ? 'highly technical for developers' : 'analytical and balanced'}.

### OUTPUT:
Provide ONLY the refined prompt text, optimized for Gemini 1.5 Pro or GPT-4o.`;

    generatedRefineMaster = metaPrompt;
    document.getElementById('refineOriginal').textContent = original.substring(0, 300) + (original.length > 300 ? '...' : '');
    document.getElementById('refineResult').textContent = metaPrompt;
  };

  updateRefineUI();
  document.getElementById('refineOverlay').classList.add('open');
  lucide.createIcons();

  // Bind tones
  document.querySelectorAll('.tone-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateRefineUI(btn.dataset.tone);
    };
  });
}

function closeRefine() {
  document.getElementById('refineOverlay').classList.remove('open');
  lastRefineId = null;
}

async function refinePrompt(id, btn) {
  openRefine(id);
  trackUsage(id);
}

/* ── Edit Custom Prompt ─────────────────── */
function openEdit(id) {
  const p = state.custom.find(x => x.id === id);
  if (!p) return;
  state.editingId = id;
  document.getElementById('addModalTitle').textContent = 'Edit Custom Prompt';
  document.getElementById('cTitle').value   = p.title;
  document.getElementById('cWhen').value    = p.when;
  document.getElementById('cPrompt').value  = p.prompt;
  document.getElementById('cTags').value    = (p.tags||[]).join(', ');
  setTimeout(() => { document.getElementById('cCategory').value = p.category; }, 50);
  
  // Render history if available
  const histWrap = document.getElementById('historyWrap');
  if (histWrap && p.versions && p.versions.length > 0) {
    histWrap.style.display = 'block';
    const list = document.getElementById('historyList');
    list.innerHTML = p.versions.map((v, i) => `
      <div class="history-item">
        <span>${new Date(v.date).toLocaleString()} — ${escHtml(v.title)}</span>
        <button class="btn-restore" onclick="restoreVersion(${i})">Restore</button>
      </div>
    `).join('');
  } else if (histWrap) {
    histWrap.style.display = 'none';
  }

  document.getElementById('addOverlay').classList.add('open');
}

function deleteCustomPrompt(id) {
  if (!confirm('Delete this custom prompt?')) return;
  state.custom = state.custom.filter(p => p.id !== id);
  saveCustom_s();
  render();
  showToast('Custom prompt deleted');
}

function duplicatePrompt(id) {
  const p = allPrompts().find(x => x.id === id);
  if (!p) return;
  
  const duplicated = {
    ...p,
    id: 'custom-' + Date.now(),
    title: p.title + ' (Copy)',
    isCustom: true
  };
  
  state.custom.push(duplicated);
  saveCustom_s();
  render();
  showToast('Prompt duplicated!');
}

/* ── Add / Save Modal ───────────────────── */
function openAdd() {
  state.editingId = null;
  document.getElementById('addModalTitle').textContent = 'Add Custom Prompt';
  ['cTitle','cWhen','cPrompt','cTags'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('cCategory').value = '';
  const histWrap = document.getElementById('historyWrap');
  if (histWrap) histWrap.style.display = 'none';
  document.getElementById('addOverlay').classList.add('open');
  lucide.createIcons();
}
function closeAdd() {
  document.getElementById('addOverlay').classList.remove('open');
  state.editingId = null;
}

function savePrompt() {
  const title    = document.getElementById('cTitle').value.trim();
  const category = document.getElementById('cCategory').value;
  const when     = document.getElementById('cWhen').value.trim();
  const prompt   = document.getElementById('cPrompt').value.trim();
  const tagsRaw  = document.getElementById('cTags').value.trim();

  if (!title || !category || !prompt) {
    showToast('Please fill in Title, Category, and Prompt'); return;
  }
  const tags = tagsRaw ? tagsRaw.split(',').map(t=>t.trim()).filter(Boolean) : [];

  if (state.editingId) {
    const idx = state.custom.findIndex(p => p.id === state.editingId);
    if (idx > -1) {
      const old = state.custom[idx];
      // Push current to versions if it's different
      if (old.prompt !== prompt || old.title !== title) {
        if (!old.versions) old.versions = [];
        old.versions.push({
          date: Date.now(),
          title: old.title,
          prompt: old.prompt,
          category: old.category
        });
      }
      state.custom[idx] = { ...old, title, category, when: when||'Custom prompt', prompt, tags, lastModified: Date.now() };
      saveCustom_s(); closeAdd(); render();
      showToast('Custom prompt updated!');
    }
  } else {
    const p = { id:'custom-'+Date.now(), category, title, when: when||'Custom prompt', prompt, tips:[], tags, isCustom:true, versions: [], lastModified: Date.now() };
    state.custom.push(p);
    saveCustom_s(); closeAdd(); render();
    showToast('Custom prompt saved!');
  }
}

function restoreVersion(idx) {
  const p = state.custom.find(x => x.id === state.editingId);
  if (!p || !p.versions || !p.versions[idx]) return;
  
  const ver = p.versions[idx];
  document.getElementById('cTitle').value = ver.title;
  document.getElementById('cPrompt').value = ver.prompt;
  document.getElementById('cCategory').value = ver.category || p.category;
  showToast('Version restored (not yet saved)');
}

/* ── Fill Modal ─────────────────────────── */
let fillData = { promptText: '', vars: [], values: {} };

function openFillModal() {
  const p = allPrompts().find(x => x.id === state.openId);
  if (!p) return;
  const rawPrompt = p.prompt;
  
  const matches = rawPrompt.match(/\[([^\]]+)\]/g);
  if (!matches) return;
  
  fillData.vars = [...new Set(matches)].map(m => ({ raw: m, label: m.slice(1, -1) }));
  fillData.promptText = rawPrompt;
  fillData.values = {};
  
  document.getElementById('fillTitle').textContent = p.title;
  
  const inputsContainer = document.getElementById('fillInputs');
  inputsContainer.innerHTML = fillData.vars.map((v, i) => `
    <div class="fill-field">
      <label class="fill-label" for="fillInp${i}">${escHtml(v.label)}</label>
      <input type="text" id="fillInp${i}" class="fill-input" placeholder="Value for ${escHtml(v.label)}..." data-var="${escHtml(v.raw)}"/>
    </div>
  `).join('');
  
  inputsContainer.querySelectorAll('.fill-input').forEach(inp => {
    inp.addEventListener('input', e => {
      fillData.values[e.target.dataset.var] = e.target.value;
      updateFillPreview();
    });
  });
  
  updateFillPreview();
  document.getElementById('fillOverlay').classList.add('open');
  setTimeout(() => { document.getElementById('fillInp0')?.focus(); }, 100);
  lucide.createIcons();
}

function updateFillPreview() {
  let output = escHtml(fillData.promptText);
  fillData.vars.forEach(v => {
    const val = fillData.values[v.raw];
    const target = escHtml(v.raw);
    
    const replacement = val 
      ? `<mark class="filled">${escHtml(val)}</mark>` 
      : `<mark class="placeholder">${target}</mark>`;
      
    output = output.split(target).join(replacement);
  });
  document.getElementById('fillPreview').innerHTML = output;
}

function closeFillModal() {
  document.getElementById('fillOverlay').classList.remove('open');
}

function getFilledPromptRaw() {
  let output = fillData.promptText;
  fillData.vars.forEach(v => {
    const val = fillData.values[v.raw];
    if (val) output = output.split(v.raw).join(val);
  });
  return output;
}

/* ── Stats Modal ────────────────────────── */
function openStats() {
  const all = allPrompts();
  const cats = {};
  all.forEach(p => cats[p.category] = (cats[p.category]||0) + 1);
  
  const topUsed = all
    .filter(p => (state.usage[p.id]||{}).count > 0)
    .sort((a,b) => (state.usage[b.id].count) - (state.usage[a.id].count))
    .slice(0, 5);

  const rated = Object.values(state.ratings).filter(r => r > 0);
  const avgRating = rated.length ? (rated.reduce((a,b)=>a+b,0)/rated.length).toFixed(1) : '–';

  // Heatmap calculation (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 29));
  thirtyDaysAgo.setHours(0,0,0,0);
  
  const dailyUsage = {};
  Object.values(state.usage).forEach(u => {
    if (u.lastUsed >= thirtyDaysAgo.getTime()) {
      const day = new Date(u.lastUsed).toLocaleDateString();
      dailyUsage[day] = (dailyUsage[day]||0) + u.count;
    }
  });

  const heatmapHtml = Array.from({length: 30}).map((_, i) => {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString();
    const count = dailyUsage[dateStr] || 0;
    const level = count > 10 ? 4 : count > 5 ? 3 : count > 2 ? 2 : count > 0 ? 1 : 0;
    return `<div class="heat-box level-${level}" title="${dateStr}: ${count} uses"></div>`;
  }).join('');

  const recentEdits = [...state.custom]
    .filter(p => p.lastModified)
    .sort((a,b) => b.lastModified - a.lastModified)
    .slice(0, 5);

  const body = document.getElementById('statsBody');
  body.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-val">${all.length}</div>
        <div class="stat-lbl">Total Prompts</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${state.custom.length}</div>
        <div class="stat-lbl">Custom Prompts</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${avgRating}</div>
        <div class="stat-lbl">Avg Rating</div>
      </div>
    </div>
    
    <div class="stats-section">
      <div class="m-sec-label"><i data-lucide="flame" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px; color: #ff5722;"></i> Usage Heatmap (Last 30 Days)</div>
      <div class="heatmap-container">
        <div class="heatmap-grid">${heatmapHtml}</div>
        <div class="heatmap-legend">
          <span>Less</span>
          <div class="heat-box level-0"></div>
          <div class="heat-box level-1"></div>
          <div class="heat-box level-2"></div>
          <div class="heat-box level-3"></div>
          <div class="heat-box level-4"></div>
          <span>More</span>
        </div>
      </div>
    </div>

    <div class="stats-row-group">
      <div class="stats-col">
        <div class="m-sec-label"><i data-lucide="award" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px; color: #ffc107;"></i> Top Used (All Time)</div>
        <div class="top-list">
          ${topUsed.map(p => `
            <div class="top-item">
              <span class="top-name">${escHtml(p.title)}</span>
              <span class="top-count"><i data-lucide="flame" style="width: 10px; height: 10px; margin-right: 2px;"></i> ${state.usage[p.id].count}</span>
            </div>
          `).join('') || '<div class="t3">No usage data yet</div>'}
        </div>
      </div>
      <div class="stats-col">
        <div class="m-sec-label"><i data-lucide="history" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px; color: #00bcd4;"></i> Recent Activity</div>
        <div class="top-list">
          ${state.history.map(h => {
            const p = allPrompts().find(x => x.id === h.id);
            if (!p) return '';
            return `
              <div class="top-item">
                <span class="top-name">${escHtml(p.title)}</span>
                <span class="top-count" style="font-size: 9px; opacity: 0.7;">${new Date(h.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            `;
          }).join('') || '<div class="t3">No activity yet</div>'}
        </div>
      </div>
    </div>

    <div class="stats-section">
      <div class="m-sec-label"><i data-lucide="folder" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px; color: var(--accent);"></i> Category Breakdown</div>
      <div class="cat-dist">
        ${Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cid, count]) => `
          <div class="cat-dist-row">
            <span class="cat-dist-lbl">${escHtml(catLabel(cid))}</span>
            <div class="cat-dist-bar-wrap">
              <div class="cat-dist-bar" style="width: ${(count/all.length*100)}%"></div>
            </div>
            <span class="cat-dist-count">${count}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.getElementById('statsOverlay').classList.add('open');
  lucide.createIcons();
}

function closeStats() {
  document.getElementById('statsOverlay').classList.remove('open');
}

/* ── Scanner Modal ──────────────────────── */
let generatedScannerPrompt = "";
let scannedFilesText = "";

function openScanner() {
  document.getElementById('scanFeatureName').value = '';
  document.getElementById('scanLinks').value = '';
  document.getElementById('scanContext').value = '';
  document.getElementById('scanJiraOutput').value = '';
  document.getElementById('scanFolder').value = '';
  document.getElementById('scanFolderResult').textContent = 'No folder selected';
  scannedFilesText = "";
  
  document.getElementById('scanResultSection').style.display = 'none';
  document.getElementById('scannerGemini').style.display = 'none';
  document.getElementById('scannerCopy').style.display = 'none';
  document.getElementById('scannerOverlay').classList.add('open');
}

function closeScanner() {
  document.getElementById('scannerOverlay').classList.remove('open');
}

function generateScannerPrompt() {
  const featName = document.getElementById('scanFeatureName').value.trim();
  const links = document.getElementById('scanLinks').value.trim();
  const context = document.getElementById('scanContext').value.trim();

  if (!featName) {
    showToast('⚠️ Please provide Feature Name.');
    return;
  }
  if (!links && !scannedFilesText) {
    showToast('⚠️ Please provide Material Links or Scan a Folder.');
    return;
  }

  const prompt = `Act as an expert Technical Business Analyst specializing in the Australian Digital Banking domain.

I am providing you with materials and context for the feature: **${featName}**.

*** Resource Links ***
${links || 'None provided'}

*** Scanned Local Folder Structure ***
${scannedFilesText || 'None provided'}

*** Additional Context / Constraints ***
${context || 'No additional context provided. Rely on standard APRA/CDR/Banking best practices.'}

*** Your Task ***
1. Analyze the provided materials and the folder structure (extrapolating their probable contents based on their names) to break down this feature into a logical set of granular User Stories.
2. Provide a Story Point estimation (Fibonacci: 1, 2, 3, 5, 8, 13) for each User Story based on technical complexity and typical compliance requirements.
3. Automatically format your final output strictly as a CSV block that I can directly import into Jira.
   Ensure the CSV has exactly the following headers:
   IssueType,Summary,Description,Priority,Story Points,Epic Link,Labels

4. Format constraints:
   - User Stories must use: "As a... I want to... So that..."
   - Acceptance Criteria (inside Description) must use BDD: "Given... When... Then..."
   - Separate the CSV with standard commas and wrap fields in double-quotes to avoid formatting errors.

Please output the raw CSV block ONLY. Do not use markdown wrapping formatting (like \`\`\`csv) outside of the raw output.`;

  generatedScannerPrompt = prompt;
  document.getElementById('scanResultPrompt').textContent = prompt;
  document.getElementById('scanResultSection').style.display = 'block';
  document.getElementById('scannerGemini').style.display = 'inline-block';
  document.getElementById('scannerCopy').style.display = 'inline-block';
  showToast('🪄 Magic Prompt Generated!');
}

function exportJiraCSV() {
  const txt = document.getElementById('scanJiraOutput').value.trim();
  if(!txt) { showToast('⚠️ Please paste the CSV output first.'); return; }
  
  const blob = new Blob([txt], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Jira_User_Stories.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ Downloaded Jira CSV!');
}

/* ── Sidebar Collapse ───────────────────── */
function collapseSidebar(collapse, persist = true) {
  const sidebar = document.getElementById('sidebar');
  const tab     = document.getElementById('sidebarExpandTab');
  const toggle  = document.getElementById('sidebarToggle');
  if (collapse) {
    sidebar.classList.add('collapsed');
    tab.style.display = 'flex';
    toggle.textContent = '›';
  } else {
    sidebar.classList.remove('collapsed');
    tab.style.display = 'none';
    toggle.textContent = '‹';
  }
  if (persist) localStorage.setItem('aupk_sidebar_collapsed', String(collapse));
}

/* ── Copy ───────────────────────────────── */
function basicMarkdownToHtml(text) {
  let html = escHtml(text);
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Bullet points
  html = html.replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>');
  // Clean up adjacent lists
  html = html.replace(/<\/ul>\n<ul>/g, '\n');
  return html.replace(/\n/g, '<br/>');
}

function copyText(text, btn, orig, done) {
  const doIt = () => {
    showToast('Prompt copied to clipboard!');
    if (btn) {
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = done;
        setTimeout(() => span.textContent = orig, 1500);
      } else {
        btn.textContent = done;
        setTimeout(() => btn.textContent = orig, 1500);
      }
    }
  };
  
  if (navigator.clipboard && window.ClipboardItem) {
    const htmlText = basicMarkdownToHtml(text);
    const plainBlob = new Blob([text], { type: 'text/plain' });
    const htmlBlob  = new Blob([htmlText], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({
      'text/plain': plainBlob,
      'text/html': htmlBlob
    });
    navigator.clipboard.write([clipboardItem]).then(doIt).catch(() => fallback(text, doIt));
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(doIt).catch(() => fallback(text, doIt));
  } else {
    fallback(text, doIt);
  }
}
function fallback(text, cb) {
  const ta = Object.assign(document.createElement('textarea'), {
    value: text, style: 'position:fixed;opacity:0'
  });
  document.body.appendChild(ta); ta.select();
  document.execCommand('copy'); document.body.removeChild(ta);
  cb();
}

/* ── Toast ──────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2400);
}

/* ── Export / Import ────────────────────── */
function initExportImport() {
  document.getElementById('exportBtn').addEventListener('click', () => {
    if (state.custom.length === 0) { showToast('⚠️ No custom prompts to export'); return; }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.custom, null, 2));
    const a = Object.assign(document.createElement('a'), { href: dataStr, download: 'aupromptkit_custom.json' });
    a.click();
    showToast('✅ Exported ' + state.custom.length + ' prompts');
  });

  const fileInput = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');
        let count = 0;
        imported.forEach(p => {
          if (p.title && p.prompt) {
            p.id = p.id || ('custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6));
            p.isCustom = true;
            state.custom.push(p);
            count++;
          }
        });
        saveCustom_s(); render();
        showToast('✅ Imported ' + count + ' prompts');
      } catch (err) {
        showToast('❌ Failed to import. Invalid JSON file.');
      }
      fileInput.value = '';
    };
    reader.readAsText(e.target.files[0]);
  });
}

/* ── Event Wiring ───────────────────────── */
function initEvents() {
  const inp    = document.getElementById('searchInp');
  const clrBtn = document.getElementById('searchClear');
  inp.addEventListener('input', () => {
    state.q = inp.value;
    clrBtn.style.display = inp.value ? 'block' : 'none';
    render();
  });
  clrBtn.addEventListener('click', () => {
    inp.value = ''; state.q = '';
    clrBtn.style.display = 'none'; render();
  });

  const sortSel = document.getElementById('sortSelect');
  sortSel.value = state.sort;
  sortSel.addEventListener('change', () => {
    state.sort = sortSel.value;
    localStorage.setItem('aupk_sort', state.sort);
    render();
  });

  document.getElementById('gridBtn').addEventListener('click', () => {
    state.view = 'grid'; localStorage.setItem('aupk_view', 'grid');
    document.getElementById('gridBtn').classList.add('active');
    document.getElementById('listBtn').classList.remove('active');
    render();
  });
  document.getElementById('listBtn').addEventListener('click', () => {
    state.view = 'list'; localStorage.setItem('aupk_view', 'list');
    document.getElementById('listBtn').classList.add('active');
    document.getElementById('gridBtn').classList.remove('active');
    render();
  });

  if (state.view === 'list') {
    document.getElementById('listBtn').classList.add('active');
    document.getElementById('gridBtn').classList.remove('active');
  }

  document.getElementById('detailClose').addEventListener('click', closeDetail);
  document.getElementById('detailOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDetail();
  });
  document.getElementById('detailCopy').addEventListener('click', () => {
    const text = document.getElementById('detailPrompt').textContent;
    trackUsage(state.openId);
    copyText(text, document.getElementById('detailCopy'), 'Copy Prompt', 'Copied!');
    render();
  });
  document.getElementById('detailFav').addEventListener('click', () => {
    if (state.openId) toggleFav(state.openId);
  });
  
  const detailFill = document.getElementById('detailFill');
  if (detailFill) detailFill.addEventListener('click', openFillModal);
  
  document.getElementById('fillClose').addEventListener('click', closeFillModal);
  document.getElementById('fillCancel').addEventListener('click', closeFillModal);
  document.getElementById('fillCopy').addEventListener('click', () => {
    const text = getFilledPromptRaw();
    trackUsage(state.openId);
    copyText(text, document.getElementById('fillCopy'), 'Copy Filled Prompt', 'Copied!');
  });
  document.getElementById('fillGemini').addEventListener('click', () => {
    trackUsage(state.openId);
    const text = getFilledPromptRaw();
    const geminiUrl  = 'https://gemini.google.com/app?q=' + encodeURIComponent(text.substring(0, 2000));
    window.open(geminiUrl, '_blank');
  });

  document.getElementById('openAdd').addEventListener('click', openAdd);
  document.getElementById('addClose').addEventListener('click', closeAdd);
  document.getElementById('addCancel').addEventListener('click', closeAdd);
  document.getElementById('addSave').addEventListener('click', savePrompt);
  document.getElementById('addOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAdd();
  });

  const openStatsBtn = document.getElementById('openStats');
  if (openStatsBtn) openStatsBtn.addEventListener('click', openStats);
  document.getElementById('statsClose').addEventListener('click', closeStats);
  document.getElementById('statsDone').addEventListener('click', closeStats);
  document.getElementById('statsOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeStats();
  });

  /* Scanner Modal */
  const openScanBtn = document.getElementById('openScanner');
  if (openScanBtn) openScanBtn.addEventListener('click', openScanner);
  
  const scanClose = document.getElementById('scannerClose');
  if (scanClose) scanClose.addEventListener('click', closeScanner);
  
  const scanCancel = document.getElementById('scannerCancel');
  if (scanCancel) scanCancel.addEventListener('click', closeScanner);
  
  const scanOverlay = document.getElementById('scannerOverlay');
  if (scanOverlay) {
    scanOverlay.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeScanner();
    });
  }
  
  const scanGen = document.getElementById('scannerGenerate');
  if (scanGen) scanGen.addEventListener('click', generateScannerPrompt);
  
  const scanCopy = document.getElementById('scannerCopy');
  if (scanCopy) {
    scanCopy.addEventListener('click', () => {
      copyText(generatedScannerPrompt, scanCopy, 'Copy Prompt', 'Copied!');
    });
  }
  const scanGemini = document.getElementById('scannerGemini');
  if (scanGemini) {
    scanGemini.addEventListener('click', () => {
      const geminiUrl  = 'https://gemini.google.com/app?q=' + encodeURIComponent(generatedScannerPrompt.substring(0, 2000));
      window.open(geminiUrl, '_blank');
    });
  }

  const scanFolder = document.getElementById('scanFolder');
  if (scanFolder) {
    scanFolder.addEventListener('change', e => {
      const files = e.target.files;
      if (files.length === 0) {
        document.getElementById('scanFolderResult').textContent = 'No folder selected';
        scannedFilesText = "";
        return;
      }
      document.getElementById('scanFolderResult').textContent = `Scanned ${files.length} files`;
      let paths = [];
      for(let i=0; i<files.length; i++) {
        paths.push(files[i].webkitRelativePath || files[i].name);
      }
      scannedFilesText = "Local Folder Structure:\n" + paths.map(p => "- " + p).join('\n');
    });
  }

  const exportJira = document.getElementById('scannerExportJira');
  if (exportJira) exportJira.addEventListener('click', exportJiraCSV);

  /* Refine Modal */
  document.getElementById('refineClose').addEventListener('click', closeRefine);
  document.getElementById('refineCancel').addEventListener('click', closeRefine);
  document.getElementById('refineOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeRefine();
  });
  document.getElementById('refineCopy').addEventListener('click', () => {
    copyText(generatedRefineMaster, document.getElementById('refineCopy'), 'Copy Master Prompt', 'Copied!');
  });
  document.getElementById('refineGemini').addEventListener('click', () => {
    const geminiUrl  = 'https://gemini.google.com/app?q=' + encodeURIComponent(generatedRefineMaster.substring(0, 2000));
    window.open(geminiUrl, '_blank');
  });

  // Tab switching logic
  document.querySelectorAll('.m-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.m-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabId = 'tab-' + btn.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      document.getElementById(tabId).style.display = 'flex';
      
      // Clear results when switching
      if (btn.dataset.tab === 'intelligence') {
        document.getElementById('scannerTitle').textContent = 'User Story Intelligence 🧠';
      } else {
        document.getElementById('scannerTitle').textContent = 'Feature Breakdown 🪄';
      }
    });
  });

  const runIntel = document.getElementById('intelRun');
  if (runIntel) runIntel.addEventListener('click', runIntelAnalysis);

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    const isCollapsed = document.getElementById('sidebar').classList.contains('collapsed');
    collapseSidebar(!isCollapsed);
  });
  document.getElementById('sidebarExpandTab').addEventListener('click', () => {
    collapseSidebar(false);
  });

  const themeBtn = document.getElementById('darkModeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDetail(); closeAdd(); }
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const isCollapsed = document.getElementById('sidebar').classList.contains('collapsed');
      collapseSidebar(!isCollapsed);
    }
  });

  initExportImport();
}

/** ── User Story Intelligence ──────────────── */
function runIntelAnalysis() {
  const input = document.getElementById('intelInput').value.trim();
  if (!input) { showToast('⚠️ Please enter a story or ACs'); return; }

  const metrics = {
    invest: 0,
    risk: 'Low',
    tips: [],
    gherkin: ''
  };

  // 1. INVEST Check (naive keyword/structure matching)
  let investCount = 0;
  const hasRole = input.match(/As a/i);
  const hasAction = input.match(/I want to/i);
  const hasValue = input.match(/So that/i);
  const hasGherkin = input.match(/Given|When|Then/i);

  if (hasRole) investCount += 20;
  if (hasAction) investCount += 20;
  if (hasValue) investCount += 20;
  if (hasGherkin) investCount += 20;
  if (input.length > 50 && input.length < 800) investCount += 20;
  metrics.invest = investCount;

  // 2. Australian Banking Compliance Scan
  const risks = [
    { key: 'PII', label: 'Personally Identifiable Info' },
    { key: 'consent', label: 'Customer Consent (CDR)' },
    { key: 'APRA', label: 'Vault/Prudential reporting' },
    { key: 'AML', label: 'Anti-Money Laundering' },
    { key: 'KYC', label: 'Know Your Customer' },
    { key: 'direct entry', label: 'Legacy Payments' },
    { key: 'NPP', label: 'Real-time Payment risk' }
  ];

  const foundRisks = risks.filter(r => input.toLowerCase().includes(r.key.toLowerCase()));
  if (foundRisks.length > 2) metrics.risk = 'High';
  else if (foundRisks.length > 0) metrics.risk = 'Medium';

  // 3. Tips
  if (!hasRole) metrics.tips.push('Missing **Role**: "As a [user]..." clarify who the stakeholder is.');
  if (!hasAction) metrics.tips.push('Missing **Action**: "I want to [goal]..." define the intent.');
  if (!hasValue) metrics.tips.push('Missing **Value**: "So that [benefit]..." explain why this matters for the bank.');
  if (!hasGherkin) metrics.tips.push('Try adding Acceptance Criteria in **Gherkin format** (Given/When/Then).');
  
  if (foundRisks.length > 0) metrics.tips.push(`⚠️ **AU Compliance Risk**: Identified ${foundRisks.map(r=>r.label).join(', ')} keywords. Ensure privacy impact assessment is complete.`);
  
  if (input.length > 800) metrics.tips.push('This story looks too large. Consider breaking it down (E in INVEST).');
  
  if (metrics.invest === 100) {
    metrics.tips.push('✅ **Gold Standard**: Your story follows global standards perfectly. Ready for refinement!');
  }

  // 4. Fake Gherkin Transformation (Template-based)
  const roleMatch = input.match(/As a ([^,]+)/i);
  const actionMatch = input.match(/I want to ([^.]+)/i);
  const role = roleMatch ? roleMatch[1] : '[Role]';
  const action = actionMatch ? actionMatch[1] : '[Action]';
  
  metrics.gherkin = `Scenario: Successful ${action}\n  Given I am a logged-in ${role}\n  When I attempt to ${action}\n  Then the system should process the request successfully\n  And a confirmation is displayed.`;

  // Render
  document.getElementById('intelResultSection').style.display = 'block';
  document.getElementById('val-invest').textContent = metrics.invest + '%';
  document.getElementById('val-bank').textContent = metrics.risk + (metrics.risk === 'Low' ? ' (Low)' : ' (Warning)');
  
  const riskCard = document.getElementById('metric-bank');
  riskCard.className = 'intel-metric ' + (metrics.risk === 'High' ? 'risk-high' : metrics.risk === 'Medium' ? 'risk-med' : '');

  document.getElementById('intelGherkin').textContent = metrics.gherkin;
  document.getElementById('intelTips').innerHTML = metrics.tips.map(t => `
    <li>
      <i data-lucide="check-circle" style="width:14px;height:14px;color:var(--accent-lt);flex-shrink:0;margin-top:2px"></i>
      <span>${t}</span>
    </li>
  `).join('');
  lucide.createIcons();
  
  showToast('Analysis Complete');
}

/* ── Deep Link ──────────────────────────── */
function checkDeepLink() {
  const hash = window.location.hash.replace('#', '');
  if (hash && allPrompts().find(p => p.id === hash)) {
    setTimeout(() => openDetail(hash), 100);
    return;
  }
  
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    state.q = q;
    const inp = document.getElementById('searchInp');
    if (inp) {
      inp.value = q;
      document.getElementById('searchClear').style.display = 'block';
    }
    render(); // Ensure we render after setting query
  }
}

/* ── Boot ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Inject "Recent" category
  if (!CATEGORIES.find(c => c.id === 'recent')) {
    const allIdx = CATEGORIES.findIndex(c => c.id === 'all');
    CATEGORIES.splice(allIdx + 1, 0, { id: 'recent', label: 'Recently Used', icon: 'clock' });
  }

  // Merge V4 & HowTo Data
  if (typeof V4_CATEGORIES !== 'undefined') CATEGORIES.push(...V4_CATEGORIES);
  if (typeof V4_PROMPTS !== 'undefined') PROMPTS.push(...V4_PROMPTS);
  if (typeof HOWTO_CATEGORIES !== 'undefined') CATEGORIES.push(...HOWTO_CATEGORIES);
  if (typeof HOWTO_PROMPTS !== 'undefined') PROMPTS.push(...HOWTO_PROMPTS);
  if (typeof EXTRA_CATEGORIES !== 'undefined') CATEGORIES.push(...EXTRA_CATEGORIES);
  if (typeof EXTRA_PROMPTS !== 'undefined') PROMPTS.push(...EXTRA_PROMPTS);
  if (typeof V5_CATEGORIES !== 'undefined') CATEGORIES.push(...V5_CATEGORIES);
  if (typeof V5_PROMPTS !== 'undefined') PROMPTS.push(...V5_PROMPTS);

  loadStorage();
  initEvents();
  render();
  checkDeepLink();

  // Handle missing retro icon
  const iconImg = document.querySelector('#welcomeIcon img');
  if (iconImg) {
    iconImg.onerror = () => {
      iconImg.src = 'retro_nice_guy_icon.png'; // Fallback to previous if missing
      iconImg.onerror = () => {
        document.getElementById('welcomeIcon').innerHTML = '😊'; // Ultimate fallback
      };
    };
  }
});
