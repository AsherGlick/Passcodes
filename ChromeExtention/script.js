var passwordGenerator = chrome.contextMenus.create({"title":"Fill In Passcode Here", "contexts":["all"],"onclick":startPasscodes});

function startPasscodes(info, tab) {
		//insertAtCaret("HELLO");
		//alert(JSON.stringify(info));
		//alert(JSON.stringify(tab));
		//background
    chrome.tabs.sendRequest(tab.id, "__passcod.es__getTarget", function(target) {
        //alert(target);
        // var tabsWindow = chrome.windows.get(tab.windowId);
        // console.log(tabsWindow); 
        // var xcoord = 900;//tabsWindow.left + tabsWindow.width/2;
        // var ycoord = 500;
        // chrome.windows.create({'url': 'http://passcod.es', 'type': 'popup', 'width':300, 'height':200});

        //console.log("CLICKED");

        var w = 440;
        var h = 420;
        var left = (screen.width/2)-(w/2);
        var top =(screen.height/2)-(h/2); 



        var newpopup = chrome.windows.create({'url': 'popup.html','focused':true ,'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
        });
        console.log(newpopup);


    });
}


// Listen for a connection from the popup asking for informaion
chrome.extension.onConnect.addListener(function(port) {
  console.assert(port.name == "popupConnection");
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});