import React, { useEffect, useRef, useState } from 'react';
const Reveal = ({
  children,
  className = ''
}) => <div className={className}>{children}</div>;
import { ImageLightbox } from './ImageLightbox';
import { LanguageContext, useAioCopy } from './i18n';
import './aio-story.css';
import {projectCovers} from '../projectMedia';
import {scrollTo} from '../scroll';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import AioSchematic from './AioSchematic';
import { getTasks, resolveTask, adjacentTask, imagePath } from './model';
function TaskNavigation({
  active,
  onSelect,
  bottom = false,
  tasks
}) {
  const tr = useAioCopy();
  const controls = useRef(null),
    isFeatured = tasks.find(task => task.id === active).featured;
  const keyboard = e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) || e.target.tagName !== 'BUTTON') return;
    e.preventDefault();
    const id = adjacentTask(e.target.dataset.task, e.key);
    onSelect(id, false);
    const next = controls.current.querySelector(`[data-task="${id}"]`);
    const details = next.closest('details');
    if (details) details.open = true;
    next.focus();
  };
  const buttons = items => items.map(task => <button key={task.id} data-task={task.id} aria-pressed={active === task.id} aria-controls="aio-task-panel" onClick={() => onSelect(task.id, bottom)}><FlipText>{task.label}</FlipText></button>);
  return <nav className={`aio-task-navigation ${bottom ? 'aio-task-navigation-bottom' : ''}`} aria-label={bottom ? tr("Другие задачи AIO — внизу кейса") : tr("Задачи AIO")} ref={controls} onKeyDown={keyboard}>
  <p>{bottom ? tr("Как задача связана с проектом") : tr("Главные задачи")}</p>
  <div className="archive-filters" role="group" aria-label={tr("Главные задачи AIO")}>{buttons(tasks.filter(task => task.featured))}</div>
  <details className="aio-support-navigation" open={bottom || !isFeatured}><summary className="text-action"><FlipText>{tr("Другие сценарии")}</FlipText><span className="aio-flow-count">{tasks.filter(task => !task.featured).length}</span><Arrow down /></summary><div className="archive-filters" role="group" aria-label={tr("Дополняющие задачи AIO")}>{buttons(tasks.filter(task => !task.featured))}</div></details>
 </nav>;
}
export function evidenceId(item) {
  return item.sectionAssetId ? `section-${item.sectionAssetId}` : item.visitAssetId ? `visit-${item.visitAssetId}` : item.assetId ? `asset-${item.assetId}` : `legacy-${item.index}`;
}
export function evidenceSource(item) {
  return item.frame.src || imagePath(item.frame.index);
}
function EvidenceScreen({
  item,
  onOpen
}) {
  const tr = useAioCopy();
  const frame = item.frame,
    src = evidenceSource(item),
    dimensions = frame.src ? [frame.width, frame.height] : frame.index === 6 ? [1920, 1080] : [1365, 768];
  return <section id={evidenceId(item)} className={`aio-evidence-row case-chapter ${item.wide ? 'aio-evidence-wide' : ''}`}>
  <div><h3>{item.title}</h3><p>{item.text}</p></div>
  <figure className="case-image">
   <button type="button" className="case-image-preview" aria-label={"" + tr("Открыть оригинал: ") + item.title + ""} onClick={e => {
        e.preventDefault();
        onOpen({
          src,
          alt: `AIO Tech — ${item.title}`
        });
      }}>
    {frame.src ? <img src={src} width={dimensions[0]} height={dimensions[1]} alt={`AIO Tech — ${item.title}`} loading="lazy" decoding="async" draggable={false} /> : <svg viewBox={frame.box.join(' ')} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`AIO Tech — ${item.title}`}><title>{item.title}</title><image href={src} width={dimensions[0]} height={dimensions[1]} /></svg>}
    <span className="image-zoom" aria-hidden="true"><Arrow /></span>
   </button>
   <figcaption>{tr("Оригинальный экран · Нажми, чтобы увеличить")}</figcaption>
  </figure>
 </section>;
}
function Evidence({
  task,
  onOpen
}) {
  const tr = useAioCopy();
  if (!task.evidenceGroups) return task.evidence.map(item => <EvidenceScreen key={evidenceSource(item)} item={item} onOpen={onOpen} />);
  return task.evidenceGroups.map((group, index) => <details className="aio-evidence-flow case-chapter" key={group.id} open={index === 0}>
  <summary className="text-action"><span><h3>{group.title}</h3><span className="aio-flow-count">{group.items.length}{' '}{tr("экранов")}</span></span><Arrow down /></summary>
  <p className="aio-flow-intro">{group.intro}</p>
  {group.items.map(item => <EvidenceScreen key={evidenceSource(item)} item={item} onOpen={onOpen} />)}
 </details>);
}
function Story({
  initialTask,
  lang,
  paused
}) {
  const tr = useAioCopy();
  const tasks = getTasks(lang),
    motion = !paused;
  const [active, setActive] = useState(() => resolveTask(initialTask ?? (typeof location === 'undefined' ? '' : location.hash)));
  const [mode, setMode] = useState('weights'),
    [lightbox, setLightbox] = useState(null);
  const panel = useRef(null),
    task = tasks.find(item => item.id === active);
  useEffect(() => {
    const restore = e => {
      if (/^#(?:task=|aio-)/.test(location.hash) || e.type === 'popstate' && !location.hash) setActive(resolveTask(location.hash));
    };
    addEventListener('hashchange', restore);
    addEventListener('popstate', restore);
    return () => {
      removeEventListener('hashchange', restore);
      removeEventListener('popstate', restore);
    };
  }, []);
  useEffect(() => {
    document.title = `${task.label} — AIO Tech / INACKRA`;
  }, [task.label]);
  const inspect = id => {
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target.parentElement;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
    scrollTo(target,{offset:-100,immediate:!motion});
    target.tabIndex = -1;
    target.focus({
      preventScroll: true
    });
  };
  const select = (id, scroll = false) => {
    const next = resolveTask(id);
    setActive(next);
    const hash = `#task=${next}`;
    if (location.hash !== hash) history.pushState({
      aioTask: next
    }, '', hash);
    if (scroll) requestAnimationFrame(() => {
      scrollTo(panel.current,{offset:-100,immediate:!motion});
      panel.current.focus({
        preventScroll: true
      });
    });
  };
  return <div className={`aio-study ${motion ? '' : 'motion-paused'}`}>
   <section className="aio-project-intro archive-page" id="aio-intro"><p className="eyebrow">{tr("B2B SaaS / MarTech · Продуктовый UX")}</p><h1>AIO Tech.</h1><p className="archive-intro">{tr("Продуктовый UX маркетинговой платформы: от первого входа до работы с контентом, экспериментами и рекламой.")}</p><p className="aio-project-context">{tr("Я спроектировал UX продукта от ранней стадии до MVP и последующих релизов. Три главные истории — эксперименты с контентом, просмотр визитов и когортная аналитика. Остальные сценарии показывают, как они связаны внутри продукта.")}</p></section>
   <figure className="project-cover"><img src={projectCovers.aio.path} width="1080" height="1080" alt="AIO Tech" decoding="async"/></figure>
   <div id="experience"><TaskNavigation tasks={tasks} active={active} onSelect={select} /></div>
   <article ref={panel} tabIndex={-1} id="aio-task-panel" className="aio-task-panel privacy-page" aria-labelledby="aio-task-title">
    <div className={motion ? 'aio-task-body' : 'aio-task-body no-motion'} key={task.id}>
     <Reveal className="aio-task-heading"><p className="eyebrow">{task.label}</p><h2 id="aio-task-title">{task.title}</h2><p className="privacy-intro">{task.summary}</p></Reveal>
     <div className="aio-task-brief"><section><h3>{tr("Задача")}</h3><p>{task.problem}</p></section><section><h3>{tr("Решение")}</h3><p>{task.decision}</p></section></div>
     {task.schematic !== false && <AioSchematic key={task.id} task={task} motion={motion} mode={mode} setMode={setMode} onInspect={inspect} />}
     <div className="dialog-content aio-narrative">{task.story.map(([title, text]) => <section className="case-chapter" key={title}><h3>{title}</h3><p>{text}</p></section>)}<section className="case-chapter aio-reasoning" aria-label={tr("Логика решения")}><h3>{tr("Логика решения")}</h3>{task.reasoning.map(([title, text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}</section></div>
     <section className="aio-evidence" aria-labelledby="aio-evidence-title"><h2 id="aio-evidence-title">{tr("В интерфейсе.")}</h2><p className="aio-evidence-intro">{tr("Экраны и состояния, которые связывают задачу с конкретными действиями в продукте.")}</p><div className="dialog-content"><Evidence task={task} onOpen={setLightbox} /></div></section>
    </div>

   </article>
   <TaskNavigation tasks={tasks} active={active} onSelect={select} bottom />
  {lightbox && <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />}
 </div>;
}
export default function AioStory(props) {
  return <LanguageContext.Provider value={props.lang}><Story {...props} /></LanguageContext.Provider>;
}
