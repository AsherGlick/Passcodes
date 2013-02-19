#include <iostream>
#include <iomanip>
#include <string>
#include <openssl/sha.h>

using namespace std;
#define HASHSIZE 32

string getCutHex(unsigned char hash[HASHSIZE]) {
	string base64Index = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#";
	string output = "";

	// Unrolled loop iteration 1
	output += base64Index[hash[0]>>2];
	output += base64Index[((hash[0]&0x03)<<4) + (hash[1]>>4)];
	output += base64Index[((hash[1]&0x0F)<<2) + (hash[2]>>6)];
	output += base64Index[hash[2] & 0x3F];
	
	// Unrolled loop iteration 2
	output += base64Index[hash[3]>>2];
	output += base64Index[((hash[3]&0x03)<<4) + (hash[4]>>4)];
	output += base64Index[((hash[4]&0x0F)<<2) + (hash[5]>>6)];
	output += base64Index[hash[5] & 0x3F];
	
	// Unrolled loop iteration 3
	output += base64Index[hash[6]>>2];
	output += base64Index[((hash[6]&0x03)<<4) + (hash[7]>>4)];
	output += base64Index[((hash[7]&0x0F)<<2) + (hash[8]>>6)];
	output += base64Index[hash[8] & 0x3F];

	// Unrolled loop iteration 4
	output += base64Index[hash[9]>>2];
	output += base64Index[((hash[9]&0x03)<<4) + (hash[10]>>4)];
	output += base64Index[((hash[10]&0x0F)<<2) + (hash[11]>>6)];
	output += base64Index[hash[11] & 0x3F];

	return output;
}

// DZ5PXnekn78Wmcwf
// DZ5PXnekn78Wmcwf

string getPassword(string masterpass, string domain) {
	string prehash = masterpass+domain;
	unsigned char hash[HASHSIZE];
	SHA256((unsigned char*)prehash.c_str(), prehash.size(), hash);

	getCutHex(hash);

	//unsigned char hash[20];
	return prehash;
}



int main(int argc, char* argv[]) {
	string input;

	// a sha1 hash is 20 bytes


	// for (int i = 0; i < HASHSIZE; i++) {
	// 	hash[i] = 'x';
	// }

	//cout << "enter your string: ";
	//getline(cin, input);
	input = "hello";

	// compute the sha1 of the input, and store it our  hash array

	// the above is the exact same thing as doing:
	//    SHA_CTX ctx;
	//    
	//    SHA1_Init(&ctx);
	//    SHA1_Update(&ctx, input.c_str(), input.size());
	//    SHA1_Final(hash, &ctx);

	// since the hash array just contains a bunch of bytes,
	// print them as hexadecimal values
	// cout << "the hash was: ";
	// for(int i = 0; i < HASHSIZE; ++i) {
	// 	cout << hex << setw(2) << setfill('0') << (int)hash[i];
	// }
	// cout << endl;

	getPassword ("harvy","dent");

	cout << "DONE!" << endl;
}