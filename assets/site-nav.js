/* ──────────────────────────────────────────────────────────────────
   Fluso site-nav.

   Self-contained nav enhancement. Looks for every <header class="global-bar">
   on the page and:
     • Adds a hamburger toggle into its .right slot (created if missing).
     • Builds a single shared mobile drawer at <body> level.
     • Wires up the dropdown trigger to also work on tap.

   Breakpoint: 768px. Below that, the centered .local-nav is replaced by
   the hamburger; tapping it slides in a right-anchored drawer with a
   flat link list (Professionals items expanded inline so no nested menus
   on mobile).

   The script is idempotent — safe to load multiple times, and re-runs
   on DOM mutations are skipped via a dataset flag.
   ────────────────────────────────────────────────────────────────── */

(function () {
    'use strict';

    var BREAKPOINT = 768;

    // ── Canonical nav. Edit here, update everywhere. ──────────────────────
    var NAV_BRAND_HREF = 'index.html';
    var NAV_BRAND_LABEL = 'Fluso';
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
    var TOP_LINKS = [
        { href: 'pricing.html',     label: 'Pricing' },
        { href: 'enterprise.html',  label: 'Enterprise' },
        { label: 'Benchmarks',      soon: true },
        { href: 'get-started.html', label: 'Get started' }
    ];

    function escapeAttr(s) { return String(s).replace(/"/g, '&quot;'); }

    function buildNavHTML() {
        var industryItems = INDUSTRIES.map(function (i) {
            return '<a href="' + escapeAttr(i.href) + '" role="menuitem">' + i.label + '</a>';
        }).join('');
        var topItems = TOP_LINKS.map(function (l) {
            if (l.soon) {
                return '<span class="nav-coming-soon" aria-disabled="true" title="Coming soon">' +
                    l.label +
                    '</span>';
            }
            return '<a href="' + escapeAttr(l.href) + '">' + l.label + '</a>';
        }).join('');
        return '' +
            '<div class="left"><a href="' + escapeAttr(NAV_BRAND_HREF) + '">' + NAV_BRAND_LABEL + '</a></div>' +
            '<nav class="local-nav" aria-label="Primary">' +
              '<div class="nav-dropdown">' +
                '<button class="nav-dropdown-trigger" type="button" aria-haspopup="true" aria-expanded="false">' +
                  'Professionals ' +
                  '<svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg>' +
                '</button>' +
                '<div class="nav-dropdown-menu" role="menu">' + industryItems + '</div>' +
              '</div>' +
              topItems +
            '</nav>' +
            '<div class="right">' +
              '<a class="nav-prem" href="https://premai.io" target="_blank" rel="noopener noreferrer" aria-label="A product of Prem AI">' +
                '<span class="nav-prem-label">A product of</span>' +
                '<img src="assets/prem-logo-white.png" alt="Prem AI" class="nav-prem-logo">' +
              '</a>' +
            '</div>';
    }

    function injectNavStyles() {
        if (document.getElementById('site-nav-prem-styles')) return;
        var css =
            '.nav-prem{display:inline-flex;align-items:center;gap:10px;opacity:0.78;transition:opacity 0.18s ease,transform 0.18s ease;color:inherit;text-decoration:none;}\n' +
            '.nav-prem:hover{opacity:1;transform:translateY(-1px);}\n' +
            '.nav-prem-label{font-size:10.5px;text-transform:uppercase;letter-spacing:0.14em;color:rgba(242,241,237,0.55);font-weight:500;white-space:nowrap;}\n' +
            '.nav-prem-logo{height:18px;width:auto;display:block;}\n' +
            /* Coming-soon nav item — plain muted text, not interactive.
               Renders inline-block so it baselines exactly like the
               sibling <a> links in the local-nav flex row. */
            '.nav-coming-soon{display:inline-block;color:#faf9f5;opacity:0.35;font-size:13px;cursor:default;-webkit-tap-highlight-color:transparent;}\n' +
            '.mobile-nav-link.is-disabled{opacity:0.45;cursor:default;}\n' +
            '.mobile-nav-link.is-disabled:hover{background:transparent;}\n';
        var style = document.createElement('style');
        style.id = 'site-nav-prem-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Populate the first .global-bar with the canonical template. Pages
    // that don't have a .global-bar (e.g. the home page with its own
    // custom site header) are left untouched. Mark the link whose href
    // matches the current page as .active so styling hooks in the CSS
    // work without per-page edits.
    function populateCanonicalNav() {
        var bar = document.querySelector('.global-bar');
        if (!bar) return;
        bar.innerHTML = buildNavHTML();

        // Mark active item from URL.
        var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (!page || page === '' || page === '/') page = 'index.html';
        bar.querySelectorAll('a[href]').forEach(function (a) {
            var href = a.getAttribute('href').split('/').pop().toLowerCase();
            if (href === page) {
                a.classList.add('active');
                var dd = a.closest('.nav-dropdown');
                if (dd) {
                    var trig = dd.querySelector('.nav-dropdown-trigger');
                    if (trig) trig.classList.add('active');
                }
            }
        });
    }

    // ── Inject styles once (so pages without persona-pages.css still work) ──
    function injectStyles() {
        if (document.getElementById('site-nav-styles')) return;
        var css = '' +
            '.mobile-nav-toggle{display:none;background:transparent;border:0;color:#faf9f5;padding:6px;margin:0;cursor:pointer;align-items:center;justify-content:center;line-height:0;-webkit-tap-highlight-color:transparent;}\n' +
            '.mobile-nav-toggle svg{display:block;}\n' +
            '.mobile-nav-toggle .icon-close{display:none;}\n' +
            '.mobile-nav-toggle[aria-expanded="true"] .icon-open{display:none;}\n' +
            '.mobile-nav-toggle[aria-expanded="true"] .icon-close{display:block;}\n' +
            '.mobile-nav-toggle:hover{opacity:0.8;}\n' +
            '\n' +
            '.mobile-nav-backdrop{position:fixed;inset:0;background:rgba(8,8,8,0.55);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity 0.22s ease;z-index:998;}\n' +
            '.mobile-nav-backdrop.is-open{opacity:1;pointer-events:auto;}\n' +
            '\n' +
            '.mobile-nav-drawer{position:fixed;top:0;right:0;width:86%;max-width:360px;height:100%;background:#0c0c0c;color:#faf9f5;transform:translateX(100%);transition:transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);z-index:999;display:flex;flex-direction:column;box-shadow:-24px 0 60px rgba(0,0,0,0.55);}\n' +
            '.mobile-nav-drawer.is-open{transform:translateX(0);}\n' +
            '\n' +
            '.mobile-nav-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid rgba(242,241,237,0.1);flex-shrink:0;}\n' +
            '.mobile-nav-head .brand{font-size:14px;font-weight:500;letter-spacing:0.01em;color:#faf9f5;}\n' +
            '.mobile-nav-head .close-btn{background:transparent;border:0;color:#faf9f5;padding:6px;cursor:pointer;line-height:0;border-radius:6px;-webkit-tap-highlight-color:transparent;}\n' +
            '.mobile-nav-head .close-btn:hover{background:rgba(242,241,237,0.08);}\n' +
            '\n' +
            '.mobile-nav-body{padding:18px 16px 32px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:8px;}\n' +
            '\n' +
            '.mobile-nav-section{display:flex;flex-direction:column;gap:2px;}\n' +
            '\n' +
            '.mobile-nav-link{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;padding:14px 12px;font-size:17px;font-weight:500;color:#faf9f5;text-decoration:none;border-radius:8px;border:0;background:transparent;font-family:inherit;letter-spacing:-0.005em;cursor:pointer;transition:background 0.15s ease,opacity 0.15s ease;opacity:0.9;-webkit-tap-highlight-color:transparent;}\n' +
            '.mobile-nav-link:hover{background:rgba(242,241,237,0.06);opacity:1;}\n' +
            '.mobile-nav-link.is-active{opacity:1;background:rgba(242,241,237,0.08);}\n' +
            '\n' +
            '.mobile-nav-group{display:flex;flex-direction:column;}\n' +
            '.mobile-nav-group-trigger .chev{transition:transform 0.2s ease;opacity:0.7;}\n' +
            '.mobile-nav-group.is-open .mobile-nav-group-trigger .chev{transform:rotate(180deg);}\n' +
            '.mobile-nav-submenu{display:none;flex-direction:column;gap:1px;padding:4px 0 6px 8px;}\n' +
            '.mobile-nav-group.is-open .mobile-nav-submenu{display:flex;}\n' +
            '.mobile-nav-sublink{display:block;padding:10px 14px;font-size:15px;font-weight:400;color:rgba(242,241,237,0.78);text-decoration:none;border-radius:6px;transition:background 0.15s ease,opacity 0.15s ease,color 0.15s ease;-webkit-tap-highlight-color:transparent;}\n' +
            '.mobile-nav-sublink:hover{background:rgba(242,241,237,0.05);color:#faf9f5;}\n' +
            '.mobile-nav-sublink.is-active{color:#faf9f5;font-weight:600;background:rgba(242,241,237,0.08);}\n' +
            '\n' +
            'body.site-nav-locked{overflow:hidden;}\n' +
            '\n' +
            '@media (max-width: ' + BREAKPOINT + 'px){\n' +
            '  .global-bar > .local-nav{display:none !important;}\n' +
            '  .global-bar > .right{display:flex !important;align-items:center;justify-content:flex-end;color:transparent;font-size:0;}\n' +
            '  .global-bar > .right > *:not(.mobile-nav-toggle){display:none !important;}\n' +
            '  .global-bar > .right{margin-left:auto;}\n' +
            '  .mobile-nav-toggle{display:inline-flex;color:#faf9f5;font-size:14px;}\n' +
            '}\n' +
            '@media (min-width: ' + (BREAKPOINT + 1) + 'px){\n' +
            '  .mobile-nav-drawer,.mobile-nav-backdrop{display:none !important;}\n' +
            '}\n';
        var style = document.createElement('style');
        style.id = 'site-nav-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ── Build the shared mobile drawer (one per page) ──
    var drawer, backdrop, lastFocus;

    function buildDrawerIfNeeded(sourceBar) {
        if (drawer) return;

        backdrop = document.createElement('div');
        backdrop.className = 'mobile-nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);

        drawer = document.createElement('aside');
        drawer.className = 'mobile-nav-drawer';
        drawer.setAttribute('aria-hidden', 'true');
        drawer.setAttribute('aria-label', 'Navigation');
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        document.body.appendChild(drawer);

        rebuildDrawerContents(sourceBar);

        backdrop.addEventListener('click', closeDrawer);
        drawer.addEventListener('click', function (e) {
            var link = e.target.closest('a');
            if (link) closeDrawer();
        });
    }

    function rebuildDrawerContents(sourceBar) {
        var sourceNav = sourceBar.querySelector('.local-nav');
        if (!sourceNav) return;
        drawer.innerHTML = '';

        // Head: brand + close
        var head = document.createElement('div');
        head.className = 'mobile-nav-head';
        var brandText = (sourceBar.querySelector('.left') || {}).textContent || 'Fluso';
        head.innerHTML =
            '<span class="brand">' + brandText.trim() + '</span>' +
            '<button class="close-btn" aria-label="Close menu">' +
            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' +
            '</button>';
        drawer.appendChild(head);
        head.querySelector('.close-btn').addEventListener('click', closeDrawer);

        // Body: nav sections (one flat list, Professionals is a collapsible group)
        var body = document.createElement('div');
        body.className = 'mobile-nav-body';
        var section = document.createElement('div');
        section.className = 'mobile-nav-section';

        // ─ Professionals: collapsible group ─
        var dropdownTrigger = sourceNav.querySelector('.nav-dropdown-trigger');
        var dropdownMenu = sourceNav.querySelector('.nav-dropdown-menu');
        if (dropdownTrigger && dropdownMenu) {
            var group = document.createElement('div');
            group.className = 'mobile-nav-group';
            var anyActive = dropdownTrigger.classList.contains('active') ||
                            !!dropdownMenu.querySelector('a.active');
            if (anyActive) group.classList.add('is-open');

            var trig = document.createElement('button');
            trig.type = 'button';
            trig.className = 'mobile-nav-link mobile-nav-group-trigger' + (dropdownTrigger.classList.contains('active') ? ' is-active' : '');
            trig.setAttribute('aria-expanded', anyActive ? 'true' : 'false');
            trig.innerHTML =
                '<span>Professionals</span>' +
                '<svg class="chev" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg>';
            trig.addEventListener('click', function () {
                var open = group.classList.toggle('is-open');
                trig.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            group.appendChild(trig);

            var sub = document.createElement('div');
            sub.className = 'mobile-nav-submenu';
            dropdownMenu.querySelectorAll('a').forEach(function (a) {
                var link = document.createElement('a');
                link.className = 'mobile-nav-sublink' + (a.classList.contains('active') ? ' is-active' : '');
                link.href = a.getAttribute('href');
                link.textContent = a.textContent.trim();
                sub.appendChild(link);
            });
            group.appendChild(sub);
            section.appendChild(group);
        }

        // ─ Other top-level links ─
        sourceNav.querySelectorAll(':scope > a, :scope > .nav-coming-soon').forEach(function (el) {
            if (el.classList.contains('nav-coming-soon')) {
                var item = document.createElement('span');
                item.className = 'mobile-nav-link is-disabled';
                item.setAttribute('aria-disabled', 'true');
                item.textContent = el.textContent.trim();
                section.appendChild(item);
                return;
            }
            var link = document.createElement('a');
            link.className = 'mobile-nav-link' + (el.classList.contains('active') ? ' is-active' : '');
            link.href = el.getAttribute('href');
            link.textContent = el.textContent.trim();
            section.appendChild(link);
        });

        body.appendChild(section);
        drawer.appendChild(body);
    }

    function openDrawer() {
        if (!drawer) return;
        lastFocus = document.activeElement;
        drawer.classList.add('is-open');
        backdrop.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('site-nav-locked');
        document.querySelectorAll('.mobile-nav-toggle').forEach(function (btn) {
            btn.setAttribute('aria-expanded', 'true');
            btn.setAttribute('aria-label', 'Close menu');
        });
        var firstLink = drawer.querySelector('.close-btn');
        if (firstLink) firstLink.focus();
    }

    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('site-nav-locked');
        document.querySelectorAll('.mobile-nav-toggle').forEach(function (btn) {
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Open menu');
        });
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
            lastFocus = null;
        }
    }

    // ── Enhance each .global-bar found on the page ──
    function enhanceBar(bar) {
        if (bar.dataset.siteNavEnhanced === '1') return;
        bar.dataset.siteNavEnhanced = '1';

        // Ensure a .right slot exists (some pages may omit it).
        var rightSlot = bar.querySelector('.right');
        if (!rightSlot) {
            rightSlot = document.createElement('div');
            rightSlot.className = 'right';
            bar.appendChild(rightSlot);
        }

        // Build hamburger
        var btn = document.createElement('button');
        btn.className = 'mobile-nav-toggle';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Open menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'site-nav-drawer');
        btn.innerHTML =
            '<svg class="icon-open" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>' +
            '<svg class="icon-close" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
        rightSlot.appendChild(btn);

        // Wire up
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            buildDrawerIfNeeded(bar);
            if (drawer.classList.contains('is-open')) closeDrawer();
            else openDrawer();
        });

        // Make dropdown triggers tap-friendly on desktop too.
        bar.querySelectorAll('.nav-dropdown-trigger').forEach(function (trig) {
            if (trig.dataset.siteNavWired === '1') return;
            trig.dataset.siteNavWired = '1';
            trig.addEventListener('click', function (e) {
                e.preventDefault();
                var dd = trig.closest('.nav-dropdown');
                if (!dd) return;
                dd.classList.toggle('is-open');
                dd.classList.toggle('open'); /* compat with persona-pages.css */
                var expanded = dd.classList.contains('is-open') || dd.classList.contains('open');
                trig.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
        });
    }

    function init() {
        injectStyles();
        injectNavStyles();
        populateCanonicalNav();
        document.querySelectorAll('.global-bar').forEach(enhanceBar);

        // Keyboard + outside click + resize
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (drawer && drawer.classList.contains('is-open')) closeDrawer();
                document.querySelectorAll('.nav-dropdown.is-open, .nav-dropdown.open').forEach(function (dd) {
                    dd.classList.remove('is-open');
                    dd.classList.remove('open');
                    var trig = dd.querySelector('.nav-dropdown-trigger');
                    if (trig) trig.setAttribute('aria-expanded', 'false');
                });
            }
        });
        document.addEventListener('click', function (e) {
            document.querySelectorAll('.nav-dropdown.is-open, .nav-dropdown.open').forEach(function (dd) {
                if (!dd.contains(e.target)) {
                    dd.classList.remove('is-open');
                    dd.classList.remove('open');
                    var trig = dd.querySelector('.nav-dropdown-trigger');
                    if (trig) trig.setAttribute('aria-expanded', 'false');
                }
            });
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > BREAKPOINT && drawer && drawer.classList.contains('is-open')) {
                closeDrawer();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
