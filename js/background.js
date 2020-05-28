chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: '*' } })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}
function sendMessageToContentScript(message, callback) {
  getCurrentTabId((tabId) => {
    var port = chrome.tabs.connect(tabId, { name: 'connectToPage' });
    port.postMessage(message);
    port.onMessage.addListener(function (msg) {
    });
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === 'getfuckinjectcode') {
    sendMessageToContentScript({ cmd: 'fuckinjectcode', list: window.localStorage.getItem('_fuck_inject_rule_list') }, function (response) { });
  } else if (request.cmd === 'fuckinjectcodenotice') {
    chrome.notifications.create(null, {
      type: 'image',
      iconUrl: 'img/128.png',
      title: '发现注入',
      message: '额 有注入代码，请查看页面红色部分!',
      imageUrl: 'img/128.png'
    });
  }
});
