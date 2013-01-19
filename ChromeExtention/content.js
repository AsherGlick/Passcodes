var __passcodes__target = null;

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
			var password = document.getElementById('masterPassword').value;
			var website = document.getElementById('website').value.toLowerCase();
			var prehash = website+password;
			var hash = CryptoJS.SHA256(prehash) + "";
			return hexToBase64(hash).substring(0,16);
		}

		function removeSubdomain () {
			var domain = document.URL;
			var domainParts = fullurl.split('.');
			if (domainParts.length > 1) {
				domain = domainParts[domainParts.length-2];
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

		/*
		CryptoJS v3.1.2
		code.google.com/p/crypto-js
		(c) 2009-2013 by Jeff Mott. All rights reserved.
		code.google.com/p/crypto-js/wiki/License
		*/
		(function(k){for(var g=CryptoJS,h=g.lib,v=h.WordArray,j=h.Hasher,h=g.algo,s=[],t=[],u=function(q){return 4294967296*(q-(q|0))|0},l=2,b=0;64>b;){var d;a:{d=l;for(var w=k.sqrt(d),r=2;r<=w;r++)if(!(d%r)){d=!1;break a}d=!0}d&&(8>b&&(s[b]=u(k.pow(l,0.5))),t[b]=u(k.pow(l,1/3)),b++);l++}var n=[],h=h.SHA256=j.extend({_doReset:function(){this._hash=new v.init(s.slice(0))},_doProcessBlock:function(q,h){for(var a=this._hash.words,c=a[0],d=a[1],b=a[2],k=a[3],f=a[4],g=a[5],j=a[6],l=a[7],e=0;64>e;e++){if(16>e)n[e]=
		q[h+e]|0;else{var m=n[e-15],p=n[e-2];n[e]=((m<<25|m>>>7)^(m<<14|m>>>18)^m>>>3)+n[e-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+n[e-16]}m=l+((f<<26|f>>>6)^(f<<21|f>>>11)^(f<<7|f>>>25))+(f&g^~f&j)+t[e]+n[e];p=((c<<30|c>>>2)^(c<<19|c>>>13)^(c<<10|c>>>22))+(c&d^c&b^d&b);l=j;j=g;g=f;f=k+m|0;k=b;b=d;d=c;c=m+p|0}a[0]=a[0]+c|0;a[1]=a[1]+d|0;a[2]=a[2]+b|0;a[3]=a[3]+k|0;a[4]=a[4]+f|0;a[5]=a[5]+g|0;a[6]=a[6]+j|0;a[7]=a[7]+l|0},_doFinalize:function(){var d=this._data,b=d.words,a=8*this._nDataBytes,c=8*d.sigBytes;
		b[c>>>5]|=128<<24-c%32;b[(c+64>>>9<<4)+14]=k.floor(a/4294967296);b[(c+64>>>9<<4)+15]=a;d.sigBytes=4*b.length;this._process();return this._hash},clone:function(){var b=j.clone.call(this);b._hash=this._hash.clone();return b}});g.SHA256=j._createHelper(h);g.HmacSHA256=j._createHmacHelper(h)})(Math);


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

		//alert("hello");
		
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