/********************************** SIGNATURE *********************************\
|                                      ,,                                      |
|                     db             `7MM                                      |
|                    ;MM:              MM                                      |
|                   ,V^MM.    ,pP"Ybd  MMpMMMb.  .gP"Ya `7Mb,od8               |
|                  ,M  `MM    8I   `"  MM    MM ,M'   Yb  MM' "'               |
|                  AbmmmqMA   `YMMMa.  MM    MM 8M""""""  MM                   |
|                 A'     VML  L.   I8  MM    MM YM.    ,  MM                   |
|               .AMA.   .AMMA.M9mmmP'.JMML  JMML.`Mbmmd'.JMML.                 |
|                                                                              |
|                                                                              |
|                                  ,,    ,,                                    |
|                      .g8"""bgd `7MM    db        `7MM                        |
|                    .dP'     `M   MM                MM                        |
|                    dM'       `   MM  `7MM  ,p6"bo  MM  ,MP'                  |
|                    MM            MM    MM 6M'  OO  MM ;Y                     |
|                    MM.    `7MMF' MM    MM 8M       MM;Mm                     |
|                    `Mb.     MM   MM    MM YM.    , MM `Mb.                   |
|                      `"bmmmdPY .JMML..JMML.YMbmd'.JMML. YA.                  |
|                                                                              |
\******************************************************************************/
/*********************************** LICENSE **********************************\
| Copyright (c) 2013, Asher Glick                                              |
| All rights reserved.                                                         |
|                                                                              |
| Redistribution and use in source and binary forms, with or without           |
| modification, are permitted provided that the following conditions are met:  |
|                                                                              |
| * Redistributions of source code must retain the above copyright notice,     |
|   this list of conditions and the following disclaimer.                      |
| * Redistributions in binary form must reproduce the above copyright notice,  |
|   this list of conditions and the following disclaimer in the documentation  |
|   and/or other materials provided with the distribution.                     |
|                                                                              |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"  |
| AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE    |
| IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE   |
| ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE    |
| LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR          |
| CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF         |
| SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS     |
| INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN      |
| CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)      |
| ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE   |
| POSSIBILITY OF SUCH DAMAGE.                                                  |
\******************************************************************************/

/****************************** GENERATE PASSWORD *****************************\
| The generate password function grabs the values of the text boxes the user   |
| entered and preforms all of the hashing an manipulation algorithms needed    |
| to produce a 16 character long base64 password.                              |
\******************************************************************************/
function generatePassword() {
	var password = document.getElementById('masterPassword').value;
	var website = document.getElementById('website').value.toLowerCase();
	var prehash = website+password;
	var hash = CryptoJS.SHA256(prehash) + "";
	return hexToBase64(hash).substring(0,16);
}

/**************************** HEX TO DECIMAL ARRAY ****************************\
| The hex to decimal array function takes in a string of hex characters and    |
| returns an array of integers containing the decimal equivelent of each hex   |
| character in the string. The string and the decimal array are both read      |
| left to right (0-n)                                                          |
\******************************************************************************/
function hexToDecimalArray(hexString) {
	var hex = '0123456789abcdef';
	var decimalArray = []
	for (var i = 0; i < hexString.length; i++) {
		decimalArray.push(hex.indexOf(hexString[i]));
	}
	return decimalArray;
}

/****************************** DECIMAL TO BASE64 *****************************\
| This function takes a single decimal value and converts it to a single base  |
| 64 character. It does no input sanitization and if the decimal value is out  |
| of bounds then it will cause a problem without raising exceptions            |
\******************************************************************************/
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
