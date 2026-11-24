import React,{useEffect,useId,useLayoutEffect,useRef,useState} from 'react';
import './variants.css';

// ── Theme ────────────────────────────────────────────────────────────────
// One palette per mood. The niche only brings its accent colour.
export function theme(mood,accent){
 if(mood==='bright')return {'--m-bg':accent,'--m-surface':'#ffffff','--m-ink':'#0b0b0b','--m-muted':'rgba(11,11,11,.58)','--m-line':'rgba(11,11,11,.13)','--m-accent':'#0b0b0b','--m-on-accent':accent,'--m-soft':'rgba(11,11,11,.06)','--m-hl':accent};
 if(mood==='twist')return {'--m-bg':'#12110f','--m-surface':'#1c1a17','--m-ink':'#f2ebe0','--m-muted':'#8d857a','--m-line':'#2d2a26','--m-accent':accent,'--m-on-accent':'#12110f','--m-soft':`${accent}24`,'--m-hl':accent};
 return {'--m-bg':'#f4f3ef','--m-surface':'#ffffff','--m-ink':'#121212','--m-muted':'#7a776f','--m-line':'#e4e1da','--m-accent':accent,'--m-on-accent':'#ffffff','--m-soft':`${accent}17`,'--m-hl':accent};
}

// ── Small parts ──────────────────────────────────────────────────────────
const paths={
 spark:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
 docs:'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
 search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
 user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
 home:'M4 11l8-7 8 7v9H4zM10 20v-5h4v5',
 card:'M3 6h18v12H3zM3 10h18M7 15h4',
 swap:'M7 7h12l-3-3M17 17H5l3 3',
 chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
 map:'M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
 heart:'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
 bag:'M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0',
 bell:'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4',
};
export function Icon({name,size=18}){return <svg className="m-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.spark}/></svg>}

function format(value,decimals=0){return value.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}
// Counts up once on mount (the mock-up is remounted for every build).
function Count({value,prefix='',decimals=0,delay=500}){
 const [shown,setShown]=useState(value);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let raf=0,start=0;const duration=1300;setShown(0);
  const tick=time=>{if(!start)start=time+delay;const t=Math.max(0,Math.min(1,(time-start)/duration)),e=1-Math.pow(1-t,4);setShown(value*e);if(t<1)raf=requestAnimationFrame(tick)};
  raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
 },[value,delay]);
 return <>{prefix}{format(decimals?shown:Math.round(shown),decimals)}</>;
}

function Chart({series,width=300,height=110,labels=false}){
 const id=useId().replace(/\W/g,'');
 const max=Math.max(...series)*1.08,min=Math.min(...series)*.82,step=width/(series.length-1);
 const pts=series.map((v,i)=>[i*step,height-(v-min)/(max-min)*height]);
 const line=pts.map(([x,y],i)=>{if(!i)return `M${x},${y}`;const [px,py]=pts[i-1],cx=(px+x)/2;return `C${cx},${py} ${cx},${y} ${x},${y}`}).join(' ');
 const last=pts[pts.length-1];
 return <div className="m-chart-wrap"><svg className="m-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--m-hl)" stopOpacity=".38"/><stop offset="1" stopColor="var(--m-hl)" stopOpacity="0"/></linearGradient></defs>
  {labels&&[.25,.5,.75].map(f=><line key={f} x1="0" x2={width} y1={height*f} y2={height*f} className="m-grid"/>)}
  <path className="m-area" d={`${line} L${width},${height} L0,${height}Z`} fill={`url(#g${id})`}/>
  <path className="m-line" d={line} pathLength="1"/>
 </svg><span className="m-dot" style={{left:`${last[0]/width*100}%`,top:`${last[1]/height*100}%`}}/></div>;
}

function Toast({niche,className=''}){return <div className={`m-toast ${className}`}><span className="m-toast-icon"><Icon name="bell" size={14}/></span><span><b>{niche.toast[0]}</b><small>{niche.toast[1]}</small></span></div>}
function Logo({niche}){return <span className="m-logo"><span className="m-logo-mark"/>{niche.name}</span>}
const rise=i=>({'--i':i});

// ── Website ──────────────────────────────────────────────────────────────
function SiteMock({niche,mood}){
 return <div className="m-window m-site">
  <div className="m-chrome"><i/><i/><i/><span className="m-url">{niche.domain}</span></div>
  <div className="m-page">
   <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-nav-links">{niche.nav.map(n=><span key={n}>{n}</span>)}</span><span className="m-btn m-btn-sm">{niche.cta}</span></nav>
   <div className="m-site-hero">
    <div className="m-site-copy">
     <span className="m-pill m-in" style={rise(1)}><b>New</b>{niche.features[0]}</span>
     <h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]}<br/><em>{niche.headline[1]}</em></h4>
     <p className="m-in" style={rise(3)}>{niche.sub}</p>
     <div className="m-actions m-in" style={rise(4)}><span className="m-btn">{niche.cta}<span className="m-arrow">→</span></span><span className="m-btn m-btn-ghost">See how it works</span></div>
    </div>
    <div className="m-site-visual">
     <div className="m-card m-metric-card m-in" style={rise(3)}>
      <div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div>
      <strong className="m-big"><Count {...niche.metric}/></strong>
      <Chart series={niche.series} width={320} height={120}/>
      <div className="m-rows">{niche.list.map((r,i)=><Row key={r[0]} row={r}/>)}</div>
     </div>
     <Toast niche={niche} className="m-toast-site"/>
    </div>
   </div>
   <div className="m-features">{niche.features.map((f,i)=><div className="m-feature m-in" key={f} style={rise(6+i)}><span className="m-row-icon m-badge">0{i+1}</span><span><b>{f}</b><small>{niche.notes[i]}</small></span></div>)}</div>
  </div>
 </div>;
}

// ── Mobile app (always one phone) ────────────────────────────────────────
function Phone({niche}){
 return <div className="m-phone">
  <div className="m-phone-screen">
   <div className="m-status"><b>9:41</b><span className="m-island"/><span className="m-status-icons"><i/><i/><i/></span></div>
   <Toast niche={niche} className="m-toast-app"/>
   <div className="m-app-head m-in" style={rise(0)}><div><small>{niche.hello}</small><b className="m-display">{niche.name}</b></div><span className="m-avatar"/></div>
   <div className="m-hero-card m-in" style={rise(1)}>
    <div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div>
    <strong className="m-big"><Count {...niche.metric}/></strong>
    <Chart series={niche.series} width={280} height={84}/>
   </div>
   <div className="m-segment m-in" style={rise(2)}><span className="on">Week</span><span>Month</span><span>Year</span></div>
   <div className="m-rows">{niche.list.map((r,i)=><Row key={r[0]} row={r}/>)}</div>
   <div className="m-tabbar">{niche.icons.map((icon,i)=><span key={icon} className={i?'':'on'}><Icon name={icon} size={20}/></span>)}</div>
  </div>
 </div>;
}
// Website on a phone: the same page, responsive.
function MobileSite({niche,mood,variant=0}){
 return <div className="m-app-stage compact"><div className="m-phone"><div className="m-phone-screen m-msite">
  <div className="m-status"><b>9:41</b><span className="m-island"/><span className="m-status-icons"><i/><i/><i/></span></div>
  <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-burger"><i/><i/></span></nav>
  <span className="m-pill m-in" style={rise(1)}><b>New</b>{niche.features[0]}</span>
  <h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]}<br/><em>{niche.headline[1]}</em></h4>
  <p className="m-in" style={rise(3)}>{niche.sub}</p>
  <span className="m-btn m-in" style={rise(4)}>{niche.cta}<span className="m-arrow">→</span></span>
  {variant===2?<div className="m-msite-more"><Kpis niche={niche} className="m-kpi-sm"/><Quote niche={niche} className="m-in m-grow" style={rise(7)}/></div>:variant?<Notes niche={niche} className="m-msite-notes" start={5}/>:<div className="m-msite-more"><MetricCard niche={niche} className="m-in m-grow" style={rise(5)} w={260} h={70}/><Kpis niche={niche} className="m-kpi-sm"/></div>}
 </div></div></div>;
}
const PHONES=[Phone,PhoneProduct,PhoneFeed];
function AppMock({niche,compact,variant=0}){
 const Screen=PHONES[variant]||Phone;
 if(compact)return <div className="m-app-stage compact"><Screen niche={niche}/></div>;
 return <div className={`m-app-stage m-app-v${variant}`}>
  <div className="m-app-col left">{variant===1?<><ListCard niche={niche} className="m-in" style={rise(5)}/><Mix niche={niche} className="m-in" style={rise(6)}/></>:variant===2?<Notes niche={niche} start={5}/>:<><Quote niche={niche} className="m-in" style={rise(5)}/><Mix niche={niche} className="m-in" style={rise(6)}/></>}</div>
  <Screen niche={niche}/>
  <div className="m-app-col right">{variant===1?<><Quote niche={niche} className="m-in" style={rise(8)}/><div className="m-card m-kpi-card m-in" style={rise(9)}><Kpis niche={niche}/></div></>:variant===2?<><Quote niche={niche} className="m-in" style={rise(7)}/><div className="m-card m-kpi-card m-in" style={rise(8)}><Kpis niche={niche}/></div></>:<><div className="m-card m-kpi-card m-in" style={rise(7)}><Kpis niche={niche}/></div><Notes niche={{...niche,features:niche.features.slice(0,2)}} start={8}/></>}</div>
 </div>;
}

// ── SaaS tool ────────────────────────────────────────────────────────────
function SaasMock({niche}){
 const icons=['home',niche.icons[0],niche.icons[1],'user','spark'];
 return <div className="m-window m-saas">
  <div className="m-chrome"><i/><i/><i/><span className="m-url">app.{niche.domain}</span></div>
  <div className="m-saas-body">
   <aside className="m-side">
    <Logo niche={niche}/>
    <div className="m-side-nav">{niche.side.map((s,i)=><span key={s} className={`m-in${i?'':' on'}`} style={rise(i)}><Icon name={icons[i]} size={16}/>{s}</span>)}</div>
    <div className="m-side-user"><span className="m-avatar"/><span><b>Anna K.</b><small>Admin</small></span></div>
   </aside>
   <div className="m-main">
    <div className="m-top m-in" style={rise(0)}><b className="m-display">{niche.side[0]}</b><span className="m-search"><Icon name="search" size={14}/>Search</span><span className="m-btn m-btn-sm">+ New</span></div>
    <div className="m-kpis">{niche.kpis.map(([l,v],i)=><div className="m-card m-kpi m-in" key={l} style={rise(1+i)}><small>{l}</small><b>{v}</b><span className="m-kpi-bar"><i style={{width:`${48+i*17}%`}}/></span></div>)}</div>
    <div className="m-panels">
     <div className="m-card m-chart-card m-in" style={rise(4)}><div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div><strong className="m-big"><Count {...niche.metric}/></strong><Chart series={niche.series} width={520} height={150} labels/><div className="m-months">{['Jan','Mar','May','Jul','Sep','Nov'].map(m=><span key={m}>{m}</span>)}</div></div>
     <div className="m-card m-list-card m-in" style={rise(5)}><div className="m-card-head"><span>Recent</span><span className="m-link">View all</span></div><div className="m-rows">{niche.list.map((r,i)=><Row key={r[0]} row={r}/>)}</div></div>
    </div>
   </div>
  </div>
  <Toast niche={niche} className="m-toast-saas"/>
 </div>;
}

// ── Content cards: the mock-ups are filled with real UI, not illustrations ──
// A letter badge never contradicts the row the way a stock icon can.
const initials=t=>/^[A-Z]{2,4}$/.test(t)?t:t.replace(/^#\d+\s*/,'').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
function Badge({text}){return <span className="m-row-icon m-badge">{initials(text)}</span>}
function Row({row:[t,m,v],meta=true}){return <div className="m-row"><Badge text={t}/><span className="m-row-text"><b>{t}</b>{meta&&<small>{m}</small>}</span><span className="m-row-value">{v}</span></div>}
function ListCard({niche,title=niche.top,rows=niche.list,className='',style}){return <div className={`m-card m-list-card ${className}`} style={style}><div className="m-card-head"><span>{title}</span><span className="m-link">View all</span></div><div className="m-rows">{rows.map(r=><Row key={r[0]} row={r}/>)}</div></div>}
function Notes({niche,className='',start=0}){return <div className={`m-notes ${className}`}>{niche.features.map((f,i)=><div className="m-card m-note m-in" key={f} style={rise(start+i)}><small>0{i+1}</small><b>{f}</b><p>{niche.notes[i]}</p></div>)}</div>}
function Quote({niche,className='',style}){const [text,who,role]=niche.quote;return <div className={`m-card m-quote ${className}`} style={style}><span className="m-stars">★★★★★</span><p>“{text}”</p><span className="m-quote-by"><Badge text={who}/><span><b>{who}</b><small>{role}</small></span></span></div>}
function Mix({niche,className='',style}){return <div className={`m-card m-mix ${className}`} style={style}><div className="m-card-head"><span>Mix</span><span className="m-delta">7d</span></div>{niche.mix.map(([l,v],i)=><div className="m-mix-row" key={l}><span><b>{l}</b><small>{v}%</small></span><i><i className={`d${i}`} style={{width:`${v}%`}}/></i></div>)}</div>}
function Kpis({niche,className=''}){return <div className={`m-kpi-row ${className}`}>{niche.kpis.map(([l,v],i)=><div key={l} className="m-in" style={rise(4+i)}><b className="m-display">{v}</b><small>{l}</small></div>)}</div>}
function MetricCard({niche,className='',style,w=320,h=110}){return <div className={`m-card m-metric-card ${className}`} style={style}><div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div><strong className="m-big"><Count {...niche.metric}/></strong><Chart series={niche.series} width={w} height={h}/></div>}

// ── Website: poster and editorial layouts ────────────────────────────────
function SitePoster({niche}){
 return <div className="m-window m-site m-site-poster">
  <div className="m-chrome"><i/><i/><i/><span className="m-url">{niche.domain}</span></div>
  <div className="m-page">
   <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-nav-links">{niche.nav.map(n=><span key={n}>{n}</span>)}</span><span className="m-btn m-btn-sm">{niche.cta}</span></nav>
   <div className="m-pp-hero">
    <div className="m-pp-copy">
     <h4 className="m-display m-in" style={rise(1)}>{niche.headline[0]}<br/><em>{niche.headline[1]}</em></h4>
     <p className="m-in" style={rise(2)}>{niche.sub}</p>
     <div className="m-actions m-in" style={rise(3)}><span className="m-btn">{niche.cta}<span className="m-arrow">→</span></span><span className="m-btn m-btn-ghost">See how it works</span></div>
     <Kpis niche={niche}/>
    </div>
    <div className="m-pp-side"><MetricCard niche={niche} className="m-in" style={rise(2)} w={300} h={84}/><Quote niche={niche} className="m-in" style={rise(4)}/></div>
   </div>
   <Notes niche={niche} className="m-pp-notes" start={5}/>
  </div>
 </div>;
}
function SiteEditorial({niche}){
 return <div className="m-window m-site m-site-ed">
  <div className="m-chrome"><i/><i/><i/><span className="m-url">{niche.domain}</span></div>
  <div className="m-page">
   <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-nav-links">{niche.nav.map(n=><span key={n}>{n}</span>)}</span><span className="m-btn m-btn-sm m-btn-ghost">Sign in</span></nav>
   <div className="m-ed-grid">
    <div className="m-ed-side"><b className="m-in" style={rise(1)}>Why {niche.name}</b><ol className="m-ed-index">{niche.features.map((f,i)=><li key={f} className="m-in" style={rise(1+i)}><small>0{i+1}</small>{f}</li>)}</ol></div>
    <div className="m-ed-cards"><ListCard niche={niche} className="m-in" style={rise(2)}/><div className="m-card m-ed-toast m-in" style={rise(3)}><span className="m-toast-icon"><Icon name="bell" size={14}/></span><span><b>{niche.toast[0]}</b><small>{niche.toast[1]}</small></span></div></div>
    <div className="m-ed-copy"><h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]} <em>{niche.headline[1]}</em></h4><p className="m-in" style={rise(3)}>{niche.sub}</p><span className="m-btn m-in" style={rise(4)}>{niche.cta}<span className="m-arrow">→</span></span></div>
   </div>
   <div className="m-ed-stats">{niche.kpis.map(([l,v],i)=><div key={l} className="m-in" style={rise(5+i)}><b className="m-display">{v}</b><small>{l}</small></div>)}</div>
  </div>
</div>;
}

// ── App screens: product card and feed ───────────────────────────────────
function PhoneShell({children,niche,className=''}){
 return <div className="m-phone"><div className={`m-phone-screen ${className}`}>
  <div className="m-status"><b>9:41</b><span className="m-island"/><span className="m-status-icons"><i/><i/><i/></span></div>
  {children}
  <div className="m-tabbar">{niche.icons.map((icon,i)=><span key={icon} className={i?'':'on'}><Icon name={icon} size={20}/></span>)}</div>
 </div></div>;
}
function PhoneProduct({niche}){
 return <PhoneShell niche={niche} className="m-ph-product">
  <div className="m-app-head m-in" style={rise(0)}><Logo niche={niche}/><span className="m-avatar"/></div>
  <div className="m-hero-card m-in" style={rise(1)}><div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div><strong className="m-big"><Count {...niche.metric}/></strong><Chart series={niche.series} width={280} height={64}/></div>
  <h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]} <em>{niche.headline[1]}</em></h4>
  <Notes niche={niche} className="m-ph-notes" start={3}/>
  <span className="m-btn m-ph-cta m-in" style={rise(6)}>{niche.cta}<span className="m-arrow">→</span></span>
 </PhoneShell>;
}
function PhoneFeed({niche}){
 return <PhoneShell niche={niche} className="m-ph-feed">
  <div className="m-app-head m-in" style={rise(0)}><div><small>{niche.hello}</small><b className="m-display">{niche.name}</b></div><span className="m-row-icon"><Icon name="bell" size={16}/></span></div>
  <div className="m-stories m-in" style={rise(1)}>{niche.stories.map((t,i)=><span key={t}><i className={i?'':'on'}>{initials(t).slice(0,3)}</i>{t}</span>)}</div>
  <div className="m-tiles">
   <div className="m-tile m-tile-hl m-in" style={rise(2)}><small>{niche.metric.label}</small><strong className="m-big"><Count {...niche.metric}/></strong><span className="m-delta">{niche.metric.delta}</span></div>
   <Mix niche={niche} className="m-tile m-tile-mix m-in" style={rise(3)}/>
   <div className="m-tile m-in" style={rise(4)}><small>{niche.kpis[0][0]}</small><b className="m-display">{niche.kpis[0][1]}</b><Bars series={niche.series.slice(-6)}/></div>
   <div className="m-tile m-tile-ink m-in" style={rise(5)}><span className="m-ink-top"><Badge text={niche.list[0][0]}/><span className="m-delta">{niche.metric.delta}</span></span><b>{niche.list[0][0]}</b><strong className="m-display">{niche.list[0][2]}</strong></div>
   <div className="m-tile m-tile-wide m-in" style={rise(6)}><small>{niche.top}</small>{niche.list.slice(1).map(r=><Row key={r[0]} row={r}/>)}</div>
  </div>
 </PhoneShell>;
}
function Bars({series,className=''}){const max=Math.max(...series);return <div className={`m-bars ${className}`}>{series.map((v,i)=><i key={i} style={{height:`${v/max*100}%`,'--i':i}}/>)}</div>}
function Donut({items}){
 const total=items.reduce((a,b)=>a+b,0);let acc=0;
 return <svg className="m-donut" viewBox="0 0 120 120" aria-hidden="true">{items.map((v,i)=>{const len=v/total*100,el=<circle key={i} cx="60" cy="60" r="46" pathLength="100" className={`d${i}`} style={{strokeDasharray:`${Math.max(len-2,0)} ${100-len+2}`,strokeDashoffset:-acc}}/>;acc+=len;return el})}</svg>;
}

// ── SaaS: board and insights layouts ─────────────────────────────────────
function SaasFrame({niche,children,mood}){
 const icons=['home',niche.icons[0],niche.icons[1],'user','spark'];
 return <div className="m-window m-saas">
  <div className="m-chrome"><i/><i/><i/><span className="m-url">app.{niche.domain}</span></div>
  <div className="m-saas-body">
   <aside className="m-side"><Logo niche={niche}/><div className="m-side-nav">{niche.side.map((s,i)=><span key={s} className={`m-in${i===1?' on':''}`} style={rise(i)}><Icon name={icons[i]} size={16}/>{s}</span>)}</div><div className="m-side-user"><span className="m-avatar"/><span><b>Anna K.</b><small>Admin</small></span></div></aside>
   <div className="m-main">{children}</div>
  </div>
 </div>;
}
function SaasBoard({niche,mood}){
 return <SaasFrame niche={niche} mood={mood}>
  <div className="m-top m-in" style={rise(0)}><b className="m-display">{niche.side[1]}</b><span className="m-faces"><i/><i/><i/></span><span className="m-btn m-btn-sm">+ New</span></div>
  <div className="m-banner m-in" style={rise(1)}><div><small>{niche.features[0]}</small><h4 className="m-display">{niche.headline[0]} <em>{niche.headline[1]}</em></h4></div><div className="m-banner-kpis">{niche.kpis.map(([l,v])=><span key={l}><b>{v}</b><small>{l}</small></span>)}</div></div>
  <div className="m-board">{niche.board.map(([title,items],c)=><div key={title} className="m-col m-in" style={rise(2+c)}><div className="m-col-head"><b>{title}</b><small>{items.length}</small></div>{items.map(([t,m],i)=><div key={t} className="m-task"><span className="m-task-top"><b>{t}</b>{c===0&&i===0&&<span className="m-tag t0">New</span>}</span><span className="m-task-foot"><small>{m}</small><span className="m-faces"><i/></span></span></div>)}<span className="m-col-add">+ Add</span></div>)}</div>
 </SaasFrame>;
}
function SaasInsights({niche,mood}){
 return <SaasFrame niche={niche} mood={mood}>
  <div className="m-top m-in" style={rise(0)}><b className="m-display">Insights</b><span className="m-segment"><span className="on">7d</span><span>30d</span><span>1y</span></span></div>
  <div className="m-ins">
   <div className="m-card m-ins-hero m-in" style={rise(1)}><small>{niche.metric.label}</small><strong className="m-display"><Count {...niche.metric}/></strong><span className="m-delta">{niche.metric.delta}</span><Chart series={niche.series} width={300} height={90}/><div className="m-ins-sub">{niche.kpis.slice(1).map(([l,v])=><span key={l}><small>{l}</small><b>{v}</b></span>)}</div></div>
   <div className="m-card m-ins-donut m-in" style={rise(2)}><div className="m-card-head"><span>Mix</span><span className="m-delta">7d</span></div><div className="m-donut-wrap"><Donut items={niche.mix.map(x=>x[1])}/><b className="m-donut-total">{niche.mix[0][1]}%<small>{niche.mix[0][0]}</small></b></div><div className="m-legend">{niche.mix.map(([l,v],i)=><span key={l}><i className={`d${i}`}/>{l}<b>{v}%</b></span>)}</div></div>
   <div className="m-card m-ins-bars m-in" style={rise(3)}><div className="m-card-head"><span>{niche.kpis[0][0]}</span><b>{niche.kpis[0][1]}</b></div><Bars series={niche.series}/></div>
   <div className="m-card m-ins-top m-in" style={rise(4)}><div className="m-card-head"><span>{niche.top}</span><span className="m-link">View all</span></div><div className="m-rows">{niche.list.map((r,i)=><Row key={r[0]} row={r} meta={false}/>)}</div></div>
  </div>
 </SaasFrame>;
}
// SaaS on a phone: the same product, as its mobile companion.
function SaasPhone({niche}){
 return <div className="m-app-stage compact"><PhoneShell niche={niche} className="m-ph-saas">
  <div className="m-app-head m-in" style={rise(0)}><div><small>{niche.side[0]}</small><b className="m-display">{niche.name}</b></div><span className="m-avatar"/></div>
  <div className="m-hero-card m-in" style={rise(1)}><div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div><strong className="m-big"><Count {...niche.metric}/></strong><Bars series={niche.series}/></div>
  <div className="m-kpi-pair">{niche.kpis.slice(0,2).map(([l,v],i)=><div className="m-card m-in" key={l} style={rise(2+i)}><small>{l}</small><b>{v}</b></div>)}</div>
  <div className="m-rows m-in" style={rise(4)}>{niche.list.map((r,i)=><Row key={r[0]} row={r}/>)}</div>
 </PhoneShell></div>;
}

// ── Stage: scales a fixed-size mock-up to the column and tilts it ────────
export function MockStage({type,mood,niche,paused,variant=0}){
 const box=useRef(null),inner=useRef(null);
 const [size,setSize]=useState({scale:1,compact:false,crop:false});
 useLayoutEffect(()=>{
  const el=box.current;if(!el)return;
  const measure=()=>{const w=el.clientWidth,compact=w<640;setSize({scale:Math.min(1,w/(compact?380:1080)),compact,crop:false})};
  measure();const ro=new ResizeObserver(measure);ro.observe(el);return()=>ro.disconnect();
 },[type]);
 useEffect(()=>{
  const el=box.current,target=inner.current;if(!el||!target)return;
  if(paused||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches){target.style.transform='';return}
  let raf=0,x=0,y=0,cx=0,cy=0;
  const loop=()=>{cx+=(x-cx)*.08;cy+=(y-cy)*.08;target.style.transform=`rotateX(${(-cy*3.2).toFixed(3)}deg) rotateY(${(cx*4.4).toFixed(3)}deg)`;if(Math.abs(x-cx)>.001||Math.abs(y-cy)>.001)raf=requestAnimationFrame(loop);else raf=0};
  const move=e=>{const r=el.getBoundingClientRect();x=(e.clientX-r.left)/r.width-.5;y=(e.clientY-r.top)/r.height-.5;if(!raf)raf=requestAnimationFrame(loop)};
  const leave=()=>{x=0;y=0;if(!raf)raf=requestAnimationFrame(loop)};
  el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
  return()=>{cancelAnimationFrame(raf);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave)};
 },[paused,type]);
 const design=size.compact?{w:380,h:740}:type==='app'?{w:1080,h:760}:{w:1080,h:680};
 const shown=size.crop?{w:640,h:design.h}:design;
 return <div className={`m-stage${size.crop?' crop':''}`} ref={box} style={{height:shown.h*size.scale}}>
  <div className="m-tilt" ref={inner}>
   <div className={`mock mood-${mood} type-${type}`} style={{...theme(mood,niche.accent[mood]),width:design.w,height:design.h,transform:`scale(${size.scale})`}}>
    {type==='site'?(size.compact?<MobileSite niche={niche} mood={mood} variant={variant}/>:React.createElement([SiteMock,SitePoster,SiteEditorial][variant]||SiteMock,{niche,mood})):type==='saas'?(size.compact?(variant===1?<div className="m-app-stage compact"><PhoneFeed niche={niche}/></div>:variant===2?<div className="m-app-stage compact"><PhoneProduct niche={niche}/></div>:<SaasPhone niche={niche}/>):React.createElement([SaasMock,SaasBoard,SaasInsights][variant]||SaasMock,{niche,mood})):<AppMock niche={niche} mood={mood} compact={size.compact} variant={variant}/>}
   </div>
  </div>
 </div>;
}
