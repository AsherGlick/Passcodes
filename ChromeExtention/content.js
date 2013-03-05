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
 
/****************************** REQUEST LISTENER ******************************\
| This request listener waits for requests from the passcodes popup. The       |
| first request it recieves is the 'getTarget' request which returns the       |
| domain of the current tab after passing it through the removeSubdomain       |
| function. The second request it recieves is the 'setTarget' request which    |
| is also bundled with the generated password that the page will insert into   |
| the passcodes target.                                                        |
\******************************************************************************/
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {

		// the remove subdomain function is used to return the domain to the popup
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
		console.log("got message");

		// Get Target Request
		// The get target request returns the domain / url of the active tab
		if(request.request == "__passcod.es__getTarget") {
			sendResponse({responce:removeSubdomain()});
			console.log("HELLO");			
		}

		// Set Target Request
		// The set target request is passed the password, genereated from the popup
		// it then inserted into the editable area that was last selected
		if (request.request == "__passcod.es__setTarget") {
			var text = request.password;

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
		}

	}
);