// this page runs all the script that should be run on onload but cant becasue this is a chrome plugin
var port = chrome.extension.connect({name: "popupConnection"});

port.postMessage({query:"domain"}); // request the domain from the tab

port.onMessage.addListener(function(msg) {
  if (msg.query == "domain")
    // set domain to msg.responce
  else if (msg.query == "done")
  	//sucessfully recived master password
  	// close popup
 });


document.getElementById('form').onsubmit = function() { port.postMessage({'password':generatePassword()})};
