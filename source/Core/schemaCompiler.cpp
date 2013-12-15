/************************************ ABOUT ***********************************\
| This file is used to compile the db_schema.json file into any nessasary      |
| formats including                                                            |
| SQL Initilizer Query (For both MySQL and SQLite3)                            |
| C++ object to store a row of the database for easy access                    |
| Java object to store a row of the databasae for easy access (android)        |
| - Eventually there may be javascript support for the firefox / chrome        |
| plugins                                                                      |
\******************************************************************************/
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/algorithm/string.hpp>
#include <boost/regex.hpp>
// #include <boost/date.hpp>
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <map>

#include <stdlib.h>

using namespace std;


// Mapping of each SQL datatype to the corrisponding C++ datatype
map <string, string> SQLtoCPP {
    {"varchar", "std::string"},
    {"int", "int"},
    {"timestamp", "std::string"}
};

// Mapping of each sql datatype to the C++ sqlite3 function to get that type from the database
map <string, string> SQLITEtoCPP{
    {"varchar", "std::string(reinterpret_cast<const char*> (sqlite3_column_text (statement,i)))"},
    {"int", "sqlite3_column_int (statement,i)"},
    {"timestamp", "std::string(reinterpret_cast<const char*> (sqlite3_column_text (statement,i)))" } // Timestamp
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
    stringstream SQLITERows; // special formatting for sqlite (no extra data, no newlines)
    vector<string> SQLIndexes; // to be joined as is

    // Pre loop constructors
    SQLRows << "CREATE TABLE IF NOT EXISTS rules (";
    SQLITERows << "CREATE TABLE IF NOT EXISTS rules \\("; 

    // Allow tracking of the number of columns
    int columnCount = 0; 

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

        //SQLITE3 Constructor (no extra data, no newlines)
        SQLITERows << concatinator << " `" << boost::to_lower_copy(columnName) << "`";
        SQLITERows << " " << boost::to_lower_copy(type); if (size.length() > 0) SQLITERows << "\\(" << size << "\\)"; SQLITERows << " ";
        if (!isNullable) SQLITERows << "NOT NULL";
        if (defaultValue.length() > 0) SQLITERows << " DEFAULT " << defaultValue;
        concatinator = ",";

        // C++ Datatype variables
        CPPVariables << "    " << SQLtoCPP[type] << " " << columnName << ";" << endl;

        // C++ SQLITE3 CONVERSIONS
        CPPConstructor << "            if (columnName == \"" << boost::to_lower_copy(columnName) << "\") {" << columnName << " = " << SQLITEtoCPP[type] << ";}" << endl;

        // CREATE TABLE `virtual_aliases` (
        //   `id` int(11) NOT NULL auto_increment,
        //   `domain_id` int(11) NOT NULL,
        //   `source` varchar(100) NOT NULL,
        //   `destination` varchar(100) NOT NULL,
        //   PRIMARY KEY (`id`),
        //   FOREIGN KEY (domain_id) REFERENCES virtual_domains(id) ON DELETE CASCADE
        // ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        columnCount++;
    }

    // Post Loop Constst    ructors
    SQLRows << endl << ");" << endl; // the engine data might not be nessasary but IDK how SQL differes between implementations
    SQLITERows << "\\);";


    // cout << "CREATE INDEX " << indexName << "ON rules (" << columnName << ");" << endl;


    ifstream CPPFileIn;
    ofstream CPPFileOut;
    char inputFilename[] = "templates/DomainSettings.h";
    char outputFilename[] = "../CommandLineTool/DomainSettings.h";


    CPPFileIn.open(inputFilename, ios::in);

    if (!CPPFileIn) {
      cerr << "Can't open input file " << inputFilename << endl;
      exit(1);
    }

    CPPFileOut.open(outputFilename, ios::out);

    if (!CPPFileOut) {
      cerr << "Can't open output file " << outputFilename << endl;
      exit(1);
    }

    string CPPFileLine;
    while (getline(CPPFileIn, CPPFileLine)) {

        CPPFileLine = boost::regex_replace(CPPFileLine, boost::regex("\\[\\[SQLCOLUMNCOUNT\\]\\]"), std::to_string(columnCount), boost::match_default | boost::format_all);
        CPPFileLine = boost::regex_replace(CPPFileLine, boost::regex("\\[\\[SQLCREATETABLE\\]\\]"), "\""+SQLITERows.str()+"\"", boost::match_default | boost::format_all);

        if (boost::regex_match(CPPFileLine, boost::regex ("\\s*\\[\\[CPPVARIABLES\\]\\]"))) {
            CPPFileOut << CPPVariables.rdbuf();
        }
        else if (boost::regex_match(CPPFileLine, boost::regex("\\s*\\[\\[CPPCONSTRUCTOR\\]\\]"))) {
            CPPFileOut << CPPConstructor.rdbuf();
        }
        else {
            CPPFileOut << CPPFileLine << "\n"; // reappend the newline to the file
        }
    }

    cout << SQLRows.rdbuf() << endl;
    cout << CPPConstructor.rdbuf() << endl;
}