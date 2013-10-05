// The generate function obtains the doman and password text boxes  from the HTML document, concatinates them and
// then retuns a string of hex characters representing the hash
function generatePassword() {
	var password = document.getElementById('masterPassword').value;
	var website = document.getElementById('website').value.toLowerCase();
	var prehash = website+password;
	var hash = CryptoJS.SHA256(prehash) + "";
	return hexToBase64(hash).substring(0,16);
}

// This function is badly named and will probably be removed / inlined becasue all it does in the web interface
// is convert the domain to lowercase, in the chrome plugin it will also give a suggested domain name using the
// commented out schema within this function
// Soon to be Chrome plugin only
function removeSubdomain (fullurl) {
	var domain = fullurl;
	/*var domainParts = fullurl.split('.');
	if (domainParts.length > 1) {
		domain = domainParts[domainParts.length-2];
		if (domain == 'co') {
			domain = domainParts[domainParts.length-3];
		}
	}*/
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


// This function takes an integer and converts it into a base64 character, no input sanitization is done to make sure the integer is within bounds
function decimalToBase64(decimalValue) {
	var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#';
	return base64[decimalValue];
}

/******************************** HEX TO BASE64 *******************************\
| This function takes in a string of hex characters and converts it to a       |
| string of base64 characters. It is able to take in any number of hex         |
| characters even if they are not an even number of characters (or dont        |
| create a full byte)                                                          |
\******************************************************************************/
function hexToBase64(hexString) {
	alert(hexString);
	var decimalArray = hexToDecimalArray(hexString);
	var base64string = "";

	for (var i = 0; i < decimalArray.length; i+=3){ 
		// If this is the only element in this group of three
		if (decimalArray.length == i+1) {
			base64string += decimalToBase64(decimalArray[i] * 4);
			base64string += '='; // append = to the end of the string to represent the missing bits
		}
		// If there are only two elements in this group of three
		else if (decimalArray.length == i+2) {
			var leftSplit = Math.floor(decimalArray[i+1]/4);
			var rightSplit = decimalArray[i+1]%4;
			//gets two == 
			base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
			base64string += decimalToBase64( rightSplit * 16);
			base64string += "=="; // append == to the end of the string to represent the missing bits
		}
		// If there are all three elementsin this group of three
		else {
			var leftSplit = Math.floor(decimalArray[i+1]/4);
			var rightSplit = decimalArray[i+1]%4;
			base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
			base64string += decimalToBase64(rightSplit * 16 + decimalArray[i+2]);
		}
	}
	return base64string;
}

// LEGACY CODE FOR THE ORIGINAL HEXIDECIMAL TO BASE64 CONVERTER //
// This outdated conversion function should no longer be used and is only here until it gets moved to the
// legacy folder 
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

/******************************** SHOW PASSWORD *******************************\
| This function is called by the form when it is submitted. It calls the       |
| generate password function then displays the results of that function in a   |
| newly shown div with the contents selected. This function is unique to the   |
| web interface and not used in the browser plugin.                            |
\******************************************************************************/
function showPassword() {
	var target = document.getElementById("outbox");
	target.innerHTML = generatePassword();
	target.style.display="block";
	selectHash(target);
}

/********************************* SELECT HASH ********************************\
| This function selects the contents of an HTML element for the ease of the    |
| user. Once it is selected the user can simply copy the password with a       |
| shortcut and have it in their clipboard. This function is unique to the web  |
| interface and not used in the browser plugin.                                |
\******************************************************************************/
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
