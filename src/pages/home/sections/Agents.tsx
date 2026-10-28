import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TITLE } from './_chrome';

type Example = {title: string; schedule: string; body: string; apps: string; control: string};

export default function Agents({children}: {children?: ReactNode}) {
  const {t} = useTranslation('home');
  const [selected, setSelected] = useState(0);
  const examples = t('agents.examples', {returnObjects: true}) as Example[];
  const steps = t('agents.steps', {returnObjects: true}) as {title: string; body: string}[];
  const example = examples[selected];
  return (
    <section id="agents" aria-labelledby="agents-title" data-nav-dark className="scroll-mt-28 px-[clamp(24px,4vw,64px)] py-20 text-bone md:py-28">
      <div className="mx-auto max-w-[1290px]">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[.18em] text-bone/50">{t('agents.eyebrow')}</p>
        <div className="grid items-end gap-7 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <h2 id="agents-title" className={`${TITLE} max-w-[15ch] text-bone`}>{t('agents.title')}</h2>
          <div>
            <p className="max-w-[48ch] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-bone/70">{t('agents.body')}</p>
            <p className="mt-4 text-sm text-bone/50">{t('agents.availability')}</p>
            <Link to="/get-started" className="mt-6 inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink no-underline transition-opacity hover:opacity-80">{t('agents.cta')} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="mt-12 md:mt-16">{children}</div>

        <ol className="mt-12 grid list-none gap-8 border-t border-bone/15 pt-8 md:grid-cols-3 md:gap-12">
          {steps.map((step, index) => <li key={step.title}>
            <p className="font-mono text-xs text-bone/40">0{index + 1}</p>
            <h3 className="mt-3 text-xl font-medium tracking-tight">{step.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-bone/60">{step.body}</p>
          </li>)}
        </ol>

        <div className="mt-14 rounded-3xl border border-bone/15 p-5 md:p-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[.16em] text-bone/45">{t('agents.examplesLabel')}</p>
          <div className="flex flex-wrap gap-2" aria-label={t('agents.examplesLabel')}>
            {examples.map((item, index) => <button key={item.title} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors ${selected === index ? 'border-bone bg-bone text-ink' : 'border-bone/20 bg-transparent text-bone/65 hover:border-bone/60 hover:text-bone'}`}>{item.title}</button>)}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-[1.5fr_1fr] md:gap-12" aria-live="polite">
            <div><h3 className="text-xl font-medium">{example.schedule}</h3><p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-bone/65">{example.body}</p></div>
            <div className="text-sm leading-relaxed text-bone/60"><p className="text-bone/85">{example.apps}</p><p className="mt-2">{example.control}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
