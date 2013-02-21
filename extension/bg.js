// Track action using Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-11020659-5']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.storage.sync.get({'notifiedOfFix': false}, function(items) {
  if (!items['notifiedOfFix']) {
    var notification = webkitNotifications.createNotification(
      '', // icon url
      '', // notification title
      'Extension fixed and reenabled!' // notification body text
    );

    var acked_locally = false;
    var setFlag = function() {
      acked_locally = true;
      chrome.storage.sync.set({'notifiedOfFix': true});
      chrome.extension.sendMessage({action: 'ack_notified_of_fix'});
    };
    notification.onclose = setFlag;
    notification.onclick = setFlag;
    // Then show the notification.
    notification.show();
    chrome.extension.sendMessage({action: 'notified_of_fix'});

    // in case it was acknowledged on another machine.
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      if (!acked_locally && changes['notifiedOfFix']) {
        chrome.extension.sendMessage({action: 'auto-ack_notified_of_fix'});
        notification.cancel();
      }
    });
  }
});

chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {
    _gaq.push(['_trackEvent', 'bust-listener2', message.action, message.value]);
  }
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      console.log("Blocking " + details.url);
      chrome.extension.sendMessage({action: 'mtr_blocked'});
      return {cancel: true};
    },
    {urls: ["*://graphics8.nytimes.com/js/mtr.js"]},
    ["blocking"]);
