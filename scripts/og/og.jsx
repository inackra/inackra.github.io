// Share cover (1200×630), always in the site's light theme: call to action on top,
// the mock-up in the middle, the wordmark and the address at the bottom.
import React from 'react';
import '@fontsource-variable/manrope';
import {createRoot} from 'react-dom/client';
import {MockStage} from '../../src/studio/Mocks';
import {findNiche,parseShare,copy} from '../../src/studio/data';
import '../../src/studio/studio.css';
import logo from '../../public/assets/inackra.svg';
const q=new URLSearchParams(location.search),b=parseShare(q.get('b')),lang=q.get('lang')==='en'?'en':'ru',cta=copy[lang].ogCta;
// The mock-up keeps 430px of height: scale it by its design height, not the width.
const h=b.type==='app'?760:680,scale=430/h;
createRoot(document.getElementById('root')).render(<div className="og">
 <style>{`.og{width:1200px;height:630px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;font-family:'Manrope Variable',Manrope,sans-serif;color:#000;background:#EEE9DD;padding:38px 48px 30px}
 .og h1{margin:0;font-size:46px;line-height:1.05;font-weight:600;letter-spacing:-.055em;text-align:center}.og h1 span{color:rgba(0,0,0,.42)}
 .og-box{margin-top:28px;width:${Math.round(1080*scale)}px;height:430px;flex:none}.og-mock{width:1080px;transform:scale(${scale});transform-origin:0 0}
 .og-foot{margin-top:auto;width:100%;display:flex;justify-content:space-between;align-items:center;font-size:20px;font-weight:600;letter-spacing:-.03em}.og-foot img{height:22px;filter:invert(1)}`}</style>
 <h1>{cta[0]} <span>{cta[1]}</span></h1>
 <div className="og-box"><div className="og-mock"><MockStage type={b.type} mood={b.mood} niche={findNiche(b.niche)} variant={b.variant} paused/></div></div>
 <div className="og-foot"><img src={logo} alt="INACKRA"/><span>inackra.work</span></div>
</div>);
