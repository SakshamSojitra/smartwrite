/**
 * SmartWrite - Intelligent Grammar & Spell Checker
 * Frontend JavaScript - Handles text analysis, highlighting, and suggestions
 */

// ========== DOM Elements ==========
const textInput = document.getElementById('textInput');
const highlightLayer = document.getElementById('highlightLayer');
const checkBtn = document.getElementById('checkBtn');
const clearBtn = document.getElementById('clearBtn');
const suggestionsPanel = document.getElementById('suggestionsPanel');
const suggestionsList = document.getElementById('suggestionsList');
const hoverTooltip = document.getElementById('hoverTooltip');
const wordCountEl = document.getElementById('wordCount');
const charCountEl = document.getElementById('charCount');
const readabilityEl = document.getElementById('readabilityScore');
const errorCountEl = document.getElementById('errorCount');

// ========== State ==========
let currentErrors = []; // Stores error objects from API
let hoveredError = null;

// ========== Utility: Word Count ==========
function countWords(text) {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// ========== Utility: Character Count ==========
function countChars(text) {
    return text ? text.length : 0;
}

// ========== Utility: Readability Score (Flesch-Kincaid Grade Level approximation) ==========
// Simplified: based on avg word length and sentence length
function getReadabilityScore(text) {
    if (!text || !text.trim()) return null;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length < 5) return null;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / (sentences.length || 1);
    const avgSyllablesPerWord = words.reduce((acc, w) => {
        const syl = Math.max(1, w.length <= 3 ? 1 : Math.ceil(w.length / 3));
        return acc + syl;
    }, 0) / words.length;
    // Flesch-Kincaid approximation
    const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
    return Math.max(1, Math.min(12, Math.round(gradeLevel)));
}

// ========== Update Stats Bar ==========
function updateStats(errorsCount = null) {
    const text = textInput.value;
    wordCountEl.textContent = countWords(text);
    charCountEl.textContent = countChars(text);
    const readScore = getReadabilityScore(text);
    readabilityEl.textContent = readScore !== null ? `Grade ${readScore}` : '—';
    if (errorsCount !== null) {
        errorCountEl.textContent = errorsCount;
    }
}

// ========== Sync Highlight Layer with Textarea ==========
// The highlight layer mirrors the textarea content so we can render spans with underlines
function syncHighlightLayer() {
    const text = textInput.value;
    highlightLayer.textContent = '';
    if (!text) {
        highlightLayer.appendChild(document.createTextNode(''));
        return;
    }
    // Build content with error highlights
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    // Sort errors by offset to avoid overlapping
    const sortedErrors = [...currentErrors].sort((a, b) => a.offset - b.offset);
    for (const err of sortedErrors) {
        const { offset, length, type, context } = err;
        if (offset < lastIndex) continue; // Skip overlapping
        const before = text.slice(lastIndex, offset);
        const errorText = text.slice(offset, offset + length);
        if (before) fragment.appendChild(document.createTextNode(before));
        const span = document.createElement('span');
        const errType = (err.rule?.category?.id || '').includes('SPELL') ? 'spelling' : 'grammar';
        span.className = `highlight-${errType}`;
        span.dataset.offset = offset;
        span.dataset.length = length;
        span.dataset.message = err.message || '';
        span.dataset.suggestions = JSON.stringify(err.replacements || []);
        span.textContent = errorText;
        fragment.appendChild(span);
        lastIndex = offset + length;
    }
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    highlightLayer.appendChild(fragment);
}

// ========== Clear Highlights ==========
function clearHighlights() {
    currentErrors = [];
    syncHighlightLayer();
    renderSuggestionsList([]);
    updateStats(0);
    suggestionsList.innerHTML = `
        <p class="suggestions-empty">Click "Check Grammar" to analyze your text.</p>
    `;
}

// ========== API Call: Check Grammar ==========
async function checkGrammar() {
    const text = textInput.value.trim();
    if (!text) {
        alert('Please enter some text to check.');
        return;
    }
    checkBtn.disabled = true;
    checkBtn.innerHTML = '<span class="spinner"></span> Checking...';
    try {
        const res = await fetch('/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Check failed');
        currentErrors = data.matches || [];
        syncHighlightLayer();
        renderSuggestionsList(currentErrors);
        updateStats(currentErrors.length);
    } catch (err) {
        console.error(err);
        alert('Could not check grammar. Please try again. Error: ' + err.message);
    } finally {
        checkBtn.disabled = false;
        checkBtn.innerHTML = '<span class="btn-icon">✓</span> Check Grammar';
    }
}

// ========== Render Suggestions List ==========
function renderSuggestionsList(errors) {
    if (!errors.length) {
        suggestionsList.innerHTML = `
            <p class="suggestions-empty success">✓ No errors found! Your text looks good.</p>
        `;
        return;
    }
    const fullText = textInput.value;
    suggestionsList.innerHTML = errors.map(err => {
        const type = (err.rule?.category?.id || '').includes('SPELL') ? 'spelling' : 'grammar';
        const replacements = (err.replacements || []).slice(0, 5).map(r => (typeof r === 'string' ? r : r.value) || '').filter(Boolean);
        const message = err.message || err.rule?.description || 'Error';
        const errorText = fullText.slice(err.offset, err.offset + err.length) || '';
        const chips = replacements.map(r => `<button class="suggestion-chip" data-replace="${escapeHtml(r)}" data-offset="${err.offset}" data-length="${err.length}">${escapeHtml(r)}</button>`).join('');
        return `
            <div class="suggestion-card ${type}">
                <div class="error-text">"${escapeHtml(errorText)}"</div>
                <div class="error-message">${escapeHtml(message)}</div>
                <div class="suggestions">${chips}</div>
            </div>
        `;
    }).join('');
    // Attach click handlers for suggestion chips
    suggestionsList.querySelectorAll('.suggestion-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const replace = btn.dataset.replace;
            const offset = parseInt(btn.dataset.offset, 10);
            const length = parseInt(btn.dataset.length, 10);
            applySuggestion(offset, length, replace);
        });
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========== Apply Suggestion (replace text) ==========
function applySuggestion(offset, length, replacement) {
    const text = textInput.value;
    const before = text.slice(0, offset);
    const after = text.slice(offset + length);
    textInput.value = before + replacement + after;
    // Re-run check or remove this error from list
    currentErrors = currentErrors.filter(e => !(e.offset === offset && e.length === length));
    syncHighlightLayer();
    renderSuggestionsList(currentErrors);
    updateStats(currentErrors.length);
}

// ========== Hover Tooltip ==========
function showTooltip(el, x, y) {
    const msg = el.dataset.message;
    const suggestions = JSON.parse(el.dataset.suggestions || '[]');
    const texts = suggestions.slice(0, 3).map(s => (typeof s === 'string' ? s : s.value) || '').filter(Boolean);
    const text = texts.join(', ') || msg;
    hoverTooltip.textContent = text || msg || 'See suggestions panel';
    hoverTooltip.classList.add('visible');
    hoverTooltip.style.left = `${x}px`;
    hoverTooltip.style.top = `${y + 24}px`;
}

function hideTooltip() {
    hoverTooltip.classList.remove('visible');
}

// ========== Event Listeners ==========

// Input: update stats and sync layer
textInput.addEventListener('input', () => {
    updateStats();
    // If we had errors, clear them when user edits (or we could re-check)
    if (currentErrors.length > 0) {
        currentErrors = [];
        syncHighlightLayer();
        renderSuggestionsList([]);
        errorCountEl.textContent = '0';
    }
});

// Check button
checkBtn.addEventListener('click', checkGrammar);

// Clear button
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    clearHighlights();
    updateStats();
});

// Hover on highlighted errors - use event delegation on highlight layer
highlightLayer.addEventListener('mouseover', (e) => {
    const span = e.target.closest('[data-offset]');
    if (!span) return;
    hoveredError = span;
});

highlightLayer.addEventListener('mousemove', (e) => {
    if (!hoveredError) return;
    showTooltip(hoveredError, e.clientX, e.clientY);
});

highlightLayer.addEventListener('mouseout', () => {
    hoveredError = null;
    hideTooltip();
});

// Click on highlight span: focus textarea and select the error text
highlightLayer.addEventListener('click', (e) => {
    const span = e.target.closest('[data-offset]');
    if (!span) return;
    e.preventDefault();
    textInput.focus();
    const offset = parseInt(span.dataset.offset, 10);
    const length = parseInt(span.dataset.length, 10);
    textInput.setSelectionRange(offset, offset + length);
});

// Hover on highlight spans (spans have pointer-events: auto, layer on top of textarea)

// Let me implement: put highlight layer ON TOP of textarea. CSS: .textarea-wrapper { position: relative }. .text-input { position: relative; z-index: 1 }. .highlight-layer { position: absolute; top:0; left:0; right:0; bottom:0; z-index: 2; pointer-events: none; }. .highlight-layer span { pointer-events: auto; cursor: pointer; }
// Then span hover will work! Click on span - we could either apply the first suggestion or focus textarea. Let me do: hover shows tooltip, click on suggestion chip in panel applies it. Click on span could focus textarea - but that might be confusing. Simpler: hover on span shows tooltip. Click does nothing special (events hit span, we could preventDefault and do nothing, so user would need to click elsewhere to type - bad). So we need clicks to pass through. pointer-events: none on layer, auto on spans - then click on span hits span. If we want click to pass through to textarea, we need pointer-events: none on everything. So we can't have both hover on span and click-through. The only way is to use mouse move on the wrapper and calculate which error we're over based on coordinates - complex.
// I'll go with: highlight layer on top, pointer-events: none on layer, pointer-events: auto on spans. On span hover, show tooltip. On span click - we could make it focus the textarea and set cursor. To do that we need to focus the textarea and use setSelectionRange(offset, offset+length). Let me do that. So: hover = tooltip, click = select the error in textarea (and focus). We need the textarea to be focusable - it is. And we need to programmatically set the selection. Good.

// Update structure: highlight layer on top, spans with pointer-events: auto.