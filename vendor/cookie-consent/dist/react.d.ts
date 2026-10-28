import * as react from 'react';
import { CookieConsentConfig } from 'vanilla-cookieconsent';
export { CookieConsentConfig } from 'vanilla-cookieconsent';

/**
 * Known consent categories. Any string is accepted (custom categories are fine);
 * the listed ones ship with sensible default copy.
 */
type ConsentCategory = "necessary" | "analytics" | "functional" | "marketing" | (string & {});
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
/** Text shown in the consent banner and preferences modal. All fields are overridable. */
interface ConsentCopy {
    consentModal: {
        title: string;
        /** Supports HTML. A "Privacy Policy" link is appended automatically when `privacyPolicyUrl` is set. */
        description: string;
        acceptAllBtn: string;
        acceptNecessaryBtn: string;
        showPreferencesBtn: string;
    };
    preferencesModal: {
        title: string;
        acceptAllBtn: string;
        acceptNecessaryBtn: string;
        savePreferencesBtn: string;
        closeIconLabel: string;
        /** Intro section shown above the per-category toggles. */
        intro: {
            title: string;
            description: string;
        };
    };
    /** Per-category title/description used to build the preferences-modal sections. */
    categories: Record<string, {
        title: string;
        description: string;
    }>;
}
interface CreateConfigOptions {
    /** Categories to expose. `necessary` is always forced read-only + enabled. Default: ["necessary", "analytics"]. */
    categories?: ConsentCategory[];
    /** URL of the privacy/cookie policy. When set, a "Privacy Policy" link is appended to the consent description. */
    privacyPolicyUrl?: string;
    /** Default language code. Default: "en". */
    language?: string;
    /** Override any of the default copy (deep-merged). */
    copy?: DeepPartial<ConsentCopy>;
    /** vanilla-cookieconsent GUI options (layout/position). Sensible defaults applied. */
    guiOptions?: CookieConsentConfig["guiOptions"];
    /** Fired once after the user makes their first choice. */
    onConsent?: CookieConsentConfig["onConsent"];
    /** Fired whenever consent changes. */
    onChange?: CookieConsentConfig["onChange"];
    /** Whether to show the consent modal automatically on load. Default: true. */
    autoShow?: boolean;
    /** Escape hatch: deep-merged over the generated config as the final step. */
    configOverrides?: DeepPartial<CookieConsentConfig>;
}
/**
 * Build a complete vanilla-cookieconsent config from high-level options.
 * Nothing app-specific is baked in — customise via options or `configOverrides`.
 */
declare function createConfig(options?: CreateConfigOptions): CookieConsentConfig;

type InitOptions = CreateConfigOptions & {
    /**
     * Provide a fully-formed vanilla-cookieconsent config instead of building one
     * from the high-level options. When set, all other options are ignored.
     */
    config?: CookieConsentConfig;
};
/**
 * Initialise the consent manager. Safe to call more than once (e.g. React
 * StrictMode double-invoke) — only the first call runs.
 *
 * Scripts are gated declaratively:
 *   <script type="text/plain" data-category="analytics">…</script>
 */
declare function init(options?: InitOptions): void;
/** Re-open the preferences modal (e.g. from a "Manage cookies" link). */
declare function showPreferences(): void;
/** Show the main consent modal. */
declare function show(createModal?: boolean): void;
/** Whether the given category is currently accepted. */
declare function acceptedCategory(category: string): boolean;
/** Whether a valid consent choice has already been recorded. */
declare function validConsent(): boolean;
/** Programmatically accept categories: "all", "necessary", or a specific list. */
declare function acceptCategory(categories?: string[] | "all" | "necessary", excluded?: string[]): void;

type CookieConsentProps = InitOptions;
/**
 * Mount once, high in your tree. Initialises the consent manager on the client.
 * Renders nothing (the library manages its own DOM). StrictMode-safe.
 *
 *   import { CookieConsent } from "@premai/cookie-consent/react"
 *   import "@premai/cookie-consent/styles.css"
 *   <CookieConsent config={createConfig({ privacyPolicyUrl: "/privacy" })} />
 */
declare function CookieConsent(props: CookieConsentProps): null;
/** Returns a callback that re-opens the preferences modal. */
declare function useManageCookies(): () => void;
interface ManageCookiesButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}
/**
 * Unstyled button that re-opens the preferences modal. Pass `className`/`children`
 * to match your app; falls back to "Manage cookies".
 */
declare function ManageCookiesButton({ children, onClick, type, ...rest }: ManageCookiesButtonProps): react.JSX.Element;

export { type ConsentCategory, type ConsentCopy, CookieConsent, type CookieConsentProps, type CreateConfigOptions, type InitOptions, ManageCookiesButton, type ManageCookiesButtonProps, acceptCategory, acceptedCategory, createConfig, init, show, showPreferences, useManageCookies, validConsent };
