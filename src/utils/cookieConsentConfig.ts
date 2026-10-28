import { createConfig } from "@premAI-io/cookie-consent/react";

export const cookieConsentConfig = createConfig({
  categories: ["necessary", "analytics"],
  privacyPolicyUrl: "/privacy",
  copy: {
    preferencesModal: {
      intro: {
        title: "",
      },
    },
  },
  configOverrides: {
    categories: {
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: "_gid" }],
          reloadPage: true,
        },
      },
    },
  },
});
