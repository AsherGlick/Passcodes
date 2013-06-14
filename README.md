Passcodes
=========
Passcodes web interface can be found at [passcod.es](http://passcod.es)

Striving to get versions compatable on the following devics

Planned Applications   | Current Status                                         | Generator Version
-----------------------|--------------------------------------------------------|--------------------
Firefox Extention      | [Functional](FirefoxExtention)                         | 2
Chrome Extention       | [Functional](ChromeExtention)                          | 2
Safari Extention       | [Functional](https://github.com/mdznr/Safari-Passcode) | 1
Android App            | [Functional](Android)                                  | 2
iPhone App             | [Functional](https://github.com/mdznr/iOS-Passcode)    | 1
iPad App               | [Functional](https://github.com/mdznr/iOS-Passcode)    | 1
Terminal Program       | [Functional](Core)                                     | 3
Windows Standalone GUI | Not Functional                                         | 0
Linux Standalone GUI   | Not Functional                                         | 0
Mac Standalone GUI     | Not Functional                                         | 0
Web                    | [Functional](Web)                                      | 2
Mobile Web             | [Functional](Web)                                      | 2

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
