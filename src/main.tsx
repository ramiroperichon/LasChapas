import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/eb-garamond/wght.css';
import '@fontsource-variable/eb-garamond/wght-italic.css';
import '@fontsource-variable/jost/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/buttons.css';
import './styles/motion.css';
import App from './App';

// Las animaciones de entrada solo ocultan contenido si hay JavaScript.
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
