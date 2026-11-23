import React,{useEffect,useId,useLayoutEffect,useRef,useState} from 'react';

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
     <div className="m-trust m-in" style={rise(5)}><span className="m-faces"><i/><i/><i/></span>Loved by 2,000+ people</div>
    </div>
    <div className="m-site-visual">
     <span className={`m-shape m-shape-${mood}`}/>
     <div className="m-card m-metric-card m-in" style={rise(3)}>
      <div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div>
      <strong className="m-big"><Count {...niche.metric}/></strong>
      <Chart series={niche.series} width={320} height={120}/>
      <div className="m-rows">{niche.list.slice(0,2).map(([t,m,v],i)=><div className="m-row" key={t}><span className="m-row-icon"><Icon name={niche.icons[i]} size={15}/></span><span className="m-row-text"><b>{t}</b><small>{m}</small></span><span className="m-row-value">{v}</span></div>)}</div>
     </div>
     <Toast niche={niche} className="m-toast-site"/>
    </div>
   </div>
   <div className="m-features">{niche.features.map((f,i)=><div className="m-feature m-in" key={f} style={rise(6+i)}><span className="m-row-icon"><Icon name={niche.icons[i]} size={16}/></span>{f}</div>)}</div>
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
   <div className="m-rows">{niche.list.map(([t,m,v],i)=><div className="m-row m-in" key={t} style={rise(3+i)}><span className="m-row-icon"><Icon name={niche.icons[i%3]} size={16}/></span><span className="m-row-text"><b>{t}</b><small>{m}</small></span><span className="m-row-value">{v}</span></div>)}</div>
   <div className="m-tabbar">{niche.icons.map((icon,i)=><span key={icon} className={i?'':'on'}><Icon name={icon} size={20}/></span>)}</div>
  </div>
 </div>;
}
// Website on a phone: the same page, responsive.
function MobileSite({niche,mood}){
 return <div className="m-app-stage compact"><div className="m-phone"><div className="m-phone-screen m-msite">
  <div className="m-status"><b>9:41</b><span className="m-island"/><span className="m-status-icons"><i/><i/><i/></span></div>
  <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-burger"><i/><i/></span></nav>
  <span className="m-pill m-in" style={rise(1)}><b>New</b>{niche.features[0]}</span>
  <h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]}<br/><em>{niche.headline[1]}</em></h4>
  <p className="m-in" style={rise(3)}>{niche.sub}</p>
  <span className="m-btn m-in" style={rise(4)}>{niche.cta}<span className="m-arrow">→</span></span>
  <div className="m-msite-visual m-in" style={rise(5)}><span className={`m-shape m-shape-${mood}`}/><div className="m-card m-metric-card"><div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div><strong className="m-big"><Count {...niche.metric}/></strong><Chart series={niche.series} width={260} height={80}/></div></div>
 </div></div></div>;
}
function AppMock({niche,compact}){
 if(compact)return <div className="m-app-stage compact"><Phone niche={niche}/></div>;
 return <div className="m-app-stage">
  <span className="m-poster m-display" aria-hidden="true">{niche.name}</span>
  <span className="m-shape m-shape-app"/>
  <div className="m-float m-float-left m-in" style={rise(5)}><span className="m-row-icon"><Icon name={niche.icons[0]} size={16}/></span>{niche.features[0]}</div>
  <Phone niche={niche}/>
  <div className="m-float m-float-right m-in" style={rise(6)}><span className="m-row-icon"><Icon name={niche.icons[1]} size={16}/></span>{niche.features[1]}</div>
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
     <div className="m-card m-list-card m-in" style={rise(5)}><div className="m-card-head"><span>Recent</span><span className="m-link">View all</span></div><div className="m-rows">{niche.list.map(([t,m,v],i)=><div className="m-row" key={t}><span className="m-row-icon"><Icon name={niche.icons[i%3]} size={15}/></span><span className="m-row-text"><b>{t}</b><small>{m}</small></span><span className="m-row-value">{v}</span></div>)}</div></div>
    </div>
   </div>
  </div>
  <Toast niche={niche} className="m-toast-saas"/>
 </div>;
}

// ── Stage: scales a fixed-size mock-up to the column and tilts it ────────
export function MockStage({type,mood,niche,paused}){
 const box=useRef(null),inner=useRef(null);
 const [size,setSize]=useState({scale:1,compact:false,crop:false});
 useLayoutEffect(()=>{
  const el=box.current;if(!el)return;
  const measure=()=>{const w=el.clientWidth,compact=type!=='saas'&&w<640,design=compact?380:type==='saas'&&w<640?640:1080;setSize({scale:Math.min(1,w/design),compact,crop:type==='saas'&&w<640})};
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
 // On phones the SaaS window is shown closer, cropped at the right edge.
 const shown=size.crop?{w:640,h:design.h}:design;
 return <div className={`m-stage${size.crop?' crop':''}`} ref={box} style={{height:shown.h*size.scale}}>
  <div className="m-tilt" ref={inner}>
   <div className={`mock mood-${mood} type-${type}`} style={{...theme(mood,niche.accent[mood]),width:design.w,height:design.h,transform:`scale(${size.scale})`}}>
    {type==='site'?(size.compact?<MobileSite niche={niche} mood={mood}/>:<SiteMock niche={niche} mood={mood}/>):type==='saas'?<SaasMock niche={niche}/>:<AppMock niche={niche} compact={size.compact}/>}
   </div>
  </div>
 </div>;
}
