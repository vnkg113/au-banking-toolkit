/**
 * Command Palette (Spotlight) Logic
 * Shortcut: Ctrl + K
 */

const paletteState = {
    isOpen: false,
    query: '',
    results: [],
    selectedIndex: 0
};

function initPalette() {
    window.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openPalette();
        }
        if (paletteState.isOpen) {
            if (e.key === 'Escape') closePalette();
            if (e.key === 'ArrowDown') movePaletteSelection(1);
            if (e.key === 'ArrowUp') movePaletteSelection(-1);
            if (e.key === 'Enter') executePaletteAction();
        }
    });

    const overlay = document.getElementById('paletteOverlay');
    const inp = document.getElementById('paletteInp');

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closePalette();
    });

    inp.addEventListener('input', () => {
        paletteState.query = inp.value;
        renderPaletteResults();
    });
}

function openPalette() {
    paletteState.isOpen = true;
    paletteState.query = '';
    paletteState.selectedIndex = 0;
    document.getElementById('paletteOverlay').classList.add('open');
    const inp = document.getElementById('paletteInp');
    inp.value = '';
    inp.focus();
    renderPaletteResults();
}

function closePalette() {
    paletteState.isOpen = false;
    document.getElementById('paletteOverlay').classList.remove('open');
}

function renderPaletteResults() {
    const q = paletteState.query.toLowerCase();
    const list = document.getElementById('paletteList');
    
    // Commands + Prompts
    const commands = [
        { type: 'cmd', label: 'Toggle Dark Mode', icon: 'moon', keywords: 'theme, light, dark, color', action: () => toggleTheme() },
        { type: 'cmd', label: 'Open Stats', icon: 'bar-chart-3', keywords: 'charts, metrics, analytics, heatmap', action: () => openStats() },
        { type: 'cmd', label: 'Add Custom Prompt', icon: 'plus', keywords: 'create, new, save', action: () => openAdd() },
        { type: 'cmd', label: 'Feature Breakdown', icon: 'sparkles', keywords: 'scan, analyze, requirements, magic', action: () => openScanner() },
        { type: 'cmd', label: 'Export Data', icon: 'download', keywords: 'download, backup, json', action: () => document.getElementById('exportBtn').click() }
    ];

    const prompts = allPrompts().map(p => ({
        type: 'prompt',
        label: p.title,
        icon: 'file-text',
        category: catLabel(p.category),
        keywords: (p.tags || []).join(', '),
        action: () => openDetail(p.id)
    }));

    paletteState.results = [...commands, ...prompts].filter(item => 
        item.label.toLowerCase().includes(q) || 
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.keywords && item.keywords.toLowerCase().includes(q))
    ).slice(0, 8);

    if (paletteState.results.length === 0) {
        list.innerHTML = `<div class="palette-empty">No results for "${escHtml(q)}"</div>`;
        return;
    }

    list.innerHTML = paletteState.results.map((item, i) => `
        <div class="palette-item ${i === paletteState.selectedIndex ? 'selected' : ''}" onclick="paletteAction(${i})">
            <i data-lucide="${item.icon}" class="palette-icon" style="width:16px;height:16px"></i>
            <div class="palette-info">
                <div class="palette-label">${escHtml(item.label)}</div>
                ${item.category ? `<div class="palette-cat">${escHtml(item.category)}</div>` : ''}
            </div>
            ${item.type === 'cmd' ? '<span class="palette-k">CMD</span>' : ''}
        </div>
    `).join('');

    lucide.createIcons();
}

function movePaletteSelection(dir) {
    const max = paletteState.results.length;
    if (max === 0) return;
    paletteState.selectedIndex = (paletteState.selectedIndex + dir + max) % max;
    renderPaletteResults();
    
    // Scroll into view if needed
    const selected = document.querySelector('.palette-item.selected');
    if (selected) selected.scrollIntoView({ block: 'nearest' });
}

function executePaletteAction() {
    const item = paletteState.results[paletteState.selectedIndex];
    if (item && item.action) {
        closePalette();
        item.action();
    }
}

function paletteAction(index) {
    paletteState.selectedIndex = index;
    executePaletteAction();
}

// Boot palette after other data is loaded
window.addEventListener('load', () => {
    initPalette();
});
