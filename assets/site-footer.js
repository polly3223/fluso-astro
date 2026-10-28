/* ──────────────────────────────────────────────────────────────────
   Fluso site-footer.

   Self-contained footer. Mirrors assets/site-nav.js: a single canonical
   template + style injection that runs on every page.

   The footer is rendered OUTSIDE the cream .scroller surface so it
   sits on the dark, blurred body background — sitemap links and the
   Prem AI attribution float over the page's grayscale-blurred photo.

   Idempotent. Safe to load more than once.
   ────────────────────────────────────────────────────────────────── */

(function () {
    'use strict';

    if (document.documentElement.dataset.siteFooterMounted === '1') return;
    document.documentElement.dataset.siteFooterMounted = '1';

    var INDUSTRIES = [
        { href: 'for-founders.html',     label: 'Founders' },
        { href: 'for-lawyers.html',      label: 'Lawyers' },
        { href: 'for-investors.html',    label: 'Investors' },
        { href: 'for-marketers.html',    label: 'Marketers' },
        { href: 'for-researchers.html',  label: 'Researchers' },
        { href: 'for-doctors.html',      label: 'Doctors' },
        { href: 'for-consultants.html',  label: 'Consultants' },
        { href: 'for-sales.html',        label: 'Sales' },
        { href: 'for-operations.html',   label: 'Operations' }
    ];

    var PRODUCT = [
        { href: 'pricing.html',     label: 'Pricing' },
        { href: 'enterprise.html',  label: 'Enterprise' },
        { href: 'get-started.html', label: 'Get started' }
    ];

    var COMPANY = [
        { href: 'https://premai.io', label: 'Prem AI', external: true },
        { href: 'privacy.html',      label: 'Privacy' },
        { href: 'terms.html',        label: 'Terms' },
        { href: 'https://form.typeform.com/to/vZnBDhzs', label: 'Contact', external: true }
    ];

    function esc(s) { return String(s).replace(/"/g, '&quot;'); }

    function linkList(items) {
        return items.map(function (i) {
            var ext = i.external
                ? ' target="_blank" rel="noopener noreferrer"'
                : '';
            return '<li><a href="' + esc(i.href) + '"' + ext + '>' + i.label +
                (i.external ? ' <span class="ext-arrow" aria-hidden="true">↗</span>' : '') +
                '</a></li>';
        }).join('');
    }

    function buildFooterHTML() {
        return '' +
            '<div class="site-footer-inner">' +
              '<div class="site-footer-brand">' +
                '<a class="site-footer-logo" href="index.html" aria-label="Fluso">' +
                  '<span class="brand-name">Fluso</span>' +
                '</a>' +
                '<p class="site-footer-tagline">Your personal AI workspace. Connected context, open-weight models, your boundary.</p>' +
                '<div class="site-footer-prem">' +
                  '<span class="prem-label">A product of</span>' +
                  '<a href="https://premai.io" target="_blank" rel="noopener noreferrer" aria-label="Prem AI">' +
                    '<img src="assets/prem-logo-white.png" alt="Prem AI" class="prem-logo">' +
                  '</a>' +
                '</div>' +
              '</div>' +
              '<nav class="site-footer-cols" aria-label="Footer">' +
                '<div class="col">' +
                  '<h4 class="col-title">Product</h4>' +
                  '<ul>' + linkList(PRODUCT) + '</ul>' +
                '</div>' +
                '<div class="col col-industries">' +
                  '<h4 class="col-title">Industries</h4>' +
                  '<ul>' + linkList(INDUSTRIES) + '</ul>' +
                '</div>' +
                '<div class="col">' +
                  '<h4 class="col-title">Company</h4>' +
                  '<ul>' + linkList(COMPANY) + '</ul>' +
                '</div>' +
              '</nav>' +
            '</div>' +
            '<div class="site-footer-legal">' +
              '<span class="legal-copy">© 2026 Fluso</span>' +
              '<span class="legal-dot" aria-hidden="true">·</span>' +
              '<span class="legal-swiss">Engineered in Switzerland</span>' +
              '<span class="legal-spacer" aria-hidden="true"></span>' +
              '<a class="legal-top" href="#top">Back to top <span aria-hidden="true">↑</span></a>' +
            '</div>';
    }

    function injectStyles() {
        if (document.getElementById('site-footer-styles')) return;
        var css =
            '.site-footer{' +
                'position:relative;' +
                'z-index:2;' +
                'color:#faf9f5;' +
                'padding:clamp(56px,7vw,96px) clamp(32px,5vw,80px) clamp(28px,3.4vw,44px);' +
                'margin-top:clamp(28px,3.8vw,56px);' +
                'background:linear-gradient(180deg,rgba(12,12,12,0) 0%,rgba(12,12,12,0.42) 32%,rgba(12,12,12,0.78) 78%,rgba(12,12,12,0.92) 100%);' +
                '-webkit-backdrop-filter:blur(3px) saturate(115%);' +
                'backdrop-filter:blur(3px) saturate(115%);' +
                'font-family:inherit;' +
                'isolation:isolate;' +
            '}\n' +
            /* Dark-frame pages: break out of the body frame padding so the
               footer spans edge-to-edge and reaches the bottom of the
               viewport, reading on top of the blurred photo. */
            '.site-footer.is-bleed{' +
                'margin-left:calc(-1 * var(--frame-x, 20px));' +
                'margin-right:calc(-1 * var(--frame-x, 20px));' +
                'margin-bottom:calc(-1 * var(--frame-y-bot, 24px));' +
            '}\n' +
            /* Pages without the dark frame get a solid dark band instead of
               the transparent-on-photo gradient. */
            '.site-footer.is-inline{' +
                'background:#0c0c0c;' +
                '-webkit-backdrop-filter:none;' +
                'backdrop-filter:none;' +
            '}\n' +
            '@supports not (backdrop-filter:blur(2px)){' +
                '.site-footer{background:linear-gradient(180deg,rgba(12,12,12,0.25) 0%,rgba(12,12,12,0.65) 38%,rgba(12,12,12,0.92) 100%);}' +
            '}\n' +
            '.site-footer a{color:inherit;text-decoration:none;}\n' +
            '.site-footer-inner{' +
                'max-width:1280px;margin:0 auto;' +
                'display:grid;' +
                'grid-template-columns:minmax(280px, 1.1fr) 2.4fr;' +
                'gap:clamp(40px,5vw,88px);' +
                'align-items:start;' +
            '}\n' +
            '.site-footer-brand{display:flex;flex-direction:column;gap:18px;max-width:360px;}\n' +
            '.site-footer-logo{display:inline-flex;align-items:center;font-size:18px;font-weight:500;letter-spacing:-0.01em;color:#faf9f5;opacity:0.95;transition:opacity 0.18s ease;}\n' +
            '.site-footer-logo:hover{opacity:1;}\n' +
            '.site-footer-tagline{font-size:14px;line-height:1.55;color:rgba(242,241,237,0.62);max-width:32ch;}\n' +
            '.site-footer-prem{display:inline-flex;align-items:center;gap:12px;margin-top:6px;}\n' +
            '.site-footer-prem .prem-label{font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:rgba(242,241,237,0.45);font-weight:500;white-space:nowrap;}\n' +
            '.site-footer-prem .prem-logo{height:18px;width:auto;display:block;opacity:0.85;transition:opacity 0.2s ease,transform 0.2s ease;}\n' +
            '.site-footer-prem a:hover .prem-logo{opacity:1;transform:translateY(-1px);}\n' +
            /* Link columns */
            '.site-footer-cols{' +
                'display:grid;' +
                'grid-template-columns:repeat(3,1fr);' +
                'gap:clamp(24px,3vw,56px);' +
            '}\n' +
            '.site-footer-cols .col-title{' +
                'font-size:10.5px;font-weight:600;letter-spacing:0.18em;' +
                'text-transform:uppercase;color:rgba(242,241,237,0.42);' +
                'margin:0 0 16px;' +
            '}\n' +
            '.site-footer-cols ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:11px;}\n' +
            '.site-footer-cols li a{' +
                'font-size:14px;color:rgba(242,241,237,0.78);' +
                'transition:color 0.18s ease,transform 0.18s ease;' +
                'display:inline-flex;align-items:center;gap:5px;' +
                'line-height:1.3;' +
            '}\n' +
            '.site-footer-cols li a:hover{color:#faf9f5;}\n' +
            '.site-footer-cols .ext-arrow{font-size:11px;opacity:0.55;transition:transform 0.2s ease,opacity 0.2s ease;}\n' +
            '.site-footer-cols li a:hover .ext-arrow{transform:translate(2px,-2px);opacity:1;}\n' +
            /* Industries column gets 2 sub-cols on desktop to keep height tidy */
            '.site-footer-cols .col-industries ul{' +
                'display:grid;' +
                'grid-template-columns:repeat(2,1fr);' +
                'gap:11px 18px;' +
            '}\n' +
            /* Legal row */
            '.site-footer-legal{' +
                'max-width:1280px;margin:clamp(36px,4.5vw,56px) auto 0;' +
                'padding-top:22px;' +
                'border-top:1px solid rgba(242,241,237,0.08);' +
                'display:flex;align-items:center;flex-wrap:wrap;gap:12px;' +
                'font-size:12px;color:rgba(242,241,237,0.45);' +
            '}\n' +
            '.site-footer-legal .legal-dot{color:rgba(242,241,237,0.25);}\n' +
            '.site-footer-legal .legal-spacer{flex:1;}\n' +
            '.site-footer-legal .legal-top{font-size:12px;color:rgba(242,241,237,0.55);transition:color 0.18s ease;}\n' +
            '.site-footer-legal .legal-top:hover{color:#faf9f5;}\n' +
            /* Responsive */
            '@media (max-width: 980px){' +
                '.site-footer-inner{grid-template-columns:1fr;gap:40px;}' +
                '.site-footer-cols{grid-template-columns:repeat(3,1fr);}' +
                '.site-footer-cols .col-industries ul{grid-template-columns:1fr;}' +
            '}\n' +
            '@media (max-width: 640px){' +
                '.site-footer{padding:56px 20px 32px;}' +
                '.site-footer-cols{grid-template-columns:1fr 1fr;gap:36px 24px;}' +
                '.site-footer-cols .col-industries{grid-column:1 / -1;}' +
                '.site-footer-cols .col-industries ul{grid-template-columns:repeat(2,1fr);}' +
                '.site-footer-legal{font-size:11px;gap:8px 14px;}' +
                '.site-footer-legal .legal-spacer{display:none;}' +
                '.site-footer-legal .legal-top{margin-left:auto;}' +
            '}\n' +
            '@media (max-width: 420px){' +
                '.site-footer-cols{grid-template-columns:1fr;gap:32px;}' +
                '.site-footer-cols .col-industries ul{grid-template-columns:1fr 1fr;}' +
            '}\n' +
            '';
        var style = document.createElement('style');
        style.id = 'site-footer-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function mount() {
        injectStyles();

        // Pages built on the dark-frame architecture have a
        // .background-layer (blurred photo) and body padding (--frame-x /
        // --frame-y-bot). The footer breaks out of that padding so it
        // spans edge-to-edge and reads on top of the photo. Other pages
        // Pages without that frame (persona pages, the brief / spec
        // docs under /briefs) get the same footer inline, without
        // bleed.
        var hasDarkFrame = !!document.querySelector('.background-layer');
        document.documentElement.classList.toggle('has-dark-frame', hasDarkFrame);

        // If the page already provides <footer class="site-footer">, we
        // populate it in place. Otherwise we append our own.
        var existing = document.querySelector('footer.site-footer');
        var footer = existing || document.createElement('footer');
        footer.className = 'site-footer' + (hasDarkFrame ? ' is-bleed' : ' is-inline');
        footer.setAttribute('role', 'contentinfo');
        footer.innerHTML = buildFooterHTML();

        if (!existing) {
            // Append AFTER any .scroller / main content so the footer
            // sits on the dark blurred body background.
            document.body.appendChild(footer);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
