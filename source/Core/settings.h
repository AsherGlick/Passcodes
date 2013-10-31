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
class DomainSettings {
  public:
    std::string domain;
    std::string allowedCharacters;
    uint maxCharacters;
    std::string regex;

    // Default initilizer
    DomainSettings( std::string domain ) {
        this->domain = domain;
        this->allowedCharacters = " !\"#$%&'()*+,-./1234567890:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"; // every typeable ascii character
        this->maxCharacters = 16;
        this->regex = ".*"; // Match anything
    }

    // Full initilizer
    DomainSettings( std::string domain, std::string allowedCharacters, uint maxCharacters, std::string regex) {
        this->domain = domain;
        this->allowedCharacters = allowedCharacters;
        this->maxCharacters = maxCharacters;
        this->regex = regex;
    }
};

/******************************** SETTINGS API ********************************\
| This class handles all the data to and from the database. It involves        |
| getting a single setting from the databsae as well as updating the database  |
| from the desired source                                                      |
\******************************************************************************/
class SettingsAPI {
  private:
    sqlite3 *database;  // What is the SQLite variable?
    bool isOpened;
    DomainSettings SQLToSettings(sqlite3_stmt *statement);
  public:
    SettingsAPI();
    ~SettingsAPI();
    bool IsOpen();  // Check to see if the current database opened sucessfully
    DomainSettings GetSettings(std::string domain);  // get the settings for a domain
    DomainSettings GetSettings(std::string domain, int version);
    void Disconnect();  // This might not be needed / this should be done in cleanup
};

/************************ SETTINGS API :: INITILIZATION ***********************\
| This function instanciates a connection to the sqlite databse. If the        |
| database is not found at the given file it will be created                   |
\******************************************************************************/
SettingsAPI::SettingsAPI() {
    // Open the database 
    int rc = sqlite3_open_v2("./passworddatabse", &(this->database), SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE, NULL);
    if (rc) {
        this->isOpened = false;
    }
    else  {
        this->isOpened = true;
    }
}


// close the database on deconstruct
SettingsAPI::~SettingsAPI() {
    sqlite3_close(this->database);
}

/*************************** SETTINGS API :: IS OPEN **************************\
| This function is a quick check to see if the sqlite file is open or if some  |
| error has happened durring a previous step. The variable isOpened maintains  |
| the status of the file. There may be a better way to do this using the       |
| sqlite3 functions to check to see if the file is still active or not         |
\******************************************************************************/
bool SettingsAPI::IsOpen() {
    return (this->isOpened);
}

/************************ SETTINGS API :: GET SETTINGS ************************\
| This function takes in a string and an integer. It gets a single set of      |
| settings for a domian. If the integer is specified then that version of the  |
| setting is returned. If the integer is zero then the newest version of the   |
| setting is obtained                                                          |
\******************************************************************************/
DomainSettings SettingsAPI::GetSettings(std::string domain) { return GetSettings(domain, 0); }
DomainSettings SettingsAPI::GetSettings(std::string domain, int version) {
    std::string rawSQL = "SELECT domain, allowedCharacters, maxCharacters, regex FROM rules";

    if (version == 0) { 
        rawSQL = "SELECT domain, allowedCharacters, maxCharacters, regex FROM rules";
    }
    // prepare statement
    sqlite3_stmt *statement;
    const char *tailPointer;  // return value for the last
    int returnCode = sqlite3_prepare_v2(this->database, rawSQL.c_str(), rawSQL.length(),  &statement, &tailPointer);
    if (returnCode) {
        fprintf(stderr, "Error with qeurry: %s\n", sqlite3_errmsg(this->database));
        return (DomainSettings(domain));
    }

    // Get the results
    DomainSettings settings = SQLToSettings(statement);

    // finalize query
    sqlite3_finalize(statement);

    // Return the final settings object
    return settings;
}

/*********************** SETTINGS API :: SQL TO SETTINGS **********************\
| This function takes in a sql statement / row and sets the values of that     |
| row to a DomainSettings object. If the SQL querry or schema changes then     |
| this function will also need to be changed.                                  |
|                                                                              |    
| This function maybe should be moved to the DomainSettings variable, maybe    |
\******************************************************************************/
DomainSettings SettingsAPI::SQLToSettings(sqlite3_stmt *statement) {

    // do a quick check to make sure the database schema has not changed
    if (sqlite3_column_count(statement) != 4) { 
                fprintf(stderr, "The databse schema seems to be incorrect, maybe this should be cheked\n");
    }

    // Create the variables
    std::string domain;
    std::string allowedCharacters;
    uint maxCharacters;
    std::string regex;

    // Assign all the variables to the columns they corrispond to
    domain = std::string(reinterpret_cast<const char*> (sqlite3_column_text(statement, 0)));
    allowedCharacters = std::string(reinterpret_cast<const char*> (sqlite3_column_text (statement, 1)));
    maxCharacters = sqlite3_column_int (statement, 2);
    regex = std::string(reinterpret_cast<const char*> (sqlite3_column_text (statement, 3)));

    // return the generated settings object
    return DomainSettings(domain, allowedCharacters, maxCharacters, regex);
}
