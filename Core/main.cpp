#include <iostream>
#include <iomanip>
#include <string>
#include <openssl/sha.h>

using namespace std;

int main(int argc, char* argv[])
{
    string input;

    // a sha1 hash is 20 bytes
    unsigned char hash[20];

    //cout << "enter your string: ";
    //getline(cin, input);
  	input = "hello";

    // compute the sha1 of the input, and store it our  hash array
    SHA256((unsigned char*)input.c_str(), input.size(), hash);
    // the above is the exact same thing as doing:
    //    SHA_CTX ctx;
    //    
    //    SHA1_Init(&ctx);
    //    SHA1_Update(&ctx, input.c_str(), input.size());
    //    SHA1_Final(hash, &ctx);

    // since the hash array just contains a bunch of bytes,
    // print them as hexadecimal values
    cout << "the hash was: ";
    for(int i = 0; i < 20; ++i) {
        cout << hex << setw(2) << setfill('0') << (int)hash[i];
    }
    cout << endl;
}

string getPassword(string masterpass, string location) {
	string prehash = masterpass+location;

	//unsigned char hash[20];
	return prehash;
}