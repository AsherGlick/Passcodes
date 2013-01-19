var __passcodes__target = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        __passcodes__target = event.target;
    }
}, true);
 
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {

			// find the highest z value to make the menu apear one higher

			function findHighestZIndex(elem)
			{
			  var elems = document.getElementsByTagName(elem);
			  var highest = 0;
			  for (var i = 0; i < elems.length; i++)
			  {
			    var zindex=document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index");
			    if ((zindex > highest) && (zindex != 'auto'))
			    {
			      highest = zindex;
			    }
			  }
			  return highest;
			}

			var dimmer = document.createElement("div");
			dimmer.style.width="100%";
			dimmer.style.height="100%";
			dimmer.style.background="rgba(204,204,204,.5)";
			dimmer.style.zIndex=""+(findHighestZIndex("div")+1);
			dimmer.style.position="absolute";
			dimmer.style.top="0px";
			dimmer.style.left="0px";
			

			var documentValues = "";
			for (var i in document) {
				documentValues+=i+":"+document[i]+"\n";
			}
			console.log(documentValues);

			document.body.appendChild(dimmer);

			alert("hello");
		
		/*
		if(request == "__passcod.es__getTarget") {
			sendResponse({});

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
		}*/
	}
);