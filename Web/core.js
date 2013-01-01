function generate() {
	var password = document.getElementById('masterPassword').value;
	var website = removeSubdomain(document.getElementById('website').value);
	var prehash = website+password;
	var hash = CryptoJS.SHA256(prehash) + "";
	return hash;
}

function removeSubdomain (fullurl) {
	var domainParts = fullurl.split('.');
	var domain = domainParts[domainParts.length-2];
	if (domain == 'co') {
		domain = domainParts[domainParts.length-3];
	}
	return domain;
}

function hexToBase64(hexString) {
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
	document.getElementById("outbox").innerHTML = hexToBase64(generate()).substring(0,16);
	document.getElementById("outbox").style.display="block";
}