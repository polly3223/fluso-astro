/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Analytics measurement ID — see src/components/GoogleAnalyticsGate.tsx. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
