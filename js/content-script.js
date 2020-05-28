
;(function() {
  var findDomFunc;
  var ruleList;
  document.addEventListener('DOMContentLoaded', function () {
    findDomFunc = function(timer = 0) {
      setTimeout(() => {
        let tipFlag = false;
        if ($('pre.chroma').length > 1) {
          $('pre.chroma').each((index, dom) => {
            $(dom).removeClass('fuck_warning_tips');
            for (var i = 0; i < ruleList.length; i++) {
              const item = ruleList[i];
              const pattern = item.checked ? new RegExp(item.name) : item.name;
              if ($(dom).text().match(pattern)) {
                tipFlag = true;
                $(dom).addClass('fuck_warning_tips');
                continue;
              }
            }
          });
          if (tipFlag) {
            chrome.runtime.sendMessage({ cmd: 'fuckinjectcodenotice' });
          }
        } else if (timer) {
          findDomFunc(timer);
        }
      }, timer);
    }
    findDomFunc(500);
  });
  // 监听长连接
  chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == 'connectToPage') {
      port.onMessage.addListener(function (msg) {
        if (msg.cmd === 'fuckinjectcode') {
          ruleList = JSON.parse(msg.list) || [];
          if (ruleList.length && findDomFunc) {
            findDomFunc();
          }
        }
         
      });
    }
  });
  chrome.runtime.sendMessage({ cmd: 'getfuckinjectcode' });
})();
