import React, {lazy, Suspense} from 'react';
import '@fontsource-variable/manrope';
import {createRoot} from 'react-dom/client';
if (new URLSearchParams(location.search).get('view') === 'structure') {
  import('./wireframe.jsx');
} else {
  const Demo = lazy(() => import('./Demo.jsx'));
  createRoot(document.getElementById('root')).render(<Suspense fallback={null}><Demo/></Suspense>);
}
