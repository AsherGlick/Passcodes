var __passcodes__target = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        __passcodes__target = event.target;
    }
}, true);


chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if(request == "__passcod.es__getTarget") {
			sendResponse({});

			var text = "Test text";

			// run all code here
			var txtarea = __passcodes__target;
		    var scrollPos = txtarea.scrollTop;
		    var strPos = 0;
		    /*var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
		        "ff" : (document.selection ? "ie" : false ) );
		    if (br == "ie") {
		    	alert("IE");
		        txtarea.focus();
		        var range = document.selection.createRange();
		        range.moveStart ('character', -txtarea.value.length);
		        strPos = range.text.length;
		    }
		    else if (br == "ff") {
		    	alert("FF");*/
		    	strPos = txtarea.selectionStart;
		    //}

		    //alert(scrollPos + ":" + strPos);

		    var front = (txtarea.value).substring(0,strPos);  

		    

		    var back = (txtarea.value).substring(strPos,txtarea.value.length); 


		    //alert("HELLO");

		    txtarea.value=front+text+back;
		    strPos = strPos + text.length;
		    /*if (br == "ie") { 
		        txtarea.focus();
		        var range = document.selection.createRange();
		        range.moveStart ('character', -txtarea.value.length);
		        range.moveStart ('character', strPos);
		        range.moveEnd ('character', 0);
		        range.select();
		    }
		    else if (br == "ff") {*/
		        txtarea.selectionStart = strPos;
		        txtarea.selectionEnd = strPos;
		        txtarea.focus();
		    //}
		    txtarea.scrollTop = scrollPos;
		}
	}
);


function insertAtCaret(text) {
    //var txtarea = document.getElementById(areaId);

    var textarea = document.activeElement;
    
}