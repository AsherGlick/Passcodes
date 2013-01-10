
function generate() {
	var password = document.getElementById('masterPassword').value;
	var website = removeSubdomain(document.getElementById('website').value);
	var prehash = website+password;
	var hash = CryptoJS.SHA256(prehash) + "";
	return hash;
}

function removeSubdomain (fullurl) {
	var domainParts = fullurl.split('.');
	var domain = fullurl;
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

function hexToBase64(hexString) {
	
	alert (hexString);

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

	alert( base64string );

	return base64string;
}

// LEGACY CODE FOR THE ORIGINAL HEXIDECIMAL TO BASE64 CONVERTER //
function hexToBase64Legacy(hexString) {
	var hex = '0123456789abcdef';
	// Base 64 symbols are normaly + and / but ! and # seemed better for passwords
	var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#';
	// Convert each character of the hex string into a decimal number to compute
	var decimalArray = []
	for (var i = 0; i < hexString.length; i++) {
		decimalArray.push(hex.indexOf(hexString[i]));
	}
	// squish each decimal number into a 6 bit number from two 4 bit numbers
	var base64array = []
	for (var i = 0; i < decimalArray.length; i+=2) {
		base64array.push(decimalArray[i] + 16 * (decimalArray[i+1]%4));
	}
	// Convert the array back into ascii characters
	var base64String = "";
	for (var i in base64array) {
		base64String+=base64[base64array[i]]
	}
	return base64String;
}

function showHash() {
	var target = document.getElementById("outbox");
	target.innerHTML = hexToBase64(generate()).substring(0,16);
	target.style.display="block";
	selectHash(target);
}

function selectHash(target) {
	if (document.selection) {
		document.selection.empty();
		var range = document.body.createTextRange();
		range.moveToElementText(target);
		range.select();
	}
	else if (window.getSelection) {
		window.getSelection().removeAllRanges();
		var range = document.createRange();
		range.selectNode(target);
		window.getSelection().addRange(range);
	}
}
