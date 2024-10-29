import './js/globalSetup.js';
import './css/reset.css';
import './css/style.css';
import './js/globalMessages.js';

import globalBundle from './components/bundles/globalBundle.js';

/**
 * DOM Load
 */
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`DOM Ready @ main.js`);

  globalBundle();
});