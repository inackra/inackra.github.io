import { useAioCopy } from "./i18n";
import React, { useEffect, useRef, useState } from 'react';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import { ContentPrototype, CohortPrototype, VisitPrototype } from './FeaturedPrototypes';
import VisitReplaySketch from './VisitReplaySketch';
import { trafficModes } from './model';

// Diagrams explain the interaction model; they do not redraw the actual product.
const labels = {
  traffic: [['Контент', 'page'], ['Показы', 'table'], ['Вариант A', 'page'], ['Вариант B', 'page']],
  registration: [['Приглашение', 'form'], ['Профиль', 'form'], ['Пространство', 'table'], ['Подписка', 'form']],
  dashboard: [['Кампании', 'table'], ['Финансы', 'table'], ['Сводка', 'metrics'], ['Детали', 'chart']],
  access: [['Объект', 'table'], ['Участники', 'list'], ['Команды', 'list'], ['Права', 'permissions']],
  editor: [['Страница', 'page'], ['Элемент', 'text'], ['Вариант A', 'text'], ['Вариант B', 'text']],
  campaigns: [['Кампания', 'table'], ['Параметры', 'form'], ['Условия', 'rules'], ['Маркировка', 'tagged']],
  tables: [['Таблица', 'table'], ['Фильтры', 'form'], ['Колонки', 'columns'], ['Представление', 'table']],
  routing: [['Трафик', 'list'], ['Лендинг A', 'page'], ['Лендинг B', 'page'], ['Destination', 'list']],
  landings: [['Библиотека', 'table'], ['ZIP-файл', 'upload'], ['Проверка', 'list'], ['Лендинг', 'page']],
  analytics: [['Период', 'table'], ['Ячейка', 'cohort'], ['Подробности', 'chart'], ['Обзор', 'cohort']],
  visits: [['Визиты', 'table'], ['Выбор', 'list'], ['Запись', 'page'], ['Плеер', 'page']],
  ads: [['Аккаунт', 'list'], ['Кампания', 'table'], ['Группа', 'list'], ['Объявление', 'page']]
};
export function schematicLayout(id, compact = false) {
  let positions, edges;
  if (id === 'routing') {
    positions = compact ? [[105, 20], [20, 190], [190, 190], [105, 360]] : [[20, 140], [315, 35], [315, 240], [610, 140]];
    edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
  } else if (id === 'traffic' || id === 'editor') {
    positions = compact ? [[105, 20], [105, 180], [20, 350], [190, 350]] : [[20, 140], [300, 140], [610, 35], [610, 240]];
    edges = [[0, 1], [1, 2], [1, 3]];
  } else if (id === 'dashboard') {
    positions = compact ? [[20, 20], [190, 20], [105, 190], [105, 360]] : [[20, 35], [20, 240], [315, 140], [610, 140]];
    edges = [[0, 2], [1, 2], [2, 3]];
  } else if (id === 'access') {
    positions = compact ? [[105, 20], [20, 190], [190, 190], [105, 360]] : [[20, 140], [315, 35], [315, 240], [610, 140]];
    edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
  } else {
    positions = compact ? [[20, 40], [190, 40], [190, 290], [20, 290]] : [[20, 140], [220, 140], [420, 140], [620, 140]];
    edges = [[0, 1], [1, 2], [2, 3]];
  }
  const nodes = labels[id].map(([label, kind], index) => ({
    id: index,
    label,
    kind,
    x: positions[index][0],
    y: positions[index][1],
    width: compact ? 150 : 180,
    height: 120
  }));
  return {
    nodes,
    edges,
    width: compact ? 360 : 820,
    height: compact ? 510 : 400
  };
}
function edgePath(a, b, compact) {
  if (compact && a.y !== b.y) {
    const x = a.x + a.width / 2,
      y = a.y + a.height,
      tx = b.x + b.width / 2,
      ty = b.y;
    return `M${x} ${y} C${x} ${y + 45},${tx} ${ty - 45},${tx} ${ty}`;
  }
  if (compact && b.x < a.x) {
    return `M${a.x} ${a.y + 60} H${b.x + b.width}`;
  }
  const x = a.x + a.width,
    y = a.y + 60,
    tx = b.x,
    ty = b.y + 60;
  return `M${x} ${y} C${x + (tx - x) / 2} ${y},${x + (tx - x) / 2} ${ty},${tx} ${ty}`;
}
function Skeleton({
  kind,
  phase
}) {
  if (kind === 'cohort') return <>{Array.from({
      length: 15
    }, (_, i) => <rect key={i} x={18 + i % 5 * 20} y={53 + Math.floor(i / 5) * 17} width="16" height="12" className={phase >= 1 && i === 7 ? 'diagram-cohort-selected' : ''} />)}</>;
  if (kind === 'upload') return <><rect x="18" y="52" width="102" height="46" rx="3" /><path d="M69 84V61m-9 9 9-9 9 9M42 106h54" /></>;
  if (kind === 'columns') return <>{[0, 1, 2].map(i => <rect key={i} className="diagram-column" x="0" y="53" width="27" height="47" style={{
      transform: `translateX(${18 + (phase >= 2 ? [2, 0, 1][i] : i) * 35}px)`
    }} />)}</>;
  if (kind === 'rules') return <><path d="M18 57h102M18 77h102M18 97h102" /><circle cx="27" cy="57" r="4" /><circle cx="27" cy="77" r="4" /><circle cx="27" cy="97" r="4" /></>;
  if (kind === 'tagged') return <><path d="M18 58h102M18 81h102M18 104h102" /><rect x="75" y="49" width="28" height="13" rx="3" /><rect x="48" y="72" width="27" height="13" rx="3" /></>;
  if (kind === 'metrics') return <><rect x="18" y="53" width="42" height="26" /><rect x="68" y="53" width="42" height="26" /><path d="M18 98h100" /></>;
  if (kind === 'chart') return <><path d="M18 101h105M18 101V53" /><path className="diagram-chart" d="m22 92 24-16 20 7 23-27 28 8" /></>;
  if (kind === 'permissions') return <><path d="M18 61h65M18 88h65" /><rect x="102" y="54" width="18" height="13" rx="6" /><rect x="102" y="81" width="18" height="13" rx="6" /></>;
  if (kind === 'page') return <><rect x="18" y="52" width="49" height="45" /><path d="M80 57h40M80 69h32M80 89h40" /></>;
  if (kind === 'form') return <><rect x="18" y="52" width="102" height="13" rx="2" /><rect x="18" y="74" width="102" height="13" rx="2" /><path d="M18 102h43" /></>;
  if (kind === 'table') return <><path d="M18 58h102M18 75h102M18 92h102M52 50v49M88 50v49" /></>;
  if (kind === 'list') return <><circle cx="25" cy="60" r="6" /><circle cx="25" cy="85" r="6" /><path d="M43 60h77M43 85h57" /></>;
  return <><path d="M18 56h103M18 72h82M18 88h93" /></>;
}
export function schematicNodeActive(taskId, mode, phase, index) {
  return index <= phase && !(mode === 'first' && (taskId === 'traffic' && index === 3 || taskId === 'routing' && index === 2));
}
export function schematicStepDelay(id, phase) {
  return id === 'visits' || phase >= 3 ? null : 1700;
}
function GenericSchematic({
  task,
  motion,
  mode,
  setMode
}) {
  const tr = useAioCopy();
  const root = useRef(null),
    [compact, setCompact] = useState(() => matchMedia('(max-width: 700px)').matches),
    [phase, setPhase] = useState(task.id === 'visits' ? 2 : 0),
    [visible, setVisible] = useState(false),
    [awake, setAwake] = useState(true),
    [halted, setHalted] = useState(false);
  useEffect(() => {
    const query = matchMedia('(max-width: 700px)');
    const resize = () => setCompact(query.matches);
    resize();
    query.addEventListener('change', resize);
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), {
      threshold: .2
    });
    observer.observe(root.current);
    const visibility = () => setAwake(!document.hidden);
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      query.removeEventListener('change', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    const delay = schematicStepDelay(task.id, phase);
    if (!motion || !visible || !awake || halted || delay === null) return;
    const timer = setTimeout(() => setPhase(previous => Math.min(3, previous + 1)), delay);
    return () => clearTimeout(timer);
  }, [motion, visible, awake, phase, halted, task.id]);
  const layout = schematicLayout(task.id, compact),
    currentMode = trafficModes.find(item => item.id === mode);
  const firstOnly = mode === 'first' && (task.id === 'traffic' && phase >= 2 || task.id === 'routing' && phase === 2);
  const caption = firstOnly ? tr("Показать только первый вариант") : task.steps[phase];
  const active = index => schematicNodeActive(task.id, mode, phase, index);
  return <section className="aio-prototype" ref={root} aria-labelledby="aio-prototype-title">
  <div className="aio-prototype-heading"><h3 id="aio-prototype-title">{tr("Как это работает")}</h3><span>{tr("Схема взаимодействия")}</span></div>
  <div data-visit-loop={task.id === 'visits' ? 'true' : undefined} className={`aio-diagram ${motion && visible && awake && !halted && (task.id === 'visits' || phase < 3) ? 'is-playing' : ''}`}>
   <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-labelledby="aio-diagram-title aio-diagram-description">
    <title id="aio-diagram-title">{"" + "" + task.label + tr(": схематичный сценарий")}</title><desc id="aio-diagram-description">{task.steps.join('. ')}{tr(". Это упрощённая схема, не экран работающего продукта.")}</desc>
    {task.id === 'visits' ? <VisitReplaySketch phase={phase} compact={compact} /> : <>{layout.edges.map(([from, to]) => <path key={`${from}-${to}`} d={edgePath(layout.nodes[from], layout.nodes[to], compact)} className={`diagram-edge ${active(from) && active(to) ? 'is-active' : ''}`} />)}
    {layout.nodes.map(node => <g key={node.id} transform={`translate(${node.x} ${node.y})`} className={`diagram-node ${active(node.id) ? 'is-active' : ''}`}>
     <rect className="diagram-surface" width={node.width} height={node.height} rx="8" />
     <text x="18" y="29">{tr(node.label)}</text><path className="diagram-divider" d={`M0 42h${node.width}`} />
     <g className="diagram-skeleton"><Skeleton kind={node.kind} phase={phase} /></g>
    </g>)}</>}
   </svg>
  </div>
  <div className="aio-prototype-controls"><p>{caption}</p>{task.id === 'visits' && <button className="text-action" aria-pressed={halted} onClick={() => setHalted(value => !value)}><FlipText>{halted ? tr("Продолжить") : tr("Пауза")}</FlipText></button>}<button className="text-action" onClick={() => {
        if (task.id === 'visits') setPhase(value => value === 3 ? 2 : 3);else {
          setPhase(previous => (previous + 1) % 4);
          if (phase === 3) setHalted(false);
        }
      }}><FlipText>{task.id === 'visits' ? phase === 3 ? tr("Показать список") : tr("Развернуть плеер") : phase === 3 ? tr("Повторить схему") : tr("Следующий шаг")}</FlipText><Arrow /></button></div>
  {['traffic', 'routing'].includes(task.id) && <div className="aio-mode-choice"><div className="archive-filters" role="group" aria-label={tr("Режим распределения показов")}>{trafficModes.map(item => <button key={item.id} aria-pressed={mode === item.id} onClick={() => {
          setMode(item.id);
          setPhase(0);
        }}><FlipText>{item.label}</FlipText></button>)}</div><p aria-live="polite">{tr(currentMode.text)}</p></div>}
  <p className="aio-schematic-note">{task.id === 'visits' ? tr("Схема воспроизведения без записи реальных пользователей.") : tr("Упрощённая схема взаимодействия.")}</p>
 </section>;
}
export default function AioSchematic(props) {
  if (props.task.id === 'traffic') return <ContentPrototype {...props} />;
  if (props.task.id === 'analytics') return <CohortPrototype {...props} />;
  if (props.task.id === 'visits') return <VisitPrototype {...props} />;
  return <GenericSchematic {...props} />;
}
