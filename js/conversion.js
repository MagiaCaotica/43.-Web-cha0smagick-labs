/**
 * Cha0smagick Labs - Conversion Engine
 * Injects email capture, lead magnets, and sales CTAs into every page.
 * Goal: 1 visit → 1 sale. No dead ends.
 * Loads on blog articles, tools, app-details, and homepage.
 */
(function() {
  'use strict';

  /* ============================================================
   * CONFIG
   * ============================================================ */
  var CONFIG = {
    // MailerLite
    mlAccount: '2539880',
    mlFormEN: 'UOlyYH',   // EN lead magnet form
    mlFormES: 'I95d94',   // ES lead magnet form (not published yet)

    // Lead Magnet PDFs
    leadMagnetEN: '/lead-magnet/Quickstart-Guide-Chaos-Magick.pdf',
    leadMagnetES: '/lead-magnet/Guia-Rapida-Magia-Caos.pdf',

    // Play Store collection URL
    playStoreURL: 'https://play.google.com/store/apps/dev?id=7060930672313565766',

    // App categories for related suggestions
    appCategories: {
      divination: ['norse-rune-oracle', 'iching-oracle', 'unofficial-rider-waite-tarot', 'astral-lab'],
      sigils: ['chaos-sigil-generator', 'arcana-goetia'],
      psychic: ['psi-gym', 'dream-machine', 'lucid-dream'],
      astrology: ['astral-lab', 'lunar-phase-calculator'],
      goetia: ['arcana-goetia']
    }
  };

  /* ============================================================
   * HELPERS
   * ============================================================ */

  // Detect page type
  function getPageType() {
    var path = window.location.pathname;

    // Check for language in path
    if (path.indexOf('/es/') === 0) return 'es-page';

    if (path.indexOf('/blog/') !== -1) return 'blog';
    if (path.indexOf('/tools/') !== -1) return 'tools';
    if (path.indexOf('/pages/app-details.html') !== -1) return 'app-details';
    if (path === '/' || path === '/index.html') return 'homepage';
    if (path.indexOf('/books/') !== -1) return 'books';

    return 'other';
  }

  // Detect if Spanish (checks html lang attr)
  function isSpanish() {
    return document.documentElement.lang &&
           document.documentElement.lang.indexOf('es') === 0;
  }

  // Get article main heading text for context
  function getArticleHeading() {
    var h1 = document.querySelector('article h1, .article h1, .blog-post h1');
    return h1 ? h1.textContent.trim() : '';
  }

  // Get apps data if available (from apps-data.js)
  function getAppsData() {
    return (typeof appsData !== 'undefined') ? appsData : null;
  }

  function getBooksData() {
    return (typeof booksData !== 'undefined') ? booksData : null;
  }

  // Build mailerLite Universal JS once
  function loadMailerLite() {
    if (window._mlLoaded) return;
    window._mlLoaded = true;

    // Check if ml function already exists
    if (typeof window.ml === 'function') return;

    (function(m,a,i,l,e,r){
      m[l]=m[l]||function(){(m[l].q=m[l].q||[]).push(arguments)};
      e=a.createElement(i);
      r=a.getElementsByTagName(i)[0];
      e.async=1;
      e.src=l+'?v='+~~(new Date().getTime()/3600000);
      r.parentNode.insertBefore(e,r);
    })(window, document, 'script', 'https://static.mailerlite.com/js/universal.js');

    window.ml('account', CONFIG.mlAccount);
  }

  // Insert HTML after an element
  function insertAfter(referenceNode, html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    var fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    referenceNode.parentNode.insertBefore(fragment, referenceNode.nextSibling);
  }

  // Insert HTML before an element
  function insertBefore(referenceNode, html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    var fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    referenceNode.parentNode.insertBefore(fragment, referenceNode);
  }

  // Append HTML to element
  function appendHtml(element, html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    while (temp.firstChild) {
      element.appendChild(temp.firstChild);
    }
  }

  // Check if element exists
  function exists(selector) {
    return document.querySelector(selector) !== null;
  }

  // Get random items from array
  function getRandomItems(arr, n) {
    var shuffled = arr.slice();
    var i = arr.length;
    var temp, index;
    while (i--) {
      index = Math.floor(Math.random() * i);
      temp = shuffled[i];
      shuffled[i] = shuffled[index];
      shuffled[index] = temp;
    }
    return shuffled.slice(0, n);
  }

  /* ============================================================
   * INJECTORS
   * ============================================================ */

  // --- Lead Magnet Email Form ---
  function injectLeadMagnet(targetSelector, position) {
    position = position || 'after';
    var target = document.querySelector(targetSelector);
    if (!target) return;

    var lang = isSpanish();
    var headline = lang
      ? 'ðŸ”— Â¡ObtÃ©n Tu GuÃa RÃ¡pida de Magia del Caos GRATIS!'
      : 'ðŸ”— Get Your FREE Chaos Magick Quickstart Guide!';
    var subtext = lang
      ? 'Aprende tÃ©cnicas de sigilos, gnosis y servidores en este PDF de 10 pÃ¡ginas. Ingresa tu email y te lo envÃ­o al instante.'
      : 'Learn sigil techniques, gnosis states & servitor creation in this 10-page PDF. Enter your email and I\'ll send it instantly.';
    var btnText = lang ? 'Enviar mi GuÃ­a Gratis â†”' : 'Send My Free Guide â†”';
    var formSlug = lang ? CONFIG.mlFormES : CONFIG.mlFormEN;
    var privacyText = lang
      ? 'Sin spam. Puedes darte de baja cuando quieras.'
      : 'No spam. Unsubscribe anytime.';

    // Don't inject if form already present on page
    if (document.querySelector('.ml-embedded[data-form="' + formSlug + '"]')) return;
    if (document.getElementById('cm-cta-lead-magnet')) return;

    var html = '\
<section id="cm-cta-lead-magnet" class="cm-section cm-lead-section">\
  <div class="cm-lead-inner">\
    <div class="cm-lead-content">\
      <h3 class="cm-lead-headline">' + headline + '</h3>\
      <p class="cm-lead-subtext">' + subtext + '</p>\
      <div class="ml-embedded" data-form="' + formSlug + '"></div>\
      <p class="cm-lead-privacy">' + privacyText + '</p>\
    </div>\
  </div>\
</section>';

    if (position === 'after') {
      insertAfter(target, html);
    } else {
      insertBefore(target, html);
    }

    // Load MailerLite universal JS
    loadMailerLite();
  }

  // --- Complete Collection CTA ---
  function injectCollectionCTA(targetSelector, position) {
    position = position || 'after';
    var target = document.querySelector(targetSelector);
    if (!target) return;
    if (document.getElementById('cm-cta-collection')) return;

    var lang = isSpanish();
    var headline = lang
      ? 'âœ¨ La ColecciÃ³n Completa de Magia del Caos'
      : 'âœ¨ The Complete Occult Collection';
    var text = lang
      ? '11 Apps Android premium + 7 Libros PDF. Todo lo que necesitas para tu prÃ¡ctica de Magia del Caos, en un solo ecosistema. 100% offline, sin suscripciones.'
      : '11 Android apps + 7 PDF books. Everything for your Chaos Magick practice in one complete ecosystem. 100% offline, no subscriptions.';
    var cta = lang
      ? 'Ver Todos los Productos â†”'
      : 'Browse All Products â†”';

    var html = '\
<section id="cm-cta-collection" class="cm-section cm-collection-section">\
  <div class="cm-collection-inner">\
    <h3 class="cm-collection-headline">' + headline + '</h3>\
    <p class="cm-collection-text">' + text + '</p>\
    <div class="cm-collection-stats">\
      <div class="cm-stat">\
        <span class="cm-stat-num">11</span>\
        <span class="cm-stat-label">Android Apps</span>\
      </div>\
      <div class="cm-stat">\
        <span class="cm-stat-num">7</span>\
        <span class="cm-stat-label">PDF Books</span>\
      </div>\
      <div class="cm-stat">\
        <span class="cm-stat-num">4.7 â˜…</span>\
        <span class="cm-stat-label">128+ Reviews</span>\
      </div>\
    </div>\
    <a href="/#products" class="cm-collection-btn">' + cta + '</a>\
  </div>\
</section>';

    if (position === 'after') {
      insertAfter(target, html);
    } else {
      insertBefore(target, html);
    }
  }

  // --- App-Specific Promotion (for tools pages) ---
  function injectToolUpgradeCTA(toolName, appUrl, appPrice) {
    appPrice = appPrice || '$4.99';
    if (document.getElementById('cm-cta-tool-upgrade')) return;

    var target = document.querySelector('.tool-container, #results, main > div:last-child, .features, main');
    if (!target) {
      target = document.querySelector('.blog-post, article') || document.body;
    }

    // Find the last child that's a div or main content
    var insertPoint = target;
    if (target === document.body) {
      insertPoint = document.querySelector('footer');
      if (!insertPoint) insertPoint = document.body;
    }

    var html = '\
<section id="cm-cta-tool-upgrade" class="cm-section cm-tool-cta">\
  <div class="cm-tool-cta-inner">\
    <h3>' + (isSpanish() ? 'Â¿Te gusta esta herramienta?' : 'Love this tool?') + '</h3>\
    <p>' + (isSpanish()
      ? 'ObtÃ©n la app premium de ' + toolName + ' en Google Play. Sin anuncios, sin rastreo, 100% offline.'
      : 'Get the premium ' + toolName + ' app on Google Play. No ads, no tracking, 100% offline.') + '</p>\
    <div class="cm-tool-cta-btns">\
      <a href="' + appUrl + '" class="cm-btn cm-btn-primary" target="_blank">\
        <svg class="cm-play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>\
        ' + (isSpanish() ? 'COMPRAR EN PLAY STORE' : 'GET IT ON PLAY STORE') + '\
      </a>\
    </div>\
    <p class="cm-tool-price">' + (isSpanish() ? 'Solo ' : 'Just ') + appPrice + ' â€” ' + (isSpanish() ? 'pago Ãºnico' : 'one-time payment') + '</p>\
  </div>\
</section>';

    if (insertPoint === target) {
      appendHtml(target, html);
    } else {
      insertBefore(insertPoint, html);
    }
    loadMailerLite();
  }

  // --- Social Share Buttons (X/Twitter + Pinterest) ---
  function injectShareButtons() {
    if (document.getElementById('cm-social-share')) return;

    var article = document.querySelector('article.article, .blog-post, article');
    if (!article) return;

    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.title);
    var description = encodeURIComponent(
      (document.querySelector('meta[name="description"]') || {}).content || document.title
    );

    var html = '\
<section id="cm-social-share" class="cm-section cm-social-section">\
  <div class="cm-social-inner">\
    <span class="cm-social-label">' + (isSpanish() ? 'Comparte este art\u00EDculo:' : 'Share this article:') + '</span>\
    <div class="cm-social-buttons">\
      <a href="https://twitter.com/intent/tweet?text=' + title + '&url=' + url + '" \
         target="_blank" rel="noopener" class="cm-social-btn cm-social-x" aria-label="Share on X">\
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>\
        <span>X</span>\
      </a>\
      <a href="https://pinterest.com/pin/create/button/?url=' + url + '&description=' + description + '" \
         target="_blank" rel="noopener" class="cm-social-btn cm-social-pin" aria-label="Pin on Pinterest">\
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0a12 12 0 0 0-4.36 23.17c-.1-.79-.2-2.02.04-2.89.22-.79 1.4-5.69 1.4-5.69s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.03 0 1.53.77 1.53 1.7 0 1.03-.66 2.58-1 4.01-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.78-2.25 3.78-5.5 0-2.88-2.07-4.89-5.02-4.89-3.42 0-5.43 2.56-5.43 5.22 0 1.03.4 2.14.89 2.74a.36.36 0 0 1 .08.34l-.33 1.35c-.05.22-.17.27-.4.16-1.5-.7-2.44-2.88-2.44-4.64 0-3.78 2.74-7.25 7.92-7.25 4.15 0 7.38 2.96 7.38 6.92 0 4.13-2.6 7.45-6.22 7.45-1.21 0-2.35-.63-2.74-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14A12 12 0 1 0 12 0z"/></svg>\
        <span>Pinterest</span>\
      </a>\
    </div>\
  </div>\
</section>';

    insertBefore(document.querySelector('footer'), html);
  }
    if (document.getElementById('cm-related-apps')) return;

    var target = document.querySelector('footer');
    if (!target) {
      target = document.querySelector('.blog-post, article');
    }
    if (!target) return;

    var apps = getAppsData();
    if (!apps) return;

    var related = [];
    appsList.forEach(function(id) {
      var app = apps.find(function(a) { return a.id === id; });
      if (app) related.push(app);
    });

    if (related.length === 0) {
      // Fallback: show 3 random apps
      related = getRandomItems(apps, 3);
    }

    if (related.length === 0) return;

    var itemsHtml = related.map(function(app) {
      var price = app.price ? app.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim() : '$4.99';
      var imgSrc = app.image ? app.image.replace(/\.webp$/i, '.png') : '';
      return '\
<div class="cm-app-card">\
  <a href="/apps/' + app.id + '.html" class="cm-app-card-link">\
    <div class="cm-app-card-img-wrap">\
      <img src="' + imgSrc + '" alt="' + app.name + '" loading="lazy" width="80" height="80">\
    </div>\
    <div class="cm-app-card-body">\
      <h4>' + app.name + '</h4>\
      <p>' + app.shortDescription + '</p>\
      <span class="cm-app-price">' + price + '</span>\
    </div>\
  </a>\
</div>';
    }).join('');

    var heading = isSpanish() ? 'Apps Relacionadas' : 'You Might Also Like';

    var html = '\
<section id="cm-related-apps" class="cm-section cm-related-section">\
  <h3 class="cm-related-heading">' + heading + '</h3>\
  <div class="cm-related-grid">' + itemsHtml + '</div>\
</section>';

    insertBefore(target, html);
  }

  /* ============================================================
   * ROUTER - Run appropriate injections per page type
   * ============================================================ */

  function run() {
    var pageType = getPageType();

    // Never run on admin/payment pages
    if (pageType === 'other') return;

    switch (pageType) {

      case 'blog': {
        // 1. Social share buttons at top of article
        injectShareButtons();

        // 2. Lead magnet email form at article bottom (before footer)
        var articleEl = document.querySelector('article.article');
        if (!articleEl) {
          articleEl = document.querySelector('.blog-post');
        }
        if (articleEl) {
          injectLeadMagnet('article.article, .blog-post');
        }

        // 3. Collection CTA after lead magnet
        // (will be injected after the lead section loads)
        // We schedule this after a short delay to ensure lead section is in DOM
        setTimeout(function() {
          var leadSection = document.getElementById('cm-cta-lead-magnet');
          if (leadSection) {
            injectCollectionCTA('#cm-cta-lead-magnet');
          } else {
            // fallback: inject before footer
            var footer = document.querySelector('footer');
            if (footer) injectCollectionCTA('footer', 'before');
          }
        }, 100);

        break;
      }

      case 'tools': {
        // Check if it's tool index or a specific tool page
        var isToolPage = !window.location.pathname.endsWith('/tools/') &&
                         !window.location.pathname.endsWith('/tools/index.html');

        if (isToolPage) {
          // Determine which app to promote based on tool name
          var path = window.location.pathname.toLowerCase();
          var toolAppMap = {
            'sigil': { name: 'Magick Chaos Sigil Generator', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.sigilgenerator', price: '$4.99' },
            'rune': { name: 'Norse Rune Oracle', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.norone', price: '$4.99' },
            'iching': { name: 'I Ching Oracle', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.iching', price: '$4.99' },
            'candle': { name: 'Lunar Phase Calculator', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.lunar', price: '$3.99' },
            'lunar': { name: 'Lunar Phase Calculator', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.lunar', price: '$3.99' },
            'astrology': { name: 'Astral Lab', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.astrallab', price: '$4.99' },
            'pendulum': { name: 'PSI GYM', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.psigym', price: '$4.99' },
            'spell': { name: 'Chaos Sigil Generator', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.sigilgenerator', price: '$4.99' },
            'tengwar': { name: 'Chaos Sigil Generator', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.sigilgenerator', price: '$4.99' },
            'servidor': { name: 'Arcana Goetia', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.goetia', price: '$4.99' }
          };

          var matched = null;
          for (var key in toolAppMap) {
            if (path.indexOf(key) !== -1) {
              matched = toolAppMap[key];
              break;
            }
          }

          if (matched) {
            // Inject upgrade CTA after tool results
            injectToolUpgradeCTA(matched.name, matched.url, matched.price);
          } else {
            // Generic tool CTA
            var apps = getAppsData();
            if (apps && apps.length > 0) {
              var randomApp = apps[Math.floor(Math.random() * apps.length)];
              var price = randomApp.price ? randomApp.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim() : '$4.99';
              injectToolUpgradeCTA(randomApp.name, randomApp.url, price);
            }
          }
        } else {
          // Tools index page - inject lead magnet at bottom
          var toolsFooter = document.querySelector('footer');
          if (toolsFooter) {
            injectLeadMagnet('footer', 'before');
          }
        }
        // Also inject lead magnet on tool pages
        if (isToolPage) {
          var toolContent = document.querySelector('.tool-container, .blog-post, article, main');
          if (toolContent) {
            injectLeadMagnet('footer', 'before');
          }
        }
        break;
      }

      case 'app-details': {
        // Wait for app-render to finish rendering
        var checkRender = setInterval(function() {
          var detailInfo = document.getElementById('app-detailed-info');
          var alsoLike = document.querySelector('.also-like-grid');
          if (detailInfo || alsoLike) {
            clearInterval(checkRender);

            // Inject lead magnet after app details but before "You May Also Like"
            if (detailInfo) {
              injectLeadMagnet('#app-detailed-info');
            }

            // Inject collection CTA after lead magnet
            setTimeout(function() {
              var leadSection = document.getElementById('cm-cta-lead-magnet');
              if (leadSection) {
                injectCollectionCTA('#cm-cta-lead-magnet');
              } else if (detailInfo) {
                injectCollectionCTA('#app-detailed-info');
              }
            }, 200);
          }
        }, 300);

        // Timeout after 10 seconds
        setTimeout(function() { clearInterval(checkRender); }, 10000);

        // Also fix noindex tag on app-details (should be indexable)
        var metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots && metaRobots.getAttribute('content') === 'noindex, follow') {
          metaRobots.setAttribute('content', 'index, follow');
        }
        break;
      }

      case 'books': {
        // Book pages - inject lead magnet + collection CTA
        var bookFooter = document.querySelector('footer');
        var bookContent = document.querySelector('.blog-post, article, main');
        if (bookContent) {
          injectLeadMagnet('footer', 'before');
          setTimeout(function() {
            var leadSection = document.getElementById('cm-cta-lead-magnet');
            if (leadSection) {
              injectCollectionCTA('#cm-cta-lead-magnet');
            } else if (bookContent) {
              injectCollectionCTA('footer', 'before');
            }
          }, 100);
        }
        break;
      }

      case 'homepage': {
        // Homepage already has email form in hero
        // Add collection value section below apps (if not already there)
        break;
      }

      default: {
        // Generic: inject on any unrecognized page with article-like content
        var genericArticle = document.querySelector('.blog-post, article');
        if (genericArticle) {
          injectLeadMagnet('footer', 'before');
        }
        break;
      }
    }
  }

  /* ============================================================
   * CSS STYLES (injected once)
   * ============================================================ */

  function injectStyles() {
    if (document.getElementById('cm-styles')) return;

    var css = '\
<style id="cm-styles">\
.cm-section {\
  max-width: 800px;\
  margin: 2rem auto;\
  padding: 0 1rem;\
}\
\
/* Lead Magnet Section */\
.cm-lead-section {\
  background: linear-gradient(135deg, #0a0a0a 0%, #111 100%);\
  border: 1px solid #c0a060;\
  border-radius: 12px;\
  padding: 2rem;\
  margin: 2.5rem auto;\
  text-align: center;\
}\
.cm-lead-headline {\
  color: #ffd700;\
  font-size: 1.4rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  margin-bottom: 0.8rem;\
}\
.cm-lead-subtext {\
  color: #ccc;\
  font-size: 0.95rem;\
  line-height: 1.6;\
  margin-bottom: 1.2rem;\
}\
.cm-lead-privacy {\
  color: #666;\
  font-size: 0.75rem;\
  margin-top: 0.8rem;\
}\
\
/* Collection Section */\
.cm-collection-section {\
  background: #0a0a0a;\
  border: 1px solid #333;\
  border-radius: 12px;\
  padding: 2rem;\
  text-align: center;\
}\
.cm-collection-headline {\
  color: #c0a060;\
  font-size: 1.3rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  margin-bottom: 0.8rem;\
}\
.cm-collection-text {\
  color: #a0a0a0;\
  font-size: 0.95rem;\
  line-height: 1.6;\
  max-width: 600px;\
  margin: 0 auto 1.5rem;\
}\
.cm-collection-stats {\
  display: flex;\
  justify-content: center;\
  gap: 2rem;\
  margin-bottom: 1.5rem;\
  flex-wrap: wrap;\
}\
.cm-stat {\
  text-align: center;\
}\
.cm-stat-num {\
  display: block;\
  font-size: 1.8rem;\
  font-weight: 700;\
  color: #c0a060;\
  font-family: "JetBrains Mono", Consolas, monospace;\
}\
.cm-stat-label {\
  display: block;\
  font-size: 0.75rem;\
  color: #888;\
  text-transform: uppercase;\
  letter-spacing: 1px;\
}\
.cm-collection-btn {\
  display: inline-block;\
  padding: 0.8rem 2rem;\
  background: #c0a060;\
  color: #000 !important;\
  text-decoration: none;\
  border-radius: 6px;\
  font-weight: 700;\
  font-size: 0.9rem;\
  transition: background 0.3s;\
}\
.cm-collection-btn:hover {\
  background: #ffd700;\
}\
\
/* Tool Upgrade CTA */\
.cm-tool-cta {\
  background: linear-gradient(135deg, #0a0a0a 0%, #111 100%);\
  border: 1px solid #c0a060;\
  border-radius: 12px;\
  padding: 2rem;\
  margin: 2rem auto;\
  text-align: center;\
}\
.cm-tool-cta h3 {\
  color: #ffd700;\
  font-size: 1.3rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  margin-bottom: 0.8rem;\
}\
.cm-tool-cta p {\
  color: #ccc;\
  font-size: 0.95rem;\
  margin-bottom: 1.2rem;\
}\
.cm-tool-cta-btns {\
  margin-bottom: 0.5rem;\
}\
.cm-btn {\
  display: inline-flex;\
  align-items: center;\
  gap: 0.5rem;\
  padding: 0.8rem 1.8rem;\
  border-radius: 6px;\
  text-decoration: none;\
  font-weight: 700;\
  font-size: 0.85rem;\
  transition: all 0.3s;\
}\
.cm-btn-primary {\
  background: #c0a060;\
  color: #000 !important;\
}\
.cm-btn-primary:hover {\
  background: #ffd700;\
}\
.cm-play-icon {\
  width: 20px;\
  height: 20px;\
}\
.cm-tool-price {\
  color: #888;\
  font-size: 0.85rem;\
  font-style: italic;\
}\
\
/* Related Apps */\
.cm-related-section {\
  margin: 3rem auto;\
}\
.cm-related-heading {\
  color: #c0a060;\
  font-size: 1.2rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  text-align: center;\
  margin-bottom: 1.5rem;\
}\
.cm-related-grid {\
  display: grid;\
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\
  gap: 1rem;\
}\
.cm-app-card {\
  background: #0a0a0a;\
  border: 1px solid #1a1a1a;\
  border-radius: 8px;\
  overflow: hidden;\
  transition: border-color 0.3s;\
}\
.cm-app-card:hover {\
  border-color: #c0a060;\
}\
.cm-app-card-link {\
  display: flex;\
  gap: 1rem;\
  padding: 1rem;\
  text-decoration: none;\
  color: inherit;\
}\
.cm-app-card-img-wrap {\
  flex-shrink: 0;\
}\
.cm-app-card-img-wrap img {\
  width: 80px;\
  height: 80px;\
  border-radius: 8px;\
}\
.cm-app-card-body h4 {\
  color: #ffd700;\
  font-size: 0.95rem;\
  font-weight: 500;\
  margin-bottom: 0.3rem;\
}\
.cm-app-card-body p {\
  color: #999;\
  font-size: 0.8rem;\
  line-height: 1.4;\
  margin-bottom: 0.3rem;\
}\
.cm-app-price {\
  color: #c0a060;\
  font-size: 0.85rem;\
  font-weight: 700;\
}\
\
/* Social Share */\
.cm-social-section {\
  margin: 2rem auto;\
  padding: 1rem 0;\
}\
.cm-social-inner {\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  gap: 1rem;\
  flex-wrap: wrap;\
}\
.cm-social-label {\
  color: #888;\
  font-size: 0.85rem;\
  text-transform: uppercase;\
  letter-spacing: 1px;\
}\
.cm-social-buttons {\
  display: flex;\
  gap: 0.5rem;\
}\
.cm-social-btn {\
  display: inline-flex;\
  align-items: center;\
  gap: 0.4rem;\
  padding: 0.5rem 1rem;\
  border-radius: 6px;\
  text-decoration: none;\
  font-size: 0.8rem;\
  font-weight: 600;\
  transition: all 0.3s;\
}\
.cm-social-x {\
  background: #1a1a1a;\
  color: #fff !important;\
  border: 1px solid #333;\
}\
.cm-social-x:hover {\
  background: #333;\
  border-color: #555;\
}\
.cm-social-pin {\
  background: #bd081c;\
  color: #fff !important;\
}\
.cm-social-pin:hover {\
  background: #9a0715;\
}\
\
/* Responsive */\
@media (max-width: 600px) {\
  .cm-lead-section,\
  .cm-collection-section,\
  .cm-tool-cta {\
    padding: 1.5rem;\
  }\
  .cm-lead-headline {\
    font-size: 1.1rem;\
  }\
  .cm-collection-stats {\
    gap: 1rem;\
  }\
  .cm-stat-num {\
    font-size: 1.4rem;\
  }\
  .cm-related-grid {\
    grid-template-columns: 1fr;\
  }\
}\
</style>';

    document.head.insertAdjacentHTML('beforeend', css);
  }

  /* ============================================================
   * INIT
   * ============================================================ */

  function init() {
    // Inject styles
    injectStyles();

    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  init();
})();
