import React from 'react';
import sources from '../../public/assets/cases/sources.json';
import { semrushCopy } from './copy';
import '../aio/aio-story.css';
import '../evapolar/evapolar.css';
import './semrush.css';

const assets = Object.fromEntries(
  sources.assets.filter(asset => asset.case === 'semrush').map(asset => [asset.index, asset])
);

const library = { path: '/assets/cases/semrush/library.webp', width: 1716, height: 1608 };

function Evidence({ asset, label }) {
  return <figure className="eva-evidence">
    <a href={asset.path} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <img src={asset.path} width={asset.width} height={asset.height} alt="" loading="lazy" decoding="async" />
    </a>
    <figcaption>{label}</figcaption>
  </figure>;
}

function Chapter({ id, title, children, text }) {
  return <section className="eva-chapter" aria-labelledby={id}>
    <header className="aio-task-heading">
      <h2 id={id}>{title}</h2>
      <p className="privacy-intro">{text}</p>
    </header>
    {children}
  </section>;
}

function AssemblyDiagram({ copy, paused }) {
  return <div className="eva-schematic semrush-schematic">
    <p className="eyebrow">{copy.scheme}</p>
    <ol className={paused ? 'eva-steps' : 'eva-steps is-playing'}>
      {copy.steps.map((label, index) => <li className="eva-step" key={label} style={{ '--eva-step': index }}>
        <div className="eva-step-picture" aria-hidden="true"><i /><i /><i /></div>
        <span>{label}</span>
      </li>)}
    </ol>
  </div>;
}

export default function SemrushStory({ lang, project, paused }) {
  const copy = semrushCopy[lang];
  const { cover } = project;
  return <article className="aio-study semrush-story">
    <section className="aio-project-intro archive-page" aria-labelledby="semrush-title">
      <p className="eyebrow">{project.role} · {project.period}</p>
      <h1 id="semrush-title">Semrush.</h1>
      <p className="archive-intro">{copy.headline}</p>
      <p className="aio-project-context">{copy.takeaway}</p>
    </section>
    <figure className="project-cover">
      <img src={cover.path} width={cover.width} height={cover.height} alt="" decoding="async" />
    </figure>
    <Chapter id="semrush-context" title={copy.contextTitle} text={copy.context}>
      <p className="privacy-intro">{copy.approach}</p>
    </Chapter>
    <Chapter id="semrush-landing" title={copy.landingTitle} text={copy.landing}>
      <Evidence asset={assets[2]} label={copy.components} />
      <AssemblyDiagram copy={copy} paused={paused} />
      <Evidence asset={assets[1]} label={copy.responsive} />
    </Chapter>
    <Chapter id="semrush-email" title={copy.emailTitle} text={copy.email}>
      <Evidence asset={assets[5]} label={copy.emailBuilder} />
    </Chapter>
    <Chapter id="semrush-visuals" title={copy.visualsTitle} text={copy.visuals}>
      <Evidence asset={library} label={copy.library} />
      <Evidence asset={assets[4]} label={copy.formats} />
    </Chapter>
    <section className="eva-chapter eva-impact" aria-labelledby="semrush-results">
      <h2 id="semrush-results">{copy.resultsTitle}</h2>
      <dl className="case-metrics">
        {copy.metrics.map(([value, label]) => <div key={label}><dt><strong>{value}</strong></dt><dd>{label}</dd></div>)}
      </dl>
      <p className="privacy-intro">{copy.outcome}</p>
    </section>
  </article>;
}
