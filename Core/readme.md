Usage
------

**Usage**  
   `passcodes [-s] [-h] [-d] <domain text> [-p] <password text>`

**Commands**  
 `-d`  Any text that comes after this flag is set as the domain. If no domain is given it is prompted for.  
 `-p`  Any text that comes after this flag is set as the password. If this flag is set a warning will be displayed. If this flag is not set the user is prompted for a password.  
 `-h`  Display the help menu. No other functions will be run if this flag is present.  
 `-s`  Suppress warnings. No warning messages will appear from using the -p flag.  

Compiling
---------

The core library uses openssl  

**Debian / Ubuntu**  
`sudo apt-get install libssl-dev`


No Arguments

    $ ./passcodes
    Enter Domain: domain
    Enter Password: 
    a1LWauOe!jhdaGWI

Domain Argument

    $ ./passcodes -d domain
    Enter Password: 
    a1LWauOe!jhdaGWI

Domain and password argument

    $ ./passcodes -d domain -p world
    WARNING: you should not use the -p flag as it may be insecure
    a1LWauOe!jhdaGWI

Domain and password arguemnt with suppressed warnings

    $ ./passcodes -s -d domain -p world
    a1LWauOe!jhdaGWI
