// src/core.ts
import * as CookieConsent from "vanilla-cookieconsent";

// src/config.ts
var DEFAULT_COPY = {
  consentModal: {
    title: "We value your privacy",
    description: "We use strictly necessary cookies to make this site work. With your consent, we'd also like to use analytics cookies to understand how it's used and improve it.",
    acceptAllBtn: "Accept all",
    acceptNecessaryBtn: "Reject all",
    showPreferencesBtn: "Manage preferences"
  },
  preferencesModal: {
    title: "Manage cookie preferences",
    acceptAllBtn: "Accept all",
    acceptNecessaryBtn: "Reject all",
    savePreferencesBtn: "Save preferences",
    closeIconLabel: "Close",
    intro: {
      title: "Cookie usage",
      description: "We use cookies to keep this site working and, with your consent, to improve it. You can enable or disable each category below."
    }
  },
  categories: {
    necessary: {
      title: "Strictly necessary",
      description: "These cookies are essential for the site to function (for example, authentication) and cannot be switched off."
    },
    analytics: {
      title: "Analytics",
      description: "These cookies help us understand how the site is used so we can improve it. They are only set with your consent."
    },
    functional: {
      title: "Functional",
      description: "These cookies enable enhanced functionality, such as the support chat, and are only set with your consent."
    },
    marketing: {
      title: "Marketing",
      description: "These cookies are used to deliver content that is relevant to you, and are only set with your consent."
    }
  }
};
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function deepMerge(target, source) {
  if (!isPlainObject(source)) return source === void 0 ? target : source;
  const base = isPlainObject(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    base[key] = isPlainObject(value) ? deepMerge(base[key], value) : value;
  }
  return base;
}
function createConfig(options = {}) {
  const {
    categories = ["necessary", "analytics"],
    privacyPolicyUrl,
    language = "en",
    copy,
    guiOptions,
    onConsent,
    onChange,
    autoShow = true,
    configOverrides
  } = options;
  const text = deepMerge(DEFAULT_COPY, copy);
  const categoryConfig = {};
  for (const name of categories) {
    categoryConfig[name] = name === "necessary" ? { readOnly: true, enabled: true } : {};
  }
  const description = privacyPolicyUrl ? `${text.consentModal.description} See our <a href="${privacyPolicyUrl}">Privacy Policy</a>.` : text.consentModal.description;
  const sections = [
    {
      title: text.preferencesModal.intro.title,
      description: text.preferencesModal.intro.description
    },
    ...categories.map((name) => {
      const c = text.categories[name] ?? { title: name, description: "" };
      return {
        title: c.title,
        description: c.description,
        linkedCategory: name
      };
    })
  ];
  const config = {
    autoShow,
    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom left",
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: "box",
        position: "right",
        equalWeightButtons: true,
        flipButtons: false
      },
      ...guiOptions
    },
    categories: categoryConfig,
    language: {
      default: language,
      translations: {
        [language]: {
          consentModal: {
            title: text.consentModal.title,
            description,
            acceptAllBtn: text.consentModal.acceptAllBtn,
            acceptNecessaryBtn: text.consentModal.acceptNecessaryBtn,
            showPreferencesBtn: text.consentModal.showPreferencesBtn
          },
          preferencesModal: {
            title: text.preferencesModal.title,
            acceptAllBtn: text.preferencesModal.acceptAllBtn,
            acceptNecessaryBtn: text.preferencesModal.acceptNecessaryBtn,
            savePreferencesBtn: text.preferencesModal.savePreferencesBtn,
            closeIconLabel: text.preferencesModal.closeIconLabel,
            sections
          }
        }
      }
    },
    ...onConsent ? { onConsent } : {},
    ...onChange ? { onChange } : {}
  };
  return configOverrides ? deepMerge(config, configOverrides) : config;
}

// src/core.ts
var initialized = false;
function init(options = {}) {
  if (initialized || typeof document === "undefined") return;
  initialized = true;
  const { config, ...configOptions } = options;
  void CookieConsent.run(config ?? createConfig(configOptions));
}
function showPreferences2() {
  CookieConsent.showPreferences();
}
function show2(createModal) {
  CookieConsent.show(createModal);
}
function acceptedCategory2(category) {
  return CookieConsent.acceptedCategory(category);
}
function validConsent2() {
  return CookieConsent.validConsent();
}
function acceptCategory2(categories, excluded) {
  CookieConsent.acceptCategory(categories, excluded);
}
export {
  CookieConsent,
  acceptCategory2 as acceptCategory,
  acceptedCategory2 as acceptedCategory,
  createConfig,
  init,
  show2 as show,
  showPreferences2 as showPreferences,
  validConsent2 as validConsent
};
//# sourceMappingURL=index.js.map