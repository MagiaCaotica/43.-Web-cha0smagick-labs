// app-render.js - Script for dynamically rendering apps

// Function to render the apps grid on the home page
function renderAppsGrid() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;

    appsData.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.onclick = () => window.location.href = `pages/app-details.html?id=${app.id}`;

        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${app.image}" alt="${app.name}" loading="lazy" class="app-image img-${app.id.replace(/-/g, '-')}">
            </div>
            <div class="card-content">
                <h4>${app.name}</h4>
                <p>${app.description}</p>
                <div class="card-footer">
                    <span class="status-indicator ${app.status}"></span>
                    <span class="status-text">${app.status === 'available' ? 'Available' : 'Coming Soon'}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Function to render details of a specific app
function renderAppDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');

    if (!appId) {
        document.body.innerHTML = '<h1>App not found</h1>';
        return;
    }

    const app = appsData.find(a => a.id === appId);
    if (!app) {
        document.body.innerHTML = '<h1>App not found</h1>';
        return;
    }

    const detailsContainer = document.getElementById('app-details');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <div class="detail-header-layout">
            <img src="../${app.image}" alt="${app.name}" loading="lazy" class="detail-main-image">
            <div class="detail-header-info">
                <h2>${app.name}</h2>
                <p class="lead-text">${app.description}</p>
                ${app.url ? `<a href="${app.url}" class="cta-button primary" target="_blank">Download on Google Play</a>` : '<button class="cta-button disabled">Coming Soon</button>'}
            </div>
        </div>
    `;

    // Render detailed description if available
    const detailedContainer = document.getElementById('app-detailed-info');
    if (detailedContainer && app.detailedDescription) {
        detailedContainer.innerHTML = app.detailedDescription;
    }
}

// Function to render the language gadget dynamically on all pages
function renderLanguageGadget() {
    const header = document.querySelector('header');
    if (!header) return;

    // Prevent duplicate rendering
    if (document.querySelector('.language-gadget')) return;

    const gadget = document.createElement('div');
    gadget.className = 'language-gadget';

    const languages = [
        { code: 'en', name: 'English', flag: 'gb' },
        { code: 'es', name: 'Spanish', flag: 'es' },
        { code: 'fr', name: 'French', flag: 'fr' },
        { code: 'de', name: 'German', flag: 'de' },
        { code: 'it', name: 'Italian', flag: 'it' },
        { code: 'nl', name: 'Dutch', flag: 'nl' },
        { code: 'ru', name: 'Russian', flag: 'ru' },
        { code: 'pt', name: 'Portuguese', flag: 'br' },
        { code: 'ja', name: 'Japanese', flag: 'jp' },
        { code: 'ko', name: 'Korean', flag: 'kr' },
        { code: 'ar', name: 'Arabic', flag: 'sa' },
        { code: 'zh-CN', name: 'Chinese', flag: 'cn' }
    ];

    let html = '';
    languages.forEach(lang => {
        // English is active by default on the source site
        const isActive = lang.code === 'en' ? 'active' : '';
        // Use window.location.href to translate the current page
        const url = lang.code === 'en' ? '#' : `https://translate.google.com/translate?sl=en&tl=${lang.code}&u=${encodeURIComponent(window.location.href)}`;
        const onclick = lang.code === 'en' ? 'window.location.reload(); return false;' : `window.open('${url}'); return false;`;

        html += `<a href="#" onclick="${onclick}" title="${lang.name}" class="lang-link ${isActive}"><img src="https://flagcdn.com/w20/${lang.flag}.png" alt="${lang.name}" class="lang-flag"></a>`;
    });

    gadget.innerHTML = html;
    // Insert at the top of the header
    header.insertBefore(gadget, header.firstChild);
}

// Function to initialize the visitor counter
function initVisitorCounter() {
    const counterElement = document.getElementById('visitor-count');
    if (!counterElement) return;

    // Simulate a persistent counter using localStorage
    // Reset counter to start from 1 (real visit count simulation)
    let count = localStorage.getItem('chaos_visit_count_v2');
    
    if (!count) {
        count = 1;
    } else {
        count = parseInt(count) + 1;
    }

    localStorage.setItem('chaos_visit_count_v2', count);
    counterElement.textContent = count.toString().padStart(6, '0');
}

// Execute the appropriate function based on the page
document.addEventListener('DOMContentLoaded', () => {
    renderLanguageGadget(); // Render language gadget on all pages
    initVisitorCounter();   // Initialize visitor counter
    if (document.getElementById('apps-grid')) {
        renderAppsGrid();
    } else if (document.getElementById('app-details')) {
        renderAppDetails();
    }
});