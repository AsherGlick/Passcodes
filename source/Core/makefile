all: schemaCompiler

cpp: ../CommandLineTool/DomainSettings.h

schemaCompiler: schemaCompiler.cpp
	g++ schemaCompiler.cpp -W -Wall -Wextra -Wshadow -pedantic -std=c++0x -lboost_regex -o schemaCompiler

../CommandLineTool/DomainSettings.h: schemaCompiler db_schema.json templates/DomainSettings.h
	./schemaCompiler cpp

clean:
	rm schemaCompiler
	rm ../CommandLineTool/DomainSettings.h