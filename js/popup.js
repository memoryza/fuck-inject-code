(function() {
  const ls = window.localStorage;
  let ruleList = JSON.parse(ls.getItem('_fuck_inject_rule_list')) || [];
  const event = {
    init: function() {
      const addRule = '<div class="add"><input id="rule" placeholder="添加规则串or正则表达式" /><label><input id="isReg" type="checkbox">正则</label><button id="addRule">添加</button><div>';
      $('#root').html(`<ul id="ruleList">${event.getRuleListHtml()}</ul>${addRule}`);
    },
    updateList: function() {
      $('#ruleList').html(event.getRuleListHtml());
    },
    getRuleListHtml: function() {
      return ruleList.map(item => {
        return `<li><input class="rule_name" disabled value="${item.name}"/><label><input disabled class="is_reg" type="checkbox" ${item.checked ? 'checked="checked"' : ''}>正则</label><button class="remove_rule" ruleid="${item.id}">删除</button></li>`
      }).join('');
    },
    setRule: function(list = []) {
      ls.setItem('_fuck_inject_rule_list', JSON.stringify(list));
      sendMessageToContentScript({ cmd: 'fuckinjectcode', list: JSON.stringify(list) }, function (response) { });
    },
    addRule: function () {
      const rule = $.trim($('#rule').val());
      const isReg = $('#isReg').attr('checked') === 'checked';
      if (rule) {
        ruleList.push({
          name: isReg ? rule.substr(1, rule.length - 2) : rule,
          checked: isReg,
          id: ruleList.length ? ruleList[ruleList.length - 1].id + 1 : 0,
        });
        $('#rule').val('');
        $('#isReg').removeAttr('checked');
        event.setRule(ruleList);
        event.updateList();
      }
    },
    removeRule() {
      const id = parseInt($(this).attr('ruleid'));
      ruleList = ruleList.filter(item => item.id != id);
      event.setRule(ruleList);
      event.updateList();
    }
  };
  $('#root')
    .on('click', '#addRule', event.addRule)
    .on('click', '.remove_rule', event.removeRule);

  event.init();
  function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (callback) callback(tabs.length ? tabs[0].id : null);
    });
  }
  function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
      var port = chrome.tabs.connect(tabId, { name: 'connectToPage' });
      port.postMessage(message);
    });
  }
})();