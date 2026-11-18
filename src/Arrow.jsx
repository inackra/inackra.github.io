import React from 'react';
export default function Arrow({down=false,left=false}){
 return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`arrow${down?' down':left?' left':''}`}><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.4"/></svg>;
}
