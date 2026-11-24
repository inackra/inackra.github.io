// Cookieless visit and funnel analytics (Umami Cloud). The website ID is public by design.
// Without an ID nothing loads and track() is a no-op, so local builds and tests stay clean.
export const UMAMI_ID=import.meta.env?.VITE_UMAMI_ID||'972d309f-9160-43fe-ba5e-cf18bae540fe';
const SOURCE_KEY='inackra-source';

// First touch of this visit: UTM tags or the referring site. It travels with the enquiry,
// so a lead says where it came from even without opening the dashboard.
function rememberSource(){
 try{
  if(sessionStorage.getItem(SOURCE_KEY))return;
  const q=new URLSearchParams(location.search),utm=['utm_source','utm_medium','utm_campaign','utm_content'].map(k=>q.get(k)).filter(Boolean);
  let ref='';try{const r=document.referrer&&new URL(document.referrer);if(r&&r.hostname!==location.hostname)ref=r.hostname}catch{}
  sessionStorage.setItem(SOURCE_KEY,utm.length?utm.join(' / '):ref?`referrer: ${ref}`:'direct');
 }catch{}
}
export function visitSource(){try{return sessionStorage.getItem(SOURCE_KEY)||''}catch{return ''}}

export function track(name,data){try{window.umami?.track(name,data)}catch{}}

export function initAnalytics(){
 rememberSource();
 // Contact clicks anywhere on the site: email and Telegram.
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(!a)return;const href=a.getAttribute('href');if(href.startsWith('mailto:'))track('contact',{channel:'email'});else if(/^https:\/\/t\.me\/Jo1_Se/.test(href))track('contact',{channel:'telegram'});else if(href.includes('linkedin.com/in/'))track('contact',{channel:'linkedin'})},{capture:true});
 if(!UMAMI_ID||location.hostname!=='inackra.work')return;
 const s=document.createElement('script');s.defer=true;s.src='https://cloud.umami.is/script.js';s.dataset.websiteId=UMAMI_ID;s.dataset.domains='inackra.work';
 document.head.append(s);
}
