#ifndef __DOMAIN_SETTINGS_H__
#define __DOMAIN_SETTINGS_H__

#include <string>

class DomainSettings {
  public:
    // static std::string SQLCreateTable = [[SQLCREATETABLE]];
    const static int columnCount = [[SQLCOLUMNCOUNT]];
    [[CPPVARIABLES]]

    explicit DomainSettings(std::string domain) {
        this->domain = domain;
        this->restrictedCharacters =""; 
         // = " !\"#$%&'()*+,-./1234567890:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"; // every typeable ascii character
        this->maxLength = 16;
        this->regex = ".*";  // Match anything
    }

    // Initilizer from SQL
    explicit DomainSettings(sqlite3_stmt *statement) {

        // do a quick check to make sure the database schema has not changed
        if (sqlite3_column_count(statement) != columnCount) {
            fprintf(stderr, "The databse schema vseems to be incorrect, maybe this should be cheked\n");
            fprintf(stderr, "The version of the software or database may be out of date\n");
        }

        for (int i = 0; i < sqlite3_column_count(statement); i++) {
            if (sqlite3_column_type(statement, i) == SQLITE_NULL) continue; // skip null values
            std::string columnName = std::string(reinterpret_cast<const char*> (sqlite3_column_name(statement, i)));
            [[CPPCONSTRUCTOR]]
        }
    }

    static std::string CreateTableSQL () {
        return [[SQLCREATETABLE]];
    }

    //" !\"#$%&'()*+,-./1234567890:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    std::string allowedCharacters() {
        char restrictedCharactersMask[95] = {0};
        for (char character : this->restrictedCharacters) {
            restrictedCharactersMask[character-32] = 1;
        }
        std::string allowedCharacters = "";
        for (int i = 0; i < 95; i++) {
            if (restrictedCharactersMask[i] == 0) {
                allowedCharacters += char(i+32);
            }
        }
        return allowedCharacters;
    }
};

#endif

// !\"#$%&'()*+,-./1234567890:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~