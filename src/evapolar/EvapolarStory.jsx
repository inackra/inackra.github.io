import React, { useEffect, useRef, useState } from 'react';
import FlipText from '../FlipText';
import { evapolarCopy } from './copy';
import media from './media.json';
import '../aio/aio-story.css';
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
  if (cover) return <div className="project-cover">{img}</div>;
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
  const [visible, setVisible] = useState(false);
  const card = useRef(null);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: 0.55 });
    observer.observe(card.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={card} className={`eva-schematic eva-schematic-${type}`}>
    <p className="eyebrow">{copy.schematic}</p>
    <div className={`eva-steps${visible && !paused ? ' is-playing' : ''}`}>
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
  return <article className="aio-study eva-story">
    <header className="aio-project-intro archive-page">
      <p className="eyebrow">{copy.role} · 2022–2023</p>
      <h1>Evapolar.</h1>
      <p className="archive-intro">{copy.headline}</p>
      <p className="aio-project-context">{copy.intro}</p>
    </header>
    <Evidence name="cover" cover />
    <section className="eva-impact" aria-labelledby="eva-impact">
      <h2 id="eva-impact">{copy.impact}</h2>
      <dl className="case-metrics">{copy.metrics.map(([value, label]) => <div key={label}><dt><strong>{value}</strong></dt><dd>{label}</dd></div>)}</dl>
      <p>{copy.note}</p>
    </section>
    <nav className="aio-task-navigation" aria-label={lang === 'ru' ? 'Разделы кейса Evapolar' : 'Evapolar case sections'}>
      <div className="archive-filters">{chapters.map(({ id }) => <a key={id} href={`#eva-${id}`}><FlipText>{copy.sections[id][0]}</FlipText></a>)}</div>
    </nav>
    {chapters.map(({ id, rows }) => <section className="eva-chapter" id={`eva-${id}`} key={id} aria-labelledby={`eva-title-${id}`}>
      <header className="aio-task-heading"><h2 id={`eva-title-${id}`}>{copy.sections[id][0]}</h2><p className="privacy-intro">{copy.sections[id][1]}</p></header>
      {copy.steps[id] && <ProcessCard type={id} copy={copy} paused={paused} />}
      {rows.map(row => <div className="eva-row" style={{ '--eva-columns': row.length }} key={row[0]}>
        {row.map(name => <Evidence key={name} name={name} label={copy.evidence[name]} />)}
      </div>)}
    </section>)}
  </article>;
}
