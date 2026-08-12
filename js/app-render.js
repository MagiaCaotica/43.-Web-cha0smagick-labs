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
    'dream-machine': 'Dream Machine Lucid Dreaming — induction, journal & reality checks app',
    'astral-lab': 'Astral Lab Natal Chart & Astrology — natal chart generator for Android',
    'eerieroads': 'Eerie Roads Mysterious Paths — intention manifestation map & chaos GPS for Android',
    'lucid-dream': 'Lucid Dream Astral Projection — binaural beats, dream journal & astral projection app for Android',
    'noctem-tools': 'NOCTEM Suite Profesional para la Investigación Paranormal — SLS camera, EVP recorder & ghost hunting app for Android'
};

/* ========================================================================
   MEASUREMENT + ATTRIBUTION HELPERS
   ======================================================================== */

// Safe GA4 dispatch — never throws if gtag has not loaded on this template.
function cmTrack(eventName, params) {
    try {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params || {});
        }
    } catch (e) { /* analytics must never break rendering */ }
}

// Delegates to the canonical addUTM() from shared.js / apps-data.js.
// Falls back to a local implementation so this file works standalone
// (app detail pages load app-render.js without shared.js).
function cmUTM(url, campaign) {
    if (typeof window.addUTM === 'function') return window.addUTM(url, campaign);
    if (!url || typeof url !== 'string' || url.indexOf('utm_source=') !== -1) return url;
    var sep = url.indexOf('?') !== -1 ? '&' : '?';
    return url + sep + 'utm_source=cha0smagicklabs&utm_medium=website&utm_campaign=' +
        encodeURIComponent(String(campaign || 'site_cta').replace(/[^a-zA-Z0-9_\-]/g, '_'));
}

// Numeric price for GA4 `value` / `price` fields ("$3.99 USD" -> 3.99).
function cmPriceNum(price) {
    if (!price) return 0;
    var m = String(price).match(/[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
}

// Campaign slug from an item id ("psi-gym" -> "app_psi_gym").
function cmCampaign(item) {
    var prefix = item && item.type === 'book' ? 'book_' : 'app_';
    return prefix + String((item && item.id) || 'unknown').replace(/-/g, '_');
}

// Attributes shared by every outbound product link: UTM-tagged href, affiliate
// opt-in (picked up by the global listener in shared.js) and a product label.
function cmProductLinkAttrs(item) {
    return 'data-affiliate="true" data-product="' + ((item && item.id) || '') + '"';
}

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
        const playIcon = '<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px;"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>';
        const gridUrl = app.url ? cmUTM(app.url, cmCampaign(app) + '_grid') : '';
        const googlePlayBtn = app.url ? `<a href="${gridUrl}" class="play-store-btn compact pulse" target="_blank" ${cmProductLinkAttrs(app)} onclick="event.stopPropagation()">${playIcon} GET IT ON PLAY STORE</a>` : '';
        card.innerHTML = `
            <div class="card-image-wrapper">
                ${buildPictureHtml(app.image, altText, 'app-image img-' + app.id.replace(/-/g, '-'), loadingStrategy.includes('fetchpriority') ? 'eager' : 'lazy', '300', '220')}
            </div>
            <div class="card-content">
                <h4>${app.name}${(app.id === 'psi-gym' || app.id === 'dream-machine' || app.id === 'astral-lab' || app.id === 'eerieroads' || app.id === 'lucid-dream' || app.id === 'noctem-tools') ? ' <span class="discount-badge">NEW!</span>' : ''}</h4>
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

    // GA4: catalogue impression for the whole grid.
    cmTrack('view_item_list', {
        item_list_id: 'apps_grid',
        item_list_name: 'Android Apps Catalogue',
        items: orderedApps.slice(0, 20).map(function (app, i) {
            return {
                item_id: app.id,
                item_name: app.name,
                item_category: 'app',
                price: cmPriceNum(app.price),
                currency: 'USD',
                index: i
            };
        })
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
    section.className = 'collapsible-section active';
    section.style.maxWidth = '1400px';
    section.style.margin = '0 auto';
    section.style.padding = '0 2rem 3rem';
    
    // Title
    const title = document.createElement('h2');
    title.className = 'section-toggle';
    title.textContent = 'Complete Your Collection — Books';
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
            card.href = `/books/${book.id}.html`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    ${buildPictureHtml(book.image, book.name, 'app-image', 'lazy', '300', '220')}
                </div>
                <div class="card-content">
                    <h4>${book.name}${(book.id === 'codex-chaoticus-pdf' || book.id === 'tarot-chaos-pdf' || book.id === 'mind-the-gap-pdf') ? ' <span class="discount-badge">NEW!</span>' : ''}</h4>
                    <p>${book.description}</p>
                    ${book.author ? `<div class="author-info">AUTHOR: ${book.author}</div>` : ''}
                    ${book.language ? `
                    <div class="language-info">
                        <span>LANGUAGE: ${book.language}</span>
                        ${book.languageFlag.split(',').map(f => `<img src="https://flagcdn.com/w20/${f.trim()}.png" alt="${book.language}" class="lang-flag-mini">`).join('')}
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
            const itemDir = item.type === 'book' ? 'books' : 'apps';
            const cleanUrl = `${baseUrl}/${itemDir}/${item.id}.html`;
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
        };
        injectSchema(productSchema, 'product-schema');
    }

    const detailsContainer = document.getElementById('app-details');
    if (!detailsContainer) return;

    /* --------------------------------------------------------------
       GA4: view_item — the single most important product-page signal.
       Fires once per detail render with the full item payload so GA4 can
       build the product funnel (view_item -> purchase_click).
       -------------------------------------------------------------- */
    const itemPriceNum = cmPriceNum(item.price);
    cmTrack('view_item', {
        currency: 'USD',
        value: itemPriceNum,
        items: [{
            item_id: item.id,
            item_name: item.name,
            item_category: item.type === 'book' ? 'book' : 'app',
            item_brand: 'Cha0smagick Labs',
            price: itemPriceNum,
            currency: 'USD',
            quantity: 1
        }]
    });
    if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
            content_ids: [item.id],
            content_name: item.name,
            content_type: 'product',
            value: itemPriceNum,
            currency: 'USD'
        });
    }

    // Determine Action Button (App Download or Hotmart Buy)
    let actionButton = '';
    const detailCampaign = cmCampaign(item) + '_detail';
    if (item.hotmartLink) {
        const hotmartUrl = cmUTM(item.hotmartLink, detailCampaign);
        actionButton = `<a onclick="return false;" href="${hotmartUrl}" class="hotmart-fb hotmart__button-checkout" ${cmProductLinkAttrs(item)}><img src='https://static.hotmart.com/img/btn-buy-green.png' alt="Comprar"></a>`;
        loadHotmartWidget();
    } else if (item.url) {
        const playIconBtn = '<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>';
        actionButton = `<a href="${cmUTM(item.url, detailCampaign)}" class="play-store-btn pulse" target="_blank" ${cmProductLinkAttrs(item)}>${playIconBtn} GET IT ON PLAY STORE</a>`;
    } else {
        actionButton = '<button class="cta-button disabled">Coming Soon</button>';
    }

    if (item.onlineUrl) {
        actionButton += ` <a href="${item.onlineUrl}" class="cta-button secondary" target="_blank">use it for free</a>`;
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
                <h2>${item.name}${(item.id === 'psi-gym' || item.id === 'dream-machine' || item.id === 'astral-lab' || item.id === 'eerieroads' || item.id === 'lucid-dream' || item.id === 'noctem-tools' || item.id === 'codex-chaoticus-pdf' || item.id === 'tarot-chaos-pdf') ? ' <span class="discount-badge">NEW!</span>' : ''}</h2>
                <p class="lead-text">${item.description}</p>
                ${item.author ? `<div class="author-info">AUTHOR: ${item.author}</div>` : ''}
                ${item.language ? `
                <div class="language-info">
                    <span>LANGUAGE: ${item.language}</span>
                    ${item.languageFlag.split(',').map(f => `<img src="https://flagcdn.com/w20/${f.trim()}.png" alt="${item.language}" class="lang-flag-mini">`).join('')}
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
            const itemDir = item.type === 'book' ? 'books' : 'apps';
            const itemUrl = `${baseUrl}/${itemDir}/${item.id}.html`;
            
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
                ${app.url ? `<a href="${cmUTM(app.url, cmCampaign(app) + '_also_like')}" class="play-store-btn compact pulse" target="_blank" style="display:flex;margin-top:1rem;" ${cmProductLinkAttrs(app)} onclick="event.stopPropagation()">${'<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>'} GET IT ON PLAY STORE</a>` : ''}
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
            // Apps section starts expanded by default
            if (titleText === 'Cybermancy') section.classList.add('active');
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

    cmBindPurchaseTracking();  // GA4 purchase_click on every Play/Hotmart CTA
    cmTrackStaticProductPage(); // view_item on the static /apps/ + /books/ pages
    cmInjectAppShareButtons(); // Share row on app/book detail pages
});

/* ========================================================================
   view_item ON STATIC PRODUCT PAGES
   ------------------------------------------------------------------------
   The 12 /apps/*.html and 7 /books/*.html landing pages are hand-written:
   they contain #app-detailed-info but NOT #app-details, so renderAppDetails()
   — and therefore its view_item — never runs there. Those are the highest
   intent pages on the site, so we emit view_item for them here, deriving the
   product from the URL slug and enriching it from the catalogue when
   apps-data.js happens to be loaded (books pages) or falling back to the
   document title when it is not (apps pages load app-render.js alone).
   ======================================================================== */
function cmTrackStaticProductPage() {
    if (window.__cmViewItemSent) return;
    if (document.getElementById('app-details')) return; // dynamic page: already handled
    if (document.getElementById('apps-grid')) return;   // catalogue page: view_item_list

    const m = window.location.pathname.match(/\/(apps|books)\/([^\/]+)\.html?$/i);
    if (!m) return;

    const section = m[1].toLowerCase();
    const slug = m[2];
    if (slug === 'index') return;
    window.__cmViewItemSent = true;

    let name = (document.title || slug).split('|')[0].trim();
    let price = 0;
    let category = section === 'books' ? 'book' : 'app';

    try {
        const pool = []
            .concat(typeof appsData !== 'undefined' ? appsData : [])
            .concat(typeof booksData !== 'undefined' ? booksData : []);
        const found = pool.find(p => p.id === slug);
        if (found) {
            name = found.name;
            price = cmPriceNum(found.price);
            category = found.type === 'book' ? 'book' : 'app';
        }
    } catch (e) {}

    // Last resort: read the price straight off the rendered page.
    if (!price) {
        const el = document.querySelector('.detail-price, .card-price, [class*="price"]');
        if (el) price = cmPriceNum(el.textContent);
    }

    cmTrack('view_item', {
        currency: 'USD',
        value: price,
        items: [{
            item_id: slug,
            item_name: name,
            item_category: category,
            item_brand: 'Cha0smagick Labs',
            price: price,
            currency: 'USD',
            quantity: 1
        }]
    });

    if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
            content_ids: [slug], content_name: name,
            content_type: 'product', value: price, currency: 'USD'
        });
    }
}

/* ========================================================================
   PURCHASE INTENT TRACKING
   ------------------------------------------------------------------------
   App detail pages load app-render.js WITHOUT conversion.js, so the click
   tracking has to live here too. Both files share the
   window.__cmPurchaseClickBound guard, so whichever loads first wins and the
   event can never fire twice.
   ======================================================================== */
function cmBindPurchaseTracking() {
    if (window.__cmPurchaseClickBound) return;
    window.__cmPurchaseClickBound = true;

    document.addEventListener('click', function (e) {
        const a = e.target && e.target.closest && e.target.closest('a[href]');
        if (!a) return;

        const href = a.getAttribute('href') || '';
        const isPlay = href.indexOf('play.google.com') !== -1;
        const isHotmart = href.indexOf('hotmart.com') !== -1;
        if (!isPlay && !isHotmart) return;

        const productId = a.getAttribute('data-product') ||
            (href.match(/[?&]id=([\w.]+)/) || [])[1] ||
            (href.match(/hotmart\.com\/([A-Z0-9]+)/i) || [])[1] || 'unknown';

        // Recover name/price from the catalogue when it is on the page.
        let name = productId, price = 0, category = isHotmart ? 'book' : 'app';
        try {
            const pool = []
                .concat(typeof appsData !== 'undefined' ? appsData : [])
                .concat(typeof booksData !== 'undefined' ? booksData : []);
            const found = pool.find(function (p) {
                return p.id === productId ||
                    (p.url && p.url.indexOf(productId) !== -1) ||
                    (p.hotmartLink && p.hotmartLink.indexOf(productId) !== -1);
            });
            if (found) {
                name = found.name;
                price = cmPriceNum(found.price);
                category = found.type === 'book' ? 'book' : 'app';
            }
        } catch (err) {}

        const items = [{
            item_id: productId,
            item_name: name,
            item_category: category,
            item_brand: 'Cha0smagick Labs',
            price: price,
            currency: 'USD',
            quantity: 1
        }];

        // purchase_click = leaving our site for the merchant checkout.
        cmTrack('purchase_click', {
            currency: 'USD',
            value: price,
            destination: isPlay ? 'google_play' : 'hotmart',
            link_url: href,
            page: location.pathname,
            items: items
        });
        // Standard funnel event so GA4's built-in ecommerce reports populate.
        cmTrack('begin_checkout', { currency: 'USD', value: price, items: items });

        if (typeof window.fbq === 'function') {
            window.fbq('track', 'InitiateCheckout', {
                content_ids: [productId],
                content_name: name,
                content_type: 'product',
                value: price,
                currency: 'USD'
            });
        }
    }, true);
}

/* ========================================================================
   SHARE BUTTONS (app / book detail pages)
   ------------------------------------------------------------------------
   conversion.js owns this on blog pages; app detail pages do not load it,
   so a compact equivalent lives here behind the shared
   window.__cmShareInjected guard to guarantee a single instance.
   ======================================================================== */
function cmInjectAppShareButtons() {
    if (window.__cmShareInjected) return;
    if (document.getElementById('cm-share-row')) return;

    // Product pages only — either the dynamic #app-details view or the static
    // /apps/ + /books/ landing pages (which only have #app-detailed-info).
    const host = document.querySelector('.share-buttons') ||
        document.getElementById('app-detailed-info') ||
        document.getElementById('app-details');
    if (!host) return;
    if (document.getElementById('apps-grid')) return; // not on the catalogue
    window.__cmShareInjected = true;

    const url = window.location.href;
    const title = document.title;
    const nets = [
        ['x', 'X', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url)],
        ['pinterest', 'Pinterest', 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url) + '&description=' + encodeURIComponent(title)],
        ['whatsapp', 'WhatsApp', 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url)],
        ['facebook', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)]
    ];

    const row = document.createElement('div');
    row.id = 'cm-share-row';
    row.setAttribute('style', 'display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;align-items:center;margin:1.5rem auto;');
    row.innerHTML = '<span style="color:#888;font-size:.8rem;text-transform:uppercase;letter-spacing:1px;">Share:</span>' +
        nets.map(function (n) {
            return '<a href="' + n[2] + '" data-cm-share="' + n[0] + '" rel="noopener" ' +
                'style="padding:.45rem 1rem;border-radius:6px;background:#1a1a1a;border:1px solid #333;' +
                'color:#e0e0e0;text-decoration:none;font-size:.8rem;font-weight:600;">' + n[1] + '</a>';
        }).join('');

    row.addEventListener('click', function (e) {
        const a = e.target.closest('a[data-cm-share]');
        if (!a) return;
        e.preventDefault();
        window.open(a.href, 'cm_share', 'width=600,height=500,noopener');
        cmTrack('share', {
            method: a.getAttribute('data-cm-share'),
            content_type: 'product',
            item_id: new URLSearchParams(location.search).get('id') || location.pathname
        });
    });

    host.appendChild(row);
}