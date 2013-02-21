if (document.getElementById('gatewayUnit')) {
  // Paywall is still here. Something went wrong.
  chrome.extension.sendMessage({action: 'yesPaywall', value: currentUrl});
} else {
  // No paywall found.
  chrome.extension.sendMessage({action: 'noPaywall'});
}

// A NYT page was loaded
chrome.extension.sendMessage({action: 'pageView'});
