import React from 'react';

export default function FlipText({children}){
 const text=String(children??'');
 return <span className="flip-label"><span className="sr-only">{text}</span><span className="flip-visual" aria-hidden="true">{[...text].map((char,i)=><span className="flip-cell" key={i} style={{'--flip-delay':`${Math.min(i*16,180)}ms`}}><span className="flip-front">{char===' '?'\u00a0':char}</span><span className="flip-back" data-motion-ignore="true">{char===' '?'\u00a0':char}</span></span>)}</span></span>;
}
