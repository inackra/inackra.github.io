import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {content, EMAIL, LINKEDIN, PORTFOLIO} from './content';
import './style.css';

function App() {
  const [lang, setLang] = useState(() => {try {return localStorage.getItem('yan-language') === 'en' ? 'en' : 'ru';} catch {return 'ru';}});
  const [notes, setNotes] = useState(false);
  const [intent, setIntent] = useState('project');
  const [drafts, setDrafts] = useState({project: '', role: ''});
  const [copyStatus, setCopyStatus] = useState('');
  const t = content[lang];
  useEffect(() => { document.documentElement.lang = lang; try {localStorage.setItem('yan-language',lang);} catch {} }, [lang]);
  useEffect(() => {setCopyStatus('');}, [lang]);
  function choose(type, target = 'contact') {
    setIntent(type);
    document.getElementById(target)?.scrollIntoView({behavior:'auto', block:'start'});
    history.replaceState(null,'',`#${target}`);
  }
  async function copyEmail() {
    try {await navigator.clipboard.writeText(EMAIL); setCopyStatus(t.contact.copied);} catch {setCopyStatus(t.contact.failed);}
  }
  const subject = intent === 'project' ? t.contact.subjectProject : t.contact.subjectRole;
  const body = drafts[intent].trim() || (intent === 'project' ? t.contact.defaultProject : t.contact.defaultRole);
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const Note = ({children}) => notes ? <aside className="note">{children}</aside> : null;
  return <>
    <a className="skip" href="#main">{t.skip}</a>
    <div className="review-bar"><div className="container review-inner"><span>{t.proto} <span className="version">/ {t.version}</span></span><div className="controls"><a href="/">Демо</a><button className="notes-toggle" onClick={()=>setNotes(!notes)} aria-pressed={notes}>{t.notes} {notes ? '−' : '+'}</button><div className="language" aria-label="Language"><button lang="ru" aria-pressed={lang==='ru'} onClick={()=>setLang('ru')}>RU</button><button lang="en" aria-pressed={lang==='en'} onClick={()=>setLang('en')}>EN</button></div></div></div></div>
    <header><div className="container header-inner"><a href="#top" className="name">Yan Kavaleu</a><nav aria-label={lang==='ru'?'Основная навигация':'Main navigation'}>{['work','collaboration','about','contact'].map((id,i)=><a key={id} href={`#${id}`}>{t.nav[i]}</a>)}</nav></div></header>
    <main id="main">
      <section id="top" className="hero container">
        <p className="eyebrow">{t.hero.label}</p><h1>{t.hero.title}</h1><p className="lead">{t.hero.text}</p><p className="muted">{t.hero.location}</p>
        <div className="actions"><button className="button primary" onClick={()=>choose('project','collaboration')}>{t.hero.client} <span aria-hidden="true"></span></button><button className="button" onClick={()=>choose('role','team')}>{t.hero.employer} <span aria-hidden="true"></span></button></div>
        <p className="proof">{t.hero.proof}</p><Note>{t.hero.note}</Note>
      </section>
      <section id="work" className="section"><div className="container">
        <p className="eyebrow">{t.work.label}</p><h2>{t.work.title}</h2><p className="section-intro">{t.work.intro}</p><Note>{t.work.note}</Note>
        <div className="work-grid">{t.work.cases.map((item,i)=><article className="case" key={item.id}>
          <div className="placeholder" aria-label={item.preview}><span className="placeholder-index">0{i+1}</span><span>{item.preview}</span></div>
          <div className="case-content"><p className="eyebrow">{item.category}</p><h3>{item.name}</h3><p className="case-headline">{item.headline}</p><p className="role">{item.role}</p><p className="takeaway">{item.takeaway}</p>
          <details><summary>{t.work.details}<span aria-hidden="true">+</span></summary><div className="case-details"><h4>{t.work.context}</h4><p>{item.context}</p><h4>{t.work.contribution}</h4><ul>{item.contribution.map(x=><li key={x}>{x}</li>)}</ul><h4>{t.work.result}</h4><p>{item.outcome}</p></div></details></div>
        </article>)}</div>
        <a className="text-link" href={PORTFOLIO} target="_blank" rel="noreferrer">{t.work.more}</a>
      </div></section>
      <section id="collaboration" className="section"><div className="container">
        <p className="eyebrow">{t.clients.label}</p><h2>{t.clients.title}</h2><p className="section-intro">{t.clients.intro}</p><Note>{t.clients.note}</Note>
        <div className="offers">{t.clients.offers.map(([title,text],i)=><div className="offer" key={title}><span className="offer-number">0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
        <div className="process"><h3>{t.clients.processTitle}</h3><ol>{t.clients.steps.map(([title,text])=><li key={title}><h4>{title}</h4><p>{text}</p></li>)}</ol></div>
        <button className="button primary" onClick={()=>choose('project')}>{t.clients.cta} <span aria-hidden="true"></span></button>
      </div></section>
      <section id="about" className="section"><div className="container about-grid"><div><p className="eyebrow">{t.about.label}</p><h2>{t.about.title}</h2></div><div className="bio">{t.about.text.map(x=><p key={x}>{x}</p>)}<p className="tools">{t.about.tools}</p><Note>{t.about.note}</Note></div></div></section>
      <section id="team" className="section"><div className="container">
        <p className="eyebrow">{t.team.label}</p><h2>{t.team.title}</h2><p className="section-intro">{t.team.intro}</p><Note>{t.team.note}</Note>
        <div className="team-grid"><ul className="strengths">{t.team.strengths.map(x=><li key={x}>{x}</li>)}</ul><div className="experience">{t.team.experience.map(([name,role,year])=><div className="experience-row" key={name}><div><h3>{name}</h3><p>{role}</p></div><span>{year}</span></div>)}</div></div>
        <div className="practical"><p>{t.team.location}</p><p>{t.team.languages}</p></div>
        <div className="actions"><button className="button primary" onClick={()=>choose('role')}>{t.team.cta} <span aria-hidden="true"></span></button><a className="button" href="/assets/Yan-Kavaleu-CV.pdf" download>{t.team.cv} <span aria-hidden="true"></span></a><a className="text-link" href={LINKEDIN} target="_blank" rel="noreferrer">{t.team.linkedin}</a></div>
      </div></section>
      <section id="contact" className="section"><div className="container">
        <p className="eyebrow">{t.contact.label}</p><h2>{t.contact.title}</h2><p className="section-intro">{t.contact.intro}</p><Note>{t.contact.note}</Note>
        <div className="contact-grid"><div className="contact-form"><div className="intent-controls" role="group" aria-label={lang==='ru'?'Повод обращения':'Enquiry type'}><button aria-pressed={intent==='project'} onClick={()=>setIntent('project')}>{t.contact.project}</button><button aria-pressed={intent==='role'} onClick={()=>setIntent('role')}>{t.contact.role}</button></div>
        <label htmlFor="message">{intent==='project'?t.contact.projectLabel:t.contact.roleLabel}</label><textarea id="message" rows="5" maxLength={3000} value={drafts[intent]} placeholder={intent==='project'?t.contact.projectPlaceholder:t.contact.rolePlaceholder} onChange={e=>setDrafts({...drafts,[intent]:e.target.value})}/>
        <a className="button primary" href={mail}>{t.contact.send} <span aria-hidden="true"></span></a><p className="form-hint">{t.contact.hint}</p></div>
        <div className="direct-contact"><p className="muted">{t.contact.email}</p><a className="email-link" href={`mailto:${EMAIL}`}>{EMAIL}</a><button className="text-link copy" onClick={copyEmail}>{t.contact.copy}</button><p className="copy-status" role="status">{copyStatus}</p><a className="text-link" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a></div></div>
      </div></section>
      {notes && <section className="review-notes"><div className="container"><h2>{t.review.title}</h2><p>{t.review.text}</p><h3>{t.review.refs}</h3><p>{t.review.refText}</p><div className="reference-links"><a href="https://lusion.co/about/" target="_blank" rel="noreferrer">Lusion / About</a><a href="https://www.shopify.com/editions/winter2026" target="_blank" rel="noreferrer">Shopify Winter ’26</a><a href="https://willbeeching.com/" target="_blank" rel="noreferrer">Will Beeching</a></div></div></section>}
    </main>
    <footer className="container"><span>{t.footer}</span><a href="#top">{t.back}</a></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
