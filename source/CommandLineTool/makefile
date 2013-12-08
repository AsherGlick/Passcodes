all: passcodes

corecpp: 
	cd ../Core/; make cpp

passcodes: corecpp main.cpp settings.h DomainSettings.h
	g++ main.cpp -lssl -W -Wall -Wextra -pedantic -std=c++0x -lcrypto -lboost_regex -lsqlite3 -o passcodes



clean:
	rm passcodes
	rm DomainSettings.h
