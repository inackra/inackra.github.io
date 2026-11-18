import React from 'react';
import '@fontsource-variable/manrope';
import {createRoot} from 'react-dom/client';
import Boot from './Boot';
if(new URLSearchParams(location.search).get('view')==='structure')import('./wireframe.jsx');
else createRoot(document.getElementById('root')).render(<Boot/>);
