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
		// calculate the hash functions
		function generate() {
			var password = document.getElementById('__passcodes__masterPassword').value;
			var website = document.getElementById('__passcodes__website').value.toLowerCase();
			var prehash = website+password;
			var hash = CryptoJS.SHA256(prehash) + "";
			return hexToBase64(hash).substring(0,16);
		}

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
		

		// Returns an array of numbers between 0 and 15 //
		function hexToDecimalArray(hexString) {
			var hex = '0123456789abcdef';
			var decimalArray = []
			for (var i = 0; i < hexString.length; i++) {
				decimalArray.push(hex.indexOf(hexString[i]));
			}
			return decimalArray;
		}

		function decimalToBase64(decimalValue) {
			var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#';
			return base64[decimalValue];
		}

		

		function hexToBase64(hexString) {

			alert(hexString);
			var decimalArray = hexToDecimalArray(hexString);

			var base64string = "";
			for (var i = 0; i < decimalArray.length; i+=3){
				if (decimalArray.length == i+1) {
					// This is the last element

					// this element shifted left two (*4)
					// one '=' get appended to the end
					base64string += decimalToBase64(decimalArray[i] * 4);
					base64string += '=';

				}
				else if (decimalArray.length == i+2) {
					// there is a second element to split
					var leftSplit = Math.floor(decimalArray[i+1]/4);
					var rightSplit = decimalArray[i+1]%4;

					//gets two == 

					base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
					base64string += decimalToBase64( rightSplit * 16);
					base64string += "==";
				}
				else { // continue normally
					var leftSplit = Math.floor(decimalArray[i+1]/4);
					var rightSplit = decimalArray[i+1]%4;

					//gets two == 

					base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
					base64string += decimalToBase64( rightSplit * 16 + decimalArray[i+2] );
				}
			}


			return base64string;
		}


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


		function createPasswordBox() {
			var dimmer = document.createElement("div");
			dimmer.style.width="100%";
			dimmer.style.height="100%";
			dimmer.style.background="rgba(204,204,204,.5)";
			dimmer.style.zIndex=""+(findHighestZIndex("div")+1);
			dimmer.style.position="fixed";
			dimmer.style.top="0px";
			dimmer.style.left="0px";


				
			var html = ""
			html += "<style>";
			html += "#__passcodes__content {}"
			html += "#__passcodes__content .__passcodes__content{background-color: #999;border-radius: 5px;padding: 5px;width: 200px;margin-left: auto;margin-right: auto;margin-top: 100px; font-family: sans-serif;}";
			html += "#__passcodes__content .__passcodes__button{border-radius: 3px;background-color: #DDD;cursor:pointer;padding: 10px;border: 1px solid #CCC;margin: 0px;width: 100%;-webkit-appearance: none;}";
			html += "#__passcodes__content .__passcodes__button:hover{background-color: #CCC;}";
			html += "#__passcodes__content .__passcodes__textbox {border-radius: 3px;padding: 10px;border: 0px;width: 100% !important;margin: 0px;outline: none;margin-bottom: 2px;border: 1px solid #CCC; box-sizing: border-box;}";
			html += "</style>";
			html += '<div id="__passcodes__content" style="position:static; background: #F00"> <div class="__passcodes__content" > <form name="passcodesInput" action="javascript:showHash();" method="post" style="margin:0px">';
			html += '<input class="__passcodes__textbox" type="textbox" id="__passcodes__website" placeholder="Website" autocomplete="off"/> <br />';
			html += '<input class="__passcodes__textbox" type="password" id="__passcodes__masterPassword" placeholder="Password" autocomplete="off"/> <br />';
			html += '<input class="__passcodes__button" type="submit" value="Generate" />';
			html += '</form> </div> </div>';

			//alert(document.getElementById("__passcodes__website").style)

			dimmer.innerHTML = html;

			dimmer.onclick= function(e) {
				//alert("CLICKED");
				//document.body.removeChild(this);
			}

			document.body.appendChild(dimmer);
			document.getElementById('__passcodes__website').value = removeSubdomain();
			document.getElementById('__passcodes__masterPassword').focus();
		}
		
		if(request == "__passcod.es__getTarget") {
			sendResponse({});
			console.log("HELLO");
			//chrome.browserAction.onClicked.addListener(function() {
   				
			//});

			/*var text = "Test text";

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
		    txtarea.scrollTop = scrollPos;*/
		}
	}
);