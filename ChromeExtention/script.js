var passwordGenerator = chrome.contextMenus.create({"title":"Fill In Passcode Here", "contexts":["all"],"onclick":startPasscodes});

function startPasscodes(info, tab) {
		//insertAtCaret("HELLO");
		alert(JSON.stringify(info));
		//alert(JSON.stringify(tab));
		//background
    chrome.tabs.sendRequest(tab.id, "__passcod.es__getTarget", function(target) {
        alert(target);
    });
}