#ifndef __DOMAIN_SETTINGS_H__
#define __DOMAIN_SETTINGS_H__

class DomainSettings {
public:
    const string SQLCreateTable = [[SQLCREATETABLE]];
    const unsinged int columnCount = [[SQLCOLUMNCOUNT]];
    [[CPPVARIABLES]]

    
    DomainSettings( std::string domain ) {
        this->domain = domain;
        this->allowedCharacters = " !\"#$%&'()*+,-./1234567890:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"; // every typeable ascii character
        this->maxCharacters = 16;
        this->regex = ".*"; // Match anything
    }

    // Initilizer from SQL
    DomainSettings( sqlite3_stmt *statement ) {
        // do a quick check to make sure the database schema has not changed
        if (sqlite3_column_count(statement) != columnCount) { 
            fprintf(stderr, "The databse schema vseems to be incorrect, maybe this should be cheked\n");
            fprintf(stderr, "The version of the software or database may be out of date\n");
        }


        for (int i = 0; i < sqlite3_column_count(statement); i++) {
            [[CPPCONSTRUCTOR]]
        }
    }
};

#endif