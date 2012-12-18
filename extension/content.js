var pattern = /[&\?]gwh=([^&]+)/;
var patternBusted = /gwh=(&.*|$)/;

var currentUrl = window.location.href;
var match = pattern.exec(currentUrl);
if (match) {
  // This page needs to be busted.
  var newUrl = currentUrl.replace(match[1], "");
  chrome.extension.sendMessage({action: 'redirect', redirect: newUrl}); // send message to redirect
} else {
  if (document.getElementById('gatewayUnit')) {
    // Didn't think we should bust but the paywall is still here.
    chrome.extension.sendMessage({action: 'bustFailure', value: currentUrl});
  } else if (patternBusted.test(currentUrl)) {
    // This page was busted successfully.
    chrome.extension.sendMessage({action: 'bustSuccess'});
  } else {
    // This page wasn't busted and doesn't need to be.
    chrome.extension.sendMessage({action: 'noBust'});
  }
}
