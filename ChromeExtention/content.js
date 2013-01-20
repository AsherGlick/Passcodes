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

		/*
		CryptoJS v3.1.2
		code.google.com/p/crypto-js
		(c) 2009-2013 by Jeff Mott. All rights reserved.
		code.google.com/p/crypto-js/wiki/License
		*/
		var CryptoJS=CryptoJS||function(h,s){var f={},t=f.lib={},g=function(){},j=t.Base={extend:function(a){g.prototype=this;var c=new g;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
		q=t.WordArray=j.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||u).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
		32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=j.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new q.init(c,a)}}),v=f.enc={},u=v.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
		2),16)<<24-4*(b%8);return new q.init(d,c/2)}},k=v.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new q.init(d,c)}},l=v.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
		x=t.BufferedBlockAlgorithm=j.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=l.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var m=0;m<a;m+=e)this._doProcessBlock(d,m);m=d.splice(0,a);c.sigBytes-=b}return new q.init(m,b)},clone:function(){var a=j.clone.call(this);
		a._data=this._data.clone();return a},_minBufferSize:0});t.Hasher=x.extend({cfg:j.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){x.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new w.HMAC.init(a,
		d)).finalize(c)}}});var w=f.algo={};return f}(Math);
		(function(h){for(var s=CryptoJS,f=s.lib,t=f.WordArray,g=f.Hasher,f=s.algo,j=[],q=[],v=function(a){return 4294967296*(a-(a|0))|0},u=2,k=0;64>k;){var l;a:{l=u;for(var x=h.sqrt(l),w=2;w<=x;w++)if(!(l%w)){l=!1;break a}l=!0}l&&(8>k&&(j[k]=v(h.pow(u,0.5))),q[k]=v(h.pow(u,1/3)),k++);u++}var a=[],f=f.SHA256=g.extend({_doReset:function(){this._hash=new t.init(j.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],m=b[2],h=b[3],p=b[4],j=b[5],k=b[6],l=b[7],n=0;64>n;n++){if(16>n)a[n]=
		c[d+n]|0;else{var r=a[n-15],g=a[n-2];a[n]=((r<<25|r>>>7)^(r<<14|r>>>18)^r>>>3)+a[n-7]+((g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10)+a[n-16]}r=l+((p<<26|p>>>6)^(p<<21|p>>>11)^(p<<7|p>>>25))+(p&j^~p&k)+q[n]+a[n];g=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&m^f&m);l=k;k=j;j=p;p=h+r|0;h=m;m=f;f=e;e=r+g|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+m|0;b[3]=b[3]+h|0;b[4]=b[4]+p|0;b[5]=b[5]+j|0;b[6]=b[6]+k|0;b[7]=b[7]+l|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
		d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=g.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=g._createHelper(f);s.HmacSHA256=g._createHmacHelper(f)})(Math);


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