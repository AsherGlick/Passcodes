/************************************ ABOUT ***********************************\
| This function class is responsible for reading the settings data from the    |
| internal settings database. It also has some functions for updating the      |
| rules inside the databse.                                                    |
\******************************************************************************/
#include <sqlite3.h>
#include <string>

/******************************* DOMAIN SETTINGS ******************************\
| The domain settings struct is a wrapper for the settings that are pulled     |
| out of the databse. This type of object is returned to the user when using   |
| the get settings command.                                                    |
\******************************************************************************/
struct DomainSettings {
    std::string domain;
    std::string allowedCharacters;
    uint maxCharacters;
    std::string regex;
};

/******************************** SETTINGS API ********************************\
| This class handles all the data to and from the database. It involves        |
| getting a single setting from the databsae as well as updating the database  |
| from the desired source                                                      |
\******************************************************************************/
class SettingsAPI {
  private:
    sqlite3 *database;  // What is the SQLite variable?
    void setSettings(DomainSettings);  // add a new setting to the databsae

    void getSettingsCallback(void *NotUsed, int argc, char **argv, char **azColName);
  public:
    SettingsAPI();
    bool isOpen();  // Check to see if the current database opened sucessfully
    DomainSettings getSetting(std::string domain);  // get the settings for a domain
    DomainSettings getSetting(std::string domain, int version);
    void disconnect();  // This might not be needed / this should be done in cleanup
};

/************************ SETTINGS API :: INITILIZATION ***********************\
| This function instanciates a connection to the sqlite databse. If the        |
| database is not found at the given file it will be created                   |
\******************************************************************************/
SettingsAPI::SettingsAPI() {
    // Create a connection to the internal database
    sqlite3 *database;
    int rc = sqlite3_open("/path/to/databse", &database);
    if (rc) {
        fprintf(stderr, "Can't open dataabse: %s\n", sqlite3_errmsg(database));
        // throw some sort of error
    }
}

/************************ SETTINGS API :: GET SETTINGS ************************\
| This function takes in a string and an integer. It gets a single set of      |
| settings for a domian. If the integer is specified then that version of the  |
| setting is returned. If the integer is zero then the newest version of the   |
| setting is obtained                                                          |
\******************************************************************************/
DomainSettings SettingsAPI::getSetting(std::string domain) { getSettings(domain, 0); }
DomainSettings SettingsAPI::getSetting(std::string domain, int version) {
    string rawSQL = "SELECT * FROM rules";

    // prepare statement
    sqlite3_stmt *statement;
    char * tailPointer;  // return value for the last
    int returnCode = sqlite3_prepare(this->database, rawSQL.c_str(), rawSQL.length(),  &statement, &tailPointer);
    if (returnCode) {
        fprintf(stderr, "Error with querry: %s\n", sqlite3_errmsg(this->database));
    }
    // finalize query
    sqlite3_finalize(statement);
}

