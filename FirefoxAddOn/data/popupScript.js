// This script is used by the popup window that is brought up when the context menu is clicked

// Send a request to the backend script asking for the id of the tab that opened this popup
// chrome.extension.sendMessage({request: "tabid"}, connectToTab);

// var targetTabId = null;


// /******************************* CONNECT TO TAB *******************************\
// | This function is called when the backed returns with a tab id. It sends a    |
// | message to the tab asking for the domain that is exists in. When it          |
// | recieves the domain it sets the domain value of the text box and sets the    |
// | password box to have focus                                                   |
// \******************************************************************************/
// function connectToTab(tabid) {
// 	console.log("got the tab id" + tabid);
// 	// this page runs all the script that should be run on onload but cant becasue this is a chrome plugin

// 	targetTabId = tabid;

// 	// request the domain for the target page, and tell the page to save the currently selected textbox
// 	chrome.tabs.sendRequest(targetTabId, {request:"__passcod.es__getTarget"}, function(target) {
// 		document.getElementById("website").value = target.responce;
// 		document.getElementById("masterPassword").focus();
// 		console.log("got responce");
// 	});

// 	console.log("SENT MESSAGE");
// }

/****************************** PASSWORD COMPLETE *****************************\
| This listens for when the user submits the password form, by hitting enter   |
| or clicking the submit button. When they do it generates the password        |
| function from the core.js file, which grabs the username and password from   |
| the text boxes. Then sends the generated password to the tab that called     |
| this popup to have it insert into the page                                   |
\******************************************************************************/
//console.log("Entered PopupScript");
document.getElementById('form').onsubmit = function() {
	try {
		self.port.emit("__passcod.es__result", generatePassword());
		//console.log("Text sumbitted");
	}
	catch (err) {
		//console.log("ERROR: "+err);
	}
};
self.port.on("__passcod.es__showPanel", function (domain) {
	if (domain == "") {
		document.getElementById("website").focus();
	}
	else {
		document.getElementById("website").value = domain;
		document.getElementById("masterPassword").focus();
	}
	//console.log("SHOWN!");
});
//console.log("Parsed PopupScript");