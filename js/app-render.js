// app-render.js - Script for dynamically rendering apps

// Function to render the apps grid on the home page
function renderAppsGrid() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;

    // Create a copy and shuffle it randomly (Chaos sort)
    const shuffledApps = [...appsData].sort(() => Math.random() - 0.5);

    shuffledApps.forEach(app => {
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

// Function to render the books section
function renderBooksSection() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;
    
    // Prevent duplicate rendering
    if (document.getElementById('books-section')) return;

    const section = document.createElement('div');
    section.id = 'books-section';
    section.style.maxWidth = '1400px';
    section.style.margin = '0 auto';
    section.style.padding = '0 2rem 3rem';
    
    // Title
    const title = document.createElement('h2');
    title.textContent = 'Books for Sale';
    title.style.fontFamily = 'var(--font-mono)';
    title.style.color = 'var(--text-primary)';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '2px';
    title.style.fontSize = '1.5rem';
    title.style.marginBottom = '2rem';
    title.style.borderTop = '1px solid var(--border-color)';
    title.style.paddingTop = '2rem';
    title.style.textAlign = 'center';
    
    section.appendChild(title);

    // Grid
    const booksGrid = document.createElement('div');
    booksGrid.className = 'apps-grid'; // Reuse existing grid class
    booksGrid.id = 'books-grid';
    
    if (typeof booksData !== 'undefined') {
        booksData.forEach(book => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.onclick = () => window.location.href = `pages/app-details.html?id=${book.id}`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${book.image}" alt="${book.name}" loading="lazy" class="app-image">
                </div>
                <div class="card-content">
                    <h4>${book.name}</h4>
                    <p>${book.description}</p>
                    <div class="card-footer">
                        <span class="status-indicator ${book.status}"></span>
                        <span class="status-text">${book.status === 'available' ? 'Available' : 'Coming Soon'}</span>
                    </div>
                </div>
            `;
            booksGrid.appendChild(card);
        });
    }

    section.appendChild(booksGrid);
    // Insert after apps-grid
    grid.parentNode.insertBefore(section, grid.nextSibling);
}

// Helper to load Hotmart Widget
function loadHotmartWidget() {
    if (document.getElementById('hotmart-widget-script')) return;
    
    const script = document.createElement('script');
    script.id = 'hotmart-widget-script';
    script.src = 'https://static.hotmart.com/checkout/widget.min.js';
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
    document.head.appendChild(link);
}

// Function to render details of a specific app
function renderAppDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');

    if (!appId) {
        document.body.innerHTML = '<h1>App not found</h1>';
        return;
    }

    // Search in appsData first, then booksData
    let item = appsData.find(a => a.id === appId);
    if (!item && typeof booksData !== 'undefined') {
        item = booksData.find(b => b.id === appId);
    }

    if (!item) {
        document.body.innerHTML = '<h1>Item not found</h1>';
        return;
    }

    // Update SEO (Title & Meta Description)
    if (item.seo) {
        document.title = item.seo.title;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', item.seo.description);
    }

    const detailsContainer = document.getElementById('app-details');
    if (!detailsContainer) return;

    // Determine Action Button (App Download or Hotmart Buy)
    let actionButton = '';
    if (item.hotmartLink) {
        actionButton = `<a onclick="return false;" href="${item.hotmartLink}" class="hotmart-fb hotmart__button-checkout"><img src='https://static.hotmart.com/img/btn-buy-green.png' alt="Comprar"></a>`;
        loadHotmartWidget();
    } else if (item.url) {
        actionButton = `<a href="${item.url}" class="cta-button primary" target="_blank">Download on Google Play</a>`;
    } else {
        actionButton = '<button class="cta-button disabled">Coming Soon</button>';
    }

    detailsContainer.innerHTML = `
        <div class="detail-header-layout">
            <img src="../${item.image}" alt="${item.name}" loading="lazy" class="detail-main-image">
            <div class="detail-header-info">
                <h2>${item.name}</h2>
                <p class="lead-text">${item.description}</p>
                ${actionButton}
            </div>
        </div>
    `;

    // Render detailed description if available
    const detailedContainer = document.getElementById('app-detailed-info');
    if (detailedContainer && item.detailedDescription) {
        detailedContainer.innerHTML = item.detailedDescription;
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
        renderBooksSection();
    } else if (document.getElementById('app-details')) {
        renderAppDetails();
    }
});