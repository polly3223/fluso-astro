import { StrictMode, type ReactNode } from 'react';
import App from './App';
import './i18n';

if (typeof history !== 'undefined' && 'scrollRestoration' in history) history.scrollRestoration = 'manual';

export default function Website({children}: {children?: ReactNode}) {
  return <StrictMode><App>{children}</App></StrictMode>;
}
