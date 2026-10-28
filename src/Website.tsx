import { StrictMode, type ReactNode } from 'react';
import App from './App';
import './i18n';

if (typeof history !== 'undefined' && 'scrollRestoration' in history) history.scrollRestoration = 'manual';

export default function Website({children, chatDemo}: {children?: ReactNode; chatDemo?: ReactNode}) {
  return <StrictMode><App chatDemo={chatDemo}>{children}</App></StrictMode>;
}
