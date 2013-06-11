// This code is injected into every webpage that is opened
// it saves the last clicked element so passcodes knows where to put the password
// after it has been generated

/*************************** TARGET ELEMENT LISTENER **************************\
| This listsner checks for every right click (context menu opening click) on   |
| the page and saves the element that was last clicked as the target for       |
| passcodes                                                                    |
\******************************************************************************/
var __passcodes__target = null;
document.addEventListener("mousedown", function(event){
	// Check right click
	if(event.button == 2) {
		__passcodes__target = event.target;
	}
}, true);

/*
self.on("message", function(message) {
	var text = message;

	var txtarea = node;
	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	strPos = txtarea.selectionStart;

	var front = (txtarea.value).substring(0,strPos);
	var back = (txtarea.value).substring(strPos,txtarea.value.length);

	txtarea.value=front+text+back;
	strPos = strPos + text.length;

	txtarea.selectionStart = strPos;
	txtarea.selectionEnd = strPos;
	txtarea.focus();
	txtarea.scrollTop = scrollPos;
});
*/

function removeSubdomain () {
	var url = document.URL;
	var splitSlashes = url.split('/');
	if (splitSlashes.length > 1) url = splitSlashes[2];
	var domainParts = url.split('.');
	var domain = url;
	if (domainParts.length > 1) {
		domain = domainParts[domainParts.length-2];
		//alert (domain);
		if (domain == 'co') {
			domain = domainParts[domainParts.length-3];
		}
	}
	return domain.toLowerCase();
}

self.port.on("__passcod.es__getTarget", function() {
	console.log("GET TARGET REQUEST");
  self.port.emit("__passcod.es__target", removeSubdomain());
});


self.port.on("__passcod.es__setTarget", function(password) {
	console.log("SET TARGET REQUEST");
	var text = password;

	// run all code here
	var txtarea = __passcodes__target;
	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	strPos = txtarea.selectionStart;

	var front = (txtarea.value).substring(0,strPos);
	var back = (txtarea.value).substring(strPos,txtarea.value.length);

	txtarea.value=front+text+back;
	strPos = strPos + text.length;

	txtarea.selectionStart = strPos;
	txtarea.selectionEnd = strPos;
	txtarea.focus();
	txtarea.scrollTop = scrollPos;
});
