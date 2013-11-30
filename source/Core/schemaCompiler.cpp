// Coding Standard: Unpublishable
// This crap is going to work if it is the last thing I do tonight
// I really miss having a desk that fits me, I dont even know what is going on 'osajgnnd[onea
// Lets go


#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/algorithm/string.hpp>
// #include <boost/date.hpp>
#include <iostream>
#include <vector>
#include <sstream>
#include <map>
using namespace std;


// Mapping of each SQL datatype to the corrisponding C++ datatype
map <string, string> SQLtoCPP {
	{"varchar", "std::string"},
	{"int", "int"},
	{"timestamp", "std::string"}
};

// Mapping of each sql datatype to the C++ sqlite3 function to get that type from the database
map <string, string> SQLITEtoCPP{
	{"varchar", "std::string(reinterpret_cast<const char*> (sqlite3_column_text ("},
	{"int", "sqlite3_column_int ("},
	{"timestamp", "std::string(reinterpret_cast<const char*> (sqlite3_column_text (" } // Timestamp
};

// Mapping of each SQL datatype to the corrisponding Java datatype
map <string, string> SQLtoJava {
	{"varchar", "String"},
	{"int", "Integer"},
	{"timestamp", "String"}
};


int main() {
	cout << "Loading the JSON file" << endl;
	using boost::property_tree::ptree;
	ptree pt;

	// Load the JSON into the property tree ometrherfke
	string testfile = "db_schema.json";
	read_json(testfile, pt);

	cout << "JSON file loaded" << endl;



	cout << "Parsing File" << endl;

	stringstream CPPVariables;        // Really these should all be files
	stringstream CPPConstructor; // the construction for initilizing all of the variables from a sqlite3 statement
	stringstream SQLRows;    // to be joined and encapsulated
	vector<string> SQLIndexes; // to be joined as is

	// Pre loop constructors
	SQLRows << "CREATE TABLE rules ("; 


	// Loop Constructors
	string concatinator = "";
	for ( ptree::value_type const& v : pt.get_child("columns")) {

		string columnName = v.first;

		ptree subtree = v.second;
		string type = subtree.get<std::string>("Type");
		string size = subtree.get("Size", "");
		string description = subtree.get("Description", "");
		string indexName = subtree.get("Index", "");
		string defaultValue = subtree.get("Default", "");
		bool isNullable = subtree.get("Nullable", true);
		string extraData = subtree.get("Extra", "");
		bool isDepricated = subtree.get("Depricated", false);



		// SQL colum Value
		SQLRows << concatinator << endl << "  `" << boost::to_lower_copy(columnName) << "`";
		SQLRows << " " << boost::to_lower_copy(type); if (size.length() > 0) SQLRows << "(" << size << ")"; SQLRows << " ";
		if (!isNullable) SQLRows << "NOT NULL";
		if (defaultValue.length() > 0) SQLRows << " DEFAULT " << defaultValue;
		if (extraData.length() > 0) SQLRows << " " << extraData;
		concatinator = ",";

		// C++ Datatype variables
		CPPVariables << "    " << SQLtoCPP[type] << " " << columnName << ";" << endl;

		// C++ SQLITE3 CONVERSIONS
		CPPConstructor << "    if (columnName == \"" << boost::to_lower_copy(columnName) << "\") {" << columnName << " = " << SQLITEtoCPP[type] << "statement,i);}" << endl;

		// CREATE TABLE `virtual_aliases` (
		//   `id` int(11) NOT NULL auto_increment,
		//   `domain_id` int(11) NOT NULL,
		//   `source` varchar(100) NOT NULL,
		//   `destination` varchar(100) NOT NULL,
		//   PRIMARY KEY (`id`),
		//   FOREIGN KEY (domain_id) REFERENCES virtual_domains(id) ON DELETE CASCADE
		// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	}

	// Post Loop Constst	ructors
	SQLRows << endl << ");" << endl; // the engine data might not be nessasary but IDK how SQL differes between implementations



	// cout << "CREATE INDEX " << indexName << "ON rules (" << columnName << ");" << endl;

	stringstream CPPFile;

	CPPFile << "#IFNDEF __DOMAINSETTINGS_H_" << endl;
	CPPFile << "#DEFINE __DOMAINSETTINGS_H_" << endl;
	CPPFile << "class DomainSettings {" << endl;
	CPPFile << "  public:" << endl;
	CPPFile << CPPVariables.rdbuf() << endl;
	CPPFile << "    DomainSettings {" << endl;
	CPPFile << "        [[CONSTRUCTOR]]" << endl;
	CPPFile << "    }" << endl;
	CPPFile << "}" << endl;
	CPPFile << "#ENDIF" << endl;

	cout << SQLRows.rdbuf() << endl;
	cout << CPPConstructor.rdbuf() << endl;


	cout << CPPFile.rdbuf() << endl;
}