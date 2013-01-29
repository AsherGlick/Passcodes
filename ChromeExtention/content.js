var __passcodes__target = null;
var __passcodes__passcode = 

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        __passcodes__target = event.target;
    }
}, true);
 
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

		if(request.request == "__passcod.es__getTarget") {
			sendResponse({responce:removeSubdomain()});
			console.log("HELLO");

			//var txtarea = __passcodes__target;
			
		}
		if (request.request == "__passcod.es__setTarget") {
			var text = "Test text";

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