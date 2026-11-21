import React from 'react';
import {PassThrough} from 'node:stream';
import {renderToPipeableStream,renderToString} from 'react-dom/server';
import App from './App';
export {metadata,allRoutes} from './seo';
export function render(path){return new Promise((resolve,reject)=>{let failed=false;const output=new PassThrough(),chunks=[];output.on('data',chunk=>chunks.push(chunk));output.on('end',()=>{if(!failed)resolve(renderToString(<App initialPath={path}/>))});const stream=renderToPipeableStream(<App initialPath={path}/>,{onAllReady(){stream.pipe(output)},onError(error){failed=true;reject(error)}});});}
