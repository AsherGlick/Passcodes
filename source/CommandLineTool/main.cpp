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

#include <openssl/sha.h>
#include <unistd.h>
#include <math.h>
#include <pwd.h>
#include <stdio.h>
#include <sys/stat.h>

#include <fstream>
#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
//#include <regex>
#include <boost/regex.hpp>  // use the boost library until gcc supports regex

#include "settings.h"
#include "baseconvert.h"


using namespace std;
#define HASHSIZE 32


  //////////////////////////////////////////////////////////////////////////////
 //////////////////////// GENERATE PASSWORD FUNCTIONS ///////////////////////// 
//////////////////////////////////////////////////////////////////////////////  
#define ITERATIONCOUNT 1000000
/****************************** GENERATE PASSWORD *****************************\
| The generate password function takes in the domain and the master password   |
| then returns the 16 character long base64 password based off of the sha256   |
| hash                                                                         |
\******************************************************************************/
string generatePassword(string domain, string masterpass ) {

    SettingsAPI settingsDatabase;

    if (!settingsDatabase.IsOpen()) {
        cout << "Error: Local settings database is not opened" << endl;
    }
    else {
        cout << "Local settings database opened" << endl;
    }

    DomainSettings settings = settingsDatabase.GetSettings(domain); // use versionless command for now
    // settingWrapper settings = getSettings(domain);

    // cout << "MAX LENGTH: " << settings.maxCharacters << endl;
    // cout << "ALLOWED CHARACTERS: " << settings.allowedCharacters << endl;
    // cout << "DOMAIN: " << settings.domain << endl;
    // cout << "REGEX MATHC: " << settings.regex << endl;

    string prehash = settings.domain+masterpass;
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

/************************************ HELP ************************************\
| The help fucntion displays the help text to the user, it is called if the    |
| help flag is present or if the user has used the program incorrectly         |
\******************************************************************************/
void help() {
    cout <<
    "Welcome to the command line application for passcod.es\n"
    "written by Asher Glick (aglick@aglick.com)\n"
    "\n"
    "Usage\n"
    "   passcodes [-s] [-h] [-d] <domain text> [-p] <password text>\n"
    "\n"
    "Commands\n"
    " -d  Any text that comes after this flag is set as the domain\n"
    "     If no domain is given it is prompted for\n"
    " -p  Any text that comes after this flag is set as the password\n"
    "     If this flag is set a warning will be displayed\n"
    "     If this flag is not set the user is prompted for a password\n"
    " -h  Display the help menu\n"
    "     No other functions will be run if this flag is present\n"
    " -s  Suppress warnings\n"
    "     No warning messages will appear from using the -p flag\n"
    << endl;
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
        if (string(argv[i]) == "-p") {  // password flag
            pointer = &password;
        } else if (string(argv[i]) == "-d") {  // domain flag
            pointer = &domain;
        } else if (string(argv[i]) == "-s") {  // silent flag
            silent = true;
        } else if (string(argv[i]) == "-h") {  // help flag
            help();
            return 0;
        } else {
            if (pointer == NULL) {
                help();
                return 0;
            } else {
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
    cout << generatePassword(domain, password) << endl;
}
