Usage
------

There are four flags that can be used in the command line program  
`-h` 'help screen' this will also pop up when the user enters the commands incorrectly  
`-u` 'username' this is the flag indicating that the next argument is the username  
`-p` 'password' this is the flag indicating that the next argument is the password, this flag will also trigger a displayed warning to the user saying that they should not use this flag  
`-s` 'silent' this flag will suppress the warning that pops up when the user uses the '-p' flag  

Compiling
---------

The core library uses openssl

**Debian / Ubuntu**
`sudo apt-get install libssl-dev`