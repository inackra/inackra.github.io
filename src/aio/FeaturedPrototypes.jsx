import { useAioCopy } from "./i18n";
import React, { useEffect, useRef, useState } from 'react';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import VisitReplaySketch from './VisitReplaySketch';
import { contentAllocation, contentEvidence, cohortColumns, normalizeCohortCell, moveCohortCell } from './prototypeModels';
function usePrototypeVisibility(motion) {
  const ref = useRef(null),
    [visible, setVisible] = useState(false),
    [awake, setAwake] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), {
      threshold: .15
    });
    observer.observe(ref.current);
    const update = () => setAwake(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return [ref, motion && visible && awake];
}
function PrototypeHeading() {
  const tr = useAioCopy();
  return <div className="aio-prototype-heading"><h3 id="aio-prototype-title">{tr("Как это работает")}</h3><span>{tr("Схема взаимодействия")}</span></div>;
}
function Inspect({
  onInspect,
  id
}) {
  const tr = useAioCopy();
  return <button className="text-action" onClick={() => onInspect?.(id)}><FlipText>{tr("Так в интерфейсе")}</FlipText><Arrow /></button>;
}
export function ContentPrototype({
  motion,
  mode,
  setMode,
  onInspect
}) {
  const tr = useAioCopy();
  const [ref, running] = usePrototypeVisibility(motion),
    [type, setType] = useState('text'),
    [variant, setVariant] = useState('a'),
    [weight, setWeight] = useState(50);
  const shares = contentAllocation(mode, weight);
  return <section className="aio-prototype featured-prototype" ref={ref} aria-labelledby="aio-prototype-title" data-prototype="content">
  <PrototypeHeading />
  <div className="archive-filters" role="group" aria-label={tr("Тип тестируемого контента")}>{[['text', tr("Текст")], ['image', tr("Изображение")]].map(([id, label]) => <button key={id} aria-pressed={type === id} onClick={() => setType(id)}><FlipText>{label}</FlipText></button>)}</div>
  <div className="content-prototype-stage">
   <div className="content-wire-page" aria-label={tr("Схематичное превью страницы")}>
    <div className="wire-browser" aria-hidden="true"><i /><i /><i /></div><div className="wire-page-copy">
     <span className="wire-label">{tr("Превью страницы")}</span>
     {type === 'text' ? <h4 key={variant}>{variant === 'a' ? tr("Одна идея. Несколько возможностей.") : tr("Несколько возможностей. Одна идея.")}</h4> : <div className={`wire-image wire-image-${variant}`} aria-label={"" + tr("Изображение ") + variant.toUpperCase() + ""}><i /><i /><span>{variant.toUpperCase()}</span></div>}
     <div className="wire-copy-lines" aria-hidden="true"><i /><i /></div><div className="wire-action-shape" aria-hidden="true" />
    </div>
   </div>
   <div className="content-prototype-variants"><p>{tr("Варианты элемента")}</p><div className="archive-filters" role="group" aria-label={tr("Предпросмотр варианта")}>{['a', 'b'].map(id => <button key={id} aria-pressed={variant === id} onClick={() => setVariant(id)}><FlipText>{"" + tr("Вариант ") + id.toUpperCase() + ""}</FlipText></button>)}</div>
    <div className={`content-distribution ${running ? 'is-running' : ''}`} data-mode={mode}>
     {['a', 'b'].map((id, i) => <div key={id} className={`distribution-branch ${mode === 'first' && i === 1 ? 'is-idle' : ''}`}><span>{"" + tr("Показы ") + id.toUpperCase() + ""}</span><div className="distribution-track" aria-hidden="true"><i style={{
                width: shares ? `${shares[i]}%` : '100%'
              }} /><b /></div><span>{shares ? `${shares[i]}%` : tr("Авто")}</span></div>)}
    </div>
   </div>
  </div>
  <div className="archive-filters" role="group" aria-label={tr("Режим распределения показов")}>{[['first', 'First'], ['ai', 'AI'], ['weights', 'Weights']].map(([id, label]) => <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}><FlipText>{label}</FlipText></button>)}</div>
  {mode === 'weights' && <label className="prototype-weight">{tr("Доля показов варианта A")}<span>{weight}%</span><input type="range" aria-label={tr("Доля показов варианта A")} min="10" max="90" step="10" value={weight} onChange={e => setWeight(Number(e.target.value))} /></label>}
  <p className="prototype-explanation" aria-live="polite">{mode === 'first' ? tr("Показывается первый вариант. Второй можно подготовить и рассмотреть в превью.") : mode === 'ai' ? tr("Распределение связано с выбранной конверсией. Параметры автоматического режима находятся рядом с вариантами.") : tr("Ручное соотношение меняет распределение показов между двумя вариантами.")}</p>
  <div className="aio-prototype-controls"><p className="aio-schematic-note">{tr("Схема настройки, без запуска реального эксперимента.")}</p><Inspect onInspect={onInspect} id={`section-${contentEvidence(type, mode)}`} /></div>
 </section>;
}
export function CohortPrototype({
  onInspect
}) {
  const tr = useAioCopy();
  const [period, setPeriod] = useState('short'),
    [selected, setSelected] = useState({
      row: 1,
      column: 1
    }),
    [expanded, setExpanded] = useState(false),
    matrix = useRef(null),
    columns = cohortColumns(period);
  const choosePeriod = next => {
    setPeriod(next);
    setSelected(cell => normalizeCohortCell(cell, next));
  };
  const keyboard = e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const compact = matchMedia('(max-width: 700px)').matches;
    const key = compact ? {
      ArrowLeft: 'ArrowUp',
      ArrowRight: 'ArrowDown',
      ArrowUp: 'ArrowLeft',
      ArrowDown: 'ArrowRight'
    }[e.key] || e.key : e.key;
    const next = moveCohortCell(selected, key, period);
    setSelected(next);
    matrix.current.querySelector(`[data-cohort-cell="${next.row}-${next.column}"]`).focus();
  };
  return <section className="aio-prototype featured-prototype" aria-labelledby="aio-prototype-title" data-prototype="cohort">
  <PrototypeHeading />
  <div className="prototype-toolbar"><div className="archive-filters" role="group" aria-label={tr("Период когортного анализа")}>{[['short', tr("Короткий период")], ['long', tr("Длинный период")]].map(([id, label]) => <button key={id} aria-pressed={period === id} onClick={() => choosePeriod(id)}><FlipText>{label}</FlipText></button>)}</div><button className="text-action" aria-pressed={expanded} onClick={() => setExpanded(value => !value)}><FlipText>{expanded ? tr("Свернуть таблицу") : tr("Развернуть таблицу")}</FlipText></button></div>
  <div className={`cohort-prototype-stage ${expanded ? 'is-expanded' : ''}`}>
   <div className="cohort-matrix" ref={matrix} role="group" aria-label={tr("Схематичная когортная таблица")} style={{
        '--cohort-columns': columns
      }} onKeyDown={keyboard}>
    {Array.from({
          length: columns
        }, (_, column) => <span className="cohort-period" key={`p-${column}`} style={{
          '--column': column
        }}>{"" + tr("П") + (column + 1) + ""}</span>)}
    {[tr("А"), tr("Б"), tr("В")].map((name, row) => <span key={name} className="cohort-name" style={{
          '--row': row
        }}>{"" + tr("Когорта ") + name + ""}</span>)}
    {Array.from({
          length: 3 * columns
        }, (_, i) => {
          const row = Math.floor(i / columns),
            column = i % columns,
            active = row === selected.row && column === selected.column;
          return <button key={`${row}-${column}`} className="cohort-cell" data-cohort-cell={`${row}-${column}`} tabIndex={active ? 0 : -1} style={{
            '--row': row,
            '--column': column,
            '--shade': .12 + (row + column) % 4 * .12
          }} aria-pressed={active} aria-label={"" + tr("Когорта ") + [tr("А"), tr("Б"), tr("В")][row] + tr(", период ") + (column + 1) + ""} onClick={() => setSelected({
            row,
            column
          })}><span aria-hidden="true" /></button>;
        })}
   </div>
   <div className="cohort-inspector" aria-live="polite"><span className="wire-label">{tr("Выбранная ячейка")}</span><h4>{"" + tr("Когорта ") + [tr("А"), tr("Б"), tr("В")][selected.row] + tr(" · период ") + (selected.column + 1) + ""}</h4><div className="cohort-detail-bars" aria-hidden="true">{[0, 1, 2].map(i => <i key={i} style={{
            width: `${35 + (selected.row + selected.column + i) % 4 * 15}%`
          }} />)}</div><p>{tr("Подробности сохраняют связь с выбранной группой и периодом.")}</p></div>
  </div>
  <div className="aio-prototype-controls"><p className="aio-schematic-note">{tr("Выбери ячейку, чтобы сменить фокус анализа.")}</p><Inspect onInspect={onInspect} id={`section-${expanded ? 44 : period === 'short' ? 42 : 43}`} /></div>
 </section>;
}
export function VisitPrototype({
  motion,
  onInspect
}) {
  const tr = useAioCopy();
  const [ref, running] = usePrototypeVisibility(motion),
    [paused, setPaused] = useState(false),
    [expanded, setExpanded] = useState(false),
    [record, setRecord] = useState(1),
    [speed, setSpeed] = useState(1),
    [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = matchMedia('(max-width: 700px)'),
      update = () => setCompact(query.matches);
    update();query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return <section className="aio-prototype featured-prototype" ref={ref} aria-labelledby="aio-prototype-title" data-prototype="visit">
  <PrototypeHeading />
  <div data-visit-loop="true" className={`aio-diagram ${running && !paused ? 'is-playing' : ''}`} style={{
      '--visit-cycle': `${1.6 / speed}s`
    }}><svg viewBox={compact ? '0 0 360 510' : '0 0 820 400'} role="group" aria-labelledby="aio-diagram-title aio-diagram-description"><title id="aio-diagram-title">{tr("Запись визита: выбор и просмотр")}</title><desc id="aio-diagram-description">{tr("Упрощённая схема, не экран работающего продукта. Выбор записи, пауза, скорость и расширенный просмотр.")}</desc><VisitReplaySketch phase={expanded ? 3 : 2} compact={compact} selectedRecord={record} onSelectRecord={setRecord} /></svg></div>
  <div className="prototype-toolbar"><button className="text-action" aria-pressed={paused} onClick={() => setPaused(value => !value)}><FlipText>{paused ? tr("Продолжить") : tr("Пауза")}</FlipText></button><div className="archive-filters" role="group" aria-label={tr("Скорость схематичной записи")}>{[1, 2, 4].map(value => <button key={value} aria-pressed={speed === value} onClick={() => setSpeed(value)}><FlipText>{`${value}×`}</FlipText></button>)}</div><button className="text-action" aria-pressed={expanded} onClick={() => setExpanded(value => !value)}><FlipText>{expanded ? tr("Показать список") : tr("Развернуть плеер")}</FlipText></button></div>
  <div className="aio-prototype-controls"><p className="aio-schematic-note">{"" + tr("Запись ") + (record + 1) + tr(" · схематичный повтор действий.")}</p><Inspect onInspect={onInspect} id={`visit-${expanded ? 1 : 2}`} /></div>
 </section>;
}
