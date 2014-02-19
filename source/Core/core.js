/* {{AMASSITE-SCRIPT}} */
// Allow automatic minification of code for web with Amassite Script
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

function getUsername() {
	return document.getElementById('masterPassword').value;
}

function getDomain() {
	return document.getElementById('website').value.toLowerCase();
}

/****************************** GENERATE PASSWORD *****************************\
| The generate password function grabs the values of the text boxes the user   |
| entered and preforms all of the hashing an manipulation algorithms needed    |
| to produce a 16 character long base64 password.                              |
\******************************************************************************/
// function generatePassword(password, website) {
// 	var prehash = website+password;

// 	var hash = CryptoJS.SHA256(prehash) + "";
// 	var hash = prehash
// 	return hexToBase64(hash).substring(0,16);
// }



function generatePassword(password, website) {
	var prehash = ""+website+password;

	var ITERATIONCOUNT = 1000000;


	while(true) {

	}
}

  //////////////////////////////////////////////////////////////////////////////
 ///////////////////////// BASE CONVERSION FUNCTIONS ////////////////////////// 
//////////////////////////////////////////////////////////////////////////////  

/******************************** HEX TO BASE64 *******************************\
| This function takes in a string of hex characters and converts it to a       |
| string of base64 characters. It is able to take in any number of hex         |
| characters even if they are not an even number of characters (or dont        |
| create a full byte)                                                          |
\******************************************************************************/
function hexToBase64(hexString) {
	var decimalArray = hexToDecimalArray(hexString);
	var base64string = "";

	for (var i = 0; i < decimalArray.length; i+=3){
		// If this is the only element in this group of three
		if (decimalArray.length == i+1) {
			base64string += decimalToBase64(decimalArray[i] * 4);
			base64string += '='; // append = to the end of the string to represent the missing bits
		}
		
		else if (decimalArray.length == i+2) {
			var leftSplit = Math.floor(decimalArray[i+1]/4);
			var rightSplit = decimalArray[i+1]%4;
			//gets two == 
			base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
			base64string += decimalToBase64( rightSplit * 16);
			base64string += "=="; // append == to the end of the string to represent the missing bits
		}
		// If there are all three elements in this group of three
		else {
			var leftSplit = Math.floor(decimalArray[i+1]/4);
			var rightSplit = decimalArray[i+1]%4;
			base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
			base64string += decimalToBase64(rightSplit * 16 + decimalArray[i+2]);
		}
	}
	return base64string;
}

/**************************** HEX TO DECIMAL ARRAY ****************************\
| The hex to decimal array function takes in a string of hex characters and    |
| returns an array of integers containing the decimal equivelent of each hex   |
| character in the string. The string and the decimal array are both read      |
| left to right (0-n)                                                          |
\******************************************************************************/
function hexToDecimalArray(hexString) {
	var hex = '0123456789abcdef';
	var decimalArray = [];
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

  //////////////////////////////////////////////////////////////////////////////
 /////////////// FUNCTIONS THAT SHOULD BE MOVED TO ANOTHER FILE /////////////// 
//////////////////////////////////////////////////////////////////////////////  

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

    ////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////// 
  ///////////////////// NEW FUNCTIONS FOR BETTER AWESOME /////////////////////  
 ////////////////////////////////////////////////////////////////////////////   
////////////////////////////////////////////////////////////////////////////    


  //////////////////////////////////////////////////////////////////////////////
 //////////////////////// BASE MODIFICATION FUNCTIONS ///////////////////////// 
//////////////////////////////////////////////////////////////////////////////  

/************************** CALUCLATE NEW BASE LENGTH *************************\
| This function calculates the maximum number of digits that can be in a       |
| number of a given base given the number of digits it is in another base.     |
| Arguments:
| 
\******************************************************************************/
function calculateNewBaseLength(oldBase, oldBaseLength, newBase) {
    var logOldBase = Math.log(oldBase);
    var logNewBase = Math.log(newBase);
    var newBaseLength = oldBaseLength * (logOldBase/logNewBase);
    var intNewBaseLength = Math.floor(newBaseLength);
    if (newBaseLength > intNewBaseLength) { intNewBaseLength += 1; } // round up
    return intNewBaseLength;
}

/********************************* TRIM NUMBER ********************************\
| This function takes in a vector representing a multi digit number and        |
| removes all of the preceding zero value digits returning a vector of only    |
| meaningful digits.                                                           |
| Arguments:                                                                   |
|   Array of numbers with leading zeros                                        |
| Returns:                                                                     |
|   Array of numbers with no leaning zeros                                     |
| Examples:                                                                    |
|   trimNumber([0,0,0,5,6,1,0])                                      [5,6,1,0] |
|   trimNumber([9,1,6,0,0,0])                                    [9,1,6,0,0,0] |
|   trimNumber([0,0,0,0,0])                                                 [] |
\******************************************************************************/
function trimNumber(numberArray) {
    for (var i = 0; i < numberArray.length; i++) {
        if (numberArray[i] !== 0) {
            break;
        }
    }
    return numberArray.slice(i);
}

/******************************* TEN IN OLD BASE ******************************\
| This function converts the value of the old base to it's equivilant value    |
| in the new base. This is used when calulating the effect each digit of the   |
| old base has on each digit of the new base.                                  |
| Arguments:                                                                   |
|   oldbase - the base of the previous number                                  |
|   newbase - the base of the new number                                       |
| Retuns:                                                                      |
|   array of digits containingWhat 10 in the old base would be equivilent to   |
|     in the new base                                                          |
| Examples:                                                                    |
|   tenInOldBase(2,10)                                                     [2] |
|   tenInOldBase(10,2)                                               [1,0,1,0] |
|   tenInOldbase(999,16)                                              [3,14,7] |
\******************************************************************************/
function tenInOldBase(oldBase, newBase) {
    var newBaseLength = calculateNewBaseLength(oldBase, 2, newBase);
    var maxLength = newBaseLength>2?newBaseLength:2;

    var newNumber = Array.apply(null, new Array(maxLength)).map(Number.prototype.valueOf,0);

    var currentNumber = oldBase;
    for (var i = maxLength-1; i >=0; i--) {
        newNumber[i] = currentNumber % newBase;
        currentNumber = Math.floor(currentNumber / newBase);
    }

    newNumber = trimNumber(newNumber);
    return newNumber;
}

/*************************** MULTIPLY ARBITRARY BASE **************************\
| This function takes two numbers that are the same arbitrary base and         |
| multiplies them together returning a vector containing the product of the    |
| two numbers in the same base that they were originally in                    |
| Arguments:                                                                   |
|   base - the current base in which we are multiplying numbers in             |
|   firstNumber - an array containing the digits of the first number           |
|   secondNumber - an array containing the digits of the second number         |
| Returns:                                                                     |
|   number of the specified base containing the product of the two numbers     |
| Examples:                                                                    |
|   multiply(10, [5], [1,0])                                             [5,0] |
|   multiply(2, [1,1], [1,0])                                          [1,1,0] |
|   multiply(19,[18,1],[10,12])                              [ 10, 1, 17, 12 ] |
\******************************************************************************/
function multiply(base, firstNumber, secondNumber) {
    var resultLength = firstNumber.length + secondNumber.length;
    var resultNumber = Array.apply(null, new Array(resultLength)).map(Number.prototype.valueOf,0);

    // Do basic long multiplication on the numbers
    for (var i = firstNumber.length - 1 ; i >= 0; i--) {
        for (var j = secondNumber.length - 1; j >= 0; j--) {
            resultNumber[i + j + 1] += firstNumber[i] * secondNumber[j];
        }
    }

    // Flatten number to base
    for (var i = resultNumber.length -1; i > 0; i--) {
        if (resultNumber[i] >= base) {
            resultNumber[i-1] += Math.floor(resultNumber[i]/base);
            resultNumber[i] = resultNumber[i] % base;
        }
    }
    return trimNumber(resultNumber);
}

/***************************** CALCULATE NEW BASE *****************************\
| The calculate new base function takes in a number of one base and converts   |
| it to a number of another base. It does this by converting the value of      |
| each digit of the old number into its corisponding value in the new base     |
| and summing all the numbers                                                  |
| Arguments:                                                                   |
|   oldBase - the base of the number you want to convert from                  |
|   newBase - the base of the number you want to convert to                    |
|   oldNumber - an array of digits for the old number you want to convert      |
| Returns:                                                                     |
|   an array containing the digits of the new number in the new base           |
\******************************************************************************/
function calculateNewBase(oldBase, newBase, oldNumber) {
    var newLength = calculateNewBaseLength(oldBase, oldNumber.length, newBase);
    var newNumber = Array.apply(null, new Array(newLength)).map(Number.prototype.valueOf,0);
    var oldBaseTen = tenInOldBase(oldBase, newBase);

    // The starting conversion value is 1 ( 1 = 1 for every base)
    var conversionValue = [1];
    
    // add each value of the digits of the old number to the new number
    for (var i = oldNumber.length - 1; i >= 0; i--) {
        for (var j = 0; j < conversionValue.length; j++) {
            var newNumberIndex =  j + newLength - conversionValue.length;
            newNumber[newNumberIndex] += conversionValue[j] * oldNumber[i];
        }

        // increment the conversion value to the conversion for the next digit
        conversionValue = multiply(newBase, conversionValue, oldBaseTen);
    }
    
    // Flatten number to the new base
    for (var i = newNumber.length - 1; i >=0; i--) {
        if (newNumber[i] >= newBase) {
            newNumber[i-1] += Math.floor(newNumber[i]/newBase);
            newNumber[i] = newNumber[i]%newBase;
        }
    }

    // Trim and return the number
    return trimNumber(newNumber);
}



var ITERATIONCOUNT = 1000000;
/****************************** GENERATE PASSWORD *****************************\
| The generate password function takes in the domain and the master password   |
| then returns the 16 character long base64 password based off of the sha256   |
| hash                                                                         |
| Arguments 
\******************************************************************************/
// var prehash = website+password;
// var hash = CryptoJS.SHA256(prehash) + "";
// return hexToBase64(hash).substring(0,16);
function generatePassword(domain, masterpass ) {

    var settingsDatabase = new SettingsAPI();

    if (!settingsDatabase.IsOpen()) {
        console.log("Error: Local settings database is not opened");
    }
    else {
        console.log("Local settings database opened");
    }

    // DomainSettings
    var settings = settingsDatabase.GetSettings(domain); // use versionless command for now
    // settingWrapper settings = getSettings(domain);

    // cout << "MAX LENGTH: " << settings.maxCharacters << endl;
    // cout << "ALLOWED CHARACTERS: " << settings.allowedCharacters << endl;
    // cout << "DOMAIN: " << settings.domain << endl;
    // cout << "REGEX MATHC: " << settings.regex << endl;

    var prehash = settings.domain+masterpass;
    unsigned char hash[HASHSIZE];

    string output = "";
    int iterations = 0;
    while (true) {
        ++iterations;
        SHA256((unsigned char*)prehash.c_str(), prehash.size(), hash);

        prehash = "";
        for (int j = 0; j < HASHSIZE; j++) {
            prehash += hash[j];
        }
        // make sure at least a certian number of iterations are done
        if (iterations < ITERATIONCOUNT) continue;
        // Turn the hashed value into a displayable password
        vector<int> hashedValues(32);
        string password = "";
        for (int j = 0; j < HASHSIZE; j++) {
            hashedValues[j] = static_cast<int>(hash[j]);
        }

        int newbase = settings.allowedCharacters().length();
        vector<int> newValues = calculateNewBase(256, newbase, hashedValues);

        for (int i = 0; i < 16 && i < settings.maxLength; i++) {
            int reverseIndex = newValues.size()-i-1;
            password += settings.allowedCharacters()[newValues[reverseIndex]];
        }

        // Make sure the generated password conforms to the password rules
        try {
            boost::regex rulesCheck(settings.regex);

            // If it does conform then exit the program
            if (regex_match(password, rulesCheck)) {
                return password;
            }
            else {
                // std::cout << "BAD WORD CHECK" << std::endl;
            }
        }

        catch (const boost::regex_error& e) {
            std::cout << "regex_error caught: " << e.what() << '\n';
            if (e.code() == boost::regex_constants::error_brack) {
                std::cout << "The code was error_brack\n";
            }
        }
    }
    return "";  // this will never be hit
}
