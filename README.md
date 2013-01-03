Passcodes
=========
Passcodes web interface can be found at [passcod.es](http://passcod.es)


Striving to get versions compatable on the following devics

Firefox Extention  
Chrome Extention  
Safari Extention - [Safari Passcode](https://github.com/mdznr/Safari-Passcode)  
Android App  
iPhone App - [iOS Passcode](https://github.com/mdznr/iOS-Passcode)  
iPad App - [iOS Passcode](https://github.com/mdznr/iOS-Passcode)  
Terminal Program  
Windows Standalone GUI  
Linux Standalone GUI  
Mac Standalone GUI  
Web - Functional  
Mobile Web - Functional  

Hopefully using this program will be easy enough that many people will begin to use it

How it works
------------
Passcodes uses sha256 to generate a hash  
every pair of hex characters are used to create a base64 number  
`[1  1  1  1][1  1  1  1]` -> two hex numbers  
`[1  1  1  1  1  1]` -> base64 number  

Psuedo Code

	website = input()
	masterpassword = input()
	hash = sha256 (website + masterpassword)
	base64 = new array()
	for (var i = 0; i < hash.length; i+=2) {
		base64.push(has[i] + 16 * (hash[i+1]%4));
	}
	print base64