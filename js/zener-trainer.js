// Zener Card ESP Trainer — extracted from tools/zener-esp-trainer.html (plan 1.1.1)
// Usage: <script type="module">
//          import { initZenerTrainer } from '../js/zener-trainer.js';
//          initZenerTrainer();
//        </script>

export function initZenerTrainer() {
// === ZENER ESP TRAINER LOGIC ===
const SYMBOLS = [
    {id:'circle', label:'Circle', emoji:'⭕', css:'symbol-circle'},
    {id:'cross', label:'Cross', emoji:'✚', css:'symbol-plus'},
    {id:'waves', label:'Waves', emoji:'🌊', css:'symbol-waves'},
    {id:'square', label:'Square', emoji:'◼', css:'symbol-square'},
    {id:'star', label:'Star', emoji:'⭐', css:'symbol-star'}
];

const TRIALS_PER_SESSION = 25;
let mode = 'precognition';
let trial = 0;
let hits = 0;
let history = [];
let targetSymbol = null;
let awaitingGuess = false;

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('zener_history');
    if (saved) {
        try { history = JSON.parse(saved); } catch(e) { history = []; }
    }
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('zener_history', JSON.stringify(history.slice(-100)));
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (history.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#666;padding:1rem">No sessions yet</div>';
        return;
    }
    list.innerHTML = history.slice().reverse().map((h, i) => `
        <div class="history-item">
            <span>${h.timestamp} — ${h.mode} — ${h.trials} trials</span>
            <span class="${h.hits/h.trials > 0.2 ? 'correct' : 'wrong'}">${h.hits}/${h.trials} (${(h.hits/h.trials*100).toFixed(1)}%) p=${h.pval.toFixed(4)}</span>
        </div>
    `).join('');
}

function pickRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function updateStats() {
    document.getElementById('statTrials').textContent = `${trial} / ${TRIALS_PER_SESSION}`;
    document.getElementById('statHits').textContent = hits;
    document.getElementById('statRate').textContent = trial > 0 ? `${(hits/trial*100).toFixed(1)}%` : '0%';
    document.getElementById('statPval').textContent = trial > 0 ? binomialPValue(hits, trial).toFixed(4) : '1.0000';
}

function binomialPValue(k, n) {
    // P(X >= k) where X ~ Binomial(n, 0.2)
    let p = 0;
    for (let i = k; i <= n; i++) {
        p += combination(n, i) * Math.pow(0.2, i) * Math.pow(0.8, n - i);
    }
    return Math.min(p, 1);
}

function combination(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result = result * (n - k + i) / i;
    }
    return result;
}

function getSignificance(pval) {
    if (pval < 0.001) return {label:'Highly Significant ***', color:'var(--green)'};
    if (pval < 0.01) return {label:'Significant **', color:'var(--green)'};
    if (pval < 0.05) return {label:'Significant *', color:'var(--green)'};
    return {label:'Not Significant', color:'var(--text)'};
}

function setMode(newMode) {
    mode = newMode;
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === newMode);
    });
    resetSession();
}

function resetSession() {
    trial = 0;
    hits = 0;
    targetSymbol = null;
    awaitingGuess = false;
    updateStats();
    document.getElementById('cardDisplay').classList.remove('flash','reveal');
    document.getElementById('cardSymbol').innerHTML = '?';
    document.getElementById('cardDisplay').className = 'zener-card';
    document.querySelectorAll('.btn-primary').forEach(b => b.disabled = false);
    document.getElementById('nextTrial').disabled = true;
    document.getElementById('resultsPanel').classList.remove('visible');
}

function startTrial() {
    if (trial >= TRIALS_PER_SESSION) return;
    targetSymbol = pickRandomSymbol();
    awaitingGuess = true;
    
    const card = document.getElementById('cardDisplay');
    const symbolEl = document.getElementById('cardSymbol');
    
    if (mode === 'precognition') {
        // Show back of card
        symbolEl.innerHTML = '?';
        symbolEl.className = 'symbol';
        card.className = 'zener-card';
    } else {
        // Clairvoyance: show target immediately
        symbolEl.innerHTML = targetSymbol.emoji;
        symbolEl.className = `symbol ${targetSymbol.css}`;
        card.className = 'zener-card';
    }
    
    document.querySelectorAll('.btn-primary').forEach(b => b.disabled = false);
    document.getElementById('nextTrial').disabled = true;
}

function makeGuess(guessId) {
    if (!awaitingGuess || trial >= TRIALS_PER_SESSION) return;
    awaitingGuess = false;
    
    const guess = SYMBOLS.find(s => s.id === guessId);
    const correct = guess.id === targetSymbol.id;
    
    // Reveal card
    const symbolEl = document.getElementById('cardSymbol');
    const card = document.getElementById('cardDisplay');
    symbolEl.innerHTML = targetSymbol.emoji;
    symbolEl.className = `symbol ${targetSymbol.css}`;
    card.classList.add('reveal');
    
    if (correct) {
        hits++;
        card.classList.add('flash');
    } else {
        card.classList.add('flash');
        // Could add a 'wrong' flash class
    }
    
    trial++;
    updateStats();
    
    // Record in history
    history.push({
        trial: trial,
        guess: guess.id,
        target: targetSymbol.id,
        correct: correct,
        mode: mode,
        timestamp: new Date().toISOString()
    });
    
    document.getElementById('nextTrial').disabled = false;
    document.querySelectorAll('.btn-primary').forEach(b => b.disabled = true);
    
    if (trial >= TRIALS_PER_SESSION) {
        setTimeout(showResults, 1000);
    }
}

function showResults() {
    const pval = binomialPValue(hits, TRIALS_PER_SESSION);
    const sig = getSignificance(pval);
    
    document.getElementById('resTrials').textContent = TRIALS_PER_SESSION;
    document.getElementById('resHits').textContent = hits;
    document.getElementById('resRate').textContent = `${(hits/TRIALS_PER_SESSION*100).toFixed(1)}%`;
    document.getElementById('resPval').textContent = pval.toFixed(4);
    document.getElementById('resSig').textContent = sig.label;
    document.getElementById('resSig').style.color = sig.color;
    
    // Save session to history
    const session = {
        timestamp: new Date().toLocaleString(),
        mode: mode,
        trials: TRIALS_PER_SESSION,
        hits: hits,
        pval: pval
    };
    history.unshift(session);
    if (history.length > 50) history = history.slice(0, 50);
    saveHistory();
    renderHistory();
    
    document.getElementById('resultsPanel').classList.add('visible');
    document.getElementById('resultsPanel').scrollIntoView({behavior:'smooth'});
}

function newSession() {
    resetSession();
    startTrial();
}

// Event listeners
document.querySelectorAll('.mode-btn').forEach(b => {
    b.onclick = () => setMode(b.dataset.mode);
});

document.querySelectorAll('.btn-primary').forEach(b => {
    b.onclick = () => makeGuess(b.dataset.guess);
});

document.getElementById('nextTrial').onclick = startTrial;
document.getElementById('resetSession').onclick = resetSession;
document.getElementById('newSession').onclick = newSession;

// Initialize
loadHistory();
resetSession();
startTrial();
}
