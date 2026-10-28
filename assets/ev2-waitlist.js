/* Early-access waitlist modal.
   Any element with [data-ev2-open-waitlist] opens the modal.
   Deep-link: ?early-access=1 or #early-access auto-opens on page load.
   Submits to /api/waitlist, falls back to a direct Google Sheets POST. */
(function () {
    const MODAL_HTML = `
        <dialog class="ev2-waitlist-dialog" id="ev2-early-access-modal" aria-labelledby="ev2-early-access-title">
            <div class="ev2-waitlist-modal">
                <div class="ev2-waitlist-modal-top">
                    <div>
                        <div class="ev2-waitlist-kicker">Private beta</div>
                        <h2 id="ev2-early-access-title">Get early access.</h2>
                        <p>Drop your work email and we'll add you to the private beta list.</p>
                    </div>
                    <button class="ev2-modal-close" type="button" aria-label="Close early access form" data-ev2-close-waitlist>
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <form class="ev2-modal-form" data-ev2-waitlist-form novalidate>
                    <label for="ev2-early-access-email">Work email</label>
                    <input id="ev2-early-access-email" type="email" name="email" autocomplete="email" placeholder="you@company.com" required>
                    <button class="ev2-submit-btn" type="submit" aria-busy="false">
                        <span data-ev2-submit-label>Request early access</span>
                        <i class="ev2-submit-spinner" aria-hidden="true"></i>
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="ev2-form-message" data-ev2-waitlist-message role="status" aria-live="polite"></div>
                </form>
            </div>
        </dialog>
    `;

    const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwKZSLijU53g6OsI79_F5YThmkdhMskj8ky4osZ-R4dcuoyImI7FKadk-mH-yVfUXIN3g/exec';
    const API_ENDPOINT = '/api/waitlist';

    function ensureModal() {
        let dialog = document.querySelector('#ev2-early-access-modal');
        if (dialog) return dialog;
        const wrap = document.createElement('div');
        wrap.innerHTML = MODAL_HTML.trim();
        dialog = wrap.firstElementChild;
        document.body.appendChild(dialog);
        return dialog;
    }

    function init() {
        const dialog = ensureModal();
        if (!dialog || dialog.dataset.ev2Initialised === 'true') return;
        dialog.dataset.ev2Initialised = 'true';

        const form = dialog.querySelector('[data-ev2-waitlist-form]');
        const message = dialog.querySelector('[data-ev2-waitlist-message]');
        const emailInput = dialog.querySelector('#ev2-early-access-email');
        const closers = dialog.querySelectorAll('[data-ev2-close-waitlist]');
        let returnFocus = null;

        function setButtonState(button, state) {
            if (!button) return;
            const label = button.querySelector('[data-ev2-submit-label]');
            const copy = {
                idle: 'Request early access',
                submitting: 'Requesting...',
                success: 'Request sent',
                error: 'Try again'
            };
            button.setAttribute('aria-busy', state === 'submitting' ? 'true' : 'false');
            button.disabled = state === 'submitting';
            if (label) label.textContent = copy[state] || copy.idle;
        }

        function open(trigger) {
            returnFocus = trigger || document.activeElement;
            message.className = 'ev2-form-message';
            message.textContent = '';
            if (!dialog.open) {
                if (typeof dialog.showModal === 'function') {
                    dialog.showModal();
                } else {
                    dialog.setAttribute('open', '');
                }
            }
            window.setTimeout(() => emailInput && emailInput.focus(), 0);
        }

        function close() {
            if (!dialog.open) return;
            if (typeof dialog.close === 'function') {
                dialog.close();
            } else {
                dialog.removeAttribute('open');
            }
        }

        // Event delegation so openers added later still work.
        document.addEventListener('click', (event) => {
            const opener = event.target.closest('[data-ev2-open-waitlist]');
            if (!opener) return;
            event.preventDefault();
            open(opener);
        });

        closers.forEach((closer) => {
            closer.addEventListener('click', close);
        });

        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) close();
        });

        dialog.addEventListener('close', () => {
            if (returnFocus && document.contains(returnFocus)) {
                returnFocus.focus();
            }
        });

        const shouldAutoOpen =
            window.location.hash === '#early-access' ||
            new URLSearchParams(window.location.search).get('early-access') === '1';
        if (shouldAutoOpen) {
            window.setTimeout(() => open(), 200);
        }

        async function submitWaitlist(email) {
            const payload = {
                email,
                timestamp: new Date().toISOString(),
                source: 'fluso-enterprise-v2'
            };

            if (window.location.protocol !== 'file:') {
                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json().catch(() => ({}));
                    if (!response.ok) throw new Error(data.error || 'Unable to request access');
                    return;
                } catch (error) {
                    console.warn('Falling back to Google Sheets waitlist endpoint.', error);
                }
            }

            await fetch(SHEETS_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = form.querySelector('button[type="submit"]');
            const email = new FormData(form).get('email').toString().trim();
            if (!email) return;

            message.className = 'ev2-form-message';
            message.textContent = 'Sending your request...';
            setButtonState(button, 'submitting');

            try {
                await submitWaitlist(email);
                form.reset();
                setButtonState(button, 'success');
                message.className = 'ev2-form-message success';
                message.textContent = "You're on the early access list. We'll email you soon.";
            } catch (error) {
                setButtonState(button, 'error');
                message.className = 'ev2-form-message error';
                message.textContent = error.message || 'Something went wrong. Please try again.';
            } finally {
                window.setTimeout(() => setButtonState(button, 'idle'), 1400);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
