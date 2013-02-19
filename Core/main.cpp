#include <iostream>
#include <iomanip>
#include <string>
#include <openssl/sha.h>

using namespace std;
#define HASHSIZE 32

string getCutHex(unsigned char hash[HASHSIZE]) {
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

string getPassword(string masterpass, string domain) {
	string prehash = masterpass+domain;
	unsigned char hash[HASHSIZE];
	SHA256((unsigned char*)prehash.c_str(), prehash.size(), hash);

	getCutHex(hash);

	//unsigned char hash[20];
	return prehash;
}

void help() {
	cout << "THIS IS THE HELP PAGE" << endl;
}

int main(int argc, char* argv[]) {
	// check to make sure there are enough arguments
	// if (argc < 3) {
	// 	cout << "you must specify a username with -u" << endl;
	// 	help();
	// 	return 0;
	// }

	bool silent = false;
	bool passwordFlag = false;
	string domain = "";
	string password = "";
	string *pointer = NULL;


	for (int i = 1; i < argc; i++) {
		if (string(argv[i]) == "-p") { // password flag
			pointer = &password;
		}
		else if (string(argv[i]) == "-d") { // domain flag
			pointer = &domain;
		}
		else if (string(argv[i]) == "-s") { // silent flag
			silent = true;
		}
		else if (string(argv[i]) == "-h") { // help flag
			cout << "triggered on the help flag" << endl;
			help();
			return 0;
		}
		else {
			if (pointer == NULL) {
				cout << "triggered on bad argument " << argv[i] << endl;
				help();
				return 0;
			}
			else {
				*pointer += argv[i];
			}
		}
	}

	if (passwordFlag && !silent) {
		cout <<"WARNING: you should not use the -p flag as it may be insecure" << endl;
	}


	cout << "domain is: " << domain << endl;
	cout << "password is: " << password << endl;
	getPassword ("harvy","dent");

	cout << "DONE!" << endl;
}