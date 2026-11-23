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
function MobileSite({niche,mood,variant=0}){
 return <div className="m-app-stage compact"><div className="m-phone"><div className="m-phone-screen m-msite">
  <div className="m-status"><b>9:41</b><span className="m-island"/><span className="m-status-icons"><i/><i/><i/></span></div>
  <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-burger"><i/><i/></span></nav>
  <span className="m-pill m-in" style={rise(1)}><b>New</b>{niche.features[0]}</span>
  <h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]}<br/><em>{niche.headline[1]}</em></h4>
  <p className="m-in" style={rise(3)}>{niche.sub}</p>
  <span className="m-btn m-in" style={rise(4)}>{niche.cta}<span className="m-arrow">→</span></span>
  {variant===2?<div className="m-msite-ed m-in" style={rise(5)}><div className="m-ed-art"><Art niche={niche}/></div><div className="m-ed-stats">{niche.kpis.slice(0,2).map(([l,v])=><div key={l}><b className="m-display">{v}</b><small>{l}</small></div>)}</div></div>:variant?<div className="m-msite-visual m-msite-art m-in" style={rise(5)}><Art niche={niche}/><Sticker text={niche.cta} className="m-pp-sticker"/></div>:<div className="m-msite-visual m-in" style={rise(5)}><span className={`m-shape m-shape-${mood}`}/><div className="m-card m-metric-card"><div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div><strong className="m-big"><Count {...niche.metric}/></strong><Chart series={niche.series} width={260} height={80}/></div></div>}
 </div></div></div>;
}
const PHONES=[Phone,PhoneProduct,PhoneFeed];
function AppMock({niche,mood,compact,variant=0}){
 const Screen=PHONES[variant]||Phone;
 if(compact)return <div className="m-app-stage compact"><Screen niche={niche}/></div>;
 return <div className={`m-app-stage m-app-v${variant}`}>
  {variant===0&&<><span className="m-poster m-display" aria-hidden="true">{niche.name}</span><span className="m-shape m-shape-app"/></>}
  {variant===1&&<><Art niche={niche} className="m-app-bgart"/><Sticker text={niche.features[1]} className="m-app-sticker"/></>}
  {variant===2&&<><Marquee items={[niche.name,...niche.features]} className="m-app-band b1"/><Marquee items={[niche.headline[0],niche.headline[1]]} className="m-app-band b2"/></>}
  <div className="m-float m-float-left m-in" style={rise(5)}><span className="m-row-icon"><Icon name={niche.icons[0]} size={16}/></span>{niche.features[0]}</div>
  <Screen niche={niche}/>
  <div className="m-float m-float-right m-in" style={rise(6)}><span className="m-row-icon"><Icon name={niche.icons[1]} size={16}/></span>{niche.features[1]}</div>
  <Deco mood={mood} niche={niche}/>
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

// ── Graphic parts: a niche illustration and mood ornaments ───────────────
// Built from flat geometry so it reads as graphic design, not stock art.
// Colours: a1 = main shape, a2 = counter shape, a3 = line (set per mood in CSS).
const star='M200 112C208 176 224 192 288 200C224 208 208 224 200 288C192 224 176 208 112 200C176 192 192 176 200 112Z';
export function Art({niche,className=''}){
 const id=niche.id;let body;
 if(id==='ai')body=<>
  <circle cx="200" cy="200" r="168" className="a3 dash"/>
  <g className="art-spin"><ellipse cx="200" cy="200" rx="176" ry="64" className="a3" transform="rotate(-24 200 200)"/><circle cx="355" cy="130" r="13" className="a1"/></g>
  <g className="art-spin rev"><ellipse cx="200" cy="200" rx="176" ry="64" className="a3" transform="rotate(30 200 200)"/><circle cx="60" cy="125" r="9" className="a2"/></g>
  <circle cx="200" cy="200" r="74" className="a1"/>
  <g transform="translate(100 100) scale(.5)"><path d={star} className="a2 art-pulse"/></g>
 </>;
 else if(id==='fintech')body=<>
  <rect x="60" y="112" width="280" height="176" rx="24" className="a2" transform="rotate(-16 200 200)"/>
  <rect x="60" y="112" width="280" height="176" rx="24" className="a3f" transform="rotate(-6 200 200)"/>
  <g className="art-float"><rect x="60" y="112" width="280" height="176" rx="24" className="a1" transform="rotate(6 200 200)"/>
  <g transform="rotate(6 200 200)"><rect x="88" y="146" width="44" height="34" rx="7" className="a2"/><circle cx="270" cy="250" r="22" className="a2" opacity=".9"/><circle cx="298" cy="250" r="22" className="a2" opacity=".55"/><rect x="88" y="236" width="120" height="10" rx="5" className="a2" opacity=".6"/></g></g>
 </>;
 else if(id==='crypto')body=<>
  <g className="art-spin slow"><circle cx="200" cy="40" r="16" className="a2"/><circle cx="360" cy="200" r="11" className="a1"/><circle cx="60" cy="290" r="20" className="a3f"/></g>
  <circle cx="200" cy="200" r="132" className="a1"/>
  <circle cx="200" cy="200" r="104" className="a2l"/>
  <path d="M200 120l70 40v80l-70 40-70-40v-80z" className="a2"/>
  <path d="M182 160v80M182 160h26a18 18 0 0 1 0 36h-26M182 196h32a22 22 0 0 1 0 44h-32" className="a1l"/>
 </>;
 else if(id==='travel')body=<>
  <rect x="80" y="60" width="240" height="300" rx="120" className="a2"/>
  <circle cx="200" cy="200" r="70" className="a1 art-sun"/>
  <path d="M80 250c40-20 80 20 120 0s80-20 120 0M80 285c40-20 80 20 120 0s80-20 120 0M80 320c40-20 80 20 120 0s80-20 120 0" className="a3"/>
  <path d="M20 330C90 220 150 120 330 70" className="a3 dash art-path"/>
  <path d="M330 70l-26 2 10 18z" className="a1"/>
 </>;
 else if(id==='health')body=<>
  {[150,112,74].map((r,i)=><circle key={r} cx="200" cy="200" r={r} className={`ring r${i}`} pathLength="100"/>)}
  <path d="M30 200h90l20-50 30 100 26-120 26 90 18-20h130" className="a3 art-path"/>
 </>;
 else if(id==='ecom')body=<>
  <circle cx="260" cy="150" r="96" className="a1"/>
  <path d="M110 330c-40 0-50-60-30-110s20-70 10-90h60c-10 20-10 40 10 90s20 110-30 110z" className="a2"/>
  <path d="M210 330c-30 0-40-40-26-76 10-26 10-40 6-54h44c-4 14-4 28 6 54 14 36 4 76-30 76z" className="a3f art-float"/>
  <path d="M300 330c-22 0-26-30-16-52 8-18 8-28 4-38h30c-4 10-4 20 4 38 10 22 6 52-22 52z" className="a2"/>
  <path d="M40 332h330" className="a3"/>
 </>;
 else if(id==='realty')body=<>
  <circle cx="300" cy="96" r="44" className="a1 art-sun"/>
  <path d="M70 360V190a70 70 0 0 1 140 0v170z" className="a2"/>
  <path d="M190 360V150a80 80 0 0 1 160 0v210z" className="a1"/>
  {[0,1,2].map(r=>[0,1].map(c=><rect key={`${r}${c}`} x={230+c*46} y={170+r*56} width="34" height="40" rx="17" className="a2"/>))}
  <path d="M30 362h350" className="a3"/>
 </>;
 else body=<>
  <path d="M60 210h280a140 140 0 0 1-280 0z" className="a1"/>
  <ellipse cx="200" cy="210" rx="140" ry="22" className="a2"/>
  {[[140,196,22,'a3f'],[196,190,26,'a1d'],[252,198,20,'a3f'],[170,206,14,'a1d']].map(([x,y,r,c],i)=><circle key={i} cx={x} cy={y} r={r} className={c}/>)}
  {[150,200,250].map((x,i)=><path key={x} d={`M${x} 150c-16-20 16-30 0-54`} className="a3 art-steam" style={{animationDelay:`${i*.4}s`}}/>)}
 </>;
 return <svg className={`m-art ${className}`} viewBox="0 0 400 400" aria-hidden="true">{body}</svg>;
}
function Sticker({text,className=''}){
 const id=useId().replace(/\W/g,'');
 return <svg className={`m-sticker ${className}`} viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="58" className="st-bg"/><defs><path id={id} d="M60 60m-42 0a42 42 0 1 1 84 0a42 42 0 1 1-84 0"/></defs><text className="st-text"><textPath href={`#${id}`}>{`${text} ✦ ${text} ✦ `}</textPath></text><path d={star} className="st-star" transform="translate(36 36) scale(.12)"/></svg>;
}
function Marquee({items,className=''}){
 const row=[...items,...items,...items];
 return <div className={`m-marquee ${className}`} aria-hidden="true"><div>{[0,1].map(k=><span key={k}>{row.map((x,i)=><React.Fragment key={i}><b>{x}</b><i>✦</i></React.Fragment>)}</span>)}</div></div>;
}
// Ornaments per mood: Swiss crop marks, a loud sticker, or warm grain.
function Deco({mood,niche}){
 if(mood==='strict')return <div className="m-deco m-crops" aria-hidden="true"><i/><i/><i/><i/><span>{niche.name} / 01</span><span>{niche.domain}</span></div>;
 if(mood==='bright')return <div className="m-deco" aria-hidden="true"><Sticker text={niche.features[0]} className="m-deco-sticker"/></div>;
 return <div className="m-deco m-grain" aria-hidden="true"/>;
}

// ── Website: poster and editorial layouts ────────────────────────────────
function SitePoster({niche,mood}){
 return <div className="m-window m-site m-site-poster">
  <div className="m-chrome"><i/><i/><i/><span className="m-url">{niche.domain}</span></div>
  <div className="m-page">
   <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-nav-links">{niche.nav.map(n=><span key={n}>{n}</span>)}</span><span className="m-btn m-btn-sm">{niche.cta}</span></nav>
   <div className="m-pp-hero">
    <h4 className="m-display m-in" style={rise(1)}>{niche.headline[0]}<br/><em>{niche.headline[1]}</em></h4>
    <Art niche={niche} className="m-pp-art m-in"/>
    <Sticker text={niche.cta} className="m-pp-sticker"/>
   </div>
   <div className="m-pp-foot m-in" style={rise(3)}><p>{niche.sub}</p><span className="m-btn">{niche.cta}<span className="m-arrow">→</span></span></div>
  </div>
  <Marquee items={niche.features} className="m-pp-marquee"/>
  <Deco mood={mood} niche={niche}/>
 </div>;
}
function SiteEditorial({niche,mood}){
 return <div className="m-window m-site m-site-ed">
  <div className="m-chrome"><i/><i/><i/><span className="m-url">{niche.domain}</span></div>
  <div className="m-page">
   <nav className="m-nav m-in" style={rise(0)}><Logo niche={niche}/><span className="m-nav-links">{niche.nav.map(n=><span key={n}>{n}</span>)}</span><span className="m-btn m-btn-sm m-btn-ghost">Sign in</span></nav>
   <div className="m-ed-grid">
    <ol className="m-ed-index">{niche.features.map((f,i)=><li key={f} className="m-in" style={rise(1+i)}><small>0{i+1}</small>{f}</li>)}</ol>
    <div className="m-ed-art m-in" style={rise(2)}><Art niche={niche}/></div>
    <div className="m-ed-copy"><h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]} <em>{niche.headline[1]}</em></h4><p className="m-in" style={rise(3)}>{niche.sub}</p><span className="m-btn m-in" style={rise(4)}>{niche.cta}<span className="m-arrow">→</span></span></div>
   </div>
   <div className="m-ed-stats">{niche.kpis.map(([l,v],i)=><div key={l} className="m-in" style={rise(5+i)}><b className="m-display">{v}</b><small>{l}</small></div>)}</div>
  </div>
  <Deco mood={mood} niche={niche}/>
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
  <div className="m-ph-art m-in" style={rise(1)}><Art niche={niche}/><span className="m-ph-tag">{niche.features[0]}</span></div>
  <h4 className="m-display m-in" style={rise(2)}>{niche.headline[0]} <em>{niche.headline[1]}</em></h4>
  <div className="m-ph-chips m-in" style={rise(3)}>{niche.features.map((f,i)=><span key={f} className={i?'':'on'}>{f}</span>)}</div>
  <span className="m-btn m-ph-cta m-in" style={rise(4)}>{niche.cta}<span className="m-arrow">→</span></span>
 </PhoneShell>;
}
function PhoneFeed({niche}){
 return <PhoneShell niche={niche} className="m-ph-feed">
  <div className="m-app-head m-in" style={rise(0)}><div><small>{niche.hello}</small><b className="m-display">{niche.name}</b></div><span className="m-row-icon"><Icon name="bell" size={16}/></span></div>
  <div className="m-stories m-in" style={rise(1)}>{niche.list.concat(niche.list.slice(0,2)).map(([t],i)=><span key={i}><i className={i?'':'on'}><Icon name={niche.icons[i%4]} size={18}/></i>{t.split(' ')[0]}</span>)}</div>
  <div className="m-tiles">
   <div className="m-tile m-tile-hl m-in" style={rise(2)}><small>{niche.metric.label}</small><strong className="m-big"><Count {...niche.metric}/></strong><span className="m-delta">{niche.metric.delta}</span></div>
   <div className="m-tile m-tile-art m-in" style={rise(3)}><Art niche={niche}/></div>
   <div className="m-tile m-in" style={rise(4)}><small>{niche.kpis[0][0]}</small><b className="m-display">{niche.kpis[0][1]}</b><Bars series={niche.series.slice(-6)}/></div>
   <div className="m-tile m-tile-ink m-in" style={rise(5)}><Icon name={niche.icons[1]} size={18}/><b>{niche.list[0][0]}</b><small>{niche.list[0][2]}</small></div>
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
  <Deco mood={mood} niche={niche}/>
 </div>;
}
function SaasBoard({niche,mood}){
 const cols=[['To do',niche.list],['In progress',niche.list.slice(1)],['Done',niche.list.slice(0,1)]];
 return <SaasFrame niche={niche} mood={mood}>
  <div className="m-top m-in" style={rise(0)}><b className="m-display">{niche.side[1]}</b><span className="m-faces"><i/><i/><i/></span><span className="m-btn m-btn-sm">+ New</span></div>
  <div className="m-banner m-in" style={rise(1)}><div><small>{niche.features[0]}</small><h4 className="m-display">{niche.headline[0]} <em>{niche.headline[1]}</em></h4></div><Art niche={niche}/></div>
  <div className="m-board">{cols.map(([title,items],c)=><div key={title} className="m-col m-in" style={rise(2+c)}><div className="m-col-head"><b>{title}</b><small>{items.length}</small></div>{items.map(([t,m,v],i)=><div key={t} className="m-task"><span className={`m-tag t${(c+i)%3}`}>{niche.features[(c+i)%3]}</span><b>{t}</b><span className="m-task-foot"><small>{m}</small><span className="m-faces"><i/></span></span><span className="m-kpi-bar"><i style={{width:`${30+((c*3+i)*23)%65}%`}}/></span></div>)}</div>)}</div>
 </SaasFrame>;
}
function SaasInsights({niche,mood}){
 return <SaasFrame niche={niche} mood={mood}>
  <div className="m-top m-in" style={rise(0)}><b className="m-display">Insights</b><span className="m-segment"><span className="on">7d</span><span>30d</span><span>1y</span></span></div>
  <div className="m-ins">
   <div className="m-card m-ins-hero m-in" style={rise(1)}><small>{niche.metric.label}</small><strong className="m-display"><Count {...niche.metric}/></strong><span className="m-delta">{niche.metric.delta}</span><Art niche={niche}/></div>
   <div className="m-card m-ins-donut m-in" style={rise(2)}><div className="m-card-head"><span>Mix</span></div><Donut items={[46,30,24]}/><div className="m-legend">{niche.kpis.map(([l],i)=><span key={l}><i className={`d${i}`}/>{l}</span>)}</div></div>
   <div className="m-card m-ins-bars m-in" style={rise(3)}><div className="m-card-head"><span>{niche.kpis[0][0]}</span><b>{niche.kpis[0][1]}</b></div><Bars series={niche.series}/></div>
   <div className="m-card m-ins-heat m-in" style={rise(4)}><div className="m-card-head"><span>Activity</span></div><div className="m-heat">{Array.from({length:35},(_,i)=><i key={i} style={{opacity:.12+((i*37+niche.series[i%12])%88)/100}}/>)}</div></div>
  </div>
 </SaasFrame>;
}
// SaaS on a phone: the same product, as its mobile companion.
function SaasPhone({niche}){
 return <div className="m-app-stage compact"><PhoneShell niche={niche} className="m-ph-saas">
  <div className="m-app-head m-in" style={rise(0)}><div><small>{niche.side[0]}</small><b className="m-display">{niche.name}</b></div><span className="m-avatar"/></div>
  <div className="m-hero-card m-in" style={rise(1)}><div className="m-card-head"><span>{niche.metric.label}</span><span className="m-delta">{niche.metric.delta}</span></div><strong className="m-big"><Count {...niche.metric}/></strong><Bars series={niche.series}/></div>
  <div className="m-kpi-pair">{niche.kpis.slice(0,2).map(([l,v],i)=><div className="m-card m-in" key={l} style={rise(2+i)}><small>{l}</small><b>{v}</b></div>)}</div>
  <div className="m-rows m-in" style={rise(4)}>{niche.list.slice(0,2).map(([t,m,v],i)=><div className="m-row" key={t}><span className="m-row-icon"><Icon name={niche.icons[i]} size={15}/></span><span className="m-row-text"><b>{t}</b><small>{m}</small></span><span className="m-row-value">{v}</span></div>)}</div>
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
