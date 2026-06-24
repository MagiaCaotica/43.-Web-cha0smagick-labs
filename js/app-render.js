// app-render.js - Script for dynamically rendering apps with SEO & GEO optimization
// Optimized for: buy chaos magick app, best occult android app, esoteric tools online, digital sigil generator

/**
 * Build a <picture> element for WebP + PNG fallback.
 * If src ends with .webp, generates <picture> with .webp source and .png fallback.
 * If src ends with .png, returns a plain <img>.
 * @param {string} src - Image path (relative or absolute)
 * @param {string} alt - Alt text
 * @param {string} className - CSS class
 * @param {string} [loading='lazy'] - loading attribute
 * @param {string} [width=''] - Image width
 * @param {string} [height=''] - Image height
 * @returns {string} HTML string
 */
function buildPictureHtml(src, alt, className, loading = 'lazy', width = '', height = '') {
    const isWebp = src.endsWith('.webp');
    const pngSrc = isWebp ? src.replace(/\.webp$/i, '.png') : src;
    const dims = (width ? ` width="${width}"` : '') + (height ? ` height="${height}"` : '');
    const imgTag = `<img src="${pngSrc}" alt="${alt}" loading="${loading}" class="${className}"${dims}>`;
    if (isWebp) {
        return `<picture>\n    <source srcset="${src}" type="image/webp">\n    ${imgTag}\n</picture>`;
    }
    return imgTag;
}



// SEO alt text mapping for app images
const appAltText = {
    'psi-gym': 'PSI GYM Zener Cards & ESP Training — buy chaos magick app for psychic development',
    'arcana-goetia': 'Arcana Goetia Ritual & Sigils — goetic grimoire app with 72 Solomon seals',
    'norse-rune-oracle': 'Norse Rune Oracle — Elder Futhark divination app with 12+ spreads',
    'lunar-phase-calculator': 'Lunar Phase Calculator — moon phases for magic, gardening & wellness Android app',
    'iching-oracle': 'I Ching Oracle — Book of Changes divination app with authentic three-coin method',
    'chaos-sigil-generator': 'Magick Chaos Sigil Generator — cryptographic sigil tool with ancient alphabets',
    'unofficial-rider-waite-tarot': 'Unofficial Rider Waite Tarot — complete offline tarot deck for Android',
    'dream-machine': 'Dream Machine Lucid Dreaming — induction, journal & reality checks app'
};

// Function to render the apps grid on the home page
function renderAppsGrid() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    // Keep original order (most popular/important first), not random
    const orderedApps = [...appsData];

    orderedApps.forEach((app, index) => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.google-play-btn')) {
                window.location.href = `/apps/${app.id}.html`;
            }
        });

        const loadingStrategy = index < 3 ? 'fetchpriority="high"' : 'loading="lazy"';
        const altText = appAltText[app.id] || app.name + ' — buy chaos magick android app';
        const priceShort = app.price ? app.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim() : '';
        const googlePlayBtn = app.url ? `<a href="${app.url}" class="cta-button primary google-play-btn" target="_blank" onclick="event.stopPropagation()">Buy Now ${priceShort}</a>` : '';
        card.innerHTML = `
            <div class="card-image-wrapper">
                ${buildPictureHtml(app.image, altText, 'app-image img-' + app.id.replace(/-/g, '-'), loadingStrategy.includes('fetchpriority') ? 'eager' : 'lazy', '300', '220')}
            </div>
            <div class="card-content">
                <h4>${app.name}${(app.id === 'psi-gym' || app.id === 'dream-machine') ? ' <span class="discount-badge">¡NUEVO!</span>' : ''}</h4>
                <p>${app.description}</p>
                <div class="card-footer">
                    <div class="status-container">
                        <span class="status-indicator ${app.status}"></span>
                        <span class="status-text">${app.status === 'available' ? 'Available' : 'Coming Soon'}</span>
                    </div>
                    ${app.price ? `<span class="card-price">${app.price.replace(/(\(.*?\))/, '<span class="discount-badge">$1</span>')}</span>` : ''}
                </div>
                ${googlePlayBtn}
            </div>
        `;

        fragment.appendChild(card);
    });
    grid.appendChild(fragment);
}

// Function to render the books section
function renderBooksSection() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;
    
    // Prevent duplicate rendering
    if (document.getElementById('books-section')) return;

    const section = document.createElement('div');
    section.id = 'books-section';
    section.className = 'collapsible-section';
    section.style.maxWidth = '1400px';
    section.style.margin = '0 auto';
    section.style.padding = '0 2rem 3rem';
    
    // Title
    const title = document.createElement('h2');
    title.className = 'section-toggle';
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
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'collapsible-content';

    const booksGrid = document.createElement('div');
    booksGrid.className = 'apps-grid'; // Reuse existing grid class
    booksGrid.id = 'books-grid';
    
    if (typeof booksData !== 'undefined') {
        // Sort books by price (low to high)
        // Note: We use match to extract only the numerical price for sorting
        const sortedBooks = [...booksData].sort((a, b) => {
            const priceA = parseFloat(a.price.match(/[\d.]+/)?.[0] || 0);
            const priceB = parseFloat(b.price.match(/[\d.]+/)?.[0] || 0);
            return priceA - priceB;
        });

        const fragment = document.createDocumentFragment();
        sortedBooks.forEach(book => {
            const card = document.createElement('a');
            card.className = 'app-card';
            card.href = `/apps/${book.id}.html`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    ${buildPictureHtml(book.image, book.name, 'app-image', 'lazy', '300', '220')}
                </div>
                <div class="card-content">
                    <h4>${book.name}</h4>
                    <p>${book.description}</p>
                    ${book.author ? `<div class="author-info">AUTHOR: ${book.author}</div>` : ''}
                    ${book.language ? `
                    <div class="language-info">
                        <span>LANGUAGE: ${book.language}</span>
                        <img src="https://flagcdn.com/w20/${book.languageFlag}.png" alt="${book.language}" class="lang-flag-mini">
                    </div>` : ''}
                    <div class="card-footer">
                        <div class="status-container">
                            <span class="status-indicator ${book.status}"></span>
                            <span class="status-text">${book.status === 'available' ? 'Available' : 'Coming Soon'}</span>
                        </div>
                        ${book.price ? `<span class="card-price">${book.price.replace(/(\(.*?\))/, '<span class="discount-badge">$1</span>')}</span>` : ''}
                    </div>
                </div>
            `;
            fragment.appendChild(card);
        });
        booksGrid.appendChild(fragment);
    }

    contentWrapper.appendChild(booksGrid);
    section.appendChild(contentWrapper);
    
    // Insert after the apps section (Cybermancy)
    const appsSection = grid.closest('.collapsible-section') || grid;
    appsSection.parentNode.insertBefore(section, appsSection.nextSibling);
}

// Helper to inject JSON-LD Schema (preserves existing schemas, adds new ones)
function injectSchema(schema, schemaId) {
    // If a schema with this id already exists, remove it first
    if (schemaId) {
        const existing = document.querySelector(`script[data-schema-id="${schemaId}"]`);
        if (existing) existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    if (schemaId) script.setAttribute('data-schema-id', schemaId);
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
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
        window.location.href = '/404.html';
        return;
    }

    // Search in appsData first, then booksData
    let item = appsData.find(a => a.id === appId);
    if (!item && typeof booksData !== 'undefined') {
        item = booksData.find(b => b.id === appId);
    }

    if (!item) {
        window.location.href = '/404.html';
        return;
    }

    const baseUrl = 'https://cha0smagicklabs.com';

    // Update SEO (Title, Meta Description, Open Graph, Canonical)
    if (item.seo) {
        document.title = item.seo.title;
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', item.seo.description);

        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', item.seo.keywords || '');

        // Update OG tags for social sharing
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', item.seo.title);
        
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', item.seo.description);

        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', `${baseUrl}/${item.image.replace('../', '')}`);

        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', window.location.href);

        // Update canonical to clean URL (strip query params for canonical)
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            const cleanUrl = `${baseUrl}/apps/${item.id}.html`;
            canonical.setAttribute('href', cleanUrl);
        }
    }

    // Generate and Inject Schema.org Markup (GEO-optimized with complete data)
    let schema = {};
    const absoluteImageUrl = `${baseUrl}/${item.image.replace('../', '')}`;
    const itemUrl = window.location.href;

    if (item.type === 'book') {
        schema = {
            "@context": "https://schema.org",
            "@type": "Book",
            "@id": itemUrl,
            "name": item.name,
            "description": item.seo.description,
            "image": absoluteImageUrl,
            "url": itemUrl,
            "author": {
                "@type": "Person",
                "name": item.author || "Frater Alekos",
                "knowsAbout": ["Chaos Magick", "Cybermancy", "Occultism", "Esotericism"]
            },
            "inLanguage": item.language === "Spanish" ? "es" : "en",
            "bookFormat": "https://schema.org/EBook",
            "offers": {
                "@type": "Offer",
                "url": item.hotmartLink,
                "price": item.price ? item.price.match(/[\d.]+/)[0] : "3.99",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31"
            },
            "potentialAction": {
                "@type": "BuyAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": item.hotmartLink,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/IOSPlatform",
                        "http://schema.org/AndroidPlatform"
                    ]
                }
            }
        };
    } else { // It's an app (SoftwareApplication with complete GEO data)
        const priceNum = item.price ? item.price.match(/[\d.]+/)[0] : "0.00";
        const appName = item.name;
        schema = {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": itemUrl + "#softwareapplication",
            "name": appName,
            "operatingSystem": "Android",
            "applicationCategory": "LifestyleApplication",
            "applicationSubCategory": "Esoteric Application",
            "image": absoluteImageUrl,
            "description": item.seo.description,
            "url": item.url,
            "downloadUrl": item.url,
            "softwareVersion": "1.0",
            "installUrl": item.url,
            "offers": {
                "@type": "Offer",
                "price": priceNum,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31",
                "url": item.url
            },
            "author": {
                "@type": "Organization",
                "name": "Cha0smagick Labs",
                "url": baseUrl
            },
            "publisher": {
                "@type": "Organization",
                "name": "Cha0smagick Labs"
            },
            "requirements": "Android 6.0+",
            "featureList": item.seo.keywords ? item.seo.keywords.split(", ") : []
        };
    }
    injectSchema(schema, 'app-schema');

    // Also inject Product schema for Google Shopping / rich results
    if (item.type !== 'book') {
        const productSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": itemUrl + "#product",
            "name": item.name,
            "description": item.seo.description,
            "image": absoluteImageUrl,
            "brand": {
                "@type": "Brand",
                "name": "Cha0smagick Labs"
            },
            "offers": {
                "@type": "Offer",
                "price": item.price ? item.price.match(/[\d.]+/)[0] : "0.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": item.url
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "reviewCount": "42",
                "bestRating": "5",
                "worstRating": "1"
            }
        };
        injectSchema(productSchema, 'product-schema');
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

    if (item.onlineUrl) {
        actionButton += ` <a href="${item.onlineUrl}" class="cta-button secondary" target="_blank" style="margin-left: 10px;">use it for free</a>`;
    }

    let screenshotsHtml = '';
    if (item.screenshots && item.screenshots.length > 0) {
        const imgs = item.screenshots.map(src =>
            `<img src="${src}" alt="${item.name} screenshot" loading="lazy" class="screenshot-item">`
        ).join('');
        screenshotsHtml = `
            <div class="screenshot-gallery">
                <div class="screenshot-grid">${imgs}</div>
            </div>
        `;
    }

    const centeredActionButton = actionButton ? `<div class="cta-centered-wrapper">${actionButton}</div>` : '';

    detailsContainer.innerHTML = `
        <div class="detail-header-layout">
            ${buildPictureHtml('../' + item.image, item.name, 'detail-main-image', 'lazy')}
            <div class="detail-header-info">
                <h2>${item.name}${(item.id === 'psi-gym' || item.id === 'dream-machine') ? ' <span class="discount-badge">¡NUEVO!</span>' : ''}</h2>
                <p class="lead-text">${item.description}</p>
                ${item.author ? `<div class="author-info">AUTHOR: ${item.author}</div>` : ''}
                ${item.language ? `
                <div class="language-info">
                    <span>LANGUAGE: ${item.language}</span>
                    <img src="https://flagcdn.com/w20/${item.languageFlag}.png" alt="${item.language}" class="lang-flag-mini">
                </div>` : ''}
                ${item.price ? `<div class="detail-price">${item.price.replace(/(\(.*?\))/, '<span class="discount-badge">$1</span>')}</div>` : ''}
            </div>
        </div>
        ${centeredActionButton}
        ${screenshotsHtml}
    `;

    // Render detailed description if available
    const detailedContainer = document.getElementById('app-detailed-info');
    if (detailedContainer && item.detailedDescription) {
        detailedContainer.innerHTML = item.detailedDescription + centeredActionButton;
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

// Function to render ItemList + Product schema for main page (GEO optimization)
function renderItemListSchema() {
    let allItems = [...appsData];
    if (typeof booksData !== 'undefined') {
        allItems = [...allItems, ...booksData];
    }

    const baseUrl = 'https://cha0smagicklabs.com';

    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Cha0smagick Labs - Apps de Magia del Caos",
        "description": "Colección de apps esotéricas para Android y libros PDF sobre magia del caos, sigilos digitales, runas y tecnomancia.",
        "url": baseUrl + "/",
        "numberOfItems": allItems.length,
        "itemListElement": allItems.map((item, index) => {
            const itemType = item.type === 'book' ? 'Book' : 'SoftwareApplication';
            const absoluteImageUrl = `${baseUrl}/${item.image}`;
            const itemUrl = `${baseUrl}/apps/${item.id}.html`;
            
            return {
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": itemType,
                    "name": item.name,
                    "url": itemUrl,
                    "image": absoluteImageUrl,
                    "description": item.description,
                    ...(item.type === 'book' ? {
                        "author": {
                            "@type": "Person",
                            "name": item.author || "Frater Alek0s"
                        }
                    } : {
                        "operatingSystem": "Android",
                        "applicationCategory": "LifestyleApplication",
                        "offers": {
                            "@type": "Offer",
                            "price": item.price ? item.price.match(/[\d.]+/)[0] : "0.00",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock"
                        }
                    })
                }
            };
        })
    };
    injectSchema(itemList);
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

// Function to initialize collapsible sections
function initCollapsibleSections() {
    const toggles = document.querySelectorAll('.section-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const section = toggle.closest('.collapsible-section');
            if (section) {
                section.classList.toggle('active');
            }
        });
    });
}

// Function to render "You May Also Like" cross-selling on detail pages
function renderAlsoLike(currentId) {
    const alsoGrid = document.getElementById('also-like-grid');
    if (!alsoGrid || !appsData) return;

    const others = appsData.filter(a => a.id !== currentId).slice(0, 3);
    const fragment = document.createDocumentFragment();

    others.forEach(app => {
        const card = document.createElement('a');
        card.className = 'app-card';
        card.href = `/apps/${app.id}.html`;
        const priceShort = app.price ? app.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim() : '';
        card.innerHTML = `
            <div class="card-image-wrapper">
                ${buildPictureHtml('../' + app.image, appAltText[app.id] || app.name, 'app-image', 'lazy', '300', '220')}
            </div>
            <div class="card-content">
                <h4>${app.name}</h4>
                <p>${app.description}</p>
                <div class="card-footer">
                    <div class="status-container">
                        <span class="status-indicator ${app.status}"></span>
                        <span class="status-text">${app.status === 'available' ? 'Available' : 'Coming Soon'}</span>
                    </div>
                    ${app.price ? `<span class="card-price">${app.price}</span>` : ''}
                </div>
                ${app.url ? `<span class="cta-button primary google-play-btn" style="display:block;text-align:center;margin-top:1rem;">Buy Now ${priceShort}</span>` : ''}
            </div>
        `;
        fragment.appendChild(card);
    });
    alsoGrid.appendChild(fragment);
}

// Execute the appropriate function based on the page
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('apps-grid');
    const detailsView = document.getElementById('app-details');

    renderLanguageGadget(); // Render language gadget on all pages
    initVisitorCounter();   // Initialize visitor counter
    
    // Transformación dinámica de secciones estáticas existentes en secciones colapsables
    // Secciones objetivo: Cybermancy (Apps), About Us y Contact Us
    const sectionsToCollapse = ['Cybermancy', 'About Us', 'Contact Us'];
    
    sectionsToCollapse.forEach(titleText => {
        const h2 = Array.from(document.querySelectorAll('h2, h3')).find(h => 
            h.textContent.toLowerCase().includes(titleText.toLowerCase())
        );
        
        if (h2 && h2.parentElement && !h2.parentElement.classList.contains('collapsible-section')) {
            const section = h2.parentElement;
            section.classList.add('collapsible-section');
            h2.classList.add('section-toggle');
            
            const content = document.createElement('div');
            content.className = 'collapsible-content';
            
            // Mueve todos los elementos hermanos después del H2 al contenedor colapsable
            while (h2.nextSibling) {
                content.appendChild(h2.nextSibling);
            }
            section.appendChild(content);
        }
    });

    if (grid) {
        renderAppsGrid();
        renderBooksSection();
        setTimeout(renderItemListSchema, 100); // Defer non-critical SEO task
    } else if (detailsView) {
        const urlParams = new URLSearchParams(window.location.search);
        const appId = urlParams.get('id');
        renderAppDetails();
        if (appId) renderAlsoLike(appId);
    }
    initCollapsibleSections(); // Initialize toggles after dynamic content is rendered
});