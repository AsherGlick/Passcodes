Passcodes
=========
Passcodes web interface can be found at [passcod.es](http://passcod.es)


Striving to get versions compatable on the following devics

Firefox Extention  
Chrome Extention - [Functional](https://github.com/AsherGlick/Passcodes/tree/master/ChromeExtention)  
Safari Extention - [Safari Passcode](https://github.com/mdznr/Safari-Passcode)  
Android App - [Functional](https://github.com/AsherGlick/Passcodes/tree/master/Android)  
iPhone App - [iOS Passcode](https://github.com/mdznr/iOS-Passcode)  
iPad App - [iOS Passcode](https://github.com/mdznr/iOS-Passcode)  
Terminal Program - done  
Windows Standalone GUI  
Linux Standalone GUI  
Mac Standalone GUI  
Web - [Functional](https://github.com/AsherGlick/Passcodes/tree/master/Web)  
Mobile Web - [Functional](https://github.com/AsherGlick/Passcodes/tree/master/Web)  

Hopefully using this program will be easy enough that many people will begin to use it

How it works
------------

    domain = input()
    domain = domain.toLowerCase()
    password = input()
    hash16 = SHA256(domain+password)
    hash64 = string(convertToBase64(hash16)) 
    // The + and / characters are changed into ! and # respectively
    print hash64.substring(0,16)