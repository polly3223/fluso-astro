import { StrictMode } from 'react';
import App from './App';
import './i18n';

if (typeof history !== 'undefined' && 'scrollRestoration' in history) history.scrollRestoration = 'manual';

export default function Website() {
  return <StrictMode><App /></StrictMode>;
}
