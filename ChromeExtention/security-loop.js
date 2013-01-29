
chrome.extension.sendMessage({request: "tabid"}, connectToTab);

var targetTabId = null;

function connectToTab(tabid) {
	console.log("got the tab id" + tabid);
	// this page runs all the script that should be run on onload but cant becasue this is a chrome plugin
	
	targetTabId = tabid;

	// request the domain for the target page, and tell the page to save the currently selected textbox
	chrome.tabs.sendRequest(targetTabId, {request:"__passcod.es__getTarget"}, function(target) {
		document.getElementById("website").value = target.responce;
		console.log("got responce");
	});

	console.log("SENT MESSAGE");

	/*
	var port = chrome.extension.connect(tabid, {name: "contentConnection"});
	port.postMessage({query:"domain"}); // request the domain from the tab
	port.onMessage.addListener(function(msg) {
		console.log("Got mesage Back")
		if (msg.query == "domain"){
			// set domain to msg.responce
			console.log("HELLO");
			document.getElementById("website").value = msg.responce;
		}else if (msg.query == "done"){
			//sucessfully recived master password
	 		// close popup
	 	}
	 });
	*/
}


document.getElementById('form').onsubmit = function() {
	chrome.tabs.sendRequest(targetTabId, {request:"__passcod.es__setTarget",password:generatePassword()}, function(target) {
		console.log("Done");
		// close popup
		self.close();
	});
};
document.getElementById("website").value = "lala";