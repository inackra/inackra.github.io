import React from 'react';
// Small line icons for pill buttons; they inherit the pill's text colour.
const paths={
 mail:<><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/></>,
 telegram:<path d="M20.5 4.5 3.5 11l6 2.2M20.5 4.5 17.5 19.5l-8-6.3M20.5 4.5 9.5 13.2v5.3l3-3"/>,
 linkedin:<><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1.9 2.1 2.6V16"/></>,
 download:<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>,
 pause:<path d="M9 6.5v11M15 6.5v11"/>,
 play:<path d="M8 6v12l10-6z"/>,
 lock:<><rect x="5.5" y="10.5" width="13" height="9" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></>,
};
export default function Icon({name}){
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`icon icon-${name}`}>{paths[name]}</svg>;
}
