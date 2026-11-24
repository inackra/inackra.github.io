import React from 'react';
import '@fontsource-variable/manrope';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App';
import {initAnalytics} from './analytics';
initAnalytics();
const node=document.getElementById('root'),page=<App initialPath={location.pathname}/>;
if(node.hasChildNodes())hydrateRoot(node,page);else createRoot(node).render(page);
