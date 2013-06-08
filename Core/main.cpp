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


using namespace std;
#define HASHSIZE 32

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////// BASE MODIFICATION FUNCTIONS ///////////////////////// 
//////////////////////////////////////////////////////////////////////////////  

/************************** CALUCLATE NEW BASE LENGTH *************************\
| This function calculates the maximum number of digits that can be in a       |
| number of a given base given the number of digits it is in another base.     |
\******************************************************************************/
int calculateNewBaseLength(int oldBase, int oldBaseLength, int newBase) {
    double logOldBase = log(oldBase);
    double logNewBase = log(newBase);
    double newBaseLength = oldBaseLength * (logOldBase/logNewBase);
    int intNewBaseLength = newBaseLength;
    if (newBaseLength > intNewBaseLength) intNewBaseLength += 1;  // round up
    return intNewBaseLength;
}

/********************************* TRIM NUMBER ********************************\
| This function takes in a vector representing a multi digit number and        |
| removes all of the preceding zero value digits returning a vector of only    |
| meaningful digits.                                                           |
\******************************************************************************/
vector<int> trimNumber(vector<int> v) {
    vector<int>::iterator i = v.begin();
    while (i != v.end()-1) {
        if (*i != 0) {
            break;
        }
        i++;
    }

    return vector<int>(i, v.end());
}

/******************************* TEN IN OLD BASE ******************************\
| This function converts the value of the old base to it's equivilant value    |
| in the new base. This is used when calulating the effect each digit of the   |
| old base has on each digit of the new base.                                  |
\******************************************************************************/
vector<int> tenInOldBase(int oldBase, int newBase) {
    int newBaseLength = calculateNewBaseLength(oldBase, 2, newBase);
    int maxLength = newBaseLength>2?newBaseLength:2;

    vector <int> newNumber(maxLength, 0);

    int currentNumber = oldBase;
    for (int i = maxLength-1; i >=0; i--) {
        newNumber[i] = currentNumber % newBase;
        currentNumber = currentNumber / newBase;
    }

    newNumber = trimNumber(newNumber);
    return newNumber;
}

/*************************** MULTIPLY ARBITRARY BASE **************************\
| This function takes two numbers that are the same arbitrary base and         |
| multiplies them together returning a vector containing the product of the    |
| two numbers in the same base that they were originally in                    |
\******************************************************************************/
vector<int> multiply(int base, vector<int> firstNumber, vector<int> secondNumber) {
    int resultLength = firstNumber.size() + secondNumber.size();
    vector<int> resultNumber(resultLength, 0);

    // Do basic long multiplication on the numbers
    for (int i = firstNumber.size() - 1 ; i >= 0; i--) {
        for (int j = secondNumber.size() - 1; j >= 0; j--) {
            resultNumber[i+j + 1] += firstNumber[i] * secondNumber[j];
        }
    }

    // Flatten number to base
    for (int i = resultNumber.size() -1; i > 0; i--) {
        if (resultNumber[i] >= base) {
            resultNumber[i-1] += resultNumber[i]/base;
            resultNumber[i] = resultNumber[i] % base;
        }
    }
    return trimNumber(resultNumber);
}

/***************************** CALCULATE NEW BASE *****************************\
| This function takes in a number of an arbitrary base and returns the same    |
| number in another base. It functions by cycling through each digit of the    |
| original base and adding it's corrisponding value in the new base to the     |
| new number. The corrisponding value in the new base is updated each          |
| iteration instead of being calculated at the begining of the function,       |
| allowing for faster conversion                                               |
\******************************************************************************/
vector<int> calculateNewBase(int oldBase, int newBase, vector<int> oldNumber) {
    int newNumberLength = calculateNewBaseLength(oldBase, oldNumber.size(), newBase);
    vector<int> newNumber(newNumberLength, 0); // blank vector of 0's
    vector<int> conversionValue(1, 1);  // a single digit of 1
    
    // For each digit in the old number add that digit's new base value to the
    // new number
    for (int i = oldNumber.size()-1; i >= 0; i--) {
        // Add the modified ConversionValue to the new number
        for (unsigned int j = 0; j < conversionValue.size(); j++) {
            int newNumberIndex =  j + newNumberLength - conversionValue.size();
            newNumber[newNumberIndex] += conversionValue[j] * oldNumber[i];
        }

        // increment the conversion factor by oldbase 10 to have it represent the
        // value of the next digit in the old base
        conversionValue = multiply(newBase, conversionValue, tenInOldBase(oldBase,newBase));
    }

    // Flatten number to base
    for (int i = newNumber.size()-1; i >=0; i--) {
        if (newNumber[i] >= newBase) {
            newNumber[i-1] += newNumber[i]/newBase;
            newNumber[i] = newNumber[i]%newBase;
        }
    }

    return trimNumber(newNumber);
}

  //////////////////////////////////////////////////////////////////////////////
 /////////////////////////////// READ SETTINGS //////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////  
struct settingWrapper {
    string domain;
    string allowedCharacters;
    uint maxCharacters;
    string regex;
};
    

settingWrapper getSettings(string domain) {
    string hexCharacters = "0123456789abcdef";

    settingWrapper settings;
    settings.allowedCharacters = " !\"#$%&'()*+,-./1234567890:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

    // open ~/.passcodes/config
    ifstream configFile;
    struct passwd *pw = getpwuid(getuid());
    const char *homedir = pw->pw_dir;
    string configPath = string(homedir) + "/.passcodes/";
    string subscriptionPath = string(homedir) + "/.passcodes/subscriptions";


    configFile.open(subscriptionPath.c_str());

    if (!configFile.is_open()) {
        cout << "File does not exist" << endl;
        #if defined(_WIN32) // I actually havent done any testing with windows
        _mkdir(strPath.c_str());
         #else
        mkdir(configPath.c_str(), 0777); // notice that 777 is different than 0777
        #endif

        ofstream testFile;
        testFile.open(subscriptionPath.c_str());
        testFile << "http://passcod.es/global.chanel" << endl;
        testFile << "http://asherglick.github.io/Passcodes" << endl;
        testFile.close();

        configFile.open(subscriptionPath.c_str());
    }

    string subscription = "";
    if (configFile.is_open()) {
        // For each subscription look up the
        while (getline(configFile, subscription)) {
            // Get a hash of the subscription path, hashses are used to insure
            // the folder the cashe exists in is a valid folder name
            unsigned char hash[20];
            SHA1((unsigned char*)subscription.c_str(), subscription.size(), hash);
            string cashedSubscriptionName = "";
            for (int i = 0; i < 4; i++) {
                cashedSubscriptionName += hexCharacters[hash[i]&0x0F];
                cashedSubscriptionName += hexCharacters[(hash[i]>>4)&0x0F];
            }

            // Open the domain in the current subscription folder
            ifstream cashedSubscritption;
            string subscriptionPath = configPath + "cashe/" + cashedSubscriptionName + "/" + domain;
            cashedSubscritption.open(subscriptionPath);
            if (cashedSubscritption.is_open()) {
                string maxLength = "";
                getline(cashedSubscritption, maxLength);
                if (maxLength != "") settings.maxCharacters = stoi(maxLength);
                string regex = "";
                getline(cashedSubscritption, regex);
                if (regex != "") settings.regex = regex;
                string disallowedCharacters = "";
                getline(cashedSubscritption, disallowedCharacters);
                for (char character : disallowedCharacters) {
                    int location = settings.allowedCharacters.find(character);
                    if (location == -1) continue; // skip duplicates
                    settings.allowedCharacters.erase(location,1);
                }
                string parent = "";
                getline(cashedSubscritption, parent);
                if (parent != "") settings.domain = parent;
            }
            else {
                //cout << "No cashed version of " << domain << " exists from the subscrition " << subscription << endl;
                //cout << "Run \"passcodes --update\" to update the cashe from all your subscriptions" << endl;
            }

            //cout << subscriptionPath << endl;
        }
    }
    // look for 'subscriptions' section
    // open each file in the subscriptions list in order
      // ~/.passcodes/<subscription>/<domain>
      // add any non-blank entry to the settings, latter entries overriding former

    return settings;
}
  //////////////////////////////////////////////////////////////////////////////
 //////////////////////// GENERATE PASSWORD FUNCTIONS ///////////////////////// 
//////////////////////////////////////////////////////////////////////////////  
//#define ITERATIONCOUNT 100000
#define ITERATIONCOUNT  99999
/****************************** GENERATE PASSWORD *****************************\
| The generate password function takes in the domain and the master password   |
| then returns the 16 character long base64 password based off of the sha256   |
| hash                     o                                                    |
\******************************************************************************/
string generatePassword(string domain, string masterpass ) {
    settingWrapper settings = getSettings(domain);

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

        int newbase = settings.allowedCharacters.length();
        vector<int> newValues = calculateNewBase(256, newbase, hashedValues);

        for (unsigned int i = 0; i < 16 && i < settings.maxCharacters; i++) {
            int reverseIndex = newValues.size()-i-1;
            password += settings.allowedCharacters[newValues[reverseIndex]];
        }

        // Make sure the generated password conforms to the password rules
        try {
            boost::regex rulesCheck(settings.regex);

            // If it does conform then exit the program
            if (regex_match(password, rulesCheck)) {
                return password;
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
