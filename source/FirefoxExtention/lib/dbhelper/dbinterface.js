var dbConnection = null; // the database connection (global for now, hopefully wont be later)

console.log("Opened File");

exports.intilizeDatabase = function() {

	const {Cc, Ci} = require("chrome");
	// get a file in the users home directory
	const fileDirectoryService = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);

	const storageService = Cc["@mozilla.org/storage/service;1"].getService(Ci.mozIStorageService);


	// Components.utils.import("resource://gre/modules/Services.jsm");
	// Components.utils.import("resource://gre/modules/FileUtils.jsm");

	// var file = FileUtils.getFile("ProfD", ["uniquefilename1234.sqlite"]);
	// dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist

	// name the databse (I am pretty sure that .sqlite should be in the name)
	var databaseName = "dbpasscodes.sqlite";

	// no idea what this does but I think it adds a file that we are looking for
	// or use
	fileDirectoryService.append(databaseName);

	dbConnection = storageService.openDatabase(fileDirectoryService);

	//
	console.log("database probably created?");

	dbConnection.executeSimpleSQL("CREATE TABLE IF NOT EXISTS rules ( `id` int(11) NOT NULL, `domain` varchar(100) NOT NULL, `version` int(8) NOT NULL, `creationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `minlength` int(9) NOT NULL DEFAULT 0, `maxlength` int(9) NOT NULL DEFAULT 16, `restrictedcharacters` varchar(95) NOT NULL DEFAULT ``, `regex` varchar(200) NOT NULL DEFAULT `.*`, `parent` varchar(100) );");

    // setTimeout(,1);
	fillDatabase();
	console.log("Created table probably");

	// console.log("Inserted Dummy Row into table");

	// open keyvalue table
	// read version number

	// open other database
};



// it is possible that this function will not accept version number in the future
// and just return all results that match that version. A warning will be displayed
// stating that using a previous version of a password may be bad. User testing
// should be done on the best way to help users switch between versions when 
// there is a password change
// Returns a map of 
exports.getRule = function (domainName, versionNumber) {

	console.log("getting Rules");
	var statement;
	if (typeof versionNumber === 'undefined') {
		// create statement is used for things that need results
		// var statement = dbConn.createStatement("SELECT * FROM table_name WHERE domain = :domain and version in (SELECT max(version) from rules where domain = :domain");
		// statement.params.row_id = 1234;

		console.log("getting versionless rule");
		statement = dbConnection.createStatement("SELECT * FROM rules WHERE domain = :domain");
		statement.params.domain = domainName;


	}
	else {
		console.log("getting versioned rule");
		// create statement is used for things that need results
		statement = dbConnection.createStatement("SELECT * FROM rules WHERE domain = :domain and version = :version");
		statement.params.domain = domainName;
		statement.params.version = versionNumber;
	}

	while (statement.executeStep()) {
		var value = statement.row;
		console.log(value);
	}

	console.log("done getting rules");

	return {
		'domain':domainName,
		'versionNumber':versionNumber,
		'parent':'youtube',
		'restrictedcharacters':'abcdefghijklmnopqrstuvwxyz',
	};
};


function fillDatabase() {
	console.log("Beginning Database Fill");
	var j = 0;
	var fillChunk = function() {
		if (j >= 10 ) {
			console.log("Finishing Loading");
			return;
		}
		var massinsert = "INSERT INTO rules ( `id`, `domain`, `version`, `restrictedcharacters`, `regex`, `parent`) VALUES ";
		for (var i = 0; i < 200; i++) {
			if (i !== 0) massinsert += ","; // Add a comma to each set of values after the first
			massinsert += "(" + (j*100 + i) + ",'randomness',1,'abcdefghijklmnopqrstuvwxyz','(?=([^0-9]*[0-9]){2})^.*$','facebook')";
		}
		console.log("Rows J: " + j);

		simpleAsync(
			massinsert,
			null,
			function(object, code) {
				j++;
				fillChunk();
			}
		);
	};
	fillChunk();
	// dbConnection.executeSimpleSQL(massinsert);


	console.log("Ending database fill");
}



function simpleAsync(sql, binds, onSuccess, onFailure) {

	let queryResult = {};
	queryResult.data = [];
	queryResult.cols = 0;
	queryResult.rows = 0;

	let query = dbConnection.createStatement(sql);

	if (onFailure === null) {
		onFailure = onSuccess;
	}

	if (binds !== null) {
		for (var bind in binds) {
			query.params[bind] = binds[bind];
		}
	}

	query.executeAsync({
		handleResult: function(resultSet) {
			for (var row = resultSet.getNextRow(); row; row = resultSet.getNextRow()) {
				queryResult.cols = row.numEntries;
				let dataRow = new Array(queryResult.cols);
				for (var i = 0; i < queryResult.cols; i++) {
					dataRow[i] = row.getResultByIndex(i);
					console.log("dataRow[" + i + "] " + dataRow[i]);
				}
				queryResult.data[queryResult.rows] = dataRow;
				queryResult.rows++;
			}
		},
		handleError: function(error) {
			onFailure(null, error);
		},
		handleCompletion: function(reason) {
			onSuccess(queryResult, reason);
		}
	});
}



function clearDatabase() {
	// executeSimpleSQL is good for things that have no return values
	dbConn.executeSimpleSQL("DROP TABLE rules");
}


function closeDatabase() {
	mozIStorageConnection.close(); /// this value might actually be dbConn.close()    I am still learning this
}