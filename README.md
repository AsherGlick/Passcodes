Passcodes
=========
Passcodes web interface can be found at [passcod.es](http://passcod.es)

Striving to get versions compatable on the following devics

Planned Applications   | Current Status
-----------------------|----------------------------------------------------------------
Firefox Extention      | [Version 2 Generator](FirefoxExtention)  
Chrome Extention       | [Version 2 Generator](https://github.com/AsherGlick/Passcodes/tree/master/ChromeExtention)  
Safari Extention       | [Version 1 Generator](https://github.com/mdznr/Safari-Passcode)  
Android App            | [Version 2 Generator](https://github.com/AsherGlick/Passcodes/tree/master/Android)  
iPhone App             | [Version 2 Generator](https://github.com/mdznr/iOS-Passcode)  
iPad App               | [Version 1 Generator](https://github.com/mdznr/iOS-Passcode)  
Terminal Program       | [Version 2 Generator](https://github.com/AsherGlick/Passcodes/tree/master/Core)  
Windows Standalone GUI | Not Ready
Linux Standalone GUI   | Not Ready
Mac Standalone GUI     | Not Ready
Web                    | [Version 2 Generator](https://github.com/AsherGlick/Passcodes/tree/master/Web)  
Mobile Web             | [Version 2 Generator](https://github.com/AsherGlick/Passcodes/tree/master/Web)  

Our aim is to make the application simple enough that anyone will be able to pick up and use it without it getting in their way

How Version 2 works
-------------------

    domain = input()
    domain = domain.toLowerCase()
    password = input()
    hash16 = SHA256(domain+password)
    hash64 = string(convertToBase64(hash16)) 
    // The + and / characters are changed into ! and # respectively
    print hash64.substring(0,16)
