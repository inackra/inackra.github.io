import React, { useEffect, useRef, useState } from 'react';
import { evapolarCopy } from './copy';
import media from './media.json';
import './evapolar.css';

const chapters = [
  { id: 'store', rows: [['responsive-store'], ['components', 'layouts'], ['responsive-product', 'responsive-editorial']] },
  { id: 'amazon', rows: [['amazon-quiet', 'amazon-controls'], ['amazon-locales'], ['amazon-energy', 'amazon-variants', 'amazon-assets']] },
  { id: 'launch', rows: [['loona-identity', 'loona-packaging', 'loona-sleep', 'loona-offer']] },
  { id: 'visual', rows: [['render-detail'], ['chill', 'smart', 'pure'], ['lifestyle']] },
  { id: 'email', rows: [] },
];

function Evidence({ name, label, cover = false }) {
  const asset = media[name];
  const img = <img src={asset.path} width={asset.width} height={asset.height} alt={cover ? '' : label} loading={cover ? 'eager' : 'lazy'} decoding="async" />;
  if (cover) return <div className="eva-cover">{img}</div>;
  return <figure className="eva-evidence">
    <a href={asset.path} target="_blank" rel="noopener noreferrer" aria-label={label}>{img}</a>
    <figcaption>{label}</figcaption>
  </figure>;
}

const processVisuals = {
  store: [null, 'responsive-store', null],
  amazon: ['cover', 'amazon-quiet', 'amazon-locales'],
  visual: [null, 'render-detail', 'chill'],
};

function ProcessCard({ type, copy, paused }) {
  const [run, setRun] = useState(0);
  const card = useRef(null);
  useEffect(() => {
    if (paused || run || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRun(value => value || 1);
      observer.disconnect();
    }, { threshold: 0.55 });
    observer.observe(card.current);
    return () => observer.disconnect();
  }, [paused, run]);
  return <div ref={card} className={`eva-schematic eva-schematic-${type}`}>
    <div className="eva-schematic-header"><span>{copy.schematic}</span><button type="button" onClick={() => setRun(value => value + 1)}>{copy.play}</button></div>
    <div className={`eva-steps${run ? ' is-playing' : ''}`} key={run}>
      {copy.steps[type].map((label, index) => <div className="eva-step" key={label} style={{ '--eva-step': index }}>
        <div className="eva-step-picture" aria-hidden="true">
          {processVisuals[type][index]
            ? <img src={media[processVisuals[type][index]].path} alt="" loading="lazy" decoding="async" />
            : <><i /><i /><i /></>}
        </div>
        <span>{label}</span>
      </div>)}
    </div>
  </div>;
}

export default function EvapolarStory({ lang, paused }) {
  const copy = evapolarCopy[lang];
  return <article className="eva-story" data-motion-paused={paused}>
    <header className="eva-intro">
      <p className="eyebrow">{copy.discipline} · 2022–2023</p>
      <h1>Evapolar</h1>
      <h2>{copy.headline}</h2>
      <p>{copy.intro}</p>
      <p className="eva-role">{copy.role}</p>
    </header>
    <Evidence name="cover" cover />
    <section className="eva-impact" aria-labelledby="eva-impact">
      <h2 id="eva-impact">{copy.impact}</h2>
      <dl>{copy.metrics.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
      <p>{copy.note}</p>
    </section>
    <nav className="eva-nav" aria-label={lang === 'ru' ? 'Разделы кейса Evapolar' : 'Evapolar case sections'}>
      {chapters.map(({ id }) => <a key={id} href={`#eva-${id}`}>{copy.sections[id][0]}</a>)}
    </nav>
    {chapters.map(({ id, rows }) => <section className="eva-chapter" id={`eva-${id}`} key={id} aria-labelledby={`eva-title-${id}`}>
      <header><h2 id={`eva-title-${id}`}>{copy.sections[id][0]}</h2><p>{copy.sections[id][1]}</p></header>
      {copy.steps[id] && <ProcessCard type={id} copy={copy} paused={paused} />}
      {rows.map(row => <div className="eva-row" style={{ '--eva-columns': row.length }} key={row[0]}>
        {row.map(name => <Evidence key={name} name={name} label={copy.evidence[name]} />)}
      </div>)}
    </section>)}
  </article>;
}
