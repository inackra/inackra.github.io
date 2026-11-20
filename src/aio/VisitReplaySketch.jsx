import { useAioCopy } from "./i18n";
import React from 'react';
export function visitReplayState(phase) {
  const step = Math.max(0, Math.min(3, phase));
  return {
    selected: step >= 1,
    loading: step === 1,
    playing: step >= 2,
    expanded: step === 3
  };
}
export default function VisitReplaySketch({
  phase,
  compact,
  selectedRecord = 1,
  onSelectRecord
}) {
  const tr = useAioCopy();
  const state = visitReplayState(phase),
    w = compact ? 340 : 780,
    h = compact ? 460 : 340,
    left = compact ? 10 : 20,
    top = compact ? 20 : 25;
  const listWidth = state.expanded ? 0 : compact ? w : 245;
  const px = compact ? left + 15 : state.expanded ? left + 15 : left + listWidth + 20;
  const py = compact ? state.expanded ? top + 50 : top + 205 : top + 55;
  const pw = compact ? w - 30 : state.expanded ? w - 30 : w - listWidth - 35;
  const ph = compact ? state.expanded ? 340 : 185 : 230;
  const barY = compact ? top + 425 : top + 300,
    barStart = left + 70,
    barEnd = left + w - 20;
  return <g className="visit-replay-sketch" data-replay-phase={phase}>
  <rect className="visit-frame" x={left} y={top} width={w} height={h} rx="8" />
  <text className="visit-label" x={left + 15} y={top + 27}>{tr("Visits / Запись")}</text>
  <path className="visit-line" d={`M${left} ${top + 40}h${w}`} />
  {!state.expanded && <g className="visit-list">{Array.from({
        length: 3
      }, (_, i) => {
        const x = left + 15,
          y = top + 55 + i * (compact ? 42 : 38);
        return <g key={i} role={onSelectRecord ? 'button' : undefined} tabIndex={onSelectRecord ? 0 : undefined} aria-label={onSelectRecord ? "" + tr("Выбрать запись ") + (i + 1) + "" : undefined} aria-pressed={onSelectRecord ? selectedRecord === i : undefined} onClick={() => onSelectRecord?.(i)} onKeyDown={e => {
          if (onSelectRecord && ['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            onSelectRecord(i);
          }
        }} className={state.selected && i === selectedRecord ? 'visit-row selected' : 'visit-row'}>
    <rect x={x} y={y} width={compact ? w - 30 : 220} height="31" rx="3" />
    <path d={`M${x + 10} ${y + 10}l8 5-8 5z`} className="visit-play-icon" />
    <text x={x + 31} y={y + 21}>{"" + tr("Визит 0") + (i + 1) + ""}</text>
   </g>;
      })}</g>}
  <rect className="visit-viewport" x={px} y={py} width={pw} height={ph} rx="5" />
  {!state.selected && <text className="visit-empty" x={px + pw / 2} y={py + ph / 2} textAnchor="middle">{tr("Выберите запись")}</text>}
  {state.loading && <g transform={`translate(${px + pw / 2} ${py + ph / 2})`}><circle className="visit-loader" r="14" /><text className="visit-empty" y="42" textAnchor="middle">{tr("Загрузка")}</text></g>}
  {state.playing && <g>
   <path className="visit-page-line" d={`M${px + 20} ${py + 25}h${pw * .6}M${px + 20} ${py + 43}h${pw * .4}`} />
   <rect className="visit-page-block" x={px + 20} y={py + 65} width={pw * .38} height={ph - 90} rx="3" />
   <path className="visit-page-line" d={`M${px + pw * .49} ${py + 80}h${pw * .34}M${px + pw * .49} ${py + 98}h${pw * .27}`} />
   <rect className="visit-page-action" x={px + pw * .49} y={py + 120} width={pw * .28} height="25" rx="3" />
   <g transform={`translate(${px + pw * .54} ${py + 128})`}><g className="visit-cursor moving"><circle className="visit-pointer" r="3.5" /><circle className="visit-click" cx="0" cy="0" r="12" /></g></g>
  </g>}
  <path className="visit-control-icon" d={state.playing ? `M${left + 20} ${barY - 7}v14M${left + 28} ${barY - 7}v14` : `M${left + 20} ${barY - 7}l11 7-11 7z`} />
  <path className="visit-line" d={`M${barStart} ${barY}H${barEnd}`} />
  {state.playing && <path className="visit-progress moving" pathLength="1" d={`M${barStart} ${barY}H${barStart + (barEnd - barStart) * .65}`} />}
 </g>;
}
