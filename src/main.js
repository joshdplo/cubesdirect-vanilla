import './js/globalSetup.js';
import './css/reset.css';
import './css/base.css';
import './js/globalMessages.js';

import globalBundle from './js/bundles/globalBundle.js';

/**
 * DOM Load
 */
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`DOM Ready @ main.js`);

  globalBundle();
});