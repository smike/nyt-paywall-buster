// Track action using Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-11020659-5']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.storage.sync.get({'notifiedOfBreakage': false}, function(items) {
  if (!items['notifiedOfBreakage']) {
    var notification = webkitNotifications.createNotification(
      null, // icon url
      '', // notification title
      'Extension being disabled due to bug.' // notification body text
    );

    var setFlag = function() {
      console.log('setting');
      chrome.storage.sync.set({'notifiedOfBreakage': true});
    };
    notification.onclose = setFlag;
    notification.onclick = setFlag;
    // Then show the notification.
    notification.show();

    // in case it was acknowledged on another machine.
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      if (changes['notifiedOfBreakage']) {
        console.log('onChanged');
        notification.cancel();
      }
    });
  }
});

chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {
    if ('redirect' in message) {
      chrome.tabs.update(sender.tab.id, {url: message.redirect});
    }

    _gaq.push(['_trackEvent', 'bust-listener', message.action, message.value]);
  }
);
