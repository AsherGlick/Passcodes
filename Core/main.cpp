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

#include <iostream>
#include <iomanip>
#include <string>
#include <openssl/sha.h>
#include <unistd.h>

using namespace std;
#define HASHSIZE 32

/***************************** CONVERT AND CUT HEX ****************************\
| The convert nad cut hex function takes in an array of characters generated   |
| by the SHA256 function and then converts it into bas64 until 16 base64       |
| characters exist. It returns the 16 character long base64 string             |
\******************************************************************************/
string convertAndCutHex(unsigned char hash[HASHSIZE]) {
	string base64Index = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#";
	string output = "";

	for (int i = 0; i < 12; i+=3) {
		output += base64Index[hash[i+0]>>2];
		output += base64Index[((hash[i+0]&0x03)<<4) + (hash[i+1]>>4)];
		output += base64Index[((hash[i+1]&0x0F)<<2) + (hash[i+2]>>6)];
		output += base64Index[hash[i+2] & 0x3F];
	}

	return output;
}

int newBaseLength(int oldbase, int oldbaselength, int newBase) {
	return 0;
}

int* newBase(int oldbase, int oldbaselength, int newBase, int* number) {
	return NULL;
}

#define ITERATIONCOUNT 100000
/****************************** GENERATE PASSWORD *****************************\
| The generate password function takes in the domain and the master password   |
| then returns the 16 character long base64 password based off of the sha256   |
| hash                                                                         |
\******************************************************************************/
string generatePassword(string masterpass, string domain) {
	string prehash = masterpass+domain;
	unsigned char hash[HASHSIZE];

	string output = "";

	for (int i = 0; i < ITERATIONCOUNT; i++) {
		SHA256((unsigned char*)prehash.c_str(), prehash.size(), hash);
		
		prehash = "";
		for (int j = 0; j < HASHSIZE; j++) {
			prehash += hash[j];
		}

		output = convertAndCutHex(hash);
		bool goodMatch = true;
		for (unsigned int j = 0; j < output.length(); j++) {
			if (output[j] == '!' || output[j] == '#') {
				goodMatch = false;
			}
		}
		if (goodMatch) return output;
	}
	return "Failed";
}

/************************************ HELP ************************************\
| The help fucntion displays the help text to the user, it is called if the    |
| help flag is present or if the user has used the program incorrectly         |
\******************************************************************************/
void help() {
	cout << "Welcome to the command line application for passcod.es" << endl;
	cout << "written by Asher Glick (aglick@aglick.com)" << endl;
	cout << endl;
	cout << "Usage" << endl;
	cout << "   passcodes [-s] [-h] [-d] <domain text> [-p] <password text>" << endl;
	cout << endl;
	cout << "Commands" << endl;
	cout << " -d  Any text that comes after this flag is set as the domain" << endl;
	cout << "     If no domain is given it is prompted for" << endl;
	cout << " -p  Any text that comes after this flag is set as the password" << endl;
	cout << "     If this flag is set a warning will be displayed" << endl;
	cout << "     If this flag is not set the user is prompted for a password" << endl;
	cout << " -h  Display the help menu" << endl;
	cout << "     No other functions will be run if this flag is present" << endl;
	cout << " -s  Suppress warnings" << endl;
	cout << "     No warning messages will appear from using the -p flag" << endl;
	cout << endl;
}

/************************************ MAIN ************************************\
| The main function handles all of the arguments, parsing them into the        |
| correct locations. Then prompts the user to enter the domain and password    |
| if they have not been specified in the arguments. Finaly it outputs the      |
| generated password to the user                                               |
\******************************************************************************/
int main(int argc, char* argv[]) {
	bool silent = false;
	string domain = "";
	string password = "";
	string *pointer = NULL;

    // Parse the arguments
	for (int i = 1; i < argc; i++) {
		if (string(argv[i]) == "-p") { // password flag
			pointer = &password;
		} else if (string(argv[i]) == "-d") { // domain flag
			pointer = &domain;
		} else if (string(argv[i]) == "-s") { // silent flag
			silent = true;
		} else if (string(argv[i]) == "-h") { // help flag
			help();
			return 0;
		} else {
			if (pointer == NULL) {
				help();
				return 0;
			}
			else {
				*pointer += argv[i];
			}
		}
	}

    // If there is no domain given, prompt the user for a domain
	if (domain == "") {
		cout << "Enter Domain: ";
		getline(cin, domain);
	}
    // If there is a password given and the silent flag is not present
    // give the user a warning telling them that the password flag is insecure
	if (password != "" && !silent) {
		cout <<"WARNING: you should not use the -p flag as it may be insecure" << endl;
	}
    // If there is not a password given, prompt the user for a password securly
	else if (password == "") {
		password = string(getpass("Enter Password: "));
	}

    // Output the generated Password to the user
	cout << generatePassword (domain,password) << endl;
}