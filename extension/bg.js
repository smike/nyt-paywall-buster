// Track action using Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-11020659-5']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {
    if ('redirect' in message) {
      chrome.tabs.update(sender.tab.id, {url: message.redirect});
    }

    _gaq.push(['_trackEvent', 'bust-listener', message.action, message.value]);
  }
);
