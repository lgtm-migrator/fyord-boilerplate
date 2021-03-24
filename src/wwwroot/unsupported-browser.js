/* eslint-disable no-var */
/* eslint-disable max-len */

(function () {
  if (!window.customElements) {
    var legacyEdge = 'Legacy Edge';

    var unsupportedBrowser = 'unknown';
    unsupportedBrowser = document['documentMode'] ? 'Internet Explorer' : unsupportedBrowser;
    unsupportedBrowser = navigator.userAgent.indexOf('Edge') >= 0 ? legacyEdge : unsupportedBrowser;

    var banner = document.querySelector('.unsupported-browser');

    banner.innerHTML = '<p>Unsupported browser detected: <b>' + unsupportedBrowser + '</b>.\
      Some features will not work as expected. ' +
      (unsupportedBrowser === legacyEdge ?
        'The new version of MS Edge is available <a href="https://www.microsoft.com/en-us/edge" target="_blank">here</a>.' :
        'Please use a modern, updated browser for the best experience\
        (i.e. <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>, <a href="https://www.mozilla.org/en-US/exp/firefox/new/" target="_blank">FireFox</a>, <a href="https://www.microsoft.com/en-us/edge" target="_blank">MS Edge</a>).</p>');

    banner.classList.add('active');
  }
})();
